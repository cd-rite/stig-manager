const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')

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
        .put(`/assets/${environment.scrapAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
        .set('Authorization', 'Bearer ' + user.token)
        .send({
          "name": 'TestAsset' + Math.floor(Math.random() * 1000),
          "collectionId": environment.scrapCollection.collectionId,
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
      expect(effectedAsset.collection.collectionId).to.equal(environment.scrapCollection.collectionId)
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
        .put(`/assets/${environment.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
        .set('Authorization', 'Bearer ' + user.token)
        .send({
          "name": 'TestAsset' + Math.floor(Math.random() * 1000),
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
        expect(res.body.statusStats).to.exist

        expect(res.body.stigs).to.be.an('array').of.length(4)
        for (let stig of res.body.stigs) {
          expect(stig.benchmarkId).to.be.oneOf(environment.putStigs)
        }

        expect(res.body.stigGrants).to.be.an('array').of.length(4)
        for (let stig of res.body.stigGrants) {
          expect(stig.benchmarkId).to.be.oneOf(environment.putStigs)
        }

        const effectedAsset = await utils.getAsset(res.body.assetId)
        expect(effectedAsset.collection.collectionId).to.equal(environment.testCollection.collectionId)
        expect(effectedAsset.stigs).to.be.an('array').of.length(4)
        for (const stig of effectedAsset.stigs) {
          expect(stig.benchmarkId).to.be.oneOf(environment.putStigs)
        }
    })

    it('Set all properties of an Asset- with metadata', async function () {
      const res = await chai.request(config.baseUrl)
        .put(`/assets/${environment.scrapAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
        .set('Authorization', 'Bearer ' + user.token)
        .send({
          "name":'TestAsset' + Math.floor(Math.random() * 1000),
          "collectionId": environment.scrapCollection.collectionId,
          "description": "test desc",
          "ip": "1.1.1.1",
          "noncomputing": true,
          "metadata" : {
            [environment.scrapAsset.metadataKey]: environment.scrapAsset.metadataValue
          },
          "stigs": [
              "VPN_SRG_TEST",
              "Windows_10_STIG_TEST",
              "RHEL_7_STIG_TEST"
          ]
      })
      expect(res).to.have.status(200)
      expect(res.body.metadata).to.exist
      expect(res.body.metadata).to.have.property(environment.scrapAsset.metadataKey)
      expect(res.body.metadata[environment.scrapAsset.metadataKey]).to.equal(environment.scrapAsset.metadataValue)

      const effectedAsset = await utils.getAsset(res.body.assetId)
      expect(effectedAsset.metadata).to.exist
      expect(effectedAsset.metadata).to.have.property(environment.scrapAsset.metadataKey)
      expect(effectedAsset.metadata[environment.scrapAsset.metadataKey]).to.equal(environment.scrapAsset.metadataValue)

    })

    it('Set all properties of an Asset - Change Collection - invalid for all users', async function () {
      const res = await chai.request(config.baseUrl)
        .put(`/assets/${environment.scrapAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
        .set('Authorization', 'Bearer ' + user.token)
        .send({
          "name": 'TestAsset' + Math.floor(Math.random() * 1000),
          "collectionId": environment.scrapLvl1User.userId,
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
        .put(`/assets/${environment.scrapAsset.assetId}/metadata`)
        .set('Authorization', 'Bearer ' + user.token)
        .send({
          [environment.scrapAsset.metadataKey]: environment.scrapAsset.metadataValue
        })
      expect(res).to.have.status(200)
      expect(res.body).to.have.property(environment.scrapAsset.metadataKey)
      expect(res.body[environment.scrapAsset.metadataKey]).to.equal(environment.scrapAsset.metadataValue)

      const effectedAsset = await utils.getAsset(environment.scrapAsset.assetId)
      expect(effectedAsset.metadata).to.exist
      expect(effectedAsset.metadata).to.have.property(environment.scrapAsset.metadataKey)
    })
  })
  describe(`PUT - putAssetMetadataValue - /assets/{assetId}/metadata/keys/{key}`, () => {
   
    it('Set one metadata key/value of an Asset', async function () {
      const res = await chai.request(config.baseUrl)
        .put(`/assets/${environment.scrapAsset.assetId}/metadata/keys/${environment.scrapAsset.metadataKey}`)
        .set('Authorization', 'Bearer ' + user.token)
        .set('Content-Type', 'application/json') 
        .send(`${JSON.stringify(environment.scrapAsset.metadataValue)}`)

      expect(res).to.have.status(204)
      const effectedAsset = await utils.getAsset(environment.scrapAsset.assetId)
      expect(effectedAsset.metadata).to.exist
      expect(effectedAsset.metadata).to.have.property(environment.scrapAsset.metadataKey)
    })
  })
  describe(`PUT - attachStigToAsset - /assets/{assetId}/stigs/{benchmarkId}`, () => {
  
    it('PUT a STIG assignment to an Asset Copy 3', async function () {
      const res = await chai.request(config.baseUrl)
        .put(`/assets/${environment.scrapAsset.assetId}/stigs/${environment.scrapAsset.scrapBenchmark}`)
        .set('Authorization', 'Bearer ' + user.token)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array').of.length(3)
      for (let stig of res.body) {
        if (stig.benchmarkId === environment.scrapAsset.scrapBenchmark) {
          expect(stig.benchmarkId).to.equal(environment.scrapAsset.scrapBenchmark)
        }
      }
      const effectedAsset = await utils.getAsset(environment.scrapAsset.assetId)
      expect(effectedAsset.stigs).to.be.an('array').of.length(3)
      for (let stig of effectedAsset.stigs) {
        if (stig.benchmarkId === environment.scrapAsset.scrapBenchmark) {
          expect(stig.benchmarkId).to.equal(environment.scrapAsset.scrapBenchmark)
        }
      }
    })
  })
  describe(`PUT - putAssetsByCollectionLabelId - /collections/{collectionId}/labels/{labelId}/assets`, () => {
   
    it('Replace a Labels Asset Mappings in a Collection', async function () {
      const res = await chai.request(config.baseUrl)
        .put(`/collections/${environment.testCollection.collectionId}/labels/${environment.testCollection.testLabel}/assets`)
        .set('Authorization', 'Bearer ' + user.token)
        .send([environment.testAsset.assetId])
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array').of.length(1)
      expect(res.body[0].assetId).to.equal(environment.testAsset.assetId)

      const effectedAsset = await utils.getAssetsByLabel(environment.testCollection.collectionId, environment.testCollection.testLabel)
      expect(effectedAsset).to.have.lengthOf(1)
      expect(effectedAsset[0].assetId).to.equal(environment.testAsset.assetId)
    })
    
    it('Replace a Labels Asset Mappings in a Collection assign to an asset that does not exist', async function () {
      const res = await chai.request(config.baseUrl)
        .put(`/collections/${environment.testCollection.collectionId}/labels/${environment.testCollection.testLabel}/assets`)
        .set('Authorization', 'Bearer ' + user.token)
        .send(["9999"])
      expect(res).to.have.status(403)
    })
  })

})

