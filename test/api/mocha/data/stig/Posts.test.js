const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const stigEnv = require('../../reviewEnv.json')
const fs = require('fs')
const path = require('path')

const user =
  {
    "name": "admin",
    "grant": "Owner",
    "token":
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ2ODEwMzUsImlhdCI6MTY3MDU0MDIzNiwiYXV0aF90aW1lIjoxNjcwNTQwMjM1LCJqdGkiOiI0N2Y5YWE3ZC1iYWM0LTQwOTgtOWJlOC1hY2U3NTUxM2FhN2YiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJiN2M3OGE2Mi1iODRmLTQ1NzgtYTk4My0yZWJjNjZmZDllZmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjMzNzhkYWZmLTA0MDQtNDNiMy1iNGFiLWVlMzFmZjczNDBhYyIsInNlc3Npb25fc3RhdGUiOiI4NzM2NWIzMy0yYzc2LTRiM2MtODQ4NS1mYmE1ZGJmZjRiOWYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImNyZWF0ZV9jb2xsZWN0aW9uIiwiZGVmYXVsdC1yb2xlcy1zdGlnbWFuIiwiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb24gc3RpZy1tYW5hZ2VyOnN0aWc6cmVhZCBzdGlnLW1hbmFnZXI6dXNlcjpyZWFkIHN0aWctbWFuYWdlcjpvcCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbjpyZWFkIHN0aWctbWFuYWdlcjpvcDpyZWFkIHN0aWctbWFuYWdlcjp1c2VyIHN0aWctbWFuYWdlciBzdGlnLW1hbmFnZXI6c3RpZyIsInNpZCI6Ijg3MzY1YjMzLTJjNzYtNGIzYy04NDg1LWZiYTVkYmZmNGI5ZiIsIm5hbWUiOiJTVElHTUFOIEFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3RpZ21hbmFkbWluIiwiZ2l2ZW5fbmFtZSI6IlNUSUdNQU4iLCJmYW1pbHlfbmFtZSI6IkFkbWluIn0.a1XwJZw_FIzwMXKo-Dr-n11me5ut-SF9ni7ylX-7t7AVrH1eAqyBxX9DXaxFK0xs6YOhoPsh9NyW8UFVaYgtF68Ps6yzoiqFEeiRXkpN5ygICN3H3z6r-YwanLlEeaYR3P2EtHRcrBtCnt0VEKKbGPWOfeiNCVe3etlp9-NQo44"
  }

describe('Stig POSTS tests using "admin" user ', () => {
    before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
    await utils.deleteStig(stigEnv.testCollection.benchmark)
    })

    describe('POST - importBenchmark - /stigs', () => {

        it('Import a new STIG - new', async () => {
         
            const directoryPath = path.join(__dirname, '../../../form-data-files/')
            const testStigfile = stigEnv.testStigfile
            const filePath = path.join(directoryPath, testStigfile)
       
            const res = await chai.request(config.baseUrl)
            .post('/stigs?clobber=false')
            .set('Authorization', `Bearer ${user.token}`)
            .set('Content-Type', `multipart/form-data`)
            .attach('importFile', fs.readFileSync(filePath), testStigfile) // Attach the file here
            let expectedRevData = {
              benchmarkId: "VPN_SRG_TEST",
              revisionStr: "V1R1",
              action: "inserted",
            }
            expect(res).to.have.status(200)
            expect(res.body).to.deep.eql(expectedRevData)
        })
        it('Import a new STIG - preserve', async () => {
         
            const directoryPath = path.join(__dirname, '../../../form-data-files/')
            const testStigfile = stigEnv.testStigfile
            const filePath = path.join(directoryPath, testStigfile)
       
            const res = await chai.request(config.baseUrl)
            .post('/stigs?clobber=false')
            .set('Authorization', `Bearer ${user.token}`)
            .set('Content-Type', `multipart/form-data`)
            .attach('importFile', fs.readFileSync(filePath), testStigfile) // Attach the file here
            let expectedRevData = 
            {
                "benchmarkId": "VPN_SRG_TEST",
                "revisionStr": "V1R1",
                "action": "preserved"
            }
            expect(res).to.have.status(200)
            expect(res.body).to.deep.eql(expectedRevData)
        })
        it('Import a new STIG - clobber', async () => {
         
            const directoryPath = path.join(__dirname, '../../../form-data-files/')
            const testStigfile = stigEnv.testStigfile
            const filePath = path.join(directoryPath, testStigfile)
       
            const res = await chai.request(config.baseUrl)
            .post('/stigs?clobber=true')
            .set('Authorization', `Bearer ${user.token}`)
            .set('Content-Type', `multipart/form-data`)
            .attach('importFile', fs.readFileSync(filePath), testStigfile) // Attach the file here
            let expectedRevData = 
            {
                "benchmarkId": "VPN_SRG_TEST",
                "revisionStr": "V1R1",
                "action": "replaced"
            }
            expect(res).to.have.status(200)
            expect(res.body).to.deep.eql(expectedRevData)
        })
    })
})
