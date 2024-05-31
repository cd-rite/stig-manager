const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../testConfig.json')
const utils = require('../utils/testUtils')
const userEnv = require('../usersEnv.json')

const user =
  {
    "name": "stigmanadmin",
    "grant": "Owner",
    "token":
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ2ODEwMzUsImlhdCI6MTY3MDU0MDIzNiwiYXV0aF90aW1lIjoxNjcwNTQwMjM1LCJqdGkiOiI0N2Y5YWE3ZC1iYWM0LTQwOTgtOWJlOC1hY2U3NTUxM2FhN2YiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJiN2M3OGE2Mi1iODRmLTQ1NzgtYTk4My0yZWJjNjZmZDllZmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjMzNzhkYWZmLTA0MDQtNDNiMy1iNGFiLWVlMzFmZjczNDBhYyIsInNlc3Npb25fc3RhdGUiOiI4NzM2NWIzMy0yYzc2LTRiM2MtODQ4NS1mYmE1ZGJmZjRiOWYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImNyZWF0ZV9jb2xsZWN0aW9uIiwiZGVmYXVsdC1yb2xlcy1zdGlnbWFuIiwiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb24gc3RpZy1tYW5hZ2VyOnN0aWc6cmVhZCBzdGlnLW1hbmFnZXI6dXNlcjpyZWFkIHN0aWctbWFuYWdlcjpvcCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbjpyZWFkIHN0aWctbWFuYWdlcjpvcDpyZWFkIHN0aWctbWFuYWdlcjp1c2VyIHN0aWctbWFuYWdlciBzdGlnLW1hbmFnZXI6c3RpZyIsInNpZCI6Ijg3MzY1YjMzLTJjNzYtNGIzYy04NDg1LWZiYTVkYmZmNGI5ZiIsIm5hbWUiOiJTVElHTUFOIEFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3RpZ21hbmFkbWluIiwiZ2l2ZW5fbmFtZSI6IlNUSUdNQU4iLCJmYW1pbHlfbmFtZSI6IkFkbWluIn0.a1XwJZw_FIzwMXKo-Dr-n11me5ut-SF9ni7ylX-7t7AVrH1eAqyBxX9DXaxFK0xs6YOhoPsh9NyW8UFVaYgtF68Ps6yzoiqFEeiRXkpN5ygICN3H3z6r-YwanLlEeaYR3P2EtHRcrBtCnt0VEKKbGPWOfeiNCVe3etlp9-NQo44"
  }

describe('User GETS tests using "admin" user ', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  describe(`/user`, () => {

    it('Return the requesters user information - check user', async () => {
      const res = await chai
          .request(config.baseUrl)
          .get(`/user`)
          .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('privileges')
      expect(res.body).to.have.property('statistics')  
      expect(res.body.username).to.equal(user.name)
      for(grant of res.body.collectionGrants) {
        expect(grant).to.exist
        expect(grant).to.have.property('collection')
      }
    })
  })

  
  describe(`/users`, () => {

    it('Return a list of Users accessible to the requester USERNAME', async () => {

      const res = await chai
          .request(config.baseUrl)
          .get(`/users?elevate=true&username=${userEnv.wfTest.username}&projection=collectionGrants&projection=statistics`)
          .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body[0].username).to.equal('wf-test')
      expect(res.body[0].userId).to.equal(userEnv.wfTest.userId)
    })

    it('Return a list of Users accessible to the requester USERNAME no projections', async () => {

      const res = await chai
          .request(config.baseUrl)
          .get(`/users?elevate=true&username=${userEnv.wfTest.username}`)
          .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body[0].username).to.equal('wf-test')
      expect(res.body[0].userId).to.equal(userEnv.wfTest.userId)
    })
    it('Return a list of Users accessible to the requester', async () => {

      const res = await chai
          .request(config.baseUrl)
          .get(`/users?elevate=true&projection=collectionGrants&projection=statistics`)
          .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.an('array').of.length(10)
      for(let user of res.body) {
        expect(user).to.have.property('collectionGrants')
        expect(user).to.have.property('statistics')
        expect(user).to.have.property('username')
        expect(user).to.have.property('userId')
        expect(user.userId).to.be.oneOf(userEnv.allUserIds)
      }
    })

    
    it('Return a list of Users accessible to the requester - NO PROJECTIONS', async () => {

      const res = await chai
          .request(config.baseUrl)
          .get(`/users`)
          .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body).to.be.an('array').of.length(10)
          for(let user of res.body) {
            expect(user).to.have.property('username')
            expect(user).to.have.property('userId')
            expect(user).to.not.have.property('collectionGrants')
            expect(user).to.not.have.property('statistics')
            expect(user.userId).to.be.oneOf(userEnv.allUserIds)
          }
    })
  })

  describe(`/users{userId}}`, async () => {


    it('Return a User', async () => {
      const res = await chai
          .request(config.baseUrl)
          .get(`/users/${userEnv.wfTest.userId}?elevate=true&projection=collectionGrants&projection=statistics`)
          .set('Authorization', 'Bearer ' + user.token)

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('collectionGrants')
      expect(res.body).to.have.property('statistics')
      expect(res.body.username).to.equal(userEnv.wfTest.username)
      expect(res.body.userId).to.equal(userEnv.wfTest.userId)
    })
  })
})

