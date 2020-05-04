module.exports.parseCklCamaro = async function (cklData) {
  const { transform } = require('camaro')
  try {
    const resultMap = {
      NotAFinding: 'pass',
      Open: 'fail',
      NotApplicable: 'notapplicable',
      Not_Reviewed: 'notchecked'
    }
    const template = {
      hostname: '/CHECKLIST/ASSET/HOST_NAME',
      fqdn: '/CHECKLIST/ASSET/HOST_FQDN',
      ip: '/CHECKLIST/ASSET/HOST_IP',
      mac: '/CHECKLIST/ASSET/HOST_MAC',
      results: ['//iSTIG/VULN', {
        ruleId: 'STIG_DATA/VULN_ATTRIBUTE[text() = "Rule_ID"]/../ATTRIBUTE_DATA',
        result: 'STATUS',
        details: 'FINDING_DETAIS',
        comments: 'COMMENTS'
      }]
    }

    hrstart = process.hrtime() 
    let camaro = await transform(cklData.toString(), template)
    for (let x=0, l=camaro.results.length; x < l; x++) {
      let result = camaro.results[x]
      result.result = resultMap[result.result] || 'unknown'
      result.details = result.details == "" ? null : result.details
      result.comments = result.comments == "" ? null : result.comments

    }
    hrend = process.hrtime(hrstart)
    console.info('camaro execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)

    return (camaro)
  }
  catch (e) {
    throw (e)
  }
}

module.exports.parseCkl = async function (cklData) {
  const fastparser = require('fast-xml-parser')

  function processAsset(assetElement) {
    return {
      hostname: assetElement.HOST_NAME,
      fqdn: assetElement.HOST_FQDN,
      ip: assetElement.HOST_IP,
      mac: assetElement.HOST_MAC,
    }
  }

  function processIStig(iStigElement) {
    let resultArray = []
    iStigElement.forEach(iStig => {
      let vulns = processVuln(iStig.VULN)
      resultArray.splice(-1, 0, ...vulns)
    })
    return resultArray
  }

  function processSiData(siDataElements) {
    let stigInfo = {}
    siDataElements.forEach(siData => {
      if (siData.SID_NAME[0] == 'stigid') {
        stigInfo.stigId = siData.SID_DATA[0]
      }
      if (siData.SID_NAME[0] == 'releaseinfo') {
        stigInfo.release = siData.SID_DATA[0]
      }
    })
    return stigInfo
  }

  function processVuln(vulnElements) {
    // elVuln is an array of this object, all property values are arrays:
    // {
    //     COMMENTS [1]
    //     FINDING_DETAILS [1]
    //     SEVERITY_JUSTIFICATION [1]
    //     SEVERITY_OVERRIDE [1]
    //     STATUS [1]
    //     STIG_DATA [26]
    // }

    const status2Xccdf = {
      NotAFinding: 'pass',
      Open: 'fail',
      NotApplicable: 'notapplicable',
      Not_Reviewed: 'notchecked'
    }
    let vulnArray = []
    vulnElements.forEach(vuln => {
      let finding = {
        cklFindingDetail: vuln.FINDING_DETAILS,
        cklComment: vuln.COMMENTS
      }
      finding.status = status2Xccdf[vuln.STATUS] || 'unknown'
      // Array.some() stops once a true value is returned
      vuln.STIG_DATA.some(stigDatum => {
        if (stigDatum.VULN_ATTRIBUTE == "Rule_ID") {
          finding.ruleId = stigDatum.ATTRIBUTE_DATA
          return true
        }
      })
      vulnArray.push(finding)
    })
    return vulnArray
  }

  try {  
    var fastparseOptions = {
      attributeNamePrefix: "",
      ignoreAttributes: false,
      ignoreNameSpace: true,
      allowBooleanAttributes: false,
      parseNodeValue: true,
      parseAttributeValue: true,
      trimValues: true,
      cdataTagName: "__cdata", //default is 'false'
      cdataPositionChar: "\\c",
      localeRange: "", //To support non english character in tag/attribute values.
      parseTrueNumberOnly: false,
      arrayMode: true, //"strict"
    }
    hrstart = process.hrtime() 
    let parsed = fastparser.parse(cklData.toString(), fastparseOptions)
    hrend = process.hrtime(hrstart)
    console.info('fast-xml-parser execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)

    hrstart = process.hrtime() 
    if (!parsed.CHECKLIST) throw (new Error("No CHECKLIST element"))
    if (!parsed.CHECKLIST[0].ASSET) throw (new Error("No ASSET element"))
    if (!parsed.CHECKLIST[0].STIGS) throw (new Error("No STIGS element"))
    let asset = processAsset(parsed.CHECKLIST[0].ASSET[0])
    asset.results = processIStig(parsed.CHECKLIST[0].STIGS[0].iSTIG)
    hrend = process.hrtime(hrstart)
    console.info('construction execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)

    return (asset)
  }
  catch (e) {
    throw (e)
  }
}

module.exports.parseScc = function (sccFileContent) {
  const parser = require('fast-xml-parser')
  const { transform } = require('camaro')
  try {
    // Parse the XML
    var parseOptions = {
      attributeNamePrefix: "",
      // attrNodeName: "attr", //default is 'false'
      // textNodeName : "#text",
      ignoreAttributes: false,
      ignoreNameSpace: true,
      allowBooleanAttributes: false,
      parseNodeValue: true,
      parseAttributeValue: true,
      trimValues: true,
      cdataTagName: "__cdata", //default is 'false'
      cdataPositionChar: "\\c",
      localeRange: "", //To support non english character in tag/attribute values.
      parseTrueNumberOnly: false,
      arrayMode: false, //"strict"
      // attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
      // tagValueProcessor : (val, tagName) => he.decode(val), //default is a=>a
      // stopNodes: ["parse-me-as-string"]
    }
    let parsed = parser.parse(sccFileContent, parseOptions)

    // Baic sanity checks
    if (!parsed.Benchmark) throw (new Error("No <Benchmark> element"))
    if (!parsed.Benchmark.TestResult) throw (new Error("No <TestResult> element"))
    if (!parsed.Benchmark.TestResult['target-facts']) throw (new Error("No <target-facts> element"))
    if (!parsed.Benchmark.TestResult['rule-result']) throw (new Error("No <rule-result> element"))

    // Process parsed data
    let target = processTargetFacts(parsed.Benchmark.TestResult['target-facts'].fact)
    let results = processRuleResults(parsed.Benchmark.TestResult['rule-result'])

    // Return object
    return ({
      target: target,
      results: results
    })
  }
  catch (e) {
    throw (e)
  }

  function processRuleResults(ruleResults) {
    let results = []
    ruleResults.forEach(ruleResult => {
      results.push({
        ruleId: ruleResult.idref.replace('xccdf_mil.disa.stig_rule_', ''),
        result: ruleResult.result,
        xccdfTime: ruleResult.time,
        xccdfCheckRef: ruleResult.check['check-content-ref'].href.replace('#scap_mil.disa.stig_comp_', '')
      })
    })
    return results
  }

  function processTargetFacts(facts) {
    let target = {}
    facts.forEach(fact => {
      let name = fact.name.replace('urn:scap:fact:asset:identifier:', '')
      target[name] = fact['#text']
    })
    return target
  }
}

module.exports.reviewsFromCkl = async function (cklData, assetId) {
  const fastparser = require('fast-xml-parser')

  try {  
    var fastparseOptions = {
      attributeNamePrefix: "",
      ignoreAttributes: false,
      ignoreNameSpace: true,
      allowBooleanAttributes: false,
      parseNodeValue: true,
      parseAttributeValue: true,
      trimValues: true,
      cdataTagName: "__cdata", //default is 'false'
      cdataPositionChar: "\\c",
      localeRange: "", //To support non english character in tag/attribute values.
      parseTrueNumberOnly: false,
      arrayMode: true, //"strict"
    }
    hrstart = process.hrtime() 
    let parsed = fastparser.parse(cklData.toString(), fastparseOptions)
    hrend = process.hrtime(hrstart)
    console.info('fast-xml-parser execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)

    hrstart = process.hrtime() 
    if (!parsed.CHECKLIST) throw (new Error("No CHECKLIST element"))
    if (!parsed.CHECKLIST[0].ASSET) throw (new Error("No ASSET element"))
    if (!parsed.CHECKLIST[0].STIGS) throw (new Error("No STIGS element"))

    let returnObj = {}
    returnObj.target = processAsset(parsed.CHECKLIST[0].ASSET[0])
    returnObj.reviews = processIStig(parsed.CHECKLIST[0].STIGS[0].iSTIG)
    hrend = process.hrtime(hrstart)
    console.info('construction execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)

    return (returnObj)

    function processAsset(assetElement) {
      return {
        hostname: assetElement.HOST_NAME,
        fqdn: assetElement.HOST_FQDN,
        ip: assetElement.HOST_IP,
        mac: assetElement.HOST_MAC,
      }
    }
  
    function processIStig(iStigElement) {
      let resultArray = []
      iStigElement.forEach(iStig => {
        let vulns = processVuln(iStig.VULN)
        resultArray.splice(-1, 0, ...vulns)
      })
      return resultArray
    }
  
    function processVuln(vulnElements) {
      // vulnElements is an array of this object:
      // {
      //     COMMENTS
      //     FINDING_DETAILS
      //     SEVERITY_JUSTIFICATION
      //     SEVERITY_OVERRIDE
      //     STATUS
      //     STIG_DATA [26]
      // }
  
      const states = {
        NotAFinding: 'NF',
        Open: 'O',
        NotApplicable: 'NA'
      }
      let vulnArray = []
      vulnElements.forEach(vuln => {
        const state = states[vuln.STATUS]
        // Skip unreviewed
        if (state) {
          let ruleId, action
          // Array.some() stops once a true value is returned
          vuln.STIG_DATA.some(stigDatum => {
            if (stigDatum.VULN_ATTRIBUTE == "Rule_ID") {
              ruleId = stigDatum.ATTRIBUTE_DATA
              return true
            }
          })
          if (state == 'O') {
            action = "Remediate"
            if (vuln.COMMENTS.startsWith("Mitigate:")) {
              action = "Mitigate"
            } 
            else if (vuln.COMMENTS.startsWith("Mitigate:")) {
              action = "Exception "
            } 
          }
          else {
            action = null
          }
          vulnArray.push({
            assetId: assetId,
            ruleId: ruleId,
            state: state,
            stateComment: vuln.FINDING_DETAILS == "" ? "Imported from STIG Viewer." : vuln.FINDING_DETAILS,
            action: action,
            actionComment: action ? (vuln.COMMENTS == "" ? null : vuln.COMMENTS) : null,
            autoState: false,
            status: state != 'O' ? 'submitted' : 'saved'
          })
        }
      })
  
      return vulnArray
    }  
  }
  catch (e) {
    throw (e)
  }
}

module.exports.benchmarkFromXccdf = function (xccdfData) {
  const Parser = require('fast-xml-parser')
  const he = require('he')
  try {
    let hrstart = process.hrtime() 
  
    let fastparseOptions = {
      attributeNamePrefix: "",
      textNodeName: "_",
      ignoreAttributes: false,
      ignoreNameSpace: true,
      allowBooleanAttributes: false,
      parseNodeValue: false,
      parseAttributeValue: false,
      trimValues: true,
      cdataTagName: "__cdata", //default is 'false'
      cdataPositionChar: "\\c",
      localeRange: "", //To support non english character in tag/attribute values.
      parseTrueNumberOnly: false,
      arrayMode: true, //"strict"
      attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),
      tagValueProcessor: (val, tagName) => he.decode(val)
    }

    let j = Parser.parse(xccdfData.toString(), fastparseOptions)
    if (!j.Benchmark) { throw new Error("Invalid STIG format. No Benchmark element found.") }
    let bIn = j.Benchmark[0]
    let groups = bIn.Group.map(group => {
      let rules = group.Rule.map(rule => {
        let checks = rule.check.map(check => ({
          checkId: check.system,
          content: check['check-content']
        }))
        let fixes = rule.fixtext.map(fix => ({
          fixId: fix.fixref,
          text: fix._
        }))
        let idents = rule.ident ? rule.ident.map(ident => ({
          ident: ident._,
          system: ident.system
        })) : []

        // The description element is often not well-formed XML, so we fallback on extracting content between expected tags
        function parseRuleDescription (d) {
          let parsed = {}
          let propMap = {
            vulnDiscussion: 'VulnDiscussion',
            falsePositives: 'FalsePositives',
            falseNegatives: 'FalseNegatives',
            documentable: 'Documentable',
            mitigations: 'Mitigations',
            severityOverrideGuidance: 'SeverityOverrideGuidance',
            potentialImpacts: 'PotentialImpacts',
            thirdPartyTools: 'ThirdPartyTools',
            mitigationControl: 'MitigationControl',
            responsibility: 'Responsibility',
            iacontrols: 'IAControls'
          }

          for (const prop in propMap) {
            let re = new RegExp(`<${propMap[prop]}>([\\s\\S]*)</${propMap[prop]}>`)
            let result = re.exec(d)
            parsed[propMap[prop]] = result && result.length > 1 ? result[1] : null
          }
          
          if (parsed.Responsibility) {
            parsed.Responsibility = parsed.Responsibility.replace(/<\/Responsibility><Responsibility/g, ', ')
          }
          return parsed
        }

        let desc = parseRuleDescription(rule.description)

        return {
          ruleId: rule.id,
          version: rule.version || null,
          title: rule.title || null,
          severity: rule.severity || null,
          weight: rule.weight || null,
          vulnDiscussion: desc.VulnDiscussion || null,
          falsePositives: desc.FalsePositives || null,
          falseNegatives: desc.FalseNegatives || null,
          documentable: desc.Documentable || null,
          mitigations: desc.Mitigations || null,
          severityOverrideGuidance: desc.SeverityOverrideGuidance || null,
          potentialImpacts: desc.PotentialImpacts || null,
          thirdPartyTools: desc.ThirdPartyTools || null,
          mitigationControl: desc.MitigationControl || null,
          responsibility: desc.Responsibility || null,
          iacontrols: desc.IAControls || null,
          checks: checks,
          fixes: fixes,
          idents: idents
        }
      })
      let desc = Parser.parse(group.description, fastparseOptions)



      return {
        groupId: group.id,
        title: group.title || null,
        description: desc.GroupDescription || null,
        rules: rules
      }
    })
    let [reArray, release, benchmarkDate] = /Release:\s+(\S+)\s+Benchmark Date:\s+(.*)/g.exec(bIn['plain-text'][0]._)
    let hrend = process.hrtime(hrstart)
    console.info(bIn.id + ' execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)

    return {
      benchmarkId: bIn.id,
      title: bIn.title,
      revision: {
        revisionStr: `V${bIn.version}R${release}`,
        version: bIn.version,
        release: release,
        benchmarkDate: benchmarkDate,
        benchmarkDate8601: benchmarkDateTo8601(benchmarkDate),
        status: bIn.status[0]._ || null,
        statusDate: bIn.status[0].date || null,
        description: bIn.description || null,
        // profiles: bIn.Profile,
        groups: groups
      }
    }
  }
  catch (e) {
    throw (e)
  }

  function benchmarkDateTo8601(benchmarkDate) {
    monthToNum = {
      'Jan': '01',
      'January': '01',
      'Feb': '02',
      'February': '02',
      'Mar': '03',
      'March': '03',
      'Apr': '04',
      'April': '04',
      'May': '05',
      'Jun': '06',
      'June': '06',
      'Jul': '07',
      'July': '07',
      'Aug': '08',
      'August': '08',
      'Sep': '09',
      'September': '09',
      'Oct': '10',
      'October': '10',
      'Nov': '11',
      'November': '11',
      'Dec': '12',
      'December': '12'
    };
    let [day, monStr, year] = benchmarkDate.split(/\s+/);
    // return sprintf("%04d-%02d-%02d",year,monthToNum[monStr],day);
    return `${year}-${monthToNum[monStr]}-${day}`
  }
}


module.exports.reviewsFromScc = function (sccFileContent, assetId) {
  const parser = require('fast-xml-parser')
  try {
    // Parse the XML
    var parseOptions = {
      attributeNamePrefix: "",
      ignoreAttributes: false,
      ignoreNameSpace: true,
      allowBooleanAttributes: false,
      parseNodeValue: true,
      parseAttributeValue: true,
      trimValues: true,
      cdataTagName: "__cdata", //default is 'false'
      cdataPositionChar: "\\c",
      localeRange: "", //To support non english character in tag/attribute values.
      parseTrueNumberOnly: false,
      arrayMode: false //"strict"
    }
    let parsed = parser.parse(sccFileContent.toString(), parseOptions)

    // Baic sanity checks
    if (!parsed.Benchmark) throw (new Error("No <Benchmark> element"))
    if (!parsed.Benchmark.TestResult) throw (new Error("No <TestResult> element"))
    if (!parsed.Benchmark.TestResult['target-facts']) throw (new Error("No <target-facts> element"))
    if (!parsed.Benchmark.TestResult['rule-result']) throw (new Error("No <rule-result> element"))

    // Process parsed data
    let target = processTargetFacts(parsed.Benchmark.TestResult['target-facts'].fact)
    let reviews = processRuleResults(parsed.Benchmark.TestResult['rule-result'])

    // Return object
    return ({
      target: target,
      reviews: reviews
    })
  }
  catch (e) {
    throw (e)
  }


  function processRuleResults(ruleResults) {
    const states = {
      pass: 'NF',
      fail: 'O',
      notapplicable: 'NA'
    }
    let reviews = []
    
    ruleResults.forEach(ruleResult => {
      state = states[ruleResult.result]
      if (state) {
        reviews.push({
          assetId: assetId,
          ruleId: ruleResult.idref.replace('xccdf_mil.disa.stig_rule_', ''),
          state: state,
          stateComment: `SCC Reviewed at ${ruleResult.time} using:\n${ruleResult.check['check-content-ref'].href.replace('#scap_mil.disa.stig_comp_', '')}`,
          autoState: true,
          status: state != 'O' ? 'approved' : 'saved'
        })
      }
    })
    return reviews
  }

  function processTargetFacts(facts) {
    let target = {}
    facts.forEach(fact => {
      let name = fact.name.replace('urn:scap:fact:asset:identifier:', '')
      target[name] = fact['#text']
    })
    return target
  }
}
  