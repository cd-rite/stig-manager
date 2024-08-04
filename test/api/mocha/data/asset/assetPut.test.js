const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const users = require('../../iterations.json')

describe('PUT - Asset', () => {

  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  for (const user of users) {

    describe(`user:${user.name}`, () => {

      describe(`replaceAsset -/assets/{assetId}`, () => {
        
        it('Set all properties of an Asset', async function () {
          const res = await chai.request(config.baseUrl)
            .put(`/assets/${environment.scrapAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              "name": 'TestAsset' + Math.floor(Math.random() * 1000),
              "collectionId": environment.scrapCollection.collectionId,
              "description": "test desc",
              "ip": "1.1.1.1",
              "noncomputing": true,
              "labelIds": [
                  "df4e6836-a003-11ec-b1bc-0242ac110002"
              ],
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

          if(user.name === "lvl1" || user.name === "lvl2"){
            expect(res).to.have.status(403)
            return
          }
          else{
            expect(res).to.have.status(200)
          }
          expect(res.body.statusStats).to.exist
          expect(res.body.stigs).to.be.an('array').of.length(3)
          for (let stig of res.body.stigs) {
            expect(stig.benchmarkId).to.be.oneOf([
              "VPN_SRG_TEST",
              "Windows_10_STIG_TEST",
              "RHEL_7_STIG_TEST"
          ])
          }
          expect(res.body.stigGrants).to.be.an('array').of.length(3)
          for (let stig of res.body.stigGrants) {
            expect(stig.benchmarkId).to.be.oneOf([
              "VPN_SRG_TEST",
              "Windows_10_STIG_TEST",
              "RHEL_7_STIG_TEST"
          ])
          }
          const effectedAsset = await utils.getAsset(res.body.assetId)
          expect(effectedAsset.collection.collectionId).to.equal(environment.scrapCollection.collectionId)
          expect(effectedAsset.description).to.equal('test desc')
          expect(effectedAsset.labelIds).to.have.lengthOf(1)
          expect(effectedAsset.stigs).to.be.an('array').of.length(3)
          for (const stig of effectedAsset.stigs) {
            expect(stig.benchmarkId).to.be.oneOf([
              'VPN_SRG_TEST',
              'Windows_10_STIG_TEST',
              'RHEL_7_STIG_TEST'
            ])
          }

        })

        it('Set all properties of an Asset - assign new STIG', async function () {
          const res = await chai.request(config.baseUrl)
            .put(`/assets/${environment.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              "name": 'TestAsset' + Math.floor(Math.random() * 1000),
              "collectionId": environment.testCollection.collectionId,
              "description": "test desc",
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
                  "VPN_SRG_OTHER",
                  "Windows_10_STIG_TEST",
                  "RHEL_7_STIG_TEST"
              ]
            })
            if(user.name === "lvl1" || user.name === "lvl2"){
              expect(res).to.have.status(403)
              return
            }
            else{
              expect(res).to.have.status(200)
            }
            expect(res.body.statusStats).to.exist

            expect(res.body.stigs).to.be.an('array').of.length(4)
            for (let stig of res.body.stigs) {
              expect(stig.benchmarkId).to.be.oneOf(environment.putStigs)
            }

            expect(res.body.stigGrants).to.be.an('array').of.length(4)
            for (let stig of res.body.stigGrants) {
              expect(stig.benchmarkId).to.be.oneOf(environment.putStigs)
            }

            const effectedAsset = await utils.getAsset(res.body.assetId)
            expect(effectedAsset.collection.collectionId).to.equal(environment.testCollection.collectionId)
            expect(effectedAsset.stigs).to.be.an('array').of.length(4)
            for (const stig of effectedAsset.stigs) {
              expect(stig.benchmarkId).to.be.oneOf(environment.putStigs)
            }
        })

        it('Set all properties of an Asset- with metadata', async function () {
          const res = await chai.request(config.baseUrl)
            .put(`/assets/${environment.scrapAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              "name":'TestAsset' + Math.floor(Math.random() * 1000),
              "collectionId": environment.scrapCollection.collectionId,
              "description": "test desc",
              "ip": "1.1.1.1",
              "noncomputing": true,
              "metadata" : {
                [environment.scrapAsset.metadataKey]: environment.scrapAsset.metadataValue
              },
              "stigs": [
                  "VPN_SRG_TEST",
                  "Windows_10_STIG_TEST",
                  "RHEL_7_STIG_TEST"
              ]
          })
          if(user.name === "lvl1" || user.name === "lvl2"){
            expect(res).to.have.status(403)
            return
          }
          else{
            expect(res).to.have.status(200)
          }
          expect(res.body.metadata).to.exist
          expect(res.body.metadata).to.have.property(environment.scrapAsset.metadataKey)
          expect(res.body.metadata[environment.scrapAsset.metadataKey]).to.equal(environment.scrapAsset.metadataValue)

          const effectedAsset = await utils.getAsset(res.body.assetId)
          expect(effectedAsset.metadata).to.exist
          expect(effectedAsset.metadata).to.have.property(environment.scrapAsset.metadataKey)
          expect(effectedAsset.metadata[environment.scrapAsset.metadataKey]).to.equal(environment.scrapAsset.metadataValue)

        })

        it('Set all properties of an Asset - Change Collection - invalid for all users', async function () {
          const res = await chai.request(config.baseUrl)
            .put(`/assets/${environment.scrapAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              "name": 'TestAsset' + Math.floor(Math.random() * 1000),
              "collectionId": environment.scrapLvl1User.userId,
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
      })
      describe(`putAssetMetadata - /assets/{assetId}/metadata`, () => {

        it('Set metadata of an Asset', async function () {
          const res = await chai.request(config.baseUrl)
            .put(`/assets/${environment.scrapAsset.assetId}/metadata`)
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              [environment.scrapAsset.metadataKey]: environment.scrapAsset.metadataValue
            })
          if(user.name === "lvl1" || user.name === "lvl2"){
            expect(res).to.have.status(403)
            return
          }
          else{
            expect(res).to.have.status(200)
          }
          expect(res.body).to.have.property(environment.scrapAsset.metadataKey)
          expect(res.body[environment.scrapAsset.metadataKey]).to.equal(environment.scrapAsset.metadataValue)

          const effectedAsset = await utils.getAsset(environment.scrapAsset.assetId)
          expect(effectedAsset.metadata).to.exist
          expect(effectedAsset.metadata).to.have.property(environment.scrapAsset.metadataKey)
        })
      })
      describe(`putAssetMetadataValue - /assets/{assetId}/metadata/keys/{key}`, () => {
      
        it('Set one metadata key/value of an Asset', async function () {
          const res = await chai.request(config.baseUrl)
            .put(`/assets/${environment.scrapAsset.assetId}/metadata/keys/${environment.scrapAsset.metadataKey}`)
            .set('Authorization', 'Bearer ' + user.token)
            .set('Content-Type', 'application/json') 
            .send(`${JSON.stringify(environment.scrapAsset.metadataValue)}`)

          if(user.name === "lvl1" || user.name === "lvl2"){
            expect(res).to.have.status(403)
            return
          }
          else{
            expect(res).to.have.status(204)
          }
          const effectedAsset = await utils.getAsset(environment.scrapAsset.assetId)
          expect(effectedAsset.metadata).to.exist
          expect(effectedAsset.metadata).to.have.property(environment.scrapAsset.metadataKey)
        })
      })
      describe(`attachStigToAsset - /assets/{assetId}/stigs/{benchmarkId}`, () => {
      
        it('PUT a STIG assignment to an Asset Copy 3', async function () {
          const res = await chai.request(config.baseUrl)
            .put(`/assets/${environment.scrapAsset.assetId}/stigs/${environment.scrapAsset.scrapBenchmark}`)
            .set('Authorization', 'Bearer ' + user.token)
          if(user.name === "lvl1" || user.name === "lvl2"){
            expect(res).to.have.status(403)
            return
          }
          else{
            expect(res).to.have.status(200)
          }
          expect(res.body).to.be.an('array').of.length(3)
          for (let stig of res.body) {
            if (stig.benchmarkId === environment.scrapAsset.scrapBenchmark) {
              expect(stig.benchmarkId).to.equal(environment.scrapAsset.scrapBenchmark)
            }
          }
          const effectedAsset = await utils.getAsset(environment.scrapAsset.assetId)
          expect(effectedAsset.stigs).to.be.an('array').of.length(3)
          for (let stig of effectedAsset.stigs) {
            if (stig.benchmarkId === environment.scrapAsset.scrapBenchmark) {
              expect(stig.benchmarkId).to.equal(environment.scrapAsset.scrapBenchmark)
            }
          }
        })
      })
      describe(`putAssetsByCollectionLabelId - /collections/{collectionId}/labels/{labelId}/assets`, () => {
      
        it('Replace a Labels Asset Mappings in a Collection', async function () {
          const res = await chai.request(config.baseUrl)
            .put(`/collections/${environment.testCollection.collectionId}/labels/${environment.testCollection.testLabel}/assets`)
            .set('Authorization', 'Bearer ' + user.token)
            .send([environment.testAsset.assetId])
          if(user.name === "lvl1" || user.name === "lvl2"){
            expect(res).to.have.status(403)
            return
          }
          else{
            expect(res).to.have.status(200)
          }
          expect(res.body).to.be.an('array').of.length(1)
          expect(res.body[0].assetId).to.equal(environment.testAsset.assetId)

          const effectedAsset = await utils.getAssetsByLabel(environment.testCollection.collectionId, environment.testCollection.testLabel)
          expect(effectedAsset).to.have.lengthOf(1)
          expect(effectedAsset[0].assetId).to.equal(environment.testAsset.assetId)
        })
        
        it('Replace a Labels Asset Mappings in a Collection assign to an asset that does not exist', async function () {
          const res = await chai.request(config.baseUrl)
            .put(`/collections/${environment.testCollection.collectionId}/labels/${environment.testCollection.testLabel}/assets`)
            .set('Authorization', 'Bearer ' + user.token)
            .send(["9999"])
          expect(res).to.have.status(403)
        })
      })
    })
  }

})

      
