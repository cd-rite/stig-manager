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
    },
    createCollection: {
      name: "TEST",
      description: "Collection TEST description",
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
        history: {
          maxReviews: 11,
        },
      },
      metadata: {
        pocName: "poc2Put",
        pocEmail: "pocEmailPut@email.com",
        pocPhone: "12342",
        reqRar: "true",
      },
      grants: [
        {
          userId: "1",
          accessLevel: 4,
        },
      ],
      labels: [
        {
          name: "TEST",
          description: "Collection label description",
          color: "ffffff",
        },
      ],
    }
  
}
module.exports = requestBodies;