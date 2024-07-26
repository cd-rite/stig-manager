const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const stigEnv = require('../../enviornment.json')

const user =
  {
    "name": "admin",
    "grant": "Owner",
    "token":
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ2ODEwMzUsImlhdCI6MTY3MDU0MDIzNiwiYXV0aF90aW1lIjoxNjcwNTQwMjM1LCJqdGkiOiI0N2Y5YWE3ZC1iYWM0LTQwOTgtOWJlOC1hY2U3NTUxM2FhN2YiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJiN2M3OGE2Mi1iODRmLTQ1NzgtYTk4My0yZWJjNjZmZDllZmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjMzNzhkYWZmLTA0MDQtNDNiMy1iNGFiLWVlMzFmZjczNDBhYyIsInNlc3Npb25fc3RhdGUiOiI4NzM2NWIzMy0yYzc2LTRiM2MtODQ4NS1mYmE1ZGJmZjRiOWYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImNyZWF0ZV9jb2xsZWN0aW9uIiwiZGVmYXVsdC1yb2xlcy1zdGlnbWFuIiwiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb24gc3RpZy1tYW5hZ2VyOnN0aWc6cmVhZCBzdGlnLW1hbmFnZXI6dXNlcjpyZWFkIHN0aWctbWFuYWdlcjpvcCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbjpyZWFkIHN0aWctbWFuYWdlcjpvcDpyZWFkIHN0aWctbWFuYWdlcjp1c2VyIHN0aWctbWFuYWdlciBzdGlnLW1hbmFnZXI6c3RpZyIsInNpZCI6Ijg3MzY1YjMzLTJjNzYtNGIzYy04NDg1LWZiYTVkYmZmNGI5ZiIsIm5hbWUiOiJTVElHTUFOIEFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3RpZ21hbmFkbWluIiwiZ2l2ZW5fbmFtZSI6IlNUSUdNQU4iLCJmYW1pbHlfbmFtZSI6IkFkbWluIn0.a1XwJZw_FIzwMXKo-Dr-n11me5ut-SF9ni7ylX-7t7AVrH1eAqyBxX9DXaxFK0xs6YOhoPsh9NyW8UFVaYgtF68Ps6yzoiqFEeiRXkpN5ygICN3H3z6r-YwanLlEeaYR3P2EtHRcrBtCnt0VEKKbGPWOfeiNCVe3etlp9-NQo44"
  } 

  

