const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')

const user =
  {
    "name": "stigmanadmin",
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
const checkReviews = (reviews, postreview, user) => {
  for(let review of reviews){
    if(review.ruleId == environment.testCollection.ruleId && review.assetId == environment.testAsset.assetId){
      if (postreview.action == "insert") {
         expect(review.resultEngine).to.not.eql(null);
         expect(review.status.user.username).to.eql("admin");
      }else{
        expect(review.resultEngine).to.eql(null)
        expect(review.status.label).to.eql("saved")
        expect(review.status.user.username).to.eql(user.name)
        expect(review.username).to.eql(user.name)
        expect(review.result).to.eql(postreview.source.review.result)
        expect(review.detail).to.eql(postreview.source.review.detail)
      }
    }
    else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 154) {
      if (postreview.action == "insert") {
        expect(review.status.user.username).to.eql("admin");
        expect(review.username).to.eql("admin");              
        expect(review.detail).to.eql("test");
      }
      else {
        expect(review.resultEngine).to.eql(null)
        expect(review.status.label).to.eql("submitted")
        expect(review.status.user.username).to.eql("admin")
        expect(review.username).to.eql(user.name)
        expect(review.result).to.eql(postreview.source.review.result)
        expect(review.detail).to.eql(postreview.source.review.detail)
      }
   }
   else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 62) {
      if (postreview.action == "insert") {
        expect(review.resultEngine).to.eql(null);
      }
      else {
        expect(review.resultEngine).to.eql(null)
      }
      expect(review.status.label).to.eql("saved")
      expect(review.status.user.username).to.eql(user.name)
      expect(review.username).to.eql(user.name)
      expect(review.result).to.eql(postreview.source.review.result)
      expect(review.detail).to.eql(postreview.source.review.detail)
    }
  }
}

