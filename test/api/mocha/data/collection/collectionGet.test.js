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
describe('GET - Collection', () => {

  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const user of users){
    
    describe(`user:${user.name}`, () => {
     
      describe('getCollections - /collections', () => {

        it('Return a list of Collections accessible to the requester No Filters elevated', async () => {
          const res = await chai.request(config.baseUrl)
            .get('/collections?projection=owners&projection=statistics&elevate=true')
            .set('Authorization', `Bearer ${user.token}`)
          
          if(user.name !== 'stigmanadmin'){
            expect(res).to.have.status(403)
            return
          }

          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body).to.have.lengthOf(7)
          //check statistics projection
          const collection21 = res.body.find(collection => collection.collectionId === '21')
          const expectedOwners = ["87", "1", "45"]
          for(const owner of collection21.owners){
            expect(expectedOwners).to.include(owner.userId)
          }
          expect(collection21.statistics.assetCount).to.equal(enviornment.testCollection.assetIDsInCollection.length)
          expect(collection21.statistics.checklistCount).to.equal(6)
          expect(collection21.statistics.grantCount).to.equal(7)
        })
        it('Return a list of Collections accessible to the requester No Filters no elevate!', async () => {
            const res = await chai.request(config.baseUrl)
              .get('/collections')
              .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
           
            if(user.name === 'stigmanadmin'){
              expect(res.body).to.have.lengthOf(6)
            }
            if(user.name === 'lvl1'){
              expect(res.body).to.have.lengthOf(1)
            }
            if(user.name === 'lvl2' || user.name === 'lvl3'){
              expect(res.body).to.have.lengthOf(2)
            }
            if(user.name === 'lvl4'){
              expect(res.body).to.have.lengthOf(3)
            }
        })
        it('Return a list of Collections accessible to the requester METADATA', async () => {
            const res = await chai.request(config.baseUrl)
              .get(`/collections?metadata=${enviornment.collectionMetadataKey}%3A${enviornment.collectionMetadataValue}`)
              .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
            const regex  = new RegExp(enviornment.testCollection.name)
            expect(res.body[0].name).to.match(regex)
            expect(res.body).to.have.lengthOf(1)
            expect(res.body[0].collectionId).to.equal('21')
            expect(res.body[0].metadata[enviornment.collectionMetadataKey]).to.equal(enviornment.collectionMetadataValue)

        })
        it('Return a list of Collections accessible to the requester NAME exact', async () => {
        const res = await chai.request(config.baseUrl)
            .get(`/collections?name=${enviornment.testCollection.name}&name-match=exact`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        const regex  = new RegExp(enviornment.testCollection.name)
        expect(res.body[0].name).to.match(regex)
        expect(res.body).to.have.lengthOf(1)
        expect(res.body[0].collectionId).to.equal('21')
        })
        it('Return a list of Collections accessible to the requester NAME starts With', async () => {
        const res = await chai.request(config.baseUrl)
            .get(`/collections?name=${'Collection'}&name-match=startsWith`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        
        if(user.name === 'stigmanadmin'){
          expect(res.body).to.have.lengthOf(3)
        }
        if(user.name === 'lvl1'){
          expect(res.body).to.have.lengthOf(1)
        }
        if(user.name === 'lvl2' || user.name === 'lvl3' || user.name === 'lvl4'){
          expect(res.body).to.have.lengthOf(2)
        }
        for(const collection of res.body){
            expect(collection.name).to.have.string('Collection')
        }
        })
        it('Return a list of Collections accessible to the requester NAME ends With', async () => {
        const res = await chai.request(config.baseUrl)
            .get(`/collections?name=${'X'}&name-match=endsWith`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf(1)
        expect(res.body[0].name).to.have.string('X')
        })
        it('Return a list of Collections accessible to the requester NAME contains elevated', async () => {
        const res = await chai.request(config.baseUrl)
            .get(`/collections?name=${'delete'}&name-match=contains&elevate=true`)
            .set('Authorization', `Bearer ${user.token}`)
        if(user.name !== 'stigmanadmin'){
          expect(res).to.have.status(403)
          return
        } 
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf(3)
        expect(res.body[0].name).to.have.string('delete')
        })
        it('Return a list of Collections accessible to the requester NAME contains no elevate', async () => {
          const res = await chai.request(config.baseUrl)
              .get(`/collections?name=${'delete'}&name-match=contains`)
              .set('Authorization', `Bearer ${user.token}`)
          expect(res).to.have.status(200)
          if(user.name === 'stigmanadmin'){
            expect(res.body).to.have.lengthOf(2)
            expect(res.body[0].name).to.have.string('delete')
          }
          if(user.name === 'lvl1' || user.name === 'lvl2' || user.name === 'lvl3'){
            expect(res.body).to.have.lengthOf(0)
          }
          if(user.name === 'lvl4'){
            expect(res.body).to.have.lengthOf(1)
            expect(res.body[0].name).to.have.string('delete')
          }
        })
      })
      describe('getCollection - /collections/{collectionId}', () => {
        it('Return a Collection', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs&projection=labels`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body.collectionId).to.equal('21')
            const regex  = new RegExp(enviornment.testCollection.name)
            expect(res.body.name).to.match(regex)

            // assets projection

            if(user.name === 'stigmanadmin'){
              expect(res.body.assets).to.be.an('array').of.length(enviornment.testCollection.assetIDsInCollection.length)
              // statistics projection
              expect(res.body.statistics.assetCount).to.equal(enviornment.testCollection.assetIDsInCollection.length)
            }
            if(user.name === 'lvl1'){
              expect(res.body.assets).to.be.an('array').of.length(enviornment.lvl1.assets.length)
              // statistics projection
              expect(res.body.statistics.assetCount).to.equal(enviornment.lvl1.assets.length)
            }
           
            for(const asset of res.body.assets){
                expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
            }

            // grants projection
            expect(res.body.grants).to.be.an('array').of.length(7)
            for(const grant of res.body.grants){
                expect(enviornment.testCollection.userIdsWithGrant).to.include(grant.user.userId)
            }

            // owners projection
            expect(res.body.owners).to.be.an('array').of.length(3)
            for(const owner of res.body.owners){
                expect(enviornment.testCollection.owners).to.include(owner.userId)
            }

            
        })
      })
      describe('getChecklistByCollectionStig - /collections/{collectionId}/checklists/{benchmarkId}/{revisionStr}', () => {
        it('Return the Checklist for the supplied Collection and STIG-latest', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/checklists/${enviornment.testCollection.benchmark}/${'latest'}`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array').of.length(81)
        })
        it('Return the Checklist for the supplied Collection and STIG-revStr', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/checklists/${enviornment.testCollection.benchmark}/${enviornment.testCollection.revisionStr}`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array').of.length(81)
        })
      })
      describe('getFindingsByCollection - /collections/{collectionId}/findings', () => {
        
        it('Return the Findings for the specified Collection by ruleId', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/findings?aggregator=cci&acceptedOnly=false&projection=assets&projection=groups&projection=rules&projection=stigs&projection=ccis`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            if(user.name === 'lvl1'){
              expect(res.body).to.have.lengthOf(7)
            }
            else{
              expect(res.body).to.have.lengthOf(8)
            }

            // assets projection
            for(const finding of res.body){
                expect(finding.assetCount).to.equal(finding.assets.length)
                for(const asset of finding.assets){
                    expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
                }
            }
            // groups projection
            expect(res.body[0].groups).to.be.an('array').of.length(1)

            // rules projection
            expect(res.body[0].rules).to.be.an('array').of.length(1)
            
            // stigs projection
            expect(res.body[0].stigs).to.be.an('array').of.length(1)
            expect(res.body[0].stigs[0].ruleCount).to.equal(81)
            expect(res.body[0].stigs[0].benchmarkId).to.equal(enviornment.testCollection.benchmark)
            expect(res.body[0].stigs[0].revisionStr).to.equal(enviornment.testCollection.revisionStr)

            // ccis projection
            expect(res.body[0].ccis).to.be.an('array').of.length(1)
        })
        it('Return the Findings for the specified Collection by groupId', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/findings?aggregator=groupId&acceptedOnly=false&projection=assets`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            if(user.name === 'lvl1'){
              expect(res.body).to.have.lengthOf(3)
            }
            else{
              expect(res.body).to.have.lengthOf(4)
            }

            for(const finding of res.body){
              expect(finding.assetCount).to.equal(finding.assets.length)
              for(const asset of finding.assets){
                  expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
              }
            }
        })
        it('Return the Findings for the specified Collection by cci', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/findings?aggregator=cci&acceptedOnly=false&projection=assets`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res).to.have.status(200)
            if(user.name === 'lvl1'){
              expect(res.body).to.have.lengthOf(7)
            }
            else{
              expect(res.body).to.have.lengthOf(8)
            }
            for(const finding of res.body){
              expect(finding.assetCount).to.equal(finding.assets.length)
              for(const asset of finding.assets){
                  expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
              }
            }
        })
        it('Return the Findings for the specified Collection for benchmarkId x ruleId', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/findings?aggregator=ruleId&acceptedOnly=false&benchmarkId=${enviornment.testCollection.benchmark}&projection=assets`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array').of.length(3)
            for(const finding of res.body){
              expect(finding.assetCount).to.equal(finding.assets.length)
              for(const asset of finding.assets){
                  expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
              }
            }
        })
        it('Return the Findings for the specified Collection for asset x ruleId Copy', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/findings?aggregator=ruleId&acceptedOnly=false&assetId=${enviornment.testAsset.assetId}&projection=assets`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res).to.have.status(200)
            if(user.name === 'lvl1'){
              expect(res.body).to.have.lengthOf(3)
            }
            else{
              expect(res.body).to.have.lengthOf(4)
            }
            for(const finding of res.body){
              expect(finding.assetCount).to.equal(1)
              expect(finding.assets[0].assetId).to.equal(enviornment.testAsset.assetId)
            }
        })
      })
      describe('getStigAssetsByCollectionUser - /collections/{collectionId}/grants/{userId}/access', () => {
        it('Return stig-asset grants for a lvl1 user in this collection.', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/grants/${enviornment.lvl1.userId}/access`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1' || user.name === 'lvl2'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array').of.length(2)
            const regex = new RegExp("asset")
            for (const stigAssetGrant of res.body) {
              expect(stigAssetGrant.asset.name).to.match(regex)
              expect(stigAssetGrant.benchmarkId).to.be.oneOf(enviornment.testCollection.validStigs)
              expect(stigAssetGrant.asset.assetId).to.be.oneOf(enviornment.testCollection.assetIDsInCollection)
            }
        })
      })
      describe('getCollectionLabels - /collections/{collectionId}/labels', () => {

        it('Labels for the specified Collection', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/labels`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array').of.length(2)
            for(const label of res.body){
              expect(enviornment.testCollection.labels).to.include(label.labelId)
              if (label.name == enviornment.testCollection.labelFull){
                if(user.name === 'lvl1'){
                  expect(label.uses).to.equal(1)
                }
                else{
                  expect(label.uses).to.equal(2)
                }
              
              }
              if (label.name == enviornment.testCollection.testLabelName){
                  expect(label.uses).to.equal(1)
              }
            }
        })
      })
      describe('getCollectionLabelById - /collections/{collectionId}/labels/{labelId}', () => {
        it('Collection label', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/labels/${enviornment.testCollection.testLabel}`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body.labelId).to.equal(enviornment.testCollection.testLabel)
            if(user.name === 'lvl1'){
              expect(res.body.uses).to.equal(1)
            }
            else{
              expect(res.body.uses).to.equal(2)
            }
            expect(res.body.name).to.equal('test-label-full')
        })
      })
      describe('getCollectionMetadata - /collections/{collectionId}/metadata', () => {
        it('Metadata for the specified Collection', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/metadata`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1' || user.name === 'lvl2'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body[enviornment.collectionMetadataKey]).to.equal(enviornment.collectionMetadataValue)
        })
      })
      describe('getCollectionMetadataKeys - /collections/{collectionId}/metadata/keys', () => {

        it('Return the Metadata KEYS for a Collection', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/metadata/keys?`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1' || user.name === 'lvl2'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array').of.length(4)
            const keys = enviornment.testCollection.allMetadata.map(meta => meta.key)
            for(const key of res.body){
              expect(keys).to.include(key)
            }
        })
      })
      describe('getCollectionMetadataValue - /collections/{collectionId}/metadata/keys/{key}', () => {

        it('Return the Metadata VALUE for a Collection metadata KEY', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/metadata/keys/${enviornment.collectionMetadataKey}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1' || user.name === 'lvl2'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body).to.equal(enviornment.collectionMetadataValue)
        })
      })
      describe('getPoamByCollection - /collections/{collectionId}/poam', () => {

        it('Return a POAM-like spreadsheet aggregated by groupId', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/poam?aggregator=groupId&date=01%2F01%2F1970&office=MyOffice&status=Ongoing&acceptedOnly=true`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
        })
        it('Return a POAM-like spreadsheet aggregated by ruleId', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/poam?aggregator=ruleId&date=01%2F01%2F1970&office=MyOffice&status=Ongoing&acceptedOnly=true`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
        })
      })
      describe('getReviewHistoryByCollection - /collections/{collectionId}/review-history', () => {

        it('History records - no query params', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array').of.length(2)
            for(asset of res.body){
              if(asset.assetId === enviornment.reviewHistory.assetId){
                expect(asset.reviewHistories).to.be.an('array').of.length(2)
                for(const history of asset.reviewHistories){
                  if(history.ruleId === enviornment.reviewHistory.ruleId){
                    expect(history.history).to.be.an('array').of.length(2)
                    for(const record of history.history){
                      expect(record.result).to.be.equal('pass')
                    }
                  }
                }
              }
            }
        })
        it('History records - asset only', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history?assetId=${enviornment.reviewHistory.assetId}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array').of.length(1)
            for(asset of res.body){
              expect(asset.assetId).to.equal(enviornment.reviewHistory.assetId)
              expect(asset.reviewHistories).to.be.an('array').of.length(2)
              for(const history of asset.reviewHistories){
                if(history.ruleId === enviornment.reviewHistory.ruleId){
                  expect(history.history).to.be.an('array').of.length(2)
                  for(const record of history.history){
                    expect(record.result).to.be.equal('pass')
                  }
                }
              }
          }
        })
        it('History records - endDate only', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history?endDate=${enviornment.reviewHistory.endDate}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array').of.length(2)
            for(asset of res.body){
              for(const history of asset.reviewHistories){
                expect(history.history).to.be.an('array').of.length(2)
                for(const record of history.history){
                  expect(Date.parse(record.ts)).to.be.below(Date.parse(enviornment.reviewHistory.endDate))
                }
              }
            }
        })
        it('History records - startDate only', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history?startDate=${enviornment.reviewHistory.startDate}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array').of.length(2)
            for(asset of res.body){
              for(const history of asset.reviewHistories){
                for(const record of history.history){
                  expect(Date.parse(record.ts)).to.be.above(Date.parse(enviornment.reviewHistory.startDate))
                }
              }
            }
        })
        it('History records - rule only', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history?ruleId=${enviornment.reviewHistory.ruleId}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array').of.length(2)
            for(asset of res.body){
              for(const history of asset.reviewHistories){
                expect(history.ruleId).to.equal(enviornment.reviewHistory.ruleId)
              }
            }
        })
        it('History records - start and end dates', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history?startDate=${enviornment.reviewHistory.startDate}&endDate=${enviornment.reviewHistory.endDate}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array').of.length(2)
            for(asset of res.body){
              for(const history of asset.reviewHistories){
                for(const record of history.history){
                  expect(Date.parse(record.ts)).to.be.above(Date.parse(enviornment.reviewHistory.startDate))
                  expect(Date.parse(record.ts)).to.be.below(Date.parse(enviornment.reviewHistory.endDate))
                }
              }
            }
        })
        it('History records - status only', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history?status=${enviornment.reviewHistory.status}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array').of.length(2)
            for(asset of res.body){
              for(const history of asset.reviewHistories){
                for(const record of history.history){
                  expect(record.status.label).to.equal(enviornment.reviewHistory.status)
                }
              }
            }
        })
        it('History records - all params', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history?status=${enviornment.reviewHistory.status}&assetId=${enviornment.reviewHistory.assetId}&ruleId=${enviornment.reviewHistory.ruleId}&startDate=${enviornment.reviewHistory.startDate}&endDate=${enviornment.reviewHistory.endDate}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array').of.length(1)
            //asset
            expect(res.body[0].assetId).to.equal(enviornment.reviewHistory.assetId)
            for(const history of res.body[0].reviewHistories){
              //rule 
              expect(history.ruleId).to.equal(enviornment.reviewHistory.ruleId)
              for(const record of history.history){
                // start/end date
                expect(Date.parse(record.ts)).to.be.above(Date.parse(enviornment.reviewHistory.startDate))
                expect(Date.parse(record.ts)).to.be.below(Date.parse(enviornment.reviewHistory.endDate))
                // status
                expect(record.status.label).to.equal(enviornment.reviewHistory.status)
              }
            }
        })
      })
      describe('getReviewHistoryStatsByCollection - /collections/{collectionId}/review-history/stats', () => {

        it('History stats - no query params', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.collectionHistoryEntryCount).to.equal(7)
            expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
        })
        it('History stats - startDate only', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?startDate=${enviornment.reviewHistory.startDate}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.collectionHistoryEntryCount).to.equal(7)
            expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
        })
        it('History stats - startDate - Asset Projection', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?startDate=${enviornment.reviewHistory.startDate}&projection=asset`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.collectionHistoryEntryCount).to.equal(7)
            expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
            expect(res.body.assetHistoryEntryCounts.length).to.eql(2)
            let totalHistoryEntries = 0
            for(const asset of res.body.assetHistoryEntryCounts){
              expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
              totalHistoryEntries += asset.historyEntryCount
            }
            expect(totalHistoryEntries).to.equal(res.body.collectionHistoryEntryCount)
        })
        it('History stats - endDate only', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?endDate=${enviornment.reviewHistory.endDate}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.collectionHistoryEntryCount).to.equal(6)
            expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
        })
        it('History stats - start and end dates', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?endDate=${enviornment.reviewHistory.endDate}&startDate=${enviornment.reviewHistory.startDate}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.collectionHistoryEntryCount).to.equal(6)
            expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
        })
        it('History stats - asset only', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?assetId=${enviornment.reviewHistory.assetId}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.collectionHistoryEntryCount).to.equal(5)
        })
        it('History stats - rule only', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?ruleId=${enviornment.reviewHistory.ruleId}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.collectionHistoryEntryCount).to.equal(4)
            expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:30:38.000Z"))
        })
        it('History stats - status only', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?status=${enviornment.reviewHistory.status}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.collectionHistoryEntryCount).to.equal(3)
            expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
        })
        it('History stats - all params', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?endDate=${enviornment.reviewHistory.endDate}&startDate=${enviornment.reviewHistory.startDate}&assetId=${enviornment.reviewHistory.assetId}&status=${enviornment.reviewHistory.status}&ruleId=${enviornment.reviewHistory.ruleId}&projection=asset`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.collectionHistoryEntryCount).to.equal(1)
            expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T23:37:45.000Z"))
            expect(res.body.assetHistoryEntryCounts.length).to.eql(1)
        })
      })
      describe('getStigsByCollection - /collections/{collectionId}/stigs', () => {

        it('Return the STIGs mapped in the specified Collection', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/stigs`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            if(user.name === 'lvl1'){
              expect(res.body).to.be.an('array').of.length(1)
            }else{
              expect(res.body).to.be.an('array').of.length(2)
            }
            for(const stig of res.body){
              expect(enviornment.testCollection.validStigs).to.include(stig.benchmarkId)
              expect(stig.revisionPinned).to.equal(false)
            }
        })
        it('Return the STIGs mapped in the specified Collection - label', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/stigs?labelId=${enviornment.lvl1.label}`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            if(user.name === 'lvl1'){
              expect(res.body).to.be.an('array').of.length(1)
            }else{
              expect(res.body).to.be.an('array').of.length(2)
            }
            for(const stig of res.body){
              expect(enviornment.testCollection.validStigs).to.include(stig.benchmarkId)
              expect(stig.assetCount).to.equal(1)
            }
        })
        it('Return the STIGs mapped in the specified Collection - asset projection', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/stigs?projection=assets`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            if(user.name === 'lvl1'){
              expect(res.body).to.be.an('array').of.length(1)
            }else{
              expect(res.body).to.be.an('array').of.length(2)
            }
            for(const stig of res.body){
              expect(enviornment.testCollection.validStigs).to.include(stig.benchmarkId)
              const regex = new RegExp("asset")
              for(const asset of stig.assets){
                expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
                expect(asset.name).to.match(regex)
              }
            }
        })
      })
      describe('getStigByCollection - /collections/{collectionId}/stigs/{benchmarkId}', () => {

        it('Return Pinned Revision for this STIG', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/stigs/${enviornment.testCollection.benchmark}`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body.benchmarkId).to.equal(enviornment.testCollection.benchmark)
            expect(res.body.revisionStr).to.equal(enviornment.testCollection.revisionStr)
            expect(res.body.revisionPinned).to.equal(false)
        })
        it('Return the info about the specified STIG from the specified Collection - asset projection', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/stigs/${enviornment.testCollection.benchmark}?projection=assets`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body.benchmarkId).to.equal(enviornment.testCollection.benchmark)
            expect(res.body.revisionStr).to.equal(enviornment.testCollection.revisionStr)
            expect(res.body.revisionPinned).to.equal(false)
            const regex = new RegExp("asset")
            for(const asset of res.body.assets){
              expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
              expect(asset.name).to.match(regex)
            }
        })
      })
    })
  }
})

