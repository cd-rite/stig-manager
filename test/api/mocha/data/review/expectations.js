//This data contains expected response data that varies by iteration "scenario" or "user" for each test case. These expectations are relative to the "referenceData.js" data used to construct the API requests.

const distinct = {
    stigmanadmin: {
      user: 'admin',
      testAssetStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
      userId: '87',
      testAssetStats: {
        ruleCount: 368,
        stigCount: 2,
        savedCount: 2,
        acceptedCount: 0,
        rejectedCount: 0,
        submittedCount: 7
      },
      grant: 'admin',
      collectionCount: 6,
      collectionMatchCnt: 3,
      collectionCountElevated: 7,
      findingsCnt: 8,
      findingsByGroupCnt: 4,
      findingsByRuleCnt: 3,
      findingsByRuleAndAssetCnt: 4,
      findingsByCciCnt: 8,
      labelCount: 2,
      fullLabelUses: 2,
      lvl1LabelUses: 1,
      historyResponseStatus: 200,
      assignedStigs: ['VPN_SRG_TEST'],
      checklistCnt_testCollection: 6,
      grantCnt_testCollection: 7,
      assetIds: ['29', '62', '42', '154'],
      validStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
      collectionIds: ['21'],
      testBenchmarkAssignedCount: 3,
      deleteCollectionId_admin: '84',
      canDeleteCollection: true,
      canModifyCollection: true
    },
    lvl1: {
      testAssetStigs: ['VPN_SRG_TEST'],
      testAssetStats: {
        ruleCount: 81,
        stigCount: 1,
        savedCount: 1,
        acceptedCount: 0,
        rejectedCount: 0,
        submittedCount: 5
      },
      user: 'lvl1',
      userId: '85',
      grant: 'restricted',
      collectionCount: 1,
      collectionMatchCnt: 1,
      findingsCnt: 7,
      findingsByGroupCnt: 3,
      findingsByRuleCnt: 3,
      findingsByRuleAndAssetCnt: 3,
      findingsByCciCnt: 7,
      labelCount: 1,
      fullLabelUses: 1,
      lvl1LabelUses: 1,
      historyResponseStatus: 403,
      checklistCnt_testCollection: 3,
      grantCnt_testCollection: 7,
      assignedStigs: ['VPN_SRG_TEST'],
      assetIds: ['42', '154'],
      validStigs: ['VPN_SRG_TEST'],
      collectionIds: ['21'],
      testBenchmarkAssignedCount: 2,
      canDeleteCollection: false,
      canModifyCollection: false
    },
    lvl2: {
      testAssetStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
      testAssetStats: {
        ruleCount: 368,
        stigCount: 2,
        savedCount: 2,
        acceptedCount: 0,
        rejectedCount: 0,
        submittedCount: 7
      },
      user: 'admin',
      userId: '87',
      grant: 'admin',
      collectionCount: 2,
      collectionMatchCnt: 2,
      findingsCnt: 8,
      findingsByGroupCnt: 4,
      findingsByRuleCnt: 3,
      findingsByRuleAndAssetCnt: 4,
      findingsByCciCnt: 8,
      labelCount: 2,
      fullLabelUses: 2,
      lvl1LabelUses: 1,
      historyResponseStatus: 200,
      assignedStigs: ['VPN_SRG_TEST'],
      checklistCnt_testCollection: 6,
      grantCnt_testCollection: 7,
      assetIds: ['29', '62', '42', '154'],
      validStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
      collectionIds: ['21'],
      testBenchmarkAssignedCount: 3,
      canDeleteCollection: false,
      canModifyCollection: false
    },
    lvl3: {
      testAssetStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
      testAssetStats: {
        ruleCount: 368,
        stigCount: 2,
        savedCount: 2,
        acceptedCount: 0,
        rejectedCount: 0,
        submittedCount: 7
      },
      user: 'admin',
      userId: '87',
      grant: 'admin',
      collectionCount: 2,
      collectionMatchCnt: 2,
      findingsCnt: 8,
      findingsByGroupCnt: 4,
      findingsByRuleCnt: 3,
      findingsByRuleAndAssetCnt: 4,
      findingsByCciCnt: 8,
      labelCount: 2,
      fullLabelUses: 2,
      lvl1LabelUses: 1,
      historyResponseStatus: 200,
      assignedStigs: ['VPN_SRG_TEST'],
      checklistCnt_testCollection: 6,
      grantCnt_testCollection: 7,
      assetIds: ['29', '62', '42', '154'],
      validStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
      collectionIds: ['21'],
      testBenchmarkAssignedCount: 3,
      canDeleteCollection: false,
      canModifyCollection: true
    },
    lvl4: {
      testAssetStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
      testAssetStats: {
        ruleCount: 368,
        stigCount: 2,
        savedCount: 2,
        acceptedCount: 0,
        rejectedCount: 0,
        submittedCount: 7
      },
      user: 'admin',
      userId: '87',
      grant: 'admin',
      collectionCount: 3,
      collectionMatchCnt: 2,
      findingsCnt: 8,
      findingsByGroupCnt: 4,
      findingsByRuleCnt: 3,
      findingsByRuleAndAssetCnt: 4,
      findingsByCciCnt: 8,
      labelCount: 2,
      fullLabelUses: 2,
      lvl1LabelUses: 1,
      historyResponseStatus: 200,
      assignedStigs: ['VPN_SRG_TEST'],
      checklistCnt_testCollection: 6,
      grantCnt_testCollection: 7,
      assetIds: ['29', '62', '42', '154'],
      validStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
      collectionIds: ['21'],
      testBenchmarkAssignedCount: 3,
      canDeleteCollection: true,
      canModifyCollection: true
    },
    collectioncreator: {}
}
  module.exports = distinct
  