const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const usersEnv = require('../../iterations.json')

describe('Access Control Testing Review puts', () => {

    let deletedCollection, deletedAsset
    beforeEach(async function () {
        this.timeout(4000)
        await utils.loadAppData()
        await utils.uploadTestStigs()
        const deletedItems = await utils.createDisabledCollectionsandAssets()
        deletedCollection = deletedItems.collection
        deletedAsset = deletedItems.asset
    })


    describe('PUT - putReviewByAssetRule - /collections/{collectionId}/reviews/{assetId}/{ruleId}', () => {
        const usersNamesToTest = ["admin", "lvl1"]
        const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

        for (let user of users) {
            describe(`Testing as User ${user.name}`, () => {
      
                it('Set properties of a Review ', async () => {

                    const putBody = {
                        "autoResult": true,
                        "comment": "comment",
                        "detail": "detail",
                        "metadata": {
                        "additionalProp1": "string",
                        
                        },
                        "result": "fail",
                        "resultEngine": {
                        "checkContent": {
                            "component": "string",
                            "location": "string"
                        },
                        "overrides": [
                            {
                            "authority": "string",
                            "newResult": "fail",
                            "oldResult": "fail",
                            "remark": "string",
                            "time": "2024-06-05T17:01:07.162Z"
                            }
                        ],
                        "product": "string",
                        "time": "2024-06-05T17:01:07.162Z",
                        "type": "scap",
                        "version": "string"
                        },
                        "status": "saved"
                    }
                    
                    const res = await chai.request(config.baseUrl)
                    .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}?projection=rule&projection=history&projection=stigs&projection=metadata`)
                    .set('Authorization', `Bearer ${user.token}`)
                    .send(putBody)

                    expect(res).to.have.status(200)
                })

                it('Set properties of a Review user lvl1 no access ', async () => {

                    const putBody = {
                        "autoResult": true,
                        "comment": "comment",
                        "detail": "detail",
                        "metadata": {
                        "additionalProp1": "string",
                        
                        },
                        "result": "fail",
                        "resultEngine": {
                        "checkContent": {
                            "component": "string",
                            "location": "string"
                        },
                        "overrides": [
                            {
                            "authority": "string",
                            "newResult": "fail",
                            "oldResult": "fail",
                            "remark": "string",
                            "time": "2024-06-05T17:01:07.162Z"
                            }
                        ],
                        "product": "string",
                        "time": "2024-06-05T17:01:07.162Z",
                        "type": "scap",
                        "version": "string"
                        },
                        "status": "saved"
                    }
                    
                    const res = await chai.request(config.baseUrl)
                    .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAssetlvl1NoAccess.assetId}/${environment.testCollection.ruleId}?projection=rule&projection=history&projection=stigs&projection=metadata`)
                    .set('Authorization', `Bearer ${user.token}`)
                    .send(putBody)

                    if(user.name === "lvl1"){
                        expect(res).to.have.status(403)
                        return
                    }

                    expect(res).to.have.status(200)
                })
            })
        }
    })

  describe('PUT - putReviewMetadata - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata', () => {

    before(async function () {
      this.timeout(4000)
      await utils.loadAppData()
      await utils.uploadTestStigs()
      await utils.createDisabledCollectionsandAssets()
    })
    const usersNamesToTest = ["admin" ,"lvl1"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
        describe(`Testing as User ${user.name}`, () => {
            it('Set all metadata of a Review', async () => {
                const res = await chai.request(config.baseUrl)
                    .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}/metadata`)
                    .set('Authorization', `Bearer ${user.token}`)
                    .send({[environment.testCollection.metadataKey]: environment.testCollection.metadataValue})
            
                expect(res).to.have.status(200)
            })
            it('Set all metadata of a Review LVL1 no access', async () => {
                const res = await chai.request(config.baseUrl)
                    .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAssetlvl1NoAccess.assetId}/${environment.testCollection.ruleId}/metadata`)
                    .set('Authorization', `Bearer ${user.token}`)
                    .send({[environment.testCollection.metadataKey]: environment.testCollection.metadataValue})
            
                if(user.name === "lvl1"){
                    expect(res).to.have.status(403)
                    return
                }
                expect(res).to.have.status(200)
            })
        })
    }
  })

  describe('PUT - putReviewMetadataValue - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata/keys/{key}', () => {

    before(async function () {
      this.timeout(4000)
      await utils.loadAppData()
      await utils.uploadTestStigs()
      await utils.createDisabledCollectionsandAssets()
    })
    const usersNamesToTest = ["admin" ,"lvl1"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
        describe(`Testing as User ${user.name}`, () => {
            it('Set one metadata key/value of a Review', async () => {
                const res = await chai.request(config.baseUrl)
                    .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}/metadata/keys/${environment.testCollection.metadataKey}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    .set('Content-Type', 'application/json') 
                    .send(`${JSON.stringify(environment.testCollection.metadataValue)}`)
            
                expect(res).to.have.status(204)
            })
            it('Set one metadata key/value of a Review LVL1 no access', async () => {
                const res = await chai.request(config.baseUrl)
                    .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAssetlvl1NoAccess.assetId}/${environment.testCollection.ruleId}/metadata/keys/${environment.testCollection.metadataKey}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    .set('Content-Type', 'application/json') 
                    .send(`${JSON.stringify(environment.testCollection.metadataValue)}`)
            
                if(user.name === "lvl1"){
                    expect(res).to.have.status(403)
                    return
                }
                expect(res).to.have.status(204)
            })
        })
    }
  })
})

