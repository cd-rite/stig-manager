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


describe('Asset PUT tests', () => {

  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  describe(`PUT - replaceAsset -/assets/{assetId}`, () => {
    
    it('Set all properties of an Asset', async function () {
      const res = await chai.request(config.baseUrl)
        .put(`/assets/${enviornment.scrapAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
        .set('Authorization', 'Bearer ' + user.token)
        .send({
          "name": 'TestAsset' + Math.floor(Math.random() * 1000),
          "collectionId": enviornment.scrapCollection.collectionId,
          "description": "test desc",
          "ip": "1.1.1.1",
          "noncomputing": true,
          "labelIds": [
              "df4e6836-a003-11ec-b1bc-0242ac110002"
          ],
          "metadata": {
              "pocName": "poc2Put",
              "pocEmail": "pocEmailPut@email.com",
              "pocPhone": "12342",
              "reqRar": "true"
          },
          "stigs": [
              "VPN_SRG_TEST",
              "Windows_10_STIG_TEST",
              "RHEL_7_STIG_TEST"
          ]
      })

      expect(res).to.have.status(200)
      expect(res.body.statusStats).to.exist
      expect(res.body.stigs).to.be.an('array').of.length(3)
      for (let stig of res.body.stigs) {
        expect(stig.benchmarkId).to.be.oneOf([
          "VPN_SRG_TEST",
          "Windows_10_STIG_TEST",
          "RHEL_7_STIG_TEST"
      ])
      }
      expect(res.body.stigGrants).to.be.an('array').of.length(3)
      for (let stig of res.body.stigGrants) {
        expect(stig.benchmarkId).to.be.oneOf([
          "VPN_SRG_TEST",
          "Windows_10_STIG_TEST",
          "RHEL_7_STIG_TEST"
      ])
      }
      const effectedAsset = await utils.getAsset(res.body.assetId)
      expect(effectedAsset.collection.collectionId).to.equal(enviornment.scrapCollection.collectionId)
      expect(effectedAsset.description).to.equal('test desc')
      expect(effectedAsset.labelIds).to.have.lengthOf(1)
      expect(effectedAsset.stigs).to.be.an('array').of.length(3)
      for (const stig of effectedAsset.stigs) {
        expect(stig.benchmarkId).to.be.oneOf([
          'VPN_SRG_TEST',
          'Windows_10_STIG_TEST',
          'RHEL_7_STIG_TEST'
        ])
      }

    })

    it('Set all properties of an Asset - assign new STIG', async function () {
      const res = await chai.request(config.baseUrl)
        .put(`/assets/${enviornment.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
        .set('Authorization', 'Bearer ' + user.token)
        .send({
          "name": 'TestAsset' + Math.floor(Math.random() * 1000),
          "collectionId": enviornment.testCollection.collectionId,
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
        expect(res.body.statusStats).to.exist

        expect(res.body.stigs).to.be.an('array').of.length(4)
        for (let stig of res.body.stigs) {
          expect(stig.benchmarkId).to.be.oneOf(enviornment.putStigs)
        }

        expect(res.body.stigGrants).to.be.an('array').of.length(4)
        for (let stig of res.body.stigGrants) {
          expect(stig.benchmarkId).to.be.oneOf(enviornment.putStigs)
        }

        const effectedAsset = await utils.getAsset(res.body.assetId)
        expect(effectedAsset.collection.collectionId).to.equal(enviornment.testCollection.collectionId)
        expect(effectedAsset.stigs).to.be.an('array').of.length(4)
        for (const stig of effectedAsset.stigs) {
          expect(stig.benchmarkId).to.be.oneOf(enviornment.putStigs)
        }
    })

    it('Set all properties of an Asset- with metadata', async function () {
      const res = await chai.request(config.baseUrl)
        .put(`/assets/${enviornment.scrapAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
        .set('Authorization', 'Bearer ' + user.token)
        .send({
          "name":'TestAsset' + Math.floor(Math.random() * 1000),
          "collectionId": enviornment.scrapCollection.collectionId,
          "description": "test desc",
          "ip": "1.1.1.1",
          "noncomputing": true,
          "metadata" : {
            [enviornment.scrapAsset.metadataKey]: enviornment.scrapAsset.metadataValue
          },
          "stigs": [
              "VPN_SRG_TEST",
              "Windows_10_STIG_TEST",
              "RHEL_7_STIG_TEST"
          ]
      })
      expect(res).to.have.status(200)
      expect(res.body.metadata).to.exist
      expect(res.body.metadata).to.have.property(enviornment.scrapAsset.metadataKey)
      expect(res.body.metadata[enviornment.scrapAsset.metadataKey]).to.equal(enviornment.scrapAsset.metadataValue)

      const effectedAsset = await utils.getAsset(res.body.assetId)
      expect(effectedAsset.metadata).to.exist
      expect(effectedAsset.metadata).to.have.property(enviornment.scrapAsset.metadataKey)
      expect(effectedAsset.metadata[enviornment.scrapAsset.metadataKey]).to.equal(enviornment.scrapAsset.metadataValue)

    })

    it('Set all properties of an Asset - Change Collection - invalid for all users', async function () {
      const res = await chai.request(config.baseUrl)
        .put(`/assets/${enviornment.scrapAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
        .set('Authorization', 'Bearer ' + user.token)
        .send({
          "name": 'TestAsset' + Math.floor(Math.random() * 1000),
          "collectionId": enviornment.scrapLvl1User.userId,
          "description": "test desc",
          "ip": "1.1.1.1",
          "noncomputing": true,
          "metadata": {},
          "stigs": [
              "VPN_SRG_TEST",
              "Windows_10_STIG_TEST",
              "RHEL_7_STIG_TEST"
          ]
        })
      expect(res).to.have.status(403)
    })
  })
  
  describe(`PUT - putAssetMetadata - /assets/{assetId}/metadata`, () => {

    it('Set metadata of an Asset', async function () {
      const res = await chai.request(config.baseUrl)
        .put(`/assets/${enviornment.scrapAsset.assetId}/metadata`)
        .set('Authorization', 'Bearer ' + user.token)
        .send({
          [enviornment.scrapAsset.metadataKey]: enviornment.scrapAsset.metadataValue
        })
      expect(res).to.have.status(200)
      expect(res.body).to.have.property(enviornment.scrapAsset.metadataKey)
      expect(res.body[enviornment.scrapAsset.metadataKey]).to.equal(enviornment.scrapAsset.metadataValue)

      const effectedAsset = await utils.getAsset(enviornment.scrapAsset.assetId)
      expect(effectedAsset.metadata).to.exist
      expect(effectedAsset.metadata).to.have.property(enviornment.scrapAsset.metadataKey)
    })
  })
  describe(`PUT - putAssetMetadataValue - /assets/{assetId}/metadata/keys/{key}`, () => {
   
    it('Set one metadata key/value of an Asset', async function () {
      const res = await chai.request(config.baseUrl)
        .put(`/assets/${enviornment.scrapAsset.assetId}/metadata/keys/${enviornment.scrapAsset.metadataKey}`)
        .set('Authorization', 'Bearer ' + user.token)
        .set('Content-Type', 'application/json') 
        .send(`${JSON.stringify(enviornment.scrapAsset.metadataValue)}`)

      expect(res).to.have.status(204)
      const effectedAsset = await utils.getAsset(enviornment.scrapAsset.assetId)
      expect(effectedAsset.metadata).to.exist
      expect(effectedAsset.metadata).to.have.property(enviornment.scrapAsset.metadataKey)
    })
  })
  describe(`PUT - attachStigToAsset - /assets/{assetId}/stigs/{benchmarkId}`, () => {
  
    it('PUT a STIG assignment to an Asset Copy 3', async function () {
      const res = await chai.request(config.baseUrl)
        .put(`/assets/${enviornment.scrapAsset.assetId}/stigs/${enviornment.scrapAsset.scrapBenchmark}`)
        .set('Authorization', 'Bearer ' + user.token)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array').of.length(3)
      for (let stig of res.body) {
        if (stig.benchmarkId === enviornment.scrapAsset.scrapBenchmark) {
          expect(stig.benchmarkId).to.equal(enviornment.scrapAsset.scrapBenchmark)
        }
      }
      const effectedAsset = await utils.getAsset(enviornment.scrapAsset.assetId)
      expect(effectedAsset.stigs).to.be.an('array').of.length(3)
      for (let stig of effectedAsset.stigs) {
        if (stig.benchmarkId === enviornment.scrapAsset.scrapBenchmark) {
          expect(stig.benchmarkId).to.equal(enviornment.scrapAsset.scrapBenchmark)
        }
      }
    })
  })
  describe(`PUT - putAssetsByCollectionLabelId - /collections/{collectionId}/labels/{labelId}/assets`, () => {
   
    it('Replace a Labels Asset Mappings in a Collection', async function () {
      const res = await chai.request(config.baseUrl)
        .put(`/collections/${enviornment.testCollection.collectionId}/labels/${enviornment.testCollection.testLabel}/assets`)
        .set('Authorization', 'Bearer ' + user.token)
        .send([enviornment.testAsset.assetId])
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array').of.length(1)
      expect(res.body[0].assetId).to.equal(enviornment.testAsset.assetId)

      const effectedAsset = await utils.getAssetsByLabel(enviornment.testCollection.collectionId, enviornment.testCollection.testLabel)
      expect(effectedAsset).to.have.lengthOf(1)
      expect(effectedAsset[0].assetId).to.equal(enviornment.testAsset.assetId)
    })
    
    it('Replace a Labels Asset Mappings in a Collection assign to an asset that does not exist', async function () {
      const res = await chai.request(config.baseUrl)
        .put(`/collections/${enviornment.testCollection.collectionId}/labels/${enviornment.testCollection.testLabel}/assets`)
        .set('Authorization', 'Bearer ' + user.token)
        .send(["9999"])
      expect(res).to.have.status(403)
    })
  })

})

