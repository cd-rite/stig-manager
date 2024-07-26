const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const enviornment = require('../../enviornment.json')

const user =
  {
    "name": "stigmanadmin",
    "grant": "Owner",
    "token":
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ2ODEwMzUsImlhdCI6MTY3MDU0MDIzNiwiYXV0aF90aW1lIjoxNjcwNTQwMjM1LCJqdGkiOiI0N2Y5YWE3ZC1iYWM0LTQwOTgtOWJlOC1hY2U3NTUxM2FhN2YiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJiN2M3OGE2Mi1iODRmLTQ1NzgtYTk4My0yZWJjNjZmZDllZmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjMzNzhkYWZmLTA0MDQtNDNiMy1iNGFiLWVlMzFmZjczNDBhYyIsInNlc3Npb25fc3RhdGUiOiI4NzM2NWIzMy0yYzc2LTRiM2MtODQ4NS1mYmE1ZGJmZjRiOWYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImNyZWF0ZV9jb2xsZWN0aW9uIiwiZGVmYXVsdC1yb2xlcy1zdGlnbWFuIiwiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb24gc3RpZy1tYW5hZ2VyOnN0aWc6cmVhZCBzdGlnLW1hbmFnZXI6dXNlcjpyZWFkIHN0aWctbWFuYWdlcjpvcCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbjpyZWFkIHN0aWctbWFuYWdlcjpvcDpyZWFkIHN0aWctbWFuYWdlcjp1c2VyIHN0aWctbWFuYWdlciBzdGlnLW1hbmFnZXI6c3RpZyIsInNpZCI6Ijg3MzY1YjMzLTJjNzYtNGIzYy04NDg1LWZiYTVkYmZmNGI5ZiIsIm5hbWUiOiJTVElHTUFOIEFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3RpZ21hbmFkbWluIiwiZ2l2ZW5fbmFtZSI6IlNUSUdNQU4iLCJmYW1pbHlfbmFtZSI6IkFkbWluIn0.a1XwJZw_FIzwMXKo-Dr-n11me5ut-SF9ni7ylX-7t7AVrH1eAqyBxX9DXaxFK0xs6YOhoPsh9NyW8UFVaYgtF68Ps6yzoiqFEeiRXkpN5ygICN3H3z6r-YwanLlEeaYR3P2EtHRcrBtCnt0VEKKbGPWOfeiNCVe3etlp9-NQo44"
  }
  

describe('Review patch tests using "admin" user ', () => {

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
    
    it('PATCH Review with new details, expect status to remain', async () => {
      const res = await chai.request(config.baseUrl)
        .patch(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}/${'SV-106181r1_rule'}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({detail:"these details have changed, but the status remains"})
      
      expect(res).to.have.status(200)
      expect(res.body.status).to.have.property('label').that.equals('submitted')
    })
    it('PATCH Review with new result, expect status to reset to saved', async () => {
        const res = await chai.request(config.baseUrl)
          .patch(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}/${'SV-106181r1_rule'}`)
          .set('Authorization', `Bearer ${user.token}`)
          .send({result: "pass"})
        
        expect(res).to.have.status(200)
        expect(res.body.result).to.eql("pass")
        expect(res.body.status).to.have.property('label').that.equals('saved')
    })
    it('PATCH Review to submitted status', async () => {
        const res = await chai.request(config.baseUrl)
          .patch(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}/${'SV-106181r1_rule'}`)
          .set('Authorization', `Bearer ${user.token}`)
          .send({status: "submitted"})
        
        expect(res).to.have.status(200)
        expect(res.body.status).to.have.property('label').that.equals('submitted')
    })
    it('PATCH Review patched and no longer meets Collection Requirements', async () => {
        const res = await chai.request(config.baseUrl)
          .patch(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}/${'SV-106181r1_rule'}`)
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
            `/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}/${enviornment.testCollection.ruleId}`
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
          `/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}/${enviornment.testCollection.ruleId}`
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
        .patch(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}/${enviornment.testCollection.ruleId}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({status: "accepted"})
      
      expect(res).to.have.status(200)
      expect(res.body).to.have.property("touchTs").to.eql(res.body.status.ts)
      expect(res.body.status).to.have.property("ts").to.not.eql(res.body.ts)        
    })
    it('Merge provided properties with a Review', async () => {
      const res = await chai
        .request(config.baseUrl)
        .patch(
          `/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}/${enviornment.testCollection.ruleId}`)
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
        .patch(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}/${enviornment.testCollection.ruleId}/metadata`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({[enviornment.testCollection.metadataKey]: enviornment.testCollection.metadataValue})
 
      expect(res).to.have.status(200)
      expect(res.body).to.eql({[enviornment.testCollection.metadataKey]: enviornment.testCollection.metadataValue})
    
    })
  })
})

