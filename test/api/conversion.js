const fs = require('fs');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const config = require('./mocha/testConfig.json'); // Add your config file here

// Helper function to parse Postman request and generate Chai HTTP test
const generateChaiTest = (request, description) => {
  const { method, url, auth, body, header } = request;
  const urlString = `${url.raw.replace('{{baseUrl}}', config.baseUrl)}`;

  let authHeader = '';
  if (auth && auth.bearer) {
    authHeader = `Bearer ${auth.bearer[0].value.replace('{{token.stigmanadmin}}', config.token)}`;
  }

  let requestBody = '';
  if (body && body.raw) {
    requestBody = JSON.parse(body.raw);
  }

  const headers = {};
  if (header) {
    header.forEach(({ key, value }) => {
      headers[key] = value;
    });
  }

  return `
describe('${description}', () => {
  it('${method} ${urlString}', async () => {
    const res = await chai.request(config.baseUrl)
      .${method.toLowerCase()}('${urlString}')
      .set('Authorization', '${authHeader}')
      .set(${JSON.stringify(headers)})
      .send(${JSON.stringify(requestBody)});
    
    expect(res).to.have.status(${authHeader.includes('stigmanadmin') ? 200 : 403});
  });
});`;
};

// Function to parse Postman JSON and generate Chai HTTP tests
const convertPostmanToChai = (postmanJson) => {
  let chaiTests = '';
  const parseItem = (items, parentDescription = '') => {
    items.forEach(({ name, item: subItems, request }) => {
      const description = parentDescription ? `${parentDescription} - ${name}` : name;
      if (request) {
        chaiTests += generateChaiTest(request, description);
      }
      if (subItems) {
        parseItem(subItems, description);
      }
    });
  };

  parseItem(postmanJson.item);
  return chaiTests;
};

// Load Postman JSON
const postmanJson = JSON.parse(fs.readFileSync('./test.json', 'utf-8'));

// Convert to Chai HTTP tests
const chaiTests = convertPostmanToChai(postmanJson);

// Write the tests to a file
fs.writeFileSync('./generatedTests.js', chaiTests);

console.log('Chai tests generated successfully!');
