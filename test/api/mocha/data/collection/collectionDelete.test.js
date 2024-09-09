const chai = require('chai')
const chaiHttp = require('chai-http')
const { v4: uuidv4 } = require('uuid');
chai.use(chaiHttp)
const expect = chai.expect
const deepEqualInAnyOrder = require('deep-equal-in-any-order')
chai.use(deepEqualInAnyOrder)
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const iterations = require('../../iterations')
const expectations = require('./expectations')
const reference = require('../../referenceData.js')

describe('DELETE - Collection ', function () {

  before(async function () {
    this.timeout(4000)
    await utils.uploadTestStigs()
  })

  beforeEach(async function () {
      this.timeout(4000)
      await utils.loadAppData()
  })

  for(const iteration of iterations){
    
    if (expectations[iteration.name] === undefined){
      it(`No expectations for this iteration scenario: ${iteration.name}`,async function () {})
      continue
    }

    describe(`iteration:${iteration.name}`, function () {
      const distinct = expectations[iteration.name]

      describe('deleteCollection - /collections/{collectionId}', function () {
        if (iteration.name === 'stigmanadmin' ){

          it('Delete test Collection, test projections - elevated stigmanadmin only',async function () {
              const res = await chai.request(config.baseUrl)
                  .delete(`/collections/${reference.testCollection.collectionId}?elevate=true&projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs`)
                  .set('Authorization', `Bearer ${iteration.token}`)

              expect(res).to.have.status(200)
              expect(res.body.collectionId).to.equal(reference.testCollection.collectionId) 

              expect(res.body.assets).to.have.lengthOf(reference.testCollection.assetIds.length)
              for(const asset of res.body.assets){
                expect(reference.testCollection.assetIds).to.include(asset.assetId)
              }
              expect(res.body.grants).to.have.lengthOf(reference.testCollection.grantsProjected.length)
              for(const grant of res.body.grants){
                const userIds = reference.testCollection.grantsProjected.map(grant => grant.user.userId)
                expect(userIds).to.include(grant.user.userId)
              }

              expect(res.body.owners).to.have.lengthOf(reference.testCollection.owners.length)
              for(const owner of res.body.owners){
                expect(reference.testCollection.owners).to.include(owner.userId)
              }

              expect(res.body.stigs).to.have.lengthOf(reference.testCollection.validStigs.length)
              for(const stig of res.body.stigs){
                expect(reference.testCollection.validStigs).to.include(stig.benchmarkId)
              }

              expect(res.body.statistics).to.have.property('assetCount', reference.testCollection.assetIds.length)
              expect(res.body.statistics).to.have.property('grantCount', reference.testCollection.grantsProjected.length)
              const deletedCollection = await utils.getCollection(reference.testCollection.collectionId)
              expect(deletedCollection).to.be.undefined
          })
        }
        it('Delete deleteCollection collection (stigmanadmin only)',async function () {
          const res = await chai.request(config.baseUrl)
              .delete(`/collections/${reference.deleteCollection.collectionId}`)
              .set('Authorization', `Bearer ${iteration.token}`)

          if(distinct.canDeleteCollection === false){ 
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)

          expect(res.body.collectionId).to.equal(reference.deleteCollection.collectionId)

          //confirm that it is deleted
          const deletedCollection = await utils.getCollection(reference.deleteCollection.collectionId)
          expect(deletedCollection).to.be.undefined
        })
      })

      describe('deleteCollectionLabelById - /collections/{collectionId}/labels/{labelId}', function () {

        it('Delete a scrap collection scrap Label',async function () {
            const res = await chai.request(config.baseUrl)
                .delete(`/collections/${reference.scrapCollection.collectionId}/labels/${reference.scrapCollection.scrapLabel}`)
                .set('Authorization', `Bearer ${iteration.token}`)
            if(distinct.canModifyCollection === false){
                expect(res).to.have.status(403)
                return
            }
            expect(res).to.have.status(204)
            const collection = await utils.getCollection(reference.scrapCollection.collectionId)
            expect(collection.labels).to.not.include(reference.scrapCollection.scrapLabel)
        })
        it("should throw SmError.NotFoundError when deleting a non-existent label.",async function () {
          const labelId = uuidv4()
          const res = await chai.request(config.baseUrl)
              .delete(`/collections/${reference.scrapCollection.collectionId}/labels/${labelId}`)
              .set('Authorization', `Bearer ${iteration.token}`)
          if(distinct.canModifyCollection === false){
              expect(res).to.have.status(403)
              return
          }
          expect(res).to.have.status(404)
          expect(res.body.error).to.equal("Resource not found.")
        })
      })

      describe('deleteCollectionMetadataKey - /collections/{collectionId}/metadata/keys/{key}', function () {

        it('Delete a scrap collection Metadata Key',async function () {
            const res = await chai.request(config.baseUrl)
                .delete(`/collections/${reference.scrapCollection.collectionId}/metadata/keys/${reference.scrapCollection.collectionMetadataKey}`)
                .set('Authorization', `Bearer ${iteration.token}`)

              if(distinct.canModifyCollection === false){
                expect(res).to.have.status(403)
                return
              }

              expect(res).to.have.status(204)
              const collection = await utils.getCollection(reference.scrapCollection.collectionId)
              expect(collection.metadata).to.not.have.property(reference.scrapCollection.collectionMetadataKey)
        })
      })

      describe('deleteReviewHistoryByCollection - /collections/{collectionId}/review-history', function () {

        it('Delete review History records - retentionDate',async function () {
            const res = await chai.request(config.baseUrl)
                .delete(`/collections/${reference.testCollection.collectionId}/review-history?retentionDate=${reference.testCollection.reviewHistory.endDate}`)
                .set('Authorization', `Bearer ${iteration.token}`)
                
            if(distinct.canModifyCollection === false){
              expect(res).to.have.status(403)
              return
            }
  
            expect(res).to.have.status(200)
            expect(res.body.HistoryEntriesDeleted).to.be.equal(reference.testCollection.reviewHistory.deletedEntriesByDate)
        })

        it('Delete review History records - date and assetId',async function () {
            const res = await chai.request(config.baseUrl)
                .delete(`/collections/${reference.testCollection.collectionId}/review-history?retentionDate=${reference.testCollection.reviewHistory.endDate}&assetId=${reference.testCollection.testAssetId}`)
                .set('Authorization', `Bearer ${iteration.token}`)

              if(distinct.canModifyCollection === false){
                expect(res).to.have.status(403)
                return
              }
  
            expect(res).to.have.status(200)
            expect(res.body.HistoryEntriesDeleted).to.be.equal(reference.testCollection.reviewHistory.deletedEntriesByDateAsset)
        })
      })
    })
  }
})

