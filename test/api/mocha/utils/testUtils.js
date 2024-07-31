const axios = require('axios')
const config = require('../testConfig.json')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')
const environment = require('../environment.json')

const adminToken = config.adminToken

const loadAppData = async () => {

  const appdataFile = path.join(__dirname, '../../form-data-files/appdata.json')
  const formData = new FormData()
  formData.append('importFile', fs.createReadStream(appdataFile), {
    filename: 'appdata.json',
    contentType: 'application/json'
  })
  const axiosConfig = {
    method: 'post',
    url: `${config.baseUrl}/op/appdata?elevate=true`,
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${adminToken}`
    },
    data: formData
  }
  try {
    const response = await axios(axiosConfig)
  } catch (error) {
    console.error(`Failed to upload:`, error)
  }
}

const loadBatchAppData = async () => {
  const appdataFile = path.join(__dirname, '../../form-data-files/batch-test-data.json')
  const formData = new FormData()
  formData.append('importFile', fs.createReadStream(appdataFile), {
    filename: 'appdata.json',
    contentType: 'application/json'
  })
  const axiosConfig = {
    method: 'post',
    url: `${config.baseUrl}/op/appdata?elevate=true`,
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${adminToken}`
    },
    data: formData
  }
  try {
    const response = await axios(axiosConfig)
  } catch (error) {
    console.error(`Failed to upload:`, error)
  }
}

const loadMetaMetricsAppData = async () => {
  const appdataFile = path.join(__dirname, '../../form-data-files/appdata-meta-metrics-with-pin.json')
  const formData = new FormData()
  formData.append('importFile', fs.createReadStream(appdataFile), {
    filename: 'appdata.json',
    contentType: 'application/json'
  })
  const axiosConfig = {
    method: 'post',
    url: `${config.baseUrl}/op/appdata?elevate=true`,
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${adminToken}`
    },
    data: formData
  }
  try {
    const response = await axios(axiosConfig)
  } catch (error) {
    console.error(`Failed to upload:`, error)
  }
}

const createTempCollection = async () => {
  try {
    const res = await axios.post(
      `${config.baseUrl}/collections?elevate=true&projection=grants&projection=labels`,
      {
        name: 'temoCollection',
        description: 'Collection TEST description',
        settings: {
          fields: {
            detail: {
              enabled: 'always',
              required: 'findings'
            },
            comment: {
              enabled: 'always',
              required: 'findings'
            }
          },
          status: {
            canAccept: true,
            minAcceptGrant: 2,
            resetCriteria: 'result'
          },
          history: {
            maxReviews: 11
          }
        },
        metadata: {
          pocName: 'poc2Put',
          pocEmail: 'pocEmailPut@email.com',
          pocPhone: '12342',
          reqRar: 'true'
        },
        grants: [
          {
            userId: '1',
            accessLevel: 4
          },
          {
            userId: '85',
            accessLevel: 1
          }
        ],
        labels: [
          {
            name: 'TEST',
            description: 'Collection label description',
            color: 'ffffff'
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return res
  }
  catch (e) {
    throw e;
  }
}

const deleteCollection = async (collectionId) => {
  try {
    await axios.delete(
      `${config.baseUrl}/collections/${collectionId}?elevate=true&projection=assets&projection=grants&projection=owners&projection=statistics&projection=stigs`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    )
  } catch (e) {
    throw e;
  }
}

const createTempAsset = async asset => {
  if (!asset) {
    asset = {
      name: 'tempAsset',
      collectionId: "21",
      description: 'temp',
      ip: '1.1.1.1',
      noncomputing: true,
      labelIds: [],
      metadata: {
        pocName: 'pocName',
        pocEmail: 'pocEmail@example.com',
        pocPhone: '12345',
        reqRar: 'true'
      },
      stigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST']
    }
  }
  try {
    const res = await axios.post(`${config.baseUrl}/assets`, asset, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    })
    return res
  } catch (e) {
    throw e;
  }
}

const deleteAsset = async assetId => {
  try {
    await axios.delete(
      `${config.baseUrl}/assets/${assetId}?projection=statusStats&projection=stigs&projection=stigGrants`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (e) {
    throw e;
  }
}

const createDisabledCollectionsandAssets = async () => {
  // this also should create stig grants for a user, add reviews too .
  const collection = await createTempCollection()
  const asset = await createTempAsset()
  await setStigGrants(21, 85, asset.data.assetId)
  await importReview(21, asset.data.assetId)
  await deleteAsset(asset.data.assetId)
  await deleteCollection(collection.data.collectionId)
  return {collection: collection.data , asset: asset.data}
}

const importReview = async (collectionId, assetId) => {
  try {
    const res = await axios.post(
      `${config.baseUrl}/collections/${collectionId}/reviews/${assetId}`,
      [
        {
        "ruleId": `${environment.testCollection.ruleId}`,
        "result": "pass",
        "detail": "test\nvisible to lvl1",
        "comment": "sure",
        "autoResult": false,
        "status": "submitted"
        }
    ],
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return res
  } catch (e) {
    throw e;
  }
}

const setStigGrants = async (collectionId, userId, assetId) => {
  try {
    const res = await axios.put(
      `${config.baseUrl}/collections/${collectionId}/grants/${userId}/access`,
      [
        {
            "benchmarkId": "VPN_SRG_TEST",
            "assetId": `${assetId}`
        },
        {
            "benchmarkId": "VPN_SRG_TEST",
            "assetId": "42"
        },
        {
            "benchmarkId": "VPN_SRG_TEST",
            "assetId": "154"
        }        
    ],
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }
    )
    return res
  } catch (e) {
    throw e;
  }
}

const uploadTestStigs = async () => {
  const testFilenames = [
    'U_MS_Windows_10_STIG_V1R23_Manual-xccdf.xml',
    'U_RHEL_7_STIG_V3R0-3_Manual-xccdf.xml',
    'U_VPN_SRG_V1R1_Manual-xccdf-replace.xml',
    'U_VPN_SRG_V1R1_Manual-xccdf.xml',
    'U_VPN_SRG_V2R3_Manual-xccdf-reviewKeyChange.xml',
    'U_VPN_SRG-OTHER_V1R1_Manual-xccdf.xml',
    'U_VPN_SRG_V1R0_Manual-xccdf.xml',
    'U_VPN_SRG-OTHER_V1R1_twoRules-matchingFingerprints.xml'
  ]
  const directoryPath = path.join(__dirname, '../../form-data-files/')

  for (const filename of testFilenames) {
    const formData = new FormData()
    const filePath = path.join(directoryPath, filename)
    formData.append('importFile', fs.createReadStream(filePath), {
      filename,
      contentType: 'text/xml'
    })

    const axiosConfig = {
      method: 'post',
      url: `${config.baseUrl}/stigs?elevate=true&clobber=true`,
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${adminToken}`
      },
      data: formData
    }

    try {
      const response = await axios(axiosConfig)
    } catch (error) {
      console.error(`Failed to upload ${filename}:`, error)
    }
  }
}

