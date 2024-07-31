const chai = require("chai")
const chaiHttp = require("chai-http")
chai.use(chaiHttp)
const expect = chai.expect
const config = require("../../testConfig.json")
const utils = require("../../utils/testUtils")
const enviornment = require("../../enviornment.json")
const users = require("../../iterations.json")


describe('POST - Collection', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const user of users) {
    describe(`user:${user.name}`, () => {
      describe("createCollection - /collections", () => {
        it("Invalid fields.detail.required value", async () => {
          const res = await chai
            .request(config.baseUrl)
            .post(`/collections`)
            .set("Authorization", `Bearer ${user.token}`)
            .send({
              name: "{{$timestamp}}",
              description: "Collection TEST description",
              settings: {
                fields: {
                  detail: {
                    enabled: "findings",
                    required: "always",
                  },
                  comment: {
                    enabled: "always",
                    required: "always",
                  },
                },
                status: {
                  canAccept: true,
                  minAcceptGrant: 3,
                  resetCriteria: "result",
                },
              },
              metadata: {},
              grants: [
                {
                  userId: "1",
                  accessLevel: 4,
                },
              ],
            })
          expect(res).to.have.status(400)
        })
        it("Missing settings", async () => {
          const res = await chai
            .request(config.baseUrl)
            .post(`/collections`)
            .set("Authorization", `Bearer ${user.token}`)
            .send({
              name: "{{$timestamp}}",
              description: "Collection TEST description",
              metadata: {},
              grants: [
                {
                  userId: "1",
                  accessLevel: 4,
                },
              ],
            })
          expect(res).to.have.status(201)
        })
        it("Create a Collection and test projections", async () => {
          const post = {
            name: "TEST",
            description: "Collection TEST description",
            settings: {
              fields: {
                detail: {
                  enabled: "always",
                  required: "findings",
                },
                comment: {
                  enabled: "always",
                  required: "findings",
                },
              },
              status: {
                canAccept: true,
                minAcceptGrant: 2,
                resetCriteria: "result",
              },
              history: {
                maxReviews: 11,
              },
            },
            metadata: {
              pocName: "poc2Put",
              pocEmail: "pocEmailPut@email.com",
              pocPhone: "12342",
              reqRar: "true",
            },
            grants: [
              {
                userId: "1",
                accessLevel: 4,
              },
            ],
            labels: [
              {
                name: "TEST",
                description: "Collection label description",
                color: "ffffff",
              },
            ],
          }
          const res = await chai
            .request(config.baseUrl)
            .post(
              `/collections?elevate=true&projection=grants&projection=labels&projection=assets&projection=owners&projection=statistics&projection=stigs`
            )
            .set("Authorization", `Bearer ${user.token}`)
            .send(post)

            expect(res).to.have.status(201)
            expect(res.body.description).to.equal("Collection TEST description")
            expect(res.body.name).to.equal("TEST")
            expect(res.body.settings.fields.detail.enabled).to.equal(post.settings.fields.detail.enabled)
            expect(res.body.settings.fields.detail.required).to.equal(post.settings.fields.detail.required)
            expect(res.body.settings.fields.comment.enabled).to.equal(post.settings.fields.comment.enabled)
            expect(res.body.settings.fields.comment.required).to.equal(post.settings.fields.comment.required)
            expect(res.body.settings.status.canAccept).to.equal(post.settings.status.canAccept)
            expect(res.body.settings.status.minAcceptGrant).to.equal(post.settings.status.minAcceptGrant)
            expect(res.body.settings.status.resetCriteria).to.equal(post.settings.status.resetCriteria)
            expect(res.body.settings.history.maxReviews).to.equal(post.settings.history.maxReviews)
            expect(res.body.metadata.pocName).to.equal(post.metadata.pocName)
            expect(res.body.metadata.pocEmail).to.equal(post.metadata.pocEmail)
            expect(res.body.metadata.pocPhone).to.equal(post.metadata.pocPhone)
            expect(res.body.metadata.reqRar).to.equal(post.metadata.reqRar)

            // grants projection
            expect(res.body.grants).to.have.lengthOf(1)
            expect(res.body.grants[0].user.userId).to.equal("1")
            expect(res.body.grants[0].accessLevel).to.equal(4)

            // labels projection
            expect(res.body.labels).to.have.lengthOf(1)
            expect(res.body.labels[0].name).to.equal("TEST")
            expect(res.body.labels[0].description).to.equal("Collection label description")
            expect(res.body.labels[0].color).to.equal("ffffff")

            // assets projection
            expect(res.body.assets).to.have.lengthOf(0)

            // owners projection
            expect(res.body.owners).to.have.lengthOf(1)
            expect(res.body.owners[0].userId).to.equal("1")

            // statistics projection
            expect(res.body.statistics.assetCount).to.equal(0)
            expect(res.body.statistics.checklistCount).to.equal(0)
            expect(res.body.statistics.grantCount).to.equal(1)
        
            // stigs projection
            expect(res.body.stigs).to.have.lengthOf(0)

            // just an extra check to make sure the collection was created
            const createdCollection = await utils.getCollection(res.body.collectionId)
            expect(createdCollection).to.exist
        })
      })
      describe("cloneCollection - /collections/{collectionId}/clone", () => {

        before(async function () {
          this.timeout(4000)
          await utils.setDefaultRevision(enviornment.testCollection.collectionId, enviornment.testCollection.benchmark, "V1R0")
        })
        // this test is dependant on the endpoints of the util functions to be working correctly. 
        it("clone collection for later Review check and test projections everything matches source ", async () => {

          const assetsProjected = [
            {
                name: "ACHERNAR_Collection_X_asset"
            },
            {
                name: "Collection_X_asset"
            },
            {
                name: "Collection_X_lvl1_asset-1"
            },
            {
                name: "Collection_X_lvl1_asset-2"
            }
          ]

          const grantsProjected = [
            {
                user: {
                    userId: "86",
                    username: "bizarroLvl1",
                    displayName: "bizarroLvl1"
                },
                accessLevel: 1
            },
            {
                user: {
                    userId: "85",
                    username: "lvl1",
                    displayName: "lvl1"
                },
                accessLevel: 1
            },
            {
                user: {
                    userId: "21",
                    username: "lvl2",
                    displayName: "lvl2"
                },
                accessLevel: 2
            },
            {
                user: {
                    userId: "44",
                    username: "lvl3",
                    displayName: "lvl3"
                },
                accessLevel: 3
            },
            {
                user: {
                    userId: "87",
                    username: "admin",
                    displayName: "Admin Burke"
                },
                accessLevel: 4
            },
            {
                user: {
                    userId: "1",
                    username: "stigmanadmin",
                    displayName: "STIGMAN Admin"
                },
                accessLevel: 4
            },
            {
                user: {
                    userId: "45",
                    username: "lvl4",
                    displayName: "lvl4"
                },
                accessLevel: 4
            }
          ]

          const ownersProjected = [
            {
                // "email": "admin@admin.com",
                userId: "87",
                username: "admin",
                displayName: "Admin Burke"
            },
            {
                // "email": null,
                userId: "1",
                username: "stigmanadmin",
                displayName: "STIGMAN Admin"
            },
            {
                // "email": null,
                userId: "45",
                username: "lvl4",
                displayName:  null
            }
          ]

          const stigsProjected = [
            {
                ruleCount: 81,
                benchmarkId: "VPN_SRG_TEST",
                revisionStr: "V1R0",
                benchmarkDate: "2010-07-19",
                revisionPinned: true
            },
            {
                ruleCount: 287,
                benchmarkId: "Windows_10_STIG_TEST",
                revisionStr: "V1R23",
                benchmarkDate: "2020-06-17",
                revisionPinned: false
            }
          ]

          const statisticsProjected = {
            assetCount: 4,
            grantCount: 7,
            checklistCount: 6
          }

          const labelsProjected = [
            {
                name: "test-label-full",
                description: "",
                color: "FF99CC",
                uses: 2
            },
            {
                name: "test-label-lvl1",
                description: "",
                color: "99CCFF",
                uses: 1
            }
          ]
          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${enviornment.testCollection.collectionId}/clone?projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs&projection=labels`        )
            .set("Authorization", `Bearer ${user.token}`)
            .send({
              name:"Clone_" + Math.floor(Math.random() * 100) + "-" + Math.floor(Math.random() * 100) + "_X",
              description: "clone of test collection x",
              options: {
                grants: true,
                labels: true,
                assets: true,
                stigMappings: "withReviews",
                pinRevisions: "matchSource",
              },
            })
            let clonedCollectionId = null
            expect(res).to.have.status(200)
            const response = res.body.toString().split("\n")
            expect(response).to.be.an('array')
            for(const message of response){ 
                if(message.length > 0){
                    let messageObj = JSON.parse(message)
                    if(messageObj.stage == "result"){
                        clonedCollectionId = messageObj.collection.collectionId
                        // assets 
                        for(const asset of messageObj.collection.assets){
                          expect(asset.name).to.be.oneOf(assetsProjected.map(a => a.name))
                        }
                        // grants
                        expect(messageObj.collection.grants).to.have.lengthOf(7)
                        for(const grant of messageObj.collection.grants){
                            expect(grant.user.userId).to.be.oneOf(grantsProjected.map(g => g.user.userId))
                            expect(grant.accessLevel).to.be.oneOf(grantsProjected.map(g => g.accessLevel))
                        }
                        // owners
                        expect(messageObj.collection.owners).to.have.lengthOf(3)
                        for(const owner of messageObj.collection.owners){
                            expect(owner.userId).to.be.oneOf(ownersProjected.map(o => o.userId))
                        }
                        // statistics
                        expect(messageObj.collection.statistics.assetCount).to.eql(statisticsProjected.assetCount);
                        expect(messageObj.collection.statistics.grantCount).to.eql(statisticsProjected.grantCount);
                        expect(messageObj.collection.statistics.checklistCount).to.eql(statisticsProjected.checklistCount);
                        // stigs 
                        expect(messageObj.collection.stigs).to.have.lengthOf(2)
                        expect(messageObj.collection.stigs).to.eql(stigsProjected)
                        for(const stig of messageObj.collection.stigs){
                            expect(stig.benchmarkId).to.be.oneOf(enviornment.testCollection.validStigs)
                            
                        }
                        // labels
                        expect(messageObj.collection.labels).to.have.lengthOf(2)
                        for(const label of messageObj.collection.labels){
                            expect(label.name).to.be.oneOf(labelsProjected.map(l => l.name))
                        }
                    }
                }
            }
            
            if(clonedCollectionId !== null){
            // check reviews are there.
            const clonedCollectionReviews = await utils.getReviews(clonedCollectionId)
            const sourceCollectionReviews = await utils.getReviews(enviornment.testCollection.collectionId)
            expect(clonedCollectionReviews).to.exist
            expect(sourceCollectionReviews).to.exist
            expect(clonedCollectionReviews).to.be.an('array').of.length(sourceCollectionReviews.length)
            const reviewRegex = "test"
            const assetRegex = "asset"

            for(const review of clonedCollectionReviews){
                expect(review.detail).to.match(new RegExp(reviewRegex))
                expect(review.assetName).to.match(new RegExp(assetRegex))
            }

            // compare the cloned collection with the source collection should be the same
            const clonedCollection = await utils.getCollection(clonedCollectionId)
            const sourceCollection = await utils.getCollection(enviornment.testCollection.collectionId)
            expect(sourceCollection).to.exist
            expect(clonedCollection).to.exist 

            for(const asset of clonedCollection.assets){
                expect(asset.name).to.be.oneOf(sourceCollection.assets.map(a => a.name))
            }
            expect(clonedCollection.assets).to.have.lengthOf(sourceCollection.assets.length)
            expect(clonedCollection.grants).to.have.lengthOf(sourceCollection.grants.length)
            expect(clonedCollection.labels).to.have.lengthOf(sourceCollection.labels.length)
            expect(clonedCollection.owners).to.have.lengthOf(sourceCollection.owners.length)
          }
        })

        it("clone test collection - no grants", async () => {
          const grantsProjected = [
            {
                user: {
                    userId: "1",
                    username: "stigmanadmin",
                    displayName: "STIGMAN Admin"
                },
                accessLevel: 4
            }
        ]
        const ownersProjected = [
              {
                  userId: "1",
                  username: "stigmanadmin",
                  displayName: "STIGMAN Admin"
              }
          ]

          const res = await chai
          .request(config.baseUrl)
          .post(`/collections/${enviornment.testCollection.collectionId}/clone?projection=grants&projection=owners`        )
          .set("Authorization", `Bearer ${user.token}`)
          .send({
            name:"Clone_" + Math.floor(Math.random() * 100) + "-" + Math.floor(Math.random() * 100) + "_X",
            description: "clone of test collection x",
            options: {
              grants: false,
              labels: true,
              assets: true,
              stigMappings: "withReviews",
              pinRevisions: "matchSource",
            },
          })
          let clonedCollectionId = null
          expect(res).to.have.status(200)
          const response = res.body.toString().split("\n")
          expect(response).to.be.an('array')
          for(const message of response){ 
              if(message.length > 0){
                  let messageObj = JSON.parse(message)
                  if(messageObj.stage == "result"){
                      clonedCollectionId = messageObj.collection.collectionId
                      // grants
                      expect(messageObj.collection.owners).to.have.lengthOf(1)
                      for(const owner of messageObj.collection.owners){
                          expect(owner.userId).to.be.oneOf(ownersProjected.map(o => o.userId))
                      }
                      // owners
                      expect(messageObj.collection.owners).to.have.lengthOf(1)
                      for(const owner of messageObj.collection.owners){
                          expect(owner.userId).to.be.oneOf(ownersProjected.map(o => o.userId))
                      }
                  }
              }
          }
          // make sure cloned collection is there and has correct grants.
          if(clonedCollectionId !== null){
            const clonedCollection = await utils.getCollection(clonedCollectionId)
            expect(clonedCollection).to.exist 
            expect(clonedCollection.grants).to.have.lengthOf(1)
          }
        })
        it("clone test collection - no labels", async () => {

          const res = await chai
          .request(config.baseUrl)
          .post(`/collections/${enviornment.testCollection.collectionId}/clone?projection=labels`        )
          .set("Authorization", `Bearer ${user.token}`)
          .send({
            name:"Clone_" + Math.floor(Math.random() * 100) + "-" + Math.floor(Math.random() * 100) + "_X",
            description: "clone of test collection x",
            options: {
              grants: true,
              labels: false,
              assets: true,
              stigMappings: "withReviews",
              pinRevisions: "matchSource",
            },
          })
          let clonedCollectionId = null
          expect(res).to.have.status(200)
          const response = res.body.toString().split("\n")
          expect(response).to.be.an('array')
          for(const message of response){ 
              if(message.length > 0){
                  let messageObj = JSON.parse(message)
                  if(messageObj.stage == "result"){
                      clonedCollectionId = messageObj.collection.collectionId
                      // labels
                      expect(messageObj.collection.labels).to.have.lengthOf(0)
                  }
              }
          }
          // make sure cloned collection is there and has correct labels.
          if(clonedCollectionId !== null){
            const clonedCollection = await utils.getCollection(clonedCollectionId)
            expect(clonedCollection).to.exist 
            expect(clonedCollection.labels).to.have.lengthOf(0)
          }
        })
        it("clone test collection - no assets", async () => {

          const res = await chai
          .request(config.baseUrl)
          .post(`/collections/${enviornment.testCollection.collectionId}/clone?projection=assets`        )
          .set("Authorization", `Bearer ${user.token}`)
          .send({
            name:"Clone_" + Math.floor(Math.random() * 100) + "-" + Math.floor(Math.random() * 100) + "_X",
            description: "clone of test collection x",
            options: {
              grants: true,
              labels: true,
              assets: false,
              stigMappings: "withReviews",
              pinRevisions: "matchSource",
            },
          })
          let clonedCollectionId = null
          expect(res).to.have.status(200)
          const response = res.body.toString().split("\n")
          expect(response).to.be.an('array')
          for(const message of response){ 
              if(message.length > 0){
                  let messageObj = JSON.parse(message)
                  if(messageObj.stage == "result"){
                      clonedCollectionId = messageObj.collection.collectionId
                      // assets
                      expect(messageObj.collection.assets).to.have.lengthOf(0)
                  }
              }
          }
          // make sure cloned collection is there and has correct data.
          if(clonedCollectionId !== null){
            const clonedCollection = await utils.getCollection(clonedCollectionId)
            expect(clonedCollection).to.exist 
            expect(clonedCollection.assets).to.have.lengthOf(0)
          }
        })
        it("clone test collection - stigMappings=none", async () => {

          const res = await chai
          .request(config.baseUrl)
          .post(`/collections/${enviornment.testCollection.collectionId}/clone?projection=statistics&projection=stigs`)
          .set("Authorization", `Bearer ${user.token}`)
          .send({
            name:"Clone_" + Math.floor(Math.random() * 100) + "-" + Math.floor(Math.random() * 100) + "_X",
            description: "clone of test collection x",
            options: {
              grants: true,
              labels: true,
              assets: true,
              stigMappings: "none",
              pinRevisions: "matchSource",
            },
          })
          let clonedCollectionId = null
          expect(res).to.have.status(200)
          const response = res.body.toString().split("\n")
          expect(response).to.be.an('array')
          for(const message of response){ 
              if(message.length > 0){
                  let messageObj = JSON.parse(message)
                  if(messageObj.stage == "result"){
                      clonedCollectionId = messageObj.collection.collectionId
                      expect(messageObj.collection.stigs).to.have.lengthOf(0)
                      expect(messageObj.collection.statistics.checklistCount).to.equal(0)
                  }
              }
          }
          // make sure cloned collection is there and has correct data.
          if(clonedCollectionId !== null){
            const clonedCollection = await utils.getCollection(clonedCollectionId)
            expect(clonedCollection).to.exist 
            expect(clonedCollection.stigs).to.have.lengthOf(0)
            expect(clonedCollection.statistics.checklistCount).to.equal(0)
          }
        })
        it("clone test collection - stigMappings=withoutReviews", async () => {

          const res = await chai
          .request(config.baseUrl)
          .post(`/collections/${enviornment.testCollection.collectionId}/clone?projection=statistics&projection=stigs`)
          .set("Authorization", `Bearer ${user.token}`)
          .send({
            name:"Clone_" + Math.floor(Math.random() * 100) + "-" + Math.floor(Math.random() * 100) + "_X",
            description: "clone of test collection x",
            options: {
              grants: true,
              labels: true,
              assets: true,
              stigMappings: "withoutReviews",
              pinRevisions: "matchSource",
            },
          })
          let clonedCollectionId = null
          expect(res).to.have.status(200)
          const response = res.body.toString().split("\n")
          expect(response).to.be.an('array')
          for(const message of response){ 
              if(message.length > 0){
                  let messageObj = JSON.parse(message)
                  if(messageObj.stage == "result"){
                      clonedCollectionId = messageObj.collection.collectionId
                  }
              }
          }
          // make sure cloned collection is there and has correct data.
          if(clonedCollectionId !== null){
            const clonedCollectionReviews = await utils.getReviews(clonedCollectionId)
            expect(clonedCollectionReviews).to.be.empty 
        
          }
        })
        it("clone test collection - pinRevisions=sourceDefaults", async () => {

          const pinnedRevision ={
            ruleCount: 81,
            benchmarkId: "VPN_SRG_TEST",
            revisionStr: "V1R0",
            benchmarkDate: "2010-07-19",
            revisionPinned: true
        }

          const res = await chai
          .request(config.baseUrl)
          .post(`/collections/${enviornment.testCollection.collectionId}/clone?projection=statistics&projection=stigs`)
          .set("Authorization", `Bearer ${user.token}`)
          .send({
            name:"Clone_" + Math.floor(Math.random() * 100) + "-" + Math.floor(Math.random() * 100) + "_X",
            description: "clone of test collection x",
            options: {
              grants: true,
              labels: true,
              assets: true,
              stigMappings: "withReviews",
              pinRevisions: "sourceDefaults",
            },
          })
          let clonedCollectionId = null
          expect(res).to.have.status(200)
          const response = res.body.toString().split("\n")
          expect(response).to.be.an('array')
          for(const message of response){ 
              if(message.length > 0){
                  let messageObj = JSON.parse(message)
                  if(messageObj.stage == "result"){
                      clonedCollectionId = messageObj.collection.collectionId
                      //stigs
                      for(const stig of messageObj.collection.stigs){
                        if(stig.benchmarkId == pinnedRevision.benchmarkId){
                          expect(stig.revisionPinned).to.equal(pinnedRevision.revisionPinned)
                        }
                      }
                  }
              }
          }
          if(clonedCollectionId !== null){
            const pinnedStig = await utils.getStigByCollectionBenchmarkId(clonedCollectionId, pinnedRevision.benchmarkId)
            expect(pinnedStig).to.exist 
            expect(pinnedStig.revisionPinned).to.equal(pinnedRevision.revisionPinned)
          }
        })
      })
      describe("exportToCollection - /collections/{collectionId}/export-to/{dstCollectionId}", () => {

        before(async function () {
          this.timeout(4000)
          await utils.loadAppData()
          await utils.uploadTestStigs()
          await utils.createDisabledCollectionsandAssets()
        })
        
        it("export results to another collection - entire asset - create asset in destination", async () => {

          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${enviornment.testCollection.collectionId}/export-to/${enviornment.scrapCollection.collectionId}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send([
              {
                assetId: enviornment.testAsset.assetId,
              },
            ])
            expect(res).to.have.status(200)
            const response = res.body.toString().split("\n")
            expect(response).to.be.an('array')
            expect(response).to.have.lengthOf.at.least(1)

            for(const message of response){ 
                if(message.length > 0){
                    let messageObj = JSON.parse(message)
                    if(messageObj.stage == "result"){
                      expect(messageObj.counts.assetsCreated).to.eql(1)
                      expect(messageObj.counts.stigsMapped).to.eql(2)
                      expect(messageObj.counts.reviewsInserted).to.eql(9)
                      expect(messageObj.counts.reviewsUpdated).to.eql(0)
                    }
                }
            }
        })
        it("export results to another collection - entire asset - asset exists", async () => {

          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${enviornment.testCollection.collectionId}/export-to/${enviornment.scrapCollection.collectionId}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send([
              {
                assetId: enviornment.testAsset.assetId,
              },
            ])
            expect(res).to.have.status(200)
            const response = res.body.toString().split("\n")
            expect(response).to.be.an('array')
            expect(response).to.have.lengthOf.at.least(1)
            for(const message of response){ 
                if(message.length > 0){
                    let messageObj = JSON.parse(message)
                    if(messageObj.stage == "result"){
                      expect(messageObj.counts.assetsCreated).to.eql(0)
                      expect(messageObj.counts.stigsMapped).to.eql(0)
                      expect(messageObj.counts.reviewsInserted).to.eql(0)
                      expect(messageObj.counts.reviewsUpdated).to.eql(9)
                    }
                }
            }
        })
      })
      describe("createCollectionLabel - /collections/{collectionId}/labels", () => {

        it("Create Label in a Collection", async () => {

          const request = {
              "name": "test-label-POST",
              "description": "test label POSTED",
              "color": "aa34cc"
            }
          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${enviornment.scrapCollection.collectionId}/labels`)
            .set("Authorization", `Bearer ${user.token}`)
            .send(request)
            expect(res).to.have.status(201)
            expect(res.body.name).to.equal(request.name)
            expect(res.body.description).to.equal(request.description)
            expect(res.body.color).to.equal(request.color)
            expect(res.body.uses).to.equal(0)
        })
      })
      describe("writeStigPropsByCollectionStig - /collections/{collectionId}/stigs/{benchmarkId}", () => {
        before(async function () {
          this.timeout(4000)
          await utils.loadAppData()
          await utils.uploadTestStigs()
          await utils.createDisabledCollectionsandAssets()
        })

        it("Set the Assets mapped to a STIG - default rev and assets", async () => {

          const post = {
            defaultRevisionStr: "V1R1",
            assetIds: ["62", "42", "154"],
          }

          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${enviornment.testCollection.collectionId}/stigs/${enviornment.testCollection.benchmark}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send(post)
            expect(res).to.have.status(200)
            expect(res.body.revisionStr).to.equal("V1R1")
            expect(res.body.revisionPinned).to.equal(true)
            expect(res.body.ruleCount).to.equal(81)
            expect(res.body.benchmarkId).to.equal(enviornment.testCollection.benchmark)
            expect(res.body.assetCount).to.equal(3)
        })

        it("Set the Assets mapped to a STIG - default latest and assets", async () => {

          const post = {
            defaultRevisionStr: "latest",
            assetIds: ["62", "42", "154"],
          }

          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${enviornment.testCollection.collectionId}/stigs/${enviornment.testCollection.benchmark}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send(post)
            expect(res).to.have.status(200)
            expect(res.body.revisionStr).to.equal("V1R1")
            expect(res.body.revisionPinned).to.equal(false)
            expect(res.body.ruleCount).to.equal(81)
            expect(res.body.benchmarkId).to.equal(enviornment.testCollection.benchmark)
            expect(res.body.assetCount).to.equal(3)
        })
        it("Set the Assets mapped to a STIG - assets only", async () => {

          const post = {
            assetIds: ["62", "42", "154"],
          }

          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${enviornment.testCollection.collectionId}/stigs/${enviornment.testCollection.benchmark}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send(post)
            expect(res).to.have.status(200)
            expect(res.body.revisionStr).to.equal("V1R1")
            expect(res.body.revisionPinned).to.equal(false)
            expect(res.body.ruleCount).to.equal(81)
            expect(res.body.benchmarkId).to.equal(enviornment.testCollection.benchmark)
            expect(res.body.assetCount).to.equal(3)
        })
        it("Set the Assets mapped to a STIG - invalid rev - expect 422", async () => {

          const post = {
          "defaultRevisionStr": "V1R5"
          }

          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${enviornment.testCollection.collectionId}/stigs/${enviornment.testCollection.benchmark}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send(post)
            expect(res).to.have.status(422)
        })
        it("Set the Assets mapped to a STIG - default rev only", async () => {

          const post = {
          defaultRevisionStr: "V1R0"
          }

          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${enviornment.testCollection.collectionId}/stigs/${enviornment.testCollection.benchmark}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send(post)
            expect(res).to.have.status(200)
            expect(res.body.revisionStr).to.equal("V1R0")
            expect(res.body.revisionPinned).to.equal(true)
            expect(res.body.ruleCount).to.equal(81)
            expect(res.body.benchmarkId).to.equal(enviornment.testCollection.benchmark)
            expect(res.body.assetCount).to.equal(3)
        })
        it("Set the Assets mapped to a STIG - clear assets", async () => {

          const post = {
          assetIds: []
          }

          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${enviornment.testCollection.collectionId}/stigs/${enviornment.testCollection.benchmark}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send(post)
            expect(res).to.have.status(204)
        })
        it("Set the Assets mapped to a STIG - after pinned delete", async () => {

          const post = {
          "assetIds": ["62","42","154"]
          }

          const res = await chai
            .request(config.baseUrl)
            .post(`/collections/${enviornment.testCollection.collectionId}/stigs/${enviornment.testCollection.benchmark}`)
            .set("Authorization", `Bearer ${user.token}`)
            .send(post)
            expect(res).to.have.status(200)
            expect(res.body.revisionStr).to.equal("V1R1")
            expect(res.body.revisionPinned).to.equal(false)
            expect(res.body.ruleCount).to.equal(81)
            expect(res.body.benchmarkId).to.equal(enviornment.testCollection.benchmark)
            expect(res.body.assetCount).to.equal(3)
        })
      })
    })
  }
})


