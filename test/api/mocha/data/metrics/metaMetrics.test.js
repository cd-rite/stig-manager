const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const config = require('../../testConfig.json')
const utils = require('../../utils/testUtils')
const environment = require('../../environment.json')

const user =
  {
    "name": "admin",
    "grant": "Owner",
    "token":
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ2ODEwMzUsImlhdCI6MTY3MDU0MDIzNiwiYXV0aF90aW1lIjoxNjcwNTQwMjM1LCJqdGkiOiI0N2Y5YWE3ZC1iYWM0LTQwOTgtOWJlOC1hY2U3NTUxM2FhN2YiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJiN2M3OGE2Mi1iODRmLTQ1NzgtYTk4My0yZWJjNjZmZDllZmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjMzNzhkYWZmLTA0MDQtNDNiMy1iNGFiLWVlMzFmZjczNDBhYyIsInNlc3Npb25fc3RhdGUiOiI4NzM2NWIzMy0yYzc2LTRiM2MtODQ4NS1mYmE1ZGJmZjRiOWYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImNyZWF0ZV9jb2xsZWN0aW9uIiwiZGVmYXVsdC1yb2xlcy1zdGlnbWFuIiwiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb24gc3RpZy1tYW5hZ2VyOnN0aWc6cmVhZCBzdGlnLW1hbmFnZXI6dXNlcjpyZWFkIHN0aWctbWFuYWdlcjpvcCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbjpyZWFkIHN0aWctbWFuYWdlcjpvcDpyZWFkIHN0aWctbWFuYWdlcjp1c2VyIHN0aWctbWFuYWdlciBzdGlnLW1hbmFnZXI6c3RpZyIsInNpZCI6Ijg3MzY1YjMzLTJjNzYtNGIzYy04NDg1LWZiYTVkYmZmNGI5ZiIsIm5hbWUiOiJTVElHTUFOIEFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3RpZ21hbmFkbWluIiwiZ2l2ZW5fbmFtZSI6IlNUSUdNQU4iLCJmYW1pbHlfbmFtZSI6IkFkbWluIn0.a1XwJZw_FIzwMXKo-Dr-n11me5ut-SF9ni7ylX-7t7AVrH1eAqyBxX9DXaxFK0xs6YOhoPsh9NyW8UFVaYgtF68Ps6yzoiqFEeiRXkpN5ygICN3H3z6r-YwanLlEeaYR3P2EtHRcrBtCnt0VEKKbGPWOfeiNCVe3etlp9-NQo44"
  }

const lvl1 =  {
    "name": "lvl1",
    "grant": "Restricted",
    "token":
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ3MDg5ODQsImlhdCI6MTY3MDU2ODE4NCwiYXV0aF90aW1lIjoxNjcwNTY4MTg0LCJqdGkiOiIxMDhmMDc2MC0wYmY5LTRkZjEtYjE0My05NjgzNmJmYmMzNjMiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJlM2FlMjdiOC1kYTIwLTRjNDItOWRmOC02MDg5ZjcwZjc2M2IiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjE0ZmE5ZDdkLTBmZTAtNDQyNi04ZmQ5LTY5ZDc0YTZmMzQ2NCIsInNlc3Npb25fc3RhdGUiOiJiNGEzYWNmMS05ZGM3LTQ1ZTEtOThmOC1kMzUzNjJhZWM0YzciLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtc3RpZ21hbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InJlYWxtLW1hbmFnZW1lbnQiOnsicm9sZXMiOlsidmlldy11c2VycyIsInF1ZXJ5LWdyb3VwcyIsInF1ZXJ5LXVzZXJzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbiBzdGlnLW1hbmFnZXI6c3RpZzpyZWFkIHN0aWctbWFuYWdlcjp1c2VyOnJlYWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb246cmVhZCIsInNpZCI6ImI0YTNhY2YxLTlkYzctNDVlMS05OGY4LWQzNTM2MmFlYzRjNyIsIm5hbWUiOiJyZXN0cmljdGVkIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibHZsMSIsImdpdmVuX25hbWUiOiJyZXN0cmljdGVkIn0.OqLARi5ILt3j2rMikXy0ECTTqjWco0-CrMwzE88gUv2i8rVO9kMgVsXbtPk2L2c9NNNujnxqg7QIr2_sqA51saTrZHvzXcsT8lBruf74OubRMwcTQqJap-COmrzb60S7512k0WfKTYlHsoCn_uAzOb9sp8Trjr0NksU8OXCElDU"
}

const lvl2 =  {
    "name": "lvl2",
    "token":"eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJGSjg2R2NGM2pUYk5MT2NvNE52WmtVQ0lVbWZZQ3FvcXRPUWVNZmJoTmxFIn0.eyJleHAiOjE4NjQ3MDkwNzQsImlhdCI6MTY3MDU2ODI3NSwiYXV0aF90aW1lIjoxNjcwNTY4Mjc0LCJqdGkiOiIwM2Y0OWVmYy1jYzcxLTQ3MTItOWFjNy0xNGY5YzZiNDc1ZGEiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvc3RpZ21hbiIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiJjMTM3ZDYzNy1mMDU2LTRjNzItOWJlZi1lYzJhZjdjMWFiYzciLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdGlnLW1hbmFnZXIiLCJub25jZSI6IjQ5MzY5ZTdmLWEyZGYtNDkxYS04YjQ0LWEwNDJjYWYyMzhlYyIsInNlc3Npb25fc3RhdGUiOiJjNmUyZTgyNi0xMzMzLTRmMDctOTc4OC03OTQxMGM5ZjJkMDYiLCJhY3IiOiIwIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtc3RpZ21hbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InJlYWxtLW1hbmFnZW1lbnQiOnsicm9sZXMiOlsidmlldy11c2VycyIsInF1ZXJ5LWdyb3VwcyIsInF1ZXJ5LXVzZXJzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBzdGlnLW1hbmFnZXI6Y29sbGVjdGlvbiBzdGlnLW1hbmFnZXI6c3RpZzpyZWFkIHN0aWctbWFuYWdlcjp1c2VyOnJlYWQgc3RpZy1tYW5hZ2VyOmNvbGxlY3Rpb246cmVhZCIsInNpZCI6ImM2ZTJlODI2LTEzMzMtNGYwNy05Nzg4LTc5NDEwYzlmMmQwNiIsIm5hbWUiOiJsdmwyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibHZsMiIsImdpdmVuX25hbWUiOiJsdmwyIn0.F1i8VVLNkVsaW9i83vbVyB9eFiSxX_9ZpR6K7Zs0r7pKOCMJnSOHeKIHrlMO4hW8DrbmSRrkrrXExwNtw6zUsuH8_1uxx-SVUkaQyHEMfbx1_TstkTOFcjxIWqtlVvwPIt-DlTpQ_IFuby8wDAIxUvNwogn2OoybzAy1CDMcpIA"
}

