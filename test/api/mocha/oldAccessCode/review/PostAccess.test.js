const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const usersEnv = require('../../iterations.json')

describe('Access Control Testing Review posts', () => {

  describe('POST - postReviewBatch - /collections/{collectionId}/reviews', () => {
    const usersNamesToTest = ["admin", "lvl2","lvl3" ,"lvl1"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as User ${user.name}`, () => {
       
          beforeEach(async function () {
            this.timeout(4000)
            await utils.loadBatchAppData()
          })
          it(`POST batch review: target assets, whole stig should pass for only admin user other users do not have access to collecitron`, async () => {

            const postreview = {
              source: {
                review: {
                  result: 'fail',
                  detail: 'tesetsetset'
                }
              },
              assets: {
                assetIds: ['62', '42', '154']
              },
              rules: {
                benchmarkIds: ['VPN_SRG_TEST']
              }
            }

            const res = await chai.request(config.baseUrl)
              .post(`/collections/${'83'}/reviews`)
              .set('Authorization', `Bearer ${user.token}`)
              .send(postreview)
            
              if(user.name === "admin"){
                expect(res).to.have.status(200)
                return
              }
              expect(res).to.have.status(403)
         
          })
        })
      }
    })
    
  describe('POST - postReviewsByAsset - /collections/{collectionId}/reviews/{assetId}', () => {

    before(async function () {
      this.timeout(4000)
      await utils.loadAppData()
      await utils.uploadTestStigs()
      await utils.createDisabledCollectionsandAssets()
    })

    const usersNamesToTest = ["admin", "lvl2","lvl3" ,"lvl1"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as User ${user.name}`, () => {

        it('Import one or more Reviews from a JSON body new ruleId should work for all users', async () => {
          const res = await chai.request(config.baseUrl)
            .post(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAsset.assetId}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send([
              {
              "ruleId": `SV-106191r1_rule`,
              "result": "pass",
              "detail": "test\nvisible to lvl1",
              "comment": "sure",
              "autoResult": false,
              "status": "submitted"
              }
          ])
       
          expect(res).to.have.status(200)
          
        })
        it('Import one or more Reviews from a JSON body new ruleId should fail for user lvl1 because they do not have access to asset', async () => {
          const res = await chai.request(config.baseUrl)
            .post(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAssetlvl1NoAccess.assetId}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send([
              {
              "ruleId": `SV-106191r1_rule`,
              "result": "pass",
              "detail": "test\nvisible to lvl1",
              "comment": "sure",
              "autoResult": false,
              "status": "submitted"
              }
          ])
        
          if(user.name === "lvl1"){
            expect(res.body.rejected).to.have.length(1)
            expect(res.body.rejected[0].ruleId).to.equal('SV-106191r1_rule')
            expect(res).to.have.status(200)
          }
          expect(res).to.have.status(200)
        })
        it('Import one or more Reviews from a JSON body - no Asset Access - multiple posts', async () => {
          const res = await chai.request(config.baseUrl)
            .post(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAssetlvl1NoAccess.assetId}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send([
              {
              "ruleId": `${environment.testCollection.ruleId}`,
              "result": "pass",
              "detail": "test\nvisible to lvl1",
              "comment": "sure",
              "autoResult": false,
              "status": "submitted"
              },
              {
                "ruleId": `${environment.testAssetlvl1NoAccess.ruleId}`,
                "result": "pass",
                "detail": "test\nvisible to lvl1",
                "comment": "sure",
                "autoResult": false,
                "status": "submitted"
                }
          ])
          expect(res).to.have.status(200)
          if(user.name === "lvl1"){
            expect(res.body).to.be.an('object')
            expect(res.body.rejected).to.have.length(2)
            expect(res.body.affected.inserted).to.eql(0)
            expect(res.body.affected.updated).to.eql(0)
          }
        })
        it('Import one or more Reviews from a JSON body - no Asset Access - multiple posts', async () => {
          const res = await chai.request(config.baseUrl)
            .post(`/collections/${environment.testCollection.collectionId}/reviews/${environment.testAssetlvl1NoAccess.assetId}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send([
              {
              "ruleId": `${environment.testCollection.ruleId}`,
              "result": "pass",
              "detail": "test\nvisible to lvl1",
              "comment": "sure",
              "autoResult": false,
              "status": "submitted"
              },
              {
                "ruleId": `${environment.testAssetlvl1NoAccess.ruleId}`,
                "result": "pass",
                "detail": "test\nvisible to lvl1",
                "comment": "sure",
                "autoResult": false,
                "status": "submitted"
                }
          ])
          expect(res).to.have.status(200)
          if(user.name === "lvl1"){
            expect(res.body).to.be.an('object')
            expect(res.body.rejected).to.have.length(2)
            expect(res.body.affected.inserted).to.eql(0)
            expect(res.body.affected.updated).to.eql(0)
          }
        })
      })
    }
  })
})

