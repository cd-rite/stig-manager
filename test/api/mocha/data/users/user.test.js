const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')
const users = require('../../iterations.json')

describe('GET - User', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const user of users) {

    describe(`user:${user.name}`, () => {

      describe(`GET - getUserObject - /user`, () => {

        it('Return the requesters user information - check user', async () => {
          const res = await chai
              .request(config.baseUrl)
              .get(`/user`)
              .set('Authorization', 'Bearer ' + user.token)

          expect(res).to.have.status(200)
          expect(res.body.username).to.equal(user.name)
          for(grant of res.body.collectionGrants) {
            expect(grant).to.exist
            expect(grant).to.have.property('collection')
          }
        })
      })
      
      describe(`GET - getUsers - /users`, () => {

        it('Return a list of Users accessible to the requester USERNAME', async () => {

          const res = await chai
              .request(config.baseUrl)
              .get(`/users?elevate=true&username=${environment.wfTest.username}&projection=collectionGrants&projection=statistics`)
              .set('Authorization', 'Bearer ' + user.token)

          if(user.name != "stigmanadmin"){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body[0].username).to.equal('wf-test')
          expect(res.body[0].userId).to.equal(environment.wfTest.userId)
        })
        it('Return a list of Users accessible to the requester USERNAME no projections', async () => {

          const res = await chai
              .request(config.baseUrl)
              .get(`/users?elevate=true&username=${environment.wfTest.username}`)
              .set('Authorization', 'Bearer ' + user.token)
          if(user.name != "stigmanadmin"){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body[0].username).to.equal('wf-test')
          expect(res.body[0].userId).to.equal(environment.wfTest.userId)
        })
        it('Return a list of Users accessible to the requester with elevate and projections', async () => {

          const res = await chai
              .request(config.baseUrl)
              .get(`/users?elevate=true&projection=collectionGrants&projection=statistics`)
              .set('Authorization', 'Bearer ' + user.token)
          if(user.name != "stigmanadmin"){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          expect(res.body).to.be.an('array').of.length(10)
          for(let user of res.body) {
            expect(user).to.have.property('collectionGrants')
            expect(user).to.have.property('statistics')
            expect(user).to.have.property('username')
            expect(user).to.have.property('userId')
            expect(user.userId).to.be.oneOf(environment.allUserIds)
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
                expect(user.userId).to.be.oneOf(environment.allUserIds)
              }
        })
        it('Return a list of Users accessible to the requester no projections for lvl1 sucess. ', async () => {

          const res = await chai
              .request(config.baseUrl)
              .get(`/users`)
              .set('Authorization', 'Bearer ' + user.token)
    
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array').of.length(10)
          for(let user of res.body) {
            expect(user.userId).to.be.oneOf(environment.allUserIds)
          }
        })
      })

      describe(`GET - getUserByUserId - /users{userId}}`, async () => {


        it('Return a User', async () => {
          const res = await chai
              .request(config.baseUrl)
              .get(`/users/${environment.wfTest.userId}?elevate=true&projection=collectionGrants&projection=statistics`)
              .set('Authorization', 'Bearer ' + user.token)
          if(user.name != "stigmanadmin"){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('collectionGrants')
          expect(res.body).to.have.property('statistics')
          expect(res.body.username).to.equal(environment.wfTest.username)
          expect(res.body.userId).to.equal(environment.wfTest.userId)
        })
      })
    })
  }
})

