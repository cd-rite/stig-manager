const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const fs = require('fs')
const path = require('path')
const iterations = require("../../iterations.js")
const reference = require('../../referenceData.js')
const expectations = require('./expectations.js')

describe('POST - Stig', () => {
    before(async function () {
    this.timeout(4000)
    await utils.uploadTestStigs()
    await utils.loadAppData()
    // await utils.createDisabledCollectionsandAssets()
    await utils.deleteStig(reference.benchmark)
    })

    for(const iteration of iterations){
        if (expectations[iteration.name] === undefined){
            it(`No expectations for this iteration scenario: ${iteration.name}`, async () => {})
            continue
        }
        describe(`iteration:${iteration.name}`, () => {
            describe('POST - importBenchmark - /stigs', () => {

                it('Import a new STIG - new', async () => {
                
                    const directoryPath = path.join(__dirname, '../../../form-data-files/')
                    const testStigfile = reference.testStigfile
                    const filePath = path.join(directoryPath, testStigfile)
            
                    const res = await chai.request(config.baseUrl)
                    .post('/stigs?elevate=true&clobber=false')
                    .set('Authorization', `Bearer ${iteration.token}`)
                    .set('Content-Type', `multipart/form-data`)
                    .attach('importFile', fs.readFileSync(filePath), testStigfile) // Attach the file here
                    let expectedRevData = {
                        benchmarkId: "VPN_SRG_TEST",
                        revisionStr: "V1R1",
                        action: "inserted",
                    }
                    if(iteration.name !== "stigmanadmin"){
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                    expect(res.body).to.deep.eql(expectedRevData)
                })
                it('should throw SmError.PrivilegeError() no elevate', async () => {
                
                    const directoryPath = path.join(__dirname, '../../../form-data-files/')
                    const testStigfile = reference.testStigfile
                    const filePath = path.join(directoryPath, testStigfile)
            
                    const res = await chai.request(config.baseUrl)
                    .post('/stigs?clobber=false')
                    .set('Authorization', `Bearer ${iteration.token}`)
                    .set('Content-Type', `multipart/form-data`)
                    .attach('importFile', fs.readFileSync(filePath), testStigfile) // Attach the file here
                    expect(res).to.have.status(403)
                })
                it('should throw SmError.ClientError not xml file', async () => {
                
                    const directoryPath = path.join(__dirname, '../../../form-data-files/')
                    const testStigfile = 'appdata.json'
                    const filePath = path.join(directoryPath, testStigfile)
            
                    const res = await chai.request(config.baseUrl)
                    .post('/stigs?elevate=true&clobber=false')
                    .set('Authorization', `Bearer ${iteration.token}`)
                    .set('Content-Type', `multipart/form-data`)
                    .attach('importFile', fs.readFileSync(filePath), testStigfile) // Attach the file here
                    if(iteration.name !== "stigmanadmin"){
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(400)
                })
                it('Import a new STIG - preserve', async () => {
                
                    const directoryPath = path.join(__dirname, '../../../form-data-files/')
                    const testStigfile = reference.testStigfile
                    const filePath = path.join(directoryPath, testStigfile)
            
                    const res = await chai.request(config.baseUrl)
                    .post('/stigs?elevate=true&clobber=false')
                    .set('Authorization', `Bearer ${iteration.token}`)
                    .set('Content-Type', `multipart/form-data`)
                    .attach('importFile', fs.readFileSync(filePath), testStigfile) // Attach the file here
                    let expectedRevData = 
                    {
                        "benchmarkId": "VPN_SRG_TEST",
                        "revisionStr": "V1R1",
                        "action": "preserved"
                    }
                    if(iteration.name !== "stigmanadmin"){
                        expect(res).to.have.status(403)
                        return
                    }
                    expect(res).to.have.status(200)
                    expect(res.body).to.deep.eql(expectedRevData)
                })
                it('Import a new STIG - clobber', async () => {
                
                    const directoryPath = path.join(__dirname, '../../../form-data-files/')
                    const testStigfile = reference.testStigfile
                    const filePath = path.join(directoryPath, testStigfile)
            
                    const res = await chai.request(config.baseUrl)
                    .post('/stigs?elevate=true&clobber=true')
                    .set('Authorization', `Bearer ${iteration.token}`)
                    .set('Content-Type', `multipart/form-data`)
                    .attach('importFile', fs.readFileSync(filePath), testStigfile) // Attach the file here
                    let expectedRevData = 
                    {
                        "benchmarkId": "VPN_SRG_TEST",
                        "revisionStr": "V1R1",
                        "action": "replaced"
                    }
                    if(iteration.name !== "stigmanadmin"){
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

