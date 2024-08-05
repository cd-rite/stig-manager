const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const path = require('path')
const fs = require('fs')
const users = require('../../iterations.json')

const metricsFilePath = path.join(__dirname, 'metricsGet.json');
let metricsData = JSON.parse(fs.readFileSync(metricsFilePath, 'utf8'));



async function storeResponseData(testCaseName, username, responseData) {
    if (!metricsData[testCaseName]) {
      metricsData[testCaseName] = {};
    }
    metricsData[testCaseName][username] = responseData;
    fs.writeFileSync(metricsFilePath, JSON.stringify(metricsData, null, 2), 'utf8');

}
function loadExpectedData(testName) {
    const filePath = path.join(__dirname, 'metricsGet.json');
    const allExpectedData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return allExpectedData[testName];
}


// only get stigmanadmin and lvl1 user 

const newUsers = [ {
    "name": "stigmanadmin",
    "grant": "Owner",
    "userId": "1",
    "token":
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ2ODEwMzUsImlhdCI6MTY3MDU0MDIzNiwiYXV0aF90aW1lIjoxNjcwNTQwMjM1LCJqdGkiOiI0N2Y5YWE3ZC1iYWM0LTQwOTgtOWJlOC1hY2U3NTUxM2FhN2YiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJiN2M3OGE2Mi1iODRmLTQ1NzgtYTk4My0yZWJjNjZmZDllZmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjMzNzhkYWZmLTA0MDQtNDNiMy1iNGFiLWVlMzFmZjczNDBhYyIsInNlc3Npb25fc3RhdGUiOiI4NzM2NWIzMy0yYzc2LTRiM2MtODQ4NS1mYmE1ZGJmZjRiOWYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImNyZWF0ZV9jb2xsZWN0aW9uIiwiZGVmYXVsdC1yb2xlcy1zdGlnbWFuIiwiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb24gc3RpZy1tYW5hZ2VyOnN0aWc6cmVhZCBzdGlnLW1hbmFnZXI6dXNlcjpyZWFkIHN0aWctbWFuYWdlcjpvcCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbjpyZWFkIHN0aWctbWFuYWdlcjpvcDpyZWFkIHN0aWctbWFuYWdlcjp1c2VyIHN0aWctbWFuYWdlciBzdGlnLW1hbmFnZXI6c3RpZyIsInNpZCI6Ijg3MzY1YjMzLTJjNzYtNGIzYy04NDg1LWZiYTVkYmZmNGI5ZiIsIm5hbWUiOiJTVElHTUFOIEFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3RpZ21hbmFkbWluIiwiZ2l2ZW5fbmFtZSI6IlNUSUdNQU4iLCJmYW1pbHlfbmFtZSI6IkFkbWluIn0.a1XwJZw_FIzwMXKo-Dr-n11me5ut-SF9ni7ylX-7t7AVrH1eAqyBxX9DXaxFK0xs6YOhoPsh9NyW8UFVaYgtF68Ps6yzoiqFEeiRXkpN5ygICN3H3z6r-YwanLlEeaYR3P2EtHRcrBtCnt0VEKKbGPWOfeiNCVe3etlp9-NQo44"
  },
  {
    "name": "lvl1",
    "grant": "Restricted",
    "userId": "85",
    "token":
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ3MDg5ODQsImlhdCI6MTY3MDU2ODE4NCwiYXV0aF90aW1lIjoxNjcwNTY4MTg0LCJqdGkiOiIxMDhmMDc2MC0wYmY5LTRkZjEtYjE0My05NjgzNmJmYmMzNjMiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJlM2FlMjdiOC1kYTIwLTRjNDItOWRmOC02MDg5ZjcwZjc2M2IiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjE0ZmE5ZDdkLTBmZTAtNDQyNi04ZmQ5LTY5ZDc0YTZmMzQ2NCIsInNlc3Npb25fc3RhdGUiOiJiNGEzYWNmMS05ZGM3LTQ1ZTEtOThmOC1kMzUzNjJhZWM0YzciLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtc3RpZ21hbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InJlYWxtLW1hbmFnZW1lbnQiOnsicm9sZXMiOlsidmlldy11c2VycyIsInF1ZXJ5LWdyb3VwcyIsInF1ZXJ5LXVzZXJzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbiBzdGlnLW1hbmFnZXI6c3RpZzpyZWFkIHN0aWctbWFuYWdlcjp1c2VyOnJlYWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb246cmVhZCIsInNpZCI6ImI0YTNhY2YxLTlkYzctNDVlMS05OGY4LWQzNTM2MmFlYzRjNyIsIm5hbWUiOiJyZXN0cmljdGVkIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibHZsMSIsImdpdmVuX25hbWUiOiJyZXN0cmljdGVkIn0.OqLARi5ILt3j2rMikXy0ECTTqjWco0-CrMwzE88gUv2i8rVO9kMgVsXbtPk2L2c9NNNujnxqg7QIr2_sqA51saTrZHvzXcsT8lBruf74OubRMwcTQqJap-COmrzb60S7512k0WfKTYlHsoCn_uAzOb9sp8Trjr0NksU8OXCElDU"
  },]

