const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const enviornment = require('../../enviornment.json')
const usersEnv = require('../../users.json')
describe('Access Control Testing Asset posts', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })
  
  describe(`POST - createAsset - /assets`, () => {

    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
      describe(`Testing as ${user.name}`, () => {
        it('Create an Asset (with stigs projection)', async () => {
          const res = await chai
            .request(config.baseUrl)
            .post('/assets?projection=stigs')
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              name: 'TestAsset' + Math.floor(Math.random() * 1000),
              collectionId: enviornment.testCollection.collectionId,
              description: 'test',
              ip: '1.1.1.1',
              noncomputing: true,
              labelIds: [enviornment.testCollection.testLabel],
              metadata: {
                pocName: 'pocName',
                pocEmail: 'pocEmail@example.com',
                pocPhone: '12345',
                reqRar: 'true'
              },
              stigs: enviornment.testCollection.validStigs
            }
          )
          if(user.grant === "Restricted" || user.grant === "Full") {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(201)
        })

        it('Create an Asset (with statusStats projection', async () => {
          const res = await chai
            .request(config.baseUrl)
            .post('/assets?projection=statusStats')
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              name: 'TestAsset' + Math.floor(Math.random() * 1000),
              collectionId: enviornment.testCollection.collectionId,
              description: 'test',
              ip: '1.1.1.1',
              noncomputing: true,
              labelIds: [enviornment.testCollection.testLabel],
              metadata: {
                pocName: 'pocName',
                pocEmail: 'pocEmail@example.com',
                pocPhone: '12345',
                reqRar: 'true'
              },
              stigs: enviornment.testCollection.validStigs
            })
          
          if(user.grant === "Restricted" || user.grant === "Full") {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(201)
        })

        it('Create an Asset (with stigGrants projection)', async () => {
          const res = await chai
            .request(config.baseUrl)
            .post('/assets?projection=stigGrants')
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              name: 'TestAsset' + Math.floor(Math.random() * 1000),
              collectionId: enviornment.testCollection.collectionId,
              description: 'test',
              ip: '1.1.1.1',
              noncomputing: true,
              labelIds: [enviornment.testCollection.testLabel],
              metadata: {
                pocName: 'pocName',
                pocEmail: 'pocEmail@example.com',
                pocPhone: '12345',
                reqRar: 'true'
              },
              stigs: enviornment.testCollection.validStigs
            })
          
          if(user.grant === "Restricted" || user.grant === "Full") {
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(201)
        })
    })
  }
  })
  
})
