const config = require('./config')
const logger = require('./logger')
const jwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')
const retry = require('async-retry')
const _ = require('lodash')
const UserService = require(`../service/UserService`)
const axios = require('axios')
const SmError = require('./error')

let client

const privilegeGetter = new Function("obj", "return obj?." + config.oauth.claims.privilegesChain + " || [];");

// express middleware to validate token
const validateToken = async function (req, res, next) {
    try {
        const tokenJWT = getBearerToken(req)
        if (tokenJWT) {
            const tokenObj = jwt.decode(tokenJWT, {complete: true})
            
            // Check if token uses insecure kid
            if (!config.oauth.allowInsecureTokens && config.oauth.insecureKids.includes(tokenObj.header.kid)) {
                throw new SmError.InsecureTokenError(`Insecure key ID (kid) found: ${tokenObj.header.kid}`)
            }
            
            let signingKey
            try {
                signingKey = await client.getSigningKey(tokenObj.header.kid)
            }
            catch (e) {
                if (e.name === 'SigningKeyNotFoundError') {
                    throw new SmError.SigningKeyNotFoundError(e.message)
                }
                let message = e.message
                if (e.errors?.length) {
                    message = e.errors[0].message
                }
                throw new SmError.OIDCProviderError(message)
            }
            
            try {
                jwt.verify(tokenJWT, signingKey.publicKey)
            }
            catch (e) {
                throw new SmError.AuthorizeError("Token verification failed")
            }
            
            req.access_token = tokenObj.payload
            req.bearer = tokenJWT
        }
        next()
    }
    catch (e) {
        next(e)
    }
}

// express middleware to setup user object, expects to be called after validateToken()
const setupUser = async function (req, res, next) {
    try {
        if (req.access_token) {
            // Get decoded JWT payload from request
            const tokenPayload = req.access_token
    
            // Get username from configured claims in token, or fall back through precedence list. 
            const usernamePrecedence = [config.oauth.claims.username, "preferred_username", config.oauth.claims.servicename, "azp", "client_id", "clientId"]
            const username = tokenPayload[usernamePrecedence.find(element => !!tokenPayload[element])]
            // If no username found, throw Privilege error
            if (username === undefined) {
                throw new SmError.PrivilegeError("No token claim mappable to username found")
            }
            
            const userObject = await UserService.getUserObject(username) ?? {username} 
            
            const refreshFields = {}
            let now = new Date().toUTCString()
            now = new Date(now).getTime()
            now = now / 1000 | 0 //https://stackoverflow.com/questions/7487977/using-bitwise-or-0-to-floor-a-number
    
            if (!userObject?.lastAccess || now - userObject?.lastAccess >= config.settings.lastAccessResolution) {
                refreshFields.lastAccess = now
            }
            if (!userObject?.lastClaims || tokenPayload[config.oauth.claims.assertion] !== userObject?.lastClaims?.[config.oauth.claims.assertion]) {
                refreshFields.lastClaims = JSON.stringify(tokenPayload)
            }
            if (refreshFields.lastAccess || refreshFields.lastClaims) {
                const userId = await UserService.setUserData(userObject, refreshFields)
                if (userId != userObject.userId) {
                    userObject.userId = userId.toString()
                }
            }

            // Get privileges and check elevate param  
            userObject.privileges = {
                create_collection: privilegeGetter(tokenPayload).includes('create_collection'),
                admin: privilegeGetter(tokenPayload).includes('admin')
            }

            if ('elevate' in req.query && (req.query.elevate === 'true' && !userObject.privileges.admin)) {
                throw new SmError.InvalidElevationError() 
            }

            req.userObject = userObject
        }
        next()
    }
    catch (e) {
        next(e)
    }
}