describe('Metrics get tests using "admin" user ', () => { 
  before(async function () {
    this.timeout(4000)
    await utils.loadMetaMetricsAppData()
    await utils.uploadTestStigs()
    await utils.createDisabledCollectionsandAssets()
  })

  describe('GET - getMetricsDetailByMeta - /collections/meta/metrics/detail', () => {

    it('meta metrics detail - no agg - no params', async () => {
        const expectedMetrics = {
            collections: 2,
            assets: 4,
            stigs: 2,
            checklists: 6,
            metrics: {
              maxTs: "2022-02-03T00:07:05Z",
              minTs: "2020-08-11T22:27:26Z",
              results: {
                fail: {
                  total: 5,
                  resultEngine: 0,
                },
                pass: {
                  total: 4,
                  resultEngine: 0,
                },
                error: {
                  total: 0,
                  resultEngine: 0,
                },
                fixed: {
                  total: 0,
                  resultEngine: 0,
                },
                unknown: {
                  total: 0,
                  resultEngine: 0,
                },
                notchecked: {
                  total: 0,
                  resultEngine: 0,
                },
                notselected: {
                  total: 0,
                  resultEngine: 0,
                },
                informational: {
                  total: 0,
                  resultEngine: 0,
                },
                notapplicable: {
                  total: 3,
                  resultEngine: 0,
                },
              },
              assessed: 12,
              findings: {
                low: 1,
                high: 0,
                medium: 4,
              },
              statuses: {
                saved: {
                  total: 3,
                  resultEngine: 0,
                },
                accepted: {
                  total: 0,
                  resultEngine: 0,
                },
                rejected: {
                  total: 0,
                  resultEngine: 0,
                },
                submitted: {
                  total: 9,
                  resultEngine: 0,
                },
              },
              maxTouchTs: "2022-02-03T00:07:07Z",
              assessments: 898,
              assessmentsBySeverity: {
                low: 64,
                high: 96,
                medium: 738,
              },
            },
          }
        const res = await chai.request(config.baseUrl)
            .get('/collections/meta/metrics/detail')
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
    it('meta metrics detail - no agg - coll param', async () => {
      const expectedMetrics = {
  collections: 1,
  assets: 2,
  stigs: 2,
  checklists: 4,
  metrics: {
    maxTs: '2022-02-03T00:07:05Z',
    minTs: '2020-08-11T22:27:26Z',
    results: {
      fail: {
        total: 5,
        resultEngine: 0
      },
      pass: {
        total: 4,
        resultEngine: 0
      },
      error: {
        total: 0,
        resultEngine: 0
      },
      fixed: {
        total: 0,
        resultEngine: 0
      },
      unknown: {
        total: 0,
        resultEngine: 0
      },
      notchecked: {
        total: 0,
        resultEngine: 0
      },
      notselected: {
        total: 0,
        resultEngine: 0
      },
      informational: {
        total: 0,
        resultEngine: 0
      },
      notapplicable: {
        total: 3,
        resultEngine: 0
      }
    },
    assessed: 12,
    findings: {
      low: 1,
      high: 0,
      medium: 4
    },
    statuses: {
      saved: {
        total: 3,
        resultEngine: 0
      },
      accepted: {
        total: 0,
        resultEngine: 0
      },
      rejected: {
        total: 0,
        resultEngine: 0
      },
      submitted: {
        total: 9,
        resultEngine: 0
      }
    },
    maxTouchTs: '2022-02-03T00:07:07Z',
    assessments: 736,
    assessmentsBySeverity: {
      low: 50,
      high: 74,
      medium: 612
    }
  }
    }
        const res = await chai.request(config.baseUrl)
            .get(`/collections/meta/metrics/detail?collectionId=${environment.testCollection.collectionId}`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
    it('meta metrics detail - no agg - bench param', async () => {

        const expectedMetrics = {
          collections: 2,
          assets: 4,
          stigs: 1,
          checklists: 4,
          metrics: {
            maxTs: "2022-02-03T00:07:05Z",
            minTs: "2020-08-11T22:27:26Z",
            results: {
              fail: {
                total: 4,
                resultEngine: 0,
              },
              pass: {
                total: 2,
                resultEngine: 0,
              },
              error: {
                total: 0,
                resultEngine: 0,
              },
              fixed: {
                total: 0,
                resultEngine: 0,
              },
              unknown: {
                total: 0,
                resultEngine: 0,
              },
              notchecked: {
                total: 0,
                resultEngine: 0,
              },
              notselected: {
                total: 0,
                resultEngine: 0,
              },
              informational: {
                total: 0,
                resultEngine: 0,
              },
              notapplicable: {
                total: 3,
                resultEngine: 0,
              },
            },
            assessed: 9,
            findings: {
              low: 1,
              high: 0,
              medium: 3,
            },
            statuses: {
              saved: {
                total: 2,
                resultEngine: 0,
              },
              accepted: {
                total: 0,
                resultEngine: 0,
              },
              rejected: {
                total: 0,
                resultEngine: 0,
              },
              submitted: {
                total: 7,
                resultEngine: 0,
              },
            },
            maxTouchTs: "2022-02-03T00:07:07Z",
            assessments: 324,
            assessmentsBySeverity: {
              low: 28,
              high: 44,
              medium: 252,
            },
          },
        }
          const res = await chai.request(config.baseUrl)
              .get(`/collections/meta/metrics/detail?benchmarkId=${environment.testCollection.benchmark}`)
              .set('Authorization', `Bearer ${user.token}`)
          expect(res).to.have.status(200)
          expect(res.body).to.deep.equal(expectedMetrics)
    })
  })

  describe('GET - getMetricsDetailByMetaAggCollection - /collections/meta/metrics/detail/collection', () => {

    it('meta metrics detail - agg by collection - no params', async () => { 
        const expectedMetrics = [
            {
                "collectionId": "21",
                "name": "Collection X",
                "assets": 3,
                "stigs": 2,
                "checklists": 4,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": {
                            "total": 5,
                            "resultEngine": 0
                        },
                        "pass": {
                            "total": 4,
                            "resultEngine": 0
                        },
                        "error": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "fixed": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "unknown": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notchecked": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notselected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "informational": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notapplicable": {
                            "total": 3,
                            "resultEngine": 0
                        }
                    },
                    "assessed": 12,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 4
                    },
                    "statuses": {
                        "saved": {
                            "total": 3,
                            "resultEngine": 0
                        },
                        "accepted": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "rejected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "submitted": {
                            "total": 9,
                            "resultEngine": 0
                        }
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 736,
                    "assessmentsBySeverity": {
                        "low": 50,
                        "high": 74,
                        "medium": 612
                    }
                }
            },
            {
                "collectionId": "83",
                "name": "Collection Y",
                "assets": 2,
                "stigs": 1,
                "checklists": 2,
                "metrics": {
                    "maxTs": null,
                    "minTs": null,
                    "results": {
                        "fail": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "pass": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "error": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "fixed": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "unknown": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notchecked": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notselected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "informational": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notapplicable": {
                            "total": 0,
                            "resultEngine": 0
                        }
                    },
                    "assessed": 0,
                    "findings": {
                        "low": 0,
                        "high": 0,
                        "medium": 0
                    },
                    "statuses": {
                        "saved": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "accepted": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "rejected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "submitted": {
                            "total": 0,
                            "resultEngine": 0
                        }
                    },
                    "maxTouchTs": null,
                    "assessments": 162,
                    "assessmentsBySeverity": {
                        "low": 14,
                        "high": 22,
                        "medium": 126
                    }
                }
            }
        ]
        const res = await chai.request(config.baseUrl)
            .get('/collections/meta/metrics/detail/collection')
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
    it('meta metrics detail - collection agg - coll param', async () => { 
        const expectedMetrics = [
            {
                "collectionId": "21",
                "name": "Collection X",
                "assets": 3,
                "stigs": 2,
                "checklists": 4,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": {
                            "total": 5,
                            "resultEngine": 0
                        },
                        "pass": {
                            "total": 4,
                            "resultEngine": 0
                        },
                        "error": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "fixed": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "unknown": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notchecked": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notselected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "informational": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notapplicable": {
                            "total": 3,
                            "resultEngine": 0
                        }
                    },
                    "assessed": 12,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 4
                    },
                    "statuses": {
                        "saved": {
                            "total": 3,
                            "resultEngine": 0
                        },
                        "accepted": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "rejected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "submitted": {
                            "total": 9,
                            "resultEngine": 0
                        }
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 736,
                    "assessmentsBySeverity": {
                        "low": 50,
                        "high": 74,
                        "medium": 612
                    }
                }
            }
        ]
        const res = await chai.request(config.baseUrl)
            .get(`/collections/meta/metrics/detail/collection?collectionId=${environment.testCollection.collectionId}`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
    it('meta metrics detail - collection agg - bench param', async () => { 
        const expectedMetrics = [
            {
                "collectionId": "21",
                "name": "Collection X",
                "assets": 2,
                "stigs": 1,
                "checklists": 2,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": {
                            "total": 4,
                            "resultEngine": 0
                        },
                        "pass": {
                            "total": 2,
                            "resultEngine": 0
                        },
                        "error": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "fixed": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "unknown": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notchecked": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notselected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "informational": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notapplicable": {
                            "total": 3,
                            "resultEngine": 0
                        }
                    },
                    "assessed": 9,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 3
                    },
                    "statuses": {
                        "saved": {
                            "total": 2,
                            "resultEngine": 0
                        },
                        "accepted": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "rejected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "submitted": {
                            "total": 7,
                            "resultEngine": 0
                        }
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 162,
                    "assessmentsBySeverity": {
                        "low": 14,
                        "high": 22,
                        "medium": 126
                    }
                }
            },
            {
                "collectionId": "83",
                "name": "Collection Y",
                "assets": 2,
                "stigs": 1,
                "checklists": 2,
                "metrics": {
                    "maxTs": null,
                    "minTs": null,
                    "results": {
                        "fail": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "pass": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "error": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "fixed": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "unknown": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notchecked": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notselected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "informational": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notapplicable": {
                            "total": 0,
                            "resultEngine": 0
                        }
                    },
                    "assessed": 0,
                    "findings": {
                        "low": 0,
                        "high": 0,
                        "medium": 0
                    },
                    "statuses": {
                        "saved": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "accepted": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "rejected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "submitted": {
                            "total": 0,
                            "resultEngine": 0
                        }
                    },
                    "maxTouchTs": null,
                    "assessments": 162,
                    "assessmentsBySeverity": {
                        "low": 14,
                        "high": 22,
                        "medium": 126
                    }
                }
            }
        ]
        const res = await chai.request(config.baseUrl)
            .get(`/collections/meta/metrics/detail/collection?benchmarkId=${environment.testCollection.benchmark}`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
    it('meta metrics detail - collection agg - rev param', async () => { 
        const expectedMetrics = 
        [
            {
                "collectionId": "21",
                "name": "Collection X",
                "assets": 2,
                "stigs": 1,
                "checklists": 2,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": {
                            "total": 4,
                            "resultEngine": 0
                        },
                        "pass": {
                            "total": 2,
                            "resultEngine": 0
                        },
                        "error": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "fixed": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "unknown": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notchecked": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notselected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "informational": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notapplicable": {
                            "total": 3,
                            "resultEngine": 0
                        }
                    },
                    "assessed": 9,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 3
                    },
                    "statuses": {
                        "saved": {
                            "total": 2,
                            "resultEngine": 0
                        },
                        "accepted": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "rejected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "submitted": {
                            "total": 7,
                            "resultEngine": 0
                        }
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 162,
                    "assessmentsBySeverity": {
                        "low": 14,
                        "high": 22,
                        "medium": 126
                    }
                }
            }
        ]
        const res = await chai.request(config.baseUrl)
            .get(`/collections/meta/metrics/detail/collection?revisionId=${'VPN_SRG_TEST-1-1'}`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
  })

  describe('GET - getMetricsDetailByMetaAggStig - /collections/meta/metrics/detail/stig', () => {

    it('meta metrics detail - stig agg - no params', async () => {
        const expectedMetrics = [
            {
                "benchmarkId": "VPN_SRG_TEST",
                "title": "Virtual Private Network (VPN) Security Requirements Guide",
                "revisionStr": "V1R0",
                "collections": 1,
                "assets": 2,
                "ruleCount": 81,
                "metrics": {
                    "maxTs": null,
                    "minTs": null,
                    "results": {
                        "fail": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "pass": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "error": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "fixed": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "unknown": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notchecked": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notselected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "informational": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notapplicable": {
                            "total": 0,
                            "resultEngine": 0
                        }
                    },
                    "assessed": 0,
                    "findings": {
                        "low": 0,
                        "high": 0,
                        "medium": 0
                    },
                    "statuses": {
                        "saved": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "accepted": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "rejected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "submitted": {
                            "total": 0,
                            "resultEngine": 0
                        }
                    },
                    "maxTouchTs": null,
                    "assessments": 162,
                    "assessmentsBySeverity": {
                        "low": 14,
                        "high": 22,
                        "medium": 126
                    }
                }
            },
            {
                "benchmarkId": "VPN_SRG_TEST",
                "title": "Virtual Private Network (VPN) Security Requirements Guide",
                "revisionStr": "V1R1",
                "collections": 1,
                "assets": 2,
                "ruleCount": 81,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": {
                            "total": 4,
                            "resultEngine": 0
                        },
                        "pass": {
                            "total": 2,
                            "resultEngine": 0
                        },
                        "error": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "fixed": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "unknown": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notchecked": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notselected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "informational": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notapplicable": {
                            "total": 3,
                            "resultEngine": 0
                        }
                    },
                    "assessed": 9,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 3
                    },
                    "statuses": {
                        "saved": {
                            "total": 2,
                            "resultEngine": 0
                        },
                        "accepted": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "rejected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "submitted": {
                            "total": 7,
                            "resultEngine": 0
                        }
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 162,
                    "assessmentsBySeverity": {
                        "low": 14,
                        "high": 22,
                        "medium": 126
                    }
                }
            },
            {
                "benchmarkId": "Windows_10_STIG_TEST",
                "title": "Windows 10 Security Technical Implementation Guide",
                "revisionStr": "V1R23",
                "collections": 1,
                "assets": 2,
                "ruleCount": 287,
                "metrics": {
                    "maxTs": "2020-08-18T20:48:29Z",
                    "minTs": "2020-08-11T22:29:16Z",
                    "results": {
                        "fail": {
                            "total": 1,
                            "resultEngine": 0
                        },
                        "pass": {
                            "total": 2,
                            "resultEngine": 0
                        },
                        "error": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "fixed": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "unknown": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notchecked": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notselected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "informational": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notapplicable": {
                            "total": 0,
                            "resultEngine": 0
                        }
                    },
                    "assessed": 3,
                    "findings": {
                        "low": 0,
                        "high": 0,
                        "medium": 1
                    },
                    "statuses": {
                        "saved": {
                            "total": 1,
                            "resultEngine": 0
                        },
                        "accepted": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "rejected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "submitted": {
                            "total": 2,
                            "resultEngine": 0
                        }
                    },
                    "maxTouchTs": "2020-08-18T20:48:29Z",
                    "assessments": 574,
                    "assessmentsBySeverity": {
                        "low": 36,
                        "high": 52,
                        "medium": 486
                    }
                }
            }
        ]
        const res = await chai.request(config.baseUrl)
            .get('/collections/meta/metrics/detail/stig')
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
    it('meta metrics detail - stig agg - coll param', async () => {
        const expectedMetrics = [
            {
                "benchmarkId": "VPN_SRG_TEST",
                "title": "Virtual Private Network (VPN) Security Requirements Guide",
                "revisionStr": "V1R1",
                "collections": 1,
                "assets": 2,
                "ruleCount": 81,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": {
                            "total": 4,
                            "resultEngine": 0
                        },
                        "pass": {
                            "total": 2,
                            "resultEngine": 0
                        },
                        "error": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "fixed": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "unknown": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notchecked": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notselected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "informational": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notapplicable": {
                            "total": 3,
                            "resultEngine": 0
                        }
                    },
                    "assessed": 9,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 3
                    },
                    "statuses": {
                        "saved": {
                            "total": 2,
                            "resultEngine": 0
                        },
                        "accepted": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "rejected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "submitted": {
                            "total": 7,
                            "resultEngine": 0
                        }
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 162,
                    "assessmentsBySeverity": {
                        "low": 14,
                        "high": 22,
                        "medium": 126
                    }
                }
            },
            {
                "benchmarkId": "Windows_10_STIG_TEST",
                "title": "Windows 10 Security Technical Implementation Guide",
                "revisionStr": "V1R23",
                "collections": 1,
                "assets": 2,
                "ruleCount": 287,
                "metrics": {
                    "maxTs": "2020-08-18T20:48:29Z",
                    "minTs": "2020-08-11T22:29:16Z",
                    "results": {
                        "fail": {
                            "total": 1,
                            "resultEngine": 0
                        },
                        "pass": {
                            "total": 2,
                            "resultEngine": 0
                        },
                        "error": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "fixed": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "unknown": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notchecked": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notselected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "informational": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notapplicable": {
                            "total": 0,
                            "resultEngine": 0
                        }
                    },
                    "assessed": 3,
                    "findings": {
                        "low": 0,
                        "high": 0,
                        "medium": 1
                    },
                    "statuses": {
                        "saved": {
                            "total": 1,
                            "resultEngine": 0
                        },
                        "accepted": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "rejected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "submitted": {
                            "total": 2,
                            "resultEngine": 0
                        }
                    },
                    "maxTouchTs": "2020-08-18T20:48:29Z",
                    "assessments": 574,
                    "assessmentsBySeverity": {
                        "low": 36,
                        "high": 52,
                        "medium": 486
                    }
                }
            }
        ]
        const res = await chai.request(config.baseUrl)
            .get(`/collections/meta/metrics/detail/stig?collectionId=${environment.testCollection.collectionId}`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
    it('meta metrics detail - stig agg - bench param', async () => {
        const expectedMetrics =[
            {
                "benchmarkId": "VPN_SRG_TEST",
                "title": "Virtual Private Network (VPN) Security Requirements Guide",
                "revisionStr": "V1R0",
                "collections": 1,
                "assets": 2,
                "ruleCount": 81,
                "metrics": {
                    "maxTs": null,
                    "minTs": null,
                    "results": {
                        "fail": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "pass": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "error": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "fixed": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "unknown": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notchecked": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notselected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "informational": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notapplicable": {
                            "total": 0,
                            "resultEngine": 0
                        }
                    },
                    "assessed": 0,
                    "findings": {
                        "low": 0,
                        "high": 0,
                        "medium": 0
                    },
                    "statuses": {
                        "saved": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "accepted": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "rejected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "submitted": {
                            "total": 0,
                            "resultEngine": 0
                        }
                    },
                    "maxTouchTs": null,
                    "assessments": 162,
                    "assessmentsBySeverity": {
                        "low": 14,
                        "high": 22,
                        "medium": 126
                    }
                }
            },
            {
                "benchmarkId": "VPN_SRG_TEST",
                "title": "Virtual Private Network (VPN) Security Requirements Guide",
                "revisionStr": "V1R1",
                "collections": 1,
                "assets": 2,
                "ruleCount": 81,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": {
                            "total": 4,
                            "resultEngine": 0
                        },
                        "pass": {
                            "total": 2,
                            "resultEngine": 0
                        },
                        "error": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "fixed": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "unknown": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notchecked": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notselected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "informational": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notapplicable": {
                            "total": 3,
                            "resultEngine": 0
                        }
                    },
                    "assessed": 9,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 3
                    },
                    "statuses": {
                        "saved": {
                            "total": 2,
                            "resultEngine": 0
                        },
                        "accepted": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "rejected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "submitted": {
                            "total": 7,
                            "resultEngine": 0
                        }
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 162,
                    "assessmentsBySeverity": {
                        "low": 14,
                        "high": 22,
                        "medium": 126
                    }
                }
            }
        ]
        const res = await chai.request(config.baseUrl)
            .get(`/collections/meta/metrics/detail/stig?benchmarkId=${environment.testCollection.benchmark}`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
  })

  describe('GET - getMetricsSummaryByMeta - /collections/meta/metrics/summary', () => {

    it('meta metrics summary- no agg - no params', async () => {
        const expectedMetrics = {
            "collections": 2,
            "assets": 4,
            "stigs": 2,
            "checklists": 6,
            "metrics": {
                "maxTs": "2022-02-03T00:07:05Z",
                "minTs": "2020-08-11T22:27:26Z",
                "results": {
                    "fail": 5,
                    "pass": 4,
                    "unassessed": 0,
                    "notapplicable": 3
                },
                "assessed": 12,
                "findings": {
                    "low": 1,
                    "high": 0,
                    "medium": 4
                },
                "statuses": {
                    "saved": 3,
                    "accepted": 0,
                    "rejected": 0,
                    "submitted": 9
                },
                "maxTouchTs": "2022-02-03T00:07:07Z",
                "assessments": 898
            }
        }
        const res = await chai.request(config.baseUrl)
            .get('/collections/meta/metrics/summary')
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
    it('meta metrics summary - no agg - collectionId param', async () => {
        const expectedMetrics = {
            "collections": 1,
            "assets": 2,
            "stigs": 2,
            "checklists": 4,
            "metrics": {
                "maxTs": "2022-02-03T00:07:05Z",
                "minTs": "2020-08-11T22:27:26Z",
                "results": {
                    "fail": 5,
                    "pass": 4,
                    "unassessed": 0,
                    "notapplicable": 3
                },
                "assessed": 12,
                "findings": {
                    "low": 1,
                    "high": 0,
                    "medium": 4
                },
                "statuses": {
                    "saved": 3,
                    "accepted": 0,
                    "rejected": 0,
                    "submitted": 9
                },
                "maxTouchTs": "2022-02-03T00:07:07Z",
                "assessments": 736
            }
        }
        const res = await chai.request(config.baseUrl)
            .get(`/collections/meta/metrics/summary?collectionId=${environment.testCollection.collectionId}`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
    it('meta metrics summary - no agg - benchmark param', async () => {
        const expectedMetrics = {
    "collections": 2,
    "assets": 4,
    "stigs": 1,
    "checklists": 4,
    "metrics": {
        "maxTs": "2022-02-03T00:07:05Z",
        "minTs": "2020-08-11T22:27:26Z",
        "results": {
            "fail": 4,
            "pass": 2,
            "unassessed": 0,
            "notapplicable": 3
        },
        "assessed": 9,
        "findings": {
            "low": 1,
            "high": 0,
            "medium": 3
        },
        "statuses": {
            "saved": 2,
            "accepted": 0,
            "rejected": 0,
            "submitted": 7
        },
        "maxTouchTs": "2022-02-03T00:07:07Z",
        "assessments": 324
    }
}
        const res = await chai.request(config.baseUrl)
            .get(`/collections/meta/metrics/summary?benchmarkId=${environment.testCollection.benchmark}`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
  })

  describe('GET - getMetricsSummaryByMetaAggCollection - /collections/meta/metrics/summary/collection', () => {
    
    it('Return meta metrics summary - collection agg - no params Copy', async () => {
            const expectedMetrics = [
                {
                    "collectionId": "21",
                    "name": "Collection X",
                    "assets": 3,
                    "stigs": 2,
                    "checklists": 4,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": 5,
                            "pass": 4,
                            "unassessed": 0,
                            "notapplicable": 3
                        },
                        "assessed": 12,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 4
                        },
                        "statuses": {
                            "saved": 3,
                            "accepted": 0,
                            "rejected": 0,
                            "submitted": 9
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 736
                    }
                },
                {
                    "collectionId": "83",
                    "name": "Collection Y",
                    "assets": 2,
                    "stigs": 1,
                    "checklists": 2,
                    "metrics": {
                        "maxTs": null,
                        "minTs": null,
                        "results": {
                            "fail": 0,
                            "pass": 0,
                            "unassessed": 0,
                            "notapplicable": 0
                        },
                        "assessed": 0,
                        "findings": {
                            "low": 0,
                            "high": 0,
                            "medium": 0
                        },
                        "statuses": {
                            "saved": 0,
                            "accepted": 0,
                            "rejected": 0,
                            "submitted": 0
                        },
                        "maxTouchTs": null,
                        "assessments": 162
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get('/collections/meta/metrics/summary/collection')
                .set('Authorization', `Bearer ${user.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
    })
    it('Return meta metrics summary - collection agg - collection param', async () => {
        const expectedMetrics = [
            {
                "collectionId": "21",
                "name": "Collection X",
                "assets": 3,
                "stigs": 2,
                "checklists": 4,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": 5,
                        "pass": 4,
                        "unassessed": 0,
                        "notapplicable": 3
                    },
                    "assessed": 12,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 4
                    },
                    "statuses": {
                        "saved": 3,
                        "accepted": 0,
                        "rejected": 0,
                        "submitted": 9
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 736
                }
            }
        ]
        const res = await chai.request(config.baseUrl)
            .get(`/collections/meta/metrics/summary/collection?collectionId=${environment.testCollection.collectionId}`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
    it('Return meta metrics summary - collection agg - benchmark param', async () => {
        const expectedMetrics = [
            {
                "collectionId": "21",
                "name": "Collection X",
                "assets": 2,
                "stigs": 1,
                "checklists": 2,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": 4,
                        "pass": 2,
                        "unassessed": 0,
                        "notapplicable": 3
                    },
                    "assessed": 9,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 3
                    },
                    "statuses": {
                        "saved": 2,
                        "accepted": 0,
                        "rejected": 0,
                        "submitted": 7
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 162
                }
            },
            {
                "collectionId": "83",
                "name": "Collection Y",
                "assets": 2,
                "stigs": 1,
                "checklists": 2,
                "metrics": {
                    "maxTs": null,
                    "minTs": null,
                    "results": {
                        "fail": 0,
                        "pass": 0,
                        "unassessed": 0,
                        "notapplicable": 0
                    },
                    "assessed": 0,
                    "findings": {
                        "low": 0,
                        "high": 0,
                        "medium": 0
                    },
                    "statuses": {
                        "saved": 0,
                        "accepted": 0,
                        "rejected": 0,
                        "submitted": 0
                    },
                    "maxTouchTs": null,
                    "assessments": 162
                }
            }
        ]
        const res = await chai.request(config.baseUrl)
            .get(`/collections/meta/metrics/summary/collection?benchmarkId=${environment.testCollection.benchmark}`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
    it('Return meta metrics summary - collection agg - rev param', async () => {
        const expectedMetrics = [
            {
                "collectionId": "83",
                "name": "Collection Y",
                "assets": 2,
                "stigs": 1,
                "checklists": 2,
                "metrics": {
                    "maxTs": null,
                    "minTs": null,
                    "results": {
                        "fail": 0,
                        "pass": 0,
                        "unassessed": 0,
                        "notapplicable": 0
                    },
                    "assessed": 0,
                    "findings": {
                        "low": 0,
                        "high": 0,
                        "medium": 0
                    },
                    "statuses": {
                        "saved": 0,
                        "accepted": 0,
                        "rejected": 0,
                        "submitted": 0
                    },
                    "maxTouchTs": null,
                    "assessments": 162
                }
            }
        ]
        const res = await chai.request(config.baseUrl)
            .get(`/collections/meta/metrics/summary/collection?revisionId=${'VPN_SRG_TEST'}-1-0`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
    it('Return meta metrics summary - collection agg - rev param Copy', async () => {
        const expectedMetrics = [
        {
            "collectionId": "21",
            "name": "Collection X",
            "assets": 2,
            "stigs": 1,
            "checklists": 2,
            "metrics": {
                "maxTs": "2022-02-03T00:07:05Z",
                "minTs": "2020-08-11T22:27:26Z",
                "results": {
                    "fail": 4,
                    "pass": 2,
                    "unassessed": 0,
                    "notapplicable": 3
                },
                "assessed": 9,
                "findings": {
                    "low": 1,
                    "high": 0,
                    "medium": 3
                },
                "statuses": {
                    "saved": 2,
                    "accepted": 0,
                    "rejected": 0,
                    "submitted": 7
                },
                "maxTouchTs": "2022-02-03T00:07:07Z",
                "assessments": 162
            }
        }
    ]
        const res = await chai.request(config.baseUrl)
            .get(`/collections/meta/metrics/summary/collection?revisionId=${'VPN_SRG_TEST'}-1-1`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
  })

  describe('GET - getMetricsSummaryByMetaAggStig - /collections/meta/metrics/summary/stig', () => {

    it('Return meta metrics summary - stig agg - no params', async () => {  
        const expectedMetrics = [
            {
                "benchmarkId": "VPN_SRG_TEST",
                "title": "Virtual Private Network (VPN) Security Requirements Guide",
                "revisionStr": "V1R0",
                "collections": 1,
                "assets": 2,
                "ruleCount": 81,
                "metrics": {
                    "maxTs": null,
                    "minTs": null,
                    "results": {
                        "fail": 0,
                        "pass": 0,
                        "unassessed": 0,
                        "notapplicable": 0
                    },
                    "assessed": 0,
                    "findings": {
                        "low": 0,
                        "high": 0,
                        "medium": 0
                    },
                    "statuses": {
                        "saved": 0,
                        "accepted": 0,
                        "rejected": 0,
                        "submitted": 0
                    },
                    "maxTouchTs": null,
                    "assessments": 162
                }
            },
            {
                "benchmarkId": "VPN_SRG_TEST",
                "title": "Virtual Private Network (VPN) Security Requirements Guide",
                "revisionStr": "V1R1",
                "collections": 1,
                "assets": 2,
                "ruleCount": 81,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": 4,
                        "pass": 2,
                        "unassessed": 0,
                        "notapplicable": 3
                    },
                    "assessed": 9,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 3
                    },
                    "statuses": {
                        "saved": 2,
                        "accepted": 0,
                        "rejected": 0,
                        "submitted": 7
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 162
                }
            },
            {
                "benchmarkId": "Windows_10_STIG_TEST",
                "title": "Windows 10 Security Technical Implementation Guide",
                "revisionStr": "V1R23",
                "collections": 1,
                "assets": 2,
                "ruleCount": 287,
                "metrics": {
                    "maxTs": "2020-08-18T20:48:29Z",
                    "minTs": "2020-08-11T22:29:16Z",
                    "results": {
                        "fail": 1,
                        "pass": 2,
                        "unassessed": 0,
                        "notapplicable": 0
                    },
                    "assessed": 3,
                    "findings": {
                        "low": 0,
                        "high": 0,
                        "medium": 1
                    },
                    "statuses": {
                        "saved": 1,
                        "accepted": 0,
                        "rejected": 0,
                        "submitted": 2
                    },
                    "maxTouchTs": "2020-08-18T20:48:29Z",
                    "assessments": 574
                }
            }
        ]
        const res = await chai.request(config.baseUrl)
            .get('/collections/meta/metrics/summary/stig')
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
    it('Return meta metrics summary - stig agg - collection param', async () => {  
        const expectedMetrics =[
        {
            "benchmarkId": "VPN_SRG_TEST",
            "title": "Virtual Private Network (VPN) Security Requirements Guide",
            "revisionStr": "V1R1",
            "collections": 1,
            "assets": 2,
            "ruleCount": 81,
            "metrics": {
                "maxTs": "2022-02-03T00:07:05Z",
                "minTs": "2020-08-11T22:27:26Z",
                "results": {
                    "fail": 4,
                    "pass": 2,
                    "unassessed": 0,
                    "notapplicable": 3
                },
                "assessed": 9,
                "findings": {
                    "low": 1,
                    "high": 0,
                    "medium": 3
                },
                "statuses": {
                    "saved": 2,
                    "accepted": 0,
                    "rejected": 0,
                    "submitted": 7
                },
                "maxTouchTs": "2022-02-03T00:07:07Z",
                "assessments": 162
            }
        },
        {
            "benchmarkId": "Windows_10_STIG_TEST",
            "title": "Windows 10 Security Technical Implementation Guide",
            "revisionStr": "V1R23",
            "collections": 1,
            "assets": 2,
            "ruleCount": 287,
            "metrics": {
                "maxTs": "2020-08-18T20:48:29Z",
                "minTs": "2020-08-11T22:29:16Z",
                "results": {
                    "fail": 1,
                    "pass": 2,
                    "unassessed": 0,
                    "notapplicable": 0
                },
                "assessed": 3,
                "findings": {
                    "low": 0,
                    "high": 0,
                    "medium": 1
                },
                "statuses": {
                    "saved": 1,
                    "accepted": 0,
                    "rejected": 0,
                    "submitted": 2
                },
                "maxTouchTs": "2020-08-18T20:48:29Z",
                "assessments": 574
            }
        }
    ]
        const res = await chai.request(config.baseUrl)
            .get(`/collections/meta/metrics/summary/stig?collectionId=${environment.testCollection.collectionId}`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
    it('Return meta metrics summary - stig agg - benchmark param', async () => {  
        const expectedMetrics = [
            {
                "benchmarkId": "VPN_SRG_TEST",
                "title": "Virtual Private Network (VPN) Security Requirements Guide",
                "revisionStr": "V1R0",
                "collections": 1,
                "assets": 2,
                "ruleCount": 81,
                "metrics": {
                    "maxTs": null,
                    "minTs": null,
                    "results": {
                        "fail": 0,
                        "pass": 0,
                        "unassessed": 0,
                        "notapplicable": 0
                    },
                    "assessed": 0,
                    "findings": {
                        "low": 0,
                        "high": 0,
                        "medium": 0
                    },
                    "statuses": {
                        "saved": 0,
                        "accepted": 0,
                        "rejected": 0,
                        "submitted": 0
                    },
                    "maxTouchTs": null,
                    "assessments": 162
                }
            },
            {
                "benchmarkId": "VPN_SRG_TEST",
                "title": "Virtual Private Network (VPN) Security Requirements Guide",
                "revisionStr": "V1R1",
                "collections": 1,
                "assets": 2,
                "ruleCount": 81,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": 4,
                        "pass": 2,
                        "unassessed": 0,
                        "notapplicable": 3
                    },
                    "assessed": 9,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 3
                    },
                    "statuses": {
                        "saved": 2,
                        "accepted": 0,
                        "rejected": 0,
                        "submitted": 7
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 162
                }
            }
        ]
        const res = await chai.request(config.baseUrl)
            .get(`/collections/meta/metrics/summary/stig?benchmarkId=${environment.testCollection.benchmark}`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
    it('Return meta metrics summary - stig agg - benchmark param', async () => {  
        const expectedMetrics = [
            {
                "benchmarkId": "VPN_SRG_TEST",
                "title": "Virtual Private Network (VPN) Security Requirements Guide",
                "revisionStr": "V1R1",
                "collections": 1,
                "assets": 2,
                "ruleCount": 81,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": 4,
                        "pass": 2,
                        "unassessed": 0,
                        "notapplicable": 3
                    },
                    "assessed": 9,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 3
                    },
                    "statuses": {
                        "saved": 2,
                        "accepted": 0,
                        "rejected": 0,
                        "submitted": 7
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 162
                }
            }
        ]
        const res = await chai.request(config.baseUrl)
            .get(`/collections/meta/metrics/summary/stig?benchmarkId=${environment.testCollection.benchmark}&collectionId=${environment.testCollection.collectionId}`)
            .set('Authorization', `Bearer ${user.token}`)
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal(expectedMetrics)
    })
  })
})

describe('Metrics get tests using "lvl2" user ', () => {
    before(async function () {
      this.timeout(4000)
      await utils.loadMetaMetricsAppData()
      await utils.uploadTestStigs()
      await utils.createDisabledCollectionsandAssets()
    })
  
    describe('GET - getMetricsDetailByMeta - /collections/meta/metrics/detail', () => {
  
      it('meta metrics detail - no agg - no params', async () => {
          const expectedMetrics = {
            "collections": 1,
            "assets": 2,
            "stigs": 2,
            "checklists": 4,
            "metrics": {
                "maxTs": "2022-02-03T00:07:05Z",
                "minTs": "2020-08-11T22:27:26Z",
                "results": {
                    "fail": {
                        "total": 5,
                        "resultEngine": 0
                    },
                    "pass": {
                        "total": 4,
                        "resultEngine": 0
                    },
                    "error": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "fixed": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "unknown": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "notchecked": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "notselected": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "informational": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "notapplicable": {
                        "total": 3,
                        "resultEngine": 0
                    }
                },
                "assessed": 12,
                "findings": {
                    "low": 1,
                    "high": 0,
                    "medium": 4
                },
                "statuses": {
                    "saved": {
                        "total": 3,
                        "resultEngine": 0
                    },
                    "accepted": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "rejected": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "submitted": {
                        "total": 9,
                        "resultEngine": 0
                    }
                },
                "maxTouchTs": "2022-02-03T00:07:07Z",
                "assessments": 736,
                "assessmentsBySeverity": {
                    "low": 50,
                    "high": 74,
                    "medium": 612
                }
            }
        }
          const res = await chai.request(config.baseUrl)
              .get('/collections/meta/metrics/detail')
              .set('Authorization', `Bearer ${lvl2.token}`)
          expect(res).to.have.status(200)
          expect(res.body).to.deep.equal(expectedMetrics)
      })
      it('meta metrics detail - no agg - coll param', async () => {
        const expectedMetrics = {
            "collections": 1,
            "assets": 2,
            "stigs": 2,
            "checklists": 4,
            "metrics": {
                "maxTs": "2022-02-03T00:07:05Z",
                "minTs": "2020-08-11T22:27:26Z",
                "results": {
                    "fail": {
                        "total": 5,
                        "resultEngine": 0
                    },
                    "pass": {
                        "total": 4,
                        "resultEngine": 0
                    },
                    "error": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "fixed": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "unknown": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "notchecked": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "notselected": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "informational": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "notapplicable": {
                        "total": 3,
                        "resultEngine": 0
                    }
                },
                "assessed": 12,
                "findings": {
                    "low": 1,
                    "high": 0,
                    "medium": 4
                },
                "statuses": {
                    "saved": {
                        "total": 3,
                        "resultEngine": 0
                    },
                    "accepted": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "rejected": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "submitted": {
                        "total": 9,
                        "resultEngine": 0
                    }
                },
                "maxTouchTs": "2022-02-03T00:07:07Z",
                "assessments": 736,
                "assessmentsBySeverity": {
                    "low": 50,
                    "high": 74,
                    "medium": 612
                }
            }
        }
          const res = await chai.request(config.baseUrl)
              .get(`/collections/meta/metrics/detail?collectionId=${environment.testCollection.collectionId}`)
              .set('Authorization', `Bearer ${lvl2.token}`)
          expect(res).to.have.status(200)
          expect(res.body).to.deep.equal(expectedMetrics)
      })
      it('meta metrics detail - no agg - bench param', async () => {
  
        const expectedMetrics = {
            "collections": 1,
            "assets": 2,
            "stigs": 1,
            "checklists": 2,
            "metrics": {
                "maxTs": "2022-02-03T00:07:05Z",
                "minTs": "2020-08-11T22:27:26Z",
                "results": {
                    "fail": {
                        "total": 4,
                        "resultEngine": 0
                    },
                    "pass": {
                        "total": 2,
                        "resultEngine": 0
                    },
                    "error": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "fixed": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "unknown": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "notchecked": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "notselected": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "informational": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "notapplicable": {
                        "total": 3,
                        "resultEngine": 0
                    }
                },
                "assessed": 9,
                "findings": {
                    "low": 1,
                    "high": 0,
                    "medium": 3
                },
                "statuses": {
                    "saved": {
                        "total": 2,
                        "resultEngine": 0
                    },
                    "accepted": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "rejected": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "submitted": {
                        "total": 7,
                        "resultEngine": 0
                    }
                },
                "maxTouchTs": "2022-02-03T00:07:07Z",
                "assessments": 162,
                "assessmentsBySeverity": {
                    "low": 14,
                    "high": 22,
                    "medium": 126
                }
            }
        }
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/detail?benchmarkId=${environment.testCollection.benchmark}`)
                .set('Authorization', `Bearer ${lvl2.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
      })
    })
    describe('GET - getMetricsDetailByMetaAggCollection - /collections/meta/metrics/detail/collection', () => {

        it('meta metrics detail - agg by collection - no params', async () => { 
            const expectedMetrics = [
                {
                    "collectionId": "21",
                    "name": "Collection X",
                    "assets": 3,
                    "stigs": 2,
                    "checklists": 4,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": {
                                "total": 5,
                                "resultEngine": 0
                            },
                            "pass": {
                                "total": 4,
                                "resultEngine": 0
                            },
                            "error": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "fixed": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "unknown": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notchecked": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notselected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "informational": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notapplicable": {
                                "total": 3,
                                "resultEngine": 0
                            }
                        },
                        "assessed": 12,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 4
                        },
                        "statuses": {
                            "saved": {
                                "total": 3,
                                "resultEngine": 0
                            },
                            "accepted": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "rejected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "submitted": {
                                "total": 9,
                                "resultEngine": 0
                            }
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 736,
                        "assessmentsBySeverity": {
                            "low": 50,
                            "high": 74,
                            "medium": 612
                        }
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get('/collections/meta/metrics/detail/collection')
                .set('Authorization', `Bearer ${lvl2.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('meta metrics detail - collection agg - coll param', async () => { 
            const expectedMetrics = [
                {
                    "collectionId": "21",
                    "name": "Collection X",
                    "assets": 3,
                    "stigs": 2,
                    "checklists": 4,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": {
                                "total": 5,
                                "resultEngine": 0
                            },
                            "pass": {
                                "total": 4,
                                "resultEngine": 0
                            },
                            "error": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "fixed": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "unknown": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notchecked": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notselected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "informational": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notapplicable": {
                                "total": 3,
                                "resultEngine": 0
                            }
                        },
                        "assessed": 12,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 4
                        },
                        "statuses": {
                            "saved": {
                                "total": 3,
                                "resultEngine": 0
                            },
                            "accepted": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "rejected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "submitted": {
                                "total": 9,
                                "resultEngine": 0
                            }
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 736,
                        "assessmentsBySeverity": {
                            "low": 50,
                            "high": 74,
                            "medium": 612
                        }
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/detail/collection?collectionId=${environment.testCollection.collectionId}`)
                .set('Authorization', `Bearer ${lvl2.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('meta metrics detail - collection agg - bench param', async () => { 
            const expectedMetrics = [
                {
                    "collectionId": "21",
                    "name": "Collection X",
                    "assets": 2,
                    "stigs": 1,
                    "checklists": 2,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": {
                                "total": 4,
                                "resultEngine": 0
                            },
                            "pass": {
                                "total": 2,
                                "resultEngine": 0
                            },
                            "error": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "fixed": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "unknown": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notchecked": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notselected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "informational": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notapplicable": {
                                "total": 3,
                                "resultEngine": 0
                            }
                        },
                        "assessed": 9,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 3
                        },
                        "statuses": {
                            "saved": {
                                "total": 2,
                                "resultEngine": 0
                            },
                            "accepted": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "rejected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "submitted": {
                                "total": 7,
                                "resultEngine": 0
                            }
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 162,
                        "assessmentsBySeverity": {
                            "low": 14,
                            "high": 22,
                            "medium": 126
                        }
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/detail/collection?benchmarkId=${environment.testCollection.benchmark}`)
                .set('Authorization', `Bearer ${lvl2.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('meta metrics detail - collection agg - rev param', async () => { 
            const expectedMetrics = 
            [
                {
                    "collectionId": "21",
                    "name": "Collection X",
                    "assets": 2,
                    "stigs": 1,
                    "checklists": 2,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": {
                                "total": 4,
                                "resultEngine": 0
                            },
                            "pass": {
                                "total": 2,
                                "resultEngine": 0
                            },
                            "error": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "fixed": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "unknown": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notchecked": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notselected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "informational": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notapplicable": {
                                "total": 3,
                                "resultEngine": 0
                            }
                        },
                        "assessed": 9,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 3
                        },
                        "statuses": {
                            "saved": {
                                "total": 2,
                                "resultEngine": 0
                            },
                            "accepted": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "rejected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "submitted": {
                                "total": 7,
                                "resultEngine": 0
                            }
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 162,
                        "assessmentsBySeverity": {
                            "low": 14,
                            "high": 22,
                            "medium": 126
                        }
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/detail/collection?revisionId=${'VPN_SRG_TEST-1-1'}`)
                .set('Authorization', `Bearer ${lvl2.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
    })
    describe('GET - getMetricsDetailByMetaAggStig - /collections/meta/metrics/detail/stig', () => {

        it('meta metrics detail - stig agg - no params', async () => {
            const expectedMetrics = [
                {
                    "benchmarkId": "VPN_SRG_TEST",
                    "title": "Virtual Private Network (VPN) Security Requirements Guide",
                    "revisionStr": "V1R1",
                    "collections": 1,
                    "assets": 2,
                    "ruleCount": 81,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": {
                                "total": 4,
                                "resultEngine": 0
                            },
                            "pass": {
                                "total": 2,
                                "resultEngine": 0
                            },
                            "error": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "fixed": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "unknown": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notchecked": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notselected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "informational": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notapplicable": {
                                "total": 3,
                                "resultEngine": 0
                            }
                        },
                        "assessed": 9,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 3
                        },
                        "statuses": {
                            "saved": {
                                "total": 2,
                                "resultEngine": 0
                            },
                            "accepted": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "rejected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "submitted": {
                                "total": 7,
                                "resultEngine": 0
                            }
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 162,
                        "assessmentsBySeverity": {
                            "low": 14,
                            "high": 22,
                            "medium": 126
                        }
                    }
                },
                {
                    "benchmarkId": "Windows_10_STIG_TEST",
                    "title": "Windows 10 Security Technical Implementation Guide",
                    "revisionStr": "V1R23",
                    "collections": 1,
                    "assets": 2,
                    "ruleCount": 287,
                    "metrics": {
                        "maxTs": "2020-08-18T20:48:29Z",
                        "minTs": "2020-08-11T22:29:16Z",
                        "results": {
                            "fail": {
                                "total": 1,
                                "resultEngine": 0
                            },
                            "pass": {
                                "total": 2,
                                "resultEngine": 0
                            },
                            "error": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "fixed": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "unknown": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notchecked": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notselected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "informational": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notapplicable": {
                                "total": 0,
                                "resultEngine": 0
                            }
                        },
                        "assessed": 3,
                        "findings": {
                            "low": 0,
                            "high": 0,
                            "medium": 1
                        },
                        "statuses": {
                            "saved": {
                                "total": 1,
                                "resultEngine": 0
                            },
                            "accepted": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "rejected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "submitted": {
                                "total": 2,
                                "resultEngine": 0
                            }
                        },
                        "maxTouchTs": "2020-08-18T20:48:29Z",
                        "assessments": 574,
                        "assessmentsBySeverity": {
                            "low": 36,
                            "high": 52,
                            "medium": 486
                        }
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get('/collections/meta/metrics/detail/stig')
                .set('Authorization', `Bearer ${lvl2.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('meta metrics detail - stig agg - coll param', async () => {
            const expectedMetrics = [
                {
                    "benchmarkId": "VPN_SRG_TEST",
                    "title": "Virtual Private Network (VPN) Security Requirements Guide",
                    "revisionStr": "V1R1",
                    "collections": 1,
                    "assets": 2,
                    "ruleCount": 81,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": {
                                "total": 4,
                                "resultEngine": 0
                            },
                            "pass": {
                                "total": 2,
                                "resultEngine": 0
                            },
                            "error": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "fixed": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "unknown": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notchecked": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notselected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "informational": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notapplicable": {
                                "total": 3,
                                "resultEngine": 0
                            }
                        },
                        "assessed": 9,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 3
                        },
                        "statuses": {
                            "saved": {
                                "total": 2,
                                "resultEngine": 0
                            },
                            "accepted": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "rejected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "submitted": {
                                "total": 7,
                                "resultEngine": 0
                            }
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 162,
                        "assessmentsBySeverity": {
                            "low": 14,
                            "high": 22,
                            "medium": 126
                        }
                    }
                },
                {
                    "benchmarkId": "Windows_10_STIG_TEST",
                    "title": "Windows 10 Security Technical Implementation Guide",
                    "revisionStr": "V1R23",
                    "collections": 1,
                    "assets": 2,
                    "ruleCount": 287,
                    "metrics": {
                        "maxTs": "2020-08-18T20:48:29Z",
                        "minTs": "2020-08-11T22:29:16Z",
                        "results": {
                            "fail": {
                                "total": 1,
                                "resultEngine": 0
                            },
                            "pass": {
                                "total": 2,
                                "resultEngine": 0
                            },
                            "error": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "fixed": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "unknown": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notchecked": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notselected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "informational": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notapplicable": {
                                "total": 0,
                                "resultEngine": 0
                            }
                        },
                        "assessed": 3,
                        "findings": {
                            "low": 0,
                            "high": 0,
                            "medium": 1
                        },
                        "statuses": {
                            "saved": {
                                "total": 1,
                                "resultEngine": 0
                            },
                            "accepted": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "rejected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "submitted": {
                                "total": 2,
                                "resultEngine": 0
                            }
                        },
                        "maxTouchTs": "2020-08-18T20:48:29Z",
                        "assessments": 574,
                        "assessmentsBySeverity": {
                            "low": 36,
                            "high": 52,
                            "medium": 486
                        }
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/detail/stig?collectionId=${environment.testCollection.collectionId}`)
                .set('Authorization', `Bearer ${lvl2.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('meta metrics detail - stig agg - bench param', async () => {
            const expectedMetrics = [
                {
                    "benchmarkId": "VPN_SRG_TEST",
                    "title": "Virtual Private Network (VPN) Security Requirements Guide",
                    "revisionStr": "V1R1",
                    "collections": 1,
                    "assets": 2,
                    "ruleCount": 81,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": {
                                "total": 4,
                                "resultEngine": 0
                            },
                            "pass": {
                                "total": 2,
                                "resultEngine": 0
                            },
                            "error": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "fixed": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "unknown": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notchecked": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notselected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "informational": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notapplicable": {
                                "total": 3,
                                "resultEngine": 0
                            }
                        },
                        "assessed": 9,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 3
                        },
                        "statuses": {
                            "saved": {
                                "total": 2,
                                "resultEngine": 0
                            },
                            "accepted": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "rejected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "submitted": {
                                "total": 7,
                                "resultEngine": 0
                            }
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 162,
                        "assessmentsBySeverity": {
                            "low": 14,
                            "high": 22,
                            "medium": 126
                        }
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/detail/stig?benchmarkId=${environment.testCollection.benchmark}`)
                .set('Authorization', `Bearer ${lvl2.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
    })
    describe('GET - getMetricsSummaryByMeta - /collections/meta/metrics/summary', () => {

        it('meta metrics summary- no agg - no params', async () => {
            const expectedMetrics = {
            "collections": 1,
            "assets": 2,
            "stigs": 2,
            "checklists": 4,
            "metrics": {
                "maxTs": "2022-02-03T00:07:05Z",
                "minTs": "2020-08-11T22:27:26Z",
                "results": {
                    "fail": 5,
                    "pass": 4,
                    "unassessed": 0,
                    "notapplicable": 3
                },
                "assessed": 12,
                "findings": {
                    "low": 1,
                    "high": 0,
                    "medium": 4
                },
                "statuses": {
                    "saved": 3,
                    "accepted": 0,
                    "rejected": 0,
                    "submitted": 9
                },
                "maxTouchTs": "2022-02-03T00:07:07Z",
                "assessments": 736
            }
        }
            const res = await chai.request(config.baseUrl)
                .get('/collections/meta/metrics/summary')
                .set('Authorization', `Bearer ${lvl2.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('meta metrics summary - no agg - collectionId param', async () => {
            const expectedMetrics = {
                "collections": 1,
                "assets": 2,
                "stigs": 2,
                "checklists": 4,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": 5,
                        "pass": 4,
                        "unassessed": 0,
                        "notapplicable": 3
                    },
                    "assessed": 12,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 4
                    },
                    "statuses": {
                        "saved": 3,
                        "accepted": 0,
                        "rejected": 0,
                        "submitted": 9
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 736
                }
            }
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/summary?collectionId=${environment.testCollection.collectionId}`)
                .set('Authorization', `Bearer ${lvl2.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('meta metrics summary - no agg - benchmark param', async () => {
            const expectedMetrics = {
                "collections": 1,
                "assets": 2,
                "stigs": 1,
                "checklists": 2,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": 4,
                        "pass": 2,
                        "unassessed": 0,
                        "notapplicable": 3
                    },
                    "assessed": 9,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 3
                    },
                    "statuses": {
                        "saved": 2,
                        "accepted": 0,
                        "rejected": 0,
                        "submitted": 7
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 162
                }
            }
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/summary?benchmarkId=${environment.testCollection.benchmark}`)
                .set('Authorization', `Bearer ${lvl2.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
    })
    describe('GET - getMetricsSummaryByMetaAggCollection - /collections/meta/metrics/summary/collection', () => {
    
        it('Return meta metrics summary - collection agg - no params Copy', async () => {
                const expectedMetrics = [
                    {
                        "collectionId": "21",
                        "name": "Collection X",
                        "assets": 3,
                        "stigs": 2,
                        "checklists": 4,
                        "metrics": {
                            "maxTs": "2022-02-03T00:07:05Z",
                            "minTs": "2020-08-11T22:27:26Z",
                            "results": {
                                "fail": 5,
                                "pass": 4,
                                "unassessed": 0,
                                "notapplicable": 3
                            },
                            "assessed": 12,
                            "findings": {
                                "low": 1,
                                "high": 0,
                                "medium": 4
                            },
                            "statuses": {
                                "saved": 3,
                                "accepted": 0,
                                "rejected": 0,
                                "submitted": 9
                            },
                            "maxTouchTs": "2022-02-03T00:07:07Z",
                            "assessments": 736
                        }
                    }
                ]
                const res = await chai.request(config.baseUrl)
                    .get('/collections/meta/metrics/summary/collection')
                    .set('Authorization', `Bearer ${lvl2.token}`)
                expect(res).to.have.status(200)
                expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('Return meta metrics summary - collection agg - collection param', async () => {
            const expectedMetrics = [
                {
                    "collectionId": "21",
                    "name": "Collection X",
                    "assets": 3,
                    "stigs": 2,
                    "checklists": 4,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": 5,
                            "pass": 4,
                            "unassessed": 0,
                            "notapplicable": 3
                        },
                        "assessed": 12,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 4
                        },
                        "statuses": {
                            "saved": 3,
                            "accepted": 0,
                            "rejected": 0,
                            "submitted": 9
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 736
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/summary/collection?collectionId=${environment.testCollection.collectionId}`)
                .set('Authorization', `Bearer ${lvl2.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('Return meta metrics summary - collection agg - benchmark param', async () => {
            const expectedMetrics = [
                {
                    "collectionId": "21",
                    "name": "Collection X",
                    "assets": 2,
                    "stigs": 1,
                    "checklists": 2,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": 4,
                            "pass": 2,
                            "unassessed": 0,
                            "notapplicable": 3
                        },
                        "assessed": 9,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 3
                        },
                        "statuses": {
                            "saved": 2,
                            "accepted": 0,
                            "rejected": 0,
                            "submitted": 7
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 162
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/summary/collection?benchmarkId=${environment.testCollection.benchmark}`)
                .set('Authorization', `Bearer ${lvl2.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('Return meta metrics summary - collection agg - rev param', async () => {
            const expectedMetrics = []
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/summary/collection?revisionId=${'VPN_SRG_TEST'}-1-0`)
                .set('Authorization', `Bearer ${lvl2.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('Return meta metrics summary - collection agg - rev param Copy', async () => {
            const expectedMetrics = [
            {
                "collectionId": "21",
                "name": "Collection X",
                "assets": 2,
                "stigs": 1,
                "checklists": 2,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": 4,
                        "pass": 2,
                        "unassessed": 0,
                        "notapplicable": 3
                    },
                    "assessed": 9,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 3
                    },
                    "statuses": {
                        "saved": 2,
                        "accepted": 0,
                        "rejected": 0,
                        "submitted": 7
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 162
                }
            }
        ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/summary/collection?revisionId=${'VPN_SRG_TEST'}-1-1`)
                .set('Authorization', `Bearer ${lvl2.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
    })
    describe('GET - getMetricsSummaryByMetaAggStig - /collections/meta/metrics/summary/stig', () => {

        it('Return meta metrics summary - stig agg - no params', async () => {  
            const expectedMetrics = [
                {
                    "benchmarkId": "VPN_SRG_TEST",
                    "title": "Virtual Private Network (VPN) Security Requirements Guide",
                    "revisionStr": "V1R1",
                    "collections": 1,
                    "assets": 2,
                    "ruleCount": 81,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": 4,
                            "pass": 2,
                            "unassessed": 0,
                            "notapplicable": 3
                        },
                        "assessed": 9,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 3
                        },
                        "statuses": {
                            "saved": 2,
                            "accepted": 0,
                            "rejected": 0,
                            "submitted": 7
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 162
                    }
                },
                {
                    "benchmarkId": "Windows_10_STIG_TEST",
                    "title": "Windows 10 Security Technical Implementation Guide",
                    "revisionStr": "V1R23",
                    "collections": 1,
                    "assets": 2,
                    "ruleCount": 287,
                    "metrics": {
                        "maxTs": "2020-08-18T20:48:29Z",
                        "minTs": "2020-08-11T22:29:16Z",
                        "results": {
                            "fail": 1,
                            "pass": 2,
                            "unassessed": 0,
                            "notapplicable": 0
                        },
                        "assessed": 3,
                        "findings": {
                            "low": 0,
                            "high": 0,
                            "medium": 1
                        },
                        "statuses": {
                            "saved": 1,
                            "accepted": 0,
                            "rejected": 0,
                            "submitted": 2
                        },
                        "maxTouchTs": "2020-08-18T20:48:29Z",
                        "assessments": 574
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get('/collections/meta/metrics/summary/stig')
                .set('Authorization', `Bearer ${lvl2.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('Return meta metrics summary - stig agg - collection param', async () => {  
            const expectedMetrics =[
                {
                    "benchmarkId": "VPN_SRG_TEST",
                    "title": "Virtual Private Network (VPN) Security Requirements Guide",
                    "revisionStr": "V1R1",
                    "collections": 1,
                    "assets": 2,
                    "ruleCount": 81,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": 4,
                            "pass": 2,
                            "unassessed": 0,
                            "notapplicable": 3
                        },
                        "assessed": 9,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 3
                        },
                        "statuses": {
                            "saved": 2,
                            "accepted": 0,
                            "rejected": 0,
                            "submitted": 7
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 162
                    }
                },
                {
                    "benchmarkId": "Windows_10_STIG_TEST",
                    "title": "Windows 10 Security Technical Implementation Guide",
                    "revisionStr": "V1R23",
                    "collections": 1,
                    "assets": 2,
                    "ruleCount": 287,
                    "metrics": {
                        "maxTs": "2020-08-18T20:48:29Z",
                        "minTs": "2020-08-11T22:29:16Z",
                        "results": {
                            "fail": 1,
                            "pass": 2,
                            "unassessed": 0,
                            "notapplicable": 0
                        },
                        "assessed": 3,
                        "findings": {
                            "low": 0,
                            "high": 0,
                            "medium": 1
                        },
                        "statuses": {
                            "saved": 1,
                            "accepted": 0,
                            "rejected": 0,
                            "submitted": 2
                        },
                        "maxTouchTs": "2020-08-18T20:48:29Z",
                        "assessments": 574
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/summary/stig?collectionId=${environment.testCollection.collectionId}`)
                .set('Authorization', `Bearer ${lvl2.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('Return meta metrics summary - stig agg - benchmark param', async () => {  
            const expectedMetrics = [
                {
                    "benchmarkId": "VPN_SRG_TEST",
                    "title": "Virtual Private Network (VPN) Security Requirements Guide",
                    "revisionStr": "V1R1",
                    "collections": 1,
                    "assets": 2,
                    "ruleCount": 81,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": 4,
                            "pass": 2,
                            "unassessed": 0,
                            "notapplicable": 3
                        },
                        "assessed": 9,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 3
                        },
                        "statuses": {
                            "saved": 2,
                            "accepted": 0,
                            "rejected": 0,
                            "submitted": 7
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 162
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/summary/stig?benchmarkId=${environment.testCollection.benchmark}`)
                .set('Authorization', `Bearer ${lvl2.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('Return meta metrics summary - stig agg - benchmark param', async () => {  
            const expectedMetrics = [
                {
                    "benchmarkId": "VPN_SRG_TEST",
                    "title": "Virtual Private Network (VPN) Security Requirements Guide",
                    "revisionStr": "V1R1",
                    "collections": 1,
                    "assets": 2,
                    "ruleCount": 81,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": 4,
                            "pass": 2,
                            "unassessed": 0,
                            "notapplicable": 3
                        },
                        "assessed": 9,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 3
                        },
                        "statuses": {
                            "saved": 2,
                            "accepted": 0,
                            "rejected": 0,
                            "submitted": 7
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 162
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/summary/stig?benchmarkId=${environment.testCollection.benchmark}&collectionId=${environment.testCollection.collectionId}`)
                .set('Authorization', `Bearer ${lvl2.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
    })
})

describe('Metrics get tests using "lvl1" user ', () => {
    before(async function () {
        this.timeout(4000)
        await utils.loadMetaMetricsAppData()
        await utils.uploadTestStigs()
        await utils.createDisabledCollectionsandAssets()
    })
    
    describe('GET - getMetricsDetailByMeta - /collections/meta/metrics/detail', () => {
    
        it('meta metrics detail - no agg - no params', async () => {
            const expectedMetrics =  {
                "collections": 1,
                "assets": 1,
                "stigs": 1,
                "checklists": 1,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": {
                            "total": 3,
                            "resultEngine": 0
                        },
                        "pass": {
                            "total": 2,
                            "resultEngine": 0
                        },
                        "error": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "fixed": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "unknown": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notchecked": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notselected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "informational": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notapplicable": {
                            "total": 1,
                            "resultEngine": 0
                        }
                    },
                    "assessed": 6,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 2
                    },
                    "statuses": {
                        "saved": {
                            "total": 1,
                            "resultEngine": 0
                        },
                        "accepted": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "rejected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "submitted": {
                            "total": 5,
                            "resultEngine": 0
                        }
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 81,
                    "assessmentsBySeverity": {
                        "low": 7,
                        "high": 11,
                        "medium": 63
                    }
                }
            }
            const res = await chai.request(config.baseUrl)
                .get('/collections/meta/metrics/detail')
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('meta metrics detail - no agg - coll param', async () => {
          const expectedMetrics =  {
            "collections": 1,
            "assets": 1,
            "stigs": 1,
            "checklists": 1,
            "metrics": {
                "maxTs": "2022-02-03T00:07:05Z",
                "minTs": "2020-08-11T22:27:26Z",
                "results": {
                    "fail": {
                        "total": 3,
                        "resultEngine": 0
                    },
                    "pass": {
                        "total": 2,
                        "resultEngine": 0
                    },
                    "error": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "fixed": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "unknown": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "notchecked": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "notselected": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "informational": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "notapplicable": {
                        "total": 1,
                        "resultEngine": 0
                    }
                },
                "assessed": 6,
                "findings": {
                    "low": 1,
                    "high": 0,
                    "medium": 2
                },
                "statuses": {
                    "saved": {
                        "total": 1,
                        "resultEngine": 0
                    },
                    "accepted": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "rejected": {
                        "total": 0,
                        "resultEngine": 0
                    },
                    "submitted": {
                        "total": 5,
                        "resultEngine": 0
                    }
                },
                "maxTouchTs": "2022-02-03T00:07:07Z",
                "assessments": 81,
                "assessmentsBySeverity": {
                    "low": 7,
                    "high": 11,
                    "medium": 63
                }
            }
        }
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/detail?collectionId=${environment.testCollection.collectionId}`)
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('meta metrics detail - no agg - bench param', async () => {
    
            const expectedMetrics =  {
                "collections": 1,
                "assets": 1,
                "stigs": 1,
                "checklists": 1,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": {
                            "total": 3,
                            "resultEngine": 0
                        },
                        "pass": {
                            "total": 2,
                            "resultEngine": 0
                        },
                        "error": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "fixed": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "unknown": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notchecked": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notselected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "informational": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "notapplicable": {
                            "total": 1,
                            "resultEngine": 0
                        }
                    },
                    "assessed": 6,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 2
                    },
                    "statuses": {
                        "saved": {
                            "total": 1,
                            "resultEngine": 0
                        },
                        "accepted": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "rejected": {
                            "total": 0,
                            "resultEngine": 0
                        },
                        "submitted": {
                            "total": 5,
                            "resultEngine": 0
                        }
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 81,
                    "assessmentsBySeverity": {
                        "low": 7,
                        "high": 11,
                        "medium": 63
                    }
                }
            }
              const res = await chai.request(config.baseUrl)
                  .get(`/collections/meta/metrics/detail?benchmarkId=${environment.testCollection.benchmark}`)
                  .set('Authorization', `Bearer ${lvl1.token}`)
              expect(res).to.have.status(200)
              expect(res.body).to.deep.equal(expectedMetrics)
        })
    })
    describe('GET - getMetricsDetailByMetaAggCollection - /collections/meta/metrics/detail/collection', () => {

        it('meta metrics detail - agg by collection - no params', async () => { 
            const expectedMetrics = [
                {
                    "collectionId": "21",
                    "name": "Collection X",
                    "assets": 1,
                    "stigs": 1,
                    "checklists": 1,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": {
                                "total": 3,
                                "resultEngine": 0
                            },
                            "pass": {
                                "total": 2,
                                "resultEngine": 0
                            },
                            "error": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "fixed": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "unknown": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notchecked": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notselected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "informational": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notapplicable": {
                                "total": 1,
                                "resultEngine": 0
                            }
                        },
                        "assessed": 6,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 2
                        },
                        "statuses": {
                            "saved": {
                                "total": 1,
                                "resultEngine": 0
                            },
                            "accepted": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "rejected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "submitted": {
                                "total": 5,
                                "resultEngine": 0
                            }
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 81,
                        "assessmentsBySeverity": {
                            "low": 7,
                            "high": 11,
                            "medium": 63
                        }
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get('/collections/meta/metrics/detail/collection')
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('meta metrics detail - collection agg - coll param', async () => { 
            const expectedMetrics = [
                {
                    "collectionId": "21",
                    "name": "Collection X",
                    "assets": 1,
                    "stigs": 1,
                    "checklists": 1,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": {
                                "total": 3,
                                "resultEngine": 0
                            },
                            "pass": {
                                "total": 2,
                                "resultEngine": 0
                            },
                            "error": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "fixed": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "unknown": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notchecked": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notselected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "informational": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notapplicable": {
                                "total": 1,
                                "resultEngine": 0
                            }
                        },
                        "assessed": 6,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 2
                        },
                        "statuses": {
                            "saved": {
                                "total": 1,
                                "resultEngine": 0
                            },
                            "accepted": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "rejected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "submitted": {
                                "total": 5,
                                "resultEngine": 0
                            }
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 81,
                        "assessmentsBySeverity": {
                            "low": 7,
                            "high": 11,
                            "medium": 63
                        }
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/detail/collection?collectionId=${environment.testCollection.collectionId}`)
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('meta metrics detail - collection agg - bench param', async () => { 
            const expectedMetrics = [
                {
                    "collectionId": "21",
                    "name": "Collection X",
                    "assets": 1,
                    "stigs": 1,
                    "checklists": 1,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": {
                                "total": 3,
                                "resultEngine": 0
                            },
                            "pass": {
                                "total": 2,
                                "resultEngine": 0
                            },
                            "error": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "fixed": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "unknown": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notchecked": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notselected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "informational": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notapplicable": {
                                "total": 1,
                                "resultEngine": 0
                            }
                        },
                        "assessed": 6,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 2
                        },
                        "statuses": {
                            "saved": {
                                "total": 1,
                                "resultEngine": 0
                            },
                            "accepted": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "rejected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "submitted": {
                                "total": 5,
                                "resultEngine": 0
                            }
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 81,
                        "assessmentsBySeverity": {
                            "low": 7,
                            "high": 11,
                            "medium": 63
                        }
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/detail/collection?benchmarkId=${environment.testCollection.benchmark}`)
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('meta metrics detail - collection agg - rev param', async () => { 
            const expectedMetrics =[
                {
                    "collectionId": "21",
                    "name": "Collection X",
                    "assets": 1,
                    "stigs": 1,
                    "checklists": 1,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": {
                                "total": 3,
                                "resultEngine": 0
                            },
                            "pass": {
                                "total": 2,
                                "resultEngine": 0
                            },
                            "error": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "fixed": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "unknown": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notchecked": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notselected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "informational": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notapplicable": {
                                "total": 1,
                                "resultEngine": 0
                            }
                        },
                        "assessed": 6,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 2
                        },
                        "statuses": {
                            "saved": {
                                "total": 1,
                                "resultEngine": 0
                            },
                            "accepted": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "rejected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "submitted": {
                                "total": 5,
                                "resultEngine": 0
                            }
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 81,
                        "assessmentsBySeverity": {
                            "low": 7,
                            "high": 11,
                            "medium": 63
                        }
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/detail/collection?revisionId=${'VPN_SRG_TEST-1-1'}`)
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
    })
    describe('GET - getMetricsDetailByMetaAggStig - /collections/meta/metrics/detail/stig', () => {

        it('meta metrics detail - stig agg - no params', async () => {
            const expectedMetrics = [
                {
                    "benchmarkId": "VPN_SRG_TEST",
                    "title": "Virtual Private Network (VPN) Security Requirements Guide",
                    "revisionStr": "V1R1",
                    "collections": 1,
                    "assets": 1,
                    "ruleCount": 81,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": {
                                "total": 3,
                                "resultEngine": 0
                            },
                            "pass": {
                                "total": 2,
                                "resultEngine": 0
                            },
                            "error": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "fixed": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "unknown": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notchecked": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notselected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "informational": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notapplicable": {
                                "total": 1,
                                "resultEngine": 0
                            }
                        },
                        "assessed": 6,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 2
                        },
                        "statuses": {
                            "saved": {
                                "total": 1,
                                "resultEngine": 0
                            },
                            "accepted": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "rejected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "submitted": {
                                "total": 5,
                                "resultEngine": 0
                            }
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 81,
                        "assessmentsBySeverity": {
                            "low": 7,
                            "high": 11,
                            "medium": 63
                        }
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get('/collections/meta/metrics/detail/stig')
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('meta metrics detail - stig agg - coll param', async () => {
            const expectedMetrics = [
                {
                    "benchmarkId": "VPN_SRG_TEST",
                    "title": "Virtual Private Network (VPN) Security Requirements Guide",
                    "revisionStr": "V1R1",
                    "collections": 1,
                    "assets": 1,
                    "ruleCount": 81,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": {
                                "total": 3,
                                "resultEngine": 0
                            },
                            "pass": {
                                "total": 2,
                                "resultEngine": 0
                            },
                            "error": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "fixed": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "unknown": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notchecked": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notselected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "informational": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "notapplicable": {
                                "total": 1,
                                "resultEngine": 0
                            }
                        },
                        "assessed": 6,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 2
                        },
                        "statuses": {
                            "saved": {
                                "total": 1,
                                "resultEngine": 0
                            },
                            "accepted": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "rejected": {
                                "total": 0,
                                "resultEngine": 0
                            },
                            "submitted": {
                                "total": 5,
                                "resultEngine": 0
                            }
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 81,
                        "assessmentsBySeverity": {
                            "low": 7,
                            "high": 11,
                            "medium": 63
                        }
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/detail/stig?collectionId=${environment.testCollection.collectionId}`)
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('meta metrics detail - stig agg - bench param', async () => {
            const expectedMetrics = [
    {
        "benchmarkId": "VPN_SRG_TEST",
        "title": "Virtual Private Network (VPN) Security Requirements Guide",
        "revisionStr": "V1R1",
        "collections": 1,
        "assets": 1,
        "ruleCount": 81,
        "metrics": {
            "maxTs": "2022-02-03T00:07:05Z",
            "minTs": "2020-08-11T22:27:26Z",
            "results": {
                "fail": {
                    "total": 3,
                    "resultEngine": 0
                },
                "pass": {
                    "total": 2,
                    "resultEngine": 0
                },
                "error": {
                    "total": 0,
                    "resultEngine": 0
                },
                "fixed": {
                    "total": 0,
                    "resultEngine": 0
                },
                "unknown": {
                    "total": 0,
                    "resultEngine": 0
                },
                "notchecked": {
                    "total": 0,
                    "resultEngine": 0
                },
                "notselected": {
                    "total": 0,
                    "resultEngine": 0
                },
                "informational": {
                    "total": 0,
                    "resultEngine": 0
                },
                "notapplicable": {
                    "total": 1,
                    "resultEngine": 0
                }
            },
            "assessed": 6,
            "findings": {
                "low": 1,
                "high": 0,
                "medium": 2
            },
            "statuses": {
                "saved": {
                    "total": 1,
                    "resultEngine": 0
                },
                "accepted": {
                    "total": 0,
                    "resultEngine": 0
                },
                "rejected": {
                    "total": 0,
                    "resultEngine": 0
                },
                "submitted": {
                    "total": 5,
                    "resultEngine": 0
                }
            },
            "maxTouchTs": "2022-02-03T00:07:07Z",
            "assessments": 81,
            "assessmentsBySeverity": {
                "low": 7,
                "high": 11,
                "medium": 63
            }
        }
    }
]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/detail/stig?benchmarkId=${environment.testCollection.benchmark}`)
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
    })
    describe('GET - getMetricsSummaryByMeta - /collections/meta/metrics/summary', () => {

        it('meta metrics summary- no agg - no params', async () => {
            const expectedMetrics =  {
                "collections": 1,
                "assets": 1,
                "stigs": 1,
                "checklists": 1,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": 3,
                        "pass": 2,
                        "unassessed": 0,
                        "notapplicable": 1
                    },
                    "assessed": 6,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 2
                    },
                    "statuses": {
                        "saved": 1,
                        "accepted": 0,
                        "rejected": 0,
                        "submitted": 5
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 81
                }
            }
            const res = await chai.request(config.baseUrl)
                .get('/collections/meta/metrics/summary')
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('meta metrics summary - no agg - collectionId param', async () => {
            const expectedMetrics =   {
                "collections": 1,
                "assets": 1,
                "stigs": 1,
                "checklists": 1,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": 3,
                        "pass": 2,
                        "unassessed": 0,
                        "notapplicable": 1
                    },
                    "assessed": 6,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 2
                    },
                    "statuses": {
                        "saved": 1,
                        "accepted": 0,
                        "rejected": 0,
                        "submitted": 5
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 81
                }
            }
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/summary?collectionId=${environment.testCollection.collectionId}`)
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('meta metrics summary - no agg - benchmark param', async () => {
            const expectedMetrics =   {
                "collections": 1,
                "assets": 1,
                "stigs": 1,
                "checklists": 1,
                "metrics": {
                    "maxTs": "2022-02-03T00:07:05Z",
                    "minTs": "2020-08-11T22:27:26Z",
                    "results": {
                        "fail": 3,
                        "pass": 2,
                        "unassessed": 0,
                        "notapplicable": 1
                    },
                    "assessed": 6,
                    "findings": {
                        "low": 1,
                        "high": 0,
                        "medium": 2
                    },
                    "statuses": {
                        "saved": 1,
                        "accepted": 0,
                        "rejected": 0,
                        "submitted": 5
                    },
                    "maxTouchTs": "2022-02-03T00:07:07Z",
                    "assessments": 81
                }
            }
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/summary?benchmarkId=${environment.testCollection.benchmark}`)
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
    })
    describe('GET - getMetricsSummaryByMetaAggCollection - /collections/meta/metrics/summary/collection', () => {
    
        it('Return meta metrics summary - collection agg - no params Copy', async () => {
                const expectedMetrics = [
                    {
                        "collectionId": "21",
                        "name": "Collection X",
                        "assets": 1,
                        "stigs": 1,
                        "checklists": 1,
                        "metrics": {
                            "maxTs": "2022-02-03T00:07:05Z",
                            "minTs": "2020-08-11T22:27:26Z",
                            "results": {
                                "fail": 3,
                                "pass": 2,
                                "unassessed": 0,
                                "notapplicable": 1
                            },
                            "assessed": 6,
                            "findings": {
                                "low": 1,
                                "high": 0,
                                "medium": 2
                            },
                            "statuses": {
                                "saved": 1,
                                "accepted": 0,
                                "rejected": 0,
                                "submitted": 5
                            },
                            "maxTouchTs": "2022-02-03T00:07:07Z",
                            "assessments": 81
                        }
                    }
                ]
                const res = await chai.request(config.baseUrl)
                    .get('/collections/meta/metrics/summary/collection')
                    .set('Authorization', `Bearer ${lvl1.token}`)
                expect(res).to.have.status(200)
                expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('Return meta metrics summary - collection agg - collection param', async () => {
            const expectedMetrics = [
                {
                    "collectionId": "21",
                    "name": "Collection X",
                    "assets": 1,
                    "stigs": 1,
                    "checklists": 1,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": 3,
                            "pass": 2,
                            "unassessed": 0,
                            "notapplicable": 1
                        },
                        "assessed": 6,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 2
                        },
                        "statuses": {
                            "saved": 1,
                            "accepted": 0,
                            "rejected": 0,
                            "submitted": 5
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 81
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/summary/collection?collectionId=${environment.testCollection.collectionId}`)
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('Return meta metrics summary - collection agg - benchmark param', async () => {
            const expectedMetrics = [
                {
                    "collectionId": "21",
                    "name": "Collection X",
                    "assets": 1,
                    "stigs": 1,
                    "checklists": 1,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": 3,
                            "pass": 2,
                            "unassessed": 0,
                            "notapplicable": 1
                        },
                        "assessed": 6,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 2
                        },
                        "statuses": {
                            "saved": 1,
                            "accepted": 0,
                            "rejected": 0,
                            "submitted": 5
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 81
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/summary/collection?benchmarkId=${environment.testCollection.benchmark}`)
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('Return meta metrics summary - collection agg - rev param', async () => {
            const expectedMetrics = []
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/summary/collection?revisionId=${'VPN_SRG_TEST'}-1-0`)
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('Return meta metrics summary - collection agg - rev param Copy', async () => {
            const expectedMetrics =   [
                {
                    "collectionId": "21",
                    "name": "Collection X",
                    "assets": 1,
                    "stigs": 1,
                    "checklists": 1,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": 3,
                            "pass": 2,
                            "unassessed": 0,
                            "notapplicable": 1
                        },
                        "assessed": 6,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 2
                        },
                        "statuses": {
                            "saved": 1,
                            "accepted": 0,
                            "rejected": 0,
                            "submitted": 5
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 81
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/summary/collection?revisionId=${'VPN_SRG_TEST'}-1-1`)
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
    })
    describe('GET - getMetricsSummaryByMetaAggStig - /collections/meta/metrics/summary/stig', () => {

        it('Return meta metrics summary - stig agg - no params', async () => {  
            const expectedMetrics =[
                {
                    "benchmarkId": "VPN_SRG_TEST",
                    "title": "Virtual Private Network (VPN) Security Requirements Guide",
                    "revisionStr": "V1R1",
                    "collections": 1,
                    "assets": 1,
                    "ruleCount": 81,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": 3,
                            "pass": 2,
                            "unassessed": 0,
                            "notapplicable": 1
                        },
                        "assessed": 6,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 2
                        },
                        "statuses": {
                            "saved": 1,
                            "accepted": 0,
                            "rejected": 0,
                            "submitted": 5
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 81
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get('/collections/meta/metrics/summary/stig')
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('Return meta metrics summary - stig agg - collection param', async () => {  
            const expectedMetrics =[
                {
                    "benchmarkId": "VPN_SRG_TEST",
                    "title": "Virtual Private Network (VPN) Security Requirements Guide",
                    "revisionStr": "V1R1",
                    "collections": 1,
                    "assets": 1,
                    "ruleCount": 81,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": 3,
                            "pass": 2,
                            "unassessed": 0,
                            "notapplicable": 1
                        },
                        "assessed": 6,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 2
                        },
                        "statuses": {
                            "saved": 1,
                            "accepted": 0,
                            "rejected": 0,
                            "submitted": 5
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 81
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/summary/stig?collectionId=${environment.testCollection.collectionId}`)
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('Return meta metrics summary - stig agg - benchmark param', async () => {  
            const expectedMetrics = [
                {
                    "benchmarkId": "VPN_SRG_TEST",
                    "title": "Virtual Private Network (VPN) Security Requirements Guide",
                    "revisionStr": "V1R1",
                    "collections": 1,
                    "assets": 1,
                    "ruleCount": 81,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": 3,
                            "pass": 2,
                            "unassessed": 0,
                            "notapplicable": 1
                        },
                        "assessed": 6,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 2
                        },
                        "statuses": {
                            "saved": 1,
                            "accepted": 0,
                            "rejected": 0,
                            "submitted": 5
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 81
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/summary/stig?benchmarkId=${environment.testCollection.benchmark}`)
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
        it('Return meta metrics summary - stig agg - benchmark param', async () => {  
            const expectedMetrics = [
                {
                    "benchmarkId": "VPN_SRG_TEST",
                    "title": "Virtual Private Network (VPN) Security Requirements Guide",
                    "revisionStr": "V1R1",
                    "collections": 1,
                    "assets": 1,
                    "ruleCount": 81,
                    "metrics": {
                        "maxTs": "2022-02-03T00:07:05Z",
                        "minTs": "2020-08-11T22:27:26Z",
                        "results": {
                            "fail": 3,
                            "pass": 2,
                            "unassessed": 0,
                            "notapplicable": 1
                        },
                        "assessed": 6,
                        "findings": {
                            "low": 1,
                            "high": 0,
                            "medium": 2
                        },
                        "statuses": {
                            "saved": 1,
                            "accepted": 0,
                            "rejected": 0,
                            "submitted": 5
                        },
                        "maxTouchTs": "2022-02-03T00:07:07Z",
                        "assessments": 81
                    }
                }
            ]
            const res = await chai.request(config.baseUrl)
                .get(`/collections/meta/metrics/summary/stig?benchmarkId=${environment.testCollection.benchmark}&collectionId=${environment.testCollection.collectionId}`)
                .set('Authorization', `Bearer ${lvl1.token}`)
            expect(res).to.have.status(200)
            expect(res.body).to.deep.equal(expectedMetrics)
        })
    })
})
