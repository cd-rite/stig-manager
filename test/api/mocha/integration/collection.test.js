const chai = require("chai")
const chaiHttp = require("chai-http")
chai.use(chaiHttp)
const expect = chai.expect
const config = require("../testConfig.json")
const utils = require("../utils/testUtils")
const environment = require("../environment.json")

const user = {
  name: "admin",
  grant: "Owner",
  token:
    "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ2ODEwMzUsImlhdCI6MTY3MDU0MDIzNiwiYXV0aF90aW1lIjoxNjcwNTQwMjM1LCJqdGkiOiI0N2Y5YWE3ZC1iYWM0LTQwOTgtOWJlOC1hY2U3NTUxM2FhN2YiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJiN2M3OGE2Mi1iODRmLTQ1NzgtYTk4My0yZWJjNjZmZDllZmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjMzNzhkYWZmLTA0MDQtNDNiMy1iNGFiLWVlMzFmZjczNDBhYyIsInNlc3Npb25fc3RhdGUiOiI4NzM2NWIzMy0yYzc2LTRiM2MtODQ4NS1mYmE1ZGJmZjRiOWYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImNyZWF0ZV9jb2xsZWN0aW9uIiwiZGVmYXVsdC1yb2xlcy1zdGlnbWFuIiwiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb24gc3RpZy1tYW5hZ2VyOnN0aWc6cmVhZCBzdGlnLW1hbmFnZXI6dXNlcjpyZWFkIHN0aWctbWFuYWdlcjpvcCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbjpyZWFkIHN0aWctbWFuYWdlcjpvcDpyZWFkIHN0aWctbWFuYWdlcjp1c2VyIHN0aWctbWFuYWdlciBzdGlnLW1hbmFnZXI6c3RpZyIsInNpZCI6Ijg3MzY1YjMzLTJjNzYtNGIzYy04NDg1LWZiYTVkYmZmNGI5ZiIsIm5hbWUiOiJTVElHTUFOIEFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3RpZ21hbmFkbWluIiwiZ2l2ZW5fbmFtZSI6IlNUSUdNQU4iLCJmYW1pbHlfbmFtZSI6IkFkbWluIn0.a1XwJZw_FIzwMXKo-Dr-n11me5ut-SF9ni7ylX-7t7AVrH1eAqyBxX9DXaxFK0xs6YOhoPsh9NyW8UFVaYgtF68Ps6yzoiqFEeiRXkpN5ygICN3H3z6r-YwanLlEeaYR3P2EtHRcrBtCnt0VEKKbGPWOfeiNCVe3etlp9-NQo44",
}

