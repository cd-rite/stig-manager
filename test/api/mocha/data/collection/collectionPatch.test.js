const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const enviornment = require('../../enviornment.json')
const users = [
  {
    "name": "stigmanadmin",
    "grant": "Owner",
    "token":
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ2ODEwMzUsImlhdCI6MTY3MDU0MDIzNiwiYXV0aF90aW1lIjoxNjcwNTQwMjM1LCJqdGkiOiI0N2Y5YWE3ZC1iYWM0LTQwOTgtOWJlOC1hY2U3NTUxM2FhN2YiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJiN2M3OGE2Mi1iODRmLTQ1NzgtYTk4My0yZWJjNjZmZDllZmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjMzNzhkYWZmLTA0MDQtNDNiMy1iNGFiLWVlMzFmZjczNDBhYyIsInNlc3Npb25fc3RhdGUiOiI4NzM2NWIzMy0yYzc2LTRiM2MtODQ4NS1mYmE1ZGJmZjRiOWYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImNyZWF0ZV9jb2xsZWN0aW9uIiwiZGVmYXVsdC1yb2xlcy1zdGlnbWFuIiwiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb24gc3RpZy1tYW5hZ2VyOnN0aWc6cmVhZCBzdGlnLW1hbmFnZXI6dXNlcjpyZWFkIHN0aWctbWFuYWdlcjpvcCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbjpyZWFkIHN0aWctbWFuYWdlcjpvcDpyZWFkIHN0aWctbWFuYWdlcjp1c2VyIHN0aWctbWFuYWdlciBzdGlnLW1hbmFnZXI6c3RpZyIsInNpZCI6Ijg3MzY1YjMzLTJjNzYtNGIzYy04NDg1LWZiYTVkYmZmNGI5ZiIsIm5hbWUiOiJTVElHTUFOIEFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3RpZ21hbmFkbWluIiwiZ2l2ZW5fbmFtZSI6IlNUSUdNQU4iLCJmYW1pbHlfbmFtZSI6IkFkbWluIn0.a1XwJZw_FIzwMXKo-Dr-n11me5ut-SF9ni7ylX-7t7AVrH1eAqyBxX9DXaxFK0xs6YOhoPsh9NyW8UFVaYgtF68Ps6yzoiqFEeiRXkpN5ygICN3H3z6r-YwanLlEeaYR3P2EtHRcrBtCnt0VEKKbGPWOfeiNCVe3etlp9-NQo44"
  },
  {
    "name": "lvl1",
    "grant": "Restricted",
    "token":
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ3MDg5ODQsImlhdCI6MTY3MDU2ODE4NCwiYXV0aF90aW1lIjoxNjcwNTY4MTg0LCJqdGkiOiIxMDhmMDc2MC0wYmY5LTRkZjEtYjE0My05NjgzNmJmYmMzNjMiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJlM2FlMjdiOC1kYTIwLTRjNDItOWRmOC02MDg5ZjcwZjc2M2IiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjE0ZmE5ZDdkLTBmZTAtNDQyNi04ZmQ5LTY5ZDc0YTZmMzQ2NCIsInNlc3Npb25fc3RhdGUiOiJiNGEzYWNmMS05ZGM3LTQ1ZTEtOThmOC1kMzUzNjJhZWM0YzciLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtc3RpZ21hbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InJlYWxtLW1hbmFnZW1lbnQiOnsicm9sZXMiOlsidmlldy11c2VycyIsInF1ZXJ5LWdyb3VwcyIsInF1ZXJ5LXVzZXJzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbiBzdGlnLW1hbmFnZXI6c3RpZzpyZWFkIHN0aWctbWFuYWdlcjp1c2VyOnJlYWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb246cmVhZCIsInNpZCI6ImI0YTNhY2YxLTlkYzctNDVlMS05OGY4LWQzNTM2MmFlYzRjNyIsIm5hbWUiOiJyZXN0cmljdGVkIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibHZsMSIsImdpdmVuX25hbWUiOiJyZXN0cmljdGVkIn0.OqLARi5ILt3j2rMikXy0ECTTqjWco0-CrMwzE88gUv2i8rVO9kMgVsXbtPk2L2c9NNNujnxqg7QIr2_sqA51saTrZHvzXcsT8lBruf74OubRMwcTQqJap-COmrzb60S7512k0WfKTYlHsoCn_uAzOb9sp8Trjr0NksU8OXCElDU"
  },
  {
    "name": "lvl2",
    "grant": "Full",
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ3MDkwNzQsImlhdCI6MTY3MDU2ODI3NSwiYXV0aF90aW1lIjoxNjcwNTY4Mjc0LCJqdGkiOiIwM2Y0OWVmYy1jYzcxLTQ3MTItOWFjNy0xNGY5YzZiNDc1ZGEiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJjMTM3ZDYzNy1mMDU2LTRjNzItOWJlZi1lYzJhZjdjMWFiYzciLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjQ5MzY5ZTdmLWEyZGYtNDkxYS04YjQ0LWEwNDJjYWYyMzhlYyIsInNlc3Npb25fc3RhdGUiOiJjNmUyZTgyNi0xMzMzLTRmMDctOTc4OC03OTQxMGM5ZjJkMDYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtc3RpZ21hbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InJlYWxtLW1hbmFnZW1lbnQiOnsicm9sZXMiOlsidmlldy11c2VycyIsInF1ZXJ5LWdyb3VwcyIsInF1ZXJ5LXVzZXJzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbiBzdGlnLW1hbmFnZXI6c3RpZzpyZWFkIHN0aWctbWFuYWdlcjp1c2VyOnJlYWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb246cmVhZCIsInNpZCI6ImM2ZTJlODI2LTEzMzMtNGYwNy05Nzg4LTc5NDEwYzlmMmQwNiIsIm5hbWUiOiJsdmwyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibHZsMiIsImdpdmVuX25hbWUiOiJsdmwyIn0.F1i8VVLNkVsaW9i83vbVyB9eFiSxX_9ZpR6K7Zs0r7pKOCMJnSOHeKIHrlMO4hW8DrbmSRrkrrXExwNtw6zUsuH8_1uxx-SVUkaQyHEMfbx1_TstkTOFcjxIWqtlVvwPIt-DlTpQ_IFuby8wDAIxUvNwogn2OoybzAy1CDMcpIA"
  },
  {
    "name": "lvl3",
    "grant":"Manage",
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ3MDkxMjUsImlhdCI6MTY3MDU2ODMyNSwiYXV0aF90aW1lIjoxNjcwNTY4MzI1LCJqdGkiOiI4NTI5MjZmZi0xYzM4LTQwMDYtOTYwYi1kOWE0YmNhMjcxZjkiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiIzNWZhYmMwNi0wNzZlLTRmZjQtOGJkZS1mMzI1ZWE3ZGQ0ZmIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjQxNmMwYmJkLTJmNjktNGZkMC04MmE1LTdjZDBmNmRlNzUzNSIsInNlc3Npb25fc3RhdGUiOiIzMThkOGNmZi0wY2U1LTQ3MzktODEyYy1iNWI0NjdlMWQ2YzEiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtc3RpZ21hbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InJlYWxtLW1hbmFnZW1lbnQiOnsicm9sZXMiOlsidmlldy11c2VycyIsInF1ZXJ5LWdyb3VwcyIsInF1ZXJ5LXVzZXJzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbiBzdGlnLW1hbmFnZXI6c3RpZzpyZWFkIHN0aWctbWFuYWdlcjp1c2VyOnJlYWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb246cmVhZCIsInNpZCI6IjMxOGQ4Y2ZmLTBjZTUtNDczOS04MTJjLWI1YjQ2N2UxZDZjMSIsInByZWZlcnJlZF91c2VybmFtZSI6Imx2bDMifQ.KduimV7h4DSySAWBbWlpN1xwbfXBfNsscvx2qIx9SVAeZFSGbPZ0JtgThD9uray9xZjrk6qLNYnkoVyYQLS4M-pg8IlFp5yKJBCIeCpcTxA25MdV5VwZQcCD9pgwtEav-cgaDD2Ue6cHj_02cQGMClsfkJ2SuOUJ9nIu4B3m3Qk"
  },
  {
    "name": "lvl4",
    "grant":"Owner",
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ3MDkxNjMsImlhdCI6MTY3MDU2ODM2NCwiYXV0aF90aW1lIjoxNjcwNTY4MzYzLCJqdGkiOiI3MTgwZjU5Yy1kNGQzLTQ0MmYtYjVlNS03NmYxMjBhOTQ3YWEiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiI5MDJjZmE0Ni02MWIzLTQ5YTctOGU4YS02ZjcwYTkzYzJhOTciLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjFlYWE4NDQxLWRhZmItNGE5My04N2ZmLTFkNzM0MzdlMGVjYSIsInNlc3Npb25fc3RhdGUiOiJiZjRjY2Y0Yy03ZTQwLTQ3YjYtYjAyYi1jZmQwOWQ3MTk4OWYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtc3RpZ21hbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InJlYWxtLW1hbmFnZW1lbnQiOnsicm9sZXMiOlsidmlldy11c2VycyIsInF1ZXJ5LWdyb3VwcyIsInF1ZXJ5LXVzZXJzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbiBzdGlnLW1hbmFnZXI6c3RpZzpyZWFkIHN0aWctbWFuYWdlcjp1c2VyOnJlYWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb246cmVhZCIsInNpZCI6ImJmNGNjZjRjLTdlNDAtNDdiNi1iMDJiLWNmZDA5ZDcxOTg5ZiIsIm5hbWUiOiJsdmw0IiwicHJlZmVycmVkX3VzZXJuYW1lIjoibHZsNCIsImdpdmVuX25hbWUiOiJsdmw0In0.RE0q9YINAiwu8XobDN_eq6UDc-uZTUYwzt2OEF5H_wk4qMnmIEq97FShPsToLYeQONHYgp6VRvaFIQqEk4IeGfzgFUhkg-rqulZIYbz7y4EnDsWE3Afa4MKL7oKrjWxNdAtg-Kp7m6LqBKHF4DCN3_EbGoJweK6aD6SH8epO53o"
  },
]

