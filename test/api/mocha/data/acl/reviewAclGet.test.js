const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils.js')
const environment = require('../../environment.json')
const expectations = require('./expectations.js')
const reference = require('./referenceData.js')
const requestBodies = require('./requestBodies.js')


const users = require('../../iterations.js')

describe('GET - Review ACL', () => {
  before(async function () {
    // this.timeout(4000)
    // await utils.loadAppData()
    // await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const user of users){
    if (expectations[user.name] === undefined){
      it(`No expectations for this iteration scenario: ${user.name}`, async () => {})
      continue
    }

    
    describe(`user:${user.name}`, () => {
      const distinct = expectations[user.name]

      it('set acls for this iteration', async () => {
        const res = await chai.request(config.baseUrl)
        .put(`/collections/${reference.testCollection.collectionId}/grants/user/${reference.grantCheckUserId}/access`)
        .set('Authorization', `Bearer ${config.adminToken}`)
        .send(requestBodies.iterationSetup[user.name])


       expect(res).to.have.status(200)
      })

      // check effective ACLs here


      describe('GET - getReviewsByCollection - /collections/{collectionId}/reviews', () => {
        
        it('Return a list of reviews accessible to the requester', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews?projection=rule&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)


          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')

          // Extract all ruleIds
          const allRuleIds = res.body.flatMap(item => item.ruleId);
          // Extract all assetIds
          const allAssetIds = res.body.map(item => item.assetId);
          // Extract all benchmarkIds
          const allBenchmarkIds = res.body.flatMap(item => item.stigs.map(stig => stig.benchmarkId));

          // rule id set:
          let ruleIdSet =  [...new Set(allRuleIds)]
          // add review count check
          // check against expected rule set

          for(const review of res.body){

            expect(review.assetId, "assetIds").to.be.oneOf(distinct.assetIds)

            for(const stig of review.stigs){
              expect(stig).to.have.property('benchmarkId')
              expect(stig.benchmarkId, "benchmarkIds").to.be.oneOf(distinct.validStigs)
            }

            
          }
        })



      })


        it('reviews with assetId param and Projections.', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews?assetId=${reference.testAsset.assetId}&projection=rule&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)

          expect(res).to.have.status(200)
      

          expect(res.body).to.be.lengthOf(distinct.testAssetStats.reviewCount)


          // check for appropriate ruleIds

          for(let review of res.body){
            // checking for basic properties
            // expect(review).to.have.property('assetId')
            expect(review.assetId).to.be.equal(reference.testAsset.assetId)

            expect(review).to.have.property('assetLabelIds')

            for(let assetLabelId of review.assetLabelIds){
              expect(assetLabelId).to.be.oneOf(reference.testAsset.labels)
            }

            expect(review.metadata).to.be.an('object')
            
            for(let stig of review.stigs){
              expect(stig).to.have.property('benchmarkId')
              expect(stig.benchmarkId).to.be.oneOf(distinct.validStigs)
            }
            expect(review.rule).to.be.an('object')
            expect(review.rule).to.have.property('ruleId')
            
          }
        })


      //   it('Return a list of reviews accessible to the requester, benchmarkId Projection.', async () => {
      //     const res = await chai.request(config.baseUrl)
      //       .get(`/collections/${environment.testCollection.collectionId}/reviews?benchmarkId=${environment.testCollection.benchmark}&projection=rule&projection=stigs&projection=metadata`)
      //       .set('Authorization', `Bearer ${user.token}`)
      //     if(user.name === 'collectioncreator') {
      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     expect(res.body).to.be.an('array')
      //     if(user.name === 'lvl1'){
      //       expect(res.body).to.be.lengthOf(11)
      //     }
      //     else {
      //       expect(res.body).to.be.lengthOf(14)
      //     }

      //     for(let review of res.body){
      //       for(let stig of review.stigs){
      //         expect(stig).to.have.property('benchmarkId')
      //         expect(stig.benchmarkId).to.be.equal(environment.testCollection.benchmark)
      //       }        
      //     }
      //   })
      //   it('Return a list of reviews accessible to the requester, metadata Projection.', async () => {
      //     const res = await chai.request(config.baseUrl)
      //       .get(`/collections/${environment.testCollection.collectionId}/reviews?projection=rule&projection=stigs&metadata=${environment.testCollection.metadataKey}%3A${environment.testCollection.metadataValue}&projection=metadata`)
      //       .set('Authorization', `Bearer ${user.token}`)
      //     if(user.name === 'collectioncreator') {
      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     expect(res.body).to.be.an('array')
      //     expect(res.body).to.be.lengthOf(1)

      //     for(let review of res.body){
      //       expect(review.metadata).to.be.an('object')
      //       expect(review.metadata).to.have.property(environment.testCollection.metadataKey)
      //       expect(review.metadata[environment.testCollection.metadataKey]).to.be.equal(environment.testCollection.metadataValue)
      //     }
      //   })
      //   it('Return a list of reviews accessible to the requester, result projection fail only', async () => {
      //     const res = await chai.request(config.baseUrl)
      //       .get(`/collections/${environment.testCollection.collectionId}/reviews?result=fail&projection=rule&projection=stigs&projection=metadata`)
      //       .set('Authorization', `Bearer ${user.token}`)
      //     if(user.name === 'collectioncreator') {
      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     expect(res.body).to.be.an('array')
      //     if(user.name === 'lvl1'){
      //       expect(res.body).to.be.lengthOf(6)
      //     }
      //     else {
      //       expect(res.body).to.be.lengthOf(8)
      //     }

      //     for(let review of res.body){
      //       expect(review.result).to.be.equal('fail')
      //     }
      //   })
      //   it('Return a list of reviews accessible to the requester, ruleid projection', async () => {
      //     const res = await chai.request(config.baseUrl)
      //       .get(`/collections/${environment.testCollection.collectionId}/reviews?ruleId=${environment.testCollection.ruleId}&projection=rule&projection=stigs&projection=metadata`)
      //       .set('Authorization', `Bearer ${user.token}`)
      //     if(user.name === 'collectioncreator') {
      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     expect(res.body).to.be.an('array')
      //     if(user.name === 'lvl1'){
      //       expect(res.body).to.be.lengthOf(2)
      //     }
      //     else {
      //       expect(res.body).to.be.lengthOf(3)
      //     }

      //     for(let review of res.body){
      //       expect(review.ruleId).to.be.equal(environment.testCollection.ruleId)
      //       expect(review.rule.ruleId).to.be.equal(environment.testCollection.ruleId)
      //       expect(review.ruleIds).to.include(environment.testCollection.ruleId)
      //     }
      //   })
      //   it('Return a list of reviews accessible to the requester, status projection: saved.', async () => {
      //     const res = await chai.request(config.baseUrl)
      //       .get(`/collections/${environment.testCollection.collectionId}/reviews?status=saved&projection=rule&projection=stigs&projection=metadata`)
      //       .set('Authorization', `Bearer ${user.token}`)
      //     if(user.name === 'collectioncreator') {
      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     expect(res.body).to.be.an('array')
      //     if(user.name === 'lvl1'){
      //       expect(res.body).to.be.lengthOf(4)
      //     }
      //     else {
      //       expect(res.body).to.be.lengthOf(6)
      //     }

      //     for(let review of res.body){
      //       expect(review.status.label).to.be.equal('saved')
      //     }
      //   })
      //   it('Return a list of reviews accessible to the requester, userId projection.', async () => {
      //     const res = await chai.request(config.baseUrl)
      //       .get(`/collections/${environment.testCollection.collectionId}/reviews?userId=${environment.stigmanadmin.userId}&projection=rule&projection=stigs&projection=metadata`)
      //       .set('Authorization', `Bearer ${user.token}`)
      //     if(user.name === 'collectioncreator') {
      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     expect(res.body).to.be.an('array')
      //     if(user.name === 'lvl1'){
      //       expect(res.body).to.be.lengthOf(9)
      //     }
      //     else {
      //       expect(res.body).to.be.lengthOf(14)
      //     }

      //     for(let review of res.body){
      //       expect(review.userId).to.be.equal(environment.stigmanadmin.userId)
      //     }
      //   })
      // })
      // describe('GET - getReviewsByAsset - /collections/{collectionId}/reviews/{assetId}', () => {
      //   it('Return a list of Reviews for an Asset', async () => {
      //     const res = await chai.request(config.baseUrl)
      //       .get(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}?projection=rule&projection=stigs&projection=metadata`)
      //       .set('Authorization', `Bearer ${user.token}`)
      //     if(user.name === 'collectioncreator') {
      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     expect(res.body).to.be.an('array')


      //     for(let review of res.body){
      //       // checking for basic properties
      //       expect(review).to.have.property('assetId')
      //       expect(review.assetId).to.be.equal(environment.testAsset.assetId)
      //       expect(review).to.have.property('assetLabelIds')
      //       expect(review).to.have.property('assetName')
      //       expect(review).to.have.property('resultEngine')
      //       expect(review).to.have.property('detail')
      //       expect(review).to.have.property('status')

      //       //check projectrions 
      //       expect(review).to.have.property('rule')
      //       expect(review).to.have.property('stigs')
      //       expect(review.stigs).to.be.an('array')  
      //       expect(review).to.have.property('metadata')

      //       for(let stig of review.stigs){
      //         expect(stig).to.have.property('benchmarkId')
      //         expect(stig.benchmarkId).to.be.oneOf(environment.testAsset.validStigs)
      //       }

      //       //check metadata
      //       expect(review.metadata).to.be.an('object')
        
      //       //check rule
      //       expect(review.rule).to.be.an('object')
      //       expect(review.rule).to.have.property('ruleId')
            
      //     }
      //   })
      //   it('Return a list of Reviews for an Asset, benchmarkId Projection.', async () => {
      //     const res = await chai.request(config.baseUrl)
      //       .get(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}?benchmarkId=${environment.testCollection.benchmark}&projection=rule&projection=stigs&projection=metadata`)
      //       .set('Authorization', `Bearer ${user.token}`)
      //     if(user.name === 'collectioncreator') {
      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     expect(res.body).to.be.an('array')
      //     expect(res.body).to.be.lengthOf(6)


      //     for(let review of res.body){
      //       expect(review.assetId).to.be.equal(environment.testAsset.assetId)
      //       for(let stig of review.stigs){
      //         expect(stig).to.have.property('benchmarkId')
      //         expect(stig.benchmarkId).to.be.equal(environment.testCollection.benchmark)
      //       }        
      //     }
      //   })
      //   it('Return a list of Reviews for an Asset , metadata Projection.', async () => {
      //     const res = await chai.request(config.baseUrl)
      //       .get(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}?projection=rule&projection=stigs&metadata=${environment.testAsset.metadataKey}%3A${environment.testAsset.metadataValue}&projection=metadata`)
      //       .set('Authorization', `Bearer ${user.token}`)
      //     if(user.name === 'collectioncreator') {
      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     expect(res.body).to.be.an('array')
      //     expect(res.body).to.be.lengthOf(1)

      //     for(let review of res.body){
      //       expect(review.assetId).to.be.equal(environment.testAsset.assetId)
      //       expect(review.metadata).to.be.an('object')
      //       expect(review.metadata).to.have.property(environment.testCollection.metadataKey)
      //       expect(review.metadata[environment.testCollection.metadataKey]).to.be.equal(environment.testCollection.metadataValue)
      //     }
      //   })
      //   it('Return a list of reviews accessible to the requester, result projection pass only', async () => {
      //     const res = await chai.request(config.baseUrl)
      //       .get(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}?result=pass&projection=rule&projection=stigs&projection=metadata`)
      //       .set('Authorization', `Bearer ${user.token}`)
      //     if(user.name === 'collectioncreator') {
      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     expect(res.body).to.be.an('array')
      //     if(user.name === 'lvl1'){
      //       expect(res.body).to.be.lengthOf(2)
      //     }
      //     else {
      //       expect(res.body).to.be.lengthOf(4)
      //     }

      //     for(let review of res.body){
      //       expect(review.assetId).to.be.equal(environment.testAsset.assetId)
      //       expect(review.result).to.be.equal('pass')
      //     }
      //   })
      //   it('Return a list of reviews accessible to the requester, result projection fail only', async () => {
      //     const res = await chai.request(config.baseUrl)
      //       .get(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}?result=fail&projection=rule&projection=stigs&projection=metadata`)
      //       .set('Authorization', `Bearer ${user.token}`)
      //     if(user.name === 'collectioncreator') {
      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     expect(res.body).to.be.an('array')
      //     if(user.name === 'lvl1'){
      //       expect(res.body).to.be.lengthOf(3)
      //     }
      //     else {
      //       expect(res.body).to.be.lengthOf(4)
      //     }

      //     for(let review of res.body){
      //       expect(review.assetId).to.be.equal(environment.testAsset.assetId)
      //       expect(review.result).to.be.equal('fail')
      //     }
      //   })
      //   it('Return a list of reviews accessible to the requester, result projection informational only', async () => {
      //     const res = await chai.request(config.baseUrl)
      //       .get(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}?result=informational&projection=rule&projection=stigs&projection=metadata`)
      //       .set('Authorization', `Bearer ${user.token}`)
      //     if(user.name === 'collectioncreator') {
      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     expect(res.body).to.be.an('array')
      //     expect(res.body).to.be.lengthOf(0)

      //     for(let review of res.body){
      //       expect(review.assetId).to.be.equal(environment.testAsset.assetId)
      //       expect(review.result).to.be.equal('informational')
      //     }
      //   })
      //   it('Return a list of reviews accessible to the requester, status projection: saved.', async () => {
      //     const res = await chai.request(config.baseUrl)
      //       .get(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}?status=saved&projection=rule&projection=stigs&projection=metadata`)
      //       .set('Authorization', `Bearer ${user.token}`)
      //     if(user.name === 'collectioncreator') {
      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     expect(res.body).to.be.an('array')
      //     if(user.name === 'lvl1'){
      //       expect(res.body).to.be.lengthOf(1)
      //     }
      //     else {
      //       expect(res.body).to.be.lengthOf(2)
      //     }

      //     for(let review of res.body){
      //       expect(review.assetId).to.be.equal(environment.testAsset.assetId)
      //       expect(review.status.label).to.be.equal('saved')
      //     }
      //   })
      //   it('Return a list of reviews accessible to the requester, status projection: submitted.', async () => {
      //     const res = await chai.request(config.baseUrl)
      //       .get(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}?status=submitted&projection=rule&projection=stigs&projection=metadata`)
      //       .set('Authorization', `Bearer ${user.token}`)
      //     if(user.name === 'collectioncreator') {
      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     expect(res.body).to.be.an('array')
      //     if(user.name === 'lvl1'){
      //       expect(res.body).to.be.lengthOf(5)
      //     }
      //     else {
      //       expect(res.body).to.be.lengthOf(7)
      //     }
          
      //     for(let review of res.body){
      //       expect(review.assetId).to.be.equal(environment.testAsset.assetId)
      //       expect(review.status.label).to.be.equal('submitted')
      //     }
      //   })
      // })
      describe('GET - getReviewByAssetRule - /collections/{collectionId}/reviews/{assetId}/{ruleId}', () => {

        it('Return the Review for an Asset and Rule - VPN rule, expect 200 response in most test cases', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}/${reference.testRuleIdVPN}?projection=rule&projection=stigs&projection=metadata&projection=history`)
            .set('Authorization', `Bearer ${user.token}`)

          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')

          const review = res.body
        
          // checking for basic properties
          expect(review).to.have.property('assetId')
          expect(review.assetId).to.be.equal(reference.testAsset.assetId)

          // expect(review).to.have.property('assetLabelIds')
          // expect(review).to.have.property('assetName')
          // expect(review).to.have.property('resultEngine')
          // expect(review).to.have.property('detail')
          // expect(review).to.have.property('status')

          //check projectrions 
          expect(review).to.have.property('rule')
          expect(review.rule).to.be.an('object')
          expect(review.rule).to.have.property('ruleId')
          expect(review.rule.ruleId).to.be.equal(reference.testRuleIdVPN)

          expect(review).to.have.property('stigs')
          expect(review.stigs).to.be.an('array')  

          expect(review).to.have.property('metadata')
          expect(review.metadata).to.be.an('object')
          // expect(review.metadata).to.have.property(environment.testCollection.metadataKey)
          // expect(review.metadata[environment.testCollection.metadataKey]).to.be.equal(environment.testCollection.metadataValue)

          expect(review).to.have.property('history')
          expect(review.history).to.be.an('array')  
          // for(let history of review.history){
          //   expect(history).to.have.property('result')
          //   expect(history).to.have.property('ruleId')
          //   expect(history).to.have.property('status')
          // }
          for(let stig of review.stigs){
            expect(stig).to.have.property('benchmarkId')
            expect(stig.benchmarkId).to.be.oneOf(distinct.validStigs)
          } 
        })

        it('Return the Review for an Asset and Rule - WIN rule, excluded in many test cases', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${reference.testCollection.collectionId}/reviews/${reference.testAsset.assetId}/${reference.testRuleIdWin}?projection=rule&projection=stigs&projection=metadata&projection=history`)
            .set('Authorization', `Bearer ${user.token}`)

          if (distinct.validStigs.includes('Windows_10_STIG_TEST') === false){
            expect(res).to.have.status(204)
            return
          }

          expect(res).to.have.status(200)

          expect(res.body).to.be.an('object')

          const review = res.body
        
          // checking for basic properties
          expect(review).to.have.property('assetId')
          expect(review.assetId).to.be.equal(reference.testAsset.assetId)

          // expect(review).to.have.property('assetLabelIds')
          // expect(review).to.have.property('assetName')
          // expect(review).to.have.property('resultEngine')
          // expect(review).to.have.property('detail')
          // expect(review).to.have.property('status')

          //check projectrions 
          expect(review).to.have.property('rule')
          expect(review.rule).to.be.an('object')
          expect(review.rule).to.have.property('ruleId')
          expect(review.rule.ruleId).to.be.equal(reference.testRuleIdWin)

          expect(review).to.have.property('stigs')
          expect(review.stigs).to.be.an('array')  

          expect(review).to.have.property('metadata')
          expect(review.metadata).to.be.an('object')
          // expect(review.metadata).to.have.property(environment.testCollection.metadataKey)
          // expect(review.metadata[environment.testCollection.metadataKey]).to.be.equal(environment.testCollection.metadataValue)

          expect(review).to.have.property('history')
          expect(review.history).to.be.an('array')  
          // for(let history of review.history){
          //   expect(history).to.have.property('result')
          //   expect(history).to.have.property('ruleId')
          //   expect(history).to.have.property('status')
          // }
          for(let stig of review.stigs){
            expect(stig).to.have.property('benchmarkId')
            expect(stig.benchmarkId).to.be.oneOf(distinct.validStigs)
          } 
        })


      })
      // describe('GET - getReviewMetadata - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata', () => {

      //   it('Return the metadata for a Review', async () => {
      //     const res = await chai.request(config.baseUrl)
      //       .get(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}/metadata`)
      //       .set('Authorization', `Bearer ${user.token}`)
      //     if(user.name === 'collectioncreator') {
      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     expect(res.body).to.be.an('object')
      //     expect(res.body).to.have.property(environment.testAsset.metadataKey)
      //     expect(res.body[environment.testAsset.metadataKey]).to.be.equal(environment.testAsset.metadataValue)
      //   })

      // })
      // describe('GET - getReviewMetadataKeys - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata/keys', () => {
          
      //     it('Return the Review Metadata KEYS for an Asset and Rule', async () => {
      //       const res = await chai.request(config.baseUrl)
      //         .get(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}/metadata/keys`)
      //         .set('Authorization', `Bearer ${user.token}`)
      //       if(user.name === 'collectioncreator') {
      //         expect(res).to.have.status(403)
      //         return
      //       }
      //       expect(res).to.have.status(200)
      //       expect(res.body).to.be.an('array')
      //       expect(res.body).to.be.lengthOf(1)
      //       expect(res.body).to.include(environment.testAsset.metadataKey)
      //     })
      // })
      // describe('GET - getReviewMetadataValue - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata/keys/{key}', () => {

      //   it('Return the Review Metadata VALUE for an Asset/Rule/metadata KEY', async () => {
      //     const res = await chai.request(config.baseUrl)
      //       .get(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}/${environment.testCollection.ruleId}/metadata/keys/${environment.testAsset.metadataKey}`)
      //       .set('Authorization', `Bearer ${user.token}`)
      //     if(user.name === 'collectioncreator') {
      //       expect(res).to.have.status(403)
      //       return
      //     }
      //     expect(res).to.have.status(200)
      //     expect(res.body).to.be.an('string')
      //     expect(res.body).to.equal(environment.testAsset.metadataValue)  
      //   })
      // })
    })
  }
})

