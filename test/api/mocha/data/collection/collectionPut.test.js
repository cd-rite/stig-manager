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

describe('Collection put tests using "admin" user ', () => {

    before(async function () {
        this.timeout(4000)
        await utils.loadAppData()
        await utils.uploadTestStigs()
        await utils.createDisabledCollectionsandAssets()
    })
    
  describe('PUT - replaceCollection - /collections/{collectionId}', () => {

    it('Set all properties of a Collection', async () => {

        const putRequest = {
          name: "SetAllProperties",
          description: "test",
          settings: {
            fields: {
              detail: {
                enabled: "always",
                required: "findings",
              },
              comment: {
                enabled: "always",
                required: "findings",
              },
            },
            status: {
              canAccept: true,
              minAcceptGrant: 2,
              resetCriteria: "result",
            },
          },
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
              accessLevel: 2,
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
            .put(`/collections/${enviornment.testCollection.collectionId}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(putRequest)

            expect(res).to.have.status(200)
            expect(res.body.description).to.equal("test")
            expect(res.body.name).to.equal("SetAllProperties")
            expect(res.body.settings.fields.detail.enabled).to.equal(putRequest.settings.fields.detail.enabled)
            expect(res.body.settings.fields.detail.required).to.equal(putRequest.settings.fields.detail.required)
            expect(res.body.settings.fields.comment.enabled).to.equal(putRequest.settings.fields.comment.enabled)
            expect(res.body.settings.fields.comment.required).to.equal(putRequest.settings.fields.comment.required)
            expect(res.body.settings.status.canAccept).to.equal(putRequest.settings.status.canAccept)
            expect(res.body.settings.status.minAcceptGrant).to.equal(putRequest.settings.status.minAcceptGrant)
            expect(res.body.settings.status.resetCriteria).to.equal(putRequest.settings.status.resetCriteria)
            expect(res.body.metadata.pocName).to.equal(putRequest.metadata.pocName)
            expect(res.body.metadata.pocEmail).to.equal(putRequest.metadata.pocEmail)
            expect(res.body.metadata.pocPhone).to.equal(putRequest.metadata.pocPhone)
            expect(res.body.metadata.reqRar).to.equal(putRequest.metadata.reqRar)
    })

    it('Set all properties of a Collection- with metadata', async () => {

        const putRequest = {
            name: "TestPutCollection",
            settings: {
            fields: {
                detail: {
                enabled: "findings",
                required: "findings",
                },
                comment: {
                enabled: "always",
                required: "findings",
                },
            },
            status: {
                canAccept: true,
                minAcceptGrant: 2,
                resetCriteria: "result",
            },
            },

            description: "hellodescription",
            metadata: {
            [enviornment.testCollection.metadataKey]: enviornment.testCollection.metadataValue,
            },
            grants: [
            {
                userId: "1",
                accessLevel: 4,
            },
            {
                userId: "21",
                accessLevel: 2,
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
            .put(`/collections/${enviornment.testCollection.collectionId}?elevate=true&projection=grants&projection=owners&projection=statistics&projection=stigs&projection=assets`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(putRequest    )
        expect(res).to.have.status(200)
        expect(res.body.description).to.equal("hellodescription")
        expect(res.body.name).to.equal("TestPutCollection")
        expect(res.body.settings.fields.detail.enabled).to.equal(putRequest.settings.fields.detail.enabled)
        expect(res.body.settings.fields.detail.required).to.equal(putRequest.settings.fields.detail.required)
        expect(res.body.settings.fields.comment.enabled).to.equal(putRequest.settings.fields.comment.enabled)
        expect(res.body.settings.fields.comment.required).to.equal(putRequest.settings.fields.comment.required)
        expect(res.body.settings.status.canAccept).to.equal(putRequest.settings.status.canAccept)
        expect(res.body.settings.status.minAcceptGrant).to.equal(putRequest.settings.status.minAcceptGrant)
        expect(res.body.settings.status.resetCriteria).to.equal(putRequest.settings.status.resetCriteria)
        expect(res.body.metadata.testkey).to.equal(enviornment.testCollection.metadataValue)

        // grants projection
        expect(res.body.grants).to.have.lengthOf(5)
        for(const grant of res.body.grants){
           expect(grant.user.userId).to.be.oneOf(putRequest.grants.map(g => g.userId))
        }
    
        // assets projection
        expect(res.body.assets).to.have.lengthOf(4)

        // owners projection
        expect(res.body.owners).to.have.lengthOf(3)

        // statistics projection
        expect(res.body.statistics.assetCount).to.equal(4)
        expect(res.body.statistics.checklistCount).to.equal(6)
        expect(res.body.statistics.grantCount).to.equal(5)
    
        // stigs projection
        expect(res.body.stigs).to.have.lengthOf(2)

    })
  })

  describe('PUT - setStigAssetsByCollectionUser - /collections/{collectionId}/grants/{userId}/access', () => {

    it('set stig-asset grants for a lvl1 user in this collection.', async () => {

        const res = await chai.request(config.baseUrl)
            .put(`/collections/${enviornment.scrapCollection.collectionId}/grants/${enviornment.scrapLvl1User.userId}/access`)
            .set('Authorization', `Bearer ${user.token}`)
            .send([{
                  "benchmarkId": enviornment.scrapAsset.scrapBenchmark,
                  "assetId": enviornment.scrapAsset.assetId,
              }])
        expect(res).to.have.status(200)
        expect(res.body).to.have.lengthOf(1)
        for(const item of res.body){
            expect(item.benchmarkId).to.equal(enviornment.scrapAsset.scrapBenchmark)
            expect(item.asset.assetId).to.equal(enviornment.scrapAsset.assetId)
            
        }
    })
  })


  describe('PUT - putCollectionMetadata - /collections/{collectionId}/metadata', () => {

    it('Set all metadata of a Collection', async () => {

        const putRequest = {
            [enviornment.testCollection.metadataKey]: enviornment.testCollection.metadataValue
        }

        const res = await chai.request(config.baseUrl)
            .put(`/collections/${enviornment.testCollection.collectionId}/metadata`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(putRequest)
        expect(res).to.have.status(200)
        expect(res.body[enviornment.testCollection.metadataKey]).to.equal(enviornment.testCollection.metadataValue)
    })
  })

  describe('PUT - putCollectionMetadataValue - /collections/{collectionId}/metadata/keys/{key}', () => {

    it('Set one metadata key/value of a Collection', async () => {
          const res = await chai.request(config.baseUrl)
              .put(`/collections/${enviornment.testCollection.collectionId}/metadata/keys/${enviornment.testCollection.metadataKey}`)
              .set('Authorization', `Bearer ${user.token}`)
              .set('Content-Type', 'application/json') 
              .send(`${JSON.stringify(enviornment.testCollection.metadataValue)}`)
          expect(res).to.have.status(204)
    })
  })

})

