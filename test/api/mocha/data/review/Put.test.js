const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const reviewEnv = require('../../reviewEnv.json')
const xml2js = require('xml2js');
const user =
  {
    "name": "stigmanadmin",
    "grant": "Owner",
    "token":
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ2ODEwMzUsImlhdCI6MTY3MDU0MDIzNiwiYXV0aF90aW1lIjoxNjcwNTQwMjM1LCJqdGkiOiI0N2Y5YWE3ZC1iYWM0LTQwOTgtOWJlOC1hY2U3NTUxM2FhN2YiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJiN2M3OGE2Mi1iODRmLTQ1NzgtYTk4My0yZWJjNjZmZDllZmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjMzNzhkYWZmLTA0MDQtNDNiMy1iNGFiLWVlMzFmZjczNDBhYyIsInNlc3Npb25fc3RhdGUiOiI4NzM2NWIzMy0yYzc2LTRiM2MtODQ4NS1mYmE1ZGJmZjRiOWYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImNyZWF0ZV9jb2xsZWN0aW9uIiwiZGVmYXVsdC1yb2xlcy1zdGlnbWFuIiwiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb24gc3RpZy1tYW5hZ2VyOnN0aWc6cmVhZCBzdGlnLW1hbmFnZXI6dXNlcjpyZWFkIHN0aWctbWFuYWdlcjpvcCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbjpyZWFkIHN0aWctbWFuYWdlcjpvcDpyZWFkIHN0aWctbWFuYWdlcjp1c2VyIHN0aWctbWFuYWdlciBzdGlnLW1hbmFnZXI6c3RpZyIsInNpZCI6Ijg3MzY1YjMzLTJjNzYtNGIzYy04NDg1LWZiYTVkYmZmNGI5ZiIsIm5hbWUiOiJTVElHTUFOIEFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3RpZ21hbmFkbWluIiwiZ2l2ZW5fbmFtZSI6IlNUSUdNQU4iLCJmYW1pbHlfbmFtZSI6IkFkbWluIn0.a1XwJZw_FIzwMXKo-Dr-n11me5ut-SF9ni7ylX-7t7AVrH1eAqyBxX9DXaxFK0xs6YOhoPsh9NyW8UFVaYgtF68Ps6yzoiqFEeiRXkpN5ygICN3H3z6r-YwanLlEeaYR3P2EtHRcrBtCnt0VEKKbGPWOfeiNCVe3etlp9-NQo44"
  }


