const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const users = require('./users.json')
const config = require('../testConfig.json')
const utils = require('../utils/testUtils')
const assetEnv = require('./assetEnv.json')

describe('Asset POST tests', () => {
  before(async function () {
    await utils.uploadTestStigs()
    await utils.loadAppData()
  })

  for (const user of users) {
    describe(`iterating Tests for ${user.name} user`, () => {
      before(async function () {
        await utils.loadAppData()
      })

      it('Create an Asset to be deleted', async () => {
        const res = await chai
          .request(config.baseUrl)
          .post('/assets?projection=stigs')
          .set('Authorization', 'Bearer ' + user.token)
          .send({
            name: 'TestAsset' + Math.floor(Math.random() * 1000),
            collectionId: assetEnv.collectionId21,
            description: 'test',
            ip: '1.1.1.1',
            noncomputing: true,
            labelIds: [assetEnv.testLabel],
            metadata: {
              pocName: 'pocName',
              pocEmail: 'pocEmail@example.com',
              pocPhone: '12345',
              reqRar: 'true'
            },
            stigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST']
          })
        
        if (user.name === 'admin') {
          expect(res).to.have.status(201)
        } else if (user.name === 'lvl1' || user.name === 'lvl2' || user.name === 'collectioncreator') {
          expect(res).to.have.status(403)
          return
        }
        // gathering the asset we just created
        createdAssetReturn = res.body
        expect(assetGetToPost(res.body)).to.eql(res.request._data)
      })
 
    })
  }
  //   before(async function () {
  //     await utils.loadAppData()
  //   })

  // 
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
