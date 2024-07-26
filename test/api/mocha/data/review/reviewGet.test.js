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

const lvl1=
{
  "name": "lvl1",
  "grant": "Restricted",
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ3MDg5ODQsImlhdCI6MTY3MDU2ODE4NCwiYXV0aF90aW1lIjoxNjcwNTY4MTg0LCJqdGkiOiIxMDhmMDc2MC0wYmY5LTRkZjEtYjE0My05NjgzNmJmYmMzNjMiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJlM2FlMjdiOC1kYTIwLTRjNDItOWRmOC02MDg5ZjcwZjc2M2IiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjE0ZmE5ZDdkLTBmZTAtNDQyNi04ZmQ5LTY5ZDc0YTZmMzQ2NCIsInNlc3Npb25fc3RhdGUiOiJiNGEzYWNmMS05ZGM3LTQ1ZTEtOThmOC1kMzUzNjJhZWM0YzciLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtc3RpZ21hbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InJlYWxtLW1hbmFnZW1lbnQiOnsicm9sZXMiOlsidmlldy11c2VycyIsInF1ZXJ5LWdyb3VwcyIsInF1ZXJ5LXVzZXJzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbiBzdGlnLW1hbmFnZXI6c3RpZzpyZWFkIHN0aWctbWFuYWdlcjp1c2VyOnJlYWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb246cmVhZCIsInNpZCI6ImI0YTNhY2YxLTlkYzctNDVlMS05OGY4LWQzNTM2MmFlYzRjNyIsIm5hbWUiOiJyZXN0cmljdGVkIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibHZsMSIsImdpdmVuX25hbWUiOiJyZXN0cmljdGVkIn0.OqLARi5ILt3j2rMikXy0ECTTqjWco0-CrMwzE88gUv2i8rVO9kMgVsXbtPk2L2c9NNNujnxqg7QIr2_sqA51saTrZHvzXcsT8lBruf74OubRMwcTQqJap-COmrzb60S7512k0WfKTYlHsoCn_uAzOb9sp8Trjr0NksU8OXCElDU"
}