describe('PATCH - Collection', () => {

    before(async function () {
        this.timeout(4000)
        await utils.loadAppData()
        await utils.uploadTestStigs()
    })

    for(const user of users) {
      describe(`user:${user.name}`, () => {
        describe('PATCH - updateCollection - /collections/{collectionId}', () => {

          it('Merge provided properties with a Collection', async () => {
              const patchRequest = {
                  metadata: {
                      pocName: "poc2Patched",
                      pocEmail: "pocEmail@email.com",
                      pocPhone: "12342",
                      reqRar: "true",
                  },
                  grants: [
                      {
                      userId: "1",
                      accessLevel: 4,
                      },
                      {
                      userId: "21",
                      accessLevel: 1,
                      },
                      {
                      userId: "44",
                      accessLevel: 3,
                      },
                      {
                      userId: "45",
                      accessLevel: 4,
                      },
                      {
                      userId: "87",
                      accessLevel: 4,
                      },
                  ],
                  }
            
              const res = await chai.request(config.baseUrl)
                  .patch(`/collections/${enviornment.scrapCollection.collectionId}?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs`)
                  .set('Authorization', `Bearer ${user.token}`)
                  .send(patchRequest)
              
              expect(res).to.have.status(200)
              expect(res).to.have.status(200)
              expect(res.body.metadata.pocName).to.equal(patchRequest.metadata.pocName)
              expect(res.body.metadata.pocEmail).to.equal(patchRequest.metadata.pocEmail)
              expect(res.body.metadata.pocPhone).to.equal(patchRequest.metadata.pocPhone)
              expect(res.body.metadata.reqRar).to.equal(patchRequest.metadata.reqRar)

              expect(res.body.grants).to.have.lengthOf(patchRequest.grants.length)
              
              // make sure userids are the same 
              for(const grant of res.body.grants) {
                  expect(grant.user.userId).to.be.oneOf(patchRequest.grants.map(g => g.userId))
              }

              // projections
              expect(res.body.assets).to.have.lengthOf(3)
              expect(res.body.owners).to.have.lengthOf(3)
              expect(res.body.statistics).to.have.property("assetCount").to.equal(res.body.assets.length)

              for(stig of res.body.stigs) {
                  expect(stig.benchmarkId).to.be.oneOf(enviornment.scrapCollection.validStigs)
              }
          })
        })

        describe('PATCH - patchCollectionLabelById - /collections/{collectionId}/labels/{labelId}', () => {

          it('Merge provided properties with a Collection Label', async () => {
              const res = await chai.request(config.baseUrl)
                  .patch(`/collections/${enviornment.testCollection.collectionId}/labels/${enviornment.testCollection.testLabel}`)
                  .set('Authorization', `Bearer ${user.token}`)
                  .send({
                      "name": "test-label-full",
                      "description": "test label patched",
                      "color": "aa34cc"
                    })
              expect(res).to.have.status(200)
              expect(res.body.labelId).to.equal(enviornment.testCollection.testLabel)
              expect(res.body.description).to.equal("test label patched")
              expect(res.body.color).to.equal("aa34cc")
              expect(res.body.name).to.equal("test-label-full")
          })
        })

        describe('PATCH - patchCollectionMetadata - /collections/{collectionId}/metadata', () => {

          it('Merge metadata property/value into a Collection', async () => {
              
              const res = await chai.request(config.baseUrl)
                  .patch(`/collections/${enviornment.testCollection.collectionId}/metadata`)
                  .set('Authorization', `Bearer ${user.token}`)
                  .send({[enviornment.testCollection.metadataKey]: enviornment.testCollection.metadataValue})
              
              expect(res).to.have.status(200)
              expect(res.body).to.contain({[enviornment.testCollection.metadataKey]: enviornment.testCollection.metadataValue})
          })
        })
      })
    }
})
