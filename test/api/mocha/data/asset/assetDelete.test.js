const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const iterations = require('../../iterations.js')
const expectations = require('./expectations.js')
const reference = require('../../referenceData.js')

describe('DELETE - Asset', function () {

  before(async function () {
    this.timeout(4000)
    await utils.uploadTestStigs()
    await utils.loadAppData()
    // await utils.createDisabledCollectionsandAssets()
  })

  for(const iteration of iterations){
    if (expectations[iteration.name] === undefined){
      it(`No expectations for this iteration scenario: ${iteration.name}`, async function () {})
      continue
    }

    describe(`iteration:${iteration.name}`, function () {
      const distinct = expectations[iteration.name]
      describe(`deleteAssetMetadataKey - /assets/{assetId}/metadata/keys/{key}`, function () {
        it('Delete one metadata key/value of an Asset', async function () {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/assets/${reference.scrapAsset.assetId}/metadata/keys/${reference.scrapAsset.metadataKey}`)
            .set('Content-Type', 'application/json') 
            .set('Authorization', 'Bearer ' + iteration.token)
            .send(`${JSON.stringify(reference.scrapAsset.metadataValue)}`)

          if(!distinct.canModifyCollection){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(204)
          
          const asset = await utils.getAsset(reference.scrapAsset.assetId)
          expect(asset.metadata).to.not.have.property(reference.scrapAsset.metadataKey)
        })
      })
      describe(`removeStigsFromAsset -/assets/{assetId}/stigs`, function () {
        it('Delete all STIG assignments to an Asset', async function () {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/assets/${reference.scrapAsset.assetId}/stigs`)
            .set('Authorization', 'Bearer ' + iteration.token)
          if(!distinct.canModifyCollection){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          const asset = await utils.getAsset(reference.scrapAsset.assetId)
          expect(asset.stigs).to.be.an('array').that.is.empty
          
        })
      })
      describe(`removeStigFromAsset - /assets/{assetId}/stigs/{benchmarkId}`, function () {
        it('Delete a STIG assignment to an Asset', async function () {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/assets/${reference.scrapAsset.assetId}/stigs/${reference.scrapAsset.scrapBenchmark}`)
            .set('Authorization', 'Bearer ' + iteration.token)
          if(!distinct.canModifyCollection){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)

          const asset = await utils.getAsset(reference.scrapAsset.assetId)
          expect(asset.stigs).to.not.include(reference.scrapAsset.scrapBenchmark)
        })
      })
      describe(`deleteAsset - /assets/{assetId}`, function () {
        before(async function () {
          this.timeout(4000)
          await utils.loadAppData()
          // await utils.uploadTestStigs()
        })
        it('Delete an Asset in test collection', async function () {

          // creating a test asset to delete
          // this might need preivledges? 
          const tempAsset = await utils.createTempAsset({
              name: 'tempAsset',
              collectionId: reference.scrapCollection.collectionId,
              description: 'temp',
              ip: '1.1.1.1',
              noncomputing: true,
              labelIds: [],
              metadata: {
                pocName: 'pocName',
                pocEmail: 'pocEmail@example.com',
                pocPhone: '12345',
                reqRar: 'true'
              },
              stigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST']
            })

        const assetId = tempAsset.data.assetId
        const res = await chai
            .request(config.baseUrl)
            .delete(`/assets/${assetId}`)
            .set('Authorization', 'Bearer ' + iteration.token)
        if(!distinct.canModifyCollection){
          expect(res).to.have.status(403)
          return
        }
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('assetId')
        expect(res.body.assetId).to.equal(assetId)
        })
        it('Delete test Asset', async function () {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/assets/${reference.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + iteration.token) 
          if(!distinct.canModifyCollection){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body.assetId).to.equal(reference.testAsset.assetId)
          expect(res.body.statusStats.ruleCount).to.equal(reference.testAsset.stats.ruleCount)
          expect(res.body.statusStats.stigCount).to.equal(reference.testAsset.stats.stigCount)
          expect(res.body.statusStats.savedCount).to.equal(reference.testAsset.stats.savedCount)
          expect(res.body.statusStats.acceptedCount).to.equal(reference.testAsset.stats.acceptedCount)
          expect(res.body.statusStats.rejectedCount).to.equal(reference.testAsset.stats.rejectedCount)
          expect(res.body.statusStats.submittedCount).to.equal(reference.testAsset.stats.submittedCount)

          expect(res.body.stigs).to.be.an('array').of.length(reference.testAsset.validStigs.length)
          for(const stig of res.body.stigs){
            expect(stig.benchmarkId).to.be.oneOf(reference.testAsset.validStigs)
          }

          expect(res.body.stigGrants).to.be.an('array').of.length(reference.testAsset.usersWithGrant.length)
          for(const user of res.body.stigGrants){
            expect(user.users[0].userId).to.be.oneOf(reference.testAsset.usersWithGrant)
          }
        })
      })
    })
  }
})