describe('GET - Metrics', function () { 
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const user of newUsers){
    describe(`user:${user.name}`, function () {

        describe('GET - getMetricsDetailByCollection - /collections/{collectionId}/metrics/detail', function () {
            let metricsReferenceCommon

            beforeEach(async function () {
                metricsReferenceCommon = {
                    assessed: 6,
                    assessments: environment.metrics.checklistLength,
                    maxTs: "2022-02-03T00:07:05Z",
                    minTs: "2020-08-11T22:27:26Z",
                    results: {
                        fail: {
                            total: 3,
                            resultEngine: 0
                        },
                        pass: {
                            total: 2,
                            resultEngine: 0
                        },
                        error: {
                            total: 0,
                            resultEngine: 0
                        },
                        fixed: {
                            total: 0,
                            resul0tEngine: 0
                        },
                        unknown: {
                            total: 0,
                            resultEngine: 0
                        },
                        notchecked: {
                            total: 0,
                            resultEngine: 0
                        },
                        notselected: {
                            total: 0,
                            resultEngine: 0
                        },
                        informational: {
                            total: 0,
                            resultEngine: 0
                        },
                        notapplicable: {
                            total: 1,
                            resultEngine: 0
                        }
                    },
                    findings: {
                        low: 1,
                        medium: 2,
                        high: 0
                    },    
                    statuses: {
                        saved: {
                            total: 1,
                            resultEngine: 0
                        },
                        accepted: {
                            total: 0,
                            resultEngine: 0
                        },
                        rejected: {
                            total: 0,
                            resultEngine: 0
                        },
                        submitted: {
                            total: 5,
                            resultEngine: 0
                        }
                    }	 
                }
                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }
            })
        

            it('Return detailed metrics for the specified Collection no param', async function () {
            const res = await chai.request(config.baseUrl)
                .get(`/collections/${environment.testCollection.collectionId}/metrics/detail`)
                .set('Authorization', `Bearer ${user.token}`)

                await storeResponseData(this.test.title, user.name, res.body)
            expect(res).to.have.status(200)

            for(const item of res.body){
                let assetMatchString = "asset"
                const regex = new RegExp(assetMatchString)
                expect(item.name).to.match(regex)

                if(item.assetId === environment.testAsset.assetId && item.benchmarkId === environment.metrics.benchmark){
                    expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                    expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                    expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                    expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                    expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                    expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                    expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                    expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                    expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                    expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                    expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                    expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                    expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                    expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                    expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                    expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                    expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                    expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                    expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)

                    

                }
            }
            })
            it('Return detailed metrics for the specified Collection - with params', async function () {
                const res = await chai.request(config.baseUrl)
                .get(`/collections/${environment.testCollection.collectionId}/metrics/detail?benchmarkId=${environment.metrics.benchmark}&assetId=${environment.testAsset.assetId}&labelName=${environment.testCollection.testLabelName}`)
                .set('Authorization', `Bearer ${user.token}`)

                await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
        
                for(const item of res.body){
                    let assetMatchString = "asset"
                    const regex = new RegExp(assetMatchString)
                    expect(item.name).to.match(regex)

                    expect(item.assetId).to.equal(environment.testAsset.assetId)
                    expect(item.benchmarkId).to.equal(environment.metrics.benchmark)
                    expect(environment.testCollection.testLabelName).to.be.oneOf(item.labels.map(label => label.name))

                    expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                    expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                    expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                    expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                    expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                    expect(item.metrics.assessments).to.equal(environment.metrics.checklistLength)
                    expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                   
                }
            })
        })

        describe('GET - getMetricsDetailByCollectionAggAsset - /collections/{collectionId}/metrics/detail/asset', function () {


            let metricsReferenceCommon

            beforeEach(async function () {
                metricsReferenceCommon = {
                    assessed: 9,
                    assessments: 368,
                    maxTs: "2022-02-03T00:07:05Z",
                    minTs: "2020-08-11T22:27:26Z",
                    results: {
                        fail: {
                            total: 4,
                            resultEngine: 0
                        },
                        pass: {
                            total: 4,
                            resultEngine: 0
                        },
                        error: {
                            total: 0,
                            resultEngine: 0
                        },
                        fixed: {
                            total: 0,
                            resultEngine: 0
                        },
                        unknown: {
                            total: 0,
                            resultEngine: 0
                        },
                        notchecked: {
                            total: 0,
                            resultEngine: 0
                        },
                        notselected: {
                            total: 0,
                            resultEngine: 0
                        },
                        informational: {
                            total: 0,
                            resultEngine: 0
                        },
                        notapplicable: {
                            total: 1,
                            resultEngine: 0
                        }
                    },
                    findings: {
                        low: 1,
                        medium: 3,
                        high: 0
                    },    
                    statuses: {
                        saved: {
                            total: 2,
                            resultEngine: 0
                        },
                        accepted: {
                            total: 0,
                            resultEngine: 0
                        },
                        rejected: {
                            total: 0,
                            resultEngine: 0
                        },
                        submitted: {
                            total: 7,
                            resultEngine: 0
                        }
                    }	 
                }
                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }
            })
        
            it('Return detail metrics - assset agg', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/asset`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
             
                for(item of res.body){  
                    if(item.assetId === environment.testAsset.assetId){
                        let assetMatchString = "asset"
                        const regex = new RegExp(assetMatchString)
                        expect(item.name).to.match(regex)
                        expect(item.assetId).to.equal(environment.testAsset.assetId)
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                        expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                        expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                        expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                        expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                        expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                }
                }
            })
            it('Return detail metrics - asset agg - with param assetId', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/asset?assetId=${environment.testAsset.assetId}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
               
                for(item of res.body){  
                    if(item.assetId === environment.testAsset.assetId){
                        let assetMatchString = "asset"
                        const regex = new RegExp(assetMatchString)
                        expect(item.name).to.match(regex)
                        expect(item.assetId).to.equal(environment.testAsset.assetId)
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                        expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                        expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                        expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                        expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                        expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                }
                }
            })
            it('Return detail metrics - asset agg - with params', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/asset?benchmarkId=${environment.metrics.benchmark}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
              
                metricsReferenceCommon.assessments = 81
                metricsReferenceCommon.assessed = 6
                metricsReferenceCommon.results.fail.total = 3
                metricsReferenceCommon.results.pass.total = 2
                metricsReferenceCommon.statuses.saved.total = 1
                metricsReferenceCommon.statuses.submitted.total = 5
                metricsReferenceCommon.findings.medium = 2

                for(item of res.body){  
                    if(item.assetId === environment.testAsset.assetId){
                        let assetMatchString = "asset"
                        const regex = new RegExp(assetMatchString)
                        expect(item.name).to.match(regex)
                        expect(item.assetId).to.equal(environment.testAsset.assetId)
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                        expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                        expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                        expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                        expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                        expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                }
                }
            })
            it('Return detail metrics - asset agg - with params - all', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/asset?benchmarkId=${environment.metrics.benchmark}&assetId=${environment.testAsset.assetId}&labelId=${environment.testCollection.testLabel}&labelName=${environment.testCollection.testLabelName}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
              
                metricsReferenceCommon.assessments = 81
                metricsReferenceCommon.assessed = 6
                metricsReferenceCommon.results.fail.total = 3
                metricsReferenceCommon.results.pass.total = 2
                metricsReferenceCommon.statuses.saved.total = 1
                metricsReferenceCommon.statuses.submitted.total = 5
                metricsReferenceCommon.findings.medium = 2

                for(item of res.body){  
                    let assetMatchString = "asset"
                    const regex = new RegExp(assetMatchString)
                    expect(item.name).to.match(regex)
                    expect(item.assetId).to.equal(environment.testAsset.assetId)
                    expect(environment.testCollection.testLabelName).to.be.oneOf(item.labels.map(label => label.name))
                    expect(environment.metrics.benchmark).to.be.oneOf(item.benchmarkIds.map(b => b))
                    expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                    expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                    expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                    expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                    expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                    expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                    expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                    expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                    expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                    expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                    expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                    expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                    expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                    expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                    expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                    expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                    expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                    expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                    expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                }
            })
            it('Return detail metrics - asset agg - with param labelId', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/asset?labelId=${environment.testCollection.testLabel}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
              
                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }
                metricsReferenceCommon.assessments = 368
                metricsReferenceCommon.assessed = 9
                metricsReferenceCommon.results.fail.total = 4
                metricsReferenceCommon.results.pass.total = 4
                metricsReferenceCommon.statuses.saved.total = 2
                metricsReferenceCommon.statuses.submitted.total = 7
                metricsReferenceCommon.findings.medium = 3

                for(item of res.body){  
                    let assetMatchString = "asset"
                    const regex = new RegExp(assetMatchString)


                    if(item.assetId === environment.testAsset.assetId){
                        expect(environment.testCollection.testLabelName).to.be.oneOf(item.labels.map(label => label.name))
                        expect(item.assetId).to.equal(environment.testAsset.assetId)
                        expect(environment.metrics.benchmark).to.be.oneOf(item.benchmarkIds.map(b => b))
                        expect(item.name).to.match(regex)
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                        expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                        expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                        expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                        expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                        expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
            it('Return detail metrics - asset agg - with param labelName', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/asset?labelName=${environment.metrics.labelFull}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)

                
                metricsReferenceCommon.assessments = 368
                metricsReferenceCommon.assessed = 9
                metricsReferenceCommon.results.fail.total = 4
                metricsReferenceCommon.results.pass.total = 4
                metricsReferenceCommon.statuses.saved.total = 2
                metricsReferenceCommon.statuses.submitted.total = 7
                metricsReferenceCommon.findings.medium = 3

                for(item of res.body){  
                    let assetMatchString = "asset"
                    const regex = new RegExp(assetMatchString)


                    if(item.assetId === environment.testAsset.assetId){
                        expect(environment.testCollection.testLabelName).to.be.oneOf(item.labels.map(label => label.name))
                        expect(item.assetId).to.equal(environment.testAsset.assetId)
                        expect(environment.metrics.benchmark).to.be.oneOf(item.benchmarkIds.map(b => b))
                        expect(item.name).to.match(regex)
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                        expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                        expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                        expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                        expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                        expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
        })

        describe('GET - getMetricsDetailByCollectionAgg - /collections/{collectionId}/metrics/detail/collection', function () {

            let metricsReferenceCommon

            beforeEach(async function () {

                metricsReferenceCommon = {
                assets: 4,
                checklists: 6,
                assessed: 17,
                assessments: 1104,
                maxTs: "2022-02-03T00:07:05Z",
                minTs: "2020-08-11T22:27:26Z",
                results: {
                    fail: {
                        total: 8,
                        resultEngine: 0
                    },
                    pass: {
                        total: 5,
                        resultEngine: 0
                    },
                    error: {
                        total: 0,
                        resultEngine: 0
                    },
                    fixed: {
                        total: 0,
                        resultEngine: 0
                    },
                    unknown: {
                        total: 0,
                        resultEngine: 0
                    },
                    notchecked: {
                        total: 0,
                        resultEngine: 0
                    },
                    notselected: {
                        total: 0,
                        resultEngine: 0
                    },
                    informational: {
                        total: 0,
                        resultEngine: 0
                    },
                    notapplicable: {
                        total: 4,
                        resultEngine: 0
                    }
                },
                findings: {
                    low: 2,
                    medium: 6,
                    high: 0
                },    
                statuses: {
                    saved: {
                        total: 6,
                        resultEngine: 0
                    },
                    accepted: {
                        total: 0,
                        resultEngine: 0
                    },
                    rejected: {
                        total: 0,
                        resultEngine: 0
                    },
                    submitted: {
                        total: 11,
                        resultEngine: 0
                    }
                }	 
            }
            metricsReferenceCommon.results.unassessed = {
                total:  metricsReferenceCommon.results.informational.total + 
                        metricsReferenceCommon.results.notselected.total + 
                        metricsReferenceCommon.results.notchecked.total + 
                        metricsReferenceCommon.results.error.total + 
                        metricsReferenceCommon.results.fixed.total
            }
        
            })

            it('Return detail metrics - collection agg - no params', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/collection`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
               
                expect(res.body.assets).to.equal(environment.testCollection.assetIDsInCollection.length)
                expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
                expect(res.body.stigs).to.equal(environment.testCollection.validStigs.length)
                expect(res.body.checklists).to.eql(6)
                expect(res.body.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                expect(res.body.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                expect(res.body.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                expect(res.body.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                expect(res.body.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                expect(res.body.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                expect(res.body.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                expect(res.body.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                expect(res.body.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                expect(res.body.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                expect(res.body.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                expect(res.body.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                expect(res.body.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
            })
            it('Return detail metrics - collection agg - asset param', async function () {

                metricsReferenceCommon.assessed = 9
                metricsReferenceCommon.assessments = 368
                metricsReferenceCommon.results.fail.total = 4
                metricsReferenceCommon.results.pass.total = 4
                metricsReferenceCommon.results.notapplicable.total = 1
                metricsReferenceCommon.statuses.saved.total = 2
                metricsReferenceCommon.statuses.accepted.total = 0
                metricsReferenceCommon.statuses.rejected.total = 0
                metricsReferenceCommon.statuses.submitted.total = 7     
                metricsReferenceCommon.findings.low = 1
                metricsReferenceCommon.findings.high = 0
                metricsReferenceCommon.findings.medium = 3  

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/collection?assetId=${environment.testAsset.assetId}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
                expect(res.body.assets).to.equal(1)
                expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
                expect(res.body.stigs).to.equal(environment.testCollection.validStigs.length)
                expect(res.body.checklists).to.eql(2)
                expect(res.body.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                expect(res.body.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                expect(res.body.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                expect(res.body.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                expect(res.body.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                expect(res.body.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                expect(res.body.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                expect(res.body.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                expect(res.body.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                expect(res.body.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                expect(res.body.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                expect(res.body.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                expect(res.body.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
            })
            it('Return detail metrics - collection agg - labelId param', async function () {
                metricsReferenceCommon.assessed = 12
                metricsReferenceCommon.assessments = 736
                metricsReferenceCommon.results.fail.total = 5
                metricsReferenceCommon.results.pass.total = 4
                metricsReferenceCommon.results.notapplicable.total = 3
                metricsReferenceCommon.statuses.saved.total = 3
                metricsReferenceCommon.statuses.accepted.total = 0
                metricsReferenceCommon.statuses.rejected.total = 0
                metricsReferenceCommon.statuses.submitted.total = 9     
                metricsReferenceCommon.findings.low = 1
                metricsReferenceCommon.findings.high = 0
                metricsReferenceCommon.findings.medium = 4

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/collection?labelId=${environment.testCollection.testLabel}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
                expect(res.body.assets).to.equal(2)
                expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
                expect(res.body.stigs).to.equal(environment.testCollection.validStigs.length)
                expect(res.body.checklists).to.eql(4)
                expect(res.body.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                expect(res.body.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                expect(res.body.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                expect(res.body.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                expect(res.body.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                expect(res.body.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                expect(res.body.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                expect(res.body.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                expect(res.body.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                expect(res.body.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                expect(res.body.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                expect(res.body.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                expect(res.body.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
            })
            it('Return detail metrics - collection agg - label name param', async function () {
                metricsReferenceCommon.assessed = 12
                metricsReferenceCommon.assessments = 736
                metricsReferenceCommon.results.fail.total = 5
                metricsReferenceCommon.results.pass.total = 4
                metricsReferenceCommon.results.notapplicable.total = 3
                metricsReferenceCommon.statuses.saved.total = 3
                metricsReferenceCommon.statuses.accepted.total = 0
                metricsReferenceCommon.statuses.rejected.total = 0
                metricsReferenceCommon.statuses.submitted.total = 9     
                metricsReferenceCommon.findings.low = 1
                metricsReferenceCommon.findings.high = 0
                metricsReferenceCommon.findings.medium = 4

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/collection?labelName=${environment.metrics.labelFull}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
                expect(res.body.assets).to.equal(2)
                expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
                expect(res.body.stigs).to.equal(environment.testCollection.validStigs.length)
                expect(res.body.checklists).to.eql(4)
                expect(res.body.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                expect(res.body.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                expect(res.body.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                expect(res.body.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                expect(res.body.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                expect(res.body.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                expect(res.body.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                expect(res.body.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                expect(res.body.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                expect(res.body.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                expect(res.body.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                expect(res.body.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                expect(res.body.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
            })
            it('Return detail metrics - collection agg - benchmarkId param', async function () {
            
                metricsReferenceCommon.assessments = 243
                metricsReferenceCommon.assessed = 14
                metricsReferenceCommon.results.fail.total = 7
                metricsReferenceCommon.results.pass.total = 3
                metricsReferenceCommon.statuses.saved.total = 5
                metricsReferenceCommon.statuses.submitted.total = 9
                metricsReferenceCommon.findings.medium = 5      

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/collection?benchmarkId=${environment.metrics.benchmark}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
                expect(res.body.assets).to.equal(3)
                expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
                expect(res.body.stigs).to.equal(1)
                expect(res.body.checklists).to.eql(3)
                expect(res.body.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                expect(res.body.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                expect(res.body.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                expect(res.body.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                expect(res.body.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                expect(res.body.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                expect(res.body.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                expect(res.body.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                expect(res.body.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                expect(res.body.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                expect(res.body.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                expect(res.body.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                expect(res.body.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
            })
        })

        describe('GET - getMetricsDetailByCollectionAggLabel - /collections/{collectionId}/metrics/detail/label', function () {

            let metricsReferenceCommon
            let checklistLength = environment.metrics.checklistLength
            let testTotalAssessmentsForTestAsset = 368
            let testTotalAssessmentsForTestLabel = 736

            beforeEach(async function () {
                metricsReferenceCommon = {
                    assets: 2,
                    assessed: 12,
                    assessments: testTotalAssessmentsForTestLabel,
                    maxTs: "2022-02-03T00:07:05Z",
                    minTs: "2020-08-11T22:27:26Z",
                    results: {
                        fail: {
                            total: 5,
                            resultEngine: 0
                        },
                        pass: {
                            total: 4,
                            resultEngine: 0
                        },
                        error: {
                            total: 0,
                            resultEngine: 0
                        },
                        fixed: {
                            total: 0,
                            resultEngine: 0
                        },
                        unknown: {
                            total: 0,
                            resultEngine: 0
                        },
                        notchecked: {
                            total: 0,
                            resultEngine: 0
                        },
                        notselected: {
                            total: 0,
                            resultEngine: 0
                        },
                        informational: {
                            total: 0,
                            resultEngine: 0
                        },
                        notapplicable: {
                            total: 3,
                            resultEngine: 0
                        }
                    },
                    findings: {
                        low: 1,
                        medium: 4,
                        high: 0
                    },    
                    statuses: {
                        saved: {
                            total: 3,
                            resultEngine: 0
                        },
                        accepted: {
                            total: 0,
                            resultEngine: 0
                        },
                        rejected: {
                            total: 0,
                            resultEngine: 0
                        },
                        submitted: {
                            total: 9,
                            resultEngine: 0
                        }
                    }	 
                }
            })

            it('Return detail metrics - label agg', async function () {

                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/label`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
                expect(res.body.length).to.eql(3)
                for (const item of res.body){
                    if(item.labelId === environment.testCollection.testLabel){
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                        expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                        expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                        expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                        expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                        expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
            it('Return detail metrics - label agg - param benchmark', async function () {

                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }
                metricsReferenceCommon.assessed = 9
                metricsReferenceCommon.results.fail.total = 4
                metricsReferenceCommon.results.pass.total = 2
                metricsReferenceCommon.statuses.saved.total = 2
                metricsReferenceCommon.statuses.submitted.total = 7   
                metricsReferenceCommon.findings.medium = 3
            
                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/label?benchmarkId=${environment.metrics.benchmark}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
               
                expect(res.body.length).to.eql(3)
                for (const item of res.body){
                    if(item.labelId === environment.testCollection.testLabel){
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                        expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                        expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                        expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                        expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                        expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        metricsReferenceCommon.assessments = environment.metrics.checklistLength * item.assets
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
            it('Return detail metrics - label agg - param assetId', async function () {

                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }
                metricsReferenceCommon.assessments = testTotalAssessmentsForTestAsset
                metricsReferenceCommon.assessed = 9
                metricsReferenceCommon.results.fail.total = 4
                metricsReferenceCommon.results.notapplicable.total = 1
                metricsReferenceCommon.statuses.saved.total = 2
                metricsReferenceCommon.statuses.submitted.total = 7
                metricsReferenceCommon.findings.medium = 3           
            
                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/label?assetId=${environment.testAsset.assetId}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
               
                expect(res.body.length).to.eql(2)
                for (const item of res.body){
                    if(item.labelId === environment.testCollection.testLabel){
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                        expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                        expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                        expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                        expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                        expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
            it('Return detail metrics - label agg - param labelId', async function () {

                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }
                metricsReferenceCommon.statuses.saved.total = 3

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/label?labelId=${environment.testCollection.testLabel}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
               
                expect(res.body.length).to.eql(1)
                for (const item of res.body){
                    if(item.labelId === environment.testCollection.testLabel){
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                        expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                        expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                        expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                        expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                        expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
            it('Return detail metrics - label agg - param labelName', async function () {

                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }
                metricsReferenceCommon.statuses.saved.total = 3

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/label?labelName=${environment.testCollection.testLabelName}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
             
                expect(res.body.length).to.eql(1)
                for (const item of res.body){
                    if(item.labelId === environment.testCollection.testLabel){
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                        expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                        expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                        expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                        expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                        expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
        })

        describe('GET - getMetricsDetailByCollectionAggStig - /collections/{collectionId}/metrics/detail/stig', function () {

            let metricsReferenceCommon
            let testChecklistLength = environment.metrics.checklistLength
            let testTotalAssessmentsForTestAsset = 368
            let testTotalAssessmentsForTestSTIG = testChecklistLength * 3

            beforeEach(async function () {
                metricsReferenceCommon =  {
                    assets: 3,
                    assessed: 14,
                    assessments: testTotalAssessmentsForTestSTIG,
                    maxTs: "2022-02-03T00:07:05Z",
                    minTs: "2020-08-11T22:27:26Z",
                    results: {
                        fail: {
                            total: 7,
                            resultEngine: 0
                        },
                        pass: {
                            total: 3,
                            resultEngine: 0
                        },
                        error: {
                            total: 0,
                            resultEngine: 0
                        },
                        fixed: {
                            total: 0,
                            resultEngine: 0
                        },
                        unknown: {
                            total: 0,
                            resultEngine: 0
                        },
                        notchecked: {
                            total: 0,
                            resultEngine: 0
                        },
                        notselected: {
                            total: 0,
                            resultEngine: 0
                        },
                        informational: {
                            total: 0,
                            resultEngine: 0
                        },
                        notapplicable: {
                            total: 4,
                            resultEngine: 0
                        }
                    },
                    findings: {
                        low: 2,
                        medium: 5,
                        high: 0
                    },    
                    statuses: {
                        saved: {
                            total: 5,
                            resultEngine: 0
                        },
                        accepted: {
                            total: 0,
                            resultEngine: 0
                        },
                        rejected: {
                            total: 0,
                            resultEngine: 0
                        },
                        submitted: {
                            total: 9,
                            resultEngine: 0
                        }
                    }	 
                }
            
            })

            it('Return detail metrics - stig agg', async function () {

                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/stig`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
             
                for(const item of res.body){
                    if(item.benchmarkId == environment.testCollection.benchmark){
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                        expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                        expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                        expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                        expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                        expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
            it('Return detail metrics - stig agg - param benchmark', async function () {

                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/stig?benchmarkId=${environment.metrics.benchmark}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
               
                expect(res.body.length).to.eql(1)
            
                for(const item of res.body){
                    expect(item.benchmarkId).to.eql(environment.metrics.benchmark)  
                    expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                    expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                    expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                    expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                    expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                    expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                    expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                    expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                    expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                    expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                    expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                    expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                    expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                    expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                    expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                    expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                    expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                    expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                    expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                }
            })
            it('Return detail metrics - stig agg - param asset', async function () {

                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }

                metricsReferenceCommon.assessed = 6
                metricsReferenceCommon.assessments = testChecklistLength
                metricsReferenceCommon.results.fail.total = 3
                metricsReferenceCommon.results.pass.total = 2
                metricsReferenceCommon.results.notapplicable.total = 1
                metricsReferenceCommon.statuses.saved.total = 1
                metricsReferenceCommon.statuses.accepted.total = 0
                metricsReferenceCommon.statuses.rejected.total = 0
                metricsReferenceCommon.statuses.submitted.total = 5     
                metricsReferenceCommon.findings.low = 1
                metricsReferenceCommon.findings.high = 0
                metricsReferenceCommon.findings.medium = 2     
        

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/stig?assetId=${environment.testAsset.assetId}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
               
                expect(res.body.length).to.eql(2)

                for(const item of res.body){
                    if(item.benchmarkId == environment.testCollection.benchmark){
                        expect(item.benchmarkId).to.eql(environment.metrics.benchmark)  
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                        expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                        expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                        expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                        expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                        expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
            it('Return detail metrics - stig agg - param labelId', async function () {

                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }

                metricsReferenceCommon.assessed = 9
                metricsReferenceCommon.results.fail.total = 4
                metricsReferenceCommon.results.pass.total = 2
                metricsReferenceCommon.results.notapplicable.total = 3
                metricsReferenceCommon.statuses.saved.total = 2
                metricsReferenceCommon.statuses.accepted.total = 0
                metricsReferenceCommon.statuses.rejected.total = 0
                metricsReferenceCommon.statuses.submitted.total = 7
                metricsReferenceCommon.findings.low = 1
                metricsReferenceCommon.findings.high = 0
                metricsReferenceCommon.findings.medium = 3 

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/stig?labelId=${environment.testCollection.testLabel}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
               
                expect(res.body.length).to.eql(2)

                for(const item of res.body){
                    if(item.benchmarkId == environment.testCollection.benchmark){
                        metricsReferenceCommon.assessments = testChecklistLength * item.assets
                        expect(item.assets).to.equal(2)
                        expect(item.benchmarkId).to.be.oneOf(environment.testCollection.validStigs)
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                        expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                        expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                        expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                        expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                        expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
            it('Return detail metrics - stig agg - param labelName', async function () {

                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }
                metricsReferenceCommon.assessed = 6
                metricsReferenceCommon.results.fail.total = 3
                metricsReferenceCommon.results.pass.total = 2
                metricsReferenceCommon.results.notapplicable.total = 1
                metricsReferenceCommon.statuses.saved.total = 1
                metricsReferenceCommon.statuses.accepted.total = 0
                metricsReferenceCommon.statuses.rejected.total = 0
                metricsReferenceCommon.statuses.submitted.total = 5
                metricsReferenceCommon.findings.low = 1
                metricsReferenceCommon.findings.high = 0
                metricsReferenceCommon.findings.medium = 2


                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/stig?labelName=${environment.testCollection.testLabelName}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
                
                expect(res.body.length).to.eql(2)

                for(const item of res.body){
                    if(item.benchmarkId == environment.testCollection.benchmark){
                        metricsReferenceCommon.assessments = testChecklistLength * item.assets
                        expect(item.assets).to.equal(1)
                        expect(item.benchmarkId).to.be.eql(environment.metrics.benchmark)
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
                        expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
                        expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
                        expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
                        expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
                        expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
        })


        //summary
        describe('GET - getMetricsSummaryByCollection - /collections/{collectionId}/metrics/summary', function () {

            let metricsReferenceCommon 

            beforeEach(async function () {
                metricsReferenceCommon = {
                    assessed: 6,
                    assessments: environment.metrics.checklistLength,
                    maxTs: "2022-02-03T00:07:05Z",
                    minTs: "2020-08-11T22:27:26Z",
                    results: {
                        fail: {
                            total: 3,
                            resultEngine: 0
                        },
                        pass: {
                            total: 2,
                            resultEngine: 0
                        },
                        error: {
                            total: 0,
                            resultEngine: 0
                        },
                        fixed: {
                            total: 0,
                            resultEngine: 0
                        },
                        unknown: {
                            total: 0,
                            resultEngine: 0
                        },
                        notchecked: {
                            total: 0,
                            resultEngine: 0
                        },
                        notselected: {
                            total: 0,
                            resultEngine: 0
                        },
                        informational: {
                            total: 0,
                            resultEngine: 0
                        },
                        notapplicable: {
                            total: 1,
                            resultEngine: 0
                        }
                    },
                    findings: {
                        low: 1,
                        medium: 2,
                        high: 0
                    },    
                    statuses: {
                        saved: {
                            total: 1,
                            resultEngine: 0
                        },
                        accepted: {
                            total: 0,
                            resultEngine: 0
                        },
                        rejected: {
                            total: 0,
                            resultEngine: 0
                        },
                        submitted: {
                            total: 5,
                            resultEngine: 0
                        }
                    }	 
                }
            })


            it('Return summary metrics for the Collection - no agg - no params', async function () {
                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }
            const res = await chai.request(config.baseUrl)
                .get(`/collections/${environment.testCollection.collectionId}/metrics/summary`)
                .set('Authorization', `Bearer ${user.token}`)
                await storeResponseData(this.test.title, user.name, res.body)
            expect(res).to.have.status(200)
         

            for(const item of res.body){
                let assetMatchString = "asset"
                const regex = new RegExp(assetMatchString)
                expect(item.name).to.match(regex)
                
                if(item.assetId === environment.testAsset.assetId && item.benchmarkId === environment.metrics.benchmark){
                    let regex = new RegExp("asset")
                    expect(item.name).to.match(regex)
                    expect(item.metrics.findings.low).to.equal(1)
                    expect(item.metrics.results.notapplicable).to.equal(1)
                    expect(item.metrics.results.pass).to.equal(2)
                    expect(item.metrics.results.fail).to.equal(3)
                    expect(item.metrics.statuses.submitted).to.equal(5)
                    expect(item.metrics.assessments).to.equal(environment.metrics.checklistLength)
                    expect(item.metrics.assessed).to.equal(6)
                }
            }
            })
            it('Return summary metrics for the Collection - benchmark param - no agg', async function () {
                const res = await chai.request(config.baseUrl)
                .get(`/collections/${environment.testCollection.collectionId}/metrics/summary?benchmarkId=${environment.metrics.benchmark}`)
                .set('Authorization', `Bearer ${user.token}`)
                await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
             
                for(const item of res.body){
                    let assetMatchString = "asset"
                    const regex = new RegExp(assetMatchString)
                    expect(item.name).to.match(regex)
                    if(item.assetId === environment.testAsset.assetId){
                        expect(item.benchmarkId).to.eql(environment.metrics.benchmark)
                        expect(item.assetId).to.equal(environment.testAsset.assetId)
                        expect(item.benchmarkId).to.equal(environment.metrics.benchmark)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.assessments).to.equal(environment.metrics.checklistLength)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
            it('Return summary metrics for the Collection - asset param - no agg', async function () {
            const res = await chai.request(config.baseUrl)
                .get(`/collections/${environment.testCollection.collectionId}/metrics/summary?assetId=${environment.testAsset.assetId}`)
                .set('Authorization', `Bearer ${user.token}`)
                await storeResponseData(this.test.title, user.name, res.body)
            expect(res).to.have.status(200)
        
            for(const item of res.body){
                let assetMatchString = "asset"
                const regex = new RegExp(assetMatchString)
                expect(item.name).to.match(regex)
                if(item.benchmarkId === environment.metrics.benchmark){
                    expect(item.assetId).to.eql(environment.testAsset.assetId)
                    expect(item.benchmarkId).to.equal(environment.metrics.benchmark)
                    expect(environment.testCollection.testLabelName).to.be.oneOf(item.labels.map(label => label.name))
                    expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                    expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                    expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                    expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                    expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                    expect(item.metrics.assessments).to.equal(environment.metrics.checklistLength)
                    expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                }
            }
            })
            it('Return summary metrics for the Collection - labelId param - no agg', async function () {
            const res = await chai.request(config.baseUrl)
                .get(`/collections/${environment.testCollection.collectionId}/metrics/summary?labelId=${environment.testCollection.testLabel}`)
                .set('Authorization', `Bearer ${user.token}`)
                await storeResponseData(this.test.title, user.name, res.body)
            expect(res).to.have.status(200)
           
            for(const item of res.body){
                let assetMatchString = "asset"
                const regex = new RegExp(assetMatchString)
                expect(item.name).to.match(regex)
                if(item.benchmarkId === environment.metrics.benchmark && item.assetId === environment.testAsset.assetId){
                    expect(item.benchmarkId).to.equal(environment.metrics.benchmark)
                    expect(environment.testCollection.testLabelName).to.be.oneOf(item.labels.map(label => label.name))
                    expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                    expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                    expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                    expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                    expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                    expect(item.metrics.assessments).to.equal(environment.metrics.checklistLength)
                    expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                }
            }
            })
            it('Return summary metrics for the Collection - labelName param - no agg', async function () {
            const res = await chai.request(config.baseUrl)
                .get(`/collections/${environment.testCollection.collectionId}/metrics/summary?labelName=${environment.testCollection.testLabelName}`)
                .set('Authorization', `Bearer ${user.token}`)
                await storeResponseData(this.test.title, user.name, res.body)
            expect(res).to.have.status(200)
        
            for(const item of res.body){
                let assetMatchString = "asset"
                const regex = new RegExp(assetMatchString)
                expect(item.name).to.match(regex)
                if(item.benchmarkId === environment.metrics.benchmark && item.assetId === environment.testAsset.assetId){
                    expect(item.benchmarkId).to.equal(environment.metrics.benchmark)
                    expect(environment.testCollection.testLabelName).to.be.oneOf(item.labels.map(label => label.name))
                    expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                    expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                    expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                    expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                    expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                    expect(item.metrics.assessments).to.equal(environment.metrics.checklistLength)
                    expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                }
            }
            })
        })

        describe('GET - getMetricsSummaryByCollectionAggAsset - /collections/{collectionId}/metrics/summary/asset', function () {

            let metricsReferenceCommon

            let testChecklistLength = environment.metrics.checklistLength
            let testTotalAssessmentsForTestAsset = 368

            beforeEach(async function () {
                metricsReferenceCommon ={
                    assessed: 9,
                    assessments: testChecklistLength,
                    maxTs: "2022-02-03T00:07:05Z",
                    minTs: "2020-08-11T22:27:26Z",
                    results: {
                        fail: {
                            total: 4,
                            resultEngine: 0
                        },
                        pass: {
                            total: 4,
                            resultEngine: 0
                        },
                        error: {
                            total: 0,
                            resultEngine: 0
                        },
                        fixed: {
                            total: 0,
                            resultEngine: 0
                        },
                        unknown: {
                            total: 0,
                            resultEngine: 0
                        },
                        notchecked: {
                            total: 0,
                            resultEngine: 0
                        },
                        notselected: {
                            total: 0,
                            resultEngine: 0
                        },
                        informational: {
                            total: 0,
                            resultEngine: 0
                        },
                        notapplicable: {
                            total: 1,
                            resultEngine: 0
                        }
                    },
                    findings: {
                        low: 1,
                        medium: 3,
                        high: 0
                    },    
                    statuses: {
                        saved: {
                            total: 2,
                            resultEngine: 0
                        },
                        accepted: {
                            total: 0,
                            resultEngine: 0
                        },
                        rejected: {
                            total: 0,
                            resultEngine: 0
                        },
                        submitted: {
                            total: 7,
                            resultEngine: 0
                        }
                    }	 
                }
            })

            it('Return summary metrics asset agg - summary', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/asset`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
                
                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }
            
                metricsReferenceCommon.assessments = testTotalAssessmentsForTestAsset    
                for(item of res.body){  
                    if(item.assetId === environment.testAsset.assetId){
                        let assetMatchString = "asset"
                        const regex = new RegExp(assetMatchString)
                        expect(item.name).to.match(regex)
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                        expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                }
                }
            })
            it('Return summary metrics - asset agg - with param assetId', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/asset?assetId=${environment.testAsset.assetId}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
              
                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }
                metricsReferenceCommon.assessments = testTotalAssessmentsForTestAsset    

                for(item of res.body){  
                    if(item.assetId === environment.testAsset.assetId){
                        let assetMatchString = "asset"
                        const regex = new RegExp(assetMatchString)
                        expect(item.name).to.match(regex)
                        expect(item.assetId).to.equal(environment.testAsset.assetId)
                        expect(item.name).to.match(regex)
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                        expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                }
                }
            })
            it('Return summary metrics - asset agg - with benchmarkID', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/asset?benchmarkId=${environment.metrics.benchmark}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
               
                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }
                metricsReferenceCommon.assessed = 6
                metricsReferenceCommon.results.fail.total = 3
                metricsReferenceCommon.results.pass.total = 2
                metricsReferenceCommon.statuses.saved.total = 1
                metricsReferenceCommon.statuses.submitted.total = 5
                metricsReferenceCommon.findings.medium = 2
                
                for(item of res.body){  
                    if(item.assetId === environment.testAsset.assetId){
                        let assetMatchString = "asset"
                        const regex = new RegExp(assetMatchString)
                        expect(item.name).to.match(regex)
                        expect(item.benchmarkIds[0]).to.equal(environment.metrics.benchmark)
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                        expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                }
                }
            })
        
            it('Return summary metrics - asset agg - with param labelId', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/asset?labelId=${environment.testCollection.testLabel}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
               
                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }
                metricsReferenceCommon.assessments = 368
                metricsReferenceCommon.assessed = 9
                metricsReferenceCommon.results.fail.total = 4
                metricsReferenceCommon.results.pass.total = 4
                metricsReferenceCommon.statuses.saved.total = 2
                metricsReferenceCommon.statuses.submitted.total = 7
                metricsReferenceCommon.findings.medium = 3

                for(item of res.body){  
                    let assetMatchString = "asset"
                    const regex = new RegExp(assetMatchString)
                    expect(item.name).to.match(regex)
                    if(item.assetId === environment.testAsset.assetId){
                        expect(environment.testCollection.testLabelName).to.be.oneOf(item.labels.map(label => label.name))
                        expect(item.assetId).to.equal(environment.testAsset.assetId)
                        expect(environment.metrics.benchmark).to.be.oneOf(item.benchmarkIds.map(b => b))
                        expect(item.benchmarkIds[0]).to.equal(environment.metrics.benchmark)
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                        expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
            it('Return summary metrics - asset agg - with param labelName', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/asset?labelName=${environment.metrics.labelFull}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
              
                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }
                metricsReferenceCommon.assessments = 368
                metricsReferenceCommon.assessed = 9
                metricsReferenceCommon.results.fail.total = 4
                metricsReferenceCommon.results.pass.total = 4
                metricsReferenceCommon.statuses.saved.total = 2
                metricsReferenceCommon.statuses.submitted.total = 7
                metricsReferenceCommon.findings.medium = 3

                for(item of res.body){  
                    for(item of res.body){  
                        let assetMatchString = "asset"
                        const regex = new RegExp(assetMatchString)
                        expect(item.name).to.match(regex)
                        if(item.assetId === environment.testAsset.assetId){
                            expect(environment.testCollection.testLabelName).to.be.oneOf(item.labels.map(label => label.name))
                            expect(item.assetId).to.equal(environment.testAsset.assetId)
                            expect(environment.metrics.benchmark).to.be.oneOf(item.benchmarkIds.map(b => b))
                            expect(item.benchmarkIds[0]).to.equal(environment.metrics.benchmark)
                            expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                            expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                            expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                            expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                            expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                            expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                            expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                            expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                            expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                            expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                            expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                            expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                            expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                            expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                            expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                        }
                    }
                }
            })
        })

        describe('GET - getMetricsSummaryByCollectionAgg - /collections/{collectionId}/metrics/summary/collection', function () {

            let metricsReferenceCommon
            let testChecklistLength =environment.metrics.checklistLength
            let testTotalAssessmentsForTestAsset = 368
            let testTotalAssessmentsForCollection = 1104

            beforeEach(async function () {

                metricsReferenceCommon = {
                    assets: 4,
                    checklists: 6,
                    assessed: 17,
                    assessments: testTotalAssessmentsForCollection,
                    maxTs: "2022-02-03T00:07:05Z",
                    minTs: "2020-08-11T22:27:26Z",
                    results: {
                        fail: {
                            total: 8,
                            resultEngine: 0
                        },
                        pass: {
                            total: 5,
                            resultEngine: 0
                        },
                        error: {
                            total: 0,
                            resultEngine: 0
                        },
                        fixed: {
                            total: 0,
                            resultEngine: 0
                        },
                        unknown: {
                            total: 0,
                            resultEngine: 0
                        },
                        notchecked: {
                            total: 0,
                            resultEngine: 0
                        },
                        notselected: {
                            total: 0,
                            resultEngine: 0
                        },
                        informational: {
                            total: 0,
                            resultEngine: 0
                        },
                        notapplicable: {
                            total: 4,
                            resultEngine: 0
                        }
                    },
                    findings: {
                        low: 2,
                        medium: 6,
                        high: 0
                    },    
                    statuses: {
                        saved: {
                            total: 6,
                            resultEngine: 0
                        },
                        accepted: {
                            total: 0,
                            resultEngine: 0
                        },
                        rejected: {
                            total: 0,
                            resultEngine: 0
                        },
                        submitted: {
                            total: 11,
                            resultEngine: 0
                        }
                    }	 
                }

            metricsReferenceCommon.results.unassessed = {
                total:  metricsReferenceCommon.results.informational.total + 
                        metricsReferenceCommon.results.notselected.total + 
                        metricsReferenceCommon.results.notchecked.total + 
                        metricsReferenceCommon.results.error.total + 
                        metricsReferenceCommon.results.fixed.total
            }

            
            })

            it('Return summary metrics - collection agg - no params', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/collection`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
             
                expect(res.body.assets).to.equal(environment.testCollection.assetIDsInCollection.length)
                expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
                expect(res.body.stigs).to.equal(environment.testCollection.validStigs.length)
                expect(res.body.checklists).to.eql(6)
                expect(res.body.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                expect(res.body.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                expect(res.body.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                expect(res.body.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                expect(res.body.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                expect(res.body.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                expect(res.body.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                expect(res.body.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                expect(res.body.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
            })
            it('Return summary metrics - collection agg - asset param', async function () {

                metricsReferenceCommon.assessed = 9
                metricsReferenceCommon.assessments = testTotalAssessmentsForTestAsset
                metricsReferenceCommon.results.fail.total = 4
                metricsReferenceCommon.results.pass.total = 4
                metricsReferenceCommon.results.notapplicable.total = 1
                metricsReferenceCommon.statuses.saved.total = 2
                metricsReferenceCommon.statuses.accepted.total = 0
                metricsReferenceCommon.statuses.rejected.total = 0
                metricsReferenceCommon.statuses.submitted.total = 7     
                metricsReferenceCommon.findings.low = 1
                metricsReferenceCommon.findings.high = 0
                metricsReferenceCommon.findings.medium = 3  

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/collection?assetId=${environment.testAsset.assetId}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
             
                expect(res.body.assets).to.equal(1)
                expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
                expect(res.body.checklists).to.eql(2)
                expect(res.body.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                expect(res.body.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                expect(res.body.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                expect(res.body.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                expect(res.body.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                expect(res.body.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                expect(res.body.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                expect(res.body.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                expect(res.body.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
            })
            it('Return summary metrics - collection agg - labelId param', async function () {
                metricsReferenceCommon.assessed = 12
                metricsReferenceCommon.assessments = 736
                metricsReferenceCommon.results.fail.total = 5
                metricsReferenceCommon.results.pass.total = 4
                metricsReferenceCommon.results.notapplicable.total = 3
                metricsReferenceCommon.statuses.saved.total = 3
                metricsReferenceCommon.statuses.accepted.total = 0
                metricsReferenceCommon.statuses.rejected.total = 0
                metricsReferenceCommon.statuses.submitted.total = 9     
                metricsReferenceCommon.findings.low = 1
                metricsReferenceCommon.findings.high = 0
                metricsReferenceCommon.findings.medium = 4

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/collection?labelId=${environment.testCollection.testLabel}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
               
                expect(res.body.assets).to.equal(2)
                expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
                expect(res.body.stigs).to.equal(environment.testCollection.validStigs.length)
                expect(res.body.checklists).to.eql(4)
                expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                expect(res.body.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                expect(res.body.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                expect(res.body.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                expect(res.body.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                expect(res.body.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                expect(res.body.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                expect(res.body.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                expect(res.body.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
            })
            it('Return summary metrics - collection agg - label name  param', async function () {
                metricsReferenceCommon.assessed = 12
                metricsReferenceCommon.assessments = 736
                metricsReferenceCommon.results.fail.total = 5
                metricsReferenceCommon.results.pass.total = 4
                metricsReferenceCommon.results.notapplicable.total = 3
                metricsReferenceCommon.statuses.saved.total = 3
                metricsReferenceCommon.statuses.accepted.total = 0
                metricsReferenceCommon.statuses.rejected.total = 0
                metricsReferenceCommon.statuses.submitted.total = 9     
                metricsReferenceCommon.findings.low = 1
                metricsReferenceCommon.findings.high = 0
                metricsReferenceCommon.findings.medium = 4

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/collection?labelName=${environment.metrics.labelFull}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
              
                expect(res.body.assets).to.equal(2)
                expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
                expect(res.body.stigs).to.equal(environment.testCollection.validStigs.length)
                expect(res.body.checklists).to.eql(4)
                expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                expect(res.body.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                expect(res.body.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                expect(res.body.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                expect(res.body.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                expect(res.body.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                expect(res.body.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                expect(res.body.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                expect(res.body.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
            })    
            it('Return summary metrics - collection agg - benchmark param', async function () {
                metricsReferenceCommon.assessments = 243
                metricsReferenceCommon.assessed = 14
                metricsReferenceCommon.results.fail.total = 7
                metricsReferenceCommon.results.pass.total = 3
                metricsReferenceCommon.statuses.saved.total = 5
                metricsReferenceCommon.statuses.submitted.total = 9
                metricsReferenceCommon.findings.medium = 5          

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/collection?benchmarkId=${environment.metrics.benchmark}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
             
                expect(res.body.assets).to.equal(3)
                expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
                expect(res.body.stigs).to.equal(1)
                expect(res.body.checklists).to.eql(3)
                expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                expect(res.body.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                expect(res.body.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                expect(res.body.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                expect(res.body.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                expect(res.body.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                expect(res.body.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                expect(res.body.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                expect(res.body.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
            })
        })

        describe('GET - getMetricsSummaryByCollectionAggLabel - /collections/{collectionId}/metrics/summary/label', function () {

            let metricsReferenceCommon
            let checklistLength = environment.metrics.checklistLength
            let testTotalAssessmentsForTestAsset = 368
            let testTotalAssessmentsForTestLabel = 736

            beforeEach(async function () {
                metricsReferenceCommon ={
                    assets: 2,
                    assessed: 12,
                    assessments: testTotalAssessmentsForTestLabel,
                    maxTs: "2022-02-03T00:07:05Z",
                    minTs: "2020-08-11T22:27:26Z",
                    results: {
                        fail: {
                            total: 5,
                            resultEngine: 0
                        },
                        pass: {
                            total: 4,
                            resultEngine: 0
                        },
                        error: {
                            total: 0,
                            resultEngine: 0
                        },
                        fixed: {
                            total: 0,
                            resultEngine: 0
                        },
                        unknown: {
                            total: 0,
                            resultEngine: 0
                        },
                        notchecked: {
                            total: 0,
                            resultEngine: 0
                        },
                        notselected: {
                            total: 0,
                            resultEngine: 0
                        },
                        informational: {
                            total: 0,
                            resultEngine: 0
                        },
                        notapplicable: {
                            total: 3,
                            resultEngine: 0
                        }
                    },
                    findings: {
                        low: 1,
                        medium: 4,
                        high: 0
                    },    
                    statuses: {
                        saved: {
                            total: 3,
                            resultEngine: 0
                        },
                        accepted: {
                            total: 0,
                            resultEngine: 0
                        },
                        rejected: {
                            total: 0,
                            resultEngine: 0
                        },
                        submitted: {
                            total: 9,
                            resultEngine: 0
                        }
                    }	 
                }
            })

            it('Return summary metrics - label agg', async function () {

                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/label`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
              
                expect(res.body.length).to.eql(3)
                for (const item of res.body){
                    if(item.labelId === environment.testCollection.testLabel){
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                        expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
            it('Return summary metrics - label agg - param benchmark', async function () {

                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }
                metricsReferenceCommon.assessed = 9
                metricsReferenceCommon.results.fail.total = 4
                metricsReferenceCommon.results.pass.total = 2
                metricsReferenceCommon.statuses.saved.total = 2
                metricsReferenceCommon.statuses.submitted.total = 7   
                metricsReferenceCommon.findings.medium = 3
            
                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/label?benchmarkId=${environment.metrics.benchmark}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
               
                expect(res.body.length).to.eql(3)
                for (const item of res.body){
                    if(item.labelId === environment.testCollection.testLabel){
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                        expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                        metricsReferenceCommon.assessments = environment.metrics.checklistLength * item.assets
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                    }
                }
            })
            it('Return summary metrics - label agg - param assetId', async function () {

                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }
                metricsReferenceCommon.assessments = testTotalAssessmentsForTestAsset
                metricsReferenceCommon.assessed = 9
                metricsReferenceCommon.results.fail.total = 4
                metricsReferenceCommon.results.notapplicable.total = 1
                metricsReferenceCommon.statuses.saved.total = 2
                metricsReferenceCommon.statuses.submitted.total = 7
                metricsReferenceCommon.findings.medium = 3           
            
                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/label?assetId=${environment.testAsset.assetId}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
              
                expect(res.body.length).to.eql(2)
                for (const item of res.body){
                    if(item.labelId === environment.testCollection.testLabel){
                        expect(item.assets).to.equal(1)
                        expect(item.labelId).to.equal(environment.testCollection.testLabel)
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                        expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
            it('Return summary metrics - label agg - param labelId', async function () {

                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }
                metricsReferenceCommon.statuses.saved.total = 3

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/label?labelId=${environment.testCollection.testLabel}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
               
                expect(res.body.length).to.eql(1)
                for (const item of res.body){
                    if(item.labelId === environment.testCollection.testLabel){
                        expect(item.assets).to.equal(2)
                        expect(item.labelId).to.equal(environment.testCollection.testLabel)
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                        expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
            it('Return summary metrics - label agg - param labelName', async function () {

                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }
                metricsReferenceCommon.statuses.saved.total = 3

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/label?labelName=${environment.testCollection.testLabelName}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
             
                expect(res.body.length).to.eql(1)
                for (const item of res.body){
                    if(item.labelId === environment.testCollection.testLabel){
                        expect(item.assets).to.equal(2)
                        expect(item.labelId).to.equal(environment.testCollection.testLabel)
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                        expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
        })

        describe('GET - getMetricsSummaryByCollectionAggStig - /collections/{collectionId}/metrics/summary/summary/stig', function () {


            let metricsReferenceCommon
            let testChecklistLength = environment.metrics.checklistLength
            let testTotalAssessmentsForTestAsset = 368
            let testTotalAssessmentsForTestSTIG = testChecklistLength * 3

            beforeEach(async function () {
                metricsReferenceCommon =  {
                    assets: 3,
                    assessed: 14,
                    assessments: testTotalAssessmentsForTestSTIG,
                    maxTs: "2022-02-03T00:07:05Z",
                    minTs: "2020-08-11T22:27:26Z",
                    results: {
                        fail: {
                            total: 7,
                            resultEngine: 0
                        },
                        pass: {
                            total: 3,
                            resultEngine: 0
                        },
                        error: {
                            total: 0,
                            resultEngine: 0
                        },
                        fixed: {
                            total: 0,
                            resultEngine: 0
                        },
                        unknown: {
                            total: 0,
                            resultEngine: 0
                        },
                        notchecked: {
                            total: 0,
                            resultEngine: 0
                        },
                        notselected: {
                            total: 0,
                            resultEngine: 0
                        },
                        informational: {
                            total: 0,
                            resultEngine: 0
                        },
                        notapplicable: {
                            total: 4,
                            resultEngine: 0
                        }
                    },
                    findings: {
                        low: 2,
                        medium: 5,
                        high: 0
                    },    
                    statuses: {
                        saved: {
                            total: 5,
                            resultEngine: 0
                        },
                        accepted: {
                            total: 0,
                            resultEngine: 0
                        },
                        rejected: {
                            total: 0,
                            resultEngine: 0
                        },
                        submitted: {
                            total: 9,
                            resultEngine: 0
                        }
                    }	 
                }
            
                metricsReferenceCommon.results.unassessed = {
                    total:  metricsReferenceCommon.results.informational.total + 
                            metricsReferenceCommon.results.notselected.total + 
                            metricsReferenceCommon.results.notchecked.total + 
                            metricsReferenceCommon.results.error.total + 
                            metricsReferenceCommon.results.fixed.total
                }
            })

            it('Return summary metrics - stig agg', async function () {

        

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/stig`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
               
                for(const item of res.body){
                    if(item.benchmarkId == environment.testCollection.benchmark){
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                        expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
            it('Return summary metrics - stig agg - param benchmark', async function () {

            

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/stig?benchmarkId=${environment.metrics.benchmark}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
                expect(res.body.length).to.eql(1)
           
                for(const item of res.body){
                    expect(item.benchmarkId).to.eql(environment.metrics.benchmark)  
                    expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                    expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                    expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                    expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                    expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                    expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                    expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                    expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                    expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                    expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                    expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                    expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                    expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                    expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                    expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                }
            })
            it('Return summary metrics - stig agg - param asset', async function () {


                metricsReferenceCommon.assessed = 6
                metricsReferenceCommon.assessments = testChecklistLength
                metricsReferenceCommon.results.fail.total = 3
                metricsReferenceCommon.results.pass.total = 2
                metricsReferenceCommon.results.notapplicable.total = 1
                metricsReferenceCommon.statuses.saved.total = 1
                metricsReferenceCommon.statuses.accepted.total = 0
                metricsReferenceCommon.statuses.rejected.total = 0
                metricsReferenceCommon.statuses.submitted.total = 5     
                metricsReferenceCommon.findings.low = 1
                metricsReferenceCommon.findings.high = 0
                metricsReferenceCommon.findings.medium = 2    

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/stig?assetId=${environment.testAsset.assetId}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
                expect(res.body.length).to.eql(2)
           
                for(const item of res.body){
                    if(item.benchmarkId == environment.testCollection.benchmark){
                        expect(item.benchmarkId).to.eql(environment.metrics.benchmark)  
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                        expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
            it('Return summary metrics - stig agg - param labelId', async function () {

                metricsReferenceCommon.assessed = 9
                metricsReferenceCommon.results.fail.total = 4
                metricsReferenceCommon.results.pass.total = 2
                metricsReferenceCommon.results.notapplicable.total = 3
                metricsReferenceCommon.statuses.saved.total = 2
                metricsReferenceCommon.statuses.accepted.total = 0
                metricsReferenceCommon.statuses.rejected.total = 0
                metricsReferenceCommon.statuses.submitted.total = 7
                metricsReferenceCommon.findings.low = 1
                metricsReferenceCommon.findings.high = 0
                metricsReferenceCommon.findings.medium = 3 

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/stig?labelId=${environment.testCollection.testLabel}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
                expect(res.body.length).to.eql(2)
              
                for(const item of res.body){
                    if(item.benchmarkId == environment.testCollection.benchmark){
                        metricsReferenceCommon.assessments = testChecklistLength * item.assets
                        expect(item.assets).to.equal(2)
                        expect(item.benchmarkId).to.eql(environment.metrics.benchmark)  
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                        expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
            it('Return summary metrics - stig agg - param labelName', async function () {
                metricsReferenceCommon.assessed = 9
        
            metricsReferenceCommon.results.fail.total = 4
            metricsReferenceCommon.results.pass.total = 2
            metricsReferenceCommon.results.notapplicable.total = 3
            metricsReferenceCommon.statuses.saved.total = 2
            metricsReferenceCommon.statuses.accepted.total = 0
            metricsReferenceCommon.statuses.rejected.total = 0
            metricsReferenceCommon.statuses.submitted.total = 7
            metricsReferenceCommon.findings.low = 1
            metricsReferenceCommon.findings.high = 0
            metricsReferenceCommon.findings.medium = 3 

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/stig?labelName=${environment.metrics.labelFull}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                expect(res).to.have.status(200)
                expect(res.body.length).to.eql(2)
             
                for(const item of res.body){
                    if(item.benchmarkId == environment.testCollection.benchmark){
                        metricsReferenceCommon.assessments = testChecklistLength * item.assets
                        expect(item.assets).to.equal(2)
                        expect(item.benchmarkId).to.eql(environment.metrics.benchmark)  
                        expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
                        expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
                        expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
                        expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
                        expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
                        expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
                        expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
                        expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
                        expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
                        expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
                        expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
                        expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
                        expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
                        expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
                        expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
                    }
                }
            })
        })
    })
  }
})

// describe('Metrics get tests using "lvl1" user ', function () {
//     let testChecklistLength = environment.metrics.checklistLength
//     let testTotalAssessmentsForTestAsset = 368;
//     let testTotalAssessmentsForTestSTIG = testChecklistLength * 3;
//     let testTotalAssessmentsForCollection = 1104;
//     let testTotalAssessmentsForTestLabel = 736;
//     before(async function () {
//       this.timeout(4000)
//       await utils.loadAppData()
//       await utils.uploadTestStigs()
//       await utils.createDisabledCollectionsandAssets()
//     })
  
//     describe('GET - getMetricsDetailByCollection - /collections/{collectionId}/metrics/detail', function () {
//       let metricsReferenceCommon
  
//       beforeEach(async function () {
//           metricsReferenceCommon = {
//               assessed: 6,
//               assessments: environment.metrics.checklistLength,
//               maxTs: "2022-02-03T00:07:05Z",
//               minTs: "2020-08-11T22:27:26Z",
//               results: {
//                   fail: {
//                       total: 3,
//                       resultEngine: 0
//                   },
//                   pass: {
//                       total: 2,
//                       resultEngine: 0
//                   },
//                   error: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   fixed: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   unknown: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notchecked: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notselected: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   informational: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notapplicable: {
//                       total: 1,
//                       resultEngine: 0
//                   }
//               },
//               findings: {
//                   low: 1,
//                   medium: 2,
//                   high: 0
//               },    
//               statuses: {
//                   saved: {
//                       total: 1,
//                       resultEngine: 0
//                   },
//                   accepted: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   rejected: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   submitted: {
//                       total: 5,
//                       resultEngine: 0
//                   }
//               }	 
//           }
//           metricsReferenceCommon.results.unassessed = {
//               total:  metricsReferenceCommon.results.informational.total + 
//                       metricsReferenceCommon.results.notselected.total + 
//                       metricsReferenceCommon.results.notchecked.total + 
//                       metricsReferenceCommon.results.error.total + 
//                       metricsReferenceCommon.results.fixed.total
//           }
//       })
     
//       it('Return detailed metrics for the specified Collection no param', async function () {
//         const res = await chai.request(config.baseUrl)
//           .get(`/collections/${environment.testCollection.collectionId}/metrics/detail`)
//           .set('Authorization', `Bearer ${lvl1.token}`)
//         expect(res).to.have.status(200)
  
//         for(const item of res.body){
//           let assetMatchString = "asset"
//           const regex = new RegExp(assetMatchString)
//           expect(item.name).to.match(regex)
  
//           if(item.assetId === environment.testAsset.assetId && item.benchmarkId === environment.metrics.benchmark){
//               expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//               expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//               expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//               expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//               expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//               expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//               expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//               expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//               expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//               expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//               expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//               expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//               expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//               expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//               expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//               expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//               expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//               expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//               expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//           }
//         }
//       })
//       it('Return detailed metrics for the specified Collection - with params', async function () {
//           const res = await chai.request(config.baseUrl)
//             .get(`/collections/${environment.testCollection.collectionId}/metrics/detail?benchmarkId=${environment.metrics.benchmark}&assetId=${environment.testAsset.assetId}&labelName=${environment.testCollection.testLabelName}`)
//             .set('Authorization', `Bearer ${lvl1.token}`)
  
//           expect(res).to.have.status(200)
    
//           for(const item of res.body){
//               let assetMatchString = "asset"
//               const regex = new RegExp(assetMatchString)
//               expect(item.name).to.match(regex)
  
//               expect(item.assetId).to.equal(environment.testAsset.assetId)
//               expect(item.benchmarkId).to.equal(environment.metrics.benchmark)
//               expect(environment.testCollection.testLabelName).to.be.oneOf(item.labels.map(label => label.name))
  
//               expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//               expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//               expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//               expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//               expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//               expect(item.metrics.assessments).to.equal(environment.metrics.checklistLength)
//               expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//           }
//       })
//     })
  
//     describe('GET - getMetricsDetailByCollectionAggAsset - /collections/{collectionId}/metrics/detail/asset', function () {
  
  
//       let metricsReferenceCommon
  
//       beforeEach(async function () {
//           metricsReferenceCommon = {
//               assessed: 9,
//               assessments: environment.metrics.checklistLength,
//               maxTs: "2022-02-03T00:07:05Z",
//               minTs: "2020-08-11T22:27:26Z",
//               results: {
//                   fail: {
//                       total: 4,
//                       resultEngine: 0
//                   },
//                   pass: {
//                       total: 4,
//                       resultEngine: 0
//                   },
//                   error: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   fixed: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   unknown: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notchecked: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notselected: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   informational: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notapplicable: {
//                       total: 1,
//                       resultEngine: 0
//                   }
//               },
//               findings: {
//                   low: 1,
//                   medium: 3,
//                   high: 0
//               },    
//               statuses: {
//                   saved: {
//                       total: 2,
//                       resultEngine: 0
//                   },
//                   accepted: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   rejected: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   submitted: {
//                       total: 7,
//                       resultEngine: 0
//                   }
//               }	 
//           }
//           metricsReferenceCommon.results.unassessed = {
//               total:  metricsReferenceCommon.results.informational.total + 
//                       metricsReferenceCommon.results.notselected.total + 
//                       metricsReferenceCommon.results.notchecked.total + 
//                       metricsReferenceCommon.results.error.total + 
//                       metricsReferenceCommon.results.fixed.total
//           }
//       })
   
//       it('Return detail metrics - assset agg', async function () {

//         metricsReferenceCommon.assessed = 6
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.statuses.saved.total = 1
//         metricsReferenceCommon.statuses.submitted.total = 5
//         metricsReferenceCommon.findings.medium = 2
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/asset`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
  
//           for(item of res.body){  
//               if(item.assetId === environment.testAsset.assetId){
//                   let assetMatchString = "asset"
//                   const regex = new RegExp(assetMatchString)
//                   expect(item.name).to.match(regex)
//                   expect(item.assetId).to.equal(environment.testAsset.assetId)
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//                   expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//                   expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//                   expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//                   expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//                   expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//             }
//           }
//       })
//       it('Return detail metrics - asset agg - with param assetId', async function () {

//         metricsReferenceCommon.assessed = 6
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.statuses.saved.total = 1
//         metricsReferenceCommon.statuses.submitted.total = 5
//         metricsReferenceCommon.findings.medium = 2
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/asset?assetId=${environment.testAsset.assetId}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
  
//           for(item of res.body){  
//               if(item.assetId === environment.testAsset.assetId){
//                   let assetMatchString = "asset"
//                   const regex = new RegExp(assetMatchString)
//                   expect(item.name).to.match(regex)
//                   expect(item.assetId).to.equal(environment.testAsset.assetId)
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//                   expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//                   expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//                   expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//                   expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//                   expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//             }
//           }
//       })
//       it('Return detail metrics - asset agg - with params', async function () {
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/asset?benchmarkId=${environment.metrics.benchmark}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
  
//           metricsReferenceCommon.assessments = 81
//           metricsReferenceCommon.assessed = 6
//           metricsReferenceCommon.results.fail.total = 3
//           metricsReferenceCommon.results.pass.total = 2
//           metricsReferenceCommon.statuses.saved.total = 1
//           metricsReferenceCommon.statuses.submitted.total = 5
//           metricsReferenceCommon.findings.medium = 2
  
//           for(item of res.body){  
//               if(item.assetId === environment.testAsset.assetId){
//                   let assetMatchString = "asset"
//                   const regex = new RegExp(assetMatchString)
//                   expect(item.name).to.match(regex)
//                   expect(item.assetId).to.equal(environment.testAsset.assetId)
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//                   expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//                   expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//                   expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//                   expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//                   expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//             }
//           }
//       })
//       it('Return detail metrics - asset agg - with params - all', async function () {
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/asset?benchmarkId=${environment.metrics.benchmark}&assetId=${environment.testAsset.assetId}&labelId=${environment.testCollection.testLabel}&labelName=${environment.testCollection.testLabelName}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
  
//           metricsReferenceCommon.assessments = 81
//           metricsReferenceCommon.assessed = 6
//           metricsReferenceCommon.results.fail.total = 3
//           metricsReferenceCommon.results.pass.total = 2
//           metricsReferenceCommon.statuses.saved.total = 1
//           metricsReferenceCommon.statuses.submitted.total = 5
//           metricsReferenceCommon.findings.medium = 2
  
//           for(item of res.body){  
//               let assetMatchString = "asset"
//               const regex = new RegExp(assetMatchString)
//               expect(item.name).to.match(regex)
//               expect(item.assetId).to.equal(environment.testAsset.assetId)
//               expect(environment.testCollection.testLabelName).to.be.oneOf(item.labels.map(label => label.name))
//               expect(environment.metrics.benchmark).to.be.oneOf(item.benchmarkIds.map(b => b))
//               expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//               expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//               expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//               expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//               expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//               expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//               expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//               expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//               expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//               expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//               expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//               expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//               expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//               expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//               expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//               expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//               expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//               expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//               expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//           }
//       })
//       it('Return detail metrics - asset agg - with param labelId', async function () {

//         metricsReferenceCommon.assessed = 6
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.statuses.saved.total = 1
//         metricsReferenceCommon.statuses.submitted.total = 5
//         metricsReferenceCommon.findings.medium = 2
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/asset?labelId=${environment.testCollection.testLabel}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
  
  
//           for(item of res.body){  
//               let assetMatchString = "asset"
//               const regex = new RegExp(assetMatchString)
  
  
//               if(item.assetId === environment.testAsset.assetId){
//                   expect(environment.testCollection.testLabelName).to.be.oneOf(item.labels.map(label => label.name))
//                   expect(item.assetId).to.equal(environment.testAsset.assetId)
//                   expect(environment.metrics.benchmark).to.be.oneOf(item.benchmarkIds.map(b => b))
//                   expect(item.name).to.match(regex)
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//                   expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//                   expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//                   expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//                   expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//                   expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//       it('Return detail metrics - asset agg - with param labelName', async function () {
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/asset?labelName=${environment.metrics.labelFull}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
  
//           metricsReferenceCommon.assessed = 6
//           metricsReferenceCommon.results.fail.total = 3
//           metricsReferenceCommon.results.pass.total = 2
//           metricsReferenceCommon.statuses.saved.total = 1
//           metricsReferenceCommon.statuses.submitted.total = 5
//           metricsReferenceCommon.findings.medium = 2
  
//           for(item of res.body){  
//               let assetMatchString = "asset"
//               const regex = new RegExp(assetMatchString)
  
  
//               if(item.assetId === environment.testAsset.assetId){
//                   expect(environment.testCollection.testLabelName).to.be.oneOf(item.labels.map(label => label.name))
//                   expect(item.assetId).to.equal(environment.testAsset.assetId)
//                   expect(environment.metrics.benchmark).to.be.oneOf(item.benchmarkIds.map(b => b))
//                   expect(item.name).to.match(regex)
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//                   expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//                   expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//                   expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//                   expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//                   expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//     })
  
//     describe('GET - getMetricsDetailByCollectionAgg - /collections/{collectionId}/metrics/detail/collection', function () {
  
//       let metricsReferenceCommon


  
//       beforeEach(async function () {
  
//           metricsReferenceCommon = {
//           assets: 4,
//           checklists: 6,
//           assessed: 17,
//           assessments: environment.metrics.checklistLength,
//           maxTs: "2022-02-03T00:07:05Z",
//           minTs: "2020-08-11T22:27:26Z",
//           results: {
//               fail: {
//                   total: 8,
//                   resultEngine: 0
//               },
//               pass: {
//                   total: 5,
//                   resultEngine: 0
//               },
//               error: {
//                   total: 0,
//                   resultEngine: 0
//               },
//               fixed: {
//                   total: 0,
//                   resultEngine: 0
//               },
//               unknown: {
//                   total: 0,
//                   resultEngine: 0
//               },
//               notchecked: {
//                   total: 0,
//                   resultEngine: 0
//               },
//               notselected: {
//                   total: 0,
//                   resultEngine: 0
//               },
//               informational: {
//                   total: 0,
//                   resultEngine: 0
//               },
//               notapplicable: {
//                   total: 4,
//                   resultEngine: 0
//               }
//           },
//           findings: {
//               low: 2,
//               medium: 6,
//               high: 0
//           },    
//           statuses: {
//               saved: {
//                   total: 6,
//                   resultEngine: 0
//               },
//               accepted: {
//                   total: 0,
//                   resultEngine: 0
//               },
//               rejected: {
//                   total: 0,
//                   resultEngine: 0
//               },
//               submitted: {
//                   total: 11,
//                   resultEngine: 0
//               }
//           }	 
//       }
//       metricsReferenceCommon.results.unassessed = {
//           total:  metricsReferenceCommon.results.informational.total + 
//                   metricsReferenceCommon.results.notselected.total + 
//                   metricsReferenceCommon.results.notchecked.total + 
//                   metricsReferenceCommon.results.error.total + 
//                   metricsReferenceCommon.results.fixed.total
//       }
    
//       })
  
//       it('Return detail metrics - collection agg - no params', async function () {

//         metricsReferenceCommon.assessed = 11
//         metricsReferenceCommon.assessments = 162
//         metricsReferenceCommon.results.fail.total = 6
//         metricsReferenceCommon.results.pass.total = 3
//         metricsReferenceCommon.results.notapplicable.total = 2
//         metricsReferenceCommon.statuses.saved.total = 4
//         metricsReferenceCommon.statuses.accepted.total = 0
//         metricsReferenceCommon.statuses.rejected.total = 0
//         metricsReferenceCommon.statuses.submitted.total = 7     
//         metricsReferenceCommon.findings.low = 2
//         metricsReferenceCommon.findings.high = 0
//         metricsReferenceCommon.findings.medium = 4      
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/collection`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.assets).to.equal(environment.lvl1.assets.length)
//           expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
//           expect(res.body.stigs).to.equal(environment.lvl1.assignedStigs.length)
//           expect(res.body.checklists).to.eql(2)
//           expect(res.body.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//           expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//           expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//           expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//           expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//           expect(res.body.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//           expect(res.body.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//           expect(res.body.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//           expect(res.body.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//           expect(res.body.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//           expect(res.body.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//           expect(res.body.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//           expect(res.body.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//           expect(res.body.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//           expect(res.body.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//           expect(res.body.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//           expect(res.body.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//           expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//           expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//       })
//       it('Return detail metrics - collection agg - asset param', async function () {
  
//         metricsReferenceCommon.assessed = 6
//         metricsReferenceCommon.assessments = 81
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.results.notapplicable.total = 1
//         metricsReferenceCommon.statuses.saved.total = 1
//         metricsReferenceCommon.statuses.accepted.total = 0
//         metricsReferenceCommon.statuses.rejected.total = 0
//         metricsReferenceCommon.statuses.submitted.total = 5     
//         metricsReferenceCommon.findings.low = 1
//         metricsReferenceCommon.findings.high = 0
//         metricsReferenceCommon.findings.medium = 2        
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/collection?assetId=${environment.testAsset.assetId}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.assets).to.equal(1)
//           expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
//           expect(res.body.stigs).to.equal(environment.lvl1.assignedStigs.length)
//           expect(res.body.checklists).to.eql(1)
//           expect(res.body.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//           expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//           expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//           expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//           expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//           expect(res.body.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//           expect(res.body.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//           expect(res.body.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//           expect(res.body.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//           expect(res.body.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//           expect(res.body.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//           expect(res.body.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//           expect(res.body.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//           expect(res.body.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//           expect(res.body.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//           expect(res.body.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//           expect(res.body.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//           expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//           expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//       })
//       it('Return detail metrics - collection agg - labelId param', async function () {

//         metricsReferenceCommon.assessed = 6
//         metricsReferenceCommon.assessments = 81
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.results.notapplicable.total = 1
//         metricsReferenceCommon.statuses.saved.total = 1
//         metricsReferenceCommon.statuses.accepted.total = 0
//         metricsReferenceCommon.statuses.rejected.total = 0
//         metricsReferenceCommon.statuses.submitted.total = 5     
//         metricsReferenceCommon.findings.low = 1
//         metricsReferenceCommon.findings.high = 0
//         metricsReferenceCommon.findings.medium = 2      
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/collection?labelId=${environment.testCollection.testLabel}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.assets).to.equal(1)
//           expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
//           expect(res.body.stigs).to.equal(1)
//           expect(res.body.checklists).to.eql(1)
//           expect(res.body.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//           expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//           expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//           expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//           expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//           expect(res.body.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//           expect(res.body.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//           expect(res.body.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//           expect(res.body.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//           expect(res.body.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//           expect(res.body.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//           expect(res.body.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//           expect(res.body.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//           expect(res.body.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//           expect(res.body.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//           expect(res.body.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//           expect(res.body.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//           expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//           expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//       })
//       it('Return detail metrics - collection agg - label name param', async function () {
   
//         metricsReferenceCommon.assessed = 6
//         metricsReferenceCommon.assessments = 81
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.results.notapplicable.total = 1
//         metricsReferenceCommon.statuses.saved.total = 1
//         metricsReferenceCommon.statuses.accepted.total = 0
//         metricsReferenceCommon.statuses.rejected.total = 0
//         metricsReferenceCommon.statuses.submitted.total = 5     
//         metricsReferenceCommon.findings.low = 1
//         metricsReferenceCommon.findings.high = 0
//         metricsReferenceCommon.findings.medium = 2      
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/collection?labelName=${environment.metrics.labelFull}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.assets).to.equal(1)
//           expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
//           expect(res.body.stigs).to.equal(1)
//           expect(res.body.checklists).to.eql(1)
//           expect(res.body.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//           expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//           expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//           expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//           expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//           expect(res.body.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//           expect(res.body.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//           expect(res.body.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//           expect(res.body.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//           expect(res.body.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//           expect(res.body.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//           expect(res.body.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//           expect(res.body.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//           expect(res.body.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//           expect(res.body.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//           expect(res.body.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//           expect(res.body.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//           expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//           expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//       })
//       it('Return detail metrics - collection agg - benchmarkId param', async function () {
      
//         metricsReferenceCommon.assessed = 11
//         metricsReferenceCommon.assessments = 162
//         metricsReferenceCommon.results.fail.total = 6
//         metricsReferenceCommon.results.pass.total = 3
//         metricsReferenceCommon.results.notapplicable.total = 2
//         metricsReferenceCommon.statuses.saved.total = 4
//         metricsReferenceCommon.statuses.accepted.total = 0
//         metricsReferenceCommon.statuses.rejected.total = 0
//         metricsReferenceCommon.statuses.submitted.total = 7    
//         metricsReferenceCommon.findings.low = 2
//         metricsReferenceCommon.findings.high = 0
//         metricsReferenceCommon.findings.medium = 4

//         const res = await chai.request(config.baseUrl)
//             .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/collection?benchmarkId=${environment.metrics.benchmark}`)
//             .set('Authorization', `Bearer ${lvl1.token}`)
//         expect(res).to.have.status(200)
//         expect(res.body.assets).to.equal(2)
//         expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
//         expect(res.body.stigs).to.equal(1)
//         expect(res.body.checklists).to.eql(2)
//         expect(res.body.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//         expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//         expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//         expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//         expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//         expect(res.body.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//         expect(res.body.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//         expect(res.body.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//         expect(res.body.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//         expect(res.body.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//         expect(res.body.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//         expect(res.body.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//         expect(res.body.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//         expect(res.body.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//         expect(res.body.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//         expect(res.body.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//         expect(res.body.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//         expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//         expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//     })
//     })
  
//     describe('GET - getMetricsDetailByCollectionAggLabel - /collections/{collectionId}/metrics/detail/label', function () {
  
//       let metricsReferenceCommon
      
//       beforeEach(async function () {
//           metricsReferenceCommon = {
//               assets: 2,
//               assessed: 12,
//               assessments: testTotalAssessmentsForTestLabel,
//               maxTs: "2022-02-03T00:07:05Z",
//               minTs: "2020-08-11T22:27:26Z",
//               results: {
//                   fail: {
//                       total: 5,
//                       resultEngine: 0
//                   },
//                   pass: {
//                       total: 4,
//                       resultEngine: 0
//                   },
//                   error: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   fixed: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   unknown: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notchecked: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notselected: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   informational: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notapplicable: {
//                       total: 3,
//                       resultEngine: 0
//                   }
//               },
//               findings: {
//                   low: 1,
//                   medium: 4,
//                   high: 0
//               },    
//               statuses: {
//                   saved: {
//                       total: 3,
//                       resultEngine: 0
//                   },
//                   accepted: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   rejected: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   submitted: {
//                       total: 9,
//                       resultEngine: 0
//                   }
//               }	 
//           }
//                 metricsReferenceCommon.results.unassessed = {
//               total:  metricsReferenceCommon.results.informational.total + 
//                       metricsReferenceCommon.results.notselected.total + 
//                       metricsReferenceCommon.results.notchecked.total + 
//                       metricsReferenceCommon.results.error.total + 
//                       metricsReferenceCommon.results.fixed.total
//           }
//       })
  
//       it('Return detail metrics - label agg', async function () {
  
//             metricsReferenceCommon.assessed = 6
//             metricsReferenceCommon.assessments = 81
//             metricsReferenceCommon.results.fail.total = 3
//             metricsReferenceCommon.results.pass.total = 2
//             metricsReferenceCommon.results.notapplicable.total = 1
//             metricsReferenceCommon.statuses.saved.total = 1
//             metricsReferenceCommon.statuses.submitted.total = 5   
//             metricsReferenceCommon.findings.medium = 2

//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/label`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.length).to.eql(3)
//           for (const item of res.body){
//               if(item.labelId === environment.testCollection.testLabel){
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//                   expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//                   expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//                   expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//                   expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//                   expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//       it('Return detail metrics - label agg - param benchmark', async function () {
  
    
//           metricsReferenceCommon.assessed = 6
//           metricsReferenceCommon.assessments = 81
//           metricsReferenceCommon.results.fail.total = 3
//           metricsReferenceCommon.results.pass.total = 2
//           metricsReferenceCommon.results.notapplicable.total = 1
//           metricsReferenceCommon.statuses.saved.total = 1
//           metricsReferenceCommon.statuses.submitted.total = 5   
//           metricsReferenceCommon.findings.medium = 2

//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/label?benchmarkId=${environment.metrics.benchmark}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.length).to.eql(3)
//           for (const item of res.body){
//               if(item.labelId === environment.testCollection.testLabel){
//                   expect(item.assets).to.eql(1)
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//                   expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//                   expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//                   expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//                   expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//                   expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   metricsReferenceCommon.assessments = environment.metrics.checklistLength * item.assets
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//       it('Return detail metrics - label agg - param assetId', async function () {
  
//         metricsReferenceCommon.assessments = 81
//         metricsReferenceCommon.assessed = 6
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.results.notapplicable.total = 1
//         metricsReferenceCommon.statuses.saved.total = 1
//         metricsReferenceCommon.statuses.submitted.total = 5   
//         metricsReferenceCommon.findings.medium = 2     
      
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/label?assetId=${environment.testAsset.assetId}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.length).to.eql(2)
//           for (const item of res.body){
//               if(item.labelId === environment.testCollection.testLabel){
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//                   expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//                   expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//                   expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//                   expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//                   expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//       it('Return detail metrics - label agg - param labelId', async function () {
  
//         metricsReferenceCommon.assessed = 6
//         metricsReferenceCommon.assessments = 81
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.results.notapplicable.total = 1
//         metricsReferenceCommon.statuses.saved.total = 1
//         metricsReferenceCommon.statuses.submitted.total = 5   
//         metricsReferenceCommon.findings.medium = 2
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/label?labelId=${environment.testCollection.testLabel}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.length).to.eql(1)
//           for (const item of res.body){
//               if(item.labelId === environment.testCollection.testLabel){
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//                   expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//                   expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//                   expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//                   expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//                   expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//       it('Return detail metrics - label agg - param labelName', async function () {
  
//         metricsReferenceCommon.assessed = 6
//         metricsReferenceCommon.assessments = 81
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.results.notapplicable.total = 1
//         metricsReferenceCommon.statuses.saved.total = 1

//         metricsReferenceCommon.statuses.submitted.total = 5   

//         metricsReferenceCommon.findings.medium = 2
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/label?labelName=${environment.testCollection.testLabelName}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.length).to.eql(1)
//           for (const item of res.body){
//               if(item.labelId === environment.testCollection.testLabel){
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//                   expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//                   expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//                   expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//                   expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//                   expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//     })
  
//     describe('GET - getMetricsDetailByCollectionAggStig - /collections/{collectionId}/metrics/detail/stig', function () {
  
//       let metricsReferenceCommon
      
  
//       beforeEach(async function () {
//           metricsReferenceCommon =  {
//               assets: 3,
//               assessed: 14,
//               assessments: testTotalAssessmentsForTestSTIG,
//               maxTs: "2022-02-03T00:07:05Z",
//               minTs: "2020-08-11T22:27:26Z",
//               results: {
//                   fail: {
//                       total: 7,
//                       resultEngine: 0
//                   },
//                   pass: {
//                       total: 3,
//                       resultEngine: 0
//                   },
//                   error: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   fixed: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   unknown: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notchecked: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notselected: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   informational: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notapplicable: {
//                       total: 4,
//                       resultEngine: 0
//                   }
//               },
//               findings: {
//                   low: 2,
//                   medium: 5,
//                   high: 0
//               },    
//               statuses: {
//                   saved: {
//                       total: 5,
//                       resultEngine: 0
//                   },
//                   accepted: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   rejected: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   submitted: {
//                       total: 9,
//                       resultEngine: 0
//                   }
//               }	 
//           }
//           metricsReferenceCommon.results.unassessed = {
//             total:  metricsReferenceCommon.results.informational.total + 
//                     metricsReferenceCommon.results.notselected.total + 
//                     metricsReferenceCommon.results.notchecked.total + 
//                     metricsReferenceCommon.results.error.total + 
//                     metricsReferenceCommon.results.fixed.total
//         }
//       })
  
//       it('Return detail metrics - stig agg', async function () {
  
//           metricsReferenceCommon.results.unassessed = {
//               total:  metricsReferenceCommon.results.informational.total + 
//                       metricsReferenceCommon.results.notselected.total + 
//                       metricsReferenceCommon.results.notchecked.total + 
//                       metricsReferenceCommon.results.error.total + 
//                       metricsReferenceCommon.results.fixed.total
//           }
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/stig`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
  
//           for(const item of res.body){
//               if(item.benchmark == environment.testCollection.benchmark){
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//                   expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//                   expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//                   expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//                   expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//                   expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//       it('Return detail metrics - stig agg - param benchmark', async function () {
  
        
//           metricsReferenceCommon.assessed = 11
//           metricsReferenceCommon.assessments = 162
//           metricsReferenceCommon.results.fail.total = 6
//           metricsReferenceCommon.results.pass.total = 3
//           metricsReferenceCommon.results.notapplicable.total = 2
//           metricsReferenceCommon.statuses.saved.total = 4
//           metricsReferenceCommon.statuses.accepted.total = 0
//           metricsReferenceCommon.statuses.rejected.total = 0
//           metricsReferenceCommon.statuses.submitted.total = 7
//           metricsReferenceCommon.findings.low = 2
//           metricsReferenceCommon.findings.high = 0
//           metricsReferenceCommon.findings.medium = 4
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/stig?benchmarkId=${environment.metrics.benchmark}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.length).to.eql(1)
         
//           for(const item of res.body){
//               expect(item.benchmarkId).to.eql(environment.metrics.benchmark)  
//               expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//               expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//               expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//               expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//               expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//               expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//               expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//               expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//               expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//               expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//               expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//               expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//               expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//               expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//               expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//               expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//               expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//               expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//               expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//           }
//       })
//       it('Return detail metrics - stig agg - param asset', async function () {
       
//             metricsReferenceCommon.assessed = 6
        
//             metricsReferenceCommon.results.fail.total = 3
//             metricsReferenceCommon.results.pass.total = 2
//             metricsReferenceCommon.results.notapplicable.total = 1
//             metricsReferenceCommon.statuses.saved.total = 1
//             metricsReferenceCommon.statuses.accepted.total = 0
//             metricsReferenceCommon.statuses.rejected.total = 0
//             metricsReferenceCommon.statuses.submitted.total = 5
//             metricsReferenceCommon.findings.low = 1
//             metricsReferenceCommon.findings.high = 0
//             metricsReferenceCommon.findings.medium = 2
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/stig?assetId=${environment.testAsset.assetId}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.length).to.eql(1)
  
//           for(const item of res.body){
//               if(item.benchmarkId == environment.testCollection.benchmark){
//                  metricsReferenceCommon.assessments = testChecklistLength * item.assets
//                   expect(item.benchmarkId).to.eql(environment.metrics.benchmark)  
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//                   expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//                   expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//                   expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//                   expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//                   expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//       it('Return detail metrics - stig agg - param labelId', async function () {
  
//           metricsReferenceCommon.results.unassessed = {
//               total:  metricsReferenceCommon.results.informational.total + 
//                       metricsReferenceCommon.results.notselected.total + 
//                       metricsReferenceCommon.results.notchecked.total + 
//                       metricsReferenceCommon.results.error.total + 
//                       metricsReferenceCommon.results.fixed.total
//           }
//           metricsReferenceCommon.assessed = 6
//           metricsReferenceCommon.results.fail.total = 3
//           metricsReferenceCommon.results.pass.total = 2
//           metricsReferenceCommon.results.notapplicable.total = 1
//           metricsReferenceCommon.statuses.saved.total = 1
//           metricsReferenceCommon.statuses.accepted.total = 0
//           metricsReferenceCommon.statuses.rejected.total = 0
//           metricsReferenceCommon.statuses.submitted.total = 5
//           metricsReferenceCommon.findings.low = 1
//           metricsReferenceCommon.findings.high = 0
//           metricsReferenceCommon.findings.medium = 2
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/stig?labelId=${environment.testCollection.testLabel}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.length).to.eql(1)
  
//           for(const item of res.body){
//               if(item.benchmark == environment.testCollection.benchmark){
//                   metricsReferenceCommon.assessments = testChecklistLength * item.assets
//                   expect(item.assets).to.equal(1)
//                   expect(item.benchmarkId).to.eql(environment.metrics.benchmark)  
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//                   expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//                   expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//                   expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//                   expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//                   expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//       it('Return detail metrics - stig agg - param labelName', async function () {
  
//           metricsReferenceCommon.results.unassessed = {
//               total:  metricsReferenceCommon.results.informational.total + 
//                       metricsReferenceCommon.results.notselected.total + 
//                       metricsReferenceCommon.results.notchecked.total + 
//                       metricsReferenceCommon.results.error.total + 
//                       metricsReferenceCommon.results.fixed.total
//           }
  
//           metricsReferenceCommon.assessed = 6
//           metricsReferenceCommon.results.fail.total = 3
//           metricsReferenceCommon.results.pass.total = 2
//           metricsReferenceCommon.results.notapplicable.total = 1
//           metricsReferenceCommon.statuses.saved.total = 1
//           metricsReferenceCommon.statuses.accepted.total = 0
//           metricsReferenceCommon.statuses.rejected.total = 0
//           metricsReferenceCommon.statuses.submitted.total = 5
//           metricsReferenceCommon.findings.low = 1
//           metricsReferenceCommon.findings.high = 0
//           metricsReferenceCommon.findings.medium = 2
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/stig?labelName=${environment.testCollection.testLabelName}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.length).to.eql(1)
  
//           for(const item of res.body){
//               if(item.benchmark == environment.testCollection.benchmark){
//                   metricsReferenceCommon.assessments = testChecklistLength * item.assets
//                   expect(item.assets).to.equal(1)
//                   expect(item.benchmarkId).to.eql(environment.metrics.benchmark)  
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable.total).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass.total).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail.total).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.informational.total).to.equal(metricsReferenceCommon.results.informational.total)
//                   expect(item.metrics.results.notchecked.total).to.equal(metricsReferenceCommon.results.notchecked.total)
//                   expect(item.metrics.results.notselected.total).to.equal(metricsReferenceCommon.results.notselected.total)
//                   expect(item.metrics.results.error.total).to.equal(metricsReferenceCommon.results.error.total)
//                   expect(item.metrics.results.fixed.total).to.equal(metricsReferenceCommon.results.fixed.total)
//                   expect(item.metrics.statuses.saved.total).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted.total).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted.total).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected.total).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//     })
  
  
//   //summary
  
//     describe('GET - getMetricsSummaryByCollection - /collections/{collectionId}/metrics/summary', function () {
  
//       let metricsReferenceCommon 
  
//       beforeEach(async function () {
//           metricsReferenceCommon = {
//               assessed: 6,
//               assessments: environment.metrics.checklistLength,
//               maxTs: "2022-02-03T00:07:05Z",
//               minTs: "2020-08-11T22:27:26Z",
//               results: {
//                   fail: {
//                       total: 3,
//                       resultEngine: 0
//                   },
//                   pass: {
//                       total: 2,
//                       resultEngine: 0
//                   },
//                   error: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   fixed: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   unknown: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notchecked: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notselected: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   informational: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notapplicable: {
//                       total: 1,
//                       resultEngine: 0
//                   }
//               },
//               findings: {
//                   low: 1,
//                   medium: 2,
//                   high: 0
//               },    
//               statuses: {
//                   saved: {
//                       total: 1,
//                       resultEngine: 0
//                   },
//                   accepted: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   rejected: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   submitted: {
//                       total: 5,
//                       resultEngine: 0
//                   }
//               }	 
//           }
//           metricsReferenceCommon.results.unassessed = {
//             total:  metricsReferenceCommon.results.informational.total + 
//                     metricsReferenceCommon.results.notselected.total + 
//                     metricsReferenceCommon.results.notchecked.total + 
//                     metricsReferenceCommon.results.error.total + 
//                     metricsReferenceCommon.results.fixed.total
//         }
//       })
  
//       it('Return summary metrics for the Collection - no agg - no params', async function () {
         
//         const res = await chai.request(config.baseUrl)
//           .get(`/collections/${environment.testCollection.collectionId}/metrics/summary`)
//           .set('Authorization', `Bearer ${lvl1.token}`)
//         expect(res).to.have.status(200)
  
//         for(const item of res.body){
//           let assetMatchString = "asset"
//           const regex = new RegExp(assetMatchString)
//           expect(item.name).to.match(regex)
          
//           if(item.assetId === environment.testAsset.assetId && item.benchmarkId === environment.metrics.benchmark){
//               let regex = new RegExp("asset")
//               expect(item.name).to.match(regex)
//               expect(item.metrics.findings.low).to.equal(1)
//               expect(item.metrics.results.notapplicable).to.equal(1)
//               expect(item.metrics.results.pass).to.equal(2)
//               expect(item.metrics.results.fail).to.equal(3)
//               expect(item.metrics.statuses.submitted).to.equal(5)
//               expect(item.metrics.assessments).to.equal(environment.metrics.checklistLength)
//               expect(item.metrics.assessed).to.equal(6)
//           }
//         }
//       })
//       it('Return summary metrics for the Collection - benchmark param - no agg', async function () {
//           const res = await chai.request(config.baseUrl)
//             .get(`/collections/${environment.testCollection.collectionId}/metrics/summary?benchmarkId=${environment.metrics.benchmark}`)
//             .set('Authorization', `Bearer ${lvl1.token}`)
  
//           expect(res).to.have.status(200)
    
//           for(const item of res.body){
//               let assetMatchString = "asset"
//               const regex = new RegExp(assetMatchString)
//               expect(item.name).to.match(regex)
//               if(item.assetId === environment.testAsset.assetId){
//                   expect(item.benchmarkId).to.eql(environment.metrics.benchmark)
//                   expect(item.assetId).to.equal(environment.testAsset.assetId)
//                   expect(item.benchmarkId).to.equal(environment.metrics.benchmark)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.assessments).to.equal(environment.metrics.checklistLength)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//       it('Return summary metrics for the Collection - asset param - no agg', async function () {
//       const res = await chai.request(config.baseUrl)
//           .get(`/collections/${environment.testCollection.collectionId}/metrics/summary?assetId=${environment.testAsset.assetId}`)
//           .set('Authorization', `Bearer ${lvl1.token}`)
  
//       expect(res).to.have.status(200)
  
//       for(const item of res.body){
//           let assetMatchString = "asset"
//           const regex = new RegExp(assetMatchString)
//           expect(item.name).to.match(regex)
//           if(item.benchmarkId === environment.metrics.benchmark){
//               expect(item.assetId).to.eql(environment.testAsset.assetId)
//               expect(item.benchmarkId).to.equal(environment.metrics.benchmark)
//               expect(environment.testCollection.testLabelName).to.be.oneOf(item.labels.map(label => label.name))
//               expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//               expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//               expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//               expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//               expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//               expect(item.metrics.assessments).to.equal(environment.metrics.checklistLength)
//               expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//           }
//       }
//       })
//       it('Return summary metrics for the Collection - labelId param - no agg', async function () {
//       const res = await chai.request(config.baseUrl)
//           .get(`/collections/${environment.testCollection.collectionId}/metrics/summary?labelId=${environment.testCollection.testLabel}`)
//           .set('Authorization', `Bearer ${lvl1.token}`)
  
//       expect(res).to.have.status(200)
  
//       for(const item of res.body){
//           let assetMatchString = "asset"
//           const regex = new RegExp(assetMatchString)
//           expect(item.name).to.match(regex)
//           if(item.benchmarkId === environment.metrics.benchmark && item.assetId === environment.testAsset.assetId){
//               expect(item.benchmarkId).to.equal(environment.metrics.benchmark)
//               expect(environment.testCollection.testLabelName).to.be.oneOf(item.labels.map(label => label.name))
//               expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//               expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//               expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//               expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//               expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//               expect(item.metrics.assessments).to.equal(environment.metrics.checklistLength)
//               expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//           }
//       }
//       })
//       it('Return summary metrics for the Collection - labelName param - no agg', async function () {
//       const res = await chai.request(config.baseUrl)
//           .get(`/collections/${environment.testCollection.collectionId}/metrics/summary?labelName=${environment.testCollection.testLabelName}`)
//           .set('Authorization', `Bearer ${lvl1.token}`)
  
//       expect(res).to.have.status(200)
  
//       for(const item of res.body){
//           let assetMatchString = "asset"
//           const regex = new RegExp(assetMatchString)
//           expect(item.name).to.match(regex)
//           if(item.benchmarkId === environment.metrics.benchmark && item.assetId === environment.testAsset.assetId){
//               expect(item.benchmarkId).to.equal(environment.metrics.benchmark)
//               expect(environment.testCollection.testLabelName).to.be.oneOf(item.labels.map(label => label.name))
//               expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//               expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//               expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//               expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//               expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//               expect(item.metrics.assessments).to.equal(environment.metrics.checklistLength)
//               expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//           }
//       }
//       })
//     })
  
//     describe('GET - getMetricsSummaryByCollectionAggAsset - /collections/{collectionId}/metrics/summary/asset', function () {
  
//       let metricsReferenceCommon
//       let testChecklistLength = environment.metrics.checklistLength
//       testTotalAssessmentsForTestAsset = testChecklistLength
  
//       beforeEach(async function () {
//           metricsReferenceCommon ={
//               assessed: 9,
//               assessments: testChecklistLength,
//               maxTs: "2022-02-03T00:07:05Z",
//               minTs: "2020-08-11T22:27:26Z",
//               results: {
//                   fail: {
//                       total: 4,
//                       resultEngine: 0
//                   },
//                   pass: {
//                       total: 4,
//                       resultEngine: 0
//                   },
//                   error: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   fixed: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   unknown: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notchecked: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notselected: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   informational: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notapplicable: {
//                       total: 1,
//                       resultEngine: 0
//                   }
//               },
//               findings: {
//                   low: 1,
//                   medium: 3,
//                   high: 0
//               },    
//               statuses: {
//                   saved: {
//                       total: 2,
//                       resultEngine: 0
//                   },
//                   accepted: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   rejected: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   submitted: {
//                       total: 7,
//                       resultEngine: 0
//                   }
//               }	 
//           }
//           metricsReferenceCommon.results.unassessed = {
//             total:  metricsReferenceCommon.results.informational.total + 
//                     metricsReferenceCommon.results.notselected.total + 
//                     metricsReferenceCommon.results.notchecked.total + 
//                     metricsReferenceCommon.results.error.total + 
//                     metricsReferenceCommon.results.fixed.total
//         }
//       })
  
//       it('Return summary metrics asset agg - summary', async function () {
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/asset`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//         expect(res).to.have.status(200)
  
//         metricsReferenceCommon.assessed = 6
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.statuses.saved.total = 1
//         metricsReferenceCommon.statuses.submitted.total = 5
//         metricsReferenceCommon.findings.medium = 2
      
//           metricsReferenceCommon.assessments = testTotalAssessmentsForTestAsset    
//           for(item of res.body){  
//               if(item.assetId === environment.testAsset.assetId){
//                   let assetMatchString = "asset"
//                   const regex = new RegExp(assetMatchString)
//                   expect(item.name).to.match(regex)
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//                   expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//             }
//           }
//       })
//       it('Return summary metrics - asset agg - with param assetId', async function () {
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/asset?assetId=${environment.testAsset.assetId}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
  
//           metricsReferenceCommon.assessed = 6
//           metricsReferenceCommon.results.fail.total = 3
//           metricsReferenceCommon.results.pass.total = 2
//           metricsReferenceCommon.statuses.saved.total = 1
//           metricsReferenceCommon.statuses.submitted.total = 5
//           metricsReferenceCommon.findings.medium = 2
//           metricsReferenceCommon.assessments = testTotalAssessmentsForTestAsset    
  
//           for(item of res.body){  
//               if(item.assetId === environment.testAsset.assetId){
//                   let assetMatchString = "asset"
//                   const regex = new RegExp(assetMatchString)
//                   expect(item.name).to.match(regex)
//                   expect(item.assetId).to.equal(environment.testAsset.assetId)
//                   expect(item.name).to.match(regex)
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//                   expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//             }
//           }
//       })
//       it('Return summary metrics - asset agg - with benchmarkID', async function () {
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/asset?benchmarkId=${environment.metrics.benchmark}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
  
       
//           metricsReferenceCommon.assessed = 6
//           metricsReferenceCommon.results.fail.total = 3
//           metricsReferenceCommon.results.pass.total = 2
//           metricsReferenceCommon.statuses.saved.total = 1
//           metricsReferenceCommon.statuses.submitted.total = 5
//           metricsReferenceCommon.findings.medium = 2
          
//           for(item of res.body){  
//               if(item.assetId === environment.testAsset.assetId){
//                   let assetMatchString = "asset"
//                   const regex = new RegExp(assetMatchString)
//                   expect(item.name).to.match(regex)
//                   expect(item.benchmarkIds[0]).to.equal(environment.metrics.benchmark)
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//                   expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//             }
//           }
//       })
    
//       it('Return summary metrics - asset agg - with param labelId', async function () {
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/asset?labelId=${environment.testCollection.testLabel}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
  
     
//           metricsReferenceCommon.assessed = 6
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.statuses.saved.total = 1
//         metricsReferenceCommon.statuses.submitted.total = 5
//         metricsReferenceCommon.findings.medium = 2
  
//           for(item of res.body){  
//               let assetMatchString = "asset"
//               const regex = new RegExp(assetMatchString)
//               expect(item.name).to.match(regex)
//               if(item.assetId === environment.testAsset.assetId){
//                   expect(environment.testCollection.testLabelName).to.be.oneOf(item.labels.map(label => label.name))
//                   expect(item.assetId).to.equal(environment.testAsset.assetId)
//                   expect(environment.metrics.benchmark).to.be.oneOf(item.benchmarkIds.map(b => b))
//                   expect(item.benchmarkIds[0]).to.equal(environment.metrics.benchmark)
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//                   expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//       it('Return summary metrics - asset agg - with param labelName', async function () {
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/asset?labelName=${environment.metrics.labelFull}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
  
//           metricsReferenceCommon.assessed = 6
//           metricsReferenceCommon.results.fail.total = 3
//           metricsReferenceCommon.results.pass.total = 2
//           metricsReferenceCommon.statuses.saved.total = 1
//           metricsReferenceCommon.statuses.submitted.total = 5
//           metricsReferenceCommon.findings.medium = 2
  
//           for(item of res.body){  
//               for(item of res.body){  
//                   let assetMatchString = "asset"
//                   const regex = new RegExp(assetMatchString)
//                   expect(item.name).to.match(regex)
//                   if(item.assetId === environment.testAsset.assetId){
//                       expect(environment.testCollection.testLabelName).to.be.oneOf(item.labels.map(label => label.name))
//                       expect(item.assetId).to.equal(environment.testAsset.assetId)
//                       expect(environment.metrics.benchmark).to.be.oneOf(item.benchmarkIds.map(b => b))
//                       expect(item.benchmarkIds[0]).to.equal(environment.metrics.benchmark)
//                       expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                       expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                       expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                       expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                       expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                       expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                       expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//                       expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//                       expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//                       expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//                       expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                       expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                       expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                       expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                       expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//                   }
//               }
//           }
//       })
//     })
  
//     describe('GET - getMetricsSummaryByCollectionAgg - /collections/{collectionId}/metrics/summary/collection', function () {
  
//       let metricsReferenceCommon
//       let testChecklistLength =environment.metrics.checklistLength
//       let testTotalAssessmentsForTestAsset = 368
//       let testTotalAssessmentsForCollection = 1104
  
//       beforeEach(async function () {
  
//           metricsReferenceCommon = {
//               assets: 4,
//               checklists: 6,
//               assessed: 17,
//               assessments: testTotalAssessmentsForCollection,
//               maxTs: "2022-02-03T00:07:05Z",
//               minTs: "2020-08-11T22:27:26Z",
//               results: {
//                   fail: {
//                       total: 8,
//                       resultEngine: 0
//                   },
//                   pass: {
//                       total: 5,
//                       resultEngine: 0
//                   },
//                   error: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   fixed: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   unknown: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notchecked: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notselected: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   informational: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notapplicable: {
//                       total: 4,
//                       resultEngine: 0
//                   }
//               },
//               findings: {
//                   low: 2,
//                   medium: 6,
//                   high: 0
//               },    
//               statuses: {
//                   saved: {
//                       total: 6,
//                       resultEngine: 0
//                   },
//                   accepted: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   rejected: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   submitted: {
//                       total: 11,
//                       resultEngine: 0
//                   }
//               }	 
//           }
  
//       metricsReferenceCommon.results.unassessed = {
//           total:  metricsReferenceCommon.results.informational.total + 
//                   metricsReferenceCommon.results.notselected.total + 
//                   metricsReferenceCommon.results.notchecked.total + 
//                   metricsReferenceCommon.results.error.total + 
//                   metricsReferenceCommon.results.fixed.total
//       }
  
      
//       })
  
//       it('Return summary metrics - collection agg - no params', async function () {

//         metricsReferenceCommon.assessed = 11
//         metricsReferenceCommon.assessments = 162
//         metricsReferenceCommon.results.fail.total = 6
//         metricsReferenceCommon.results.pass.total = 3
//         metricsReferenceCommon.results.notapplicable.total = 2
//         metricsReferenceCommon.statuses.saved.total = 4
//         metricsReferenceCommon.statuses.accepted.total = 0
//         metricsReferenceCommon.statuses.rejected.total = 0
//         metricsReferenceCommon.statuses.submitted.total = 7     
//         metricsReferenceCommon.findings.low = 2
//         metricsReferenceCommon.findings.high = 0
//         metricsReferenceCommon.findings.medium = 4      
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/collection`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.assets).to.equal(2)
//           expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
//           expect(res.body.stigs).to.equal(1)
//           expect(res.body.checklists).to.eql(2)
//           expect(res.body.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//           expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//           expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//           expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//           expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//           expect(res.body.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//           expect(res.body.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//           expect(res.body.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//           expect(res.body.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//           expect(res.body.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//           expect(res.body.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//           expect(res.body.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//           expect(res.body.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//           expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//           expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//       })
//       it('Return summary metrics - collection agg - asset param', async function () {
  
//         metricsReferenceCommon.assessed = 6
//         metricsReferenceCommon.assessments = 81
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.results.notapplicable.total = 1
//         metricsReferenceCommon.statuses.saved.total = 1
//         metricsReferenceCommon.statuses.accepted.total = 0
//         metricsReferenceCommon.statuses.rejected.total = 0
//         metricsReferenceCommon.statuses.submitted.total = 5     
//         metricsReferenceCommon.findings.low = 1
//         metricsReferenceCommon.findings.high = 0
//         metricsReferenceCommon.findings.medium = 2        
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/collection?assetId=${environment.testAsset.assetId}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.assets).to.equal(1)
//           expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
//           expect(res.body.checklists).to.eql(1)
//           expect(res.body.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//           expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//           expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//           expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//           expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//           expect(res.body.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//           expect(res.body.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//           expect(res.body.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//           expect(res.body.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//           expect(res.body.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//           expect(res.body.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//           expect(res.body.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//           expect(res.body.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//           expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//           expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//       })
//       it('Return summary metrics - collection agg - labelId param', async function () {
//         metricsReferenceCommon.assessed = 6
//         metricsReferenceCommon.assessments = 81
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.results.notapplicable.total = 1
//         metricsReferenceCommon.statuses.saved.total = 1
//         metricsReferenceCommon.statuses.accepted.total = 0
//         metricsReferenceCommon.statuses.rejected.total = 0
//         metricsReferenceCommon.statuses.submitted.total = 5     
//         metricsReferenceCommon.findings.low = 1
//         metricsReferenceCommon.findings.high = 0
//         metricsReferenceCommon.findings.medium = 2        
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/collection?labelId=${environment.testCollection.testLabel}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.assets).to.equal(1)
//           expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
//           expect(res.body.stigs).to.equal(1)
//           expect(res.body.checklists).to.eql(1)
//           expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//           expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//           expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//           expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//           expect(res.body.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//           expect(res.body.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//           expect(res.body.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//           expect(res.body.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//           expect(res.body.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//           expect(res.body.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//           expect(res.body.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//           expect(res.body.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//           expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//           expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//       })
//       it('Return summary metrics - collection agg - label name  param', async function () {
//         metricsReferenceCommon.assessed = 6
//         metricsReferenceCommon.assessments = 81
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.results.notapplicable.total = 1
//         metricsReferenceCommon.statuses.saved.total = 1
//         metricsReferenceCommon.statuses.accepted.total = 0
//         metricsReferenceCommon.statuses.rejected.total = 0
//         metricsReferenceCommon.statuses.submitted.total = 5     
//         metricsReferenceCommon.findings.low = 1
//         metricsReferenceCommon.findings.high = 0
//         metricsReferenceCommon.findings.medium = 2        
  
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/collection?labelName=${environment.metrics.labelFull}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.assets).to.equal(1)
//           expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
//           expect(res.body.stigs).to.equal(1)
//           expect(res.body.checklists).to.eql(1)
//           expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//           expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//           expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//           expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//           expect(res.body.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//           expect(res.body.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//           expect(res.body.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//           expect(res.body.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//           expect(res.body.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//           expect(res.body.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//           expect(res.body.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//           expect(res.body.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//           expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//           expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//       })    
//       it('Return summary metrics - collection agg - benchmark param', async function () {
//         metricsReferenceCommon.assessed = 11
//         metricsReferenceCommon.assessments = 162
//         metricsReferenceCommon.results.fail.total = 6
//         metricsReferenceCommon.results.pass.total = 3
//         metricsReferenceCommon.results.notapplicable.total = 2
//         metricsReferenceCommon.statuses.saved.total = 4
//         metricsReferenceCommon.statuses.accepted.total = 0
//         metricsReferenceCommon.statuses.rejected.total = 0
//         metricsReferenceCommon.statuses.submitted.total = 7    
//         metricsReferenceCommon.findings.low = 2
//         metricsReferenceCommon.findings.high = 0
//         metricsReferenceCommon.findings.medium = 4
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/collection?benchmarkId=${environment.metrics.benchmark}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.assets).to.equal(2)
//           expect(res.body.collectionId).to.equal(environment.testCollection.collectionId)
//           expect(res.body.stigs).to.equal(1)
//           expect(res.body.checklists).to.eql(2)
//           expect(res.body.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//           expect(res.body.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//           expect(res.body.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//           expect(res.body.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//           expect(res.body.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//           expect(res.body.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//           expect(res.body.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//           expect(res.body.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//           expect(res.body.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//           expect(res.body.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//           expect(res.body.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//           expect(res.body.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//           expect(res.body.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//           expect(res.body.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//       })
//     })
  
//     describe('GET - getMetricsSummaryByCollectionAggLabel - /collections/{collectionId}/metrics/summary/label', function () {
  
//       let metricsReferenceCommon
//       let checklistLength = environment.metrics.checklistLength
//       let testTotalAssessmentsForTestAsset = 368
//       let testTotalAssessmentsForTestLabel = 736
  
//       beforeEach(async function () {
//           metricsReferenceCommon ={
//               assets: 2,
//               assessed: 12,
//               assessments: testTotalAssessmentsForTestLabel,
//               maxTs: "2022-02-03T00:07:05Z",
//               minTs: "2020-08-11T22:27:26Z",
//               results: {
//                   fail: {
//                       total: 5,
//                       resultEngine: 0
//                   },
//                   pass: {
//                       total: 4,
//                       resultEngine: 0
//                   },
//                   error: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   fixed: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   unknown: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notchecked: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notselected: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   informational: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notapplicable: {
//                       total: 3,
//                       resultEngine: 0
//                   }
//               },
//               findings: {
//                   low: 1,
//                   medium: 4,
//                   high: 0
//               },    
//               statuses: {
//                   saved: {
//                       total: 3,
//                       resultEngine: 0
//                   },
//                   accepted: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   rejected: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   submitted: {
//                       total: 9,
//                       resultEngine: 0
//                   }
//               }	 
//           }
//           metricsReferenceCommon.results.unassessed = {
//             total:  metricsReferenceCommon.results.informational.total + 
//                     metricsReferenceCommon.results.notselected.total + 
//                     metricsReferenceCommon.results.notchecked.total + 
//                     metricsReferenceCommon.results.error.total + 
//                     metricsReferenceCommon.results.fixed.total
//         }
//       })
  
//       it('Return detail metrics - label agg', async function () {
//         metricsReferenceCommon.assessed = 6
//         metricsReferenceCommon.assessments = 81
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.results.notapplicable.total = 1
//         metricsReferenceCommon.statuses.saved.total = 1
//         metricsReferenceCommon.statuses.submitted.total = 5   
//         metricsReferenceCommon.findings.medium = 2
         
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/label`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.length).to.eql(3)
//           for (const item of res.body){
//               if(item.labelId === environment.testCollection.testLabel){
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//                   expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//       it('Return detail metrics - label agg - param benchmark', async function () {
  
      
//         metricsReferenceCommon.assessed = 6
//         metricsReferenceCommon.assessments = 81
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.results.notapplicable.total = 1
//         metricsReferenceCommon.statuses.saved.total = 1
//         metricsReferenceCommon.statuses.submitted.total = 5   
//         metricsReferenceCommon.findings.medium = 2
        
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/label?benchmarkId=${environment.metrics.benchmark}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.length).to.eql(3)
//           for (const item of res.body){
//               if(item.labelId === environment.testCollection.testLabel){
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//                   expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//                   metricsReferenceCommon.assessments = environment.metrics.checklistLength * item.assets
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//               }
//           }
//       })
//       it('Return detail metrics - label agg - param assetId', async function () {
  
//         metricsReferenceCommon.assessments = 81
//         metricsReferenceCommon.assessed = 6
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.results.notapplicable.total = 1
//         metricsReferenceCommon.statuses.saved.total = 1
//         metricsReferenceCommon.statuses.submitted.total = 5   
//         metricsReferenceCommon.findings.medium = 2     
      
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/label?assetId=${environment.testAsset.assetId}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.length).to.eql(2)
//           for (const item of res.body){
//               if(item.labelId === environment.testCollection.testLabel){
//                   expect(item.assets).to.equal(1)
//                   expect(item.labelId).to.equal(environment.testCollection.testLabel)
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//                   expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//       it('Return detail metrics - label agg - param labelId', async function () {
//         metricsReferenceCommon.assessed = 6
//         metricsReferenceCommon.assessments = 81
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.results.notapplicable.total = 1
//         metricsReferenceCommon.statuses.saved.total = 1
//         metricsReferenceCommon.statuses.submitted.total = 5   
//         metricsReferenceCommon.findings.medium = 2
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/label?labelId=${environment.testCollection.testLabel}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.length).to.eql(1)
//           for (const item of res.body){
//               if(item.labelId === environment.testCollection.testLabel){
//                   expect(item.assets).to.equal(1)
//                   expect(item.labelId).to.equal(environment.testCollection.testLabel)
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//                   expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//       it('Return detail metrics - label agg - param labelName', async function () {
  
//           metricsReferenceCommon.statuses.saved.total = 3
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/label?labelName=${environment.testCollection.testLabelName}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.length).to.eql(1)
//           for (const item of res.body){
//               if(item.labelId === environment.testCollection.testLabel){
//                   expect(item.assets).to.equal(2)
//                   expect(item.labelId).to.equal(environment.testCollection.testLabel)
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//                   expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//     })
  
//     describe('GET - getMetricsSummaryByCollectionAggStig - /collections/{collectionId}/metrics/summary/summary/stig', function () {
  
  
//       let metricsReferenceCommon
//       let testChecklistLength = environment.metrics.checklistLength
//       let testTotalAssessmentsForTestAsset = 368
//       let testTotalAssessmentsForTestSTIG = testChecklistLength * 3
  
//       beforeEach(async function () {
//           metricsReferenceCommon =  {
//               assets: 3,
//               assessed: 14,
//               assessments: testTotalAssessmentsForTestSTIG,
//               maxTs: "2022-02-03T00:07:05Z",
//               minTs: "2020-08-11T22:27:26Z",
//               results: {
//                   fail: {
//                       total: 7,
//                       resultEngine: 0
//                   },
//                   pass: {
//                       total: 3,
//                       resultEngine: 0
//                   },
//                   error: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   fixed: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   unknown: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notchecked: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notselected: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   informational: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   notapplicable: {
//                       total: 4,
//                       resultEngine: 0
//                   }
//               },
//               findings: {
//                   low: 2,
//                   medium: 5,
//                   high: 0
//               },    
//               statuses: {
//                   saved: {
//                       total: 5,
//                       resultEngine: 0
//                   },
//                   accepted: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   rejected: {
//                       total: 0,
//                       resultEngine: 0
//                   },
//                   submitted: {
//                       total: 9,
//                       resultEngine: 0
//                   }
//               }	 
//           }

//           metricsReferenceCommon.results.unassessed = {
//             total:  metricsReferenceCommon.results.informational.total + 
//                     metricsReferenceCommon.results.notselected.total + 
//                     metricsReferenceCommon.results.notchecked.total + 
//                     metricsReferenceCommon.results.error.total + 
//                     metricsReferenceCommon.results.fixed.total
//         }
      
//       })
  
//       it('Return summary metrics - stig agg', async function () {
        
//             metricsReferenceCommon.assessed = 11
          
//             metricsReferenceCommon.results.fail.total = 6
//             metricsReferenceCommon.results.pass.total = 3
//             metricsReferenceCommon.results.notapplicable.total = 2
//             metricsReferenceCommon.statuses.saved.total = 4
//             metricsReferenceCommon.statuses.accepted.total = 0
//             metricsReferenceCommon.statuses.rejected.total = 0
//             metricsReferenceCommon.statuses.submitted.total = 7
//             metricsReferenceCommon.findings.low = 2
//             metricsReferenceCommon.findings.high = 0
//             metricsReferenceCommon.findings.medium = 4

//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/stig`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
  
//           for(const item of res.body){
//               if(item.benchmark == environment.testCollection.benchmark){
//                 metricsReferenceCommon.assessments = testChecklistLength * item.assets
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//                   expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//       it('Return summary metrics - stig agg - param benchmark', async function () {

//         metricsReferenceCommon.assessed = 11
//         metricsReferenceCommon.assessments = 162
//         metricsReferenceCommon.results.fail.total = 6
//         metricsReferenceCommon.results.pass.total = 3
//         metricsReferenceCommon.results.notapplicable.total = 2
//         metricsReferenceCommon.statuses.saved.total = 4
//         metricsReferenceCommon.statuses.accepted.total = 0
//         metricsReferenceCommon.statuses.rejected.total = 0
//         metricsReferenceCommon.statuses.submitted.total = 7
//         metricsReferenceCommon.findings.low = 2
//         metricsReferenceCommon.findings.high = 0
//         metricsReferenceCommon.findings.medium = 4
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/stig?benchmarkId=${environment.metrics.benchmark}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.length).to.eql(1)
         
//           for(const item of res.body){
//               expect(item.benchmarkId).to.eql(environment.metrics.benchmark)  
//               expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//               expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//               expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//               expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//               expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//               expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//               expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//               expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//               expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//               expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//               expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//               expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//               expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//               expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//               expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//           }
//       })
//       it('Return summary metrics - stig agg - param asset', async function () {
  
//         metricsReferenceCommon.assessed = 6
        
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.results.notapplicable.total = 1
//         metricsReferenceCommon.statuses.saved.total = 1
//         metricsReferenceCommon.statuses.accepted.total = 0
//         metricsReferenceCommon.statuses.rejected.total = 0
//         metricsReferenceCommon.statuses.submitted.total = 5
//         metricsReferenceCommon.findings.low = 1
//         metricsReferenceCommon.findings.high = 0
//         metricsReferenceCommon.findings.medium = 2
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/stig?assetId=${environment.testAsset.assetId}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.length).to.eql(1)
  
//           for(const item of res.body){
//               if(item.benchmark == environment.testCollection.benchmark){
//                 metricsReferenceCommon.assessments = testChecklistLength * item.assets
//                   expect(item.benchmarkId).to.eql(environment.metrics.benchmark)  
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//                   expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//       it('Return summary metrics - stig agg - param labelId', async function () {
  
      
//         metricsReferenceCommon.assessed = 6
//         metricsReferenceCommon.results.fail.total = 3
//         metricsReferenceCommon.results.pass.total = 2
//         metricsReferenceCommon.results.notapplicable.total = 1
//         metricsReferenceCommon.statuses.saved.total = 1
//         metricsReferenceCommon.statuses.accepted.total = 0
//         metricsReferenceCommon.statuses.rejected.total = 0
//         metricsReferenceCommon.statuses.submitted.total = 5
//         metricsReferenceCommon.findings.low = 1
//         metricsReferenceCommon.findings.high = 0
//         metricsReferenceCommon.findings.medium = 2
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/stig?labelId=${environment.testCollection.testLabel}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.length).to.eql(1)
  
//           for(const item of res.body){
//               if(item.benchmark == environment.testCollection.benchmark){
//                   metricsReferenceCommon.assessments = testChecklistLength * item.assets
//                   expect(item.assets).to.equal(1)
//                   expect(item.benchmarkId).to.eql(environment.metrics.benchmark)  
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//                   expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//       it('Return summary metrics - stig agg - param labelName', async function () {
//             metricsReferenceCommon.assessed = 6
//             metricsReferenceCommon.results.fail.total = 3
//             metricsReferenceCommon.results.pass.total = 2
//             metricsReferenceCommon.results.notapplicable.total = 1
//             metricsReferenceCommon.statuses.saved.total = 1
//             metricsReferenceCommon.statuses.accepted.total = 0
//             metricsReferenceCommon.statuses.rejected.total = 0
//             metricsReferenceCommon.statuses.submitted.total = 5
//             metricsReferenceCommon.findings.low = 1
//             metricsReferenceCommon.findings.high = 0
//             metricsReferenceCommon.findings.medium = 2
  
//           const res = await chai.request(config.baseUrl)
//               .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/stig?labelName=${environment.metrics.labelFull}`)
//               .set('Authorization', `Bearer ${lvl1.token}`)
//           expect(res).to.have.status(200)
//           expect(res.body.length).to.eql(1)
  
//           for(const item of res.body){
//               if(item.benchmark == environment.testCollection.benchmark){
//                   metricsReferenceCommon.assessments = testChecklistLength * item.assets
//                   expect(item.assets).to.equal(1)
//                   expect(item.benchmarkId).to.eql(environment.metrics.benchmark)  
//                   expect(item.metrics.maxTs).to.equal(metricsReferenceCommon.maxTs)
//                   expect(item.metrics.minTs).to.equal(metricsReferenceCommon.minTs)
//                   expect(item.metrics.findings.low).to.equal(metricsReferenceCommon.findings.low)
//                   expect(item.metrics.findings.medium).to.equal(metricsReferenceCommon.findings.medium)
//                   expect(item.metrics.findings.high).to.equal(metricsReferenceCommon.findings.high)
//                   expect(item.metrics.results.notapplicable).to.equal(metricsReferenceCommon.results.notapplicable.total)
//                   expect(item.metrics.results.pass).to.equal(metricsReferenceCommon.results.pass.total)
//                   expect(item.metrics.results.fail).to.equal(metricsReferenceCommon.results.fail.total)
//                   expect(item.metrics.results.unassessed).to.equal(metricsReferenceCommon.results.unassessed.total)
//                   expect(item.metrics.statuses.saved).to.equal(metricsReferenceCommon.statuses.saved.total)
//                   expect(item.metrics.statuses.submitted).to.equal(metricsReferenceCommon.statuses.submitted.total)
//                   expect(item.metrics.statuses.accepted).to.equal(metricsReferenceCommon.statuses.accepted.total)
//                   expect(item.metrics.statuses.rejected).to.equal(metricsReferenceCommon.statuses.rejected.total)
//                   expect(item.metrics.assessments).to.equal(metricsReferenceCommon.assessments)
//                   expect(item.metrics.assessed).to.equal(metricsReferenceCommon.assessed)
//               }
//           }
//       })
//     })
// })
  
