// This data represents components of the primary test Collections, Assets, etc. contained in the standard appData.json file without regard to access controls being exercised by the tests.  These Ids, etc. should be used to construct test case API requests. This data should only be used as expectations in cases where all test scenarios exercised are expected to return the same data. 

// The standard "testCollection" includes users named after the roles they have for that specific Collection, is used in most "GET" tests or tests not expected to change data that could alter expectations for subsequent tests. "scrapCollection" is used for tests that alter Collection data in some way.

const reference = {
    "collectionId": "21",
    "collectionName": "Test Collection",
    "collectionDescription": "This is a test collection",
    "collectionOwner": "admin",
    "collectionOwnerID": "87",
    "benchmark": "VPN_SRG_TEST",
    "checklistLength": "81",
    "revisionStr": "V1R1",
    "grantCheckUserId": "85",
    "testCollection":{
      "name": "Collection X",
      "collectionId": "21",
      "collectionMetadataKey": "pocName",
      "collectionMetadataValue": "poc2Patched",
      "owners": ["87", "1", "45"],
      "assetIds":["29","62","42","154"],
      "assetsWithHistory":["42","154"],
      "testAssetId": "42",
      "validStigs": ["VPN_SRG_TEST","Windows_10_STIG_TEST"],
      "labelCount": 2,
      "lvl1LabelName": "test-label-lvl1",
      "lvl1Label":"5130dc84-9a68-11ec-b1bc-0242ac110002",
      "fullLabel":"755b8a28-9a68-11ec-b1bc-0242ac110002",
      "fullLabelName": "test-label-full",
      "labels": [
          "755b8a28-9a68-11ec-b1bc-0242ac110002",
          "5130dc84-9a68-11ec-b1bc-0242ac110002"
      ],
      "allMetadata": [{
        "key": "pocEmail",
        "value": "pocEmail@email.com"
        },
        {
        "key": "pocName",               
        "value": "poc2Patched"
        },
        {
        "key": "pocPhone",
        "value": "12342"
        },
        {
        "key": "reqRar",
        "value": "true"
      }],
      "reviewHistory":{
        "assetId": "42",
        "startDate": "1900-10-01",
        "endDate": "2020-10-01",
        "deletedEntriesByDate": 6,
        "deletedEntriesByDateAsset": 4,
        "ruleId": "SV-106179r1_rule",
        "status": "submitted"
      },
      "rulesWithHistoryCnt": 2,
      "reviewHistoryRuleCnt": 2,
      "reviewHistoryTotalCnt": 7,
      "reviewHistory_endDateCnt": 6,
      "reviewHistory_startAndEndDateCnt": 2,
      "reviewHistory_startDateCnt": 2,
      "reviewHistory_byStatusCnt": 3,
      "reviewHistory_testAssetCnt": 5,
      "reviewHistory_ruleIdCnt": 4
    },
    "deleteCollection":{
      "collectionId_adminOnly": "84",
      "collectionId": "85"
    },
    "scrapCollection":{
      "collectionId": "1",
      "validStigs": ["VPN_SRG_TEST","Windows_10_STIG_TEST", "RHEL_7_STIG_TEST"],
      "scrapLabel": "df4e6836-a003-11ec-b1bc-0242ac110002",
      "collectionMetadataKey": "pocName",
      "collectionMetadataValue": "poc2Patched"
    },
    "scrapLvl1User":{
        "userId": "86",
        "username": "bizarroLvl1"
    },
    "scrapAsset":{
        "assetId": "34",
        "scrapBenchmark": "RHEL_7_STIG_TEST",
        "metadataKey": "testkey",
        "metadataValue": "testvalue"
      
    },
    "testAsset":{
      "name": "Collection_X_lvl1_asset-1",
      "assetId": "42",
      "collectionId": "21",
      "usersWithGrant":["86,85"],
      "benchmark": "VPN_SRG_TEST",
      "validStigs": ["VPN_SRG_TEST","Windows_10_STIG_TEST"],
      "metadataKey": "testkey",
      "metadataValue": "testvalue",
      "labels": [
          "755b8a28-9a68-11ec-b1bc-0242ac110002",
          "5130dc84-9a68-11ec-b1bc-0242ac110002"
        ]
     }    
  }

module.exports = reference;