const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const enviornment = require('../../enviornment.json')
const usersEnv = require('../../iterations.json')

describe('Asset delete Access Control tests admin user', () => {
    before(async function () {
        this.timeout(4000)
        await utils.uploadTestStigs()
        await utils.loadAppData()
        await utils.createDisabledCollectionsandAssets()
    })
    describe(`DELETE - deleteAssetMetadataKey - /assets/{assetId}/metadata/keys/{key}`, () => {
        const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
        const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))
        for(let user of users) {
            describe(`Tests for ${user.name}`, () => {
                it('Delete one metadata key/value of an Asset', async () => {
                    const res = await chai
                        .request(config.baseUrl)
                        .delete(`/assets/${enviornment.scrapAsset.assetId}/metadata/keys/${enviornment.scrapAsset.metadataKey}`)
                        .set('Content-Type', 'application/json') 
                        .set('Authorization', 'Bearer ' + user.token)
                        .send(`${JSON.stringify(enviornment.scrapAsset.metadataValue)}`)

                        if(user.name === 'lvl1' || user.name === 'lvl2') {
                            expect(res).to.have.status(403)
                            return
                        }
                        expect(res).to.have.status(204)
                })
            })
        }
    })
    describe(`DELETE - removeStigsFromAsset -/assets/{assetId}/stigs`, () => {
        const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
        const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

        for(let user of users) {
            describe(`Tests for ${user.name}`, () => {
            
                it('Delete all STIG assignments to an Asset', async () => {
                    const res = await chai
                        .request(config.baseUrl)
                        .delete(`/assets/${enviornment.scrapAsset.assetId}/stigs`)
                        .set('Authorization', 'Bearer ' + user.token)

                    if(user.name === 'lvl1' || user.name === 'lvl2') {
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                })
            })
        }
    })
    describe(`DELETE - removeStigFromAsset - /assets/{assetId}/stigs/{benchmarkId}`, () => {
        const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
        const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

        for(let user of users) {
            describe(`Tests for ${user.name}`, () => {
                it('Delete a STIG assignment to an Asset', async () => {
                    const res = await chai
                        .request(config.baseUrl)
                        .delete(`/assets/${enviornment.scrapAsset.assetId}/stigs/${enviornment.scrapAsset.scrapBenchmark}`)
                        .set('Authorization', 'Bearer ' + user.token)

                    if(user.name === 'lvl1' || user.name === 'lvl2') {
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                })                  
            })
        }
    })
    describe(`DELETE - deleteAsset - /assets/{assetId}`, () => {
  
        const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
        const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

        for(let user of users) {
            describe(`Tests for ${user.name}`, () => {
                before(async function () {
                    await utils.loadAppData()
                    await utils.uploadTestStigs()
                })
            
                it('Delete test Asset', async () => {
                    const res = await chai
                        .request(config.baseUrl)
                        .delete(`/assets/${enviornment.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
                        .set('Authorization', 'Bearer ' + user.token) 
                    
                    if(user.name === 'lvl1' || user.name === 'lvl2') {
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                })
             })
        }
    })
})
    



