const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const enviornment = require('../../enviornment.json')
const usersEnv = require('../../users.json')

describe('Access Control Testing Review gets', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  describe('GET - getReviewsByCollection - /collections/{collectionId}/reviews', () => {
    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as User ${user.name}`, () => {

        it('Return a list of reviews accessible to the requester', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/reviews?projection=rule&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)
          expect(res).to.have.status(200)
        })
      })
    }
  })
  describe('GET - getReviewsByAsset - /collections/{collectionId}/reviews/{assetId}', () => {
    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as User ${user.name}`, () => {

        it('Return a list of Reviews for an Asset', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}?projection=rule&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)
          expect(res).to.have.status(200)
        })
      })
    }
  })
  describe('GET - getReviewByAssetRule - /collections/{collectionId}/reviews/{assetId}/{ruleId}', () => {
    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as User ${user.name}`, () => {
        it('Return the Review for an Asset and Rule', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}/${enviornment.testCollection.ruleId}?projection=rule&projection=stigs&projection=metadata&projection=history`)
            .set('Authorization', `Bearer ${user.token}`)
          expect(res).to.have.status(200)
        })
      })
    }
  })
  describe('GET - getReviewMetadata - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata', () => {

    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as User ${user.name}`, () => {
        it('Return the metadata for a Review', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}/${enviornment.testCollection.ruleId}/metadata`)
            .set('Authorization', `Bearer ${user.token}`)
          expect(res).to.have.status(200)
         
        })
      })
    }
  })
  describe('GET - getReviewMetadataKeys - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata/keys', () => {
      
    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as User ${user.name}`, () => {
        it('Return the Review Metadata KEYS for an Asset and Rule', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}/${enviornment.testCollection.ruleId}/metadata/keys`)
            .set('Authorization', `Bearer ${user.token}`)
          expect(res).to.have.status(200)
          
        })
      })
    }
  })

  describe('GET - getReviewMetadataValue - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata/keys/{key}', () => {

    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as User ${user.name}`, () => {
        it('Return the Review Metadata VALUE for an Asset/Rule/metadata KEY', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}/${enviornment.testCollection.ruleId}/metadata/keys/${enviornment.testAsset.metadataKey}`)
            .set('Authorization', `Bearer ${user.token}`)
          expect(res).to.have.status(200)
       
        })
      })
    }
  })
})

