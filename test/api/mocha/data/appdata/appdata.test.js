const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const users = require('../../iterations.json')


describe('Appdata', () => {

  for(const user of users){
    describe(`user:${user.name}`, () => {
      before(async function () {
        this.timeout(4000)
        await utils.loadAppData()
        await utils.uploadTestStigs()
        await utils.createDisabledCollectionsandAssets()
      })
      describe('GET - getAppData - /op/appdata', () => {
        it('Export application data', async () => {
        const res = await chai.request(config.baseUrl)
            .get(`/op/appdata?elevate=true`)
            .set('Authorization', `Bearer ${user.token}`)
        if(user.name !== "stigmanadmin"){
          expect(res).to.have.status(403)
          return
        }
        expect(res).to.have.status(200)
        })
      })
      describe('GET - getConfiguration - /op/configuration', () => {
        it('Return API version and configuration information', async () => {
        const res = await chai.request(config.baseUrl)
            .get(`/op/configuration`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        })
        it('delate alter test', async () => {
          const res = await chai.request(config.baseUrl)
              .get(`/op/configuration`)
              .set('Authorization', `Bearer ${user.token}`)
          expect(res).to.have.status(200)
          })
      })
      describe('GET - getDetails - /op/details', () => {
        it('Return API Deployment Details', async () => {
        const res = await chai.request(config.baseUrl)
            .get(`/op/details?elevate=true`)
            .set('Authorization', `Bearer ${user.token}`)
        if(user.name !== "stigmanadmin"){
          expect(res).to.have.status(403)
          return
        }
        expect(res).to.have.status(200)
        })
      })
      describe('GET - getDefinition - /op/definition', () => {
        it('Return API Deployment Details', async () => {
        const res = await chai.request(config.baseUrl)
            .get(`/op/definition`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        })
      })
    })
  }
})