describe('Review Put tests using "admin" user ', () => {

    let deletedCollection, deletedAsset
    before(async function () {
        this.timeout(4000)
        await utils.loadAppData()
        await utils.uploadTestStigs()
        const deletedItems = await utils.createDisabledCollectionsandAssets()
        deletedCollection = deletedItems.collection
        deletedAsset = deletedItems.asset
    })

    
  describe('PUT - putReviewByAssetRule - /collections/{collectionId}/reviews/{assetId}/{ruleId}', () => {
    
    it('PUT Review: no resultEngine - check response does not include "resultEngine": 0', async () => {

        const putBody = {
            result: 'pass',
            detail: 'test',
            comment: null,
            status: 'saved'
        }

        const res = await chai.request(config.baseUrl)
            .put(`/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAsset.assetId}/${reviewEnv.freshRuleId}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(putBody)

        const expectedResponse = {  
            assetId: "42",
            assetName: "Collection_X_lvl1_asset-1",
            assetLabelIds: [
            "755b8a28-9a68-11ec-b1bc-0242ac110002",
            "5130dc84-9a68-11ec-b1bc-0242ac110002"
            ],
            ruleId: reviewEnv.freshRuleId,
        ruleIds: [
            reviewEnv.freshRuleId
            ],  
            result: putBody.result,
            resultEngine: null,
            detail: putBody.detail,
            autoResult: false,
            comment: "",
            userId: "1",
            username: user.name,
            ts: res.body.ts,
            touchTs: res.body.touchTs,
            status: {
                ts: res.body.status.ts,
                text: null,
                user: {
                    userId: "1",
                    username: user.name
                },
                label: putBody.status
            }
        }
        expect(res).to.have.status(201)
        expect(res.body).to.be.an('object')
        expect(res.body).to.eql(expectedResponse)
    })
    it('PUT Review: accepted, pass, no detail', async () => {

        const putBody = {
            result: 'pass',
            detail: '',
            comment: 'sure',
            status: 'accepted',
            autoResult: false
        }

        const res = await chai.request(config.baseUrl)
            .put(`/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAsset.assetId}/${reviewEnv.testCollection.ruleId}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(putBody)

        expect(res).to.have.status(403)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property("error")
    })
    it('PUT Review: saved, pass, no detail', async () => {

        const putBody = {
            result: 'pass',
            detail: '',
            comment: 'sure',
            status: 'saved',
            autoResult: false
        }

        const res = await chai.request(config.baseUrl)
            .put(`/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAsset.assetId}/${reviewEnv.testCollection.ruleId}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(putBody)

        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property("result")
        expect(res.body).to.have.property("detail")
        expect(res.body).to.have.property("comment")
        expect(res.body).to.have.property("status")
        expect(res.body.result).to.equal(putBody.result)
        expect(res.body.detail).to.equal(putBody.detail)
        expect(res.body.comment).to.equal(putBody.comment)
        expect(res.body.status.label).to.equal(putBody.status)
    })
    it('PUT Review: submit, fail, no comment', async () => {

        const putBody = {
            result: 'fail',
            detail: 'string',
            comment: '',
            status: 'submitted',
            autoResult: false
        }

        const res = await chai.request(config.baseUrl)
            .put(`/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAsset.assetId}/${reviewEnv.testCollection.ruleId}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(putBody)

        expect(res).to.have.status(403)
    })
    it('PUT Review: submitted, pass, no detail Copy', async () => {

        const putBody = {
            result: 'pass',
            detail: '',
            comment: 'sure',
            status: 'submitted',
            autoResult: false
        }

        const res = await chai.request(config.baseUrl)
            .put(`/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAsset.assetId}/${reviewEnv.testCollection.ruleId}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(putBody)

        expect(res).to.have.status(403)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property("error")
    })
    it('Check that informational results are represented as NotReviewd with Finding Details data in .ckls', async () => {

        const putBody = {
        result: 'informational',
        detail:
            'test\nvisible to lvl1, THIS REVIEW IS INFORMATIONAL (but comes back as Not_Reviewed in a ckl)',
        comment: 'sure',
        autoResult: false,
        status: 'saved'
        }

        const res = await chai.request(config.baseUrl)
            .put(`/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAsset.assetId}/${reviewEnv.testCollection.ruleId}?projection=rule&projection=history&projection=stigs`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(putBody)

        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property("result")
        expect(res.body).to.have.property("detail")
        expect(res.body).to.have.property("comment")
        expect(res.body).to.have.property("status")
        expect(res.body.result).to.equal(putBody.result)
        expect(res.body.detail).to.equal(putBody.detail)
        expect(res.body.comment).to.equal(putBody.comment)
        expect(res.body.status.label).to.equal(putBody.status)

        const review = await utils.getChecklist(reviewEnv.testAsset.assetId, reviewEnv.testCollection.benchmark, reviewEnv.testCollection.revisionStr)

        let cklData
        xml2js.parseString(review, function (err, result) {
            cklData = result;
        })
        let cklIStigs = cklData.CHECKLIST.STIGS[0].iSTIG
        let currentStigId

        for(let stig of cklIStigs){
            for(let cklData of stig.STIG_INFO[0].SI_DATA){
                if (cklData.SID_NAME[0] == 'stigid'){
                    currentStigId = cklData.SID_DATA[0]
                    expect(currentStigId).to.be.oneOf(reviewEnv.testCollection.validStigs);
                }
            }
            let cklVulns = stig.VULN;
            expect(cklVulns).to.be.an('array')

            if (currentStigId == 'VPN_SRG_TEST') {
                expect(cklVulns).to.be.an('array').of.length(81);
    
                for (let thisVuln of cklVulns){
                    for (let stigData of thisVuln.STIG_DATA){
                        if (stigData.ATTRIBUTE_DATA[0] == 'SV-106179r1_rule'){
                            var commentRegex = new RegExp("INFORMATIONAL");
                            var statusRegex = new RegExp("Not_Reviewed");
                            expect(thisVuln.FINDING_DETAILS[0]).to.match(commentRegex);
                            expect(thisVuln.STATUS[0]).to.match(statusRegex);
                        }
                    }
                }
    
            }
    
        }
    })
    it('Set all properties of a Review - invalid result enum', async () => {

        const putBody = {
            result: 'invalid',
            detail: '',
            comment: 'sure',
            status: 'submitted',
            autoResult: false
        }

        const res = await chai.request(config.baseUrl)
            .put(`/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAsset.assetId}/${reviewEnv.testCollection.ruleId}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(putBody)

        expect(res).to.have.status(400)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property("error")
    })
    it('Set all properties of a Review - with metadata', async () => {

        const putBody = JSON.parse(JSON.stringify({
            result: 'pass',
            detail: 'test\nvisible to lvl1',
            comment: 'sure',
            autoResult: false,
            status: 'submitted',
            metadata: {
                [reviewEnv.testCollection.metadataKey]: reviewEnv.testCollection.metadataValue
            }

        }))

        const res = await chai.request(config.baseUrl)
            .put(`/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAsset.assetId}/${reviewEnv.testCollection.ruleId}?projection=rule&projection=history&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(putBody)

        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property("result")
        expect(res.body).to.have.property("detail")
        expect(res.body).to.have.property("comment")
        expect(res.body).to.have.property("status")
        expect(res.body).to.have.property("metadata")
        expect(res.body.result).to.equal(putBody.result)
        expect(res.body.detail).to.equal(putBody.detail)
        expect(res.body.comment).to.equal(putBody.comment)
        expect(res.body.status.label).to.equal(putBody.status)
        expect(res.body.metadata).to.be.an('object')
        expect(res.body.metadata).to.have.property(reviewEnv.testCollection.metadataKey)
        expect(res.body.metadata[reviewEnv.testCollection.metadataKey]).to.be.equal(reviewEnv.testCollection.metadataValue)

    })
    it('PUT Review: asset in deleted collection', async () => {

        const putBody = {
            result: 'pass',
            detail: 'test\nvisible to lvl1',
            comment: 'sure',
            autoResult: false,
            status: 'submitted'
        }
        const res = await chai.request(config.baseUrl)
            .put(`/collections/${deletedCollection.collectionId}/reviews/${deletedAsset.assetId}/${reviewEnv.testCollection.ruleId}`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(putBody)

        expect(res).to.have.status(403)
    })
    it('Test all projections are returned and contain accurate data. ', async () => {

        const putBody = {
            result: 'pass',
            detail: 'test\nvisible to lvl1',
            comment: 'sure',
            autoResult: false,
            status: 'submitted'
        }
   
        const res = await chai.request(config.baseUrl)
            .put(`/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAsset.assetId}/${reviewEnv.testCollection.ruleId}?projection=rule&projection=history&projection=stigs&projection=metadata`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(putBody)

        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body.result).to.equal(putBody.result)
        expect(res.body.detail).to.equal(putBody.detail)
        expect(res.body.comment).to.equal(putBody.comment)
        expect(res.body.status.label).to.equal(putBody.status)
        expect(res.body.metadata).to.be.an('object')
        expect(res.body.metadata).to.have.property(reviewEnv.testCollection.metadataKey)
        expect(res.body.metadata[reviewEnv.testCollection.metadataKey]).to.be.equal(reviewEnv.testCollection.metadataValue)

        //projections

        expect(res.body).to.have.property("rule")
        expect(res.body).to.have.property("history")
        expect(res.body).to.have.property("stigs")
        expect(res.body).to.have.property("metadata")

        expect(res.body.rule.ruleId).to.be.eql(reviewEnv.testCollection.ruleId)
        expect(res.body.history).to.have.lengthOf(6)
        expect(res.body.stigs).to.have.lengthOf(1)
        expect(res.body.metadata).to.have.property(reviewEnv.testCollection.metadataKey)
        expect(res.body.metadata[reviewEnv.testCollection.metadataKey]).to.be.equal(reviewEnv.testCollection.metadataValue)

        expect(res.body.rule).to.be.an('object')
        expect(res.body.rule.ruleId).to.be.eql(reviewEnv.testCollection.ruleId)
    })
    it('Set properties of a Review ', async () => {

        const putBody = {
            "autoResult": true,
            "comment": "comment",
            "detail": "detail",
            "metadata": {
              "additionalProp1": "string",
              
            },
            "result": "fail",
            "resultEngine": {
              "checkContent": {
                "component": "string",
                "location": "string"
              },
              "overrides": [
                {
                  "authority": "string",
                  "newResult": "fail",
                  "oldResult": "fail",
                  "remark": "string",
                  "time": "2024-06-05T17:01:07.162Z"
                }
              ],
              "product": "string",
              "time": "2024-06-05T17:01:07.162Z",
              "type": "scap",
              "version": "string"
            },
            "status": "saved"
        }
        
        const res = await chai.request(config.baseUrl)
        .put(`/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAsset.assetId}/${reviewEnv.testCollection.ruleId}?projection=rule&projection=history&projection=stigs&projection=metadata`)
        .set('Authorization', `Bearer ${user.token}`)
        .send(putBody)

        expect(res).to.have.status(200)
        expect(res.body.assetId).to.be.eql(reviewEnv.testAsset.assetId)
        expect(res.body.result).to.be.eql(putBody.result)
        expect(res.body.detail).to.be.eql(putBody.detail)
        expect(res.body.comment).to.be.eql(putBody.comment)
        expect(res.body.status.label).to.be.eql(putBody.status)
        expect(res.body.metadata).to.be.eql(putBody.metadata)
        expect(res.body.resultEngine).to.be.eql(putBody.resultEngine)



   

    })
  })

  describe('PUT - putReviewMetadata - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata', () => {

    before(async function () {
      this.timeout(4000)
      await utils.loadAppData()
      await utils.uploadTestStigs()
      await utils.createDisabledCollectionsandAssets()
    })

    it('Set all metadata of a Review', async () => {
      const res = await chai.request(config.baseUrl)
        .put(`/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAsset.assetId}/${reviewEnv.testCollection.ruleId}/metadata`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({[reviewEnv.testCollection.metadataKey]: reviewEnv.testCollection.metadataValue})
 
      expect(res).to.have.status(200)
      expect(res.body).to.eql({[reviewEnv.testCollection.metadataKey]: reviewEnv.testCollection.metadataValue})
    
    })
  })

  describe('PUT - putReviewMetadataValue - /collections/{collectionId}/reviews/{assetId}/{ruleId}/metadata/keys/{key}', () => {

    before(async function () {
      this.timeout(4000)
      await utils.loadAppData()
      await utils.uploadTestStigs()
      await utils.createDisabledCollectionsandAssets()
    })

    it('Set one metadata key/value of a Review', async () => {
      const res = await chai.request(config.baseUrl)
        .put(`/collections/${reviewEnv.testCollection.collectionId}/reviews/${reviewEnv.testAsset.assetId}/${reviewEnv.testCollection.ruleId}/metadata/keys/${reviewEnv.testCollection.metadataKey}`)
        .set('Authorization', `Bearer ${user.token}`)
        .set('Content-Type', 'application/json') 
        .send(`${JSON.stringify(reviewEnv.testCollection.metadataValue)}`)
   
      expect(res).to.have.status(204)
    })
   
  })
})

