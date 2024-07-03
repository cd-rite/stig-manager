const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const reviewEnv = require('../../reviewEnv.json')
const xml2js = require('xml2js');
const usersEnv = require('../../data/asset/users.json')

describe('Access Control Testing Review patch ', () => {

    before(async function () {
        this.timeout(4000)
        await utils.loadAppData()
        await utils.uploadTestStigs()
    })
    
  describe('PATCH - patchReviewByAssetRule - /collections/{collectionId}/reviews/{assetId}/{ruleId}', () => {

    beforeEach(async function () {
      this.timeout(4000)
      await utils.loadAppData()
      await utils.uploadTestStigs()
  })
    
    const usersNamesToTest = ["admin", "lvl2","lvl3" ,"lvl1"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as User ${user.name}`, () => {
        
        it('resultEngine patch - expect fail for lvl1 that user doesnt have access to that assetrule', async () => {
          const res = await chai
            .request(config.baseUrl)
            .patch(
              `/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAssetlvl1NoAccess.assetId}/${reviewEnv.testCollection.ruleId}`
            )
            .set("Authorization", `Bearer ${user.token}`)
            .send({
              result: "pass",
              resultEngine: {
                type: "script",
                product: "Evaluate-STIG",
                version: "1.2310.1",
                time: "2023-12-11T12:56:14.3576272-05:00",
                checkContent: {
                  location: "VPN_Checks:1.2023.7.24",
                },
                overrides: [
                  {
                    authority: "Some_AnswerFile.xml",
                    oldResult: "unknown",
                    newResult: "pass",
                    remark: "Evaluate-STIG Answer File",
                  },
                ],
              },
            })
          
            if(user.name === "lvl1"){
              expect(res).to.have.status(404)
              return
            }
            expect(res).to.have.status(200)
        })
        it('resultEngine patch - expect success for all users', async () => {
          const res = await chai
            .request(config.baseUrl)
            .patch(
              `/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAsset.assetId}/${reviewEnv.testCollection.ruleId}`
            )
            .set("Authorization", `Bearer ${user.token}`)
            .send({
              result: "pass",
              resultEngine: {
                type: "script",
                product: "Evaluate-STIG",
                version: "1.2310.1",
                time: "2023-12-11T12:56:14.3576272-05:00",
                checkContent: {
                  location: "VPN_Checks:1.2023.7.24",
                },
                overrides: [
                  {
                    authority: "Some_AnswerFile.xml",
                    oldResult: "unknown",
                    newResult: "pass",
                    remark: "Evaluate-STIG Answer File",
                  },
                ],
              },
            })
          
          expect(res).to.have.status(200)
    
        })
        it('PATCH Review to Accepted should only work for admin and lvl3(manage)', async () => {
          const res = await chai.request(config.baseUrl)
            .patch(`/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAsset.assetId}/${reviewEnv.testCollection.ruleId}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send({status: "accepted"})
          
          if(user.name === "lvl1" || user.name === "lvl2"){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
        })
      })
    }
  })

  describe('PATCH - patchReviewMetadata - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata', () => {

    before(async function () {
      this.timeout(4000)
      await utils.loadAppData()
      await utils.uploadTestStigs()
      await utils.createDisabledCollectionsandAssets()
    })

    const usersNamesToTest = ["admin", "lvl2","lvl3" ,"lvl1"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as User ${user.name}`, () => {
        it('Merge metadata property/value into a Review', async () => {
          const res = await chai.request(config.baseUrl)
            .put(`/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAsset.assetId}/${reviewEnv.testCollection.ruleId}/metadata`)
            .set('Authorization', `Bearer ${user.token}`)
            .send({[reviewEnv.testCollection.metadataKey]: reviewEnv.testCollection.metadataValue})
    
          expect(res).to.have.status(200)
        })
        it('Merge metadata property/value into a Review asset not availble to lvl1', async () => {
          const res = await chai.request(config.baseUrl)
            .put(`/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAssetlvl1NoAccess.assetId}/${reviewEnv.testCollection.ruleId}/metadata`)
            .set('Authorization', `Bearer ${user.token}`)
            .send({[reviewEnv.testCollection.metadataKey]: reviewEnv.testCollection.metadataValue})
    
          if(user.name === "lvl1"){ 
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
        })
      })
    }
  })
})