describe('PATCH - updateCollection - /collections/{collectionId}', () => {
    describe('Verify manager grant restrictions', () => {

        before(async function () {
            this.timeout(4000)
            await utils.loadAppData()
            await utils.uploadTestStigs()
            await utils.createDisabledCollectionsandAssets()
        })
        it('Merge provided properties with a Collection - make admin a manager', async () => {
            const patchRequest = {
                "metadata": {
                  "pocName": "poc2Patched",
                  "pocEmail": "pocEmail@email.com",
                  "pocPhone": "12342",
                  "reqRar": "true"
                },
                  "grants": [
                      {
                        "userId": "1",
                        "accessLevel": 3
                      },
                      {
                              "userId": "21",
                          "accessLevel": 2
                      },
                      {
                              "userId": "44",
                          "accessLevel": 3
                      },
                      {
                              "userId": "45",
                          "accessLevel": 4
                      }
                  ]
              } 
        
            const res = await chai.request(config.baseUrl)
                .patch(`/collections/${environment.scrapCollection.collectionId}`)
                .set('Authorization', `Bearer ${user.token}`)
                .send(patchRequest)
            expect(res).to.have.status(200)
        })
        it('Merge provided properties with a Collection - manager attempts to change owner grant', async () => {
            const patchRequest ={
                "metadata": {
                  "pocName": "poc2Patched",
                  "pocEmail": "pocEmail@email.com",
                  "pocPhone": "12342",
                  "reqRar": "true"
                },
                  "grants": [
                      {
                        "userId": "1",
                        "accessLevel": 3
                      },
                      {
                              "userId": "21",
                          "accessLevel": 2
                      },
                      {
                              "userId": "44",
                          "accessLevel": 3
                      },
                      {
                              "userId": "45",
                          "accessLevel": 3
                      }
                  ]
              }
        
            const res = await chai.request(config.baseUrl)
                .patch(`/collections/${environment.scrapCollection.collectionId}`)
                .set('Authorization', `Bearer ${user.token}`)
                .send(patchRequest)
            expect(res).to.have.status(403)
        })
        it('Merge provided properties with a Collection - manager can set other manager grants', async () => {
            const patchRequest = {
                "metadata": {
                  "pocName": "poc2Patched",
                  "pocEmail": "pocEmail@email.com",
                  "pocPhone": "12342",
                  "reqRar": "true"
                },
                  "grants": [
                      {
                        "userId": "1",
                        "accessLevel": 3
                      },
                      {
                              "userId": "21",
                          "accessLevel": 3
                      },
                      {
                              "userId": "44",
                          "accessLevel": 2
                      },
                      {
                              "userId": "45",
                          "accessLevel": 4
                      }
                  ]
              }
        
            const res = await chai.request(config.baseUrl)
                .patch(`/collections/${environment.scrapCollection.collectionId}`)
                .set('Authorization', `Bearer ${user.token}`)
                .send(patchRequest)
            expect(res).to.have.status(200)
        })
        it('Set all properties of a Collection Copy', async () => {
            const putRequest = {
                "name": "TEST_{{$randomNoun}}-{{$randomJobType}}",
                "description": null,
                  "settings": {
                      "fields": {
                          "detail": {
                              "enabled": "always",
                              "required": "findings"
                          },
                          "comment": {
                              "enabled": "always",
                              "required": "findings"
                          }
                      },
                      "status": {
                          "canAccept": true,
                          "minAcceptGrant": 2,
                          "resetCriteria": "result"
                      }
                },
                "metadata": {
                  "pocName": "poc2Patched",
                  "pocEmail": "pocEmail@email.com",
                  "pocPhone": "12342",
                  "reqRar": "true"
                },
                  "grants": [
                      {
                        "userId": "1",
                        "accessLevel": 4
                      },
                      {
                              "userId": "21",
                          "accessLevel": 2
                      },
                      {
                              "userId": "44",
                          "accessLevel": 3
                      },
                      {
                              "userId": "45",
                          "accessLevel": 3
                      }
                  ]
              }
        
            const res = await chai.request(config.baseUrl)
                .put(`/collections/${environment.scrapCollection.collectionId}?projection=grants&projection=owners`)
                .set('Authorization', `Bearer ${user.token}`)
                .send(putRequest)
            expect(res).to.have.status(403)
        })
    })
})
describe('PUT - setStigAssetsByCollectionUser - /collections/{collectionId}/grants/{userId}/access', () => {

    describe('Verify manager grant restrictions', () =>{

        before(async function () {
            this.timeout(4000)
            await utils.loadAppData()
            await utils.uploadTestStigs()
            await utils.createDisabledCollectionsandAssets()
        })
        it('set stig-asset grant to create conditions leading to issue gh-761', async () => {

            const res = await chai.request(config.baseUrl)
                .put(`/collections/${environment.testCollection.collectionId}/grants/${environment.scrapLvl1User.userId}/access`)
                .set('Authorization', `Bearer ${user.token}`)
                .send([
                    {
                        "benchmarkId": `${environment.testCollection.benchmark}`,
                        "assetId": `${environment.testAsset.assetId}`
                    }
                ])
            expect(res).to.have.status(200)
            expect(res.body).to.have.lengthOf(1)
            for(const item of res.body){
                expect(item.benchmarkId).to.equal(environment.testCollection.benchmark)
                expect(item.asset.assetId).to.equal(environment.testAsset.assetId)
            }
        })
        it('Assets accessible to the requester (with STIG grants projection) -statusStats', async () => {

            const res = await chai.request(config.baseUrl)
                .get(`/assets?collectionId=${environment.testCollection.collectionId}&projection=statusStats&projection=stigGrants`)
                .set('Authorization', `Bearer ${user.token}`)
               
            expect(res).to.have.status(200)
                    
            let returnedAssetIds=[];
    
            var regex = new RegExp("asset")
            for (let asset of res.body){

                expect(asset.name).to.match(regex)
                returnedAssetIds.push(asset.assetId)
                expect(asset.statusStats).to.exist

                if (asset.assetId == environment.testAsset.assetId){ 
                    expect(asset.statusStats.ruleCount).to.eql(368)
                    expect(asset.statusStats.stigCount).to.eql(2)

                    expect(asset.stigGrants).to.exist
                    for (let grant of asset.stigGrants){
                        expect(grant.benchmarkId).to.be.oneOf(environment.testCollection.validStigs)
                        if(grant.benchmarkId == environment.testCollection.benchmark){
                            expect(grant.users).to.have.lengthOf(2)
                            expect(environment.scrapLvl1User.userId).to.be.oneOf(grant.users.map(user => user.userId))
                        }
                    }
                }
            }
        })
    })
  })
