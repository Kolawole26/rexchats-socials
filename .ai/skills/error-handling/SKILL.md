---
name: error-handling
description: Standardization for API error catching and Toast notifications.
---

# Error Handling & Notifications Skill

Consistent error handling ensures users always receive clear, actionable feedback when API requests fail. All toasts are centralized through `composables/toast.js` to prevent duplicates and keep components clean.

## Rules & Best Practices
1. **Never use raw `alert()` or `console.error()`** for user-facing error reporting.
2. **Never use PrimeVue's `useToast` directly**: Use the `useToastHandler` composable from `composables/toast.js` instead. This handles deduplication automatically.
3. **Deduplication**: The `useToastHandler` will suppress duplicate toast messages within a 5-second window automatically. No additional code needed.
4. **Silent Mode**: If a specific page or component should handle its own feedback without toasts, pass `{ silent: true }` when initializing the composable.
5. **Standardized Severity**: Use `showSuccess()`, `showError()`, or `showInfo()` helpers instead of calling `showToast()` directly with severity props.
6. **Clear Error State**: Always reset `isLoading.value = false` inside a `finally` block so the UI never hangs after an error.

## Implementation Example

```vue
<template>
  <div>
    <CommonButton title="Submit" :loading="isLoading" @click="submitData" />
    <!-- A single <Toast /> must exist somewhere in the layout -->
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { showSuccess, showError } = useToastHandler()
// To suppress all toasts on this page:
// const { showSuccess, showError } = useToastHandler({ silent: true })

const { handleError, clearError } = useErrorHandler()
const { sendRequest } = useApiRequest()
const isLoading = ref(false)

const submitData = async () => {
  clearError()
  isLoading.value = true

  try {
    const data = await sendRequest({ method: 'POST', endpoint: 'submit' })
    showSuccess(data.message)
  } catch (err) {
    const { error } = handleError(err)
    showError(error)
  } finally {
    isLoading.value = false
  }
}
</script>
```