describe('Stig GETS tests using "admin" user ', () => {
    before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
   // await utils.createDisabledCollectionsandAssets()
    })

    describe('GET - getSTIGs - /stigs', () => {

        it('Return a list of available STIGs', async () => {
            const res = await chai.request(config.baseUrl)
            .get('/stigs')
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
            expect(res.body).to.be.lengthOf(8)
            for(let stig of res.body){
                expect(stig).to.have.property('benchmarkId')
                expect(stig.benchmarkId).to.be.oneOf(stigEnv.allStigsForAdmin)
            }
        })
        it('Return a list of available STIGs NAME FILTER', async () => {
            const res = await chai.request(config.baseUrl)
            .get('/stigs?title=vpn')
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
            expect(res.body).to.be.lengthOf(3)

        })
    })
    describe('GET - getCci - /stigs/ccis/{cci}', () => {

        it('Return data for the specified CCI', async () => {
            const res = await chai.request(config.baseUrl)
            .get(`/stigs/ccis/${stigEnv.testCollection.cci}?projection=stigs&projection=emassAp&projection=references`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body.cci).to.be.equal(stigEnv.testCollection.cci)
            expect(res.body).to.have.property('stigs')
            expect(res.body).to.have.property('emassAp')
            expect(res.body).to.have.property('references')
        })
    })
    describe('GET - getRuleByRuleId - /stigs/rules/{ruleId}', () => {

        it('Return data for the specified rule', async () => {
            const res = await chai.request(config.baseUrl)
            .get(`/stigs/rules/${stigEnv.testCollection.ruleId}?projection=detail&projection=ccis&projection=check&projection=fix`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body.ruleId).to.be.equal(stigEnv.testCollection.ruleId)
            expect(res.body).to.have.property('detail')
            expect(res.body).to.have.property('ccis')
            expect(res.body).to.have.property('check')
            expect(res.body).to.have.property('fix')
        })
    })
    describe('GET - getScapMap - /stigs/scap-maps', () => {
        it('Return a list of SCAP maps', async () => {
            const res = await chai.request(config.baseUrl)
            .get('/stigs/scap-maps')
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.eql([
                {
                  scapBenchmarkId: 'CAN_Ubuntu_18-04_STIG',
                  benchmarkId: 'U_CAN_Ubuntu_18-04_STIG'
                },
                {
                  scapBenchmarkId: 'Mozilla_Firefox_RHEL',
                  benchmarkId: 'Mozilla_Firefox'
                },
                {
                  scapBenchmarkId: 'Mozilla_Firefox_Windows',
                  benchmarkId: 'Mozilla_Firefox'
                },
                {
                  scapBenchmarkId: 'MOZ_Firefox_Linux',
                  benchmarkId: 'MOZ_Firefox_STIG'
                },
                {
                  scapBenchmarkId: 'MOZ_Firefox_Windows',
                  benchmarkId: 'MOZ_Firefox_STIG'
                },    
                {
                  scapBenchmarkId: 'Solaris_10_X86_STIG',
                  benchmarkId: 'Solaris_10_X86'
                }
              ])
        })
    })
    describe('GET - getStigById - /stigs/{benchmarkId}', () => {

        it('Return properties of the specified STIG', async () => {
            const res = await chai.request(config.baseUrl)
            .get(`/stigs/${stigEnv.testCollection.benchmark}`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('benchmarkId')
            expect(res.body.benchmarkId).to.be.equal(stigEnv.testCollection.benchmark)
        })
    })
    describe('GET - getRevisionsByBenchmarkId - /stigs/{benchmarkId}/revisions', () => {

    //     describe('Replacement of Stig tests. ', () => {

    //         before(async function () {
    //             // this.timeout(4000)
    //             // await utils.loadAppData()
    //             // await utils.uploadTestStigs()
    //            await utils.replaceStigRevision("U_VPN_SRG_V1R1_Manual-xccdf.xml")
    //            await utils.replaceStigRevision()
    //         })

    //         after(async function () {
    //             this.timeout(4000)
    //             await utils.loadAppData()
    //             await utils.uploadTestStigs()
    //         })

    //     it('Return a list of revisions for the specified STIG - check for updated revision', async () => {
           
    //         const res = await chai.request(config.baseUrl)
    //         .get(`/stigs/${stigEnv.testCollection.benchmark}/revisions`)
    //         .set('Authorization', `Bearer ${user.token}`)
    //         expect(res).to.have.status(200)
    //         expect(res.body).to.be.an('array')
    //         expect(res.body).to.be.lengthOf(1)
    //         for(let revision of res.body){
    //             expect(revision.ruleCount).to.eql(2)
    //         }
    //     })
    // })

        it('Return a list of revisions for the specified STIG', async () => {

            const res = await chai.request(config.baseUrl)
            .get(`/stigs/${stigEnv.testCollection.benchmark}/revisions`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
            expect(res.body).to.be.lengthOf(2)
          
        })

    })
    describe('GET - getRevisionByString - /stigs/{benchmarkId}/revisions/{revisionStr}', () => {

        it('Return metadata for the specified revision of a STIG', async () => {
            const res = await chai.request(config.baseUrl)
            .get(`/stigs/${stigEnv.testCollection.benchmark}/revisions/${stigEnv.testCollection.revisionStr}`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('revisionStr')
            expect(res.body.revisionStr).to.be.equal(stigEnv.testCollection.revisionStr)
        })
    })
    describe('GET - getCcisByRevision - /stigs/{benchmarkId}/revisions/{revisionStr}/ccis', () => {
        it('Return a list of CCIs from a STIG revision', async () => {
            const res = await chai.request(config.baseUrl)
            .get(`/stigs/${stigEnv.testCollection.benchmark}/revisions/${stigEnv.testCollection.revisionStr}/ccis`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
            expect(res.body).to.be.lengthOf(85)
        })
    })
    describe('GET - getGroupsByRevision - /stigs/{benchmarkId}/revisions{revisionStr}/groups', () => {

        it('Return the list of groups for the specified revision of a STIG.', async () => {
            const res = await chai.request(config.baseUrl)
            .get(`/stigs/${stigEnv.testCollection.benchmark}/revisions/${stigEnv.testCollection.revisionStr}/groups?projection=rules`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
            expect(res.body).to.be.lengthOf(81)
            for(let group of res.body){
                expect(group).to.have.property('groupId')
                expect(group.rules).to.be.an('array')
            }
        })
    })
    describe('GET - getGroupByRevision - /stigs/{benchmarkId}/revisions{revisionStr}/groups/{groupId}', () => {

        it('Return the rules, checks and fixes for a Group from a specified revision of a STIG.', async () => {
            const res = await chai.request(config.baseUrl)
            .get(`/stigs/${stigEnv.testCollection.benchmark}/revisions/${stigEnv.testCollection.revisionStr}/groups/${stigEnv.testCollection.groupId}?projection=rules`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('groupId')
            expect(res.body.groupId).to.be.equal(stigEnv.testCollection.groupId)
            expect(res.body).to.have.property('rules')
            expect(res.body.rules).to.be.an('array')
        })
    }) 
    describe('GET - getRulesByRevision - /stigs/{benchmarkId}/revisions/{revisionStr}/rules', () => {
        it("Return rule data for the LATEST revision of a STIG", async () => {
            const res = await chai.request(config.baseUrl)
            .get(`/stigs/${stigEnv.testCollection.benchmark}/revisions/${'latest'}/rules?projection=detail&projection=ccis&projection=check&projection=fix`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
            expect(res.body).to.be.lengthOf(81)
            expect(res.body[0]).to.have.property('detail')
            expect(res.body[0]).to.have.property('ccis')
            expect(res.body[0]).to.have.property('check')
            expect(res.body[0]).to.have.property('fix')
        })
        it("Return rule data for the specified revision of a STIG.", async () => {
            const res = await chai.request(config.baseUrl)
            .get(`/stigs/${stigEnv.testCollection.benchmark}/revisions/${stigEnv.testCollection.revisionStr}/rules?projection=detail&projection=ccis&projection=check&projection=fix`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
            expect(res.body).to.be.lengthOf(81)
            expect(res.body[0]).to.have.property('detail')
            expect(res.body[0]).to.have.property('ccis')
            expect(res.body[0]).to.have.property('check')
            expect(res.body[0]).to.have.property('fix')
        })
    }) 
    describe('GET - getRuleByRevision - /stigs/{benchmarkId}/revisions/{revisionStr}/rules/{ruleId}', () => {
        it("Return rule data for the specified revision of a STIG.", async () => {
            const res = await chai.request(config.baseUrl)
            .get(`/stigs/${stigEnv.testCollection.benchmark}/revisions/${stigEnv.testCollection.revisionStr}/rules/${stigEnv.testCollection.ruleId}?projection=detail&projection=ccis&projection=check&projection=fix`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('detail')
            expect(res.body).to.have.property('ccis')
            expect(res.body).to.have.property('check')
            expect(res.body).to.have.property('fix')
            expect(res.body.ruleId).to.be.equal(stigEnv.testCollection.ruleId)
        })
    })
})

