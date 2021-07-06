'use strict';

const writer = require('../utils/writer.js')
const Parsers = require('../utils/parsers.js')
const config = require('../utils/config')
const Review = require(`../service/${config.database.type}/ReviewService`)

module.exports.postReviewsByAsset = async function postReviewsByAsset (req, res, next) {
  try {
    let collectionId = req.swagger.params['collectionId']
    let assetId = req.swagger.params['assetId']
    let reviewsRequested = req.swagger.params['body']

    const collectionGrant = req.userObject.collectionGrants.find( g => g.collection.collectionId === collectionId )
    if ( collectionGrant || req.userObject.privileges.globalAccess ) {
      //Check each reviewed rule against grants and stig assignments
      const userRules = await Review.getRulesByAssetUser( assetId, req.userObject )
      const permitted = [], rejected = []
      let errors
      for (const review of reviewsRequested) {
        if (userRules.has(review.ruleId)) {
          permitted.push(review)
        }
        else {
          rejected.push(review)
        }
      }
      if (permitted.length > 0) {
         errors = await Review.putReviewsByAsset(assetId, permitted, req.userObject)
      }
      writer.writeJson(res, {
        permitted,
        rejected,
        errors
      })
    }
    else {
      throw (writer.respondWithCode ( 403, {message: "User has insufficient privilege to complete this request."} ) )
    }
  }
  catch(err) {
    writer.writeJson(res, err)
  }
}

module.exports.deleteReviewByAssetRule = async function deleteReviewByAssetRule (req, res, next) {
try {
    let collectionId = req.swagger.params['collectionId']
    let assetId = req.swagger.params['assetId']
    let ruleId = req.swagger.params['ruleId']
    let projection = req.swagger.params['projection']
    const collectionGrant = req.userObject.collectionGrants.find( g => g.collection.collectionId === collectionId )
    if ( collectionGrant || req.userObject.privileges.globalAccess ) {
      const userHasRule = await Review.checkRuleByAssetUser( ruleId, assetId, req.userObject )
      if (userHasRule) {
        let response = await Review.deleteReviewByAssetRule(assetId, ruleId, projection, req.userObject)
        writer.writeJson(res, response)
      }
      else {
        throw (writer.respondWithCode ( 403, {message: "User has insufficient privilege to delete the review of this rule."} ) )
      }
      }
    else {
      throw (writer.respondWithCode ( 403, {message: "User has insufficient privilege to complete this request."} ) )
    }
  }
  catch(err) {
    writer.writeJson(res, err)
  }
}

module.exports.exportReviews = async function exportReviews (projection, userObject) {
  try {
    return await Review.getReviews(projection, {}, userObject )
  }
  catch (err) {
    throw (err)
  }
} 

module.exports.getReviewByAssetRule = async function (req, res, next) {
  try {
    let collectionId = req.swagger.params['collectionId']
    let assetId = req.swagger.params['assetId']
    let ruleId = req.swagger.params['ruleId']
    let projection = req.swagger.params['projection']
    const collectionGrant = req.userObject.collectionGrants.find( g => g.collection.collectionId === collectionId )
    if ( collectionGrant || req.userObject.privileges.globalAccess ) {
      let response = await Review.getReviews( projection, {
        collectionId: collectionId,
        assetId: assetId,
        ruleId: ruleId
      }, req.userObject)
      writer.writeJson(res, response[0])
    }
    else {
      throw (writer.respondWithCode ( 403, {message: "User has insufficient privilege to complete this request."} ) )
    }
  }
  catch(err) {
    writer.writeJson(res, err)
  }
}

