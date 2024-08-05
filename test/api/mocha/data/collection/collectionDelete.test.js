const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const users = require('../../iterations.json')
const expectations = require('./expectations.json')

describe('DELETE - Collection ', () => {

  beforeEach(async function () {
      this.timeout(4000)
      await utils.loadAppData()
      await utils.uploadTestStigs()
  })

  for(const user of users){

    describe(`user:${user.name}`, () => {
      const distinct = expectations[user.name]
      const common = expectations.common // or stigmanadmin expectations?

      describe('deleteCollection - /collections/{collectionId}', () => {
        if (user.name === 'stigmanadmin' ){

          it('Delete a Collection - elevated stigmanadmin only', async () => {
              const res = await chai.request(config.baseUrl)
                  .delete(`/collections/${distinct.deleteCollectionId_admin}?elevate=true&projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs`)
                  .set('Authorization', `Bearer ${user.token}`)

              if(user.name !== "stigmanadmin" ){
                  expect(res).to.have.status(403)
                  return
              }
              expect(res).to.have.status(200)

              expect(res.body.collectionId).to.equal(distinct.deleteCollectionId_admin)

              // //assets
              // for(const asset of res.body.assets){
              //     expect(asset.assetId).to.be.oneOf(environment.testCollection.assetIDsInCollection)
              // }

              // //grants
              // for(const grant of res.body.grants){
              //     expect(grant.user.userId).to.be.oneOf(environment.testCollection.userIdsWithGrant)
              // }

              // // owners
              // for(const owner of res.body.owners){
              //     expect(owner.userId).to.be.oneOf(environment.testCollection.owners)
              // }

              // //stigs
              // for(const stig of res.body.stigs){
              //     expect(stig.benchmarkId).to.be.oneOf(environment.testCollection.validStigs)
              // }

              //confirm that it is deleted
              const deletedCollection = await utils.getCollection(distinct.deleteCollectionId_admin)
              expect(deletedCollection).to.be.undefined
          })
        }

        it('Delete a Collection no elevate', async () => {
          const res = await chai.request(config.baseUrl)
              .delete(`/collections/${common.deleteCollection.collectionId}?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs`)
              .set('Authorization', `Bearer ${user.token}`)

          if(user.name === "lvl1" || user.name === "lvl2" || user.name === "lvl3" ){ 
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)

          expect(res.body.collectionId).to.equal(common.deleteCollection.collectionId)

          //assets
          // for(const asset of res.body.assets){
          //     expect(asset.assetId).to.be.oneOf(environment.testCollection.assetIDsInCollection)
          // }

          // //grants
          // for(const grant of res.body.grants){
          //     expect(grant.user.userId).to.be.oneOf(environment.testCollection.userIdsWithGrant)
          // }

          // // owners
          // for(const owner of res.body.owners){
          //     expect(owner.userId).to.be.oneOf(environment.testCollection.owners)
          // }

          // //stigs
          // for(const stig of res.body.stigs){
          //     expect(stig.benchmarkId).to.be.oneOf(environment.testCollection.validStigs)
          // }

          //confirm that it is deleted
          const deletedCollection = await utils.getCollection(common.deleteCollection.collectionId)
          expect(deletedCollection).to.be.undefined
        })
      })

      describe('deleteCollectionLabelById - /collections/{collectionId}/labels/{labelId}', () => {

        it('Delete a Collection Label', async () => {
            const res = await chai.request(config.baseUrl)
                .delete(`/collections/${environment.scrapCollection.collectionId}/labels/${environment.scrapCollection.scrapLabel}`)
                .set('Authorization', `Bearer ${user.token}`)
            if(user.name === "lvl1" || user.name === "lvl2"){
                expect(res).to.have.status(403)
                return
            }
            expect(res).to.have.status(204)
            const collection = await utils.getCollection(environment.scrapCollection.collectionId)
            expect(collection.labels).to.not.include(environment.scrapCollection.scrapLabel)
        })
      })

      describe('deleteCollectionMetadataKey - /collections/{collectionId}/metadata/keys/{key}', () => {

        it('Delete a Collection Metadata Key', async () => {
            const res = await chai.request(config.baseUrl)
                .delete(`/collections/${environment.testCollection.collectionId}/metadata/keys/${environment.testCollection.metadataKey}`)
                .set('Authorization', `Bearer ${user.token}`)
            if(user.name === "lvl1" || user.name === "lvl2"){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(204)
            const collection = await utils.getCollection(environment.testCollection.collectionId)
            expect(collection.metadata).to.not.have.property(environment.testCollection.metadataKey)
        })
      })

      describe('deleteReviewHistoryByCollection - /collections/{collectionId}/review-history', () => {

        it('History records - date', async () => {
            const res = await chai.request(config.baseUrl)
                .delete(`/collections/${environment.testCollection.collectionId}/review-history?retentionDate=2020-10-01`)
                .set('Authorization', `Bearer ${user.token}`)
            if(user.name === "lvl1" || user.name === "lvl2"){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.HistoryEntriesDeleted).to.be.equal(6)
        })

        it('History records - date and asset', async () => {
            const res = await chai.request(config.baseUrl)
                .delete(`/collections/${environment.testCollection.collectionId}/review-history?retentionDate=2020-10-01&assetId=${environment.testAsset.assetId}`)
                .set('Authorization', `Bearer ${user.token}`)
            if(user.name === "lvl1" || user.name === "lvl2"){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.HistoryEntriesDeleted).to.be.equal(4)
        })
      })
    })
  }
})

