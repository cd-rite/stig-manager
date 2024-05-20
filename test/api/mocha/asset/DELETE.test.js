const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const users = require('./users.json')
const config = require('../testConfig.json')
const utils = require('../utils/testUtils')
const assetEnv = require('./assetEnv.json')

describe('Asset Delete tests', () => {
 before(async function () {
  // await utils.loadAppData()
  // await utils.uploadTestStigs()
  await utils.createDisabledCollectionsandAssets()
 })

  for (const user of users) {
    describe(`iterating Tests for ${user.name} user`, () => {
      before(async function () {
        await utils.loadAppData()
        await utils.uploadTestStigs()
        
      })

      it('Delete an Asset in test collection', async () => {

        // creating a test asset to delete
        // this might need preivledges? 
        const tempAsset = await utils.createTempAsset({
            name: 'tempAsset',
            collectionId: assetEnv.collectionId21,
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

        if(user.name === 'admin' || user.name === 'lvl3' || user.name === 'lvl4'){
          expect(res).to.have.status(200)
          expect(res.body.assetId).to.eql(assetId)
          return
        }
        expect(res).to.have.status(403)
      })

      // it('Delete an Asset by assetId', async () => {
      //   const res = await chai
      //     .request(config.baseUrl)
      //     .delete(`/assets/${createdAssetReturn.assetId}`)
      //     .set('Authorization', 'Bearer ' + user.token)

      //   if (user.name === 'admin') {
      //     expect(res).to.have.status(200)
      //   } else if (user.name === 'lvl1') {
      //     expect(res).to.have.status(403)
      //   }
      // })

   
    })
  }

})


