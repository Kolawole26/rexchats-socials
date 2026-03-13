---
title: How-to Guides for the Examples Feature
description: Step-by-step practical guides for working with the Examples feature.
---

# How-to: Examples Feature

This document contains problem-oriented, step-by-step guides to help you perform specific tasks or solve specific problems within the Examples feature.

## How to add a new Example component

If you need to create a new UI component for the Examples feature, follow these steps:

1. Navigate to the `components/examples/` directory.
2. Create a new Vue component file, e.g., `ExampleCard.vue`.
3. Use the `<script setup>` syntax and define your props clearly:
   ```vue
   <script setup lang="ts">
   defineProps<{
     title: string;
     description: string;
   }>()
   </script>
   ```
4. Define your template using Tailwind CSS utility classes matching the project's design system (`assets/css/colors.css`).

## How to fetch Examples data from the API

To fetch data regarding examples, utilize the dedicated composable to ensure consistency:

1. Import the composable in your page or container component:
   ```ts
   import { useExamples } from '~/composables/useExamples'
   ```
2. Call the fetch method provided by the composable:
   ```ts
   const { examples, fetchExamples, pending, error } = useExamples()
   
   // Fetch on mount
   await useAsyncData('examples-list', () => fetchExamples())
   ```
3. Use the `pending` or `error` state to conditionally render UI feedback (e.g., loading spinners or error messages).

## How to update the Examples State in Pinia

When you perform mutations (like creating or deleting an example), you should update the store:

1. Import the store:
   ```ts
   import { useExampleStore } from '~/stores/examples'
   const exampleStore = useExampleStore()
   ```
2. Call the appropriate action instead of mutating state directly:
   ```ts
   const handleCreate = async (payload) => {
     await exampleStore.addExample(payload)
   }
   ```
