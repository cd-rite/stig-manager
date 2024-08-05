const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const users = require('../../iterations.json')
const expectations = require('./expectations.json')

describe('GET - Collection', () => {

  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const user of users){
    
    describe(`user:${user.name}`, () => {
      const distinct = expectations[user.name]
      const common = expectations.common // or stigmanadmin expectations?
    
      describe('getCollections - /collections', () => {
        if (user.name === 'stigmanadmin' ){

          it('Return Collections accessible to the requester No Filters - elevated stigmanadmin only', async () => {

            const res = await chai.request(config.baseUrl)
              .get('/collections?projection=owners&projection=statistics&elevate=true')
              .set('Authorization', `Bearer ${user.token}`)
            
            expect(res).to.have.status(200)
            // expect(res.body).to.be.an('array')
            expect(res.body).to.have.lengthOf(distinct.collectionCountElevated)
            //check statistics projection
            const testCollection = res.body.find(collection => collection.collectionId === common.testCollection.collectionId)
            const testCollectionOwnerArray = testCollection.owners.map(owner => owner.userId)

            expect(testCollectionOwnerArray, "proper owners").to.have.members(common.testCollection.owners)
            expect(testCollection.statistics.assetCount, "asset count").to.equal(distinct.assetCnt_testCollection)
            expect(testCollection.statistics.checklistCount, "checklist count").to.equal(distinct.checklistCnt_testCollection)
            expect(testCollection.statistics.grantCount, "grant count").to.equal(distinct.grantCnt_testCollection)
          })
        }

        it('Return a list of Collections accessible to the requester No Filters no elevate!', async () => {
            const res = await chai.request(config.baseUrl)
              .get('/collections?projection=owners&projection=statistics')
              .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
           
            expect(res.body).to.have.lengthOf(distinct.collectionCount)

        })

        it('Return a list of Collections accessible to the requester METADATA', async () => {
            const res = await chai.request(config.baseUrl)
              .get(`/collections?metadata=${common.testCollection.collectionMetadataKey}%3A${common.testCollection.collectionMetadataValue}`)
              .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
            const regex  = new RegExp(common.testCollection.name)
            expect(res.body[0].name).to.match(regex)
            expect(res.body).to.have.lengthOf(1)
            expect(res.body[0].collectionId).to.equal(common.testCollection.collectionId)
            expect(res.body[0].metadata[common.testCollection.collectionMetadataKey]).to.equal(common.testCollection.collectionMetadataValue)

        })
        it('Return a list of Collections accessible to the requester NAME exact', async () => {
        const res = await chai.request(config.baseUrl)
            .get(`/collections?name=${common.testCollection.name}&name-match=exact`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        const regex  = new RegExp(common.testCollection.name)
        expect(res.body[0].name).to.match(regex)
        expect(res.body).to.have.lengthOf(1)
        expect(res.body[0].collectionId).to.equal(common.testCollection.collectionId)
        })

        it('Return a list of Collections accessible to the requester NAME starts With', async () => {
        const res = await chai.request(config.baseUrl)
            .get(`/collections?name=${'Collection'}&name-match=startsWith`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        
        expect(res.body).to.have.lengthOf(distinct.collectionMatchCnt)

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
          .get(`/collections/${common.testCollection.collectionId}?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs&projection=labels`)
          .set('Authorization', `Bearer ${user.token}`)
          expect(res).to.have.status(200)
          expect(res.body.collectionId).to.equal(common.testCollection.collectionId)
          const regex  = new RegExp(common.testCollection.name)
          expect(res.body.name).to.match(regex)

          // assets projection
          expect(res.body.statistics.assetCount).to.eql(distinct.assetIDs_testCollection.length)
          
          // grants projection
          // todo: lvl1 user seems to be getting all grants
          expect(res.body.grants).to.be.an('array').of.length(distinct.grantCnt_testCollection)

          const testCollectionOwnerArray = res.body.owners.map(owner => owner.userId)
          expect(testCollectionOwnerArray, "proper owners").to.have.members(common.testCollection.owners)
          
      })
    })

    describe('getChecklistByCollectionStig - /collections/{collectionId}/checklists/{benchmarkId}/{revisionStr}', () => {
      it('Return the Checklist for the supplied Collection and STIG-latest', async () => {
        const res = await chai.request(config.baseUrl)
          .get(`/collections/${common.testCollection.collectionId}/checklists/${common.benchmark}/${'latest'}`)
          .set('Authorization', `Bearer ${user.token}`)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').of.length(common.checklistLength)
      })
      it('Return the Checklist for the supplied Collection and STIG-revStr', async () => {
        const res = await chai.request(config.baseUrl)
          .get(`/collections/${common.testCollection.collectionId}/checklists/${common.benchmark}/${common.revisionStr}`)
          .set('Authorization', `Bearer ${user.token}`)
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').of.length(common.checklistLength)
      })
    })


    describe('getFindingsByCollection - /collections/{collectionId}/findings', () => {
      
      it('Return the Findings for the specified Collection by ruleId', async () => {
        const res = await chai.request(config.baseUrl)
          .get(`/collections/${common.testCollection.collectionId}/findings?aggregator=cci&acceptedOnly=false&projection=assets&projection=groups&projection=rules&projection=stigs&projection=ccis`)
          .set('Authorization', `Bearer ${user.token}`)
          expect(res).to.have.status(200)

          expect(res.body).to.have.lengthOf(distinct.findingsCnt)

          // assets projection
          for(const finding of res.body){
              expect(finding.assetCount).to.equal(finding.assets.length)
              for(const asset of finding.assets){
                  expect(distinct.assetIDs_testCollection).to.include(asset.assetId)
              }
          }
          // groups projection
          expect(res.body[0].groups).to.be.an('array').of.length(1)

          // rules projection
          expect(res.body[0].rules).to.be.an('array').of.length(1)
          
          // stigs projection
          expect(res.body[0].stigs).to.be.an('array').of.length(1)
          expect(res.body[0].stigs[0].ruleCount).to.equal(81)
          expect(res.body[0].stigs[0].benchmarkId).to.equal(common.benchmark)
          expect(res.body[0].stigs[0].revisionStr).to.equal(common.revisionStr)

          // ccis projection
          expect(res.body[0].ccis).to.be.an('array').of.length(1)
      })

      it('Return the Findings for the specified Collection by groupId', async () => {
        const res = await chai.request(config.baseUrl)
          .get(`/collections/${common.testCollection.collectionId}/findings?aggregator=groupId&acceptedOnly=false&projection=assets`)
          .set('Authorization', `Bearer ${user.token}`)
          expect(res).to.have.status(200)

          expect(res.body).to.have.lengthOf(distinct.findingsByGroupCnt)

          for(const finding of res.body){
            expect(finding.assetCount).to.equal(finding.assets.length)
            for(const asset of finding.assets){
                expect(distinct.assetIDs_testCollection).to.include(asset.assetId)
            }
          }
      })

      it('Return the Findings for the specified Collection by cci', async () => {
        const res = await chai.request(config.baseUrl)
          .get(`/collections/${common.testCollection.collectionId}/findings?aggregator=cci&acceptedOnly=false&projection=assets`)
          .set('Authorization', `Bearer ${user.token}`)
          expect(res).to.have.status(200)
          expect(res).to.have.status(200)

          expect(res.body).to.have.lengthOf(distinct.findingsByCciCnt)

          for(const finding of res.body){
            expect(finding.assetCount).to.equal(finding.assets.length)
            for(const asset of finding.assets){
                expect(distinct.assetIDs_testCollection).to.include(asset.assetId)
            }
          }
      })

      it('Return the Findings for the specified Collection for benchmarkId x ruleId', async () => {
        const res = await chai.request(config.baseUrl)
          .get(`/collections/${common.testCollection.collectionId}/findings?aggregator=ruleId&acceptedOnly=false&benchmarkId=${common.benchmark}&projection=assets`)
          .set('Authorization', `Bearer ${user.token}`)
          expect(res).to.have.status(200)

          expect(res.body).to.be.an('array').of.length(3)

          for(const finding of res.body){
            expect(finding.assetCount).to.equal(finding.assets.length)
            for(const asset of finding.assets){
                expect(distinct.assetIDs_testCollection).to.include(asset.assetId)
            }
          }
      })

      it('Return the Findings for the specified Collection for asset x ruleId Copy', async () => {
        const res = await chai.request(config.baseUrl)
          .get(`/collections/${common.testCollection.collectionId}/findings?aggregator=ruleId&acceptedOnly=false&assetId=${environment.testAsset.assetId}&projection=assets`)
          .set('Authorization', `Bearer ${user.token}`)
          expect(res).to.have.status(200)
          expect(res).to.have.status(200)

          expect(res.body).to.have.lengthOf(distinct.findingsByRuleAndAssetCnt)

          for(const finding of res.body){
            expect(finding.assetCount).to.equal(1)
            expect(finding.assets[0].assetId).to.equal(environment.testAsset.assetId)
          }
      })
    })
    describe('getStigAssetsByCollectionUser - /collections/{collectionId}/grants/{userId}/access', () => {

      it('Return stig-asset grants for a lvl1 user in this collection.', async () => {
        const res = await chai.request(config.baseUrl)
          .get(`/collections/${common.testCollection.collectionId}/grants/${common.grantCheckUserId}/access`)
          .set('Authorization', `Bearer ${user.token}`)
          if(user.name === 'lvl1' || user.name === 'lvl2'){
            expect(res).to.have.status(403)
            // this.skip()
            return
          }

          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').of.length(2)
          const regex = new RegExp("asset")
          for (const stigAssetGrant of res.body) {
            expect(stigAssetGrant.asset.name).to.match(regex)
            expect(stigAssetGrant.benchmarkId).to.be.oneOf(common.testCollection.validStigs)
            expect(stigAssetGrant.asset.assetId).to.be.oneOf(distinct.assetIDs_testCollection)
          }
      })
    })
    
      describe('getCollectionLabels - /collections/{collectionId}/labels', () => {

        it('Labels for the specified Collection', async () => {
          const res = await chai.request(config.baseUrl)
            .get(`/collections/${common.testCollection.collectionId}/labels`)
            .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array').of.length(common.testCollection.labels.length)
            for(const label of res.body){
              expect(common.testCollection.labels).to.include(label.labelId)
              if (label.name == common.testCollection.fullLabelName){
                  expect(label.uses).to.equal(distinct.fullLabelUses)
                }
              if (label.name == common.testCollection.lvl1LabelName){
                  expect(label.uses).to.equal(distinct.lvl1LabelUses)
              }
              
            }

        })
      })
        describe('getCollectionLabelById - /collections/{collectionId}/labels/{labelId}', () => {
          it('Collection label', async () => {
            const res = await chai.request(config.baseUrl)
              .get(`/collections/${common.testCollection.collectionId}/labels/${common.testCollection.fullLabel}`)
              .set('Authorization', `Bearer ${user.token}`)
              expect(res).to.have.status(200)
              expect(res.body.labelId).to.equal(common.testCollection.fullLabel)
              expect(res.body.uses).to.equal(distinct.fullLabelUses)

              expect(res.body.name).to.equal(common.testCollection.fullLabelName)
          })
        })

          describe('getCollectionMetadata - /collections/{collectionId}/metadata', () => {
            it('Metadata for the specified Collection', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/metadata`)
                .set('Authorization', `Bearer ${user.token}`)
                if(user.name === 'lvl1' || user.name === 'lvl2'){
                  expect(res).to.have.status(403)
                  return
                }
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('object')
                expect(res.body[common.testCollection.collectionMetadataKey]).to.equal(common.testCollection.collectionMetadataValue)
            })
          })

          describe('getCollectionMetadataKeys - /collections/{collectionId}/metadata/keys', () => {

            it('Return the Metadata KEYS for a Collection', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/metadata/keys?`)
                .set('Authorization', `Bearer ${user.token}`)
                if(user.name === 'lvl1' || user.name === 'lvl2'){
                  expect(res).to.have.status(403)
                  return
                }
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('array').of.length(common.testCollection.allMetadata.length)
                const keys = common.testCollection.allMetadata.map(meta => meta.key)
                for(const key of res.body){
                  expect(keys).to.include(key)
                }
            })
          })

          describe('getCollectionMetadataValue - /collections/{collectionId}/metadata/keys/{key}', () => {

            it('Return the Metadata VALUE for a Collection metadata KEY', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/metadata/keys/${common.testCollection.collectionMetadataKey}`)
                .set('Authorization', `Bearer ${user.token}`)
                if(user.name === 'lvl1' || user.name === 'lvl2'){
                  expect(res).to.have.status(403)
                  return
                }
                expect(res).to.have.status(200)
                expect(res.body).to.equal(common.testCollection.collectionMetadataValue)
            })
          })

          describe('getPoamByCollection - /collections/{collectionId}/poam', () => {

            it('Return a POAM-like spreadsheet aggregated by groupId', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/poam?aggregator=groupId&date=01%2F01%2F1970&office=MyOffice&status=Ongoing&acceptedOnly=true`)
                .set('Authorization', `Bearer ${user.token}`)
                expect(res).to.have.status(200)
            })

            it('Return a POAM-like spreadsheet aggregated by ruleId', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/poam?aggregator=ruleId&date=01%2F01%2F1970&office=MyOffice&status=Ongoing&acceptedOnly=true`)
                .set('Authorization', `Bearer ${user.token}`)
                expect(res).to.have.status(200)
            })
          })

          describe('getReviewHistoryByCollection - /collections/{collectionId}/review-history', () => {

            it('History records - no query params', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/review-history`)
                .set('Authorization', `Bearer ${user.token}`)
                
                expect(res).to.have.status(distinct.historyResponseStatus)
                if (res.status !== 200){
                  return
                }
                expect(res.body).to.be.an('array').of.length(common.testCollection.assetsWithHistory.length)

                for(asset of res.body){
                  if(asset.assetId === common.testCollection.reviewHistory.assetId){
                    expect(asset.reviewHistories).to.be.an('array').of.length(common.testCollection.reviewHistoryRuleCnt)
                    for(const history of asset.reviewHistories){
                      if(history.ruleId === common.testCollection.reviewHistory.ruleId){
                        expect(history.history).to.be.an('array').of.length(common.testCollection.reviewHistoryRuleCnt)
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
                .get(`/collections/${common.testCollection.collectionId}/review-history?assetId=${common.testCollection.reviewHistory.assetId}`)
                .set('Authorization', `Bearer ${user.token}`)

                expect(res).to.have.status(distinct.historyResponseStatus)
                if (res.status !== 200){
                  return
                }
                //requesting one assets history
                expect(res.body).to.be.an('array').of.length(1)
                for(asset of res.body){
                  expect(asset.assetId).to.equal(common.testCollection.reviewHistory.assetId)
                  expect(asset.reviewHistories).to.be.an('array').of.length(common.testCollection.rulesWithHistoryCnt)
                  for(const history of asset.reviewHistories){
                    if(history.ruleId === common.testCollection.reviewHistory.ruleId){
                      expect(history.history).to.be.an('array').of.length(common.testCollection.reviewHistoryRuleCnt)
                      for(const record of history.history){
                        expect(record.result).to.be.equal('pass')
                      }
                    }
                  }
              }
            })

            it('History records - endDate only', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/review-history?endDate=${common.testCollection.reviewHistory.endDate}`)
                .set('Authorization', `Bearer ${user.token}`)
                
                expect(res).to.have.status(distinct.historyResponseStatus)
                if (res.status !== 200){
                  return
                }
                expect(res.body).to.be.an('array').of.length(common.testCollection.assetsWithHistory.length)
                for(asset of res.body){
                  for(const history of asset.reviewHistories){
                    expect(history.history).to.be.an('array').of.length(2)
                    for(const record of history.history){
                      expect(Date.parse(record.ts)).to.be.below(Date.parse(common.testCollection.reviewHistory.endDate))
                    }
                  }
                }
            })

            it('History records - startDate only', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/review-history?startDate=${common.testCollection.reviewHistory.startDate}`)
                .set('Authorization', `Bearer ${user.token}`)
                
                expect(res).to.have.status(distinct.historyResponseStatus)
                if (res.status !== 200){
                  return
                }
                expect(res.body).to.be.an('array').of.length(common.testCollection.assetsWithHistory.length)
                for(asset of res.body){
                  for(const history of asset.reviewHistories){
                    for(const record of history.history){
                      expect(Date.parse(record.ts)).to.be.above(Date.parse(common.testCollection.reviewHistory.startDate))
                    }
                  }
                }
            })

            it('History records - rule only', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/review-history?ruleId=${common.testCollection.reviewHistory.ruleId}`)
                .set('Authorization', `Bearer ${user.token}`)
                
                expect(res).to.have.status(distinct.historyResponseStatus)
                if (res.status !== 200){
                  return
                }
                expect(res.body).to.be.an('array').of.length(common.testCollection.assetsWithHistory.length)
                for(asset of res.body){
                  for(const history of asset.reviewHistories){
                    expect(history.ruleId).to.equal(common.testCollection.reviewHistory.ruleId)
                  }
                }
            })

            it('History records - start and end dates', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/review-history?startDate=${common.testCollection.reviewHistory.startDate}&endDate=${common.testCollection.reviewHistory.endDate}`)
                .set('Authorization', `Bearer ${user.token}`)
                
                expect(res).to.have.status(distinct.historyResponseStatus)
                if (res.status !== 200){
                  return
                }
                expect(res.body).to.be.an('array').of.length(common.testCollection.assetsWithHistory.length)
                for(asset of res.body){
                  for(const history of asset.reviewHistories){
                    for(const record of history.history){
                      expect(Date.parse(record.ts)).to.be.above(Date.parse(common.testCollection.reviewHistory.startDate))
                      expect(Date.parse(record.ts)).to.be.below(Date.parse(common.testCollection.reviewHistory.endDate))
                    }
                  }
                }
            })

            it('History records - status only', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/review-history?status=${common.testCollection.reviewHistory.status}`)
                .set('Authorization', `Bearer ${user.token}`)
                
                expect(res).to.have.status(distinct.historyResponseStatus)
                if (res.status !== 200){
                  return
                }
                expect(res.body).to.be.an('array').of.length(common.testCollection.assetsWithHistory.length)
                for(asset of res.body){
                  for(const history of asset.reviewHistories){
                    for(const record of history.history){
                      expect(record.status.label).to.equal(common.testCollection.reviewHistory.status)
                    }
                  }
                }
            })

            it('History records - all params', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/review-history?status=${common.testCollection.reviewHistory.status}&assetId=${common.testCollection.reviewHistory.assetId}&ruleId=${common.testCollection.reviewHistory.ruleId}&startDate=${common.testCollection.reviewHistory.startDate}&endDate=${common.testCollection.reviewHistory.endDate}`)
                .set('Authorization', `Bearer ${user.token}`)
                
                expect(res).to.have.status(distinct.historyResponseStatus)
                if (res.status !== 200){
                  return
                }
                expect(res.body).to.be.an('array').of.length(1)
                //asset
                //expect just one item in response array
                expect(res.body[0].assetId).to.equal(common.testCollection.reviewHistory.assetId)
                for(const history of res.body[0].reviewHistories){
                  //rule 
                  expect(history.ruleId).to.equal(common.testCollection.reviewHistory.ruleId)
                  for(const record of history.history){
                    // start/end date
                    expect(Date.parse(record.ts)).to.be.above(Date.parse(common.testCollection.reviewHistory.startDate))
                    expect(Date.parse(record.ts)).to.be.below(Date.parse(common.testCollection.reviewHistory.endDate))
                    // status
                    expect(record.status.label).to.equal(common.testCollection.reviewHistory.status)
                  }
                }
            })
          })
          describe('getReviewHistoryStatsByCollection - /collections/{collectionId}/review-history/stats', () => {

            it('History stats - no query params', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/review-history/stats`)
                .set('Authorization', `Bearer ${user.token}`)
                
                expect(res).to.have.status(distinct.historyResponseStatus)
                if (res.status !== 200){
                  return
                }
                expect(res.body.collectionHistoryEntryCount).to.equal(common.testCollection.reviewHistoryTotalCnt)
                expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
            })

            it('History stats - startDate only', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/review-history/stats?startDate=${common.testCollection.reviewHistory.startDate}`)
                .set('Authorization', `Bearer ${user.token}`)
                
                expect(res).to.have.status(distinct.historyResponseStatus)
                if (res.status !== 200){
                  return
                }
                expect(res.body.collectionHistoryEntryCount).to.equal(common.testCollection.reviewHistoryTotalCnt)
                expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
            })

            it('History stats - startDate - Asset Projection', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/review-history/stats?startDate=${common.testCollection.reviewHistory.startDate}&projection=asset`)
                .set('Authorization', `Bearer ${user.token}`)
                
                expect(res).to.have.status(distinct.historyResponseStatus)
                if (res.status !== 200){
                  return
                }

                expect(res.body.collectionHistoryEntryCount).to.equal(common.testCollection.reviewHistoryTotalCnt)
                expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
                expect(res.body.assetHistoryEntryCounts.length).to.eql(common.testCollection.reviewHistory_startDateCnt)
                let totalHistoryEntries = 0
                for(const asset of res.body.assetHistoryEntryCounts){
                  expect(distinct.assetIDs_testCollection).to.include(asset.assetId)
                  totalHistoryEntries += asset.historyEntryCount
                }
                expect(common.testCollection.reviewHistoryTotalCnt).to.equal(res.body.collectionHistoryEntryCount)
            })

            it('History stats - endDate only', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/review-history/stats?endDate=${common.testCollection.reviewHistory.endDate}`)
                .set('Authorization', `Bearer ${user.token}`)
                
                expect(res).to.have.status(distinct.historyResponseStatus)
                if (res.status !== 200){
                  return
                }
                expect(res.body.collectionHistoryEntryCount).to.equal(common.testCollection.reviewHistory_endDateCnt)
                expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
            })

            it('History stats - start and end dates', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/review-history/stats?endDate=${common.testCollection.reviewHistory.endDate}&startDate=${common.testCollection.reviewHistory.startDate}`)
                .set('Authorization', `Bearer ${user.token}`)
                
                expect(res).to.have.status(distinct.historyResponseStatus)
                if (res.status !== 200){
                  return
                }
                expect(res.body.collectionHistoryEntryCount).to.equal(6)
                expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
            })

            it('History stats - asset only', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/review-history/stats?assetId=${common.testCollection.reviewHistory.assetId}`)
                .set('Authorization', `Bearer ${user.token}`)
                
                expect(res).to.have.status(distinct.historyResponseStatus)
                if (res.status !== 200){
                  return
                }
                expect(res.body.collectionHistoryEntryCount).to.equal(common.testCollection.reviewHistory_testAssetCnt)
            })
            it('History stats - rule only', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/review-history/stats?ruleId=${common.testCollection.reviewHistory.ruleId}`)
                .set('Authorization', `Bearer ${user.token}`)
                
                expect(res).to.have.status(distinct.historyResponseStatus)
                if (res.status !== 200){
                  return
                }
                expect(res.body.collectionHistoryEntryCount).to.equal(common.testCollection.reviewHistory_ruleIdCnt)
                expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:30:38.000Z"))
            })

            it('History stats - status only', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/review-history/stats?status=${common.testCollection.reviewHistory.status}`)
                .set('Authorization', `Bearer ${user.token}`)
                
                expect(res).to.have.status(distinct.historyResponseStatus)
                if (res.status !== 200){
                  return
                }

                expect(res.body.collectionHistoryEntryCount).to.equal(common.testCollection.reviewHistory_byStatusCnt)
                expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T22:26:50.000Z"))
            })

            it('History stats - all params', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/review-history/stats?endDate=${common.testCollection.reviewHistory.endDate}&startDate=${common.testCollection.reviewHistory.startDate}&assetId=${common.testCollection.reviewHistory.assetId}&status=${common.testCollection.reviewHistory.status}&ruleId=${common.testCollection.reviewHistory.ruleId}&projection=asset`)
                .set('Authorization', `Bearer ${user.token}`)
                
                expect(res).to.have.status(distinct.historyResponseStatus)
                if (res.status !== 200){
                  return
                }
                //expect just one item in response array
                expect(res.body.collectionHistoryEntryCount).to.equal(1)
                expect(Date.parse(res.body.oldestHistoryEntryDate)).to.equal(Date.parse("2020-08-11T23:37:45.000Z"))
                expect(res.body.assetHistoryEntryCounts.length).to.eql(1)
            })
          })

          describe('getStigsByCollection - /collections/{collectionId}/stigs', () => {

            it('Return the STIGs mapped in the specified Collection', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/stigs`)
                .set('Authorization', `Bearer ${user.token}`)
                expect(res).to.have.status(200)
                // if(user.name === 'lvl1'){
                //   expect(res.body).to.be.an('array').of.length(1)
                // }else{
                  expect(res.body).to.be.an('array').of.length(distinct.validStigs.length)
                // }
                for(const stig of res.body){
                  expect(distinct.validStigs).to.include(stig.benchmarkId)
                  expect(stig.revisionPinned).to.equal(false)
                }
            })

            it('Return the STIGs mapped in the specified Collection - label', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/stigs?labelId=${common.testCollection.fullLabel}`)
                .set('Authorization', `Bearer ${user.token}`)
                expect(res).to.have.status(200)

                expect(res.body).to.be.an('array').of.length(distinct.fullLabelUses)

                for(const stig of res.body){
                  expect(distinct.validStigs).to.include(stig.benchmarkId)
                  //expect just 1 asset with this label
                  expect(stig.assetCount).to.equal(distinct.fullLabelUses)
                }
            })

            it('Return the STIGs mapped in the specified Collection - asset projection', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/stigs?projection=assets`)
                .set('Authorization', `Bearer ${user.token}`)
                expect(res).to.have.status(200)
                // if(user.name === 'lvl1'){
                //   expect(res.body).to.be.an('array').of.length(1)
                // }else{
                  expect(res.body).to.be.an('array').of.length(distinct.validStigs.length)
                // }
                for(const stig of res.body){
                  expect(distinct.validStigs).to.include(stig.benchmarkId)
                  const regex = new RegExp("asset")
                  for(const asset of stig.assets){
                    expect(distinct.assetIDs_testCollection).to.include(asset.assetId)
                    expect(asset.name).to.match(regex)
                  }
                }
            })
          })

          describe('getStigByCollection - /collections/{collectionId}/stigs/{benchmarkId}', () => {

            it('Return Pinned Revision for this STIG', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/stigs/${common.benchmark}`)
                .set('Authorization', `Bearer ${user.token}`)
                expect(res).to.have.status(200)
                expect(res.body.benchmarkId).to.equal(common.benchmark)
                expect(res.body.revisionStr).to.equal(common.revisionStr)
                expect(res.body.revisionPinned).to.equal(false)
                expect(res.body.assetCount).to.eql(distinct.testBenchmarkAssignedCount)

            })

            it('Return the info about the specified STIG from the specified Collection - asset projection', async () => {
              const res = await chai.request(config.baseUrl)
                .get(`/collections/${common.testCollection.collectionId}/stigs/${common.benchmark}?projection=assets`)
                .set('Authorization', `Bearer ${user.token}`)
                expect(res).to.have.status(200)
                expect(res.body.benchmarkId).to.equal(common.benchmark)
                expect(res.body.revisionStr).to.equal(common.revisionStr)
                expect(res.body.revisionPinned).to.equal(false)
                const regex = new RegExp("asset")
                for(const asset of res.body.assets){
                  expect(distinct.assetIDs_testCollection).to.include(asset.assetId)
                  expect(asset.name).to.match(regex)
                }
            })
      })
    })
  }
})
