const axios = require('axios')
const config = require('../testConfig.json')
const appdata = require('../../form-data-files/appdata.json')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')

const adminToken = config.adminToken

const loadAppData = async () => {
  try {
    const res = await axios.post(
      `${config.baseUrl}/op/appdata?elevate=true`,
      appdata,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (e) {
    console.log(e)
  }
}

const uploadTestStigs = async () => {
    const testFilenames = [
        'U_MS_Windows_10_STIG_V1R23_Manual-xccdf.xml',
        'U_RHEL_7_STIG_V3R0-3_Manual-xccdf.xml',
        'U_VPN_SRG_V1R0_Manual-xccdf.xml',
        'U_VPN_SRG_V1R1_Manual-xccdf-replace.xml',
        'U_VPN_SRG_V1R1_Manual-xccdf.xml',
        'U_VPN_SRG_V2R3_Manual-xccdf-reviewKeyChange.xml',
        'U_VPN_SRG-OTHER_V1R1_Manual-xccdf.xml',
        'U_VPN_SRG-OTHER_V1R1_twoRules-matchingFingerprints.xml'
    ];
    const directoryPath = path.join(__dirname, '../../form-data-files/');

    for (const filename of testFilenames) {
        const formData = new FormData();
        const filePath = path.join(directoryPath, filename);
        formData.append('importFile', fs.createReadStream(filePath), {
            filename,
            contentType: 'text/xml'  
        });

        const axiosConfig = {
            method: 'post',
            url: `${config.baseUrl}/stigs?clobber=true`,
            headers: {
                ...formData.getHeaders(),
                Authorization: `Bearer ${adminToken}`
            },
            data: formData
        };

        try {
            const response = await axios(axiosConfig);
        } catch (error) {
            console.error(`Failed to upload ${filename}:`, error);
        }
    }
};
module.exports = {
  loadAppData,
  uploadTestStigs
}
