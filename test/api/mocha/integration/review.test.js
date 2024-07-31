const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../testConfig.json')
const utils = require('../utils/testUtils')
const environment = require('../environment.json')
const xml2js = require('xml2js')

const user =
  {
    "name": "stigmanadmin",
    "grant": "Owner",
    "userId": "1",
    "token":
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ2ODEwMzUsImlhdCI6MTY3MDU0MDIzNiwiYXV0aF90aW1lIjoxNjcwNTQwMjM1LCJqdGkiOiI0N2Y5YWE3ZC1iYWM0LTQwOTgtOWJlOC1hY2U3NTUxM2FhN2YiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJiN2M3OGE2Mi1iODRmLTQ1NzgtYTk4My0yZWJjNjZmZDllZmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjMzNzhkYWZmLTA0MDQtNDNiMy1iNGFiLWVlMzFmZjczNDBhYyIsInNlc3Npb25fc3RhdGUiOiI4NzM2NWIzMy0yYzc2LTRiM2MtODQ4NS1mYmE1ZGJmZjRiOWYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImNyZWF0ZV9jb2xsZWN0aW9uIiwiZGVmYXVsdC1yb2xlcy1zdGlnbWFuIiwiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb24gc3RpZy1tYW5hZ2VyOnN0aWc6cmVhZCBzdGlnLW1hbmFnZXI6dXNlcjpyZWFkIHN0aWctbWFuYWdlcjpvcCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbjpyZWFkIHN0aWctbWFuYWdlcjpvcDpyZWFkIHN0aWctbWFuYWdlcjp1c2VyIHN0aWctbWFuYWdlciBzdGlnLW1hbmFnZXI6c3RpZyIsInNpZCI6Ijg3MzY1YjMzLTJjNzYtNGIzYy04NDg1LWZiYTVkYmZmNGI5ZiIsIm5hbWUiOiJTVElHTUFOIEFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3RpZ21hbmFkbWluIiwiZ2l2ZW5fbmFtZSI6IlNUSUdNQU4iLCJmYW1pbHlfbmFtZSI6IkFkbWluIn0.a1XwJZw_FIzwMXKo-Dr-n11me5ut-SF9ni7ylX-7t7AVrH1eAqyBxX9DXaxFK0xs6YOhoPsh9NyW8UFVaYgtF68Ps6yzoiqFEeiRXkpN5ygICN3H3z6r-YwanLlEeaYR3P2EtHRcrBtCnt0VEKKbGPWOfeiNCVe3etlp9-NQo44"
  }

describe('PUT - putReviewByAssetRule - /collections/{collectionId}/reviews/{assetId}/{ruleId}', () => {

    describe('Check that "informational" results are represented as NotReviewed with Finding Details data in .ckls', () => {

        before(async function () {
            this.timeout(4000)
            await utils.loadAppData()
            await utils.uploadTestStigs()
            await utils.createDisabledCollectionsandAssets()
        })

        it('Set all properties of a Review - informational + result comment', async () => {
            const putBody = {
                "result": "informational",
                "detail": "test\nvisible to lvl1, THIS REVIEW IS INFORMATIONAL (but comes back as Not_Reviewed in a ckl)",
                "comment": "sure",
                "autoResult": false,
                "status": "saved"
            }
    
            const res = await chai.request(config.baseUrl)
                .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}?projection=rule&projection=history&projection=stigs`)
                .set('Authorization', `Bearer ${user.token}`)
                .send(putBody)
            expect(res).to.have.status(200)
        })
        it('Return the Checklist for the supplied Asset and STIG XML (.ckl) - check that informational + detail exported as not_reviewed + finding_details', async () => {
            const res = await chai.request(config.baseUrl)
                .get(`/assets/${environment.testAsset.assetId}/checklists/${environment.testCollection.benchmark}/${environment.testCollection.revisionStr}?format=ckl`)
                .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            let cklData

            xml2js.parseString(res.body, function (err, result) {
                cklData = result
            })
            let cklHostName = cklData.CHECKLIST.ASSET[0].HOST_NAME[0]
            let cklIStigs = cklData.CHECKLIST.STIGS[0].iSTIG

            for(const iStig of cklIStigs){
                for (let cklSiDatum of iStig.STIG_INFO[0].SI_DATA){
                    if (cklSiDatum.SID_NAME[0] == 'stigid'){
                        currentStigId = cklSiDatum.SID_DATA[0]
                        expect(currentStigId).to.be.oneOf(environment.testCollection.validStigs);
                    }
                }
                let cklVulns = iStig.VULN;
                if (currentStigId == 'VPN_SRG_TEST') {
                    expect(cklVulns).to.be.an('array').of.length(environment.metrics.checklistLength)
                    for (let thisVuln of cklVulns){
                        for (let stigData of thisVuln.STIG_DATA){
                            if (stigData.ATTRIBUTE_DATA[0] == 'SV-106179r1_rule'){
                                var commentRegex = new RegExp("INFORMATIONAL")
                                var statusRegex = new RegExp("Not_Reviewed")
                                expect(thisVuln.FINDING_DETAILS[0]).to.match(commentRegex)
                                expect(thisVuln.STATUS[0]).to.match(statusRegex)
                            }
        
                        }
                    }
        
                }
            }
        })
        it('Set all properties of a Review - invalid result enum', async () => {
            const putBody = {
                "result": "INVALID",
                "detail": "test\nvisible to lvl1, test of invalid result enum",
                "comment": "sure",
                "autoResult": false,
                "status": "saved"
            }
    
            const res = await chai.request(config.baseUrl)
                .put(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}?projection=rule&projection=history&projection=stigs`)
                .set('Authorization', `Bearer ${user.token}`)
                .send(putBody)
            expect(res).to.have.status(400)
        })
    })
})



