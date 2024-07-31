const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const xml2js = require('xml2js');

const user =
  {
    "name": "admin",
    "grant": "Owner",
    "token":
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ2ODEwMzUsImlhdCI6MTY3MDU0MDIzNiwiYXV0aF90aW1lIjoxNjcwNTQwMjM1LCJqdGkiOiI0N2Y5YWE3ZC1iYWM0LTQwOTgtOWJlOC1hY2U3NTUxM2FhN2YiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJiN2M3OGE2Mi1iODRmLTQ1NzgtYTk4My0yZWJjNjZmZDllZmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjMzNzhkYWZmLTA0MDQtNDNiMy1iNGFiLWVlMzFmZjczNDBhYyIsInNlc3Npb25fc3RhdGUiOiI4NzM2NWIzMy0yYzc2LTRiM2MtODQ4NS1mYmE1ZGJmZjRiOWYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImNyZWF0ZV9jb2xsZWN0aW9uIiwiZGVmYXVsdC1yb2xlcy1zdGlnbWFuIiwiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb24gc3RpZy1tYW5hZ2VyOnN0aWc6cmVhZCBzdGlnLW1hbmFnZXI6dXNlcjpyZWFkIHN0aWctbWFuYWdlcjpvcCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbjpyZWFkIHN0aWctbWFuYWdlcjpvcDpyZWFkIHN0aWctbWFuYWdlcjp1c2VyIHN0aWctbWFuYWdlciBzdGlnLW1hbmFnZXI6c3RpZyIsInNpZCI6Ijg3MzY1YjMzLTJjNzYtNGIzYy04NDg1LWZiYTVkYmZmNGI5ZiIsIm5hbWUiOiJTVElHTUFOIEFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3RpZ21hbmFkbWluIiwiZ2l2ZW5fbmFtZSI6IlNUSUdNQU4iLCJmYW1pbHlfbmFtZSI6IkFkbWluIn0.a1XwJZw_FIzwMXKo-Dr-n11me5ut-SF9ni7ylX-7t7AVrH1eAqyBxX9DXaxFK0xs6YOhoPsh9NyW8UFVaYgtF68Ps6yzoiqFEeiRXkpN5ygICN3H3z6r-YwanLlEeaYR3P2EtHRcrBtCnt0VEKKbGPWOfeiNCVe3etlp9-NQo44"
  }
const lvl1=
{
  "name": "lvl1",
  "grant": "Restricted",
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ3MDg5ODQsImlhdCI6MTY3MDU2ODE4NCwiYXV0aF90aW1lIjoxNjcwNTY4MTg0LCJqdGkiOiIxMDhmMDc2MC0wYmY5LTRkZjEtYjE0My05NjgzNmJmYmMzNjMiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJlM2FlMjdiOC1kYTIwLTRjNDItOWRmOC02MDg5ZjcwZjc2M2IiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjE0ZmE5ZDdkLTBmZTAtNDQyNi04ZmQ5LTY5ZDc0YTZmMzQ2NCIsInNlc3Npb25fc3RhdGUiOiJiNGEzYWNmMS05ZGM3LTQ1ZTEtOThmOC1kMzUzNjJhZWM0YzciLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtc3RpZ21hbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InJlYWxtLW1hbmFnZW1lbnQiOnsicm9sZXMiOlsidmlldy11c2VycyIsInF1ZXJ5LWdyb3VwcyIsInF1ZXJ5LXVzZXJzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbiBzdGlnLW1hbmFnZXI6c3RpZzpyZWFkIHN0aWctbWFuYWdlcjp1c2VyOnJlYWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb246cmVhZCIsInNpZCI6ImI0YTNhY2YxLTlkYzctNDVlMS05OGY4LWQzNTM2MmFlYzRjNyIsIm5hbWUiOiJyZXN0cmljdGVkIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibHZsMSIsImdpdmVuX25hbWUiOiJyZXN0cmljdGVkIn0.OqLARi5ILt3j2rMikXy0ECTTqjWco0-CrMwzE88gUv2i8rVO9kMgVsXbtPk2L2c9NNNujnxqg7QIr2_sqA51saTrZHvzXcsT8lBruf74OubRMwcTQqJap-COmrzb60S7512k0WfKTYlHsoCn_uAzOb9sp8Trjr0NksU8OXCElDU"
}

