//This data contains expected response data that varies by iteration "scenario" or "user" for each test case. These expectations are relative to the "referenceData.js" data used to construct the API requests. 


const requestBodies = {
  updateCollection: {
    metadata: {
        pocName: "poc2Patched",
        pocEmail: "pocEmail@email.com",
        pocPhone: "12342",
        reqRar: "true",
    },
    grants: [
        {
        userId: "1",
        accessLevel: 4,
        },
        {
        userId: "21",
        accessLevel: 1,
        },
        {
        userId: "44",
        accessLevel: 3,
        },
        {
        userId: "45",
        accessLevel: 4,
        },
        {
        userId: "87",
        accessLevel: 4,
        },
    ],
    },
    patchCollectionLabelById: {
      name: "test-label-full",
      description: "test label patched",
      color: "aa34cc"
    },
    replaceCollection: {
      name: "SetAllProperties",
      description: "test",
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
      },
      metadata: {
        pocName: "poc2Patched",
        pocEmail: "pocEmail@email.com",
        pocPhone: "12342",
        reqRar: "true",
      },
      grants: [
        {
          userId: "1",
          accessLevel: 4,
        },
        {
          userId: "21",
          accessLevel: 2,
        },
        {
          userId: "44",
          accessLevel: 3,
        },
        {
          userId: "45",
          accessLevel: 4,
        },
        {
          userId: "87",
          accessLevel: 4,
        },
      ],      
    }
  // "lvl1":{
  //   "user": "lvl1",
  //   "userId": "85",
  //   "grant": "restricted",
  //   "collectionCount": 1,
  //   "collectionMatchCnt": 1,
  //   "findingsCnt": 7,
  //   "findingsByGroupCnt": 3,  
  //   "findingsByRuleCnt": 3,  
  //   "findingsByRuleAndAssetCnt": 3,  
  //   "findingsByCciCnt": 7,    
  //   "labelCount": 1,  
  //   "fullLabelUses": 1,
  //   "lvl1LabelUses": 1,
  //   "historyResponseStatus": 403,
  //   "checklistCnt_testCollection": 3,
  //   "grantCnt_testCollection": 7,
  //   "assignedStigs": ["VPN_SRG_TEST"],
  //   "assetIds":["42","154"],
  //   "validStigs": ["VPN_SRG_TEST"],
  //   "collectionIds": ["21"],
  //   "testBenchmarkAssignedCount": 2,
  //   "canDeleteCollection": false,
  //   "canModifyCollection": false
  // },
  // "lvl2": {
  //   "user": "admin",
  //   "userId": "87",
  //   "grant": "admin",
  //   "collectionCount": 2,
  //   "collectionMatchCnt": 2,
  //   "findingsCnt": 8,  
  //   "findingsByGroupCnt": 4,  
  //   "findingsByRuleCnt": 3,  
  //   "findingsByRuleAndAssetCnt": 4,  
  //   "findingsByCciCnt": 8,    
  //   "labelCount": 2,  
  //   "fullLabelUses": 2,
  //   "lvl1LabelUses": 1,
  //   "historyResponseStatus": 200,
  //   "assignedStigs": ["VPN_SRG_TEST"],
  //   "checklistCnt_testCollection": 6,
  //   "grantCnt_testCollection": 7,
  //   "assetIds":["29","62","42","154"],
  //   "validStigs": ["VPN_SRG_TEST","Windows_10_STIG_TEST"],
  //   "collectionIds": ["21"],
  //   "testBenchmarkAssignedCount": 3,
  //   "canDeleteCollection": false,
  //   "canModifyCollection": false
  //   },
  // "lvl3": {
  //   "user": "admin",
  //   "userId": "87",
  //   "grant": "admin",
  //   "collectionCount": 2,
  //   "collectionMatchCnt": 2,
  //   "findingsCnt": 8,  
  //   "findingsByGroupCnt": 4,  
  //   "findingsByRuleCnt": 3,  
  //   "findingsByRuleAndAssetCnt": 4,  
  //   "findingsByCciCnt": 8, 
  //   "labelCount": 2,     
  //   "fullLabelUses": 2,
  //   "lvl1LabelUses": 1,
  //   "historyResponseStatus": 200,
  //   "assignedStigs": ["VPN_SRG_TEST"],
  //   "checklistCnt_testCollection": 6,
  //   "grantCnt_testCollection": 7,
  //   "assetIds":["29","62","42","154"],
  //   "validStigs": ["VPN_SRG_TEST","Windows_10_STIG_TEST"],
  //   "collectionIds": ["21"],
  //   "testBenchmarkAssignedCount": 3,
  //   "canDeleteCollection": false,
  //   "canModifyCollection": true
  //   },
  // "lvl4": {
  //   "user": "admin",
  //   "userId": "87",
  //   "grant": "admin",
  //   "collectionCount": 3,
  //   "collectionMatchCnt": 2,
  //   "findingsCnt": 8,  
  //   "findingsByGroupCnt": 4,  
  //   "findingsByRuleCnt": 3,
  //   "findingsByRuleAndAssetCnt": 4,  
  //   "findingsByCciCnt": 8, 
  //   "labelCount": 2,    
  //   "fullLabelUses": 2,
  //   "lvl1LabelUses": 1, 
  //   "historyResponseStatus": 200,
  //   "assignedStigs": ["VPN_SRG_TEST"],
  //   "checklistCnt_testCollection": 6,
  //   "grantCnt_testCollection": 7,
  //   "assetIds":["29","62","42","154"],
  //   "validStigs": ["VPN_SRG_TEST","Windows_10_STIG_TEST"],
  //   "collectionIds": ["21"],
  //   "testBenchmarkAssignedCount": 3,
  //   "canDeleteCollection": true,
  //   "canModifyCollection": true
  //   }
}
module.exports = requestBodies;