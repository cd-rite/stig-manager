const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const enviornment = require('../../enviornment.json')

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

const lvl2 =  {
  "name": "lvl2",
  "token":"eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ3MDkwNzQsImlhdCI6MTY3MDU2ODI3NSwiYXV0aF90aW1lIjoxNjcwNTY4Mjc0LCJqdGkiOiIwM2Y0OWVmYy1jYzcxLTQ3MTItOWFjNy0xNGY5YzZiNDc1ZGEiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJjMTM3ZDYzNy1mMDU2LTRjNzItOWJlZi1lYzJhZjdjMWFiYzciLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjQ5MzY5ZTdmLWEyZGYtNDkxYS04YjQ0LWEwNDJjYWYyMzhlYyIsInNlc3Npb25fc3RhdGUiOiJjNmUyZTgyNi0xMzMzLTRmMDctOTc4OC03OTQxMGM5ZjJkMDYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtc3RpZ21hbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InJlYWxtLW1hbmFnZW1lbnQiOnsicm9sZXMiOlsidmlldy11c2VycyIsInF1ZXJ5LWdyb3VwcyIsInF1ZXJ5LXVzZXJzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbiBzdGlnLW1hbmFnZXI6c3RpZzpyZWFkIHN0aWctbWFuYWdlcjp1c2VyOnJlYWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb246cmVhZCIsInNpZCI6ImM2ZTJlODI2LTEzMzMtNGYwNy05Nzg4LTc5NDEwYzlmMmQwNiIsIm5hbWUiOiJsdmwyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibHZsMiIsImdpdmVuX25hbWUiOiJsdmwyIn0.F1i8VVLNkVsaW9i83vbVyB9eFiSxX_9ZpR6K7Zs0r7pKOCMJnSOHeKIHrlMO4hW8DrbmSRrkrrXExwNtw6zUsuH8_1uxx-SVUkaQyHEMfbx1_TstkTOFcjxIWqtlVvwPIt-DlTpQ_IFuby8wDAIxUvNwogn2OoybzAy1CDMcpIA"
}

