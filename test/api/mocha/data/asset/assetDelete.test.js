const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const enviornment = require('../../enviornment.json')

const user =
  {
    "name": "admin",
    "grant": "Owner",
    "token":
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ2ODEwMzUsImlhdCI6MTY3MDU0MDIzNiwiYXV0aF90aW1lIjoxNjcwNTQwMjM1LCJqdGkiOiI0N2Y5YWE3ZC1iYWM0LTQwOTgtOWJlOC1hY2U3NTUxM2FhN2YiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJiN2M3OGE2Mi1iODRmLTQ1NzgtYTk4My0yZWJjNjZmZDllZmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjMzNzhkYWZmLTA0MDQtNDNiMy1iNGFiLWVlMzFmZjczNDBhYyIsInNlc3Npb25fc3RhdGUiOiI4NzM2NWIzMy0yYzc2LTRiM2MtODQ4NS1mYmE1ZGJmZjRiOWYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImNyZWF0ZV9jb2xsZWN0aW9uIiwiZGVmYXVsdC1yb2xlcy1zdGlnbWFuIiwiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb24gc3RpZy1tYW5hZ2VyOnN0aWc6cmVhZCBzdGlnLW1hbmFnZXI6dXNlcjpyZWFkIHN0aWctbWFuYWdlcjpvcCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbjpyZWFkIHN0aWctbWFuYWdlcjpvcDpyZWFkIHN0aWctbWFuYWdlcjp1c2VyIHN0aWctbWFuYWdlciBzdGlnLW1hbmFnZXI6c3RpZyIsInNpZCI6Ijg3MzY1YjMzLTJjNzYtNGIzYy04NDg1LWZiYTVkYmZmNGI5ZiIsIm5hbWUiOiJTVElHTUFOIEFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3RpZ21hbmFkbWluIiwiZ2l2ZW5fbmFtZSI6IlNUSUdNQU4iLCJmYW1pbHlfbmFtZSI6IkFkbWluIn0.a1XwJZw_FIzwMXKo-Dr-n11me5ut-SF9ni7ylX-7t7AVrH1eAqyBxX9DXaxFK0xs6YOhoPsh9NyW8UFVaYgtF68Ps6yzoiqFEeiRXkpN5ygICN3H3z6r-YwanLlEeaYR3P2EtHRcrBtCnt0VEKKbGPWOfeiNCVe3etlp9-NQo44"
  }

describe('Asset delete tests admin user', () => {

  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  describe(`DELETE - deleteAssetMetadataKey - /assets/{assetId}/metadata/keys/{key}`, () => {
    it('Delete one metadata key/value of an Asset', async () => {
      const res = await chai
        .request(config.baseUrl)
        .delete(`/assets/${enviornment.scrapAsset.assetId}/metadata/keys/${enviornment.scrapAsset.metadataKey}`)
        .set('Content-Type', 'application/json') 
        .set('Authorization', 'Bearer ' + user.token)
        .send(`${JSON.stringify(enviornment.scrapAsset.metadataValue)}`)

      expect(res).to.have.status(204)
      
      const asset = await utils.getAsset(enviornment.scrapAsset.assetId)
      expect(asset.metadata).to.not.have.property(enviornment.scrapAsset.metadataKey)
    })
  })
  describe(`DELETE - removeStigsFromAsset -/assets/{assetId}/stigs`, () => {
    it('Delete all STIG assignments to an Asset', async () => {
      const res = await chai
        .request(config.baseUrl)
        .delete(`/assets/${enviornment.scrapAsset.assetId}/stigs`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')

      const asset = await utils.getAsset(enviornment.scrapAsset.assetId)
      expect(asset.stigs).to.be.an('array').that.is.empty
      
    })
  })
  describe(`DELETE - removeStigFromAsset - /assets/{assetId}/stigs/{benchmarkId}`, () => {
    it('Delete a STIG assignment to an Asset', async () => {
      const res = await chai
        .request(config.baseUrl)
        .delete(`/assets/${enviornment.scrapAsset.assetId}/stigs/${enviornment.scrapAsset.scrapBenchmark}`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)

      const asset = await utils.getAsset(enviornment.scrapAsset.assetId)
      expect(asset.stigs).to.not.include(enviornment.scrapAsset.scrapBenchmark)
    })
  })
  describe(`DELETE - deleteAsset - /assets/{assetId}`, () => {
    before(async function () {
      this.timeout(4000)
      await utils.loadAppData()
      await utils.uploadTestStigs()
      await utils.createDisabledCollectionsandAssets()
    })

    it('Delete an Asset in test collection', async () => {

      // creating a test asset to delete
      // this might need preivledges? 
      const tempAsset = await utils.createTempAsset({
          name: 'tempAsset',
          collectionId: enviornment.scrapCollection.collectionId,
          description: 'temp',
          ip: '1.1.1.1',
          noncomputing: true,
          labelIds: [],
          metadata: {
            pocName: 'pocName',
            pocEmail: 'pocEmail@example.com',
            pocPhone: '12345',
            reqRar: 'true'
          },
          stigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST']
        })

      const assetId = tempAsset.data.assetId
      const res = await chai
        .request(config.baseUrl)
        .delete(`/assets/${assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
        .set('Authorization', 'Bearer ' + user.token)

     expect(res).to.have.status(200)
     expect(res.body).to.have.property('assetId')
     expect(res.body.assetId).to.equal(assetId)

     
    })

    it('Delete test Asset', async () => {
      const res = await chai
        .request(config.baseUrl)
        .delete(`/assets/${enviornment.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
        .set('Authorization', 'Bearer ' + user.token) 
      
      expect(res).to.have.status(200)
      expect(res.body).to.have.property('assetId')
      expect(res.body.assetId).to.equal(enviornment.testAsset.assetId)
    })
  })
})


