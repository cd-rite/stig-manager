const mocha = require('mocha');
const Base = mocha.reporters.Base;

class CustomReporter extends Base {
  constructor(runner) {
    super(runner);

    runner.on('end', () => {
      const durationInMs = this.stats.duration;
      const minutes = Math.floor(durationInMs / 60000);
      const seconds = ((durationInMs % 60000) / 1000).toFixed(2);

      console.log(`\nTest duration: ${minutes} minutes ${seconds} seconds`);
    });
  }
}

module.exports = CustomReporter;