describe('User POST tests using "admin" user ', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  describe(`/users`, () => {

    it('Create a User', async () => {
      const res = await chai
          .request(config.baseUrl)
          .post(`/users?elevate=true&projection=collectionGrants&projection=statistics`)
          .set('Authorization', 'Bearer ' + user.token)
          .send({
            "username": "TEST_USER" +  Math.floor(Math.random() * 1000),
            "collectionGrants": [
                {
                    "collectionId": `${userEnv.scrapCollection}`,
                    "accessLevel": 1
                }
            ]
        })

        expect(res).to.have.status(201)
        expect(res.body).to.be.an('object')
        for(let grant of res.body.collectionGrants) {
          expect(grant).to.have.property('collection')
          expect(grant).to.have.property('accessLevel')
          expect(grant.collection.collectionId).to.equal(userEnv.scrapCollection)
        }

        const createdUser = await utils.getUser(res.body.userId)

        expect(createdUser).to.be.an('object')
        expect(createdUser.username).to.equal(res.body.username)
        expect(createdUser.userId).to.equal(res.body.userId)
        expect(createdUser.collectionGrants).to.be.an('array')
        expect(createdUser.collectionGrants).to.have.lengthOf(1)
      })
    })
})


describe('User PATCH tests using "admin" user ', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  describe(`/users{userId}`, async () => {


    it('Merge provided properties with a User - Change Username', async () => {
      const res = await chai
            .request(config.baseUrl)
            .patch(`/users/${userEnv.scrapUser.userId}?elevate=true&projection=collectionGrants&projection=statistics`)
            .set('Authorization', 'Bearer ' + user.token)
            .send({
              "username": "PatchTest",
              "collectionGrants": [
                  {
                      "collectionId": `${userEnv.scrapCollection}`,
                      "accessLevel": 1
                  }
              ]
          })
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body.username).to.equal('PatchTest')
          expect(res.body.userId).to.equal(userEnv.scrapUser.userId)
          expect(res.body.collectionGrants).to.be.an('array')
          expect(res.body.statistics).to.be.an('object')

          for(let grant of res.body.collectionGrants) {
            expect(grant).to.have.property('collection')
            expect(grant).to.have.property('accessLevel')
            expect(grant.collection.collectionId).to.equal(userEnv.scrapCollection)
          }

          const userEffected = await utils.getUser(res.body.userId)

          expect(userEffected).to.be.an('object')
          expect(userEffected.username).to.equal(res.body.username)
          expect(userEffected.userId).to.equal(res.body.userId)
          expect(userEffected.collectionGrants).to.be.an('array')
        })
     })

  })

describe('User PUT tests using "admin" user ', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  describe(`/users{userId}`, async () => {


    it(`Set all properties of a User - Change Username`, async () => {
    const res = await chai
      .request(config.baseUrl)
      .put(`/users/${userEnv.scrapUser.userId}?elevate=true&projection=collectionGrants&projection=statistics`)
      .set('Authorization', 'Bearer ' + user.token)
      .send({
        "username": "putTesting",
        "collectionGrants": [
            {
                "collectionId": `${userEnv.scrapCollection}`,
                "accessLevel": 1
            }
        ]
      })
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body.username).to.equal('putTesting')
      expect(res.body.userId).to.equal(userEnv.scrapUser.userId)
      expect(res.body.collectionGrants).to.be.an('array')
      expect(res.body.statistics).to.be.an('object')

      for(let grant of res.body.collectionGrants) {
        expect(grant).to.have.property('collection')
        expect(grant).to.have.property('accessLevel')
        expect(grant.collection.collectionId).to.equal(userEnv.scrapCollection)
      }

      const userEffected = await utils.getUser(res.body.userId)

      expect(userEffected).to.be.an('object')
      expect(userEffected.username).to.equal(res.body.username)
      expect(userEffected.userId).to.equal(res.body.userId)
      expect(userEffected.collectionGrants).to.be.an('array')

    })
  })

})

describe('User Delete tests using "admin" user ', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  describe(`/users/{userId}`, async () => {

    it('Delete a User - fail due to user access record', async () => {
      const res = await chai
        .request(config.baseUrl)
        .delete(`/users/${userEnv.scrapAdmin.userId}?elevate=true&projection=collectionGrants&projection=statistics`)
        .set('Authorization', 'Bearer ' + user.token)

        expect(res).to.have.status(422)
    })
    it('Delete a User - succeed, as user has never accessed th system', async () => {
      const res = await chai
        .request(config.baseUrl)
        .delete(`/users/${userEnv.deleteUser.userId}?elevate=true&projection=collectionGrants&projection=statistics`)
        .set('Authorization', 'Bearer ' + user.token)

        expect(res).to.have.status(200)
        const userEffected = await utils.getUser(userEnv.deleteUser.userId)
        expect(userEffected).to.be.empty
    })

    it('Delete a User - not elevated', async () => {
      const res = await chai
        .request(config.baseUrl)
        .delete(`/users/${userEnv.deleteUser.userId}?elevate=false&projection=collectionGrants&projection=statistics`)
        .set('Authorization', 'Bearer ' + user.token)

        expect(res).to.have.status(403)
    })
  })
})
