//This data contains expected response data that varies by iteration "scenario" or "user" for each test case. These expectations are relative to the "referenceData.js" data used to construct the API requests. 


const requestBodies = {

  iterationSetup: {


    acl_labelOnly: 
      [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"}],
    acl_StigOnly: 
      [{"benchmarkId":"VPN_SRG_TEST","access":"rw"}],
    acl_oldRestrictedStyle: 
     [{"benchmarkId":"VPN_SRG_TEST","assetId":"42","access":"rw"},{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"rw"}],
     acl_labelPlusRestricted: 
      [{"benchmarkId":"VPN_SRG_TEST","assetId":"42","access":"rw"},{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"rw"},{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"}],
    acl_labelStig: 
      [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"},{"benchmarkId":"Windows_10_STIG_TEST","access":"rw"}],
    acl_labelAsset: 
      [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"},{"assetId":"154","access":"rw"}],
    acl_labelMinusRestricted: 
      [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"},{"benchmarkId":"Windows_10_STIG_TEST","assetId":"42","access":"none"},{"benchmarkId":"Windows_10_STIG_TEST","assetId":"62","access":"none"}],
    acl_labelMinusStig: 
      [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"},{"benchmarkId":"Windows_10_STIG_TEST","access":"none"}],
    acl_labelMinusAsset: 
      [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"},{"assetId":"154","access":"none"}],
    acl_conflictingStig: 
      [{"benchmarkId":"VPN_SRG_TEST","access":"rw"}, {"benchmarkId":"VPN_SRG_TEST","access":"none"}],
  },

  updateCollection: {
  }
}

module.exports = requestBodies;