const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const fs = require('fs')
const path = require('path')
const users = require("../../iterations.json")

describe('POST - Stig', () => {
    before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
    await utils.deleteStig(environment.testCollection.benchmark)
    })

    for(const user of users){
        describe(`user:${user.name}`, () => {
            describe('POST - importBenchmark - /stigs', () => {

                it('Import a new STIG - new', async () => {
                
                    const directoryPath = path.join(__dirname, '../../../form-data-files/')
                    const testStigfile = environment.testStigfile
                    const filePath = path.join(directoryPath, testStigfile)
            
                    const res = await chai.request(config.baseUrl)
                    .post('/stigs?elevate=true&clobber=false')
                    .set('Authorization', `Bearer ${user.token}`)
                    .set('Content-Type', `multipart/form-data`)
                    .attach('importFile', fs.readFileSync(filePath), testStigfile) // Attach the file here
                    let expectedRevData = {
                        benchmarkId: "VPN_SRG_TEST",
                        revisionStr: "V1R1",
                        action: "inserted",
                    }
                    if(user.name !== "stigmanadmin"){
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                    expect(res.body).to.deep.eql(expectedRevData)
                })
                it('Import a new STIG - preserve', async () => {
                
                    const directoryPath = path.join(__dirname, '../../../form-data-files/')
                    const testStigfile = environment.testStigfile
                    const filePath = path.join(directoryPath, testStigfile)
            
                    const res = await chai.request(config.baseUrl)
                    .post('/stigs?elevate=true&clobber=false')
                    .set('Authorization', `Bearer ${user.token}`)
                    .set('Content-Type', `multipart/form-data`)
                    .attach('importFile', fs.readFileSync(filePath), testStigfile) // Attach the file here
                    let expectedRevData = 
                    {
                        "benchmarkId": "VPN_SRG_TEST",
                        "revisionStr": "V1R1",
                        "action": "preserved"
                    }
                    if(user.name !== "stigmanadmin"){
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                    expect(res.body).to.deep.eql(expectedRevData)
                })
                it('Import a new STIG - clobber', async () => {
                
                    const directoryPath = path.join(__dirname, '../../../form-data-files/')
                    const testStigfile = environment.testStigfile
                    const filePath = path.join(directoryPath, testStigfile)
            
                    const res = await chai.request(config.baseUrl)
                    .post('/stigs?elevate=true&clobber=true')
                    .set('Authorization', `Bearer ${user.token}`)
                    .set('Content-Type', `multipart/form-data`)
                    .attach('importFile', fs.readFileSync(filePath), testStigfile) // Attach the file here
                    let expectedRevData = 
                    {
                        "benchmarkId": "VPN_SRG_TEST",
                        "revisionStr": "V1R1",
                        "action": "replaced"
                    }
                    if(user.name !== "stigmanadmin"){
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                    expect(res.body).to.deep.eql(expectedRevData)
                })
            })
        })
    }
})

