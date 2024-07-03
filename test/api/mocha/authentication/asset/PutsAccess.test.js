const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const assetEnv = require('../../assetEnv.json')
const usersEnv = require('../../data/asset/users.json')

describe('Asset PUT tests', () => {

    before(async function () {
        this.timeout(4000)
        await utils.loadAppData()
        await utils.uploadTestStigs()
        await utils.createDisabledCollectionsandAssets()
    })

    describe(`PUT - replaceAsset -/assets/{assetId}`, () => {

        const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
        const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

        for (let user of users) {
            describe(`Testing as ${user.name}`, () => {

                it('Set all properties of an Asset', async function () {
                    const res = await chai.request(config.baseUrl)
                        .put(`/assets/${assetEnv.scrapAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
                        .set('Authorization', 'Bearer ' + user.token)
                        .send({
                        "name": 'TestAsset' + Math.floor(Math.random() * 1000),
                        "collectionId": assetEnv.scrapCollection,
                        "description": "test desc",
                        "ip": "1.1.1.1",
                        "noncomputing": true,
                        "labelIds": [
                            "df4e6836-a003-11ec-b1bc-0242ac110002"
                        ],
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
                    if (user.name == "lvl1" || user.name == "lvl2") {
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                })

                it('Set all properties of an Asset - assign new STIG', async function () {
                    const res = await chai.request(config.baseUrl)
                        .put(`/assets/${assetEnv.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
                        .set('Authorization', 'Bearer ' + user.token)
                        .send({
                        "name": 'TestAsset' + Math.floor(Math.random() * 1000),
                        "collectionId": assetEnv.testCollection.collectionId,
                        "description": "test desc",
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
                            "VPN_SRG_OTHER",
                            "Windows_10_STIG_TEST",
                            "RHEL_7_STIG_TEST"
                        ]
                    })
                    if (user.name == "lvl1" || user.name == "lvl2") {
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                })

                it('Set all properties of an Asset - Change Collection - invalid for all users', async function () {
                const res = await chai.request(config.baseUrl)
                    .put(`/assets/${assetEnv.scrapAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
                    .set('Authorization', 'Bearer ' + user.token)
                    .send({
                    "name": 'TestAsset' + Math.floor(Math.random() * 1000),
                    "collectionId": assetEnv.scraplvl1Collection,
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
            })
        }
    })
    describe(`PUT - putAssetMetadata - /assets/{assetId}/metadata`, () => {
    
        const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
        const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

        for (let user of users) {
            describe(`Testing as ${user.name}`, () => {

                it('Set all metadata of an Asset', async function () {
                    const res = await chai.request(config.baseUrl)
                        .put(`/assets/${assetEnv.scrapAsset.assetId}/metadata`)
                        .set('Authorization', 'Bearer ' + user.token)
                        .send({
                        [assetEnv.scrapAsset.metadataKey]: assetEnv.scrapAsset.metadataValue
                        })
                    if (user.name == "lvl1" || user.name == "lvl2") {
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                })
            })
        }   
    })
    describe(`PUT - putAssetMetadataValue - /assets/{assetId}/metadata/keys/{key}`, () => {

        const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
        const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

        for (let user of users) {
            describe(`Testing as ${user.name}`, () => {
                it('Set one metadata key/value of an Asset', async function () {
                    const res = await chai.request(config.baseUrl)
                        .put(`/assets/${assetEnv.scrapAsset.assetId}/metadata/keys/${assetEnv.scrapAsset.metadataKey}`)
                        .set('Authorization', 'Bearer ' + user.token)
                        .set('Content-Type', 'application/json') 
                        .send(`${JSON.stringify(assetEnv.scrapAsset.metadataValue)}`)

                    if (user.name == "lvl1" || user.name == "lvl2") {
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(204)
                })
            })
        }
    })
    describe(`PUT - attachStigToAsset - /assets/{assetId}/stigs/{benchmarkId}`, () => {

        const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
        const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

        for (let user of users) {
            describe(`Testing as ${user.name}`, () => {
                it('PUT a STIG assignment to an Asset Copy 3', async function () {
                    const res = await chai.request(config.baseUrl)
                        .put(`/assets/${assetEnv.scrapAsset.assetId}/stigs/${assetEnv.scrapAsset.scrapBenchmark}`)
                        .set('Authorization', 'Bearer ' + user.token)
                    
                    if (user.name == "lvl1" || user.name == "lvl2") {
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                })
            })
        }
    })
    describe(`PUT - putAssetsByCollectionLabelId - /collections/{collectionId}/labels/{labelId}/assets`, () => {

        const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
        const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

        for (let user of users) {
            describe(`Testing as ${user.name}`, () => {
            
                it('Replace a Labels Asset Mappings in a Collection', async function () {
                    const res = await chai.request(config.baseUrl)
                        .put(`/collections/${assetEnv.testCollection.collectionId}/labels/${assetEnv.testCollection.testLabel}/assets`)
                        .set('Authorization', 'Bearer ' + user.token)
                        .send([assetEnv.testAsset.assetId])
                    if (user.name == "lvl1" || user.name == "lvl2") {
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                })
            
                it('Replace a Labels Asset Mappings in a Collection assign to an asset that does not exist', async function () {
                    const res = await chai.request(config.baseUrl)
                    .put(`/collections/${assetEnv.testCollection.collectionId}/labels/${assetEnv.testCollection.testLabel}/assets`)
                    .set('Authorization', 'Bearer ' + user.token)
                    .send(["9999"])
                    expect(res).to.have.status(403)
                })
            })
        }
    })
    describe(`PUT - attachAssetsToStig - /collections/{collectionId}/stigs/{benchmarkId}/assets`, () => {

        const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
        const users = usersEnv.filter(user => usersNamesToTest.includes(user.name))

        for (let user of users) {
            describe(`Testing as ${user.name}`, () => {
                
                it(' gh-756 issue. assign a benchmark used in test Collection in scrap Collection', async function () {
                    const res = await chai.request(config.baseUrl)
                    .put(`/collections/${assetEnv.scrapCollection}/stigs/${assetEnv.testCollection.benchmark}/assets?projection=restrictedUserAccess`)
                    .set('Authorization', 'Bearer ' + user.token)
                    .send([assetEnv.scrapAsset.assetId])
                    
                    if (user.name == "lvl1" || user.name == "lvl2") {
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                })
            })
        }
    })
})

