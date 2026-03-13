---
name: seo-metadata
description: Guidelines for managing page titles, descriptions, and OpenGraph data.
---

# SEO & Metadata Skill

Proper SEO and metadata implementation ensure the application is correctly indexed by search engines and looks professional when shared on social media platforms.

## Rules & Best Practices
1. **Always Title Pages**: Every page component in the `pages/` directory MUST define a `<Title>` or utilize the `useHead()` / `useSeoMeta()` composables.
2. **Title Format**: Stick to a standardized title format: `Page Name | App Name` (e.g., `Transactions | SnappyPay Admin`).
3. **Use `useSeoMeta` for detail**: When building public-facing pages (like Auth, Marketing, or Landing pages), populate `ogTitle`, `ogDescription`, and `ogImage` to ensure beautiful link previews.
4. **Dynamic Metadata**: If a page shows dynamic content (like a user profile), the metadata should reactively reflect that content.

## Implementation Example

```vue
<template>
  <div>
    <h1>{{ pageTitle }}</h1>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const pageTitle = 'Login'

// Standard SEO implementation
useSeoMeta({
  title: `${pageTitle} | Talynted`,
  description: 'Securely login to your Talynted account to hire or find work.',
  ogTitle: 'Login | Talynted',
  ogDescription: 'Securely login to your Talynted account.',
  ogImage: '/images/og-default.jpg', // Always use absolute paths from the public folder
  twitterCard: 'summary_large_image',
})

// Alternative simple implementation if only the title is needed
// useHead({
//   title: 'Login | Talynted'
// })
</script>
```