describe('Review GETS tests using "admin" user ', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  describe('GET - getReviewsByCollection - /collections/{collectionId}/reviews', () => {
    it('Return a list of reviews accessible to the requester', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews?projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${user.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')

      for(let review of res.body){
        // checking for basic properties
        expect(review).to.have.property('assetId')
        expect(review).to.have.property('assetLabelIds')
        expect(review).to.have.property('assetName')
        expect(review).to.have.property('resultEngine')
        expect(review).to.have.property('detail')
        expect(review).to.have.property('status')

        //check projectrions 
        expect(review).to.have.property('rule')
        expect(review).to.have.property('stigs')
        expect(review.stigs).to.be.an('array')  
        expect(review).to.have.property('metadata')

        expect(review.assetId).to.be.oneOf(enviornment.testCollection.assetIDsInCollection)

        for(let stig of review.stigs){
          expect(stig).to.have.property('benchmarkId')
          expect(stig.benchmarkId).to.be.oneOf(enviornment.testCollection.validStigs)
        }

        //check metadata
        expect(review.metadata).to.be.an('object')
     
        //check rule
        expect(review.rule).to.be.an('object')
        expect(review.rule).to.have.property('ruleId')
        
      }
    })
    it('Return a list of reviews accessible to the requester, assetId Projection.', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews?assetId=${enviornment.testAsset.assetId}&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${user.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(9)

      
      for(let review of res.body){
        // checking for basic properties
        expect(review).to.have.property('assetId')
        expect(review.assetId).to.be.equal(enviornment.testAsset.assetId)

        expect(review).to.have.property('assetLabelIds')

        for(let assetLabelId of review.assetLabelIds){
          expect(assetLabelId).to.be.oneOf(enviornment.testAsset.labels)
        }

        expect(review.metadata).to.be.an('object')
        
        for(let stig of review.stigs){
          expect(stig).to.have.property('benchmarkId')
          expect(stig.benchmarkId).to.be.oneOf(enviornment.testCollection.validStigs)
        }
        expect(review.rule).to.be.an('object')
        expect(review.rule).to.have.property('ruleId')
        
      }
    })
    it('Return a list of reviews accessible to the requester, benchmarkId Projection.', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews?benchmarkId=${enviornment.testCollection.benchmark}&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${user.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(14)

      for(let review of res.body){
        for(let stig of review.stigs){
          expect(stig).to.have.property('benchmarkId')
          expect(stig.benchmarkId).to.be.equal(enviornment.testCollection.benchmark)
        }        
      }
    })
    it('Return a list of reviews accessible to the requester, metadata Projection.', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews?projection=rule&projection=stigs&metadata=${enviornment.testCollection.metadataKey}%3A${enviornment.testCollection.metadataValue}&projection=metadata`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body).to.be.lengthOf(1)

      for(let review of res.body){
        expect(review.metadata).to.be.an('object')
        expect(review.metadata).to.have.property(enviornment.testCollection.metadataKey)
        expect(review.metadata[enviornment.testCollection.metadataKey]).to.be.equal(enviornment.testCollection.metadataValue)
      }
    })
    it('Return a list of reviews accessible to the requester, result projection fail only', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews?result=fail&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${user.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(8)

      for(let review of res.body){
        expect(review.result).to.be.equal('fail')
      }
    })
    it('Return a list of reviews accessible to the requester, ruleid projection', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews?ruleId=${enviornment.testCollection.ruleId}&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${user.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(3)

      for(let review of res.body){
        expect(review.ruleId).to.be.equal(enviornment.testCollection.ruleId)
        expect(review.rule.ruleId).to.be.equal(enviornment.testCollection.ruleId)
        expect(review.ruleIds).to.include(enviornment.testCollection.ruleId)
      }
    })
    it('Return a list of reviews accessible to the requester, status projection: saved.', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews?status=saved&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${user.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(6)

      for(let review of res.body){
        expect(review.status.label).to.be.equal('saved')
      }
    })
    it('Return a list of reviews accessible to the requester, userId projection.', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews?userId=${enviornment.stigmanadmin.userId}&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${user.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(14)

      for(let review of res.body){
        expect(review.userId).to.be.equal(enviornment.stigmanadmin.userId)
      }
    })
  })
  describe('GET - getReviewsByAsset - /collections/{collectionId}/reviews/{assetId}', () => {
    it('Return a list of Reviews for an Asset', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}?projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${user.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')


      for(let review of res.body){
        // checking for basic properties
        expect(review).to.have.property('assetId')
        expect(review.assetId).to.be.equal(enviornment.testAsset.assetId)
        expect(review).to.have.property('assetLabelIds')
        expect(review).to.have.property('assetName')
        expect(review).to.have.property('resultEngine')
        expect(review).to.have.property('detail')
        expect(review).to.have.property('status')

        //check projectrions 
        expect(review).to.have.property('rule')
        expect(review).to.have.property('stigs')
        expect(review.stigs).to.be.an('array')  
        expect(review).to.have.property('metadata')

        for(let stig of review.stigs){
          expect(stig).to.have.property('benchmarkId')
          expect(stig.benchmarkId).to.be.oneOf(enviornment.testAsset.validStigs)
        }

        //check metadata
        expect(review.metadata).to.be.an('object')
     
        //check rule
        expect(review.rule).to.be.an('object')
        expect(review.rule).to.have.property('ruleId')
        
      }
    })
  
    it('Return a list of Reviews for an Asset, benchmarkId Projection.', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}?benchmarkId=${enviornment.testCollection.benchmark}&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${user.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(6)


      for(let review of res.body){
        expect(review.assetId).to.be.equal(enviornment.testAsset.assetId)
        for(let stig of review.stigs){
          expect(stig).to.have.property('benchmarkId')
          expect(stig.benchmarkId).to.be.equal(enviornment.testCollection.benchmark)
        }        
      }
    })
    it('Return a list of Reviews for an Asset , metadata Projection.', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}?projection=rule&projection=stigs&metadata=${enviornment.testAsset.metadataKey}%3A${enviornment.testAsset.metadataValue}&projection=metadata`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body).to.be.lengthOf(1)

      for(let review of res.body){
        expect(review.assetId).to.be.equal(enviornment.testAsset.assetId)
        expect(review.metadata).to.be.an('object')
        expect(review.metadata).to.have.property(enviornment.testCollection.metadataKey)
        expect(review.metadata[enviornment.testCollection.metadataKey]).to.be.equal(enviornment.testCollection.metadataValue)
      }
    })
    it('Return a list of reviews accessible to the requester, result projection pass only', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}?result=pass&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${user.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(4)

      for(let review of res.body){
        expect(review.assetId).to.be.equal(enviornment.testAsset.assetId)
        expect(review.result).to.be.equal('pass')
      }
    })
    it('Return a list of reviews accessible to the requester, result projection fail only', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}?result=fail&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${user.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(4)

      for(let review of res.body){
        expect(review.assetId).to.be.equal(enviornment.testAsset.assetId)
        expect(review.result).to.be.equal('fail')
      }
    })
    it('Return a list of reviews accessible to the requester, result projection informational only', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}?result=informational&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${user.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(0)

      for(let review of res.body){
        expect(review.assetId).to.be.equal(enviornment.testAsset.assetId)
        expect(review.result).to.be.equal('informational')
      }
    })
    it('Return a list of reviews accessible to the requester, status projection: saved.', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}?status=saved&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${user.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(2)

      for(let review of res.body){
        expect(review.assetId).to.be.equal(enviornment.testAsset.assetId)
        expect(review.status.label).to.be.equal('saved')
      }
    })
    it('Return a list of reviews accessible to the requester, status projection: submitted.', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}?status=submitted&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${user.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(7)

      for(let review of res.body){
        expect(review.assetId).to.be.equal(enviornment.testAsset.assetId)
        expect(review.status.label).to.be.equal('submitted')
      }
    })
  })
  describe('GET - getReviewByAssetRule - /collections/{collectionId}/reviews/{assetId}/{ruleId}', () => {

    it('Return the Review for an Asset and Rule', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}/${enviornment.testCollection.ruleId}?projection=rule&projection=stigs&projection=metadata&projection=history`)
        .set('Authorization', `Bearer ${user.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')

      const review = res.body
     
      // checking for basic properties
      expect(review).to.have.property('assetId')
      expect(review.assetId).to.be.equal(enviornment.testAsset.assetId)

      expect(review).to.have.property('assetLabelIds')
      expect(review).to.have.property('assetName')
      expect(review).to.have.property('resultEngine')
      expect(review).to.have.property('detail')
      expect(review).to.have.property('status')

      //check projectrions 
      expect(review).to.have.property('rule')
      expect(review.rule).to.be.an('object')
      expect(review.rule).to.have.property('ruleId')
      expect(review.rule.ruleId).to.be.equal(enviornment.testCollection.ruleId)

      expect(review).to.have.property('stigs')
      expect(review.stigs).to.be.an('array')  

      expect(review).to.have.property('metadata')
      expect(review.metadata).to.be.an('object')
      expect(review.metadata).to.have.property(enviornment.testCollection.metadataKey)
      expect(review.metadata[enviornment.testCollection.metadataKey]).to.be.equal(enviornment.testCollection.metadataValue)

      expect(review).to.have.property('history')
      expect(review.history).to.be.an('array')  
      for(let history of review.history){
        expect(history).to.have.property('result')
        expect(history).to.have.property('ruleId')
        expect(history).to.have.property('status')
      }
      for(let stig of review.stigs){
        expect(stig).to.have.property('benchmarkId')
        expect(stig.benchmarkId).to.be.oneOf(enviornment.testAsset.validStigs)
      } 
    })
  })
  describe('GET - getReviewMetadata - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata', () => {

    it('Return the metadata for a Review', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}/${enviornment.testCollection.ruleId}/metadata`)
        .set('Authorization', `Bearer ${user.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property(enviornment.testAsset.metadataKey)
      expect(res.body[enviornment.testAsset.metadataKey]).to.be.equal(enviornment.testAsset.metadataValue)
    })

  })
  describe('GET - getReviewMetadataKeys - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata/keys', () => {
      
      it('Return the Review Metadata KEYS for an Asset and Rule', async () => {
        const res = await chai.request(config.baseUrl)
          .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}/${enviornment.testCollection.ruleId}/metadata/keys`)
          .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body).to.be.lengthOf(1)
        expect(res.body).to.include(enviornment.testAsset.metadataKey)
      })
  })
  describe('GET - getReviewMetadataValue - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata/keys/{key}', () => {

    it('Return the Review Metadata VALUE for an Asset/Rule/metadata KEY', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}/${enviornment.testCollection.ruleId}/metadata/keys/${enviornment.testAsset.metadataKey}`)
        .set('Authorization', `Bearer ${user.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('string')
      expect(res.body).to.equal(enviornment.testAsset.metadataValue)  
    })
  })
})

describe('Review GETS tests using "lvl1" user ', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  describe('GET - getReviewsByCollection - /collections/{collectionId}/reviews', () => {

    it('Return a list of reviews accessible to the requester, assetId Projection.', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews?assetId=${enviornment.testAsset.assetId}&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${lvl1.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(6)

      
      for(let review of res.body){
        // checking for basic properties
        expect(review).to.have.property('assetId')
        expect(review.assetId).to.be.equal(enviornment.testAsset.assetId)

        expect(review).to.have.property('assetLabelIds')

        for(let assetLabelId of review.assetLabelIds){
          expect(assetLabelId).to.be.oneOf(enviornment.testAsset.labels)
        }

        expect(review.metadata).to.be.an('object')
        
        for(let stig of review.stigs){
          expect(stig).to.have.property('benchmarkId')
          expect(stig.benchmarkId).to.be.oneOf(enviornment.testCollection.validStigs)
        }
        expect(review.rule).to.be.an('object')
        expect(review.rule).to.have.property('ruleId')
        
      }
    })
    it('Return a list of reviews accessible to the requester, benchmarkId Projection.', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews?benchmarkId=${enviornment.testCollection.benchmark}&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${lvl1.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(11)

      for(let review of res.body){
        for(let stig of review.stigs){
          expect(stig).to.have.property('benchmarkId')
          expect(stig.benchmarkId).to.be.equal(enviornment.testCollection.benchmark)
        }        
      }
    })
    it('Return a list of reviews accessible to the requester, result projection fail only', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews?result=fail&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${lvl1.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(6)

      for(let review of res.body){
        expect(review.result).to.be.equal('fail')
      }
    })
    it('Return a list of reviews accessible to the requester, ruleid projection', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews?ruleId=${enviornment.testCollection.ruleId}&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${lvl1.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(2)

      for(let review of res.body){
        expect(review.ruleId).to.be.equal(enviornment.testCollection.ruleId)
        expect(review.rule.ruleId).to.be.equal(enviornment.testCollection.ruleId)
        expect(review.ruleIds).to.include(enviornment.testCollection.ruleId)
      }
    })
    it('Return a list of reviews accessible to the requester, status projection: saved.', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews?status=saved&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${lvl1.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(4)

      for(let review of res.body){
        expect(review.status.label).to.be.equal('saved')
      }
    })
    it('Return a list of reviews accessible to the requester, userId projection.', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews?userId=${enviornment.stigmanadmin.userId}&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${lvl1.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(9)

      for(let review of res.body){
        expect(review.userId).to.be.equal(enviornment.stigmanadmin.userId)
      }
    })
  })
  describe('GET - getReviewsByAsset - /collections/{collectionId}/reviews/{assetId}', () => {
   
    it('Return a list of reviews accessible to the requester, result projection pass only', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}?result=pass&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${lvl1.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(2)

      for(let review of res.body){
        expect(review.assetId).to.be.equal(enviornment.testAsset.assetId)
        expect(review.result).to.be.equal('pass')
      }
    })
    it('Return a list of reviews accessible to the requester, result projection fail only', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}?result=fail&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${lvl1.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(3)

      for(let review of res.body){
        expect(review.assetId).to.be.equal(enviornment.testAsset.assetId)
        expect(review.result).to.be.equal('fail')
      }
    })
    it('Return a list of reviews accessible to the requester, result projection informational only', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}?result=informational&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${lvl1.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(0)

      for(let review of res.body){
        expect(review.assetId).to.be.equal(enviornment.testAsset.assetId)
        expect(review.result).to.be.equal('informational')
      }
    })
    it('Return a list of reviews accessible to the requester, status projection: saved.', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}?status=saved&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${lvl1.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(1)

      for(let review of res.body){
        expect(review.assetId).to.be.equal(enviornment.testAsset.assetId)
        expect(review.status.label).to.be.equal('saved')
      }
    })
    it('Return a list of reviews accessible to the requester, status projection: submitted.', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/reviews/${enviornment.testAsset.assetId}?status=submitted&projection=rule&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${lvl1.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.lengthOf(5)

      for(let review of res.body){
        expect(review.assetId).to.be.equal(enviornment.testAsset.assetId)
        expect(review.status.label).to.be.equal('submitted')
      }
    })
  })
})