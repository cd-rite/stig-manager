const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../testConfig.json')
const utils = require('../utils/testUtils')
const assetEnv = require('../assetEnv.json')

const user =
  {
    "name": "admin",
    "grant": "Owner",
    "token":
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ2ODEwMzUsImlhdCI6MTY3MDU0MDIzNiwiYXV0aF90aW1lIjoxNjcwNTQwMjM1LCJqdGkiOiI0N2Y5YWE3ZC1iYWM0LTQwOTgtOWJlOC1hY2U3NTUxM2FhN2YiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJiN2M3OGE2Mi1iODRmLTQ1NzgtYTk4My0yZWJjNjZmZDllZmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjMzNzhkYWZmLTA0MDQtNDNiMy1iNGFiLWVlMzFmZjczNDBhYyIsInNlc3Npb25fc3RhdGUiOiI4NzM2NWIzMy0yYzc2LTRiM2MtODQ4NS1mYmE1ZGJmZjRiOWYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImNyZWF0ZV9jb2xsZWN0aW9uIiwiZGVmYXVsdC1yb2xlcy1zdGlnbWFuIiwiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb24gc3RpZy1tYW5hZ2VyOnN0aWc6cmVhZCBzdGlnLW1hbmFnZXI6dXNlcjpyZWFkIHN0aWctbWFuYWdlcjpvcCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbjpyZWFkIHN0aWctbWFuYWdlcjpvcDpyZWFkIHN0aWctbWFuYWdlcjp1c2VyIHN0aWctbWFuYWdlciBzdGlnLW1hbmFnZXI6c3RpZyIsInNpZCI6Ijg3MzY1YjMzLTJjNzYtNGIzYy04NDg1LWZiYTVkYmZmNGI5ZiIsIm5hbWUiOiJTVElHTUFOIEFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3RpZ21hbmFkbWluIiwiZ2l2ZW5fbmFtZSI6IlNUSUdNQU4iLCJmYW1pbHlfbmFtZSI6IkFkbWluIn0.a1XwJZw_FIzwMXKo-Dr-n11me5ut-SF9ni7ylX-7t7AVrH1eAqyBxX9DXaxFK0xs6YOhoPsh9NyW8UFVaYgtF68Ps6yzoiqFEeiRXkpN5ygICN3H3z6r-YwanLlEeaYR3P2EtHRcrBtCnt0VEKKbGPWOfeiNCVe3etlp9-NQo44"
  }


describe('Asset PATCH tests', () => {

  beforeEach(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  describe(`/assets/{assetId}`, () => {
   
    it('Merge provided properties with an Asset - Change Collection - Fail for all users', async () => {
      const res = await chai
        .request(config.baseUrl)
        .patch(`/assets/${assetEnv.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
        .set('Authorization', 'Bearer ' + user.token)
        .send({ 
          "collectionId": assetEnv.scraplvl1Collection,
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

    it('Merge provided properties with an Asset - Change Collection - valid for lvl3 and lvl4 only (IE works for admin for me)', async () => {
      const res = await chai
        .request(config.baseUrl)
        .patch(`/assets/${assetEnv.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
        .set('Authorization', 'Bearer ' + user.token)
        .send({
          "collectionId": assetEnv.scrapCollection,
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
        expect(res).to.have.status(200)
        expect(res.body.collection.collectionId).to.equal(assetEnv.scrapCollection)
        expect(res.body.labelIds).to.have.lengthOf(2)
        for (const stigGrant of res.body.stigGrants) {
          expect(stigGrant.users).to.have.lengthOf(0);
      }

      const effectedAsset = await utils.getAsset(res.body.assetId)
      expect(effectedAsset.collection.collectionId).to.equal(assetEnv.scrapCollection)
      expect(effectedAsset.description).to.equal('test desc')
      expect(effectedAsset.labelIds).to.have.lengthOf(2)
      for (const stig of effectedAsset.stigs) {
        expect(stig.benchmarkId).to.be.oneOf([
          'VPN_SRG_TEST',
          'Windows_10_STIG_TEST',
          'RHEL_7_STIG_TEST'
        ])
      }
      
    }) 
 
    it('Merge provided properties with an Asset', async () => {
    
      const res = await chai
        .request(config.baseUrl)
        .patch(`/assets/${assetEnv.scrapAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
        .set('Authorization', 'Bearer ' + user.token)
        .send({
          "collectionId": assetEnv.scrapCollection,
          "description": "scrap",
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
              "Windows_10_STIG_TEST",
              "RHEL_7_STIG_TEST"
          ]
      })
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body.collection.collectionId).to.equal(assetEnv.scrapCollection)
      expect(res.body.metadata).to.deep.equal({
        "pocName": "poc2Put",
        "pocEmail": "pocEmailPut@email.com",
        "pocPhone": "12342",
        "reqRar": "true"
      })

      const effectedAsset = await utils.getAsset(res.body.assetId)
      expect(effectedAsset.collection.collectionId).to.equal(assetEnv.scrapCollection)
      expect(effectedAsset.description).to.equal('scrap')
      expect(effectedAsset.metadata).to.deep.equal({
        "pocName": "poc2Put",
        "pocEmail": "pocEmailPut@email.com",
        "pocPhone": "12342",
        "reqRar": "true"
      })
    })
  })

  describe(`/assets`, () => {
 
    it('Delete Assets - expect success for valid users', async () => {
      const res = await chai
        .request(config.baseUrl)
        .patch(`/assets?collectionId=${assetEnv.testCollection.collectionId}`)
        .set('Authorization', 'Bearer ' + user.token)
        .send({
          "operation": "delete",
          "assetIds": ["29","42"]
        })
    
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.eql({
        "operation": "deleted",
        "assetIds": [
            "29",
            "42"
          ]})

      const effectedAsset = await utils.getAsset(res.body.assetId)
      expect(effectedAsset.response).to.have.status(400)
         
    })
    it('Delete Assets - assets not in collection', async () => {
        const res = await chai
          .request(config.baseUrl)
          .patch(`/assets?collectionId=${assetEnv.testCollection.collectionId}`)
          .set('Authorization', 'Bearer ' + user.token)
          .send({
            "operation": "delete",
            "assetIds": ["258","260"]
          })
          expect(res).to.have.status(403)
    })
    it('Delete Assets - collection does not exist', async () => {
      const res = await chai
        .request(config.baseUrl)
        .patch(`/assets?collectionId=${99999}`)
        .set('Authorization', 'Bearer ' + user.token)
        .send({
          "operation": "delete",
          "assetIds": ["29","42"]
        })
        expect(res).to.have.status(403)
    })
  })  

  describe(`/assets/{assetId}/metadata`, () => {

    it('Merge provided properties with an Asset - Change metadata', async () => {
      const res = await chai
        .request(config.baseUrl)
        .patch(`/assets/${assetEnv.scrapAsset.assetId}/metadata`)
        .set('Authorization', 'Bearer ' + user.token)
        .send({
          "testkey":"poc2Patched"
        })
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body).to.deep.equal({
          "testkey": "poc2Patched",
         })
        const effectedAsset = await utils.getAsset(assetEnv.scrapAsset.assetId)
        expect(effectedAsset.metadata).to.deep.equal({
          "testkey": "poc2Patched"
        })
    })
  })
})

