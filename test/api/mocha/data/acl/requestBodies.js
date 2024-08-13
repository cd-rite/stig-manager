//This data contains expected response data that varies by iteration "scenario" or "user" for each test case. These expectations are relative to the "referenceData.js" data used to construct the API requests. 


const requestBodies = {

  iterationSetup: {


    acl_labelOnly: 
      [{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"}],
    acl_StigOnly: 
      [{"benchmarkId":"VPN_SRG_TEST","access":"rw"}],
    acl_oldRestrictedStyle: 
     [{"benchmarkId":"VPN_SRG_TEST","assetId":"42","access":"rw"},{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"rw"}],
    acl_mix: 
      [{"benchmarkId":"VPN_SRG_TEST","assetId":"42","access":"rw"},{"benchmarkId":"VPN_SRG_TEST","assetId":"154","access":"rw"},{"labelId":"755b8a28-9a68-11ec-b1bc-0242ac110002","access":"rw"}]
  },

  updateCollection: {
  }
}
module.exports = requestBodies;