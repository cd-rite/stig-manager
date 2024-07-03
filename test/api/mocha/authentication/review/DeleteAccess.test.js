const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const reviewEnv = require('../../reviewEnv.json')
const usersEnv = require('../../data/asset/users.json')


describe('Access Control Testing Review deletes ', () => {

  before(async function () {
      this.timeout(4000)
      await utils.loadAppData()
      await utils.uploadTestStigs()
  })
    
  describe('DELETE - deleteReviewByAssetRule - /collections/{collectionId}/reviews/{assetId}/{ruleId}', () => {

    beforeEach(async function () {
      this.timeout(4000)
      await utils.loadAppData()
      await utils.uploadTestStigs()
    })
    const usersNamesToTest = ["admin", "lvl1"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as User ${user.name}`, () => {
        it('Delete a Review from an asset rule etc all users have access too ', async () => {
          const res = await chai.request(config.baseUrl)
            .delete(`/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAsset.assetId}/${reviewEnv.testCollection.ruleId}?projection=rule&projection=history&projection=stigs`)
            .set('Authorization', `Bearer ${user.token}`)
          
          expect(res).to.have.status(200)
        })
        it('Delete a Review from an asset rule lvl1 cannot access', async () => {
          const res = await chai.request(config.baseUrl)
            .delete(`/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAssetlvl1NoAccess.assetId}/${reviewEnv.testCollection.ruleId}?projection=rule&projection=history&projection=stigs`)
            .set('Authorization', `Bearer ${user.token}`)
          if(user.name === "lvl1"){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          
        })
      })
    }
  })

  describe('DELETE - deleteReviewMetadataKey - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata/keys/{key}', () => {

    before(async function () {
      this.timeout(4000)
      await utils.loadAppData()
      await utils.uploadTestStigs()
      await utils.createDisabledCollectionsandAssets()
    })
    const usersNamesToTest = ["admin", "lvl1"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as User ${user.name}`, () => {
        it('Delete one metadata key/value of a Review asset rule access for all users', async () => {
          const res = await chai.request(config.baseUrl)
            .delete(`/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAsset.assetId}/${reviewEnv.testCollection.ruleId}/metadata/keys/${reviewEnv.testCollection.metadataKey}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(`${JSON.stringify(reviewEnv.testCollection.metadataValue)}`)
          expect(res).to.have.status(204)
        })
        it('Delete one metadata key/value of a Review asset rule no access for lvl1', async () => {
          const res = await chai.request(config.baseUrl)
            .delete(`/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAssetlvl1NoAccess.assetId}/${reviewEnv.testCollection.ruleId}/metadata/keys/${reviewEnv.testCollection.metadataKey}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(`${JSON.stringify(reviewEnv.testCollection.metadataValue)}`)

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