describe('POST - User', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const user of users) {
    describe(`user:${user.name}`, () => {
      describe(`POST - createUser - /users`, () => {
        it('Create a User', async () => {
          const res = await chai
              .request(config.baseUrl)
              .post(`/users?elevate=true&projection=collectionGrants&projection=statistics`)
              .set('Authorization', 'Bearer ' + user.token)
              .send({
                "username": "TEST_USER" +  Math.floor(Math.random() * 1000),
                "collectionGrants": [
                    {
                        "collectionId": `${environment.scrapCollection.collectionId}`,
                        "accessLevel": 1
                    }
                ]
            })
            if(user.name != "stigmanadmin"){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(201)
            expect(res.body).to.be.an('object')
            for(let grant of res.body.collectionGrants) {
              expect(grant).to.have.property('collection')
              expect(grant).to.have.property('accessLevel')
              expect(grant.collection.collectionId).to.equal(environment.scrapCollection.collectionId)
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
  }
})


describe('PATCH - User', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const user of users) {
    describe(`user:${user.name}`, () => {

      describe(`PATCH - updateUser - /users{userId}`, async () => {

        it('Merge provided properties with a User - Change Username', async () => {
          const res = await chai
                .request(config.baseUrl)
                .patch(`/users/${environment.scrapLvl1User.userId}?elevate=true&projection=collectionGrants&projection=statistics`)
                .set('Authorization', 'Bearer ' + user.token)
                .send({
                  "username": "PatchTest",
                  "collectionGrants": [
                      {
                          "collectionId": `${environment.scrapCollection.collectionId}`,
                          "accessLevel": 1
                      }
                  ]
              })
              if(user.name != "stigmanadmin"){
                expect(res).to.have.status(403)
                return
              }
              expect(res).to.have.status(200)
              expect(res.body).to.be.an('object')
              expect(res.body.username).to.equal('PatchTest')
              expect(res.body.userId).to.equal(environment.scrapLvl1User.userId)
              expect(res.body.collectionGrants).to.be.an('array')
              expect(res.body.statistics).to.be.an('object')

              for(let grant of res.body.collectionGrants) {
                expect(grant).to.have.property('collection')
                expect(grant).to.have.property('accessLevel')
                expect(grant.collection.collectionId).to.equal(environment.scrapCollection.collectionId)
              }

              const userEffected = await utils.getUser(res.body.userId)

              expect(userEffected).to.be.an('object')
              expect(userEffected.username).to.equal(res.body.username)
              expect(userEffected.userId).to.equal(res.body.userId)
              expect(userEffected.collectionGrants).to.be.an('array')
        })
      })
    })
  }
})

describe('PUT - User', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const user of users) {
    describe(`user:${user.name}`, () => {
      describe(`PUT - replaceUser - /users{userId}`, async () => {


        it(`Set all properties of a User - Change Username`, async () => {
        const res = await chai
          .request(config.baseUrl)
          .put(`/users/${environment.scrapLvl1User.userId}?elevate=true&projection=collectionGrants&projection=statistics`)
          .set('Authorization', 'Bearer ' + user.token)
          .send({
            "username": "putTesting",
            "collectionGrants": [
                {
                    "collectionId": `${environment.scrapCollection.collectionId}`,
                    "accessLevel": 1
                }
            ]
          })
          if(user.name != "stigmanadmin"){
            expect(res).to.have.status(403)
            return
          }
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body.username).to.equal('putTesting')
          expect(res.body.userId).to.equal(environment.scrapLvl1User.userId)
          expect(res.body.collectionGrants).to.be.an('array')
          expect(res.body.statistics).to.be.an('object')

          for(let grant of res.body.collectionGrants) {
            expect(grant).to.have.property('collection')
            expect(grant).to.have.property('accessLevel')
            expect(grant.collection.collectionId).to.equal(environment.scrapCollection.collectionId)
          }

          const userEffected = await utils.getUser(res.body.userId)

          expect(userEffected).to.be.an('object')
          expect(userEffected.username).to.equal(res.body.username)
          expect(userEffected.userId).to.equal(res.body.userId)
          expect(userEffected.collectionGrants).to.be.an('array')

        })
      })
    })
  }
})

describe('DELETE - User', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  for(const user of users) {
    describe(`user:${user.name}`, () => {

      describe(`DELETE - deleteUser - /users/{userId}`, async () => {
        it('Delete a User - fail due to user access record', async () => {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/users/${environment.admin.userId}?elevate=true&projection=collectionGrants&projection=statistics`)
            .set('Authorization', 'Bearer ' + user.token)
            if(user.name != "stigmanadmin"){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(422)
        })
        it('Delete a User - succeed, as user has never accessed th system', async () => {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/users/${environment.deleteUser.userId}?elevate=true&projection=collectionGrants&projection=statistics`)
            .set('Authorization', 'Bearer ' + user.token)
            if(user.name != "stigmanadmin"){
              expect(res).to.have.status(403)
              return
            }
            expect(res).to.have.status(200)
            const userEffected = await utils.getUser(environment.deleteUser.userId)
            expect(userEffected).to.be.empty
        })
        it('Delete a User - not elevated', async () => {
          const res = await chai
            .request(config.baseUrl)
            .delete(`/users/${environment.deleteUser.userId}?elevate=false&projection=collectionGrants&projection=statistics`)
            .set('Authorization', 'Bearer ' + user.token)

            expect(res).to.have.status(403)
        })
      })
    })
  }
})
