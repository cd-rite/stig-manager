const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const users = require('../../iterations.json')

describe('POST - Asset', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  for (const user of users) {
    describe(`user:${user.name}`, () => {
  
      describe(`createAsset - /assets`, () => {

        it('Create an Asset (with stigs projection)', async () => {
          const res = await chai
            .request(config.baseUrl)
            .post('/assets?projection=stigs')
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              name: 'TestAsset' + Math.floor(Math.random() * 1000),
              collectionId: environment.testCollection.collectionId,
              description: 'test',
              ip: '1.1.1.1',
              noncomputing: true,
              labelIds: [environment.testCollection.testLabel],
              metadata: {
                pocName: 'pocName',
                pocEmail: 'pocEmail@example.com',
                pocPhone: '12345',
                reqRar: 'true'
              },
              stigs: environment.testCollection.validStigs
            }
          )
          
          if(user.name === "lvl1" || user.name === "lvl2"){
            expect(res).to.have.status(403)
            return
          }
          else{
            expect(res).to.have.status(201)
          }
          expect(assetGetToPost(res.body)).to.eql(res.request._data)

          const effectedAsset = await utils.getAsset(res.body.assetId)

          expect(effectedAsset.collection.collectionId).to.equal(environment.testCollection.collectionId)
          for(const stig of effectedAsset.stigs) { 
            expect(stig.benchmarkId).to.be.oneOf(environment.testCollection.validStigs)
          }
          expect(effectedAsset.description).to.equal('test')
        })

        it('Create an Asset (with statusStats projection', async () => {
          const res = await chai
            .request(config.baseUrl)
            .post('/assets?projection=statusStats')
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              name: 'TestAsset' + Math.floor(Math.random() * 1000),
              collectionId: environment.testCollection.collectionId,
              description: 'test',
              ip: '1.1.1.1',
              noncomputing: true,
              labelIds: [environment.testCollection.testLabel],
              metadata: {
                pocName: 'pocName',
                pocEmail: 'pocEmail@example.com',
                pocPhone: '12345',
                reqRar: 'true'
              },
              stigs: environment.testCollection.validStigs
            })
          
            if(user.name === "lvl1" || user.name === "lvl2"){
              expect(res).to.have.status(403)
              return
            }
            else{
              expect(res).to.have.status(201)
            }
            expect(res.body).to.have.property('statusStats')
            expect(res.body.statusStats.ruleCount).to.equal(368)

            const effectedAsset = await utils.getAsset(res.body.assetId)

            expect(effectedAsset.statusStats.ruleCount).to.equal(368)

        })

        it('Create an Asset (with stigGrants projection)', async () => {
          const res = await chai
            .request(config.baseUrl)
            .post('/assets?projection=stigGrants')
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              name: 'TestAsset' + Math.floor(Math.random() * 1000),
              collectionId: environment.testCollection.collectionId,
              description: 'test',
              ip: '1.1.1.1',
              noncomputing: true,
              labelIds: [environment.testCollection.testLabel],
              metadata: {
                pocName: 'pocName',
                pocEmail: 'pocEmail@example.com',
                pocPhone: '12345',
                reqRar: 'true'
              },
              stigs: environment.testCollection.validStigs
            })
          
            if(user.name === "lvl1" || user.name === "lvl2"){
              expect(res).to.have.status(403)
              return
            }
            else{
              expect(res).to.have.status(201)
            }
          expect(res.body).to.have.property('stigGrants')
          for(const stig of res.body.stigGrants) {
            expect(stig.benchmarkId).to.be.oneOf(environment.testCollection.validStigs)
          }
          const effectedAsset = await utils.getAsset(res.body.assetId)
          for(const stig of effectedAsset.stigGrants) {
            expect(stig.benchmarkId).to.be.oneOf(environment.testCollection.validStigs)
          }
        })
      })
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
