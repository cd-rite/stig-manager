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

describe('Collection patch tests using "admin" user ', () => {

    before(async function () {
        this.timeout(4000)
        await utils.loadAppData()
        await utils.uploadTestStigs()
    })
    
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
            .patch(`/collections/${enviornment.scrapCollection.collectionId}?elevate=true&projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs`)
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

