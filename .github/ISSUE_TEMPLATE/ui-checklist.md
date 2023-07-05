---
name: UI CHECKLIST
about: Test our UI components
title: 'UI: '
labels: UI
assignees: ''

---

This checklist is intended to be used to help verify all UI components are working as expected.  If an issue in the UI is discovered, please specify reproduction steps and screenshots if possible in the text area below the checklist. 

UI Component checklist:

### INIT
- [ ] Initial UI Load
- [ ] Redirect to Keycloak
- [ ] Redirect back to web client
- [ ] Home Tab shows expected Version
### Load
- [ ] Navtree loads App Management Nodes (If user is an App Manager)
- [ ] Navtree loads Create Collection...  (If user is an Collection Creator)
- [ ] Navtree loads with assigned Collection Nodes
- [ ] Navtree loads STIG Library Nodes
- [ ] Navtree loads UI Preferences Node
### App Management
- [ ] Collections displays expected data
  - [ ] New Collection interface opens as expected
  - [ ] Delete Collection works as expected
  - [ ] Collection Properties interface opens as expected
      - [ ] Open with menu button
      - [ ] Open with dbl-click
      - [ ] Change Collection Name succeeds
      - [ ] Change Collection Description succeeds
      - [ ] Change Collection Grants succeeds
    - [ ] Collection data downloads .csv as expected
- [ ] Users Grants displays expected data
    - [ ] Pre-register User interface opens as expected
    - [ ] Unregister User works as expected
    - [ ] Modify User interface opens as expected
      - [ ] Open with menu button
      - [ ] Open with dbl-click
      - [ ] User Last Claims displays as expected
      - [ ] Change User Grant succeeds
      - [ ] Add User Grant succeeds
      - [ ] Delete User Grant succeeds
- [ ] STIG Benchmarks Displays expected STIGs/Revisions/Counts
  - [ ] New STIGs import succeeds
    - [ ] Replace/preserve STIG works as expected
  - [ ] Delete of STIG Revision succeeds
    - [ ] Delete of pinned Revision works as expected
  - [ ] Delete of STIG succeeds
    - [ ] Delete of assigned STIG works as expected
  - [ ] Dbl-click Jump to Library succeeds
- [ ] Application info displays as expected
  - [ ] Download Application data succeeds
  - [ ] Replace Application data succeeds
  - [ ] Anonymized Deployment Details displays as expected
  - [ ] Anonymized Deployment Details JSON Download succeeds

### Collection Dashboard
- [ ] Collection Dashboard opens as expected
- [ ] Collection Dashboard displays expected data
  - [ ] STIGS tab and child Asset panel
  - [ ] Assets tab and child STIG panel
  - [ ] Labels tab and child Assets and STIGs panels
  - [ ] .csv downloads work as expected for all panels
- [ ] Export Metrics downloads aggregations in .csv/JSON as expected
- [ ] Metrics sanity check
  - [ ] Most numbers here checked via Newman
- [ ] Selecting "Shield" icon or double-click a STIG in STIG tab jumps to Collection Review
- [ ]  Selecting "Shield" icon or double-click of an Asset in STIG->Asset panel jumps to Asset Review
- [ ]  Selecting "Shield" icon on a STIG in the Asset->STIG tab jumps to Asset Review
- [ ]  Selecting "Shield" icon or double-click of a STIG in Label->Asset->STIG panel jumps to Asset Review
### Asset Review
- [ ] Display of Checklist, Rule Info, Review Resources, and Review Evaluation Panel
  - [ ] Workspace opened with appropriate Asset and STIG Revision. Latest or Pinned.
  - [ ] Checklist Menu toggles group/rule display appropriately
  - [ ] Export to File works as expected
  - [ ] Import results works as expected
  - [ ] Revisions lists STIG Revisions and indicates pinned Revision if applicable. 
- [ ] Applying Filters successful
- [ ] .csv download works as expected
- [ ] Selecting Rule updates Rule Info, Review Resources, and applicable Review
- [ ] Review Resources displays expected data
  - [ ] "Other Assets"
  - [ ] Attachments
  - [ ] Status text
  - [ ] Review History
- [ ] Evaluation Panel shows expected Review Data
- [ ] Evaluation Panel enforces Collection Review Settings appropriately
### Collection Review
- [ ]  Display of Aggregated Checklist, Rule Info, Review Resources, and Review Evaluation Panel
  - [ ] Workspace opened with appropriate Asset and STIG Revision. Latest or Pinned.
  - [ ] Checklist Menu toggles display appropriately
  - [ ] Export Results works as expected
  - [ ] Revisions lists STIG Revisions and indicates pinned Revision if applicable. 
- [ ] Applying Filters successful
- [ ] Individual Asset in-line editing, status buttons, work as expected.
- [ ] Accept, Reject, Submit, Unsubmit buttons work as expected
  - [ ] Status buttons operate on individual Asset
  - [ ] Status buttons operate on selected Assets
- [ ] Batch Review editing works as expected
- [ ] When individual Asset is selected
  - [ ] Review History displayed appropriately
  - [ ] Review Attachments displayed appropriately
- [ ] .csv downloads work as expected
### Findings Workspace
- [ ] Clicking Details from Findings panel in Dashboard jumps to Collection Findings interface
- [ ] Displays expected Findings/Assets
- [ ] Applying aggregators works as expected
- [ ] Selecting specific STIG displays expected data
- [ ] Applying filters works as expected
- [ ] Selecting Finding updates Assets panel
- [ ] Generate POA&M works as expected
- [ ] .csv downloads work as expected
### Collection Management (Owners and Managers only)
- [ ] From Tree Node, clicking "gear" icon jumps to Collection Manage interface
- [ ] Clicking Manage from Dashboard jumps to Collection Manage interface
- [ ] Displays expected data
- [ ] Change name of Collection
- [ ] Change description of Collection
- [ ] Owner can delete Collection
- [ ] Grants
  - [ ] Lists expected User Grants
  - [ ] New Grant works as expected
  - [ ] Delete Grant works as expected
  - [ ] User Access... works as expected when Restricted User is selected
- [ ] Settings
  - [ ] Collection Settings display appropriately. 
- [ ] Metadata
  - [ ] Displays expected data
  - [ ] New key works as expected
  - [ ] Delete key works as expected
- [ ] Labels
  - [ ] Displays expected Label data
  - [ ] Dbl-clicking label allows Label to be edited
  - [ ] New Label works as expected
  - [ ] Delete Label works as expected
  - [ ] Tag Assets... works as expected
- [ ] Assets Panel displays expected data
  - [ ] Create... works as expected
  - [ ] Import CKL or XCCDF... Opens Import interface
    - [ ] Import interface works as expected
    - [ ] Import interface has Collection Import options pre-selected
    - [ ] Import interface obeys selected import options, if allowed by Collection Settings
    - [ ] One or more files can be selected or dragged in for import
    - [ ] Continue button proceeds to next step
    - [ ] Errors and Warnings displays as appropriate
    - [ ] Interface displays expected results of processed files
    - [ ] Import button works as expected
  - [ ] Delete... works as expected
  - [ ] Modify... works as expected
  - [ ] Dbl-clicking Asset allows Asset to be edited
- [ ] .csv downloads work as expected
### General
- [ ] Column/View filtering works as expected.



If an issue is discovered, please provide reproduction steps and screenshots here:

### Description

[Description of the bug or feature]

### Steps to Reproduce

1. [First Step]
2. [Second Step]
3. [and so on...]

**Expected behavior:** [What you expected to happen]

**Actual behavior:** [What actually happened]

