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


describe('GET - Metrics', function () { 
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const user of users){
    describe(`user:${user.name}`, function () {

        describe('GET - getMetricsDetailByCollection - /collections/{collectionId}/metrics/detail', function () {

        

            it('Return detailed metrics for the specified Collection no param', async function () {
            const res = await chai.request(config.baseUrl)
                .get(`/collections/${environment.testCollection.collectionId}/metrics/detail`)
                .set('Authorization', `Bearer ${user.token}`)

            const expectedData = loadExpectedData(this.test.title)
            expect(res).to.have.status(200)
            if(user.name === 'lvl1'){
                expect(res.body).to.eql(expectedData['lvl1'])
            }
            else 
            {
                expect(res.body).to.eql(expectedData['stigmanadmin'])
            }

            })
            it('Return detailed metrics for the specified Collection - with params', async function () {
                const res = await chai.request(config.baseUrl)
                .get(`/collections/${environment.testCollection.collectionId}/metrics/detail?benchmarkId=${environment.metrics.benchmark}&assetId=${environment.testAsset.assetId}&labelName=${environment.testCollection.testLabelName}`)
                .set('Authorization', `Bearer ${user.token}`)

                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
        })

        describe('GET - getMetricsDetailByCollectionAggAsset - /collections/{collectionId}/metrics/detail/asset', function () {
        
            it('Return detail metrics - assset agg', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/asset`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return detail metrics - asset agg - with param assetId', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/asset?assetId=${environment.testAsset.assetId}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return detail metrics - asset agg - with params', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/asset?benchmarkId=${environment.metrics.benchmark}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    await storeResponseData(this.test.title, user.name, res.body)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return detail metrics - asset agg - with params - all', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/asset?benchmarkId=${environment.metrics.benchmark}&assetId=${environment.testAsset.assetId}&labelId=${environment.testCollection.testLabel}&labelName=${environment.testCollection.testLabelName}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return detail metrics - asset agg - with param labelId', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/asset?labelId=${environment.testCollection.testLabel}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return detail metrics - asset agg - with param labelName', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/asset?labelName=${environment.metrics.labelFull}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
        })

        describe('GET - getMetricsDetailByCollectionAgg - /collections/{collectionId}/metrics/detail/collection', function () {

        

            it('Return detail metrics - collection agg - no params', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/collection`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            
            })
            it('Return detail metrics - collection agg - asset param', async function () {

              
                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/collection?assetId=${environment.testAsset.assetId}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return detail metrics - collection agg - labelId param', async function () {
            

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/collection?labelId=${environment.testCollection.testLabel}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return detail metrics - collection agg - label name param', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/collection?labelName=${environment.metrics.labelFull}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return detail metrics - collection agg - benchmarkId param', async function () {
            
                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/collection?benchmarkId=${environment.metrics.benchmark}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
        })

        describe('GET - getMetricsDetailByCollectionAggLabel - /collections/{collectionId}/metrics/detail/label', function () {

            it('Return detail metrics - label agg', async function () {

             

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/label`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return detail metrics - label agg - param benchmark', async function () {

             
                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/label?benchmarkId=${environment.metrics.benchmark}`)
                    .set('Authorization', `Bearer ${user.token}`)
                    const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return detail metrics - label agg - param assetId', async function () {

            
                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/label?assetId=${environment.testAsset.assetId}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return detail metrics - label agg - param labelId', async function () {


                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/label?labelId=${environment.testCollection.testLabel}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
                
            })
            it('Return detail metrics - label agg - param labelName', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/label?labelName=${environment.testCollection.testLabelName}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
        })

        describe('GET - getMetricsDetailByCollectionAggStig - /collections/{collectionId}/metrics/detail/stig', function () {

            it('Return detail metrics - stig agg', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/stig`)
                    .set('Authorization', `Bearer ${user.token}`)
                    const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
       
            })
            it('Return detail metrics - stig agg - param benchmark', async function () {

            
                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/stig?benchmarkId=${environment.metrics.benchmark}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return detail metrics - stig agg - param asset', async function () {

            
                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/stig?assetId=${environment.testAsset.assetId}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return detail metrics - stig agg - param labelId', async function () {


                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/stig?labelId=${environment.testCollection.testLabel}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
                
            })
            it('Return detail metrics - stig agg - param labelName', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/detail/stig?labelName=${environment.testCollection.testLabelName}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
        })


        //summary
        describe('GET - getMetricsSummaryByCollection - /collections/{collectionId}/metrics/summary', function () {

        

            it('Return summary metrics for the Collection - no agg - no params', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return summary metrics for the Collection - benchmark param - no agg', async function () {
                const res = await chai.request(config.baseUrl)
                .get(`/collections/${environment.testCollection.collectionId}/metrics/summary?benchmarkId=${environment.metrics.benchmark}`)
                .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return summary metrics for the Collection - asset param - no agg', async function () {
                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary?assetId=${environment.testAsset.assetId}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return summary metrics for the Collection - labelId param - no agg', async function () {
                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary?labelId=${environment.testCollection.testLabel}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return summary metrics for the Collection - labelName param - no agg', async function () {
                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary?labelName=${environment.testCollection.testLabelName}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)

                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
        })

        describe('GET - getMetricsSummaryByCollectionAggAsset - /collections/{collectionId}/metrics/summary/asset', function () {

          
            it('Return summary metrics asset agg - summary', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/asset`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return summary metrics - asset agg - with param assetId', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/asset?assetId=${environment.testAsset.assetId}`)
                    .set('Authorization', `Bearer ${user.token}`)
                await storeResponseData(this.test.title, user.name, res.body)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return summary metrics - asset agg - with benchmarkID', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/asset?benchmarkId=${environment.metrics.benchmark}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
        
            it('Return summary metrics - asset agg - with param labelId', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/asset?labelId=${environment.testCollection.testLabel}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return summary metrics - asset agg - with param labelName', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/asset?labelName=${environment.metrics.labelFull}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
        })

        describe('GET - getMetricsSummaryByCollectionAgg - /collections/{collectionId}/metrics/summary/collection', function () {

            it('Return summary metrics - collection agg - no params', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/collection`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return summary metrics - collection agg - asset param', async function () {


                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/collection?assetId=${environment.testAsset.assetId}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return summary metrics - collection agg - labelId param', async function () {
              

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/collection?labelId=${environment.testCollection.testLabel}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return summary metrics - collection agg - label name  param', async function () {
               
                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/collection?labelName=${environment.metrics.labelFull}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })    
            it('Return summary metrics - collection agg - benchmark param', async function () {
              

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/collection?benchmarkId=${environment.metrics.benchmark}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
        })

        describe('GET - getMetricsSummaryByCollectionAggLabel - /collections/{collectionId}/metrics/summary/label', function () {


            it('Return summary metrics - label agg', async function () {

               
                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/label`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
                })
            it('Return summary metrics - label agg - param benchmark', async function () {

              
                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/label?benchmarkId=${environment.metrics.benchmark}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return summary metrics - label agg - param assetId', async function () {

            
                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/label?assetId=${environment.testAsset.assetId}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return summary metrics - label agg - param labelId', async function () {

        

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/label?labelId=${environment.testCollection.testLabel}`)
                    .set('Authorization', `Bearer ${user.token}`)
                   
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }

            })
            it('Return summary metrics - label agg - param labelName', async function () {


                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/label?labelName=${environment.testCollection.testLabelName}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
        })

        describe('GET - getMetricsSummaryByCollectionAggStig - /collections/{collectionId}/metrics/summary/summary/stig', function () {


            it('Return summary metrics - stig agg', async function () {

        

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/stig`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return summary metrics - stig agg - param benchmark', async function () {


                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/stig?benchmarkId=${environment.metrics.benchmark}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return summary metrics - stig agg - param asset', async function () {


                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/stig?assetId=${environment.testAsset.assetId}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return summary metrics - stig agg - param labelId', async function () {

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/stig?labelId=${environment.testCollection.testLabel}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
            it('Return summary metrics - stig agg - param labelName', async function () {
                

                const res = await chai.request(config.baseUrl)
                    .get(`/collections/${environment.testCollection.collectionId}/metrics/summary/stig?labelName=${environment.metrics.labelFull}`)
                    .set('Authorization', `Bearer ${user.token}`)
                const expectedData = loadExpectedData(this.test.title)
                expect(res).to.have.status(200)
                if(user.name === 'lvl1'){
                    expect(res.body).to.eql(expectedData['lvl1'])
                }
                else 
                {
                    expect(res.body).to.eql(expectedData['stigmanadmin'])
                }
            })
        })
    })
  }
})