describe('Collection get tests using "admin" user ', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  
  describe('GET - getCollections - /collections', () => {

    it('Return a list of Collections accessible to the requester No Filters', async () => {
      const res = await chai.request(config.baseUrl)
        .get('/collections?elevate=true&projection=owners&projection=statistics')
        .set('Authorization', `Bearer ${user.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.have.lengthOf(7)
      
      // find collection id 21 and check owners projection
      const collection21 = res.body.find(collection => collection.collectionId === '21')
      const expectedOwners = ["87", "1", "45"]
      for(const owner of collection21.owners){
        expect(expectedOwners).to.include(owner.userId)
      }
      //check statistics projection
      expect(collection21.statistics.assetCount).to.equal(enviornment.testCollection.assetIDsInCollection.length)
      expect(collection21.statistics.checklistCount).to.equal(6)
      expect(collection21.statistics.grantCount).to.equal(7)
    })
    it('Return a list of Collections accessible to the requester No Filters no elevate!', async () => {
        const res = await chai.request(config.baseUrl)
          .get('/collections')
          .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf(6)
    })
    it('Return a list of Collections accessible to the requester METADATA', async () => {
        const res = await chai.request(config.baseUrl)
          .get(`/collections?metadata=${enviornment.collectionMetadataKey}%3A${enviornment.collectionMetadataValue}&elevate=true`)
          .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        const regex  = new RegExp(enviornment.testCollection.name)
        expect(res.body[0].name).to.match(regex)
        expect(res.body).to.have.lengthOf(1)
        expect(res.body[0].collectionId).to.equal('21')
        expect(res.body[0].metadata[enviornment.collectionMetadataKey]).to.equal(enviornment.collectionMetadataValue)

    })
    it('Return a list of Collections accessible to the requester NAME exact', async () => {
    const res = await chai.request(config.baseUrl)
        .get(`/collections?name=${enviornment.testCollection.name}&elevate=true&name-match=exact`)
        .set('Authorization', `Bearer ${user.token}`)
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('array')
    const regex  = new RegExp(enviornment.testCollection.name)
    expect(res.body[0].name).to.match(regex)
    expect(res.body).to.have.lengthOf(1)
    expect(res.body[0].collectionId).to.equal('21')
    })
    it('Return a list of Collections accessible to the requester NAME starts With', async () => {
    const res = await chai.request(config.baseUrl)
        .get(`/collections?name=${'Collection'}&elevate=true&name-match=startsWith`)
        .set('Authorization', `Bearer ${user.token}`)
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('array')
    expect(res.body).to.have.lengthOf(3)
    for(const collection of res.body){
        expect(collection.name).to.have.string('Collection')
    }
    })
    it('Return a list of Collections accessible to the requester NAME ends With', async () => {
    const res = await chai.request(config.baseUrl)
        .get(`/collections?name=${'X'}&elevate=true&name-match=endsWith`)
        .set('Authorization', `Bearer ${user.token}`)
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('array')
    expect(res.body).to.have.lengthOf(1)
    expect(res.body[0].name).to.have.string('X')
    })
    it('Return a list of Collections accessible to the requester NAME contains', async () => {
    const res = await chai.request(config.baseUrl)
        .get(`/collections?name=${'delete'}&elevate=true&name-match=contains`)
        .set('Authorization', `Bearer ${user.token}`)
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('array')
    expect(res.body).to.have.lengthOf(3)
    expect(res.body[0].name).to.have.string('delete')
    })
  })
  describe('GET - getCollection - /collections/{collectionId}', () => {
    it('Return a Collection', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}?elevate=true&projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs&projection=labels`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body.collectionId).to.equal('21')
        const regex  = new RegExp(enviornment.testCollection.name)
        expect(res.body.name).to.match(regex)

        // assets projection
        expect(res.body.assets).to.be.an('array').of.length(enviornment.testCollection.assetIDsInCollection.length)
        for(const asset of res.body.assets){
            expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
        }

        // grants projection
        expect(res.body.grants).to.be.an('array').of.length(7)
        for(const grant of res.body.grants){
            expect(enviornment.testCollection.userIdsWithGrant).to.include(grant.user.userId)
        }

        // owners projection
        expect(res.body.owners).to.be.an('array').of.length(3)
        for(const owner of res.body.owners){
            expect(enviornment.testCollection.owners).to.include(owner.userId)
        }

        // statistics projection
        expect(res.body.statistics.assetCount).to.equal(enviornment.testCollection.assetIDsInCollection.length)
    })
  })
  describe('GET - getChecklistByCollectionStig - /collections/{collectionId}/checklists/{benchmarkId}/{revisionStr}', () => {
    it('Return the Checklist for the supplied Collection and STIG-latest', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/checklists/${enviornment.testCollection.benchmark}/${'latest'}`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(81)
    })
    it('Return the Checklist for the supplied Collection and STIG-revStr', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/checklists/${enviornment.testCollection.benchmark}/${enviornment.testCollection.revisionStr}`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(81)
    })
  })
  
  describe('GET - getFindingsByCollection - /collections/{collectionId}/findings', () => {
    
    it('Return the Findings for the specified Collection by ruleId', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/findings?aggregator=cci&acceptedOnly=false&projection=assets&projection=groups&projection=rules&projection=stigs&projection=ccis`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(8)

        // assets projection
        for(const finding of res.body){
            expect(finding.assetCount).to.equal(finding.assets.length)
            for(const asset of finding.assets){
                expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
            }
        }
        // groups projection
        expect(res.body[0].groups).to.be.an('array').of.length(1)

        // rules projection
        expect(res.body[0].rules).to.be.an('array').of.length(1)
        
        // stigs projection
        expect(res.body[0].stigs).to.be.an('array').of.length(1)
        expect(res.body[0].stigs[0].ruleCount).to.equal(81)
        expect(res.body[0].stigs[0].benchmarkId).to.equal(enviornment.testCollection.benchmark)
        expect(res.body[0].stigs[0].revisionStr).to.equal(enviornment.testCollection.revisionStr)

        // ccis projection
        expect(res.body[0].ccis).to.be.an('array').of.length(1)
    })
    it('Return the Findings for the specified Collection by groupId', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/findings?aggregator=groupId&acceptedOnly=false&projection=assets`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(4)
        for(const finding of res.body){
          expect(finding.assetCount).to.equal(finding.assets.length)
          for(const asset of finding.assets){
              expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
          }
        }
    })
    it('Return the Findings for the specified Collection by cci', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/findings?aggregator=cci&acceptedOnly=false&projection=assets`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(8)
        for(const finding of res.body){
          expect(finding.assetCount).to.equal(finding.assets.length)
          for(const asset of finding.assets){
              expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
          }
        }
    })
    it('Return the Findings for the specified Collection for benchmarkId x ruleId', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/findings?aggregator=ruleId&acceptedOnly=false&benchmarkId=${enviornment.testCollection.benchmark}&projection=assets`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(3)
        for(const finding of res.body){
          expect(finding.assetCount).to.equal(finding.assets.length)
          for(const asset of finding.assets){
              expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
          }
        }
    })
    it('Return the Findings for the specified Collection for asset x ruleId Copy', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/findings?aggregator=ruleId&acceptedOnly=false&assetId=${enviornment.testAsset.assetId}&projection=assets`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(4)
        for(const finding of res.body){
          expect(finding.assetCount).to.equal(1)
          expect(finding.assets[0].assetId).to.equal(enviornment.testAsset.assetId)
        }
    })
  })
  describe('GET - getStigAssetsByCollectionUser - /collections/{collectionId}/grants/{userId}/access', () => {
    it('Return stig-asset grants for a lvl1 user in this collection.', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/grants/${enviornment.lvl1.userId}/access`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(2)
        const regex = new RegExp("asset")
        for (const stigAssetGrant of res.body) {
          expect(stigAssetGrant.asset.name).to.match(regex)
          expect(stigAssetGrant.benchmarkId).to.be.oneOf(enviornment.testCollection.validStigs)
          expect(stigAssetGrant.asset.assetId).to.be.oneOf(enviornment.testCollection.assetIDsInCollection)
        }
    })
  })
  describe('GET - getCollectionLabels - /collections/{collectionId}/labels', () => {

    it('Labels for the specified Collection', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/labels`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(2)
        for(const label of res.body){
          expect(enviornment.testCollection.labels).to.include(label.labelId)
          if (label.name == enviornment.testCollection.labelFull){
            expect(label.uses).to.equal(2);
         }
          if (label.name == enviornment.testCollection.testLabelName){
              expect(label.uses).to.equal(1);
          }
        }
    })
  })
  describe('GET - getCollectionLabelById - /collections/{collectionId}/labels/{labelId}', () => {
    it('Collection label', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/labels/${enviornment.testCollection.testLabel}`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body.labelId).to.equal(enviornment.testCollection.testLabel)
        expect(res.body.uses).to.equal(2)
        expect(res.body.name).to.equal('test-label-full')
    })
  })
  describe('GET - getCollectionMetadata - /collections/{collectionId}/metadata', () => {
    it('Metadata for the specified Collection', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/metadata?elevate=true`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body[enviornment.collectionMetadataKey]).to.equal(enviornment.collectionMetadataValue)
    })
  })
  describe('GET - getCollectionMetadataKeys - /collections/{collectionId}/metadata/keys', () => {

    it('Return the Metadata KEYS for a Collection', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/metadata/keys?elevate=true`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(4)
        const keys = enviornment.testCollection.allMetadata.map(meta => meta.key)
        for(const key of res.body){
          expect(keys).to.include(key)
        }
    })
  })
  describe('GET - getCollectionMetadataValue - /collections/{collectionId}/metadata/keys/{key}', () => {

    it('Return the Metadata VALUE for a Collection metadata KEY', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/metadata/keys/${enviornment.collectionMetadataKey}?elevate=true`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.equal(enviornment.collectionMetadataValue)
    })
  })
  describe('GET - getPoamByCollection - /collections/{collectionId}/poam', () => {

    it('Return a POAM-like spreadsheet aggregated by groupId', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/poam?aggregator=groupId&date=01%2F01%2F1970&office=MyOffice&status=Ongoing&acceptedOnly=true`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
    })
    it('Return a POAM-like spreadsheet aggregated by ruleId', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/poam?aggregator=ruleId&date=01%2F01%2F1970&office=MyOffice&status=Ongoing&acceptedOnly=true`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
    })
  })
  describe('GET - getReviewHistoryByCollection - /collections/{collectionId}/review-history', () => {

    it('History records - no query params', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/review-history`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(2)
        for(asset of res.body){
          if(asset.assetId === enviornment.reviewHistory.assetId){
            expect(asset.reviewHistories).to.be.an('array').of.length(2)
            for(const history of asset.reviewHistories){
              if(history.ruleId === enviornment.reviewHistory.ruleId){
                expect(history.history).to.be.an('array').of.length(2)
                for(const record of history.history){
                  expect(record.result).to.be.equal('pass')
                }
              }
            }
          }
        }
    })
    it('History records - asset only', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/review-history?assetId=${enviornment.reviewHistory.assetId}`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(1)
        for(asset of res.body){
          expect(asset.assetId).to.equal(enviornment.reviewHistory.assetId)
          expect(asset.reviewHistories).to.be.an('array').of.length(2)
          for(const history of asset.reviewHistories){
            if(history.ruleId === enviornment.reviewHistory.ruleId){
              expect(history.history).to.be.an('array').of.length(2)
              for(const record of history.history){
                expect(record.result).to.be.equal('pass')
              }
            }
          }
      }
    })
    it('History records - endDate only', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/review-history?endDate=${enviornment.reviewHistory.endDate}`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(2)
        for(asset of res.body){
          for(const history of asset.reviewHistories){
            expect(history.history).to.be.an('array').of.length(2)
            for(const record of history.history){
              expect(Date.parse(record.ts)).to.be.below(Date.parse(enviornment.reviewHistory.endDate))
            }
          }
        }
    })
    it('History records - startDate only', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/review-history?startDate=${enviornment.reviewHistory.startDate}`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(2)
        for(asset of res.body){
          for(const history of asset.reviewHistories){
            for(const record of history.history){
              expect(Date.parse(record.ts)).to.be.above(Date.parse(enviornment.reviewHistory.startDate))
            }
          }
        }
    })
    it('History records - rule only', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/review-history?ruleId=${enviornment.reviewHistory.ruleId}`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(2)
        for(asset of res.body){
          for(const history of asset.reviewHistories){
            expect(history.ruleId).to.equal(enviornment.reviewHistory.ruleId)
          }
        }
    })
    it('History records - start and end dates', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/review-history?startDate=${enviornment.reviewHistory.startDate}&endDate=${enviornment.reviewHistory.endDate}`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(2)
        for(asset of res.body){
          for(const history of asset.reviewHistories){
            for(const record of history.history){
              expect(Date.parse(record.ts)).to.be.above(Date.parse(enviornment.reviewHistory.startDate))
              expect(Date.parse(record.ts)).to.be.below(Date.parse(enviornment.reviewHistory.endDate))
            }
          }
        }
    })
    it('History records - status only', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/review-history?status=${enviornment.reviewHistory.status}`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(2)
        for(asset of res.body){
          for(const history of asset.reviewHistories){
            for(const record of history.history){
              expect(record.status.label).to.equal(enviornment.reviewHistory.status)
            }
          }
        }
    })
    it('History records - all params', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/review-history?status=${enviornment.reviewHistory.status}&assetId=${enviornment.reviewHistory.assetId}&ruleId=${enviornment.reviewHistory.ruleId}&startDate=${enviornment.reviewHistory.startDate}&endDate=${enviornment.reviewHistory.endDate}`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(1)
        //asset
        expect(res.body[0].assetId).to.equal(enviornment.reviewHistory.assetId)
        for(const history of res.body[0].reviewHistories){
          //rule 
          expect(history.ruleId).to.equal(enviornment.reviewHistory.ruleId)
          for(const record of history.history){
            // start/end date
            expect(Date.parse(record.ts)).to.be.above(Date.parse(enviornment.reviewHistory.startDate))
            expect(Date.parse(record.ts)).to.be.below(Date.parse(enviornment.reviewHistory.endDate))
            // status
            expect(record.status.label).to.equal(enviornment.reviewHistory.status)
          }
        }
        
      
    })
  })
  describe('GET - getReviewHistoryStatsByCollection - /collections/{collectionId}/review-history/stats', () => {

    it('History stats - no query params', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body.collectionHistoryEntryCount).to.equal(7)
        expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
    })
    it('History stats - startDate only', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?startDate=${enviornment.reviewHistory.startDate}`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body.collectionHistoryEntryCount).to.equal(7)
        expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
    })
    it('History stats - startDate - Asset Projection', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?startDate=${enviornment.reviewHistory.startDate}&projection=asset`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body.collectionHistoryEntryCount).to.equal(7)
        expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
        expect(res.body.assetHistoryEntryCounts.length).to.eql(2)
        let totalHistoryEntries = 0
        for(const asset of res.body.assetHistoryEntryCounts){
          expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
          totalHistoryEntries += asset.historyEntryCount
        }
        expect(totalHistoryEntries).to.equal(res.body.collectionHistoryEntryCount)
    })
    it('History stats - endDate only', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?endDate=${enviornment.reviewHistory.endDate}`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body.collectionHistoryEntryCount).to.equal(6)
        expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
    })
    it('History stats - start and end dates', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?endDate=${enviornment.reviewHistory.endDate}&startDate=${enviornment.reviewHistory.startDate}`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body.collectionHistoryEntryCount).to.equal(6)
        expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
    })
    it('History stats - asset only', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?assetId=${enviornment.reviewHistory.assetId}`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body.collectionHistoryEntryCount).to.equal(5)
    })
    it('History stats - rule only', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?ruleId=${enviornment.reviewHistory.ruleId}`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body.collectionHistoryEntryCount).to.equal(4)
        expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:30:38.000Z"))
    })
    it('History stats - status only', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?status=${enviornment.reviewHistory.status}`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body.collectionHistoryEntryCount).to.equal(3)
        expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
    })
    it('History stats - all params', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?endDate=${enviornment.reviewHistory.endDate}&startDate=${enviornment.reviewHistory.startDate}&assetId=${enviornment.reviewHistory.assetId}&status=${enviornment.reviewHistory.status}&ruleId=${enviornment.reviewHistory.ruleId}&projection=asset`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body.collectionHistoryEntryCount).to.equal(1)
        expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T23:37:45.000Z"))
        expect(res.body.assetHistoryEntryCounts.length).to.eql(1)
    })
  })
  describe('GET - getStigsByCollection - /collections/{collectionId}/stigs', () => {

    it('Return the STIGs mapped in the specified Collection', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/stigs`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(2)
        for(const stig of res.body){
          expect(enviornment.testCollection.validStigs).to.include(stig.benchmarkId)
          expect(stig.revisionPinned).to.equal(false)
        }
    })
    it('Return the STIGs mapped in the specified Collection - label', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/stigs?labelId=${enviornment.lvl1.label}`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(2)
        for(const stig of res.body){
          expect(enviornment.testCollection.validStigs).to.include(stig.benchmarkId)
          expect(stig.assetCount).to.equal(1)
        }
    })
    it('Return the STIGs mapped in the specified Collection - asset projection', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/stigs?projection=assets`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(2)
        for(const stig of res.body){
          expect(enviornment.testCollection.validStigs).to.include(stig.benchmarkId)
          expect(stig.assets).to.be.an('array').of.length(3)
          const regex = new RegExp("asset")
          for(const asset of stig.assets){
            expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
            expect(asset.name).to.match(regex)
          }
        }
    })
  })
  describe('GET - getStigByCollection - /collections/{collectionId}/stigs/{benchmarkId}', () => {

    it('Return Pinned Revision for this STIG', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/stigs/${enviornment.testCollection.benchmark}`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body.benchmarkId).to.equal(enviornment.testCollection.benchmark)
        expect(res.body.revisionStr).to.equal(enviornment.testCollection.revisionStr)
        expect(res.body.revisionPinned).to.equal(false)
    })

   
    it('Return the info about the specified STIG from the specified Collection - asset projection', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/stigs/${enviornment.testCollection.benchmark}?projection=assets`)
        .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body.benchmarkId).to.equal(enviornment.testCollection.benchmark)
        expect(res.body.revisionStr).to.equal(enviornment.testCollection.revisionStr)
        expect(res.body.revisionPinned).to.equal(false)
        const regex = new RegExp("asset")
        for(const asset of res.body.assets){
          expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
          expect(asset.name).to.match(regex)
        }
    })
  })
})