describe('Review POSTs tests using "admin" user ', () => {

  describe('POST - postReviewBatch - /collections/{collectionId}/reviews', () => {
    describe(`Batch Review Editing`, () => {

        beforeEach(async function () {
          this.timeout(4000)
            await utils.loadBatchAppData()
        })
        it(`POST batch review: target assets, whole stig`, async () => {

          const postreview = {
            source: {
              review: {
                result: 'fail',
                detail: 'tesetsetset'
              }
            },
            assets: {
              assetIds: ['62', '42', '154']
            },
            rules: {
              benchmarkIds: ['VPN_SRG_TEST']
            }
          }

          const res = await chai.request(config.baseUrl)
            .post(`/collections/${environment.testCollection.collectionId}/reviews`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(postreview)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('failedValidation')
          expect(res.body).to.have.property('updated')
          expect(res.body).to.have.property('inserted')
        
          const reviews = await utils.getReviews(environment.testCollection.collectionId)

          if(user.name == "lvl1"){
            expect(res.body.inserted).to.eql(160)
            expect(res.body.failedValidation).to.eql(81)
            expect(res.body.updated).to.eql(2)
            expect(res.body.validationErrors).to.have.length(50)
            expect(reviews).to.have.lengthOf(162)
          }
          else{
            expect(res.body.inserted).to.eql(241)
            expect(res.body.updated).to.eql(2)
            expect(res.body.failedValidation).to.eql(0)
            expect(res.body.validationErrors).to.have.length(0)
            expect(reviews).to.have.lengthOf(243)
          }
          

          for(let review of reviews){
            if(review.ruleId == environment.testCollection.ruleId && review.assetId == environment.testAsset.assetId){
              if (postreview.action == "insert") {
                  expect(review.resultEngine).to.not.eql(null);
                  expect(review.status.user.username).to.eql("admin");
              }else{
                expect(review.resultEngine).to.eql(null)
                expect(review.status.label).to.eql("saved")
                expect(review.status.user.username).to.eql(user.name)
                expect(review.username).to.eql(user.name)
                expect(review.result).to.eql(postreview.source.review.result)
                expect(review.detail).to.eql(postreview.source.review.detail)
              }
            }
            else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 154) {
              if (postreview.action == "insert") {
                expect(review.status.user.username).to.eql("admin");
                expect(review.username).to.eql("admin");              
                expect(review.detail).to.eql("test");
              }
              else {
                expect(review.resultEngine).to.eql(null)
                expect(review.status.label).to.eql("submitted")
                expect(review.status.user.username).to.eql("admin")
                expect(review.username).to.eql(user.name)
                expect(review.result).to.eql(postreview.source.review.result)
                expect(review.detail).to.eql(postreview.source.review.detail)
              }
            }
            else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 62) {
              if (postreview.action == "insert") {
                expect(review.resultEngine).to.eql(null);
              }
              else {
                expect(review.resultEngine).to.eql(null)
              }
              expect(review.status.label).to.eql("saved")
              expect(review.status.user.username).to.eql(user.name)
              expect(review.username).to.eql(user.name)
              expect(review.result).to.eql(postreview.source.review.result)
              expect(review.detail).to.eql(postreview.source.review.detail)
            }
          }
        })
        it(`POST batch Review: target by assets, and one rule`, async () => {

          const postreview = {
            source: {
              review: {
                result: 'fail',
                detail: 'tesetsetset'
              }
            },
            assets: {
              assetIds: ['62', '42', '154']
            },
            rules: {
                ruleIds: ['SV-106179r1_rule']
              }
            
          }

          const res = await chai.request(config.baseUrl)
            .post(`/collections/${environment.testCollection.collectionId}/reviews`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(postreview)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('failedValidation')
          expect(res.body).to.have.property('updated')
          expect(res.body).to.have.property('inserted')

          const reviews = await utils.getReviews(environment.testCollection.collectionId)
        
          if(user.name == "lvl1"){
            expect(res.body.inserted).to.eql(0)
            expect(res.body.failedValidation).to.eql(1)
            expect(res.body.updated).to.eql(2)
            expect(res.body.validationErrors).to.have.length(1)
            expect(reviews).to.have.lengthOf(2)
          }
          else{
            expect(res.body.inserted).to.eql(1)
            expect(res.body.updated).to.eql(2)
            expect(res.body.failedValidation).to.eql(0)
            expect(res.body.validationErrors).to.have.length(0)
            expect(reviews).to.have.lengthOf(3)
          }

          for(let review of reviews){
            if(review.ruleId == environment.testCollection.ruleId && review.assetId == environment.testAsset.assetId){
              if (postreview.action == "insert") {
                  expect(review.resultEngine).to.not.eql(null);
                  expect(review.status.user.username).to.eql("admin");
              }else{
                expect(review.resultEngine).to.eql(null)
                expect(review.status.label).to.eql("saved")
                expect(review.status.user.username).to.eql(user.name)
                expect(review.username).to.eql(user.name)
                expect(review.result).to.eql(postreview.source.review.result)
                expect(review.detail).to.eql(postreview.source.review.detail)
              }
            }
            else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 154) {
              if (postreview.action == "insert") {
                expect(review.status.user.username).to.eql("admin");
                expect(review.username).to.eql("admin");              
                expect(review.detail).to.eql("test");
              }
              else {
                expect(review.resultEngine).to.eql(null)
                expect(review.status.label).to.eql("submitted")
                expect(review.status.user.username).to.eql("admin")
                expect(review.username).to.eql(user.name)
                expect(review.result).to.eql(postreview.source.review.result)
                expect(review.detail).to.eql(postreview.source.review.detail)
              }
            }
            else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 62) {
              if (postreview.action == "insert") {
                expect(review.resultEngine).to.eql(null);
              }
              else {
                expect(review.resultEngine).to.eql(null)
              }
              expect(review.status.label).to.eql("saved")
              expect(review.status.user.username).to.eql(user.name)
              expect(review.username).to.eql(user.name)
              expect(review.result).to.eql(postreview.source.review.result)
              expect(review.detail).to.eql(postreview.source.review.detail)
            }
          }
        })
        it(`POST batch Review: target by assets, and rule`, async () => {

          const postreview = {
            source: {
              review: {
                result: 'fail',
                detail: 'tesetsetset'
              }
            },
            assets: {
              benchmarkIds: ['VPN_SRG_TEST']
            },
            rules: {
                ruleIds: ['SV-106179r1_rule']
              }
            }

          const res = await chai.request(config.baseUrl)
            .post(`/collections/${environment.testCollection.collectionId}/reviews`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(postreview)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('failedValidation')
          expect(res.body).to.have.property('updated')
          expect(res.body).to.have.property('inserted')
          const reviews = await utils.getReviews(environment.testCollection.collectionId)

          if(user.name == "lvl1"){
            expect(res.body.inserted).to.eql(0)
            expect(res.body.failedValidation).to.eql(0)
            expect(res.body.updated).to.eql(2)
            expect(res.body.validationErrors).to.have.length(0)
            expect(reviews).to.have.lengthOf(2)
          }
          else{
            expect(res.body.inserted).to.eql(1)
            expect(res.body.updated).to.eql(2)
            expect(res.body.failedValidation).to.eql(0)
            expect(res.body.validationErrors).to.have.length(0)
            expect(reviews).to.have.lengthOf(3)
          }

          checkReviews(reviews, postreview, user)
        })
        it(`POST batch review: target stig, whole stig`, async () => {

          const postreview = {
            source: {
              review: {
                result: 'fail',
                detail: 'tesetsetset'
              }
            },
            assets: {
              benchmarkIds: ['VPN_SRG_TEST']
            },
            rules: {
                benchmarkIds: ['VPN_SRG_TEST']
              }
            }

          const res = await chai.request(config.baseUrl)
            .post(`/collections/${environment.testCollection.collectionId}/reviews`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(postreview)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('failedValidation')
          expect(res.body).to.have.property('updated')
          expect(res.body).to.have.property('inserted')
          const reviews = await utils.getReviews(environment.testCollection.collectionId)

          if(user.name == "lvl1"){
            expect(res.body.inserted).to.eql(160)
            expect(res.body.failedValidation).to.eql(0)
            expect(res.body.updated).to.eql(2)
            expect(res.body.validationErrors).to.have.length(0)
            expect(reviews).to.have.lengthOf(162)
          }
          else{
            expect(res.body.inserted).to.eql(241)
            expect(res.body.updated).to.eql(2)
            expect(res.body.failedValidation).to.eql(0)
            expect(res.body.validationErrors).to.have.length(0)
            expect(reviews).to.have.lengthOf(243)
          }
        
          checkReviews(reviews, postreview, user)
        })
        it(`POST batch review: target stig, whole stig - ACTION: insert`, async () => {

          const postreview = {
            source: {
              review: {
                result: 'fail',
                detail: 'tesetsetset'
              }
            },
            assets: {
              assetIds: ['62', '42', '154']
            },
            rules: {
                ruleIds: ['SV-106179r1_rule']
              },
              action: "insert"
            }

          const res = await chai.request(config.baseUrl)
            .post(`/collections/${environment.testCollection.collectionId}/reviews`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(postreview)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('failedValidation')
          expect(res.body).to.have.property('updated')
          expect(res.body).to.have.property('inserted')

          const reviews = await utils.getReviews(environment.testCollection.collectionId)

          if(user.name == "lvl1"){
            expect(res.body.inserted).to.eql(0)
            expect(res.body.failedValidation).to.eql(1)
            expect(res.body.updated).to.eql(0)
            expect(res.body.validationErrors).to.have.length(1)
            expect(reviews).to.have.lengthOf(2)
          }
          else{
            expect(res.body.inserted).to.eql(1)
            expect(res.body.updated).to.eql(0)
            expect(res.body.failedValidation).to.eql(0)
            expect(res.body.validationErrors).to.have.length(0)
            expect(reviews).to.have.lengthOf(3)
          }
          
          checkReviews(reviews, postreview, user)
        })
        it(`POST batch review: target stig, whole stig - ACTION: merge`, async () => {

          const postreview = {
            source: {
              review: {
                result: 'fail',
                detail: 'tesetsetset'
              }
            },
            assets: {
              assetIds: ['62', '42', '154']
            },
            rules: {
                ruleIds: ['SV-106179r1_rule']
              },
              action: "update"
            }

          const res = await chai.request(config.baseUrl)
            .post(`/collections/${environment.testCollection.collectionId}/reviews`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(postreview)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('failedValidation')
          expect(res.body).to.have.property('updated')
          expect(res.body).to.have.property('inserted')

          const reviews = await utils.getReviews(environment.testCollection.collectionId)
          
          if(user.name == "lvl1"){
            expect(res.body.inserted).to.eql(0)
            expect(res.body.failedValidation).to.eql(0)
            expect(res.body.updated).to.eql(2)
            expect(res.body.validationErrors).to.have.length(0)
            expect(reviews).to.have.lengthOf(2)
          }
          else{
            expect(res.body.inserted).to.eql(0)
            expect(res.body.updated).to.eql(2)
            expect(res.body.failedValidation).to.eql(0)
            expect(res.body.validationErrors).to.have.length(0)
            expect(reviews).to.have.lengthOf(2)
          }

          for(let review of reviews){
            if(review.ruleId == environment.testCollection.ruleId && review.assetId == environment.testAsset.assetId){
              expect(review.resultEngine).to.eql(null)
              expect(review.status.label).to.eql("saved")
              expect(review.status.user.username).to.eql(user.name)
              expect(review.username).to.eql(user.name)
              expect(review.result).to.eql(postreview.source.review.result)
              expect(review.detail).to.eql(postreview.source.review.detail)
            }
            else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 154) {
              expect(review.resultEngine).to.eql(null)
              expect(review.status.label).to.eql("submitted")
            
              expect(review.status.user.username).to.eql("admin")
              expect(review.username).to.eql(user.name)
              expect(review.result).to.eql(postreview.source.review.result)
              expect(review.detail).to.eql(postreview.source.review.detail)
          }
          else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 62) {
              expect(review.status.label).to.eql("saved")
              expect(review.status.user.username).to.eql(user.name)
              expect(review.username).to.eql(user.name)
              expect(review.result).to.eql(postreview.source.review.result)
              expect(review.detail).to.eql(postreview.source.review.detail)
            }
          }
        })
        it(`POST batch review: update but with exclusionary updateFilters (request should do nothing)`, async () => {
          const postreview = {
            source: {
              review: {
                result: 'fail',
                detail: 'tesetsetset'
              }
            },
            assets: {
              assetIds: ['62', '42', '154']
            },
            rules: {
              ruleIds: ['SV-106179r1_rule']
            },
            updateFilters: [
              {
                field: 'result',
                value: 'informational'
              }
            ],
            action: 'update'
          }


          const res = await chai.request(config.baseUrl)
            .post(`/collections/${environment.testCollection.collectionId}/reviews`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(postreview)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('failedValidation')
          expect(res.body).to.have.property('updated')
          expect(res.body).to.have.property('inserted')

          expect(res.body.inserted).to.eql(0)
          expect(res.body.updated).to.eql(0)
          expect(res.body.failedValidation).to.eql(0)
          expect(res.body.validationErrors).to.have.length(0)

          const reviews = await utils.getReviews(environment.testCollection.collectionId)
          expect(reviews).to.have.lengthOf(2)
          
          for(let review of reviews){
            expect(review.detail).to.not.eql(postreview.source.review.detail)
          }
        })
        it(`POST batch review: update -  updateFilters - admins reviews only`, async () => {

          const postreview = {
            source: {
              review: {
                result: 'fail',
                detail: 'tesetsetset'
              }
            },
            assets: {
              assetIds: ['62', '42', '154']
            },
            rules: {
              ruleIds: ['SV-106179r1_rule']
            },
            updateFilters: [
              {
                field: 'userId',
                value: '87'
              }
            ],
            action: 'update'
            }

          const res = await chai.request(config.baseUrl)
            .post(`/collections/${environment.testCollection.collectionId}/reviews`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(postreview)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('failedValidation')
          expect(res.body).to.have.property('updated')
          expect(res.body).to.have.property('inserted')

          expect(res.body.inserted).to.eql(0)
          expect(res.body.updated).to.eql(2)
          expect(res.body.failedValidation).to.eql(0)
          expect(res.body.validationErrors).to.have.length(0)

          const reviews = await utils.getReviews(environment.testCollection.collectionId)
          if(user.name == "lvl1"){
            expect(reviews).to.have.lengthOf(2)
          }
          else{
            expect(reviews).to.have.lengthOf(2)
          }

          for(let review of reviews){
            if(review.ruleId == environment.testCollection.ruleId && review.assetId == environment.testAsset.assetId){
              expect(review.resultEngine).to.eql(null);
              expect(review.status.label).to.eql("saved");
              expect(review.status.user.username).to.eql(user.name)
              expect(review.username).to.eql(user.name);
              expect(review.result).to.eql(postreview.source.review.result);
              expect(review.detail).to.eql(postreview.source.review.detail);
            
            }
            else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 154) {
              expect(review.resultEngine).to.eql(null);
              expect(review.status.label).to.eql("submitted");
              expect(review.status.user.username).to.eql("admin");
              expect(review.username).to.eql(user.name);
              expect(review.result).to.eql(postreview.source.review.result);
              expect(review.detail).to.eql(postreview.source.review.detail);
          }
          else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 62) {
            expect(review.resultEngine).to.eql(null);
            expect(review.status.label).to.eql("saved");
            expect(review.status.user.username).to.eql(user.name);
            expect(review.username).to.eql(user.name);
            expect(review.result).to.eql(postreview.source.review.result);
            expect(review.detail).to.eql(postreview.source.review.detail);
            }
          }
        })
        it(`POST batch review: update - updateFilters- before date`, async () => {

          const postreview = {
            source: {
              review: {
                result: 'fail',
                detail: 'tesetsetset'
              }
            },
            assets: {
              assetIds: ['62', '42', '154']
            },
            rules: {
              ruleIds: ['SV-106179r1_rule']
            },
            updateFilters: [
              {
              field: "ts",
              condition : "lessThan",
              value: "2022-10-26T22:37:46Z"
              }
            ],
            action: 'update'
            }

          const res = await chai.request(config.baseUrl)
            .post(`/collections/${environment.testCollection.collectionId}/reviews`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(postreview)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('failedValidation')
          expect(res.body).to.have.property('updated')
          expect(res.body).to.have.property('inserted')

          expect(res.body.inserted).to.eql(0)
          expect(res.body.updated).to.eql(1)
          expect(res.body.failedValidation).to.eql(0)
          expect(res.body.validationErrors).to.have.length(0)

          const reviews = await utils.getReviews(environment.testCollection.collectionId)
          expect(reviews).to.have.lengthOf(2)

          for(let review of reviews){
          
            if(review.ruleId == environment.testCollection.ruleId && review.assetId == environment.testAsset.assetId){
              expect(review.resultEngine).to.eql(null)
              expect(review.status.label).to.eql("saved")
              expect(review.status.user.username).to.eql(user.name)
              expect(review.username).to.eql(user.name)
              expect(review.result).to.eql(postreview.source.review.result)
              expect(review.detail).to.eql(postreview.source.review.detail)
            
            }
            else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 154) {
              expect(review.resultEngine).to.eql(null)
              expect(review.status.label).to.eql("submitted")
              expect(review.status.user.username).to.eql("admin")
              expect(review.username).to.eql("admin")
          }
          else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 62) {
            expect(review.resultEngine).to.eql(null);
            expect(review.status.label).to.eql("saved");
            expect(review.status.user.username).to.eql(user.name);
            expect(review.username).to.eql(user.name);
            expect(review.result).to.eql(postreview.source.review.result);
            expect(review.detail).to.eql(postreview.source.review.detail);
            }
          }
        })
        it(`POST batch review: update with updateFilters - detail string "batch"`, async () => {

        const postreview = {
            source: {
              review: {
                result: 'fail',
                detail: 'tesetsetset'
              }
            },
            assets: {
              assetIds: ['62', '42', '154']
            },
            rules: {
              ruleIds: ['SV-106179r1_rule']
            },
            updateFilters: [
              {
                field: 'detail',
                condition: 'endsWith',
                value: 'batch'
              }
            ],
            action: 'update'
          }


          const res = await chai.request(config.baseUrl)
            .post(`/collections/${environment.testCollection.collectionId}/reviews`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(postreview)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('failedValidation')
          expect(res.body).to.have.property('updated')
          expect(res.body).to.have.property('inserted')

          expect(res.body.inserted).to.eql(0)
          expect(res.body.updated).to.eql(1)
          expect(res.body.failedValidation).to.eql(0)
          expect(res.body.validationErrors).to.have.length(0)

          const reviews = await utils.getReviews(environment.testCollection.collectionId)
          expect(reviews).to.have.lengthOf(2)

          for(let review of reviews){
          
            if(review.ruleId == environment.testCollection.ruleId && review.assetId == environment.testAsset.assetId){
              expect(review.resultEngine).to.eql(null)
              expect(review.status.label).to.eql("saved")
              expect(review.status.user.username).to.eql(user.name)
              expect(review.username).to.eql(user.name)
              expect(review.result).to.eql(postreview.source.review.result)
              expect(review.detail).to.eql(postreview.source.review.detail)
            
            }
            else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 154) {
              expect(review.resultEngine).to.eql(null)
              expect(review.status.label).to.eql("submitted")
              expect(review.status.user.username).to.eql("admin")
              expect(review.username).to.eql("admin")
              expect(review.detail).to.eql("test")
          }
          else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 62) {
            expect(review.resultEngine).to.eql(null);
            expect(review.status.label).to.eql("saved");
            expect(review.status.user.username).to.eql(user.name);
            expect(review.username).to.eql(user.name);
            expect(review.result).to.eql(postreview.source.review.result);
            expect(review.detail).to.eql(postreview.source.review.detail);
            }
          }
        })
        it(`POST batch review: update - updateFilters- only non-saved status`, async () => {

        const postreview = {
            source: {
              review: {
                status: 'saved'
              }
            },
            assets: {
              assetIds: ['62', '42', '154']
            },
            rules: {
              ruleIds: ['SV-106179r1_rule']
            },
            updateFilters: [
              {
                field: 'statusLabel',
                condition: 'notequal',
                value: 'saved'
              }
            ],
            action: 'update'
          }

          const res = await chai.request(config.baseUrl)
            .post(`/collections/${environment.testCollection.collectionId}/reviews`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(postreview)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('failedValidation')
          expect(res.body).to.have.property('updated')
          expect(res.body).to.have.property('inserted')

          expect(res.body.inserted).to.eql(0)
          expect(res.body.updated).to.eql(2)
          expect(res.body.failedValidation).to.eql(0)
          expect(res.body.validationErrors).to.have.length(0)

          const reviews = await utils.getReviews(environment.testCollection.collectionId)
          expect(reviews).to.have.lengthOf(2)

          for(let review of reviews){
              expect(review.status.label).to.eql("saved")
              expect(review.status.user.username).to.eql(user.name)
          }
        })
        it(`POST batch review: update with updateFilters - pass only`, async () => {
            const postreview = {
              source: {
                review: {
                  result: 'fail',
                  detail: 'tesetsetset'
                }
              },
              assets: {
                assetIds: ['62', '42', '154']
              },
              rules: {
                ruleIds: ['SV-106179r1_rule']
              },
              updateFilters: [
                {
                  field: 'result',
                  value: 'pass'
                }
              ],
              action: 'update'
            }

            const res = await chai.request(config.baseUrl)
              .post(`/collections/${environment.testCollection.collectionId}/reviews`)
              .set('Authorization', `Bearer ${user.token}`)
              .send(postreview)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('failedValidation')
            expect(res.body).to.have.property('updated')
            expect(res.body).to.have.property('inserted')
    
            expect(res.body.inserted).to.eql(0)
            expect(res.body.updated).to.eql(1)
            expect(res.body.failedValidation).to.eql(0)
            expect(res.body.validationErrors).to.have.length(0)
    
            const reviews = await utils.getReviews(environment.testCollection.collectionId)
            expect(reviews).to.have.lengthOf(2)
    
            for(let review of reviews){
          
              if(review.ruleId == environment.testCollection.ruleId && review.assetId == environment.testAsset.assetId){
                expect(review.resultEngine).to.eql(null)
                expect(review.status.label).to.eql("saved")
                expect(review.status.user.username).to.eql(user.name)
                expect(review.username).to.eql(user.name)
                expect(review.result).to.eql(postreview.source.review.result)
                expect(review.detail).to.eql(postreview.source.review.detail)
              
              }
              else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 154) {
                expect(review.resultEngine).to.eql(null)
                expect(review.status.label).to.eql("submitted")
                expect(review.status.user.username).to.eql("admin")
                expect(review.username).to.eql("admin")
                expect(review.detail).to.eql("test")
            }
            else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 62) {
              expect(review.resultEngine).to.eql(null);
              expect(review.status.label).to.eql("saved");
              expect(review.status.user.username).to.eql(user.name);
              expect(review.username).to.eql(user.name);
              expect(review.result).to.eql(postreview.source.review.result);
              expect(review.detail).to.eql(postreview.source.review.detail);
              }
            }
        })
        it(`POST batch review: target rules defined by stig (expect pinned rules only)`, async () => {
              const postreview = {
                source: {
                  review: {
                    result: 'fail',
                    detail: 'tesetsetset'
                  }
                },
                assets: {
                  assetIds: ['62', '42', '154']
                },
                rules: {
                  benchmarkIds: ['VPN_SRG_TEST']
                }
              }

          const res = await chai.request(config.baseUrl)
            .post(`/collections/${environment.testCollection.collectionId}/reviews`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(postreview)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('failedValidation')
          expect(res.body).to.have.property('updated')
          expect(res.body).to.have.property('inserted')

          expect(res.body.updated).to.eql(2)
        
          if(user.name == "lvl1"){
            expect(res.body.inserted).to.eql(160)
            expect(res.body.failedValidation).to.eql(81)
            expect(res.body.validationErrors).to.have.length(50)
          }
          else{
            expect(res.body.inserted).to.eql(241)
            expect(res.body.failedValidation).to.eql(0)
            expect(res.body.validationErrors).to.have.length(0)
          }

          const reviews = await utils.getCollectionMetricsDetails(environment.testCollection.collectionId)
          expect(reviews).to.have.lengthOf(6)

          for(let review of reviews){
            if(review.assetId == environment.testAsset.assetId && review.benchmarkId == environment.testCollection.benchmarkId){
              expect(review.metrics.assessed).to.equal(241);
            }
          }
        
      })
    })
    describe(`Batch Review Editing - Validation Errors, expect failure. `, () => {
          
      beforeEach(async function () {
        this.timeout(4000)
        await utils.loadBatchAppData()
        await utils.uploadTestStigs()
        await utils.createDisabledCollectionsandAssets()
      })
        it(`POST batch Review: target by assets, and one rule, expect validation failure - invalid result for status`, async () => {
            const postreview = {
              source: {
                review: {
                  result: 'informational',
                  detail: 'tesetsetset',
                  status: 'submitted'
                }
              },
              assets: {
                assetIds: ['62', '42', '154']
              },
              rules: { ruleIds: ['SV-106179r1_rule'] }
            }

          const res = await chai.request(config.baseUrl)
            .post(`/collections/${environment.testCollection.collectionId}/reviews`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(postreview)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('failedValidation')
          expect(res.body).to.have.property('updated')
          expect(res.body).to.have.property('inserted')
          expect(res.body).to.have.property('validationErrors')

          expect(res.body.inserted).to.eql(0)
          expect(res.body.updated).to.eql(0)
          expect(res.body.failedValidation).to.eql(3)
          expect(res.body.validationErrors).to.have.length(3)
                
          if (user.name == "lvl1"){
            expect(res.body.validationErrors).to.have.length(3)
            for (review of res.body.validationErrors){
                expect(review.error).to.be.oneOf(["status is not allowed for the result","no grant for this asset/ruleId"])
                if (review.assetId == 62) {
                    expect(review.error).to.eql("no grant for this asset/ruleId")                
                }
            }
          }
          else {
            expect(res.body.validationErrors).to.have.length(3)
            for (review of res.body.validationErrors){
                expect(review.error).to.eql("status is not allowed for the result")
            }   
          }    

        })
        it(`POST batch Review: target by stig, and one rule, expect validation failure - fail result, no comment`, async () => {
          const postreview = {
            source: {
              review: {
                result: 'fail',
                detail: 'tesetsetset',
                comment: '',
                status: 'submitted'
              }
            },
            assets: {
              benchmarkIds: ['VPN_SRG_TEST']
            },
            rules: { ruleIds: ['SV-106179r1_rule'] }
          }

        const res = await chai.request(config.baseUrl)
          .post(`/collections/${environment.testCollection.collectionId}/reviews`)
          .set('Authorization', `Bearer ${user.token}`)
          .send(postreview)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('failedValidation')
        expect(res.body).to.have.property('updated')
        expect(res.body).to.have.property('inserted')
        expect(res.body).to.have.property('validationErrors')

        if (user.name == "lvl1"){
          expect(res.body.failedValidation).to.eql(2)
          expect(res.body.validationErrors).to.have.length(2)
        }
        else {
          expect(res.body.failedValidation).to.eql(3)
          expect(res.body.validationErrors).to.have.length(3)
        }
        expect(res.body.inserted).to.eql(0)
        expect(res.body.updated).to.eql(0)

        const reviews = await utils.getReviews(environment.testCollection.collectionId)

        expect(reviews).to.have.lengthOf(2)
        
        for (let review of reviews){
          if (review.ruleId == environment.testCollection.ruleId && review.assetId == environment.testAsset.assetId){ 
            // CASE: Existing review, test reset of resultengine and status - all users can update
              expect(review.status.label).to.eql("submitted");
              expect(review.status.user.username).to.eql("admin");
              expect(review.username).to.eql("admin");
              expect(review.result).to.eql("pass");
          }
          // CASE: Existing review, test reset of resultengine and status - all users can update
          else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 154) {
              expect(review.resultEngine).to.eql(null);
              expect(review.status.label).to.eql("submitted");
              expect(review.status.user.username).to.eql("admin");
              expect(review.username).to.eql("admin");
              expect(review.result).to.eql("fail");
          }
        // CASE: new  review, test reset of resultengine and status - non-lvl1-can update
        else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 62) {
            expect(review.resultEngine).to.eql(null);
            expect(review.status.label).to.eql("saved");
            expect(review.status.user.username).to.eql(user.name);
            expect(review.username).to.eql(user.name);
            expect(review.result).to.eql(postreview.source.review.result);
            expect(review.detail).to.eql(postreview.source.review.detail);
          }
        }
        })
        it(`POST batch Review: target by stig, and one rule, expect validation failure - invalid result for status`, async () => {
            const postreview = {
              source: {
                review: {
                  result: 'informational',
                  detail: 'tesetsetset',
                  status: 'submitted'
                }
              },
              assets: {
                benchmarkIds: ['VPN_SRG_TEST']
              },
              rules: { ruleIds: ['SV-106179r1_rule'] }
            }

        const res = await chai.request(config.baseUrl)
          .post(`/collections/${environment.testCollection.collectionId}/reviews`)
          .set('Authorization', `Bearer ${user.token}`)
          .send(postreview)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('failedValidation')
        expect(res.body).to.have.property('updated')
        expect(res.body).to.have.property('inserted')
        expect(res.body).to.have.property('validationErrors')
        expect(res.body.inserted).to.eql(0)
        expect(res.body.updated).to.eql(0)
        expect(res.body.failedValidation).to.eql(3)
        expect(res.body.validationErrors).to.have.length(3)

        const reviews = await utils.getReviews(environment.testCollection.collectionId)
        expect(reviews).to.have.lengthOf(2)
        
        for (let review of reviews){
          if (review.ruleId == environment.testCollection.ruleId && review.assetId == environment.testAsset.assetId){ 
            // CASE: Existing review, test reset of resultengine and status - all users can update
              expect(review.status.label).to.eql("submitted");
              expect(review.status.user.username).to.eql("admin");
              expect(review.username).to.eql("admin");
              expect(review.result).to.eql("pass");
          }
          // CASE: Existing review, test reset of resultengine and status - all users can update
          else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 154) {
              expect(review.resultEngine).to.eql(null);
              expect(review.status.label).to.eql("submitted");
              expect(review.status.user.username).to.eql("admin");
              expect(review.username).to.eql("admin");
              expect(review.result).to.eql("fail");
          }
        // CASE: new  review, test reset of resultengine and status - non-lvl1-can update
        else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 62) {
            expect(review.resultEngine).to.eql(null);
            expect(review.status.label).to.eql("saved");
            expect(review.status.user.username).to.eql(user.name);
            expect(review.username).to.eql(user.name);
            expect(review.result).to.eql(postreview.source.review.result);
            expect(review.detail).to.eql(postreview.source.review.detail);
          }
        }
        })
        it(`POST batch Review: target by stig, and one rule, expect validation failure - no detail`, async () => {
          const postreview = {
            source: {
              review: {
                result: 'pass',
                detail: '',
                comment: 'test comment',
                status: 'submitted'
              }
            },
            assets: {
              benchmarkIds: ['VPN_SRG_TEST']
            },
            rules: { ruleIds: ['SV-106179r1_rule'] }
          }

      const res = await chai.request(config.baseUrl)
        .post(`/collections/${environment.testCollection.collectionId}/reviews`)
        .set('Authorization', `Bearer ${user.token}`)
        .send(postreview)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('failedValidation')
      expect(res.body).to.have.property('updated')
      expect(res.body).to.have.property('inserted')
      expect(res.body).to.have.property('validationErrors')
      expect(res.body.inserted).to.eql(0)
      expect(res.body.updated).to.eql(0)
      if (user.name == "lvl1"){
        expect(res.body.failedValidation).to.eql(2)
        expect(res.body.validationErrors).to.have.length(2)
      }
      else {
        expect(res.body.failedValidation).to.eql(3)
        expect(res.body.validationErrors).to.have.length(3)
      }
      const reviews = await utils.getReviews(environment.testCollection.collectionId)
      expect(reviews).to.have.lengthOf(2)
    
      for (let review of reviews){
        if (review.ruleId == environment.testCollection.ruleId && review.assetId == environment.testAsset.assetId){ 
          // CASE: Existing review, test reset of resultengine and status - all users can update
            expect(review.status.label).to.eql("submitted");
            expect(review.status.user.username).to.eql("admin");
            expect(review.username).to.eql("admin");
            expect(review.result).to.eql("pass");
        }
        // CASE: Existing review, test reset of resultengine and status - all users can update
        else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 154) {
            expect(review.resultEngine).to.eql(null);
            expect(review.status.label).to.eql("submitted");
            expect(review.status.user.username).to.eql("admin");
            expect(review.username).to.eql("admin");
            expect(review.result).to.eql("fail");
      }
      // CASE: new  review, test reset of resultengine and status - non-lvl1-can update
      else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 62) {
          expect(review.resultEngine).to.eql(null);
          expect(review.status.label).to.eql("saved");
          expect(review.status.user.username).to.eql(user.name);
          expect(review.username).to.eql(user.name);
          expect(review.result).to.eql(postreview.source.review.result);
          expect(review.detail).to.eql(postreview.source.review.detail);
        }
      }
        })
    })
  })
  describe('POST - postReviewsByAsset - /collections/{collectionId}/reviews/{assetId}', () => {

    let deletedCollection, deletedAsset
    before(async function () {
      this.timeout(4000)
      await utils.loadAppData()
      await utils.uploadTestStigs()
      const deletedItems = await utils.createDisabledCollectionsandAssets()
      deletedCollection = deletedItems.collection
      deletedAsset = deletedItems.asset
    })

    it('Import one or more Reviews from a JSON body new ruleId', async () => {
      const res = await chai.request(config.baseUrl)
        .post(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send([
          {
          "ruleId": `SV-106191r1_rule`,
          "result": "pass",
          "detail": "test\nvisible to lvl1",
          "comment": "sure",
          "autoResult": false,
          "status": "submitted"
          }
      ])
      const expectedResponse = {
        rejected: [],
        affected: {
            inserted: 1,
            updated: 0
        }
      }
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.deep.equal(expectedResponse)
    })
    it('Import one or more Reviews from a JSON body already used ruleId should be an update', async () => {
      const res = await chai.request(config.baseUrl)
        .post(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send([
          {
          "ruleId": `${environment.testCollection.ruleId}`,
          "result": "pass",
          "detail": "test\nvisible to lvl1",
          "comment": "sure",
          "autoResult": false,
          "status": "submitted"
          }
      ])
      const expectedResponse = {
        rejected: [],
        affected: {
            inserted: 0,
            updated: 1
        }
      }
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.deep.equal(expectedResponse)
    })

    it('Import reviews for asset in deleted collection and deleted asset', async () => {
      const res = await chai.request(config.baseUrl)
        .post(`/collections/${deletedCollection.collectionId}/reviews/${deletedAsset.assetId}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send([
          {
          "ruleId": `${environment.testCollection.ruleId}`,
          "result": "pass",
          "detail": "test\nvisible to lvl1",
          "comment": "sure",
          "autoResult": false,
          "status": "submitted"
          }
      ])
      expect(res).to.have.status(403) 
    })
    it('Import reviews for asset in deleted collection', async () => {
      const res = await chai.request(config.baseUrl)
        .post(`/collections/${deletedCollection.collectionId}/reviews/${environment.testAsset.assetId}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send([
          {
          "ruleId": `${environment.testCollection.ruleId}`,
          "result": "pass",
          "detail": "test\nvisible to lvl1",
          "comment": "sure",
          "autoResult": false,
          "status": "submitted"
          }
      ])
      expect(res).to.have.status(403) 
    })
    it('Import reviews for deleted asset', async () => {
      const res = await chai.request(config.baseUrl)
        .post(`/collections/${deletedCollection.collectionId}/reviews/${environment.testAsset.assetId}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send([
          {
          "ruleId": `${environment.testCollection.ruleId}`,
          "result": "pass",
          "detail": "test\nvisible to lvl1",
          "comment": "sure",
          "autoResult": false,
          "status": "submitted"
          }
      ])
      expect(res).to.have.status(403) 
    })
  })
})

describe('Review POSTs tests using "lvl1" user ', () => {

  describe('POST - postReviewBatch - /collections/{collectionId}/reviews', () => {
    beforeEach(async function () {
      this.timeout(4000)
      await utils.loadBatchAppData()
      await utils.uploadTestStigs()
      await utils.createDisabledCollectionsandAssets()
    })
    it(`POST batch Review: target by stig, and one rule, expect validation failure - invalid result for status`, async () => {
        const postreview = {
          source: {
            review: {
              result: 'informational',
              detail: 'tesetsetset',
              status: 'submitted'
            }
          },
          assets: {
            benchmarkIds: ['VPN_SRG_TEST']
          },
          rules: { ruleIds: ['SV-106179r1_rule'] }
        }
      const res = await chai.request(config.baseUrl)
      .post(`/collections/${environment.testCollection.collectionId}/reviews`)
      .set('Authorization', `Bearer ${lvl1.token}`)
      .send(postreview)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('failedValidation')
      expect(res.body).to.have.property('updated')
      expect(res.body).to.have.property('inserted')
      expect(res.body).to.have.property('validationErrors')
      expect(res.body.inserted).to.eql(0)
      expect(res.body.updated).to.eql(0)
      expect(res.body.failedValidation).to.eql(2)
      expect(res.body.validationErrors).to.have.length(2)
      const reviews = await utils.getReviews(environment.testCollection.collectionId)
      expect(reviews).to.have.lengthOf(2)
      
      for (let review of reviews){
        if (review.ruleId == environment.testCollection.ruleId && review.assetId == environment.testAsset.assetId){ 
          // CASE: Existing review, test reset of resultengine and status - all users can update
            expect(review.status.label).to.eql("submitted");
            expect(review.status.user.username).to.eql("admin");
            expect(review.username).to.eql("admin");
            expect(review.result).to.eql("pass");
        }
        // CASE: Existing review, test reset of resultengine and status - all users can update
        else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 154) {
            expect(review.resultEngine).to.eql(null);
            expect(review.status.label).to.eql("submitted");
            expect(review.status.user.username).to.eql("admin");
            expect(review.username).to.eql("admin");
            expect(review.result).to.eql("fail");
        }
      // CASE: new  review, test reset of resultengine and status - non-lvl1-can update
      else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 62) {
          expect(review.resultEngine).to.eql(null);
          expect(review.status.label).to.eql("saved");
          expect(review.status.user.username).to.eql(user.name);
          expect(review.username).to.eql(user.name);
          expect(review.result).to.eql(postreview.source.review.result);
          expect(review.detail).to.eql(postreview.source.review.detail);
        }
      }
    })
    it(`POST batch Review: target by assets, and one rule`, async () => {

      const postreview = {
        source: {
          review: {
            result: 'fail',
            detail: 'tesetsetset'
          }
        },
        assets: {
          assetIds: ['62', '42', '154']
        },
        rules: {
            ruleIds: ['SV-106179r1_rule']
          }
        
      }

      const res = await chai.request(config.baseUrl)
        .post(`/collections/${environment.testCollection.collectionId}/reviews`)
        .set('Authorization', `Bearer ${lvl1.token}`)
        .send(postreview)
      expect(res).to.have.status(200)
  
      const reviews = await utils.getReviews(environment.testCollection.collectionId)
    
      expect(res.body.inserted).to.eql(0)
      expect(res.body.failedValidation).to.eql(1)
      expect(res.body.updated).to.eql(2)
      expect(res.body.validationErrors).to.have.length(1)
      expect(reviews).to.have.lengthOf(2)
      for(let review of reviews){
        if(review.ruleId == environment.testCollection.ruleId && review.assetId == environment.testAsset.assetId){
          if (postreview.action == "insert") {
              expect(review.resultEngine).to.not.eql(null);
              expect(review.status.user.username).to.eql("admin");
          }else{
            expect(review.resultEngine).to.eql(null)
            expect(review.status.label).to.eql("saved")
            expect(review.status.user.username).to.eql(lvl1.name)
            expect(review.username).to.eql(lvl1.name)
            expect(review.result).to.eql(postreview.source.review.result)
            expect(review.detail).to.eql(postreview.source.review.detail)
          }
        }
        else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 154) {
          if (postreview.action == "insert") {
            expect(review.status.user.username).to.eql("admin");
            expect(review.username).to.eql("admin");              
            expect(review.detail).to.eql("test");
          }
          else {
            expect(review.resultEngine).to.eql(null)
            expect(review.status.label).to.eql("submitted")
            expect(review.status.user.username).to.eql("admin")
            expect(review.username).to.eql(lvl1.name)
            expect(review.result).to.eql(postreview.source.review.result)
            expect(review.detail).to.eql(postreview.source.review.detail)
          }
        }
        else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 62) {
          if (postreview.action == "insert") {
            expect(review.resultEngine).to.eql(null);
          }
          else {
            expect(review.resultEngine).to.eql(null)
          }
          expect(review.status.label).to.eql("saved")
          expect(review.status.user.username).to.eql(user.name)
          expect(review.username).to.eql(user.name)
          expect(review.result).to.eql(postreview.source.review.result)
          expect(review.detail).to.eql(postreview.source.review.detail)
        }
      }
    })
    it(`POST batch Review: target by stig, and one rule, expect validation failure - fail result, no comment`, async () => {
      const postreview = {
        source: {
          review: {
            result: 'fail',
            detail: 'tesetsetset',
            comment: '',
            status: 'submitted'
          }
        },
        assets: {
          benchmarkIds: ['VPN_SRG_TEST']
        },
        rules: { ruleIds: ['SV-106179r1_rule'] }
      }

    const res = await chai.request(config.baseUrl)
      .post(`/collections/${environment.testCollection.collectionId}/reviews`)
      .set('Authorization', `Bearer ${lvl1.token}`)
      .send(postreview)
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('failedValidation')
    expect(res.body).to.have.property('updated')
    expect(res.body).to.have.property('inserted')
    expect(res.body).to.have.property('validationErrors')

  
    expect(res.body.failedValidation).to.eql(2)
    expect(res.body.validationErrors).to.have.length(2)
  
    expect(res.body.inserted).to.eql(0)
    expect(res.body.updated).to.eql(0)

    const reviews = await utils.getReviews(environment.testCollection.collectionId)

    expect(reviews).to.have.lengthOf(2)
    
    for (let review of reviews){
      if (review.ruleId == environment.testCollection.ruleId && review.assetId == environment.testAsset.assetId){ 
        // CASE: Existing review, test reset of resultengine and status - all users can update
          expect(review.status.label).to.eql("submitted");
          expect(review.status.user.username).to.eql("admin");
          expect(review.username).to.eql("admin");
          expect(review.result).to.eql("pass");
      }
      // CASE: Existing review, test reset of resultengine and status - all users can update
      else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 154) {
          expect(review.resultEngine).to.eql(null);
          expect(review.status.label).to.eql("submitted");
          expect(review.status.user.username).to.eql("admin");
          expect(review.username).to.eql("admin");
          expect(review.result).to.eql("fail");
      }
    // CASE: new  review, test reset of resultengine and status - non-lvl1-can update
    else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 62) {
        expect(review.resultEngine).to.eql(null);
        expect(review.status.label).to.eql("saved");
        expect(review.status.user.username).to.eql(user.name);
        expect(review.username).to.eql(user.name);
        expect(review.result).to.eql(postreview.source.review.result);
        expect(review.detail).to.eql(postreview.source.review.detail);
      }
    }
    })
    it(`POST batch Review: target by stig, and one rule, expect validation failure - no detail`, async () => {
      const postreview = {
        source: {
          review: {
            result: 'pass',
            detail: '',
            comment: 'test comment',
            status: 'submitted'
          }
        },
        assets: {
          benchmarkIds: ['VPN_SRG_TEST']
        },
        rules: { ruleIds: ['SV-106179r1_rule'] }
      }

      const res = await chai.request(config.baseUrl)
        .post(`/collections/${environment.testCollection.collectionId}/reviews`)
        .set('Authorization', `Bearer ${lvl1.token}`)
        .send(postreview)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('failedValidation')
      expect(res.body).to.have.property('updated')
      expect(res.body).to.have.property('inserted')
      expect(res.body).to.have.property('validationErrors')
      expect(res.body.inserted).to.eql(0)
      expect(res.body.updated).to.eql(0)
      expect(res.body.failedValidation).to.eql(2)
      expect(res.body.validationErrors).to.have.length(2)
      const reviews = await utils.getReviews(environment.testCollection.collectionId)
      expect(reviews).to.have.lengthOf(2)

      for (let review of reviews){
        if (review.ruleId == environment.testCollection.ruleId && review.assetId == environment.testAsset.assetId){ 
          // CASE: Existing review, test reset of resultengine and status - all users can update
            expect(review.status.label).to.eql("submitted");
            expect(review.status.user.username).to.eql("admin");
            expect(review.username).to.eql("admin");
            expect(review.result).to.eql("pass");
        }
        // CASE: Existing review, test reset of resultengine and status - all users can update
        else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 154) {
            expect(review.resultEngine).to.eql(null);
            expect(review.status.label).to.eql("submitted");
            expect(review.status.user.username).to.eql("admin");
            expect(review.username).to.eql("admin");
            expect(review.result).to.eql("fail");
      }
      // CASE: new  review, test reset of resultengine and status - non-lvl1-can update
      else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 62) {
          expect(review.resultEngine).to.eql(null);
          expect(review.status.label).to.eql("saved");
          expect(review.status.user.username).to.eql(user.name);
          expect(review.username).to.eql(user.name);
          expect(review.result).to.eql(postreview.source.review.result);
          expect(review.detail).to.eql(postreview.source.review.detail);
        }
      }
    })
  })
})