const replaceStigRevision = async (stigFile = "U_VPN_SRG_V1R1_Manual-xccdf-replace.xml") => {
  const directoryPath = path.join(__dirname, '../../form-data-files/')

  const formData = new FormData()
  const filePath = path.join(directoryPath, stigFile)
  formData.append('importFile', fs.createReadStream(filePath), {
    stigFile,
    contentType: 'text/xml'
  })

  const axiosConfig = {
    method: 'post',
    url: `${config.baseUrl}/stigs?clobber=true`,
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${adminToken}`
    },
    data: formData
  }

  try {
    const response = await axios(axiosConfig)
    console.log(`Successfully uploaded ${stigFile}`)
  } catch (error) {
    console.error(`Failed to upload ${stigFile}:`, error)
  }
}

const deleteStig = async (benchmarkId) => {
  try {

    const axiosConfig = {
      method: 'delete',
      url: `${config.baseUrl}/stigs/${benchmarkId}?elevate=true&force=true`,
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        }
      }
    const res = await axios(axiosConfig)
    return res
  } catch (e) {
    throw e
  }
}

const getAsset = async assetId => {
  try {
    const res = await axios.get(
      `${config.baseUrl}/assets/${assetId}?projection=statusStats&projection=stigs&projection=stigGrants`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return res.data
  }
  catch (e) {
   return e;
  }
}

const getStigByBenchmarkId = async benchmarkId => {
  try {
    const res = await axios.get(
      `${config.baseUrl}/stigs/${benchmarkId}?elevate=true`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json' 
        }
      }
    )
    return res.data
  }
  catch (e) {
    return e
  }
}

const getUser = async userId => {
  try {
    const res = await axios.get(
      `${config.baseUrl}/users/${userId}?elevate=true&projection=collectionGrants&projection=statistics`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return res.data
  }
  catch (e) {
   return e;
  }
}

const getAssetsByLabel = async (collectionId, labelId) => {
  try {
    const res = await axios.get(
      `${config.baseUrl}/collections/${collectionId}/labels/${labelId}/assets`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return res.data
  }
  catch (e) {
   return e;
  }
}

const getCollectionMetricsDetails = async (collectionId) => {
  try {
    const res = await axios.get(
      `${config.baseUrl}/collections/${collectionId}/metrics/detail`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return res.data
  }
  catch (e) {
   return e;
  }
}

const getReviews = async (collectionId) => {
  try {
    const res = await axios.get(
      `${config.baseUrl}/collections/${collectionId}/reviews/`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return res.data
  }
  catch (e) {
   return undefined;
  }
}

const getChecklist = async (assetId, benchmarkId, revisionStr) => {
  try {
    const res = await axios.get(
      `${config.baseUrl}/assets/${assetId}/checklists/${benchmarkId}/${revisionStr}?format=ckl`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return res.data
  }
  catch (e) {
   return e;
  }
}

const getCollection = async (collectionId) => {
  try {
    const res = await axios.get(
      `${config.baseUrl}/collections/${collectionId}?projection=grants&projection=assets&projection=labels&projection=owners&projection=statistics&projection=stigs`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return res.data
  }
  catch (e) {
   return undefined;
  }
}

const getStigByCollectionBenchmarkId = async (collectionId, benchmarkId) => {

  try {
    const res = await axios.get(
      `${config.baseUrl}/collections/${collectionId}/stigs/${benchmarkId}`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return res.data
  }
  catch (e) {
    return undefined
  }
}

const setDefaultRevision = async (collectionId, benchmarkId, revisionStr) => {

  try {
    const res = await axios.post(
      `${config.baseUrl}/collections/${collectionId}/stigs/${benchmarkId}`,
      {"defaultRevisionStr": revisionStr},
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return res
  }
  catch (e) {
    return e;
  }

}

module.exports = {
  loadAppData,
  loadMetaMetricsAppData,
  uploadTestStigs,
  getStigByCollectionBenchmarkId,
  setDefaultRevision,
  createTempAsset,
  createDisabledCollectionsandAssets,
  getAsset,
  getAssetsByLabel,
  getUser,
  getReviews,
  loadBatchAppData,
  getCollectionMetricsDetails,
  getChecklist,
  replaceStigRevision,
  deleteStig,
  getStigByBenchmarkId,
  getCollection
}
