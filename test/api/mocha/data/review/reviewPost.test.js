const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const users = require('../../iterations.json')

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

describe('POST - Review', () => {

  for(const user of users){
    describe(`user:${user.name}`, () => {

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
            if(user.name == "lvl1"){
              expect(res.body.failedValidation).to.eql(2)
              expect(res.body.validationErrors).to.have.length(2)
            }
            else{
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
  }
})

// describe('Review POSTs tests using "lvl1" user ', () => {

//   describe('POST - postReviewBatch - /collections/{collectionId}/reviews', () => {
//     beforeEach(async function () {
//       this.timeout(4000)
//       await utils.loadBatchAppData()
//       await utils.uploadTestStigs()
//       await utils.createDisabledCollectionsandAssets()
//     })
//     it(`POST batch Review: target by stig, and one rule, expect validation failure - invalid result for status`, async () => {
//         const postreview = {
//           source: {
//             review: {
//               result: 'informational',
//               detail: 'tesetsetset',
//               status: 'submitted'
//             }
//           },
//           assets: {
//             benchmarkIds: ['VPN_SRG_TEST']
//           },
//           rules: { ruleIds: ['SV-106179r1_rule'] }
//         }
//       const res = await chai.request(config.baseUrl)
//       .post(`/collections/${environment.testCollection.collectionId}/reviews`)
//       .set('Authorization', `Bearer ${lvl1.token}`)
//       .send(postreview)
//       expect(res).to.have.status(200)
//       expect(res.body).to.be.an('object')
//       expect(res.body).to.have.property('failedValidation')
//       expect(res.body).to.have.property('updated')
//       expect(res.body).to.have.property('inserted')
//       expect(res.body).to.have.property('validationErrors')
//       expect(res.body.inserted).to.eql(0)
//       expect(res.body.updated).to.eql(0)
//       expect(res.body.failedValidation).to.eql(2)
//       expect(res.body.validationErrors).to.have.length(2)
//       const reviews = await utils.getReviews(environment.testCollection.collectionId)
//       expect(reviews).to.have.lengthOf(2)
      
//       for (let review of reviews){
//         if (review.ruleId == environment.testCollection.ruleId && review.assetId == environment.testAsset.assetId){ 
//           // CASE: Existing review, test reset of resultengine and status - all users can update
//             expect(review.status.label).to.eql("submitted");
//             expect(review.status.user.username).to.eql("admin");
//             expect(review.username).to.eql("admin");
//             expect(review.result).to.eql("pass");
//         }
//         // CASE: Existing review, test reset of resultengine and status - all users can update
//         else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 154) {
//             expect(review.resultEngine).to.eql(null);
//             expect(review.status.label).to.eql("submitted");
//             expect(review.status.user.username).to.eql("admin");
//             expect(review.username).to.eql("admin");
//             expect(review.result).to.eql("fail");
//         }
//       // CASE: new  review, test reset of resultengine and status - non-lvl1-can update
//       else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 62) {
//           expect(review.resultEngine).to.eql(null);
//           expect(review.status.label).to.eql("saved");
//           expect(review.status.user.username).to.eql(user.name);
//           expect(review.username).to.eql(user.name);
//           expect(review.result).to.eql(postreview.source.review.result);
//           expect(review.detail).to.eql(postreview.source.review.detail);
//         }
//       }
//     })
//     it(`POST batch Review: target by assets, and one rule`, async () => {

//       const postreview = {
//         source: {
//           review: {
//             result: 'fail',
//             detail: 'tesetsetset'
//           }
//         },
//         assets: {
//           assetIds: ['62', '42', '154']
//         },
//         rules: {
//             ruleIds: ['SV-106179r1_rule']
//           }
        
//       }

//       const res = await chai.request(config.baseUrl)
//         .post(`/collections/${environment.testCollection.collectionId}/reviews`)
//         .set('Authorization', `Bearer ${lvl1.token}`)
//         .send(postreview)
//       expect(res).to.have.status(200)
  
//       const reviews = await utils.getReviews(environment.testCollection.collectionId)
    
//       expect(res.body.inserted).to.eql(0)
//       expect(res.body.failedValidation).to.eql(1)
//       expect(res.body.updated).to.eql(2)
//       expect(res.body.validationErrors).to.have.length(1)
//       expect(reviews).to.have.lengthOf(2)
//       for(let review of reviews){
//         if(review.ruleId == environment.testCollection.ruleId && review.assetId == environment.testAsset.assetId){
//           if (postreview.action == "insert") {
//               expect(review.resultEngine).to.not.eql(null);
//               expect(review.status.user.username).to.eql("admin");
//           }else{
//             expect(review.resultEngine).to.eql(null)
//             expect(review.status.label).to.eql("saved")
//             expect(review.status.user.username).to.eql(lvl1.name)
//             expect(review.username).to.eql(lvl1.name)
//             expect(review.result).to.eql(postreview.source.review.result)
//             expect(review.detail).to.eql(postreview.source.review.detail)
//           }
//         }
//         else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 154) {
//           if (postreview.action == "insert") {
//             expect(review.status.user.username).to.eql("admin");
//             expect(review.username).to.eql("admin");              
//             expect(review.detail).to.eql("test");
//           }
//           else {
//             expect(review.resultEngine).to.eql(null)
//             expect(review.status.label).to.eql("submitted")
//             expect(review.status.user.username).to.eql("admin")
//             expect(review.username).to.eql(lvl1.name)
//             expect(review.result).to.eql(postreview.source.review.result)
//             expect(review.detail).to.eql(postreview.source.review.detail)
//           }
//         }
//         else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 62) {
//           if (postreview.action == "insert") {
//             expect(review.resultEngine).to.eql(null);
//           }
//           else {
//             expect(review.resultEngine).to.eql(null)
//           }
//           expect(review.status.label).to.eql("saved")
//           expect(review.status.user.username).to.eql(user.name)
//           expect(review.username).to.eql(user.name)
//           expect(review.result).to.eql(postreview.source.review.result)
//           expect(review.detail).to.eql(postreview.source.review.detail)
//         }
//       }
//     })
//     it(`POST batch Review: target by stig, and one rule, expect validation failure - fail result, no comment`, async () => {
//       const postreview = {
//         source: {
//           review: {
//             result: 'fail',
//             detail: 'tesetsetset',
//             comment: '',
//             status: 'submitted'
//           }
//         },
//         assets: {
//           benchmarkIds: ['VPN_SRG_TEST']
//         },
//         rules: { ruleIds: ['SV-106179r1_rule'] }
//       }

//     const res = await chai.request(config.baseUrl)
//       .post(`/collections/${environment.testCollection.collectionId}/reviews`)
//       .set('Authorization', `Bearer ${lvl1.token}`)
//       .send(postreview)
//     expect(res).to.have.status(200)
//     expect(res.body).to.be.an('object')
//     expect(res.body).to.have.property('failedValidation')
//     expect(res.body).to.have.property('updated')
//     expect(res.body).to.have.property('inserted')
//     expect(res.body).to.have.property('validationErrors')

  
//     expect(res.body.failedValidation).to.eql(2)
//     expect(res.body.validationErrors).to.have.length(2)
  
//     expect(res.body.inserted).to.eql(0)
//     expect(res.body.updated).to.eql(0)

//     const reviews = await utils.getReviews(environment.testCollection.collectionId)

//     expect(reviews).to.have.lengthOf(2)
    
//     for (let review of reviews){
//       if (review.ruleId == environment.testCollection.ruleId && review.assetId == environment.testAsset.assetId){ 
//         // CASE: Existing review, test reset of resultengine and status - all users can update
//           expect(review.status.label).to.eql("submitted");
//           expect(review.status.user.username).to.eql("admin");
//           expect(review.username).to.eql("admin");
//           expect(review.result).to.eql("pass");
//       }
//       // CASE: Existing review, test reset of resultengine and status - all users can update
//       else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 154) {
//           expect(review.resultEngine).to.eql(null);
//           expect(review.status.label).to.eql("submitted");
//           expect(review.status.user.username).to.eql("admin");
//           expect(review.username).to.eql("admin");
//           expect(review.result).to.eql("fail");
//       }
//     // CASE: new  review, test reset of resultengine and status - non-lvl1-can update
//     else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 62) {
//         expect(review.resultEngine).to.eql(null);
//         expect(review.status.label).to.eql("saved");
//         expect(review.status.user.username).to.eql(user.name);
//         expect(review.username).to.eql(user.name);
//         expect(review.result).to.eql(postreview.source.review.result);
//         expect(review.detail).to.eql(postreview.source.review.detail);
//       }
//     }
//     })
//     it(`POST batch Review: target by stig, and one rule, expect validation failure - no detail`, async () => {
//       const postreview = {
//         source: {
//           review: {
//             result: 'pass',
//             detail: '',
//             comment: 'test comment',
//             status: 'submitted'
//           }
//         },
//         assets: {
//           benchmarkIds: ['VPN_SRG_TEST']
//         },
//         rules: { ruleIds: ['SV-106179r1_rule'] }
//       }

//       const res = await chai.request(config.baseUrl)
//         .post(`/collections/${environment.testCollection.collectionId}/reviews`)
//         .set('Authorization', `Bearer ${lvl1.token}`)
//         .send(postreview)
//       expect(res).to.have.status(200)
//       expect(res.body).to.be.an('object')
//       expect(res.body).to.have.property('failedValidation')
//       expect(res.body).to.have.property('updated')
//       expect(res.body).to.have.property('inserted')
//       expect(res.body).to.have.property('validationErrors')
//       expect(res.body.inserted).to.eql(0)
//       expect(res.body.updated).to.eql(0)
//       expect(res.body.failedValidation).to.eql(2)
//       expect(res.body.validationErrors).to.have.length(2)
//       const reviews = await utils.getReviews(environment.testCollection.collectionId)
//       expect(reviews).to.have.lengthOf(2)

//       for (let review of reviews){
//         if (review.ruleId == environment.testCollection.ruleId && review.assetId == environment.testAsset.assetId){ 
//           // CASE: Existing review, test reset of resultengine and status - all users can update
//             expect(review.status.label).to.eql("submitted");
//             expect(review.status.user.username).to.eql("admin");
//             expect(review.username).to.eql("admin");
//             expect(review.result).to.eql("pass");
//         }
//         // CASE: Existing review, test reset of resultengine and status - all users can update
//         else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 154) {
//             expect(review.resultEngine).to.eql(null);
//             expect(review.status.label).to.eql("submitted");
//             expect(review.status.user.username).to.eql("admin");
//             expect(review.username).to.eql("admin");
//             expect(review.result).to.eql("fail");
//       }
//       // CASE: new  review, test reset of resultengine and status - non-lvl1-can update
//       else if (review.ruleId == environment.testCollection.ruleId && review.assetId == 62) {
//           expect(review.resultEngine).to.eql(null);
//           expect(review.status.label).to.eql("saved");
//           expect(review.status.user.username).to.eql(user.name);
//           expect(review.username).to.eql(user.name);
//           expect(review.result).to.eql(postreview.source.review.result);
//           expect(review.detail).to.eql(postreview.source.review.detail);
//         }
//       }
//     })
//   })
// })