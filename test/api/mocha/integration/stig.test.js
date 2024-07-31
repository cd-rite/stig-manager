const chai = require("chai")
const chaiHttp = require("chai-http")
chai.use(chaiHttp)
const expect = chai.expect
const fs = require("fs")
const path = require("path")
const config = require("../testConfig.json")
const utils = require("../utils/testUtils")
const environment = require("../environment.json")

const user = {
  name: "stigmanadmin",
  grant: "Owner",
  userId: "1",
  token:
    "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ2ODEwMzUsImlhdCI6MTY3MDU0MDIzNiwiYXV0aF90aW1lIjoxNjcwNTQwMjM1LCJqdGkiOiI0N2Y5YWE3ZC1iYWM0LTQwOTgtOWJlOC1hY2U3NTUxM2FhN2YiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJiN2M3OGE2Mi1iODRmLTQ1NzgtYTk4My0yZWJjNjZmZDllZmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjMzNzhkYWZmLTA0MDQtNDNiMy1iNGFiLWVlMzFmZjczNDBhYyIsInNlc3Npb25fc3RhdGUiOiI4NzM2NWIzMy0yYzc2LTRiM2MtODQ4NS1mYmE1ZGJmZjRiOWYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImNyZWF0ZV9jb2xsZWN0aW9uIiwiZGVmYXVsdC1yb2xlcy1zdGlnbWFuIiwiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb24gc3RpZy1tYW5hZ2VyOnN0aWc6cmVhZCBzdGlnLW1hbmFnZXI6dXNlcjpyZWFkIHN0aWctbWFuYWdlcjpvcCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbjpyZWFkIHN0aWctbWFuYWdlcjpvcDpyZWFkIHN0aWctbWFuYWdlcjp1c2VyIHN0aWctbWFuYWdlciBzdGlnLW1hbmFnZXI6c3RpZyIsInNpZCI6Ijg3MzY1YjMzLTJjNzYtNGIzYy04NDg1LWZiYTVkYmZmNGI5ZiIsIm5hbWUiOiJTVElHTUFOIEFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3RpZ21hbmFkbWluIiwiZ2l2ZW5fbmFtZSI6IlNUSUdNQU4iLCJmYW1pbHlfbmFtZSI6IkFkbWluIn0.a1XwJZw_FIzwMXKo-Dr-n11me5ut-SF9ni7ylX-7t7AVrH1eAqyBxX9DXaxFK0xs6YOhoPsh9NyW8UFVaYgtF68Ps6yzoiqFEeiRXkpN5ygICN3H3z6r-YwanLlEeaYR3P2EtHRcrBtCnt0VEKKbGPWOfeiNCVe3etlp9-NQo44",
}

