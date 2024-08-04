const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const users = require('../../iterations.json')


describe('PATCH - Review', () => {

  before(async function () {
      this.timeout(4000)
      await utils.loadAppData()
      await utils.uploadTestStigs()
  })
  
  for(const user of users) {
    describe(`user:${user.name}`, () => {
      describe('PATCH - patchReviewByAssetRule - /collections/{collectionId}/reviews/{assetId}/{ruleId}', () => {

        beforeEach(async function () {
          this.timeout(4000)
          await utils.loadAppData()
          await utils.uploadTestStigs()
        })
        
        it('PATCH Review with new details, expect status to remain', async () => {
          const res = await chai.request(config.baseUrl)
            .patch(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${'SV-106181r1_rule'}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send({detail:"these details have changed, but the status remains"})
          
          expect(res).to.have.status(200)
          expect(res.body.status).to.have.property('label').that.equals('submitted')
        })
        it('PATCH Review with new result, expect status to reset to saved', async () => {
            const res = await chai.request(config.baseUrl)
              .patch(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${'SV-106181r1_rule'}`)
              .set('Authorization', `Bearer ${user.token}`)
              .send({result: "pass"})
            
            expect(res).to.have.status(200)
            expect(res.body.result).to.eql("pass")
            expect(res.body.status).to.have.property('label').that.equals('saved')
        })
        it('PATCH Review to submitted status', async () => {
            const res = await chai.request(config.baseUrl)
              .patch(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${'SV-106181r1_rule'}`)
              .set('Authorization', `Bearer ${user.token}`)
              .send({status: "submitted"})
            
            expect(res).to.have.status(200)
            expect(res.body.status).to.have.property('label').that.equals('submitted')
        })
        it('PATCH Review patched and no longer meets Collection Requirements', async () => {
            const res = await chai.request(config.baseUrl)
              .patch(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${'SV-106181r1_rule'}`)
              .set('Authorization', `Bearer ${user.token}`)
              .send({result: "fail"})
            
            expect(res).to.have.status(200)
            expect(res.body.result).to.eql("fail")
            expect(res.body.status).to.have.property('label').that.equals('saved')
        })
        it('resultEngine only - expect fail', async () => {
            const res = await chai
              .request(config.baseUrl)
              .patch(
                `/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}`
              )
              .set("Authorization", `Bearer ${user.token}`)
              .send({
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
            
            expect(res).to.have.status(422)
        })
        it('resultEngine only - expect success', async () => {
          const res = await chai
            .request(config.baseUrl)
            .patch(
              `/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}`
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
          expect(res.body.result).to.eql("pass")
          expect(res.body.touchTs).to.eql(res.body.ts)
          expect(res.body.status).to.have.property("ts").to.not.eql(res.body.ts)
        })
        it('PATCH Review to Accepted', async () => {
          const res = await chai.request(config.baseUrl)
            .patch(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send({status: "accepted"})
          
          if(user.name === "lvl1" || user.name === "lvl2") {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.have.property("touchTs").to.eql(res.body.status.ts)
          expect(res.body.status).to.have.property("ts").to.not.eql(res.body.ts)        
        })
        it('Merge provided properties with a Review', async () => {
          const res = await chai
            .request(config.baseUrl)
            .patch(
              `/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send({
              result: "pass",
              detail: "test\nvisible to lvl1",
              comment: "sure",
              status: "submitted",
            })
          expect(res).to.have.status(200)
          expect(res.body.status.label).to.eql("submitted")    
          expect(res.body.result).to.eql("pass")
          expect(res.body.detail).to.eql("test\nvisible to lvl1")
          expect(res.body.comment).to.eql("sure")
        })
      })

      describe('PATCH - patchReviewMetadata - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata', () => {

        before(async function () {
          this.timeout(4000)
          await utils.loadAppData()
          await utils.uploadTestStigs()
          await utils.createDisabledCollectionsandAssets()
        })

        it('Merge metadata property/value into a Review', async () => {
          const res = await chai.request(config.baseUrl)
            .patch(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}/metadata`)
            .set('Authorization', `Bearer ${user.token}`)
            .send({[environment.testCollection.metadataKey]: environment.testCollection.metadataValue})
    
          expect(res).to.have.status(200)
          expect(res.body).to.eql({[environment.testCollection.metadataKey]: environment.testCollection.metadataValue})
        
        })
      })
    })
  }
})

