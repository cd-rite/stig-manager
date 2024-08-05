const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const users = require('../../iterations.json')

describe('PATCH - Asset', () => {

  beforeEach(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const user of users){

    describe(`user:${user.name}`, () => {

      describe(`updateAsset - /assets/{assetId}`, () => {
      
        it('Merge provided properties with an Asset - Change Collection - Fail for all users', async () => {
          const res = await chai
            .request(config.baseUrl)
            .patch(`/assets/${environment.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token)
            .send({ 
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

        it('Merge provided properties with an Asset - Change Collection - valid for lvl3 and lvl4 only (IE works for admin for me)', async () => {
          const res = await chai
            .request(config.baseUrl)
            .patch(`/assets/${environment.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              "collectionId": environment.scrapCollection.collectionId,
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
            if(user.name === 'lvl1' || user.name === 'lvl2'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.collection.collectionId).to.equal(environment.scrapCollection.collectionId)
            expect(res.body.labelIds).to.have.lengthOf(2)
            for (const stigGrant of res.body.stigGrants) {
              expect(stigGrant.users).to.have.lengthOf(0);
          }

          const effectedAsset = await utils.getAsset(res.body.assetId)
          expect(effectedAsset.collection.collectionId).to.equal(environment.scrapCollection.collectionId)
          expect(effectedAsset.description).to.equal('test desc')
          expect(effectedAsset.labelIds).to.have.lengthOf(2)
          for (const stig of effectedAsset.stigs) {
            expect(stig.benchmarkId).to.be.oneOf([
              'VPN_SRG_TEST',
              'Windows_10_STIG_TEST',
              'RHEL_7_STIG_TEST'
            ])
          }
          
        }) 
    
        it('Merge provided properties with an Asset', async () => {
        
          const res = await chai
            .request(config.baseUrl)
            .patch(`/assets/${environment.scrapAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              "collectionId": environment.scrapCollection.collectionId,
              "description": "scrap",
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
                  "Windows_10_STIG_TEST",
                  "RHEL_7_STIG_TEST"
              ]
          })
          if(user.name === 'lvl1' || user.name === 'lvl2'){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body.collection.collectionId).to.equal(environment.scrapCollection.collectionId)
          expect(res.body.metadata).to.deep.equal({
            "pocName": "poc2Put",
            "pocEmail": "pocEmailPut@email.com",
            "pocPhone": "12342",
            "reqRar": "true"
          })

          const effectedAsset = await utils.getAsset(res.body.assetId)
          expect(effectedAsset.collection.collectionId).to.equal(environment.scrapCollection.collectionId)
          expect(effectedAsset.description).to.equal('scrap')
          expect(effectedAsset.metadata).to.deep.equal({
            "pocName": "poc2Put",
            "pocEmail": "pocEmailPut@email.com",
            "pocPhone": "12342",
            "reqRar": "true"
          })
        })
      })

      describe(`patchAssets - /assets`, () => {
    
        it('Delete Assets - expect success for valid users', async () => {
          const res = await chai
            .request(config.baseUrl)
            .patch(`/assets?collectionId=${environment.testCollection.collectionId}`)
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              "operation": "delete",
              "assetIds": ["29","42"]
            })
        
          if(user.name === 'lvl1' || user.name === 'lvl2'){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.eql({
            "operation": "deleted",
            "assetIds": [
                "29",
                "42"
              ]})

          const effectedAsset = await utils.getAsset(res.body.assetId)
          expect(effectedAsset.response).to.have.status(400)
            
        })
        it('Delete Assets - assets not in collection', async () => {
            const res = await chai
              .request(config.baseUrl)
              .patch(`/assets?collectionId=${environment.testCollection.collectionId}`)
              .set('Authorization', 'Bearer ' + user.token)
              .send({
                "operation": "delete",
                "assetIds": ["258","260"]
              })
              expect(res).to.have.status(403)
        })
        it('Delete Assets - collection does not exist', async () => {
          const res = await chai
            .request(config.baseUrl)
            .patch(`/assets?collectionId=${99999}`)
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              "operation": "delete",
              "assetIds": ["29","42"]
            })
            expect(res).to.have.status(403)
        })
      })  

      describe(`patchAssetMetadata - /assets/{assetId}/metadata`, () => {

        it('Merge provided properties with an Asset - Change metadata', async () => {
          const res = await chai
            .request(config.baseUrl)
            .patch(`/assets/${environment.scrapAsset.assetId}/metadata`)
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              "testkey":"poc2Patched"
            })
            if(user.name === 'lvl1' || user.name === 'lvl2'){
              expect(res).to.have.status(403)
              return
            }
            expect(res.body).to.deep.equal({
              "testkey": "poc2Patched",
            })
            const effectedAsset = await utils.getAsset(environment.scrapAsset.assetId)
            expect(effectedAsset.metadata).to.deep.equal({
              "testkey": "poc2Patched"
            })
        })
      })
    })
  }
})

