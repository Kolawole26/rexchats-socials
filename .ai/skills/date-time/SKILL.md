---
name: date-time
description: Standardized formatting for dates and times across the application.
---

# Date & Time Skill

Handling dates and times consistently is critical for data tables, transaction histories, and user profiles. We rely on standard libraries (like `moment.js` or `dayjs`) to ensure formats never mismatch.

## Rules & Best Practices
1. **Standardized Formats**: 
   - **Full Date**: ALWAYS use `"MMM DD, YYYY"` (e.g., "Oct 24, 2023").
   - **Time**: ALWAYS use `"h:mm A"` (e.g., "4:30 PM").
   - **API Payloads**: ALWAYS format query parameters (like `fromDate`) as `"YYYY-MM-DD"` (e.g., "2023-10-24") before sending to the backend.
2. **Validation**: Always check if a date string is valid before attempting to format it to prevent `Invalid Date` rendering in the UI. Fallback to `"Not available"` or an empty string.
3. **Timezones**: Unless explicitly requested by the feature, render the date in the user's local timezone (the default behavior of standard date formatters).

## Implementation Example

```vue
<template>
  <div>
    <!-- Safely formatting a date in the template -->
    <p class="body-regular">
      {{ formatDate(transaction.created_at) }}
    </p>
    
    <!-- Safely formatting time -->
    <p class="body-xsmall text-general-secondary-light">
      {{ formatTime(transaction.created_at) }}
    </p>
  </div>
</template>

<script setup>
import moment from 'moment'

// Assuming this data comes from a prop or API
const transaction = {
  created_at: '2023-10-24T16:30:00Z'
}

// Reusable formatting helpers (consider moving to a composable or utils file)
const formatDate = (dateString) => {
  if (!dateString) return 'Not available'
  return moment(dateString).format('MMM DD, YYYY')
}

const formatTime = (dateString) => {
  if (!dateString) return 'Not available'
  return moment(dateString).format('h:mm A')
}

// Example: Formatting for API payload
const prepareApiQuery = (rawDate) => {
  return rawDate ? moment(rawDate).format('YYYY-MM-DD') : null
}
</script>
```