describe(`POST - importBenchmark - /stigs`, () => {

  describe('Review Key Change', () => {

    before(async function () {
      this.timeout(4000)
      await utils.loadAppData()
      await utils.uploadTestStigs()
      await utils.createDisabledCollectionsandAssets()
    })
    it('Import a new STIG - with new RuleID matching old content', async function () {
      
        const directoryPath = path.join(__dirname, '../../../api/form-data-files/')
        const testStigfile = environment.reviewKeyChangeFile
        const filePath = path.join(directoryPath, testStigfile)
   
        const res = await chai.request(config.baseUrl)
        .post('/stigs?clobber=true')
        .set('Authorization', `Bearer ${user.token}`)
        .set('Content-Type', `multipart/form-data`)
        .attach('importFile', fs.readFileSync(filePath), testStigfile)
        expect(res).to.have.status(200)
    })
    it('Return the Review for an Asset and Rule - rule matches on stigId/checkContent', async function () {

        const res = await chai.request(config.baseUrl)
          .get(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${'SV-106179r1_yyyy'}?projection=stigs&projection=rule`)
          .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body.stigs).to.not.be.null
        expect(res.body.rule).to.exist
        expect(res.body.ruleId).to.eql(environment.testCollection.ruleId)
        expect(res.body.ruleIds).to.include("SV-106179r1_yyyy");
        expect(res.body.ruleIds).to.include(environment.testCollection.ruleId)
        const regex = new RegExp(environment.reviewMatchString)
        expect(res.body.detail).to.match(regex)
    })
    it('PUT Review: stigs and rule projections Copy', async () => {

        const putBody = {
            "result": "pass",
            "detail": "test\nvisible to lvl1",
            "comment": "sure",
            "autoResult": false,
            "status": "submitted"
        }

        const res = await chai.request(config.baseUrl)
            .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${'SV-106179r1_yyyy'}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(putBody)

        expect(res).to.have.status(403)
    })    
    it('Set all properties of an Asset - assign new STIG', async function () {
        const res = await chai.request(config.baseUrl)
          .put(`/assets/${environment.testAsset.assetId}`)
          .set('Authorization', 'Bearer ' + user.token)
          .send({
            "name": 'Collection_X_lvl1_asset-1',
            "collectionId": environment.testCollection.collectionId,
            "description": "test desc",
            "ip": "1.1.1.1",
            "noncomputing": true,
            "metadata": {
                "pocName": "poc2Put",
                "pocEmail": "pocEmailPut@email.com",
                "pocPhone": "12342",
                "reqRar": "true"
            },
            "stigs": [
                "VPN_SRG_TEST",
                "VPN_SRG_OTHER",
                "Windows_10_STIG_TEST",
                "RHEL_7_STIG_TEST"
            ]
        })
        expect(res).to.have.status(200)
    })
    it('PUT Review: stigs and rule projections- put review to alternate ruleId', async function () {

        const reqData = {
            "result": "pass",
            "detail": "test\nvisible to lvl1",
            "comment": "sure",
            "autoResult": false,
            "status": "submitted"
        }
        const respData = await chai.request(config.baseUrl)
          .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${'SV-106179r1_yyyy'}?projection=stigs&projection=rule`)
          .set('Authorization', `Bearer ${user.token}`)
          .send(reqData)

          const expectedReview = {
            assetId: "42",
            assetName: "Collection_X_lvl1_asset-1",
            assetLabelIds: [
                  "755b8a28-9a68-11ec-b1bc-0242ac110002",
                  "5130dc84-9a68-11ec-b1bc-0242ac110002"      
            ],
            ruleId: "SV-106179r1_yyyy",
            ruleIds: [
              "SV-106179r1_rule",
              "SV-106179r1_yyyy"
              ],
            result: reqData.result,
            resultEngine: null,
            detail: reqData.detail,
            autoResult: reqData.autoResult,
            comment: reqData.comment,
            userId: user.userId,
            username: user.name,
            ts: respData.body.ts,
            touchTs: respData.body.touchTs,
            status: {
                ts: respData.body.status.ts,
                text: null,
                user: {
                    userId: user.userId,
                    username: user.name
                },
                label: reqData.status
            },
            stigs: [        
                {
                      isDefault: true,
                      ruleCount: 2,
                      benchmarkId: "VPN_SRG_OTHER",
                      revisionStr: "V2R3",
                      benchmarkDate: "2021-07-19",
                      revisionPinned: false
                  }
              ],
            rule: {
              title: "This rule title has been replaced.",
              ruleId: "SV-106179r1_yyyy",
              version: "SRG-NET-000019-VPN-000040",
              severity: "medium"
            }
          }

        expect(respData).to.have.status(200)
        expect(respData.body).to.deep.eql(expectedReview)
    })
    it('Return the Review for an Asset and Rule - rule matches on stigId/checkContent Copy', async function () {

        const res = await chai.request(config.baseUrl)
          .get(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${'SV-106179r1_yyyy'}?projection=stigs&projection=rule`)
          .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body.stigs).to.not.be.null
        expect(res.body.rule).to.exist
        expect(res.body.ruleId).to.eql("SV-106179r1_yyyy")
        expect(res.body.ruleIds).to.include("SV-106179r1_yyyy");
        expect(res.body.ruleIds).to.include(environment.testCollection.ruleId)
        const regex = new RegExp(environment.reviewMatchString)
        expect(res.body.detail).to.match(regex)
    })
  })
})