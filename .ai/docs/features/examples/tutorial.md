---
title: Tutorial for the Examples Feature
description: A learning-oriented tutorial to implement an Example component from scratch.
---

# Tutorial: Working With The Examples Feature

This tutorial will guide you step-by-step through setting up, displaying, and interacting with the Examples feature from a clean Nuxt page. By the end, you'll have a working UI page rendering example items retrieved from the store.

## Prerequisites
- Familiarity with Nuxt 3 routing.
- Familiarity with the Pinia store syntax.
- Basic understanding of Vue 3 Composition API `<script setup>`.

## Step 1: Create the Page Route

First, create a new router page that will host our examples layout.

1. Navigate to the `pages/` directory.
2. Create a new file called `examples-demo.vue`.
3. Scaffold the basic structure:
   ```vue
   <template>
     <div class="p-8">
       <h1 class="text-2xl font-bold mb-6">Examples Demo Page</h1>
     </div>
   </template>
   
   <script setup lang="ts">
   // Logic goes here
   </script>
   ```

## Step 2: Initialize Data Fetching

Now, let's load our examples data using the `useExamples` composable.

1. Import the composable inside your `<script setup>` tag:
   ```ts
   import { useExamples } from '~/composables/useExamples'
   ```
2. Call the fetch method. To ensure it runs on the server side correctly and prevents hydration mismatches, wrap your call in Nuxt's `useAsyncData`:
   ```ts
   const { examples, fetchExamples, pending, error } = useExamples()
   
   await useAsyncData('examples-fetch', () => fetchExamples())
   ```

## Step 3: Render the List Using Core UI Components

With the data loaded, render each example inside a loop.

1. Import the list view component, or iterate directly with `ExampleCard`:
   ```vue
   <template>
     <div class="p-8">
       <h1 class="text-2xl font-bold mb-6">Examples Demo Page</h1>
       
       <div v-if="pending">Loading examples...</div>
       <div v-else-if="error">Encountered an error: {{ error.message }}</div>
       
       <!-- Grid loop -->
       <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <ExampleCard 
           v-for="example in examples" 
           :key="example.id" 
           :example="example"
         />
       </div>
     </div>
   </template>
   ```

## Step 4: Add Interactivity

Let's allow users to interact with the list by creating simple event listeners.
1. The `ExampleCard` emits a `@remove` event.
2. Bind to it directly in the template:
   ```vue
   <ExampleCard 
     v-for="example in examples" 
     :key="example.id" 
     :example="example"
     @remove="handleRemove"
   />
   ```
3. Add the removal logic in the `<script setup>` block:
   ```ts
   const { deleteExample } = useExamples()
   
   const handleRemove = async (id: string) => {
     await deleteExample(id)
   }
   ```

## Conclusion

You have successfully created a new route and linked it to the Examples feature data store. You learned how to fetch state asynchronously with Nuxt, render UI components dynamically into a grid, and attach handlers to emit events.