describe('Collection get tests using lvl1 user (where needed)', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  describe('GET - getStigsByCollection - /collections/{collectionId}/stigs', () => {

    it('Return the STIGs mapped in the specified Collection - label lvl1 user', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/stigs?labelId=${enviornment.lvl1.label}`)
        .set('Authorization', `Bearer ${lvl1.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(1)
        for(const stig of res.body){
          expect(enviornment.testCollection.validStigs).to.include(stig.benchmarkId)
          expect(stig.assetCount).to.equal(1)
        }
    })
    it('Return Pinned Revision for this STIG - lvl1 204 (really bad name not doing whats suppsoed to do )', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/stigs/${'Windows_10_STIG_TEST'}`)
        .set('Authorization', `Bearer ${lvl1.token}`)
        expect(res).to.have.status(204)
       
    })
  })
  describe('GET - getCollectionLabelById - /collections/{collectionId}/labels/{labelId}', () => {
    it('Collection label', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/labels/${enviornment.testCollection.testLabel}`)
        .set('Authorization', `Bearer ${lvl1.token}`)
        expect(res).to.have.status(200)
        expect(res.body.labelId).to.equal(enviornment.testCollection.testLabel)
        expect(res.body.uses).to.equal(1)
        expect(res.body.name).to.equal('test-label-full')
    })
  })
  describe('GET - getFindingsByCollection - /collections/{collectionId}/findings', () => {
  
    it('Return the Findings for the specified Collection by ruleId', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/findings?aggregator=cci&acceptedOnly=false&projection=assets&projection=groups&projection=rules&projection=stigs&projection=ccis`)
        .set('Authorization', `Bearer ${lvl1.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(7)

        // assets projection
        for(const finding of res.body){
            expect(finding.assetCount).to.equal(finding.assets.length)
            for(const asset of finding.assets){
                expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
            }
        }
        // groups projection
        expect(res.body[0].groups).to.be.an('array').of.length(1)

        // rules projection
        expect(res.body[0].rules).to.be.an('array').of.length(1)
        
        // stigs projection
        expect(res.body[0].stigs).to.be.an('array').of.length(1)
        expect(res.body[0].stigs[0].ruleCount).to.equal(81)
        expect(res.body[0].stigs[0].benchmarkId).to.equal(enviornment.testCollection.benchmark)
        expect(res.body[0].stigs[0].revisionStr).to.equal(enviornment.testCollection.revisionStr)

        // ccis projection
        expect(res.body[0].ccis).to.be.an('array').of.length(1)
    })
    it('Return the Findings for the specified Collection by groupId', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/findings?aggregator=groupId&acceptedOnly=false&projection=assets`)
        .set('Authorization', `Bearer ${lvl1.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(3)
        for(const finding of res.body){
          expect(finding.assetCount).to.equal(finding.assets.length)
          for(const asset of finding.assets){
              expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
          }
        }
    })
    it('Return the Findings for the specified Collection by cci', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/findings?aggregator=cci&acceptedOnly=false&projection=assets`)
        .set('Authorization', `Bearer ${lvl1.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(7)
        for(const finding of res.body){
          expect(finding.assetCount).to.equal(finding.assets.length)
          for(const asset of finding.assets){
              expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
          }
        }
    })
    it('Return the Findings for the specified Collection for benchmarkId x ruleId', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/findings?aggregator=ruleId&acceptedOnly=false&benchmarkId=${enviornment.testCollection.benchmark}&projection=assets`)
        .set('Authorization', `Bearer ${lvl1.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(3)
        for(const finding of res.body){
          expect(finding.assetCount).to.equal(finding.assets.length)
          for(const asset of finding.assets){
              expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
          }
        }
    })
    it('Return the Findings for the specified Collection for asset x ruleId Copy', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/findings?aggregator=ruleId&acceptedOnly=false&assetId=${enviornment.testAsset.assetId}&projection=assets`)
        .set('Authorization', `Bearer ${lvl1.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(3)
        for(const finding of res.body){
          expect(finding.assetCount).to.equal(1)
          expect(finding.assets[0].assetId).to.equal(enviornment.testAsset.assetId)
        }
    })
  })
  describe('GET - getCollections - /collections', () => {

    it('Return a list of Collections accessible to the requester No Filters', async () => {
      const res = await chai.request(config.baseUrl)
        .get('/collections?projection=owners&projection=statistics')
        .set('Authorization', `Bearer ${lvl1.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.have.lengthOf(1)
      
      // find collection id 21 and check owners projection
      const collection21 = res.body.find(collection => collection.collectionId === '21')
      const expectedOwners = ["87", "1", "45"]
      for(const owner of collection21.owners){
        expect(expectedOwners).to.include(owner.userId)
      }
      //check statistics projection
      expect(collection21.statistics.assetCount).to.equal(2)
      expect(collection21.statistics.checklistCount).to.equal(2)
      expect(collection21.statistics.grantCount).to.equal(1)
    })
    it('Return a list of Collections accessible to the requester No Filters no elevate!', async () => {
        const res = await chai.request(config.baseUrl)
          .get('/collections')
          .set('Authorization', `Bearer ${lvl1.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf(1)
    })
    it('Return a list of Collections accessible to the requester METADATA', async () => {
        const res = await chai.request(config.baseUrl)
          .get(`/collections?metadata=${enviornment.collectionMetadataKey}%3A${enviornment.collectionMetadataValue}`)
          .set('Authorization', `Bearer ${lvl1.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        const regex  = new RegExp(enviornment.testCollection.name)
        expect(res.body[0].name).to.match(regex)
        expect(res.body).to.have.lengthOf(1)
        expect(res.body[0].collectionId).to.equal('21')
        expect(res.body[0].metadata[enviornment.collectionMetadataKey]).to.equal(enviornment.collectionMetadataValue)

    })
    it('Return a list of Collections accessible to the requester NAME exact', async () => {
    const res = await chai.request(config.baseUrl)
        .get(`/collections?name=${enviornment.testCollection.name}&name-match=exact`)
        .set('Authorization', `Bearer ${lvl1.token}`)
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('array')
    const regex  = new RegExp(enviornment.testCollection.name)
    expect(res.body[0].name).to.match(regex)
    expect(res.body).to.have.lengthOf(1)
    expect(res.body[0].collectionId).to.equal('21')
    })
    it('Return a list of Collections accessible to the requester NAME starts With', async () => {
    const res = await chai.request(config.baseUrl)
        .get(`/collections?name=${'Collection'}&name-match=startsWith`)
        .set('Authorization', `Bearer ${lvl1.token}`)
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('array')
    expect(res.body).to.have.lengthOf(1)
    for(const collection of res.body){
        expect(collection.name).to.have.string('Collection')
    }
    })
    it('Return a list of Collections accessible to the requester NAME ends With', async () => {
    const res = await chai.request(config.baseUrl)
        .get(`/collections?name=${'X'}&name-match=endsWith`)
        .set('Authorization', `Bearer ${lvl1.token}`)
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('array')
    expect(res.body).to.have.lengthOf(1)
    expect(res.body[0].name).to.have.string('X')
    })
    it('Return a list of Collections accessible to the requester NAME contains', async () => {
    const res = await chai.request(config.baseUrl)
        .get(`/collections?name=${'delete'}&name-match=contains`)
        .set('Authorization', `Bearer ${lvl1.token}`)
    expect(res).to.have.status(200)
    expect(res.body).to.have.lengthOf(0)
    })
  })
  describe('GET - getCollectionLabels - /collections/{collectionId}/labels', () => {

    it('Labels for the specified Collection', async () => {
      const res = await chai.request(config.baseUrl)
        .get(`/collections/${enviornment.testCollection.collectionId}/labels`)
        .set('Authorization', `Bearer ${lvl1.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').of.length(2)
        for(const label of res.body){
          expect(enviornment.testCollection.labels).to.include(label.labelId)
          expect(label.uses).to.equal(1)
        }
    })
  })
})

describe('Collection get tests using "lvl2" user (no elevate)', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  describe('GET - getCollections - /collections', () => {

    it('Return a list of Collections accessible to the requester owners + stats', async () => {
      const res = await chai.request(config.baseUrl)
        .get('/collections?projection=owners&projection=statistics')
        .set('Authorization', `Bearer ${lvl2.token}`)
      expect(res).to.have.status(200)
      expect(res.body).to.have.lengthOf(2)
      
      // find collection id 21 and check owners projection
      const collection21 = res.body.find(collection => collection.collectionId === '21')
      const expectedOwners = ["87", "1", "45"]
      for(const owner of collection21.owners){
        expect(expectedOwners).to.include(owner.userId)
      }
      //check statistics projection
      expect(collection21.statistics.assetCount).to.equal(enviornment.testCollection.assetIDsInCollection.length)
      expect(collection21.statistics.checklistCount).to.equal(6)
      expect(collection21.statistics.grantCount).to.equal(7)
    })
    it('Return a list of Collections accessible to the requester No Filters no elevate!', async () => {
        const res = await chai.request(config.baseUrl)
          .get('/collections')
          .set('Authorization', `Bearer ${lvl2.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf(2)
    })
    it('Return a list of Collections accessible to the requester METADATA', async () => {
        const res = await chai.request(config.baseUrl)
          .get(`/collections?metadata=${enviornment.collectionMetadataKey}%3A${enviornment.collectionMetadataValue}`)
          .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        const regex  = new RegExp(enviornment.testCollection.name)
        expect(res.body[0].name).to.match(regex)
        expect(res.body).to.have.lengthOf(1)
        expect(res.body[0].collectionId).to.equal('21')
        expect(res.body[0].metadata[enviornment.collectionMetadataKey]).to.equal(enviornment.collectionMetadataValue)

    })
    it('Return a list of Collections accessible to the requester NAME exact', async () => {
    const res = await chai.request(config.baseUrl)
        .get(`/collections?name=${enviornment.testCollection.name}&name-match=exact`)
        .set('Authorization', `Bearer ${lvl2.token}`)
    expect(res).to.have.status(200)
    const regex  = new RegExp(enviornment.testCollection.name)
    expect(res.body[0].name).to.match(regex)
    expect(res.body).to.have.lengthOf(1)
    expect(res.body[0].collectionId).to.equal('21')
    })
    it('Return a list of Collections accessible to the requester NAME starts With', async () => {
    const res = await chai.request(config.baseUrl)
        .get(`/collections?name=${'Collection'}&name-match=startsWith`)
        .set('Authorization', `Bearer ${lvl2.token}`)
    expect(res).to.have.status(200)
    expect(res.body).to.have.lengthOf(2)
    for(const collection of res.body){
        expect(collection.name).to.have.string('Collection')
    }
    })
    it('Return a list of Collections accessible to the requester NAME ends With', async () => {
    const res = await chai.request(config.baseUrl)
        .get(`/collections?name=${'X'}&name-match=endsWith`)
        .set('Authorization', `Bearer ${lvl2.token}`)
    expect(res).to.have.status(200)
    expect(res.body).to.have.lengthOf(1)
    expect(res.body[0].name).to.have.string('X')
    })
    it('Return a list of Collections accessible to the requester NAME contains', async () => {
    const res = await chai.request(config.baseUrl)
        .get(`/collections?name=${'delete'}&name-match=contains`)
        .set('Authorization', `Bearer ${lvl2.token}`)
    expect(res).to.have.status(200)
    expect(res.body).to.have.lengthOf(0)
    })
  })
})