// express-openapi-validator security handler
const validateOauthSecurity = function (req, requiredScopes) {
    if (!req.access_token) {
        throw new SmError.NoTokenError() 
    }
    // Get decoded JWT payload from request
    const tokenPayload = req.access_token

    // Check scopes
    const grantedScopes = typeof tokenPayload[config.oauth.claims.scope] === 'string' ? 
        tokenPayload[config.oauth.claims.scope].split(' ') : 
        tokenPayload[config.oauth.claims.scope]
    const commonScopes = _.intersectionWith(grantedScopes, requiredScopes, function(gs, rs) {
        if (gs === rs) return gs
        let gsTokens = gs.split(":").filter(i => i.length)
        let rsTokens = rs.split(":").filter(i => i.length)
        if (gsTokens.length === 0) {
            return false
        }
        else {
            return gsTokens.every((t, i) => rsTokens[i] === t)
        }
    })
    if (commonScopes.length == 0) {
        throw new SmError.OutOfScopeError()
    }

    return true
}

// utility to extract bearer token from request
const getBearerToken = req => {
    if (!req.headers.authorization) return
    const headerParts = req.headers.authorization.split(' ')
    if (headerParts[0].toLowerCase() === 'bearer') return headerParts[1]
}

// Check if JWKS contains any insecure key IDs
const containsInsecureKids = (signingKeys) => {
    return signingKeys.some(key => config.oauth.insecureKids.includes(key.kid))
}

// setup the JWKS key handling client
const setupJwks = async function (jwksUri) {
    client = jwksClient({
        jwksUri,
        timeout: 5000,
        cacheMaxAge: 600000
    })
    // preflight request to JWKS endpoint. jwks-rsa library does NOT cache this response.
    const signingKeys = await client.getSigningKeys()
    
    // Check for insecure kids in the signing keys
    if (!config.oauth.allowInsecureTokens && containsInsecureKids(signingKeys)) {
        throw new Error('JWKS contains insecure key IDs and STIGMAN_DEV_ALLOW_INSECURE_TOKENS is false')
    }

    logger.writeDebug('oidc', 'discovery', { jwksUri, signingKeys })
}

let initAttempt = 0
/*
* setDepStatus is a function that sets the status of a dependency
*/
async function initializeAuth(setDepStatus) {
    const retries = 24
    const metadataUri = `${config.oauth.authority}/.well-known/openid-configuration`
    let jwksUri
    async function getJwks() {
        logger.writeDebug('oidc', 'discovery', { metadataUri, attempt: ++initAttempt })
        const openidConfig = (await axios.get(metadataUri)).data
        logger.writeDebug('oidc', 'discovery', { metadataUri, metadata: openidConfig})
        
        if (!openidConfig.jwks_uri) {
            throw( new Error('No jwks_uri property found') )
        }
        jwksUri = openidConfig.jwks_uri
        await setupJwks(jwksUri)
    }
    
    try {
        await retry(getJwks, {
            retries,
            factor: 1,
            minTimeout: 5 * 1000,
            maxTimeout: 5 * 1000,
            onRetry: (error) => {
                // Don't retry if the error is related to insecure kids
                if (error.message.includes('JWKS contains insecure key IDs')) {
                    throw error; // This will break out of the retry loop
                }
                logger.writeError('oidc', 'discovery', { success: false, metadataUri, message: error.message })
            }
        })
    } catch (error) {
        // If error is due to insecure kids, log it and don't set the dependency status to 'up'
        if (error.message.includes('JWKS contains insecure key IDs')) {
            logger.writeError('oidc', 'discovery', { 
                success: false, 
                metadataUri,
                jwksUri,
                message: error.message,
                allowInsecureTokens: config.oauth.allowInsecureTokens
            })
            return;
        }
        // For other errors, just re-throw
        throw error;
    }

    logger.writeInfo('oidc', 'discovery', { success: true, metadataUri, jwksUri })
    setDepStatus('auth', 'up')
}

module.exports = {validateToken, setupUser, validateOauthSecurity, initializeAuth, privilegeGetter}