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

describe('Asset post tests using Admin User', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })
  
  describe(`POST - createAsset - /assets`, () => {

    it('Create an Asset (with stigs projection)', async () => {
      const res = await chai
        .request(config.baseUrl)
        .post('/assets?projection=stigs')
        .set('Authorization', 'Bearer ' + user.token)
        .send({
          name: 'TestAsset' + Math.floor(Math.random() * 1000),
          collectionId: assetEnv.testCollection.collectionId,
          description: 'test',
          ip: '1.1.1.1',
          noncomputing: true,
          labelIds: [assetEnv.testCollection.testLabel],
          metadata: {
            pocName: 'pocName',
            pocEmail: 'pocEmail@example.com',
            pocPhone: '12345',
            reqRar: 'true'
          },
          stigs: assetEnv.testCollection.validStigs
        }
      )
      
      expect(res).to.have.status(201)
      expect(assetGetToPost(res.body)).to.eql(res.request._data)

      const effectedAsset = await utils.getAsset(res.body.assetId)

      expect(effectedAsset.collection.collectionId).to.equal(assetEnv.testCollection.collectionId)
      for(const stig of effectedAsset.stigs) { 
        expect(stig.benchmarkId).to.be.oneOf(assetEnv.testCollection.validStigs)
      }
      expect(effectedAsset.description).to.equal('test')
    })

    it('Create an Asset (with statusStats projection', async () => {
      const res = await chai
        .request(config.baseUrl)
        .post('/assets?projection=statusStats')
        .set('Authorization', 'Bearer ' + user.token)
        .send({
          name: 'TestAsset' + Math.floor(Math.random() * 1000),
          collectionId: assetEnv.testCollection.collectionId,
          description: 'test',
          ip: '1.1.1.1',
          noncomputing: true,
          labelIds: [assetEnv.testCollection.testLabel],
          metadata: {
            pocName: 'pocName',
            pocEmail: 'pocEmail@example.com',
            pocPhone: '12345',
            reqRar: 'true'
          },
          stigs: assetEnv.testCollection.validStigs
        })
      
        expect(res).to.have.status(201)
        expect(res.body).to.have.property('statusStats')
        expect(res.body.statusStats.ruleCount).to.equal(368)

        const effectedAsset = await utils.getAsset(res.body.assetId)

        expect(effectedAsset.statusStats.ruleCount).to.equal(368)

    })

    it('Create an Asset (with stigGrants projection)', async () => {
      const res = await chai
        .request(config.baseUrl)
        .post('/assets?projection=stigGrants')
        .set('Authorization', 'Bearer ' + user.token)
        .send({
          name: 'TestAsset' + Math.floor(Math.random() * 1000),
          collectionId: assetEnv.testCollection.collectionId,
          description: 'test',
          ip: '1.1.1.1',
          noncomputing: true,
          labelIds: [assetEnv.testCollection.testLabel],
          metadata: {
            pocName: 'pocName',
            pocEmail: 'pocEmail@example.com',
            pocPhone: '12345',
            reqRar: 'true'
          },
          stigs: assetEnv.testCollection.validStigs
        })
      
      expect(res).to.have.status(201)
      expect(res.body).to.have.property('stigGrants')
      for(const stig of res.body.stigGrants) {
        expect(stig.benchmarkId).to.be.oneOf(assetEnv.testCollection.validStigs)
      }
      const effectedAsset = await utils.getAsset(res.body.assetId)
      for(const stig of effectedAsset.stigGrants) {
        expect(stig.benchmarkId).to.be.oneOf(assetEnv.testCollection.validStigs)
      }
    })
  })
  
})

function assetGetToPost (assetGet) {
  // extract the transformed and unposted properties
  const { assetId, collection, stigs, mac, fqdn, ...assetPost } = assetGet

  // add transformed properties to the derived post
  assetPost.collectionId = collection.collectionId
  assetPost.stigs = stigsGetToPost(stigs)

  // the derived post object
  return assetPost
}

function stigsGetToPost (stigsGetArray) {
  const stigsPostArray = []
  for (const stig of stigsGetArray) {
    stigsPostArray.push(stig.benchmarkId)
  }
  return stigsPostArray
}