module.exports.getReviewsByCollection = async function getReviewsByCollection (req, res, next) {
  try {
    let projection = req.swagger.params['projection']
    let collectionId = req.swagger.params['collectionId']
    const collectionGrant = req.userObject.collectionGrants.find( g => g.collection.collectionId === collectionId )
    if ( collectionGrant || req.userObject.privileges.globalAccess ) {
      let response = await Review.getReviews( projection, {
        collectionId: collectionId,
        result: req.swagger.params['result'],
        action: req.swagger.params['action'],
        status: req.swagger.params['status'],
        rules: req.swagger.params['rules'] || 'current-mapped',
        ruleId: req.swagger.params['ruleId'],
        groupId: req.swagger.params['groupId'],
        cci: req.swagger.params['cci'],
        userId: req.swagger.params['userId'],
        assetId: req.swagger.params['assetId'],
        benchmarkId: req.swagger.params['benchmarkId']
      }, req.userObject)
      writer.writeJson(res, response)
    }
    else {
      throw (writer.respondWithCode ( 403, {message: "User has insufficient privilege to complete this request."} ) )
    }
  }
  catch(err) {
    writer.writeJson(res, err)
  }
}

module.exports.getReviewsByAsset = async function (req, res, next) {
  try {
    let collectionId = req.swagger.params['collectionId']
    let assetId = req.swagger.params['assetId']
    let projection = req.swagger.params['projection']
    const collectionGrant = req.userObject.collectionGrants.find( g => g.collection.collectionId === collectionId )
    if ( collectionGrant || req.userObject.privileges.globalAccess ) {
      let response = await Review.getReviews( projection, {
        collectionId: collectionId,
        assetId: assetId,
        rules: req.swagger.params['rules'] || 'current-mapped',
        result: req.swagger.params['result'],
        action: req.swagger.params['action'],
        status: req.swagger.params['status'],
        benchmarkId: req.swagger.params['benchmarkId']
      }, req.userObject )
      writer.writeJson(res, response)
    }
    else {
      throw (writer.respondWithCode ( 403, {message: "User has insufficient privilege to complete this request."} ) )
    }
  }
  catch(err) {
    writer.writeJson(res, err)
  }
}

module.exports.putReviewByAssetRule = async function (req, res, next) {
  try {
    let collectionId = req.swagger.params['collectionId']
    let assetId = req.swagger.params['assetId']
    let ruleId = req.swagger.params['ruleId']
    let body = req.swagger.params['body']
    let projection = req.swagger.params['projection']
    const collectionGrant = req.userObject.collectionGrants.find( g => g.collection.collectionId === collectionId )
    if ( collectionGrant || req.userObject.privileges.globalAccess ) {
      const userHasRule = await Review.checkRuleByAssetUser( ruleId, assetId, req.userObject )
      if (userHasRule) {
        let response = await Review.putReviewByAssetRule( projection, assetId, ruleId, body, req.userObject)
        if (response.status === 'created') {
          writer.writeJson(res, response.row, 201)
        } else {
          writer.writeJson(res, response.row )
        }
      }
      else {
        throw ( writer.respondWithCode ( 403, {message: "User has insufficient privilege to put a review of this rule."} ) )
      }
    }
    else {
      throw (writer.respondWithCode ( 403, {message: "User has insufficient privilege to complete this request."} ) )
    }
  }
  catch (err) {
    writer.writeJson(res, err)
  }  
}

module.exports.patchReviewByAssetRule = async function (req, res, next) {
  try {
    let collectionId = req.swagger.params['collectionId']
    let assetId = req.swagger.params['assetId']
    let ruleId = req.swagger.params['ruleId']
    let body = req.swagger.params['body']
    let projection = req.swagger.params['projection']
    const collectionGrant = req.userObject.collectionGrants.find( g => g.collection.collectionId === collectionId )
    if ( collectionGrant || req.userObject.privileges.globalAccess ) {
      const userHasRule = await Review.checkRuleByAssetUser( ruleId, assetId, req.userObject )
      if (userHasRule) {
        let response = await Review.patchReviewByAssetRule( projection, assetId, ruleId, body, req.userObject)
        writer.writeJson(res, response )
      }
      else {
        throw ( writer.respondWithCode ( 403, {message: "User has insufficient privilege to patch the review of this rule."} ) )
      }
    }
    else {
      throw (writer.respondWithCode ( 403, {message: "User has insufficient privilege to complete this request."} ) )
    }
  }
  catch (err) {
    writer.writeJson(res, err)
  }  
}