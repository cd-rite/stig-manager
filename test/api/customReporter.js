// const mocha = require('mocha');
// const Base = mocha.reporters.Base;

// class CustomReporter extends Base {
//   constructor(runner) {
//     super(runner);

//     runner.on('end', () => {
//       const durationInMs = this.stats.duration;
//       const minutes = Math.floor(durationInMs / 60000);
//       const seconds = ((durationInMs % 60000) / 1000).toFixed(2);

//       console.log(`\nTest duration: ${minutes} minutes ${seconds} seconds`);
//     });
//   }
// }

// module.exports = CustomReporter;
const Mocha = require('mocha');
const SpecReporter = Mocha.reporters.Spec;
//const Base = Mocha.reporters.Base;

class CustomReporter extends SpecReporter {
  constructor(runner) {
    super(runner)

    const grep = new RegExp(process.env.GREP || '', 'i')
    const userFilter = process.env.USERS ? process.env.USERS.split(',') : [] // gets from USERS=admin
    const methodFilter = process.env.METHOD// Get the method filter from environment variables
    const operationIdFilter = process.env.OPERATION_ID // Get the operationId filter from environment variables

    // Example users array (replace with real data)
    const users = [
      { name: "admin", role: "Owner", token: "admin-token" },
      { name: "lvl1", role: "Restricted", token: "lvl1-token" }
    ]

    let currentSuite = ''
    let httpMethod, operationId, apiPath
    
  

    runner.on('suite', (suite) => {
      // Capture the current describe block (suite)
      currentSuite = suite.title
      const parts = currentSuite.split(' - ')
      httpMethod = parts[0]
      operationId = parts[1]
      apiPath = parts[2]
    })

    runner.on('test', (test) => {
      
      // // Determine if the test should be run based on the criteria
      // const userShouldRun = userFilter.length === 0 || users.some(u => userFilter.includes(u.name))
      // const methodShouldRun = !methodFilter || httpMethod === methodFilter
      // const operationIdShouldRun = !operationIdFilter || operationId === operationIdFilter
      // const pathShouldRun = !apiPath || grep.test(apiPath)
      // const shouldRun = userShouldRun && methodShouldRun && operationIdShouldRun && pathShouldRun

      // if (!shouldRun) {
      //   test.pending = true
      // }  
      
    })
  
    runner.on('end', () => {
      const durationInMs = this.stats.duration;
      const minutes = Math.floor(durationInMs / 60000);
      const seconds = ((durationInMs % 60000) / 1000).toFixed(2);

      console.log(`\nTest duration: ${minutes} minutes ${seconds} seconds`);
    });
  }
}

module.exports = CustomReporter;
