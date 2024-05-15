const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const users = require('./users.json')
const config = require('../testConfig.json')
const utils = require('../utils/testUtils')
const assetEnv = require('./assetEnv.json')

let createdAssetReturn = null

describe('Asset CRUD tests', () => {

  before(async function () {
    await utils.uploadTestStigs()
  })

  for (const user of users) {  
    describe(`iterating Tests for ${user.grant} user`, () => {

      before(async function () {
        await utils.loadAppData()
      })

      it('Create Asset', async () => {
        const res = await chai
        .request(config.baseUrl)
        .post('/assets?projection=stigs')
        .set('Authorization', 'Bearer ' + user.token)
        .send(assetEnv.assetCreate)
        if(user.name === 'admin'){
          expect(res).to.have.status(201)
        }
        else if(user.name === 'lvl1'){
          expect(res).to.have.status(403)
          return
        }

        createdAssetReturn = res.body
        expect(assetGetToPost(res.body)).to.eql(res.request._data)
      })

      it('Assets accessible to the requester with STIG grants projection', async () => {
        const res = await chai
        .request(config.baseUrl)
        .get(`/assets?collectionId=${assetEnv.collectionId}&benchmarkId=${assetEnv.benchmark}&projection=statusStats&projection=stigs&projection=stigGrants`)
        .set('Authorization', 'Bearer ' + user.token)

        if(user.name === 'admin'){
          expect(res).to.have.status(200)
        }
        else if(user.name === 'lvl1'){
          expect(res).to.have.status(403)
          return
        }
        expect(res.body).to.be.an('array').of.length(4)
        const createdAsset = res.body.find(asset => asset.name === assetEnv.assetCreate.name)
        expect(createdAsset).to.not.be.undefined;
        expect(createdAsset.name).to.equal('TestAsset');
        expect(createdAsset.stigGrants).to.be.an('array');
        expect(createdAsset.stigGrants).to.have.lengthOf(2);
      })

      it('Assets accessible to the requester no StigGrants (restricted user success)', async () => {
        const res = await chai
        .request(config.baseUrl)
        .get(`/assets?collectionId=${assetEnv.collectionId}&benchmarkId=${assetEnv.benchmark}&projection=statusStats&projection=stigs`)
        .set('Authorization', 'Bearer ' + user.token)

        if(user.name === 'admin'){
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').of.length(4)
          const createdAsset = res.body.find(asset => asset.name === assetEnv.assetCreate.name)
          expect(createdAsset).to.not.be.undefined;
          expect(createdAsset.name).to.equal('TestAsset');
        }
        else if(user.name === 'lvl1'){
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').of.length(2)
          const createdAsset = res.body.find(asset => asset.name === assetEnv.assetCreate.name)
          expect(createdAsset).to.be.undefined;
        }
       // createdAssetReturn = res.body
        // console.log(JSON.stringify(res.request))
     
        // console.log(JSON.stringify(res.body))
        // console.log(config.baseUrl)
      })

      it('Return an Asset by assetID with STIGs projection', async () => {
          
          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${createdAssetReturn.assetId}?projection=stigs`)
            .set('Authorization', 'Bearer ' + user.token)
        
          if(user.name === 'admin'){
            expect(res).to.have.status(200)
            const assetId = res.body.assetId
            expect(res.body.assetId).to.eql(createdAssetReturn.assetId)
          }
          else if(user.name === 'lvl1'){
            expect(res).to.have.status(403)
          }
      })

      it('Update (patch) an Asset', async () => {
        const res = await chai
        .request(config.baseUrl)
        .patch(`/assets/${createdAssetReturn.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
        .set('Authorization', 'Bearer ' + user.token)
        .send(assetEnv.assetPatch)

        if(user.name === 'admin'){
          expect(res).to.have.status(200)
          expect(res.body.description).to.eql(assetEnv.assetPatch.description)
          expect(res.body.name).to.eql(assetEnv.assetPatch.name)
          expect(res.body.ip).to.eql(assetEnv.assetPatch.ip)
        }
        else if(user.name === 'lvl1'){
          expect(res).to.have.status(403)
        }
      })

      it('Replace (put) an Asset', async () => {
        const res = await chai
        .request(config.baseUrl)
        .put(`/assets/${createdAssetReturn.assetId}`)
        .set('Authorization', 'Bearer ' + user.token)
        .send(assetEnv.assetPut)

        if(user.name === 'admin'){
          expect(res).to.have.status(200)
          expect(res.body.name).to.eql(assetEnv.assetPut.name)
        }
        else if(user.name === 'lvl1'){
          expect(res).to.have.status(403)
        }
      })

      it('Delete an Asset by assetId', async () => {
        const res = await chai
        .request(config.baseUrl)
        .delete(`/assets/${createdAssetReturn.assetId}`)
        .set('Authorization', 'Bearer ' + user.token)

        if(user.name === 'admin'){
          expect(res).to.have.status(200)
        }
        else if(user.name === 'lvl1'){
          expect(res).to.have.status(403)
        }
      })

      it('Return an Asset by assetID with STIGs projection (should be deleted at this point', async () => {
          
        const res = await chai
          .request(config.baseUrl)
          .get(`/assets/${createdAssetReturn.assetId}?projection=stigs`)
          .set('Authorization', 'Bearer ' + user.token)
      
        if(user.name === 'admin'){
          expect(res).to.have.status(403)
        }
        else if(user.name === 'lvl1'){
          expect(res).to.have.status(403)
        }
      })

      it('Patch multiple assets (batch deleting)', async () => {
        const res = await chai
        .request(config.baseUrl)
        .patch(`/assets?collectionId=${assetEnv.collectionId}`)
        .set('Authorization', 'Bearer ' + user.token)
        .send(assetEnv.assetBatchDelete)

        if(user.name === 'admin'){
          expect(res).to.have.status(200)
        }
        else if(user.name === 'lvl1'){
          expect(res).to.have.status(403)
        }
      })  
    })
  }
  
  describe(`Non Iterating Asset tests!`, () => {

    before(async function () {
      await utils.loadAppData()
    })

    it('Create Asset in a collection that is undefined', async () => {
      let assetPost = assetEnv.assetCreate
      assetPost.collectionId = "999"

      const res = await chai
      .request(config.baseUrl)
      .post('/assets')
      .set('Authorization', 'Bearer ' + config.adminToken)
      .send(assetEnv.assetCreate)
    
      expect(res).to.have.status(403)
     })
  })

})

function assetGetToPost(assetGet) {
  // extract the transformed and unposted properties
  const {assetId, collection, stigs, mac, fqdn, ...assetPost} = assetGet
  
  // add transformed properties to the derived post  
  assetPost.collectionId = collection.collectionId
  assetPost.stigs = stigsGetToPost(stigs)

  // the derived post object
  return assetPost
}

function stigsGetToPost(stigsGetArray) {
  const stigsPostArray = []
  for (const stig of stigsGetArray) {
      stigsPostArray.push(stig.benchmarkId)
  }
  return stigsPostArray
}

