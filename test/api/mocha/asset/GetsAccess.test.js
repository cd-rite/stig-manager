const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const usersEnv = require('./users.json')
const config = require('../testConfig.json')
const utils = require('../utils/testUtils')
const assetEnv = require('../assetEnv.json')


describe('Access Control Testing Asset gets ', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })
  describe('GET - getAsset - /assets/{assetId}', () => {
    
    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as ${user.name}`, () => {
        it('Return an Asset (with STIGgrants projection)', async () => {
          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${assetEnv.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token)

            if (user.grant === "Restricted" || user.grant === "Full") {
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('stigGrants')
        })

        it('Return an Asset (without STIGgrants projection)', async () => {
          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${assetEnv.testAsset.assetId}?projection=statusStats&projection=stigs`)
            .set('Authorization', 'Bearer ' + user.token)

            expect(res).to.have.status(200)
            expect(res.body).to.not.have.property('stigGrants')
        })
      })
    }
  })
  describe('GET - getAssetMetadata - /assets/{assetId}/metadata,', () => {
    
    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as ${user.name}`, () => {
        it('Return the Metadata for an Asset', async () => {
          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${assetEnv.testAsset.assetId}/metadata`)
            .set('Authorization', 'Bearer ' + user.token)
          expect(res).to.have.status(200)
        })
      })
    }
  })

  describe('GET - getAssetMetadataKeys - /assets/{assetId}/metadata/keys', () => {
    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as ${user.name}`, () => {
        it('Return the Metadata KEYS for an Asset', async () => {
          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${assetEnv.testAsset.assetId}/metadata/keys`)
            .set('Authorization', 'Bearer ' + user.token)
          expect(res).to.have.status(200)
        })
      })
    }
  })

  describe('GET - getAssetMetadataValue - /assets/{assetId}/metadata/keys/{key}', () => {
    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as ${user.name}`, () => {
        it('Return the Metadata VALUE for an Asset metadata KEY', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${assetEnv.testAsset.assetId}/metadata/keys/${assetEnv.testAsset.metadataKey}`)
            .set('Authorization', 'Bearer ' + user.token)
          expect(res).to.have.status(200)
        })
      })
    }
  })

  describe('GET - getAssets - /assets', () => {

    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as ${user.name}`, () => {

        it('Assets accessible to the requester (with STIG grants projection)', async () => {
          const res = await chai
            .request(config.baseUrl).get(`/assets?collectionId=${assetEnv.testCollection.collectionId}&benchmarkId=${assetEnv.testCollection.benchmark}&projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token)

          if(user.grant === "Restricted" || user.grant === "Full"){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body).to.have.lengthOf(3)
        })

        it('Assets accessible to the requester (with STIG grants projection - no benchmark specified)', async () => {
          const res = await chai
            .request(config.baseUrl).get(`/assets?collectionId=${assetEnv.testCollection.collectionId}&projection=statusStats&projection=stigs&projection=stigGrants`)
            .set('Authorization', 'Bearer ' + user.token)

          if(user.grant === "Restricted" || user.grant === "Full"){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
            expect(res.body).to.have.lengthOf(4)
        })

        it('Assets accessible to the requester - labels', async () => {
          const res = await chai
            .request(config.baseUrl).get(`/assets?collectionId=${assetEnv.testCollection.collectionId}&labelId=${assetEnv.testCollection.testLabel}`)
            .set('Authorization', 'Bearer ' + user.token)
          expect(res).to.have.status(200)
        })

        it(`Assets accessible to the requester - No StigGrants (for lvl1 user success)`, async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets?collectionId=${assetEnv.testCollection.collectionId}&benchmarkId=${assetEnv.testCollection.benchmark}&projection=statusStats&projection=stigs`)
            .set('Authorization', 'Bearer ' + user.token)
          expect(res).to.have.status(200)
        })
    })
  }
  })

  describe('GET - getChecklistByAsset - /assets/{assetId}/checklists', () => {

      const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
      const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

      for (let user of users) {
        describe(`Testing as ${user.name}`, () => {
          it('Return the Checklist for the supplied Asset with benchmark query param', async () => {

            const res = await chai
              .request(config.baseUrl)
              .get(`/assets/${assetEnv.testAsset.assetId}/checklists?benchmarkId=${assetEnv.testCollection.benchmark}`)
              .set('Authorization', 'Bearer ' + user.token)
            expect(res).to.have.status(200)
          })

          it('Return the Checklist for the supplied Asset and MULTI-STIG JSON (.cklB) - no specified STIG', async () => {
              
              const res = await chai
                .request(config.baseUrl)
                .get(`/assets/${assetEnv.testAsset.assetId}/checklists?format=cklb`)
                .set('Authorization', 'Bearer ' + user.token)
              expect(res).to.have.status(200)
          })

          it('Return the Checklist for the supplied Asset and MULTI-STIG JSON (.cklB) - specific STIGs', async () => {

            const res = await chai
              .request(config.baseUrl)
              .get(`/assets/${assetEnv.testAsset.assetId}/checklists?format=cklb&benchmarkId=${assetEnv.testCollection.benchmark}&benchmarkId=Windows_10_STIG_TEST`)
              .set('Authorization', 'Bearer ' + user.token)
            
            if(user.grant === "Restricted"){
              expect(res).to.have.status(400)
              return
            }
            expect(res).to.have.status(200)
          })

          it('Return the Checklist for the supplied Asset and MULTI-STIG XML (.CKL) - no specified stigs', async () => {

            const res = await chai
              .request(config.baseUrl)
              .get(`/assets/${assetEnv.testAsset.assetId}/checklists/`)
              .set('Authorization', 'Bearer ' + user.token)
            expect(res).to.have.status(200)
          })

          it('Return the Checklist for the supplied Asset and MULTI-STIG XML (.CKL) - specified stigs', async () => {
              
              const res = await chai
                .request(config.baseUrl)
                .get(`/assets/${assetEnv.testAsset.assetId}/checklists?benchmarkId=${assetEnv.testCollection.benchmark}&benchmarkId=Windows_10_STIG_TEST`)
                .set('Authorization', 'Bearer ' + user.token)
        
                if(user.grant === "Restricted"){
                  expect(res).to.have.status(400)
                  return
                }
                expect(res).to.have.status(200)
          })
        })
      }
  })

  describe('GET - getChecklistByAssetStig - /assets/{assetId}/checklists/{benchmarkId}/{revisionStr}', () => {

    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as ${user.name}`, () => {
        it('Return the Checklist for the supplied Asset and benchmarkId and revisionStr', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${assetEnv.testAsset.assetId}/checklists/${assetEnv.testCollection.benchmark}/${assetEnv.testCollection.revisionStr}?format=ckl`)
            .set('Authorization', 'Bearer ' + user.token)
          expect(res).to.have.status(200)
        })

        it('Return the Checklist for the supplied Asset and STIG XML (.cklB) - specific STIG', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${assetEnv.testAsset.assetId}/checklists/${assetEnv.testCollection.benchmark}/${assetEnv.testCollection.revisionStr}?format=cklb`)
            .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)
        })

        it('Return the Checklist for the supplied Asset and STIG XML (.cklB) - specific STIG (asset does not have any restricted user grants)', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${assetEnv.assetNoRestrictedGrants}/checklists/${assetEnv.testCollection.benchmark}/${assetEnv.testCollection.revisionStr}?format=cklb`)
            .set('Authorization', 'Bearer ' + user.token)

          if(user.name === "lvl1"){
            expect(res).to.have.status(204)
            return
          }
          expect(res).to.have.status(200)     
        })

        it('Return the Checklist for the supplied Asset and STIG JSON', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${assetEnv.testAsset.assetId}/checklists/${assetEnv.testCollection.benchmark}/${assetEnv.testCollection.revisionStr}?format=json`)
            .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)
         
        })
        it('Return the Checklist for the supplied Asset and STIG JSON (should fail for a restricted user without grant on Asset requested)', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${assetEnv.assetNoRestrictedGrants}/checklists/${assetEnv.testCollection.benchmark}/${assetEnv.testCollection.revisionStr}?format=json`)
            .set('Authorization', 'Bearer ' + user.token)

            if(user.name === "lvl1"){
              expect(res).to.have.status(204)
              return
            }
            expect(res).to.have.status(200)         
        })
      })
    }
  })

  describe('GET - getStigsByAsset - /assets/{assetId}/stigs', () => {

    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as ${user.name}`, () => {
        it('Return an Assets STIG assignments', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/assets/${assetEnv.testAsset.assetId}/stigs`)
            .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          
          for(let stig of res.body){
            expect(stig.benchmarkId).to.be.oneOf(assetEnv.testCollection.validStigs)
          }
        })  
      })
    }
  })

  describe('GET - getAssetsByCollectionLabelId - /collections/{collectionId}/labels/{labelId}/assets', () => {

    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as ${user.name}`, () => {
        it('Get Assets in Collection with a label', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/collections/${assetEnv.testCollection.collectionId}/labels/${assetEnv.testCollection.testLabel}/assets`)
            .set('Authorization', 'Bearer ' + user.token)
          expect(res).to.have.status(200)
        })
        it('Get Assets in Collection with a label (collection only has a grant for admin user all others should fail. ', async () => {

          const res = await chai
            .request(config.baseUrl)
            .get(`/collections/83/labels/${assetEnv.testCollection.testLabel}/assets`)
            .set('Authorization', 'Bearer ' + user.token)
          if(user.name === "admin"){
            expect(res).to.have.status(200)
            return
          }
          expect(res).to.have.status(403)
        })
    })
  }
  })
describe('GET - getAssetsByStig - /collections/{collectionId}/stigs/{benchmarkId}/assets', () => {

      const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
      const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

      for (let user of users) {
        describe(`Testing as ${user.name}`, () => {
          it('Get Assets in Collection with a STIG (collection only has a grant for admin user all others should fail. ', async () => {
            const res = await chai
              .request(config.baseUrl)
              .get(`/collections/83/stigs/${assetEnv.testCollection.benchmark}/assets`)
              .set('Authorization', 'Bearer ' + user.token)
            if(user.name === "admin"){
              expect(res).to.have.status(200)
              return
            }
            expect(res).to.have.status(403)
          })
      
          it('Assets in a Collection attached to a STIG', async () => {

            const res = await chai
              .request(config.baseUrl)
              .get(`/collections/${assetEnv.testCollection.collectionId}/stigs/${assetEnv.testCollection.benchmark}/assets?projection=restrictedUserAccess`)
              .set('Authorization', 'Bearer ' + user.token)

            expect(res).to.have.status(200)
          })
          it('Assets in a Collection attached to a STIG - label-lvl1', async () => {

            const res = await chai
              .request(config.baseUrl)
              .get(`/collections/${assetEnv.testCollection.collectionId}/stigs/${assetEnv.testCollection.benchmark}/assets?projection=restrictedUserAccess&labelId=${assetEnv.testLabelLvl1}`)
              .set('Authorization', 'Bearer ' + user.token)

            expect(res).to.have.status(200)
          })
          it('Assets in a Collection attached to a STIG - label', async () => {
            const res = await chai
              .request(config.baseUrl)
              .get(`/collections/${assetEnv.testCollection.collectionId}/stigs/${assetEnv.testCollection.benchmark}/assets?projection=restrictedUserAccess&labelId=${assetEnv.testCollection.testLabel}`)
              .set('Authorization', 'Bearer ' + user.token)
            expect(res).to.have.status(200)
          })
      })
    }
  })
})
