const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const reviewEnv = require('../../reviewEnv.json')
const xml2js = require('xml2js');
const user =
  {
    "name": "stigmanadmin",
    "grant": "Owner",
    "token":
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ2ODEwMzUsImlhdCI6MTY3MDU0MDIzNiwiYXV0aF90aW1lIjoxNjcwNTQwMjM1LCJqdGkiOiI0N2Y5YWE3ZC1iYWM0LTQwOTgtOWJlOC1hY2U3NTUxM2FhN2YiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJiN2M3OGE2Mi1iODRmLTQ1NzgtYTk4My0yZWJjNjZmZDllZmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjMzNzhkYWZmLTA0MDQtNDNiMy1iNGFiLWVlMzFmZjczNDBhYyIsInNlc3Npb25fc3RhdGUiOiI4NzM2NWIzMy0yYzc2LTRiM2MtODQ4NS1mYmE1ZGJmZjRiOWYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImNyZWF0ZV9jb2xsZWN0aW9uIiwiZGVmYXVsdC1yb2xlcy1zdGlnbWFuIiwiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb24gc3RpZy1tYW5hZ2VyOnN0aWc6cmVhZCBzdGlnLW1hbmFnZXI6dXNlcjpyZWFkIHN0aWctbWFuYWdlcjpvcCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbjpyZWFkIHN0aWctbWFuYWdlcjpvcDpyZWFkIHN0aWctbWFuYWdlcjp1c2VyIHN0aWctbWFuYWdlciBzdGlnLW1hbmFnZXI6c3RpZyIsInNpZCI6Ijg3MzY1YjMzLTJjNzYtNGIzYy04NDg1LWZiYTVkYmZmNGI5ZiIsIm5hbWUiOiJTVElHTUFOIEFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3RpZ21hbmFkbWluIiwiZ2l2ZW5fbmFtZSI6IlNUSUdNQU4iLCJmYW1pbHlfbmFtZSI6IkFkbWluIn0.a1XwJZw_FIzwMXKo-Dr-n11me5ut-SF9ni7ylX-7t7AVrH1eAqyBxX9DXaxFK0xs6YOhoPsh9NyW8UFVaYgtF68Ps6yzoiqFEeiRXkpN5ygICN3H3z6r-YwanLlEeaYR3P2EtHRcrBtCnt0VEKKbGPWOfeiNCVe3etlp9-NQo44"
  }


describe('Collection delete tests using "admin" user ', () => {

    beforeEach(async function () {
        this.timeout(4000)
        await utils.loadAppData()
        await utils.uploadTestStigs()
    })
    
  describe('DELETE - deleteCollection - /collections/{collectionId}', () => {

    it('Delete a Collection', async () => {
        const res = await chai.request(config.baseUrl)
            .delete(`/collections/${reviewEnv.testCollection.collectionId}?elevate=true&projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)

        expect(res.body.collectionId).to.equal(reviewEnv.testCollection.collectionId)

        //assets
        for(const asset of res.body.assets){
            expect(asset.assetId).to.be.oneOf(reviewEnv.testCollection.assetIDsInCollection)
        }

        //grants
        for(const grant of res.body.grants){
            expect(grant.user.userId).to.be.oneOf(reviewEnv.testCollection.userIdsWithGrant)
        }

        // owners
        for(const owner of res.body.owners){
            expect(owner.userId).to.be.oneOf(reviewEnv.testCollection.owners)
        }

        //stigs
        for(const stig of res.body.stigs){
            expect(stig.benchmarkId).to.be.oneOf(reviewEnv.testCollection.validStigs)
        }

        //confirm that it is deleted
        const deletedCollection = await utils.getCollection(reviewEnv.testCollection.collectionId)
        expect(deletedCollection).to.be.undefined
    })
  })

  describe('DELETE - deleteCollectionLabelById - /collections/{collectionId}/labels/{labelId}', () => {

    it('Delete a Collection Label', async () => {
        const res = await chai.request(config.baseUrl)
            .delete(`/collections/${reviewEnv.scrapCollection.collectionId}/labels/${reviewEnv.scrapCollection.scrapLabel}`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(204)
        const collection = await utils.getCollection(reviewEnv.scrapCollection.collectionId)
        expect(collection.labels).to.not.include(reviewEnv.scrapCollection.scrapLabel)
    })
  })

  describe('DELETE - deleteCollectionMetadataKey - /collections/{collectionId}/metadata/keys/{key}', () => {

    it('Delete a Collection Metadata Key', async () => {
        const res = await chai.request(config.baseUrl)
            .delete(`/collections/${reviewEnv.testCollection.collectionId}/metadata/keys/${reviewEnv.testCollection.metadataKey}`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(204)
        const collection = await utils.getCollection(reviewEnv.testCollection.collectionId)
        expect(collection.metadata).to.not.have.property(reviewEnv.testCollection.metadataKey)
    })

  })

  describe('DELETE - deleteReviewHistoryByCollection - /collections/{collectionId}/review-history', () => {

    it('History records - date', async () => {
        const res = await chai.request(config.baseUrl)
            .delete(`/collections/${reviewEnv.testCollection.collectionId}/review-history?retentionDate=2020-10-01`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
      expect(res.body.HistoryEntriesDeleted).to.be.equal(6)
    })

    it('History records - date and asset', async () => {
        const res = await chai.request(config.baseUrl)
            .delete(`/collections/${reviewEnv.testCollection.collectionId}/review-history?retentionDate=2020-10-01&assetId=${reviewEnv.testAsset.assetId}`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
      expect(res.body.HistoryEntriesDeleted).to.be.equal(4)
    })
  })
})

