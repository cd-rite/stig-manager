const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const userEnv = require('../../usersEnv.json')
const testUsers = require('../../data/users/users.json')
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')

describe('User GETS tests using "admin" user ', () => {
  before(async function () {
    this.timeout(4000)
    await utils.loadAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  describe(`/user`, () => {

    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = testUsers.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
        describe(`Testing as ${user.name}`, () => {
            it('Return the requesters user information - check user', async () => {
                const res = await chai
                    .request(config.baseUrl)
                    .get(`/user`)
                    .set('Authorization', 'Bearer ' + user.token)

                expect(res).to.have.status(200)
            })
         })
     }
  })
  
  describe(`/users`, () => {
    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = testUsers.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
        describe(`Testing as ${user.name}`, () => {

    
            it('Return a list of Users accessible to the requester USERNAME', async () => {
                
                const res = await chai
                    .request(config.baseUrl)
                    .get(`/users?elevate=true&username=${userEnv.wfTest.username}&projection=collectionGrants&projection=statistics`)
                    .set('Authorization', 'Bearer ' + user.token)

                    if(user.name === "admin") {
                        expect(res).to.have.status(200)
                        return
                    }
                    expect(res).to.have.status(403)
            })
            it('Return a list of Users accessible to the requester USERNAME not elevated', async () => {
                const res = await chai
                    .request(config.baseUrl)
                    .get(`/users?elevate=false&username=${userEnv.wfTest.username}&projection=collectionGrants&projection=statistics`)
                    .set('Authorization', 'Bearer ' + user.token)
                expect(res).to.have.status(403)
            })

            it('Return a list of Users accessible to the requester USERNAME no projections with elevate', async () => {

                const res = await chai
                    .request(config.baseUrl)
                    .get(`/users?elevate=true&username=${userEnv.wfTest.username}`)
                    .set('Authorization', 'Bearer ' + user.token)

               
                    if(user.name === "admin") {
                        expect(res).to.have.status(200)
                        return
                    }
                    expect(res).to.have.status(403)
            })
            it('Return a list of Users accessible to the requester USERNAME no projections without elevate', async () => {

                const res = await chai
                    .request(config.baseUrl)
                    .get(`/users?&username=${userEnv.wfTest.username}`)
                    .set('Authorization', 'Bearer ' + user.token)

                    expect(res).to.have.status(200)
            })
            it('Return a list of Users accessible to the requester', async () => {

                const res = await chai
                    .request(config.baseUrl)
                    .get(`/users?elevate=true&projection=collectionGrants&projection=statistics`)
                    .set('Authorization', 'Bearer ' + user.token)
                    if(user.name === "admin") {
                        expect(res).to.have.status(200)
                        return
                    }
                    expect(res).to.have.status(403)
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
  }
  })

  describe(`/users{userId}}`, async () => {

    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = testUsers.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
        describe(`Testing as ${user.name}`, () => {
            it('Return a User', async () => {
                const res = await chai
                    .request(config.baseUrl)
                    .get(`/users/${userEnv.wfTest.userId}?elevate=true&projection=collectionGrants&projection=statistics`)
                    .set('Authorization', 'Bearer ' + user.token)

                    if(user.name === "admin") {
                    expect(res).to.have.status(200)
                    return
                    }
                    expect(res).to.have.status(403)
         })
         it('Return a User elevate is false', async () => {
            const res = await chai
                .request(config.baseUrl)
                .get(`/users/${userEnv.wfTest.userId}?elevate=false&projection=collectionGrants&projection=statistics`)
                .set('Authorization', 'Bearer ' + user.token)
                expect(res).to.have.status(403)
         })
         it('Return a User not elevated query param', async () => {
            const res = await chai
                .request(config.baseUrl)
                .get(`/users/${userEnv.wfTest.userId}?&projection=collectionGrants&projection=statistics`)
                .set('Authorization', 'Bearer ' + user.token)
                expect(res).to.have.status(403)
            })
        })
    }
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

    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = testUsers.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
        describe(`Testing as ${user.name}`, () => {
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
                    if(user.name === "admin") {
                        expect(res).to.have.status(201)
                        return
                    }
                    expect(res).to.have.status(403)
                    
                })
                it('Create a User no elevate, projections.', async () => {
                    const res = await chai
                        .request(config.baseUrl)
                        .post(`/users?&projection=collectionGrants&projection=statistics`)
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
                        expect(res).to.have.status(403) 
                    })
            })
         }
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

    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = testUsers.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
        describe(`Testing as ${user.name}`, () => {
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
                    
                    if(user.name === "admin") {
                        expect(res).to.have.status(200)
                        return
                    }
                    expect(res).to.have.status(403)
                })
                it('Merge provided properties with a User - Change Username no elevate no projections', async () => {
                    const res = await chai
                            .request(config.baseUrl)
                            .patch(`/users/${userEnv.scrapUser.userId}`)
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
                        expect(res).to.have.status(403)
                    })
                
                })
            }
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

    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = testUsers.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
        describe(`Testing as ${user.name}`, () => {
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
                if(user.name === "admin") {
                    expect(res).to.have.status(200)
                    return
                }
                expect(res).to.have.status(403)
            })
            it(`Set all properties of a User - Change Username`, async () => {
                const res = await chai
                .request(config.baseUrl)
                .put(`/users/${userEnv.scrapUser.userId}`)
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
                expect(res).to.have.status(403)
            })
        })
    }
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

    const usersNamesToTest = ["admin", "lvl1", "lvl2", "lvl3"]
    const users = testUsers.filter(user => usersNamesToTest.includes(user.name))

    for (let user of users) {
        describe(`Testing as ${user.name}`, () => {
            it('Delete a User - fail due to user access record', async () => {
                const res = await chai
                    .request(config.baseUrl)
                    .delete(`/users/${userEnv.scrapAdmin.userId}?elevate=true&projection=collectionGrants&projection=statistics`)
                    .set('Authorization', 'Bearer ' + user.token)

                    if(user.name === "admin") {
                        expect(res).to.have.status(422)
                        return
                    }
                    expect(res).to.have.status(403)
              })
            it('Delete a User - succeed, as user has never accessed th system', async () => {
                const res = await chai
                    .request(config.baseUrl)
                    .delete(`/users/${userEnv.deleteUser.userId}?elevate=true&projection=collectionGrants&projection=statistics`)
                    .set('Authorization', 'Bearer ' + user.token)

                    if(user.name === "admin") {
                        expect(res).to.have.status(200)
                        return
                    }
                    expect(res).to.have.status(403)
               })

            it('Delete a User - not elevated', async () => {
                const res = await chai
                    .request(config.baseUrl)
                    .delete(`/users/${userEnv.deleteUser.userId}?elevate=false&projection=collectionGrants&projection=statistics`)
                    .set('Authorization', 'Bearer ' + user.token)

                    expect(res).to.have.status(403)
                })
            })
        }
    })
})
