---
name: state-management
description: Rules and patterns for managing state across components and stores in Nuxt 3.
---

# State Management Skill

This project relies on a strong separation between local UI state and global application state. Global state management should be handled gracefully while avoiding unnecessary bloat for UI-only variables.

## Rules & Best Practices
1. **Local State First**: Use Vue's `ref()` or `reactive()` for component-specific UI state (e.g., modal visibility, form input values, local loading states). Do not pollute global stores with UI toggles.
2. **Global State**: Use Nuxt 3's `useState()` for shared state across components that doesn't require complex actions (e.g., active theme, simple user preferences). Use **Pinia** if complex actions, getters, or persistence are required (e.g., User Authentication Session, Cart Data).
3. **User Information in Pinia**: **Always** use a Pinia store to store user information that will be needed in the future. This should be populated when integrating with APIs (e.g., after login or fetching a user profile).
4. **Composables for Logic**: Abstract reusable business logic into the `composables/` directory rather than injecting massive methods directly into components or stores.
5. **Data Passing**: Pass data downwards via Props (`defineProps`) and upwards via Events (`defineEmits`) when parent-child relationships exist. Only reach into a global store or shared composable if the components are completely decoupled or deeply nested (avoid prop drilling).

## Implementation Example

```vue
<!-- components/LocalCounter.vue -->
<template>
  <div>
    <!-- Using Local State -->
    <p>Local Count: {{ localCount }}</p>
    <CommonButton @click="incrementLocal" title="Add Local" />

    <!-- Using Global State via Composable -->
    <p>Global User: {{ userProfile?.name }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// Example composable holding global state access
import { useAuthStore } from '~/composables/useAuth' 

// Local UI state
const localCount = ref(0)
const incrementLocal = () => localCount.value++

// Global Data
const { userProfile } = useAuthStore()
</script>
```
