const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const users = require('../../iterations.json')


describe('DELETE - Collection', () => {

  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const user of users){

    describe(`user:${user.name}`, () => {

      describe(`deleteAssetMetadataKey - /assets/{assetId}/metadata/keys/{key}`, () => {
        it('Delete one metadata key/value of an Asset', async () => {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/assets/${environment.scrapAsset.assetId}/metadata/keys/${environment.scrapAsset.metadataKey}`)
            .set('Content-Type', 'application/json') 
            .set('Authorization', 'Bearer ' + user.token)
            .send(`${JSON.stringify(environment.scrapAsset.metadataValue)}`)

          if(user.name === "lvl1" || user.name === "lvl2"){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(204)
          
          const asset = await utils.getAsset(environment.scrapAsset.assetId)
          expect(asset.metadata).to.not.have.property(environment.scrapAsset.metadataKey)
        })
      })
      describe(`removeStigsFromAsset -/assets/{assetId}/stigs`, () => {
        it('Delete all STIG assignments to an Asset', async () => {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/assets/${environment.scrapAsset.assetId}/stigs`)
            .set('Authorization', 'Bearer ' + user.token)
          if(user.name === "lvl1" || user.name === "lvl2"){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          const asset = await utils.getAsset(environment.scrapAsset.assetId)
          expect(asset.stigs).to.be.an('array').that.is.empty
          
        })
      })
      describe(`removeStigFromAsset - /assets/{assetId}/stigs/{benchmarkId}`, () => {
        it('Delete a STIG assignment to an Asset', async () => {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/assets/${environment.scrapAsset.assetId}/stigs/${environment.scrapAsset.scrapBenchmark}`)
            .set('Authorization', 'Bearer ' + user.token)
          if(user.name === "lvl1" || user.name === "lvl2"){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)

          const asset = await utils.getAsset(environment.scrapAsset.assetId)
          expect(asset.stigs).to.not.include(environment.scrapAsset.scrapBenchmark)
        })
      })
      describe(`deleteAsset - /assets/{assetId}`, () => {
        before(async function () {
          this.timeout(4000)
          await utils.loadAppData()
          await utils.uploadTestStigs()
          await utils.createDisabledCollectionsandAssets()
        })

        it('Delete an Asset in test collection', async () => {

          // creating a test asset to delete
          // this might need preivledges? 
          const tempAsset = await utils.createTempAsset({
              name: 'tempAsset',
              collectionId: environment.scrapCollection.collectionId,
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
            .delete(`/assets/${assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token)
        if(user.name === "lvl1" || user.name === "lvl2"){
          expect(res).to.have.status(403)
          return
        }
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('assetId')
        expect(res.body.assetId).to.equal(assetId)

        
        })

        it('Delete test Asset', async () => {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/assets/${environment.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token) 
          if(user.name === "lvl1" || user.name === "lvl2"){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('assetId')
          expect(res.body.assetId).to.equal(environment.testAsset.assetId)
        })
      })
    })
  }
})