describe('Asset get tests using "admin" user ', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  describe('GET - getAsset - /assets/{assetId}', () => {
  
    it('Return an Asset (with STIGgrants projection)', async () => {
      const res = await chai
        .request(config.baseUrl)
        .get(`/assets/${environment.testAsset.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')        
      expect(res.body.name).to.eql(environment.testAsset.name)
      expect(res.body.collection.collectionId).to.eql(environment.testAsset.collectionId)
      expect(res.body.labelIds).to.be.an('array').of.length(2)
      
      if(res.request.url.includes('/projection=stigGrants/')){
        expect(res.body.stigGrants).to.exist;
        expect(res.body.stigGrants).to.be.an("array").of.length.at.least(1)
        for (let grant of res.body.stigGrants){
            expect(grant.benchmarkId).to.be.oneOf(environment.testAsset.validStigs);
            for(let user of grant.users){
              expect(user.userId).to.be.oneOf(environment.testAsset.usersWithGrant);
            }
        }
      }
      if(res.request.url.includes('/projection=stigs/')){
        expect(res.body.stigs).to.exist;
        expect(res.body.stigs).to.be.an("array").of.length.at.least(1)
        for (let stig of res.body.stigs){
            expect(stig.benchmarkId).to.be.oneOf(environment.testAsset.validStigs);
        }
      }
      if(res.request.url.includes('/projection=statusStats/')){
        expect(res.body.statusStats).to.exist;
        expect(res.body.statusStats).to.be.an("object")
      }
    })

    it('Return an Asset (with STIGgrants projection) - Asset - no assigned STIGs', async () => {
      const res = await chai
        .request(config.baseUrl)
        .get(`/assets/${environment.testAssetNoStigs.assetId}?projection=statusStats&projection=stigs&projection=stigGrants`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')        
      expect(res.body.name).to.eql(environment.testAssetNoStigs.name)
      expect(res.body.collection.collectionId).to.eql(environment.testAssetNoStigs.collectionId)
      expect(res.body.labelIds).to.be.an('array').of.length(0)

      if(res.request.url.includes('/projection=stigGrants/')){
        expect(res.body.stigGrants).to.exist;
        expect(res.body.stigGrants).to.be.an("array").of.length(0)
      }

      if(res.request.url.includes('/projection=stigs/')){
        expect(res.body.stigs).to.exist;
        expect(res.body.stigs).to.be.an("array").of.length(0)
      }
      if(res.request.url.includes('/projection=statusStats/')){
        expect(res.body.statusStats).to.exist;
        expect(res.body.statusStats).to.be.an("object")
      }
    })

    it('Return an Asset (without STIGgrants projection)', async () => {
      const res = await chai
        .request(config.baseUrl)
        .get(`/assets/${environment.testAsset.assetId}?projection=statusStats&projection=stigs`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')        
      expect(res.body.name).to.eql(environment.testAsset.name)
      expect(res.body.collection.collectionId).to.eql(environment.testAssetNoStigs.collectionId)
      expect(res.body.stigGrants).to.not.exist
      if(res.request.url.includes('/projection=stigs/')){
        expect(res.body.stigs).to.exist;
        expect(res.body.stigs).to.be.an("array").of.length.at.least(1)
        for (let stig of res.body.stigs){
            expect(stig.benchmarkId).to.be.oneOf(environment.testAsset.validStigs);
        }
      }
      if(res.request.url.includes('/projection=statusStats/')){
        expect(res.body.statusStats).to.exist;
        expect(res.body.statusStats).to.be.an("object")
      }
    })

    it('Return an Asset (with STIGgrants projection) - Asset - no assigned STIGs', async () => {
      const res = await chai
        .request(config.baseUrl)
        .get(`/assets/${environment.testAssetNoStigs.assetId}?projection=statusStats&projection=stigs`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')        
      expect(res.body.name).to.eql(environment.testAssetNoStigs.name)
      expect(res.body.collection.collectionId).to.eql(environment.testAssetNoStigs.collectionId)

      if(res.request.url.includes('/projection=stigs/')){
        expect(res.body.stigs).to.exist;
        expect(res.body.stigs).to.be.an("array").of.length(0)
      }
      if(res.request.url.includes('/projection=statusStats/')){
        expect(res.body.statusStats).to.exist;
        expect(res.body.statusStats).to.be.an("object")
      }
    })
  })

  describe('GET - getAssetMetadata - /assets/{assetId}/metadata,', () => {
    it('Return the Metadata for an Asset', async () => {
      const res = await chai
        .request(config.baseUrl)
        .get(`/assets/${environment.testAsset.assetId}/metadata`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')      
      expect(res.body.testkey).to.exist
      expect(res.body.testkey).to.eql(environment.testAsset.metadataValue)
    })
  })
  describe('GET - getAssetMetadataKeys - /assets/{assetId}/metadata/keys', () => {
    it('Return the Metadata KEYS for an Asset', async () => {
      const res = await chai
        .request(config.baseUrl)
        .get(`/assets/${environment.testAsset.assetId}/metadata/keys`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.include(environment.testAsset.metadataKey)
    })
  })

  describe('GET - getAssetMetadataValue - /assets/{assetId}/metadata/keys/{key}', () => {
    it('Return the Metadata VALUE for an Asset metadata KEY', async () => {

      const res = await chai
        .request(config.baseUrl)
        .get(`/assets/${environment.testAsset.assetId}/metadata/keys/${environment.testAsset.metadataKey}`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('string')
      expect(res.body).to.include(environment.testAsset.metadataValue)
    })
  })

  describe('GET - getAssets - /assets', () => {

    it('Assets accessible to the requester (with STIG grants projection)', async () => {
      const res = await chai
        .request(config.baseUrl).get(`/assets?collectionId=${environment.testCollection.collectionId}&benchmarkId=${environment.testCollection.benchmark}&projection=statusStats&projection=stigs&projection=stigGrants`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)

      expect(res.body).to.be.an('array').of.length(3)
      
      const jsonData = res.body;
      const assetMatchString = environment.assetMatchString
      const regex = new RegExp(assetMatchString)
      
      for (let asset of jsonData){
        expect(asset.name).to.match(regex)

        if(res.request.url.includes('/projection=statusStats/')){
          expect(asset.statusStats).to.exist;
          if(asset.assetId === environment.testAsset.assetId){
            if (res.request.url.includes('benchmarkId=')) {
              expect(asset.statusStats.ruleCount).to.eql(81);
            } else {
              expect(asset.statusStats.ruleCount).to.eql(368);
            }
          }
        }
        if (res.request.url.includes('projection=stigs')) {
          for(let stig of asset.stigs){
            expect(stig.benchmarkId).to.be.oneOf(environment.testCollection.validStigs);
          }
        }
        if (res.request.url.includes('projection=stigGrants')) {
          for(let grant of asset.stigGrants){
            expect(grant.benchmarkId).to.be.oneOf(environment.testCollection.validStigs);
          }
        }
      }
    })

    it('Assets accessible to the requester (with STIG grants projection - no benchmark specified)', async () => {
      const res = await chai
        .request(config.baseUrl).get(`/assets?collectionId=${environment.testCollection.collectionId}&projection=statusStats&projection=stigs&projection=stigGrants`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)

      expect(res.body).to.be.an('array').of.length(4)
    
      const jsonData = res.body;
      const assetMatchString = environment.assetMatchString
      const regex = new RegExp(assetMatchString)
      
      for (let asset of jsonData){
        expect(asset.name).to.match(regex)

        if(res.request.url.includes('/projection=statusStats/')){
          expect(asset.statusStats).to.exist;
          if(asset.assetId === environment.testAsset.assetId){
            if (res.request.url.includes('benchmarkId=')) {
              expect(asset.statusStats.ruleCount).to.eql(81);
            } else {
              expect(asset.statusStats.ruleCount).to.eql(368);
            }
          }
        }
        if (res.request.url.includes('projection=stigs')) {
          for(let stig of asset.stigs){
            expect(stig.benchmarkId).to.be.oneOf(environment.testCollection.validStigs);
          }
        }
        if (res.request.url.includes('projection=stigGrants')) {
          for(let grant of asset.stigGrants){
            expect(grant.benchmarkId).to.be.oneOf(environment.testCollection.validStigs);
          }
        }
      }

    })

    it('Assets accessible to the requester - labels', async () => {
      const res = await chai
        .request(config.baseUrl).get(`/assets?collectionId=${environment.testCollection.collectionId}&labelId=${environment.testCollection.testLabel}`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array').of.length(2)

      for(let asset of res.body){
        expect(asset.labelIds).to.include(environment.testCollection.testLabel)
      }
    })

  })

  describe('GET - getChecklistByAsset - /assets/{assetId}/checklists', () => {

    it('Return the Checklist for the supplied Asset with benchmark query param', async () => {

      const res = await chai
        .request(config.baseUrl)
        .get(`/assets/${environment.testAsset.assetId}/checklists?benchmarkId=${environment.testCollection.benchmark}`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)

      let cklData

      xml2js.parseString(res.body, function (err, result) {
        cklData = result
      })
      let cklHostName = cklData.CHECKLIST.ASSET[0].HOST_NAME[0]
      let cklIStigs = cklData.CHECKLIST.STIGS[0].iSTIG
   
      const assetMatchString = environment.assetMatchString
      const regex = new RegExp(assetMatchString)
      expect(cklHostName).to.match(regex)

      for (let stig of cklIStigs){
        for(let stigData of stig.STIG_INFO[0].SI_DATA){
          if (stigData.SID_NAME[0] == 'stigid'){
            currentStigId = stigData.SID_DATA[0]
            expect(currentStigId).to.be.eql(environment.testCollection.benchmark)
         }
        }
        let cklVulns = stig.VULN;
        expect(cklVulns).to.be.an('array');
        if (currentStigId == 'VPN_SRG_TEST') {
            expect(cklVulns).to.be.an('array').of.length(environment.metrics.checklistLength);
        }
      }
    })

    it('Return the Checklist for the supplied Asset and MULTI-STIG JSON (.cklB) - no specified STIG', async () => {
        
        const res = await chai
          .request(config.baseUrl)
          .get(`/assets/${environment.testAsset.assetId}/checklists?format=cklb`)
          .set('Authorization', 'Bearer ' + user.token)
  
        expect(res).to.have.status(200)
        let cklbData = res.body
        let cklbHostName = cklbData.target_data.host_name
        let cklbIStigs = cklbData.stigs

        const assetMatchString = environment.assetMatchString
        const regex = new RegExp(assetMatchString)
        expect(cklbHostName).to.match(regex)

        for (let stig of cklbIStigs){
          let stigId = stig.stig_id
          expect(stigId).to.be.oneOf(environment.testCollection.validStigs)
          let cklbVulns = stig.rules;
          expect(cklbVulns).to.be.an('array');
          if (stigId == 'VPN_SRG_TEST') {
              expect(cklbVulns).to.be.an('array').of.length(environment.metrics.checklistLength);
          }
        }
    })

    it('Return the Checklist for the supplied Asset and MULTI-STIG JSON (.cklB) - specific STIGs', async () => {

      const res = await chai
        .request(config.baseUrl)
        .get(`/assets/${environment.testAsset.assetId}/checklists?format=cklb&benchmarkId=${environment.testCollection.benchmark}&benchmarkId=Windows_10_STIG_TEST`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      let cklbData = res.body
      let cklbHostName = cklbData.target_data.host_name
      let cklbIStigs = cklbData.stigs

      const assetMatchString = environment.assetMatchString
      const regex = new RegExp(assetMatchString)
      expect(cklbHostName).to.match(regex)

      for (let stig of cklbIStigs){
        let stigId = stig.stig_id
        expect(stigId).to.be.oneOf(environment.testCollection.validStigs)
        let cklbVulns = stig.rules;
        expect(cklbVulns).to.be.an('array');
        if (stigId == 'VPN_SRG_TEST') {
            expect(cklbVulns).to.be.an('array').of.length(environment.metrics.checklistLength);
        }
      }

    })

    it('Return the Checklist for the supplied Asset and MULTI-STIG XML (.CKL) - no specified stigs', async () => {

      const res = await chai
        .request(config.baseUrl)
        .get(`/assets/${environment.testAsset.assetId}/checklists/`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)

      let cklData

      xml2js.parseString(res.body, function (err, result) {
        cklData = result
      })

      let cklHostName = cklData.CHECKLIST.ASSET[0].HOST_NAME[0]
      let cklIStigs = cklData.CHECKLIST.STIGS[0].iSTIG

      const assetMatchString = environment.assetMatchString
      const regex = new RegExp(assetMatchString)
      expect(cklHostName).to.match(regex)

      for (let stig of cklIStigs){
        for(let stigData of stig.STIG_INFO[0].SI_DATA){
          if (stigData.SID_NAME[0] == 'stigid'){
            currentStigId = stigData.SID_DATA[0]
            expect(currentStigId).to.be.oneOf(environment.testCollection.validStigs)
         }
        }
        let cklVulns = stig.VULN;
        expect(cklVulns).to.be.an('array');
        if (currentStigId == 'VPN_SRG_TEST') {
            expect(cklVulns).to.be.an('array').of.length(environment.metrics.checklistLength);
        }
      }
    })

    it('Return the Checklist for the supplied Asset and MULTI-STIG XML (.CKL) - specified stigs', async () => {
        
        const res = await chai
          .request(config.baseUrl)
          .get(`/assets/${environment.testAsset.assetId}/checklists?benchmarkId=${environment.testCollection.benchmark}&benchmarkId=Windows_10_STIG_TEST`)
          .set('Authorization', 'Bearer ' + user.token)
  
        expect(res).to.have.status(200)
  
        let cklData
  
        xml2js.parseString(res.body, function (err, result) {
          cklData = result
        })
  
        let cklHostName = cklData.CHECKLIST.ASSET[0].HOST_NAME[0]
        let cklIStigs = cklData.CHECKLIST.STIGS[0].iSTIG
  
        const assetMatchString = environment.assetMatchString
        const regex = new RegExp(assetMatchString)
        expect(cklHostName).to.match(regex)
  
        for (let stig of cklIStigs){
          for(let stigData of stig.STIG_INFO[0].SI_DATA){
            if (stigData.SID_NAME[0] == 'stigid'){
              currentStigId = stigData.SID_DATA[0]
              expect(currentStigId).to.be.oneOf(environment.testCollection.validStigs)
          }
          }
          let cklVulns = stig.VULN;
          expect(cklVulns).to.be.an('array');
          if (currentStigId == 'VPN_SRG_TEST') {
              expect(cklVulns).to.be.an('array').of.length(environment.metrics.checklistLength);
          }
        }
    })
  })

  describe('GET - getChecklistByAssetStig - /assets/{assetId}/checklists/{benchmarkId}/{revisionStr}', () => {

    it('Return the Checklist for the supplied Asset and benchmarkId and revisionStr', async () => {

      const res = await chai
        .request(config.baseUrl)
        .get(`/assets/${environment.testAsset.assetId}/checklists/${environment.testCollection.benchmark}/${environment.testCollection.revisionStr}?format=ckl`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)

      let cklData

      xml2js.parseString(res.body, function (err, result) {
        cklData = result
      })

      let cklHostName = cklData.CHECKLIST.ASSET[0].HOST_NAME[0]
      let cklIStigs = cklData.CHECKLIST.STIGS[0].iSTIG

      const assetMatchString = environment.assetMatchString
      const regex = new RegExp(assetMatchString)
      expect(cklHostName).to.match(regex)

      for (let stig of cklIStigs){
        for(let stigData of stig.STIG_INFO[0].SI_DATA){
          if (stigData.SID_NAME[0] == 'stigid'){
            currentStigId = stigData.SID_DATA[0]
            expect(currentStigId).to.be.eql(environment.testCollection.benchmark)
         }
        }
        let cklVulns = stig.VULN;
        expect(cklVulns).to.be.an('array');
        if (currentStigId == 'VPN_SRG_TEST') {
            expect(cklVulns).to.be.an('array').of.length(environment.metrics.checklistLength);
        }
      }
    })

    it('Return the Checklist for the supplied Asset and STIG XML (.cklB) - specific STIG', async () => {

      const res = await chai
        .request(config.baseUrl)
        .get(`/assets/${environment.testAsset.assetId}/checklists/${environment.testCollection.benchmark}/${environment.testCollection.revisionStr}?format=cklb`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
    
      let cklbData = res.body
      let cklbHostName = cklbData.target_data.host_name
      let cklbIStigs = cklbData.stigs

      const assetMatchString = environment.assetMatchString
      const regex = new RegExp(assetMatchString)
      expect(cklbHostName).to.match(regex)

      for (let stig of cklbIStigs){
        let stigId = stig.stig_id
        expect(stigId).to.be.oneOf(environment.testCollection.validStigs)
        let cklbVulns = stig.rules;
        expect(cklbVulns).to.be.an('array');
        if (stigId == 'VPN_SRG_TEST') {
            expect(cklbVulns).to.be.an('array').of.length(environment.metrics.checklistLength);
        }
      }
    })

    it('Return the Checklist for the supplied Asset and STIG JSON', async () => {

      const res = await chai
        .request(config.baseUrl)
        .get(`/assets/${environment.testAsset.assetId}/checklists/${environment.testCollection.benchmark}/${environment.testCollection.revisionStr}?format=json`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array').of.length(environment.metrics.checklistLength)
    })
  })

  describe('GET - getStigsByAsset - /assets/{assetId}/stigs', () => {

    it('Return the Checklist for the supplied Asset and benchmarkId and revisionStr - rules', async () => {

      const res = await chai
        .request(config.baseUrl)
        .get(`/assets/${environment.testAsset.assetId}/stigs`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      
      for(let stig of res.body){
        expect(stig.benchmarkId).to.be.oneOf(environment.testCollection.validStigs)
      }
    })
  })

  describe('GET - getAssetsByCollectionLabelId - /collections/{collectionId}/labels/{labelId}/assets', () => {

    it('Return the Checklist for the supplied Asset and benchmarkId - rules', async () => {

      const res = await chai
        .request(config.baseUrl)
        .get(`/collections/${environment.testCollection.collectionId}/labels/${environment.testCollection.testLabel}/assets`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array').of.length(2)
      const assetMatchString = environment.assetMatchString
      const regex = new RegExp(assetMatchString)
      for(let asset of res.body){
        expect(asset.name).to.match(regex)
        expect(asset.assetId).to.be.oneOf(['42','62'])
      }   
    })
  })

  describe('GET - getAssetsByStig - /collections/{collectionId}/stigs/{benchmarkId}/assets', () => {

    it('Assets in a Collection attached to a STIG', async () => {

      const res = await chai
        .request(config.baseUrl)
        .get(`/collections/${environment.testCollection.collectionId}/stigs/${environment.testCollection.benchmark}/assets?projection=restrictedUserAccess`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.an('array').of.length(3)
      const assetMatchString = environment.assetMatchString
      const regex = new RegExp(assetMatchString)
      for(let asset of res.body){
        expect(asset.name).to.match(regex)

        if(res.request.url.includes('/projection=restrictedUserAccess/')){
          expect(asset.restrictedUserAccess).to.exist;
        }
      }   
    })
    it('Assets in a Collection attached to a STIG - label-lvl1', async () => {

      const res = await chai
        .request(config.baseUrl)
        .get(`/collections/${environment.testCollection.collectionId}/stigs/${environment.testCollection.benchmark}/assets?projection=restrictedUserAccess&labelId=${environment.lvl1.label}`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.an('array').of.length(1)
      const assetMatchString = environment.assetMatchString
      const regex = new RegExp(assetMatchString)
      for(let asset of res.body){
        expect(asset.name).to.match(regex)
        if(res.request.url.includes('/projection=restrictedUserAccess/')){
          expect(asset.restrictedUserAccess).to.exist;
        }
      }   
    })
    it('Assets in a Collection attached to a STIG - label', async () => {

      const res = await chai
        .request(config.baseUrl)
        .get(`/collections/${environment.testCollection.collectionId}/stigs/${environment.testCollection.benchmark}/assets?projection=restrictedUserAccess&labelId=${environment.testCollection.testLabel}`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.an('array').of.length(2)
      const assetMatchString = environment.assetMatchString
      const regex = new RegExp(assetMatchString)
      for(let asset of res.body){
        expect(asset.name).to.match(regex)
        if(res.request.url.includes('/projection=restrictedUserAccess/')){
          expect(asset.restrictedUserAccess).to.exist;
        }
      }   
    })
  })

})

describe('Asset get tests using "lvl1" user ', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  describe('GET - getAssets - /assets', () => {

    it('Assets accessible to the requester - labels', async () => {
      const res = await chai
        .request(config.baseUrl).get(`/assets?collectionId=${environment.testCollection.collectionId}&labelId=${environment.testCollection.testLabel}`)
        .set('Authorization', 'Bearer ' + lvl1.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array').of.length(1)

      for(let asset of res.body){
        expect(asset.labelIds).to.include(environment.testCollection.testLabel)
      }
    })
    it('Assets accessible to the requester - No StigGrants (for lvl1 user success)', async () => {
      const res = await chai
        .request(config.baseUrl).get(`/assets?collectionId=${environment.testCollection.collectionId}&benchmarkId=${environment.testCollection.benchmark}&projection=statusStats&projection=stigs`)
        .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)

      expect(res.body).to.be.an('array').of.length(3)
      
      const jsonData = res.body;
      const assetMatchString = environment.assetMatchString
      const regex = new RegExp(assetMatchString)
      
      for (let asset of jsonData){
        expect(asset.name).to.match(regex)

        if(res.request.url.includes('/projection=statusStats/')){
          expect(asset.statusStats).to.exist;
          if(asset.assetId === environment.testAsset.assetId){
            if (res.request.url.includes('benchmarkId=')) {
              expect(asset.statusStats.ruleCount).to.eql(81);
            } else {
              expect(asset.statusStats.ruleCount).to.eql(368);
            }
          }
        }
        if (res.request.url.includes('projection=stigs')) {
          for(let stig of asset.stigs){
            expect(stig.benchmarkId).to.be.oneOf(environment.testCollection.validStigs);
          }
        }
      }
    })
  })


  //
  describe('GET - getAssetsByCollectionLabelId - /collections/{collectionId}/labels/{labelId}/assets', () => {

    it('Return the Checklist for the supplied Asset and benchmarkId - rules', async () => {

      const res = await chai
        .request(config.baseUrl)
        .get(`/collections/${environment.testCollection.collectionId}/labels/${environment.testCollection.testLabel}/assets`)
        .set('Authorization', 'Bearer ' + lvl1.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array').of.length(1)
      const assetMatchString = environment.assetMatchString
      const regex = new RegExp(assetMatchString)
      for(let asset of res.body){
        expect(asset.name).to.match(regex)
        expect(asset.assetId).to.be.oneOf(['42','62'])
      }   
    })
  })

  //
  describe('GET - getAssetsByStig - /collections/{collectionId}/stigs/{benchmarkId}/assets', () => {

    it('Assets in a Collection attached to a STIG', async () => {

      const res = await chai
        .request(config.baseUrl)
        .get(`/collections/${environment.testCollection.collectionId}/stigs/${environment.testCollection.benchmark}/assets?projection=restrictedUserAccess`)
        .set('Authorization', 'Bearer ' + lvl1.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.an('array').of.length(2)
      const assetMatchString = environment.assetMatchString
      const regex = new RegExp(assetMatchString)
      for(let asset of res.body){
        expect(asset.name).to.match(regex)

        if(res.request.url.includes('/projection=restrictedUserAccess/')){
          expect(asset.restrictedUserAccess).to.exist;
        }
      }   
    })
    it('Assets in a Collection attached to a STIG - label-lvl1', async () => {

      const res = await chai
        .request(config.baseUrl)
        .get(`/collections/${environment.testCollection.collectionId}/stigs/${environment.testCollection.benchmark}/assets?projection=restrictedUserAccess&labelId=${environment.lvl1.label}`)
        .set('Authorization', 'Bearer ' + lvl1.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.an('array').of.length(1)
      const assetMatchString = environment.assetMatchString
      const regex = new RegExp(assetMatchString)
      for(let asset of res.body){
        expect(asset.name).to.match(regex)
        if(res.request.url.includes('/projection=restrictedUserAccess/')){
          expect(asset.restrictedUserAccess).to.exist;
        }
      }   
    })
    it('Assets in a Collection attached to a STIG - label', async () => {

      const res = await chai
        .request(config.baseUrl)
        .get(`/collections/${environment.testCollection.collectionId}/stigs/${environment.testCollection.benchmark}/assets?projection=restrictedUserAccess&labelId=${environment.testCollection.testLabel}`)
        .set('Authorization', 'Bearer ' + lvl1.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.an('array').of.length(1)
      const assetMatchString = environment.assetMatchString
      const regex = new RegExp(assetMatchString)
      for(let asset of res.body){
        expect(asset.name).to.match(regex)
        if(res.request.url.includes('/projection=restrictedUserAccess/')){
          expect(asset.restrictedUserAccess).to.exist;
        }
      }   
    })
  })

})
