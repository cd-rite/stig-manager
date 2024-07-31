const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const enviornment = require('../../enviornment.json')
const users = require('../../iterations.json')

describe('GET - Collection', () => {

  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const user of users){
    
    describe(`user:${user.name}`, () => {
     
      describe('getCollections - /collections', () => {

        it('Return a list of Collections accessible to the requester No Filters elevated', async () => {
          const res = await chai.request(config.baseUrl)
            .get('/collections?projection=owners&projection=statistics&elevate=true')
            .set('Authorization', `Bearer ${user.token}`)
          
          if(user.name !== 'stigmanadmin'){
            expect(res).to.have.status(403)
            return
          }
          
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body).to.have.lengthOf(7)
          //check statistics projection
          const collection21 = res.body.find(collection => collection.collectionId === '21')
          const expectedOwners = ["87", "1", "45"]
          for(const owner of collection21.owners){
            expect(expectedOwners).to.include(owner.userId)
          }
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
           
            if(user.name === 'stigmanadmin'){
              expect(res.body).to.have.lengthOf(6)
            }
            if(user.name === 'lvl1'){
              expect(res.body).to.have.lengthOf(1)
            }
            if(user.name === 'lvl2' || user.name === 'lvl3'){
              expect(res.body).to.have.lengthOf(2)
            }
            if(user.name === 'lvl4'){
              expect(res.body).to.have.lengthOf(3)
            }
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
            .get(`/collections?name=${'Collection'}&name-match=startsWith`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        
        if(user.name === 'stigmanadmin'){
          expect(res.body).to.have.lengthOf(3)
        }
        if(user.name === 'lvl1'){
          expect(res.body).to.have.lengthOf(1)
        }
        if(user.name === 'lvl2' || user.name === 'lvl3' || user.name === 'lvl4'){
          expect(res.body).to.have.lengthOf(2)
        }
        for(const collection of res.body){
            expect(collection.name).to.have.string('Collection')
        }
        })
        it('Return a list of Collections accessible to the requester NAME ends With', async () => {
        const res = await chai.request(config.baseUrl)
            .get(`/collections?name=${'X'}&name-match=endsWith`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf(1)
        expect(res.body[0].name).to.have.string('X')
        })
        it('Return a list of Collections accessible to the requester NAME contains elevated', async () => {
        const res = await chai.request(config.baseUrl)
            .get(`/collections?name=${'delete'}&name-match=contains&elevate=true`)
            .set('Authorization', `Bearer ${user.token}`)
        if(user.name !== 'stigmanadmin'){
          expect(res).to.have.status(403)
          return
        } 
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf(3)
        expect(res.body[0].name).to.have.string('delete')
        })
        it('Return a list of Collections accessible to the requester NAME contains no elevate', async () => {
          const res = await chai.request(config.baseUrl)
              .get(`/collections?name=${'delete'}&name-match=contains`)
              .set('Authorization', `Bearer ${user.token}`)
          expect(res).to.have.status(200)
          if(user.name === 'stigmanadmin'){
            expect(res.body).to.have.lengthOf(2)
            expect(res.body[0].name).to.have.string('delete')
          }
          if(user.name === 'lvl1' || user.name === 'lvl2' || user.name === 'lvl3'){
            expect(res.body).to.have.lengthOf(0)
          }
          if(user.name === 'lvl4'){
            expect(res.body).to.have.lengthOf(1)
            expect(res.body[0].name).to.have.string('delete')
          }
        })
      })
      describe('getCollection - /collections/{collectionId}', () => {
        it('Return a Collection', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs&projection=labels`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body.collectionId).to.equal('21')
            const regex  = new RegExp(enviornment.testCollection.name)
            expect(res.body.name).to.match(regex)

            // assets projection

            if(user.name === 'stigmanadmin'){
              expect(res.body.assets).to.be.an('array').of.length(enviornment.testCollection.assetIDsInCollection.length)
              // statistics projection
              expect(res.body.statistics.assetCount).to.equal(enviornment.testCollection.assetIDsInCollection.length)
            }
            if(user.name === 'lvl1'){
              expect(res.body.assets).to.be.an('array').of.length(enviornment.lvl1.assets.length)
              // statistics projection
              expect(res.body.statistics.assetCount).to.equal(enviornment.lvl1.assets.length)
            }
           
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

            
        })
      })
      describe('getChecklistByCollectionStig - /collections/{collectionId}/checklists/{benchmarkId}/{revisionStr}', () => {
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
      describe('getFindingsByCollection - /collections/{collectionId}/findings', () => {
        
        it('Return the Findings for the specified Collection by ruleId', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/findings?aggregator=cci&acceptedOnly=false&projection=assets&projection=groups&projection=rules&projection=stigs&projection=ccis`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            if(user.name === 'lvl1'){
              expect(res.body).to.have.lengthOf(7)
            }
            else{
              expect(res.body).to.have.lengthOf(8)
            }

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
            if(user.name === 'lvl1'){
              expect(res.body).to.have.lengthOf(3)
            }
            else{
              expect(res.body).to.have.lengthOf(4)
            }

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
            expect(res).to.have.status(200)
            if(user.name === 'lvl1'){
              expect(res.body).to.have.lengthOf(7)
            }
            else{
              expect(res.body).to.have.lengthOf(8)
            }
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
            expect(res).to.have.status(200)
            if(user.name === 'lvl1'){
              expect(res.body).to.have.lengthOf(3)
            }
            else{
              expect(res.body).to.have.lengthOf(4)
            }
            for(const finding of res.body){
              expect(finding.assetCount).to.equal(1)
              expect(finding.assets[0].assetId).to.equal(enviornment.testAsset.assetId)
            }
        })
      })
      describe('getStigAssetsByCollectionUser - /collections/{collectionId}/grants/{userId}/access', () => {
        it('Return stig-asset grants for a lvl1 user in this collection.', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/grants/${enviornment.lvl1.userId}/access`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1' || user.name === 'lvl2'){
              expect(res).to.have.status(403)
              return
            }
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
      describe('getCollectionLabels - /collections/{collectionId}/labels', () => {

        it('Labels for the specified Collection', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/labels`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array').of.length(2)
            for(const label of res.body){
              expect(enviornment.testCollection.labels).to.include(label.labelId)
              if (label.name == enviornment.testCollection.labelFull){
                if(user.name === 'lvl1'){
                  expect(label.uses).to.equal(1)
                }
                else{
                  expect(label.uses).to.equal(2)
                }
              
              }
              if (label.name == enviornment.testCollection.testLabelName){
                  expect(label.uses).to.equal(1)
              }
            }
        })
      })
      describe('getCollectionLabelById - /collections/{collectionId}/labels/{labelId}', () => {
        it('Collection label', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/labels/${enviornment.testCollection.testLabel}`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body.labelId).to.equal(enviornment.testCollection.testLabel)
            if(user.name === 'lvl1'){
              expect(res.body.uses).to.equal(1)
            }
            else{
              expect(res.body.uses).to.equal(2)
            }
            expect(res.body.name).to.equal('test-label-full')
        })
      })
      describe('getCollectionMetadata - /collections/{collectionId}/metadata', () => {
        it('Metadata for the specified Collection', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/metadata`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1' || user.name === 'lvl2'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body[enviornment.collectionMetadataKey]).to.equal(enviornment.collectionMetadataValue)
        })
      })
      describe('getCollectionMetadataKeys - /collections/{collectionId}/metadata/keys', () => {

        it('Return the Metadata KEYS for a Collection', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/metadata/keys?`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1' || user.name === 'lvl2'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array').of.length(4)
            const keys = enviornment.testCollection.allMetadata.map(meta => meta.key)
            for(const key of res.body){
              expect(keys).to.include(key)
            }
        })
      })
      describe('getCollectionMetadataValue - /collections/{collectionId}/metadata/keys/{key}', () => {

        it('Return the Metadata VALUE for a Collection metadata KEY', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/metadata/keys/${enviornment.collectionMetadataKey}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1' || user.name === 'lvl2'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body).to.equal(enviornment.collectionMetadataValue)
        })
      })
      describe('getPoamByCollection - /collections/{collectionId}/poam', () => {

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
      describe('getReviewHistoryByCollection - /collections/{collectionId}/review-history', () => {

        it('History records - no query params', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
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
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
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
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
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
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
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
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
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
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
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
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
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
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
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
      describe('getReviewHistoryStatsByCollection - /collections/{collectionId}/review-history/stats', () => {

        it('History stats - no query params', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.collectionHistoryEntryCount).to.equal(7)
            expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
        })
        it('History stats - startDate only', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?startDate=${enviornment.reviewHistory.startDate}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.collectionHistoryEntryCount).to.equal(7)
            expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
        })
        it('History stats - startDate - Asset Projection', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?startDate=${enviornment.reviewHistory.startDate}&projection=asset`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
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
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.collectionHistoryEntryCount).to.equal(6)
            expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
        })
        it('History stats - start and end dates', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?endDate=${enviornment.reviewHistory.endDate}&startDate=${enviornment.reviewHistory.startDate}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.collectionHistoryEntryCount).to.equal(6)
            expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
        })
        it('History stats - asset only', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?assetId=${enviornment.reviewHistory.assetId}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.collectionHistoryEntryCount).to.equal(5)
        })
        it('History stats - rule only', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?ruleId=${enviornment.reviewHistory.ruleId}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.collectionHistoryEntryCount).to.equal(4)
            expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:30:38.000Z"))
        })
        it('History stats - status only', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?status=${enviornment.reviewHistory.status}`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.collectionHistoryEntryCount).to.equal(3)
            expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
        })
        it('History stats - all params', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/review-history/stats?endDate=${enviornment.reviewHistory.endDate}&startDate=${enviornment.reviewHistory.startDate}&assetId=${enviornment.reviewHistory.assetId}&status=${enviornment.reviewHistory.status}&ruleId=${enviornment.reviewHistory.ruleId}&projection=asset`)
            .set('Authorization', `Bearer ${user.token}`)
            if(user.name === 'lvl1'){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            expect(res.body.collectionHistoryEntryCount).to.equal(1)
            expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T23:37:45.000Z"))
            expect(res.body.assetHistoryEntryCounts.length).to.eql(1)
        })
      })
      describe('getStigsByCollection - /collections/{collectionId}/stigs', () => {

        it('Return the STIGs mapped in the specified Collection', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${enviornment.testCollection.collectionId}/stigs`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            if(user.name === 'lvl1'){
              expect(res.body).to.be.an('array').of.length(1)
            }else{
              expect(res.body).to.be.an('array').of.length(2)
            }
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
            if(user.name === 'lvl1'){
              expect(res.body).to.be.an('array').of.length(1)
            }else{
              expect(res.body).to.be.an('array').of.length(2)
            }
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
            if(user.name === 'lvl1'){
              expect(res.body).to.be.an('array').of.length(1)
            }else{
              expect(res.body).to.be.an('array').of.length(2)
            }
            for(const stig of res.body){
              expect(enviornment.testCollection.validStigs).to.include(stig.benchmarkId)
              const regex = new RegExp("asset")
              for(const asset of stig.assets){
                expect(enviornment.testCollection.assetIDsInCollection).to.include(asset.assetId)
                expect(asset.name).to.match(regex)
              }
            }
        })
      })
      describe('getStigByCollection - /collections/{collectionId}/stigs/{benchmarkId}', () => {

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
  }
})

