const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const iterations = require("../../iterations.js")
const reference = require('../../referenceData.js')
const expectations = require('./expectations.js')

describe('DELETE - Stig', () => {

    for(const iteration of iterations){
        if (expectations[iteration.name] === undefined){
            it(`No expectations for this iteration scenario: ${iteration.name}`, async () => {})
            continue
        }
        describe(`iteration:${iteration.name}`, () => {
            const distinct = expectations[iteration.name]
            describe('DELETE - deleteStigById - /stigs/{benchmarkId}', () => {

                before(async function () {
                    this.timeout(4000)
                    await utils.uploadTestStigs()
                    await utils.loadAppData()
                })
                it('attempts to delete stig and all revisions, fails because no force.', async () => {
                    const res = await chai.request(config.baseUrl)
                    .delete(`/stigs/${reference.benchmark}?elevate=true`)
                    .set('Authorization', `Bearer ${iteration.token}`)
                    if(iteration.name !== "stigmanadmin"){
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(422)
                })
                it('Deletes a stig an all revisions', async () => {
                    const res = await chai.request(config.baseUrl)
                    .delete(`/stigs/${reference.scrapBenchmark}?elevate=true&force=true`)
                    .set('Authorization', `Bearer ${iteration.token}`)
                    if(iteration.name !== "stigmanadmin"){
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)

                    const response = await utils.getStigByBenchmarkId(reference.scrapBenchmark)
                    expect(response.response.status).to.equal(404)

                })
                it('should throw SmError.NotFoundError No matching benchmarkId found.', async () => {
                    const res = await chai.request(config.baseUrl)
                    .delete(`/stigs/${'trashdata'}?elevate=true&force=true`)
                    .set('Authorization', `Bearer ${iteration.token}`)
                    if(iteration.name !== "stigmanadmin"){
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(404)
                })
            })
            describe('DELETE - deleteRevisionByString - /stigs/{benchmarkId}/revisions/{revisionStr}', () => {

                before(async function () {
                    this.timeout(4000)
                    await utils.uploadTestStigs()
                    await utils.loadAppData()
                })

                it('attempts to delete latest of test benchmark, fails because latest is not a permitted revision for this endpoint!', async () => {
                    const res = await chai.request(config.baseUrl)
                    .delete(`/stigs/${reference.benchmark}/revisions/latest?elevate=true&force=true`)
                    .set('Authorization', `Bearer ${iteration.token}`)
                    if(iteration.name !== "stigmanadmin"){
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res, "fails because latest cannot work in this endpoint").to.have.status(400)
                })
                it('Deletes the specified revision of a STIG (v1r1 of test benchmark)', async () => {
                
                    const res = await chai.request(config.baseUrl)
                    .delete(`/stigs/${reference.benchmark}/revisions/${reference.revisionStr}?elevate=true&force=true`)
                    .set('Authorization', `Bearer ${iteration.token}`)
                    if(iteration.name !== "stigmanadmin"){
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                })
            })
        })
    }
})

