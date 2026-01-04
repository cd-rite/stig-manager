# STIG Manager Client V2 - Components

This document outlines the Vue 3 / PrimeVue 4 components needed for the core features of STIG Manager. It serves as a guide for development and tracking.


## Columns and Rows

Columns:
- **AssetColumn**: Displays asset names.
- **CountColumn**: Displays a simple count value. (ie. Asset count)
- **DurationColumn**: Displays duration values in a human-readable format.
- **PercentageColumn**: Displays percentage values.


- **AssetWithLabelsColumn**: Displays asset names along with their associated label on a sub-row.If truncated, adds a "+N" badge with a tooltip showing truncated labels.
- **CountColumnWithTooltip**: Displays a count with a tooltip listing counted items. (ie. STIG IDs, Collections IDs, User Grants, group users, findings: assets)
- **LabelsColumnWithTooltip**: Displays a list of labels associated with an item. (ie. Asset labels, ) If truncated, adds a "+N" badge with a tooltip showing all labels.


Possible additional column types:
- **ListColumnInline**: Displays a list of items in a cell. (stig management:"earlier revisions")
- **ListColumnNewline**: Displays a list of items in a cell. (ie. CCIs; service jobs: "tasks",schedule, last run, findings: stigs)
- **SingleLabelColumn**: Displays a single label in a cell. (label management, metrics labels tab)
- **privilegeColumn**: Displays checkmark if user has privilege 
- **DataWithBadgeColumn**: Displays benchmark name with badge showing classification
- **BadgeColumn**: Displays N items in badges. (stig diff:"changed properties", stig status,)
- **ActionColumn**: Displays action buttons. (ie. history, attachments, edit, delete)

"Status" Columns:
- **ResponseCodeColumn**: Displays status with color coding. (service jobs: ie. 500 = red, 200 = green)
- **resultColumn**: Displays results
- **ResultOriginColumn**: Displays result origin icon (user/engine) with color coding, popover. (stig scan results: ie. manual = blue, automated = green)
- **ReviewStatusColumn**: Displays review status icon


multi-row Columns:
specific:
- **AssetWithLabelsColumn**: Displays asset names along with their associated label on a sub-row. If truncated, adds a "+N" badge with a tooltip showing truncated labels.
generic?:
- **RowAndSubRow**: pattern for displaying additional information related to the main cell content.
  ie.:
  - **labelAndStig** - ACL rule table 
  - **AssetAndStig** - ACL rule table 
  - **usernameAndDisplayname** - grant management (username and display name)
  - **UserWithEmailColumn**: Displays user names along with their email on a sub-row. (grantee)



Rows:
checkbox row
in-line editable row

Expandable:
- **ExpandableReviewRow**:  Review columns plus review detail/Comment/statusUser/statusText in expanded content (review history, findings: individual findings, could also be used for "other assets?")




