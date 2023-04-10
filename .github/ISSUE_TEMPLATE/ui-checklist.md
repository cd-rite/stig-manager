---
name: UI Checklist
about: Describe this issue template's purpose here.
title: UI Checklist Results
labels: ''
assignees: cd-rite

---

This checklist is intended to be used to help verify all UI components are working as expected.  If an issue in the UI is discovered, please specify reproduction steps and screenshots if possible in the text area below the checklist. 
If no Issues are discovered, you do not need to create this issue, or, if you do, you may close it immediately.

UI Component checklist:

### INIT
- [ ] Initial UI Load
- [ ] Redirect to Keycloak
- [ ] Redirect back to web client
- [ ] Home Tab shows expected Version
### Load
- [ ] Navtree loads App Management Nodes (If user is an App Manager)
- [ ] Navtree loads with assigned Collection Nodes
- [ ] Navtree loads STIG Library Nodes
- [ ] Navtree loads UI Preferences Node
### App Management
- [ ] Collections displays expected data
- [ ] User Grants displays expected data
- [ ] STIG Benchmarks Displays expected STIGs/Revisions
  - [ ] New STIGs import succeeds
    - [ ] Replace/preserve STIG works as expected
  - [ ] Delete of STIG Revision succeeds
  - [ ] Dbl-click Jump to Library succeeds
- [ ] Application info displays as expected  
### Collection Dashboard
- [ ] Collection Dashboard opens as expected
  - [ ] Clicking "gear" icon jumps to Collection Manage interface
- [ ] Metrics sanity check
- [ ] Selecting "Shield" icon or double-click a STIG in STIG tab jumps to Collection Review
- [ ]  Selecting "Shield" icon or double-click of an Asset in STIG tab jumps to Asset Review
- [ ]  Selecting "Shield" icon on a STIG in the Asset tab jumps to Asset Review
### Asset Review
- [ ] Display of Checklist, Rule Info, Review Resources, and Review Evaluation Panel
- [ ] Successful Save, Filter, etc.
### Collection Review
- [ ]  Display of Aggregated Checklist, Rule Info, Review Resources, and Review Evaluation Panel
- [ ] Individual Asset in-line editing, status buttons, work as expected.
### Findings Workspace
- [ ] Displays expected Findings/Assets
### Collection Management
- [ ] Settings
- [ ] User Grants
- [ ] etc.

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
