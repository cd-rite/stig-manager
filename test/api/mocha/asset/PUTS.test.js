const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const users = require('./users.json')
const config = require('../testConfig.json')
const utils = require('../utils/testUtils')
const assetEnv = require('./assetEnv.json')

describe('Asset PUT tests', () => {
  before(async function () {
    await utils.uploadTestStigs()
    await utils.loadAppData()
  })

  for (const user of users) {
    describe(`iterating Tests for ${user.name} user`, () => {
      before(async function () {
        await utils.loadAppData()
      })

      // it('Replace (put) an Asset', async () => {
      //   const res = await chai
      //     .request(config.baseUrl)
      //     .put(`/assets/${createdAssetReturn.assetId}`)
      //     .set('Authorization', 'Bearer ' + user.token)
      //     .send(assetEnv.assetPut)

      //   if (user.name === 'admin') {
      //     expect(res).to.have.status(200)
      //     expect(res.body.name).to.eql(assetEnv.assetPut.name)
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
