const fs = require('fs');
const { parse } = require('json2csv');

// Load the Postman collection
const postmanJson = JSON.parse(fs.readFileSync('./postman_collection.json', 'utf-8'));

// Function to extract test details (name, method, URL)
const extractTestDetails = (items, parentName = '') => {
  let testDetails = [];

  items.forEach(({ name, item: subItems, request }) => {
    const fullName = parentName ? `${parentName} - ${name}` : name;

    if (request) {
      testDetails.push({
        name: fullName,
        method: request.method,
        url: request.url.raw
      });
    }

    if (subItems) {
      testDetails = testDetails.concat(extractTestDetails(subItems, fullName));
    }
  });

  return testDetails;
};

// Extract test details from the Postman collection
const testDetails = extractTestDetails(postmanJson.item);

// Convert test details to CSV format
const csv = parse(testDetails, { fields: ['name', 'method', 'url'] });

// Save the CSV to a file
fs.writeFileSync('test_details.csv', csv);

console.log('Test details CSV generated successfully!');
