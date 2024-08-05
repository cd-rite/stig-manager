const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const users = require("../../iterations.json")

describe('DELETE - Stig', () => {

    for(const user of users){
        describe(`user:${user.name}`, () => {
            describe('DELETE - deleteStigById - /stigs/{benchmarkId}', () => {

                beforeEach(async function () {
                    this.timeout(4000)
                    await utils.loadAppData()
                    await utils.uploadTestStigs()
                })

                it('Deletes a STIG (*** and all revisions ***) - expect fail, stig is assigned', async () => {
                    const res = await chai.request(config.baseUrl)
                    .delete(`/stigs/${environment.testCollection.benchmark}?elevate=true`)
                    .set('Authorization', `Bearer ${user.token}`)
                    if(user.name !== "stigmanadmin"){
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(422)
                })
                it('Deletes a STIG (*** and all revisions ***)', async () => {
                    const res = await chai.request(config.baseUrl)
                    .delete(`/stigs/${environment.scrapBenchmark}?elevate=true&force=true`)
                    .set('Authorization', `Bearer ${user.token}`)
                    if(user.name !== "stigmanadmin"){
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)

                    const response = await utils.getStigByBenchmarkId(environment.scrapBenchmark)
                    expect(response).to.be.empty

                })
            })
            describe('DELETE - deleteRevisionByString - /stigs/{benchmarkId}/revisions/{revisionStr}', () => {

                beforeEach(async function () {
                    this.timeout(4000)
                    await utils.loadAppData()
                    await utils.uploadTestStigs()
                })

                it('Deletes the specified revision of a STIG latest', async () => {
                    const res = await chai.request(config.baseUrl)
                    .delete(`/stigs/${environment.testCollection.benchmark}/revisions/latest?elevate=true&force=true`)
                    .set('Authorization', `Bearer ${user.token}`)
                    if(user.name !== "stigmanadmin"){
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(400)
                
                })
                it('Deletes the specified revision of a STIG', async () => {
                
                    const res = await chai.request(config.baseUrl)
                    .delete(`/stigs/${environment.testCollection.benchmark}/revisions/${environment.testCollection.revisionStr}?elevate=true&force=true`)
                    .set('Authorization', `Bearer ${user.token}`)
                    if(user.name !== "stigmanadmin"){
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                    const response = await utils.getStigByBenchmarkId(environment.testCollection.benchmark)
                    expect(response).to.not.be.empty
                })
        
            })
        })
    }
})

