const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const users = require('../../iterations.json')

describe('PATCH - Collection', () => {

    before(async function () {
        this.timeout(4000)
        await utils.loadAppData()
        await utils.uploadTestStigs()
    })

    for(const user of users) {

      describe(`user:${user.name}`, () => {
        describe('updateCollection - /collections/{collectionId}', () => {

          it('Merge provided properties with a Collection', async () => {

            const patchRequest = {
                metadata: {
                    pocName: "poc2Patched",
                    pocEmail: "pocEmail@email.com",
                    pocPhone: "12342",
                    reqRar: "true",
                },
                grants: [
                    {
                    userId: "1",
                    accessLevel: 4,
                    },
                    {
                    userId: "21",
                    accessLevel: 1,
                    },
                    {
                    userId: "44",
                    accessLevel: 3,
                    },
                    {
                    userId: "45",
                    accessLevel: 4,
                    },
                    {
                    userId: "87",
                    accessLevel: 4,
                    },
                ],
                }
            
            const res = await chai.request(config.baseUrl)
                  .patch(`/collections/${environment.scrapCollection.collectionId}?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs`)
                  .set('Authorization', `Bearer ${user.token}`)
                  .send(patchRequest)
            
            if(user.name === "lvl1" || user.name === "lvl2") {
                expect(res).to.have.status(403)
                return
            }
            expect(res).to.have.status(200)
            expect(res.body.metadata.pocName).to.equal(patchRequest.metadata.pocName)
            expect(res.body.metadata.pocEmail).to.equal(patchRequest.metadata.pocEmail)
            expect(res.body.metadata.pocPhone).to.equal(patchRequest.metadata.pocPhone)
            expect(res.body.metadata.reqRar).to.equal(patchRequest.metadata.reqRar)

            expect(res.body.grants).to.have.lengthOf(patchRequest.grants.length)
            
            // make sure userids are the same 
            for(const grant of res.body.grants) {
                expect(grant.user.userId).to.be.oneOf(patchRequest.grants.map(g => g.userId))
            }

            // projections
            expect(res.body.assets).to.have.lengthOf(3)
            expect(res.body.owners).to.have.lengthOf(3)
            expect(res.body.statistics).to.have.property("assetCount").to.equal(res.body.assets.length)

            for(stig of res.body.stigs) {
                expect(stig.benchmarkId).to.be.oneOf(environment.scrapCollection.validStigs)
            }
          })
        })

        describe('patchCollectionLabelById - /collections/{collectionId}/labels/{labelId}', () => {

          it('Merge provided properties with a Collection Label', async () => {
              const res = await chai.request(config.baseUrl)
                  .patch(`/collections/${environment.testCollection.collectionId}/labels/${environment.testCollection.testLabel}`)
                  .set('Authorization', `Bearer ${user.token}`)
                  .send({
                      "name": "test-label-full",
                      "description": "test label patched",
                      "color": "aa34cc"
                    })
                if(user.name === "lvl1" || user.name === "lvl2") {
                    expect(res).to.have.status(403)
                    return
                }
              expect(res).to.have.status(200)
              expect(res.body.labelId).to.equal(environment.testCollection.testLabel)
              expect(res.body.description).to.equal("test label patched")
              expect(res.body.color).to.equal("aa34cc")
              expect(res.body.name).to.equal("test-label-full")
          })
        })

        describe('patchCollectionMetadata - /collections/{collectionId}/metadata', () => {

          it('Merge metadata property/value into a Collection', async () => {
              
              const res = await chai.request(config.baseUrl)
                  .patch(`/collections/${environment.testCollection.collectionId}/metadata`)
                  .set('Authorization', `Bearer ${user.token}`)
                  .send({[environment.testCollection.metadataKey]: environment.testCollection.metadataValue})
            if(user.name === "lvl1" || user.name === "lvl2") {
                expect(res).to.have.status(403)
                return
             }
              expect(res).to.have.status(200)
              expect(res.body).to.contain({[environment.testCollection.metadataKey]: environment.testCollection.metadataValue})
          })
        })
      })
    }
})
