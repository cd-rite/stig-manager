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
    assignedStigs: ['VPN_SRG_TEST'],
    assetIds: ['29', '62', '42', '154'],
    assetMatchString: "asset",
    validStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
    collectionIds: ['21'],
    canModifyCollection: true,
    assetsAvailableFullLabel: ["62","42"],
    assetsAvailableBenchmark: ["42","62", "154"],
    assetsAvailableStigGrants:["42","62", "154"],
    hasAccessToTestAsset: true,
    hasAccessToTestAssetNoStigs: true,
    
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
    canModifyCollection: false,
    assignedStigs: ['VPN_SRG_TEST'],
    assetIds: ['42', '154'],
    assetMatchString: "lvl1",
    assetsAvailableFullLabel: ["42"],
    assetsAvailableBenchmark: ["42", "154"],
    validStigs: ['VPN_SRG_TEST'],
    collectionIds: ['21'],
    hasAccessToTestAsset: true,
    hasAccessToTestAssetNoStigs: false,

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
    user: 'lvl2',
    userId: '87',
    canModifyCollection: false,
    grant: 'full',
    assignedStigs: ['VPN_SRG_TEST'],
    assetIds: ['29', '62', '42', '154'],
    assetMatchString: "asset",
    assetsAvailableFullLabel: ["62","42"],
    assetsAvailableBenchmark: ["42","62", "154"],
    validStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
    collectionIds: ['21'],
    hasAccessToTestAsset: true,
    hasAccessToTestAssetNoStigs: true,

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
    user: 'lvl3',
    userId: '87',
    grant: 'manage',
    canModifyCollection: true,
    assignedStigs: ['VPN_SRG_TEST'],
    assetIds: ['29', '62', '42', '154'],
    assetMatchString: "asset",
    validStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
    collectionIds: ['21'],
    assetsAvailableFullLabel: ["62","42"],
    assetsAvailableBenchmark: ["42","62", "154"],
    assetsAvailableStigGrants:["42","62", "154"],
    hasAccessToTestAsset: true,
    hasAccessToTestAssetNoStigs: true,

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
    user: 'lvl4',
    userId: '87',
    grant: 'owner',
    canModifyCollection: true,
    assetsAvailableFullLabel: ["62","42"],
    assignedStigs: ['VPN_SRG_TEST'],
    assetIds: ['29', '62', '42', '154'],
    assetMatchString: "asset",
    assetsAvailableBenchmark: ["42","62", "154"],
    validStigs: ['VPN_SRG_TEST', 'Windows_10_STIG_TEST'],
    collectionIds: ['21'],
    assetsAvailableStigGrants:["42","62", "154"],
    hasAccessToTestAsset: true,
    hasAccessToTestAssetNoStigs: true,
  },
  collectioncreator: {
    canModifyCollection: false,
    hasAccessToTestAsset: false,
    hasAccessToTestAssetNoStigs: false,

  }
}
module.exports = distinct
