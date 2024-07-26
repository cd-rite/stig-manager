const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const enviornment = require('../../enviornment.json')
const usersEnv = require('../../users.json')
describe('Access Control Testing Asset Patch ', () => {
    before(async function () {
        this.timeout(4000)
        await utils.uploadTestStigs()
        await utils.loadAppData()
        await utils.createDisabledCollectionsandAssets()
    })
    describe(`PATCH - updateAsset - /assets/{assetId}`, () => {

    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
        describe(`Testing as ${user.name}`, () => {

            it('Merge provided properties with an Asset - Change Collection - Fail for all users', async () => {
                const res = await chai
                    .request(config.baseUrl)
                    .patch(`/assets/${enviornment.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
                    .set('Authorization', 'Bearer ' + user.token)
                    .send({ 
                    "collectionId": enviornment.scrapLvl1User.userId,
                    "description": "test desc",
                    "ip": "1.1.1.1",
                    "noncomputing": true,
                    "metadata": {},
                    "stigs": [
                        "VPN_SRG_TEST",
                        "Windows_10_STIG_TEST",
                        "RHEL_7_STIG_TEST"
                    ]
                })

                expect(res).to.have.status(403)
            })

            it('Merge provided properties with an Asset - Change Collection - valid for lvl3 and lvl4 only (IE works for admin for me)', async () => {
                const res = await chai
                    .request(config.baseUrl)
                    .patch(`/assets/${enviornment.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
                    .set('Authorization', 'Bearer ' + user.token)
                    .send({
                    "collectionId": enviornment.scrapCollection.collectionId,
                    "description": "test desc",
                    "ip": "1.1.1.1",
                    "noncomputing": true,
                    "metadata": {},
                    "stigs": [
                        "VPN_SRG_TEST",
                        "Windows_10_STIG_TEST",
                        "RHEL_7_STIG_TEST"
                    ]
                })
                if(user.grant === "Manage" || user.grant === "Owner") {
                    expect(res).to.have.status(200)
                    return
                }
                expect(res).to.have.status(403)
            }) 
            it('Merge provided properties with an Asset', async () => {
            
                const res = await chai
                    .request(config.baseUrl)
                    .patch(`/assets/${enviornment.scrapAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
                    .set('Authorization', 'Bearer ' + user.token)
                    .send({
                    "collectionId": enviornment.scrapCollection.collectionId,
                    "description": "scrap",
                    "ip": "1.1.1.1",
                    "noncomputing": true,
                    "metadata": {
                        "pocName": "poc2Put",
                        "pocEmail": "pocEmailPut@email.com",
                        "pocPhone": "12342",
                        "reqRar": "true"
                    },
                    "stigs": [
                        "VPN_SRG_TEST",
                        "Windows_10_STIG_TEST",
                        "RHEL_7_STIG_TEST"
                    ]
                })
                if(user.grant === "Restricted" || user.grant === "Full") {
                    expect(res).to.have.status(403)
                    return
                }
                expect(res).to.have.status(200)
            })
        })
    }
    })

    describe(`PATCH - patchAssets - /assets`, () => {

    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

        for (let user of users) {
            describe(`Testing as ${user.name}`, () => {

                before(async function () {
                    this.timeout(4000)
                    await utils.uploadTestStigs()
                    await utils.loadAppData()
                    await utils.createDisabledCollectionsandAssets()
                })

                it('Delete Assets - expect success for valid users', async () => {
                    const res = await chai
                        .request(config.baseUrl)
                        .patch(`/assets?collectionId=${enviornment.testCollection.collectionId}`)
                        .set('Authorization', 'Bearer ' + user.token)
                        .send({
                        "operation": "delete",
                        "assetIds": ["29","42"]
                        })
                    
                    if(user.name === "lvl1" || user.name === "lvl2") {
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)    
                })
            })
        }
    })  

    describe(`PATCH - patchAssetMetadata - /assets/{assetId}/metadata`, () => {

        const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
        const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

        for (let user of users) {
            describe(`Testing as ${user.name}`, () => {

                it('Merge provided properties with an Asset - Change metadata', async () => {
                const res = await chai
                    .request(config.baseUrl)
                    .patch(`/assets/${enviornment.scrapAsset.assetId}/metadata`)
                    .set('Authorization', 'Bearer ' + user.token)
                    .send({
                    "testkey":"poc2Patched"
                    })
                    if(user.grant === "Restricted" || user.grant === "Full") {
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                })
            })
        }
    })
})

