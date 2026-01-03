# STIG Manager Client V2 - Components

This document outlines the Vue 3 / PrimeVue 4 components needed for the core features of STIG Manager. It serves as a guide for development and tracking.




Columns:
- **AssetColumn**: Displays asset names.
- **CountColumn**: Displays a simple count value. (ie. Asset count)
- **DurationColumn**: Displays duration values in a human-readable format.
- **PercentageColumn**: Displays percentage values.


- **AssetWithLabelsColumn**: Displays asset names along with their associated label on a sub-row.If truncated, adds a "+N" badghe with a tooltip showing truncated labels.
- **CountColumnWithTooltip**: Displays a count with a tooltip listing counted items. (ie. STIG IDs, Collections IDs, User Grants, group users)
- **LabelsColumnWithTooltip**: Displays a list of labels associated with an item. (ie. Asset labels) If truncated, adds a "+N" badghe with a tooltip showing all labels.

- **ListColumn**: Displays a list of items in a cell. (ie. CCIs)