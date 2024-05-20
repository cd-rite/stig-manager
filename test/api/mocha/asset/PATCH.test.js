const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const users = require('./users.json')
const config = require('../testConfig.json')
const utils = require('../utils/testUtils')
const assetEnv = require('./assetEnv.json')

describe('Asset PATCH tests', () => {
  before(async function () {
    await utils.uploadTestStigs()
    await utils.loadAppData()
    await utils.createDisabledCollectionsandAssets()
  })

  for (const user of users) {
    describe(`iterating Tests for ${user.name} user`, () => {
      before(async function () {
        await utils.loadAppData()
      })

      it('Merge provided properties with an Asset - Change Collection - Fail for all users', async () => {
        const res = await chai
          .request(config.baseUrl)
          .patch(`/assets/${assetEnv.testAsset}?projection=statusStats&projection=stigs&projection=stigGrants`)
          .set('Authorization', 'Bearer ' + user.token)
          .send({ 
            "collectionId": assetEnv.collectionDoesntExist,
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

      it('Merge provided properties with an Asset - Change Collection - valid for lvl3 and lvl4 only', async () => {
        const res = await chai
          .request(config.baseUrl)
          .patch(`/assets/${assetEnv.testAsset}?projection=statusStats&projection=stigs&projection=stigGrants`)
          .set('Authorization', 'Bearer ' + user.token)
          .send({
            "collectionId": assetEnv.collectionId1,
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

          if (user.name === 'lvl1' || user.name === 'lvl2' || user.name === 'collectioncreator' || user.name === 'globular') {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body.collection.collectionId).to.equal(assetEnv.collectionId1)
          expect(res.body.labelIds).to.have.lengthOf(2)
          for (const stigGrant of res.body.stigGrants) {
            expect(stigGrant.users).to.have.lengthOf(0);
        }
      }) 

      
      it('Merge provided properties with an Asset', async () => {
      
        const res = await chai
          .request(config.baseUrl)
          .patch(`/assets/${assetEnv.assetId34}?projection=statusStats&projection=stigs&projection=stigGrants`)
          .set('Authorization', 'Bearer ' + user.token)
          .send({
            "collectionId": assetEnv.collectionId1,
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
                "Windows_10_STIG_TEST",
                "RHEL_7_STIG_TEST"
            ]
        })

        if (user.name === 'lvl1' || user.name === 'lvl2' || user.name === 'collectioncreator' || user.name === 'globular') {
          expect(res).to.have.status(403)
          return
        }
        expect(res).to.have.status(200)
      })
      // this may be wrong?
      it('Delete Assets - expect success for valid users', async () => {
        await utils.loadAppData()
        const res = await chai
          .request(config.baseUrl)
          .patch(`/assets?collectionId=${assetEnv.collectionId21}`)
          .set('Authorization', 'Bearer ' + user.token)
          .send({
            "operation": "delete",
            "assetIds": ["29","42"]
          })
      
        if (user.name === 'lvl1' || user.name === 'lvl2' || user.name === 'collectioncreator' || user.name === 'globular') {
          expect(res).to.have.status(403)
          return
        }
        expect(res).to.have.status(200)
        
        expect(res.body).to.be.an('object')

        expect(res.body).to.eql({
          "operation": "deleted",
          "assetIds": [
              "29",
              "42"
          ]
      })

      })

      it('Delete Assets - assets not in collection', async () => {
        const res = await chai
          .request(config.baseUrl)
          .patch(`/assets?collectionId=${assetEnv.collectionId21}`)
          .set('Authorization', 'Bearer ' + user.token)
          .send({
            "operation": "delete",
            "assetIds": ["999","9999"]
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

      

      // it('Merge metadata property/value into an Asset', async () => {

      //   const res = await chai
      //     .request(config.baseUrl)
      //     .patch(`/assets/${assetEnv.testAsset}/metadata`)
      //     .set('Authorization', 'Bearer ' + user.token)
      //     .send({"testkey": "testvalue" })

      //   if (user.name === 'collectioncreator' || user.name === 'lvl2' || user.name === 'lvl1') {
      //     expect(res).to.have.status(403)
      //     return
      //   } 
      //   expect(res).to.have.status(200)
      //   expect(res.body).to.be.an('object')

      // })

      // it('Update (patch) an Asset', async () => {
      //   const res = await chai
      //     .request(config.baseUrl)
      //     .patch(
      //       `/assets/${createdAssetReturn.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`
      //     )
      //     .set('Authorization', 'Bearer ' + user.token)
      //     .send(assetEnv.assetPatch)

      //   if (user.name === 'admin') {
      //     expect(res).to.have.status(200)
      //     expect(res.body.description).to.eql(assetEnv.assetPatch.description)
      //     expect(res.body.name).to.eql(assetEnv.assetPatch.name)
      //     expect(res.body.ip).to.eql(assetEnv.assetPatch.ip)
      //   } else if (user.name === 'lvl1') {
      //     expect(res).to.have.status(403)
      //   }
      // })

   

      // it('Patch multiple assets (batch deleting)', async () => {
      //   const res = await chai
      //     .request(config.baseUrl)
      //     .patch(`/assets?collectionId=${assetEnv.collectionId}`)
      //     .set('Authorization', 'Bearer ' + user.token)
      //     .send(assetEnv.assetBatchDelete)

      //   if (user.name === 'admin') {
      //     expect(res).to.have.status(200)
      //   } else if (user.name === 'lvl1') {
      //     expect(res).to.have.status(403)
      //   }
      // })
    })
  }
})

function assetGetToPost (assetGet) {
  // extract the transformed and unposted properties
  const { assetId, collection, stigs, mac, fqdn, ...assetPost } = assetGet

  // add transformed properties to the derived post
  assetPost.collectionId = collection.collectionId
  assetPost.stigs = stigsGetToPost(stigs)

  // the derived post object
  return assetPost
}

function stigsGetToPost (stigsGetArray) {
  const stigsPostArray = []
  for (const stig of stigsGetArray) {
    stigsPostArray.push(stig.benchmarkId)
  }
  return stigsPostArray
}
