const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const users = require('./users.json')
const config = require('../testConfig.json')
const utils = require('../utils/testUtils')
const assetEnv = require('./assetEnv.json')


describe('Asset GETS tests', () => {
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

    
      it('Return the Metadata for an Asset', async () => {
        const res = await chai
          .request(config.baseUrl)
          .get(`/assets/${assetEnv.testAsset}/metadata`)
          .set('Authorization', 'Bearer ' + user.token)

        if (user.name === 'collectioncreator') {
          expect(res).to.have.status(403)
          return
        } 
        expect(res).to.have.status(200)

        expect(res.body).to.be.an('object')      
        expect(res.body.testkey).to.exist
        expect(res.body.testkey).to.eql('testvalue')
      })

      it('Return the Metadata KEYS for an Asset', async () => {
        const res = await chai
          .request(config.baseUrl)
          .get(`/assets/${assetEnv.testAsset}/metadata/keys`)
          .set('Authorization', 'Bearer ' + user.token)

        if (user.name === 'collectioncreator') {
          expect(res).to.have.status(403)
          return
        } 
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body).to.include('testkey')
      })

      it('Return the Metadata VALUE for an Asset metadata KEY', async () => {

        const res = await chai
          .request(config.baseUrl)
          .get(`/assets/${assetEnv.testAsset}/metadata/keys/${assetEnv.metadataKey}`)
          .set('Authorization', 'Bearer ' + user.token)

        if (user.name === 'collectioncreator') {
          expect(res).to.have.status(403)
          return
        } 
        expect(res).to.have.status(200)
        if (res.status !== 200) {
          return
        }
        expect(res.body).to.be.an('string')
        expect(res.body).to.include('testvalue')
      })

      it('Return an Asset (with STIGs projection)', async () => {
        const res = await chai
          .request(config.baseUrl)
          .get(`/assets/${assetEnv.testAsset}?projection=statusStats&projection=stigs&projection=stigGrants`)
          .set('Authorization', 'Bearer ' + user.token)

        if (user.name === 'admin'|| user.name === 'lvl3' || user.name === 'lvl4') {
          expect(res).to.have.status(200)
        } else {
          expect(res).to.have.status(403)
        }
        if (res.status !== 200) {
          return
       }
        expect(res.body).to.be.an('object')        
        expect(res.body.name).to.eql(assetEnv.testAssetName)

        if(res.request.url.includes('/projection=stigGrants/')){
          expect(res.body.stigGrants).to.exist;
          expect(res.body.stigGrants).to.be.an("array").of.length.at.least(1)
          for (let grant of res.body.stigGrants){
              expect(grant.benchmarkId).to.be.oneOf(assetEnv.validStigs);
          }
        }
        if(res.request.url.includes('/projection=stigs/')){
          expect(res.body.stigs).to.exist;
          expect(res.body.stigs).to.be.an("array").of.length.at.least(1)
          for (let stig of res.body.stigs){
              expect(stig.benchmarkId).to.be.oneOf(assetEnv.validStigs);
          }
        }
        if(res.request.url.includes('/projection=statusStats/')){
          expect(res.body.statusStats).to.exist;
          expect(res.body.statusStats).to.be.an("object")
        }
      })

      it('Return an Asset (with STIGs projection) - Asset - no assigned STIGs', async () => {
        const res = await chai
          .request(config.baseUrl)
          .get(`/assets/${assetEnv.testAssetNoStigs}?projection=statusStats&projection=stigs&projection=stigGrants`)
          .set('Authorization', 'Bearer ' + user.token)

        if (user.name === 'admin'|| user.name === 'lvl3' || user.name === 'lvl4') {
          expect(res).to.have.status(200)
        } else {
          expect(res).to.have.status(403)
        }
        if (res.status !== 200) {
          return
       }
        expect(res.body).to.be.an('object')        
        expect(res.body.name).to.eql(assetEnv.testAssetNoStigsName)

        if(res.request.url.includes('/projection=stigGrants/')){
          expect(res.body.stigGrants).to.exist;
          expect(res.body.stigGrants).to.be.an("array").of.length(0)
        }

        if(res.request.url.includes('/projection=stigs/')){
          expect(res.body.stigs).to.exist;
          expect(res.body.stigs).to.be.an("array").of.length(0)
        }
        if(res.request.url.includes('/projection=statusStats/')){
          expect(res.body.statusStats).to.exist;
          expect(res.body.statusStats).to.be.an("object")
        }
      })

      it('Return an Asset (without STIGs projection)', async () => {
        const res = await chai
          .request(config.baseUrl)
          .get(`/assets/${assetEnv.testAsset}?projection=statusStats`)
          .set('Authorization', 'Bearer ' + user.token)

        if (user.name === 'collectioncreator'|| user.name === 'bizarroLvl1') {
          expect(res).to.have.status(403)
          return
        } else {
          expect(res).to.have.status(200)
        }
        if (res.status !== 200) {
          return
       }
        expect(res.body).to.be.an('object')        
        expect(res.body.name).to.eql(assetEnv.testAssetName)

        if(res.request.url.includes('/projection=stigs/')){
          expect(res.body.stigs).to.exist;
          expect(res.body.stigs).to.be.an("array").of.length.at.least(1)
          for (let stig of res.body.stigs){
              expect(stig.benchmarkId).to.be.oneOf(assetEnv.validStigs);
          }
        }
        if(res.request.url.includes('/projection=statusStats/')){
          expect(res.body.statusStats).to.exist;
          expect(res.body.statusStats).to.be.an("object")
        }
      })

      it('Return an Asset (with STIGs projection) - Asset - no assigned STIGs', async () => {
        const res = await chai
          .request(config.baseUrl)
          .get(`/assets/${assetEnv.testAssetNoStigs}?projection=statusStats&projection=stigs`)
          .set('Authorization', 'Bearer ' + user.token)

          if (user.name === 'collectioncreator'|| user.name === 'bizarroLvl1' || user.name === 'lvl1') {
            expect(res).to.have.status(403)
            return
          } else {
            expect(res).to.have.status(200)
          }
          if (res.status !== 200) {
            return
         }
        expect(res.body).to.be.an('object')        
        expect(res.body.name).to.eql(assetEnv.testAssetNoStigsName)

        if(res.request.url.includes('/projection=stigs/')){
          expect(res.body.stigs).to.exist;
          expect(res.body.stigs).to.be.an("array").of.length(0)
        }
        if(res.request.url.includes('/projection=statusStats/')){
          expect(res.body.statusStats).to.exist;
          expect(res.body.statusStats).to.be.an("object")
        }
      })

      it('Return an Asset (lvl1 user requests w/ ZERO of 2 stig grants, expect fail)', async () => {
        const res = await chai
          .request(config.baseUrl)
          .get(`/assets/${assetEnv.testAssetlvl1NoAccess}?projection=statusStats&projection=stigs`)
          .set('Authorization', 'Bearer ' + user.token)

        if(user.name === 'lvl1' || user.name === 'collectioncreator') {
          expect(res).to.have.status(403)
          return
        }

        expect(res).to.have.status(200)

      })

      it('Return an Asset (lvl1 user requests w/ 1 of 2 stig grants, check proper AdminStats)', async () => {

        const res = await chai
          .request(config.baseUrl)
          .get(`/assets/${assetEnv.testAsset}?projection=statusStats&projection=stigs`)
          .set('Authorization', 'Bearer ' + user.token)

        if(user.name === 'collectioncreator') {
          expect(res).to.have.status(403)
          return
        }

        expect(res).to.have.status(200)
        if (res.status !== 200) {
          return
        }
        expect(res.body).to.be.an('object')
        
        if (res.request.url.includes('/projection=stigGrants/')) {
          expect(res.body.stigGrants).to.exist;
        }
        if (res.request.url.includes('/projection=statusStats/')) {
          //check for proper adminStat counts for lvl1 user
          expect(res.body.statusStats.ruleCount).to.equal(81);
          expect(res.body.statusStats.submittedCount).to.equal(5);
        }
      })


      // it('Assets accessible to the requester with STIG grants projection', async () => {
      //   const res = await chai
      //     .request(config.baseUrl)
      //     .get(
      //       `/assets?collectionId=${assetEnv.collectionId}&benchmarkId=${assetEnv.benchmark}&projection=statusStats&projection=stigs&projection=stigGrants`
      //     )
      //     .set('Authorization', 'Bearer ' + user.token)

      //   if (user.name === 'admin') {
      //     expect(res).to.have.status(200)
      //   } else if (user.name === 'lvl1') {
      //     expect(res).to.have.status(403)
      //     return
      //   }
      //   expect(res.body).to.be.an('array').of.length(4)
      //   const createdAsset = res.body.find(
      //     asset => asset.name === assetEnv.assetCreate.name
      //   )
      //   expect(createdAsset).to.not.be.undefined
      //   expect(createdAsset.name).to.equal('TestAsset')
      //   expect(createdAsset.stigGrants).to.be.an('array')
      //   expect(createdAsset.stigGrants).to.have.lengthOf(2)
      // })

      // it('Assets accessible to the requester no StigGrants (restricted user success)', async () => {
      //   const res = await chai
      //     .request(config.baseUrl)
      //     .get(
      //       `/assets?collectionId=${assetEnv.collectionId}&benchmarkId=${assetEnv.benchmark}&projection=statusStats&projection=stigs`
      //     )
      //     .set('Authorization', 'Bearer ' + user.token)

      //   if (user.name === 'admin') {
      //     expect(res).to.have.status(200)
      //     expect(res.body).to.be.an('array').of.length(4)
      //     const createdAsset = res.body.find(
      //       asset => asset.name === assetEnv.assetCreate.name
      //     )
      //     expect(createdAsset).to.not.be.undefined
      //     expect(createdAsset.name).to.equal('TestAsset')
      //   } else if (user.name === 'lvl1') {
      //     expect(res).to.have.status(200)
      //     expect(res.body).to.be.an('array').of.length(2)
      //     const createdAsset = res.body.find(
      //       asset => asset.name === assetEnv.assetCreate.name
      //     )
      //     expect(createdAsset).to.be.undefined
      //   }
      //   // createdAssetReturn = res.body
      //   // console.log(JSON.stringify(res.request))

      //   // console.log(JSON.stringify(res.body))
      //   // console.log(config.baseUrl)
      // })

      // it('Return an Asset by assetID with STIGs projection', async () => {
      //   const res = await chai
      //     .request(config.baseUrl)
      //     .get(`/assets/${createdAssetReturn.assetId}?projection=stigs`)
      //     .set('Authorization', 'Bearer ' + user.token)

      //   if (user.name === 'admin') {
      //     expect(res).to.have.status(200)
      //     const assetId = res.body.assetId
      //     expect(res.body.assetId).to.eql(createdAssetReturn.assetId)
      //   } else if (user.name === 'lvl1') {
      //     expect(res).to.have.status(403)
      //   }
      // })

      // it('Return an Asset by assetID with STIGs projection (should be deleted at this point', async () => {
      //   const res = await chai
      //     .request(config.baseUrl)
      //     .get(`/assets/${createdAssetReturn.assetId}?projection=stigs`)
      //     .set('Authorization', 'Bearer ' + user.token)

      //   if (user.name === 'admin') {
      //     expect(res).to.have.status(403)
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
