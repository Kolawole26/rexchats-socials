---
name: ui-button
description: Standardization for utilizing the CommonButton component across the application.
---

# UI Button Skill

This project relies on a shared `CommonButton.vue` component to maintain styling and behavioral consistency.

## Rules & Best Practices
1. **STRICT ENFORCEMENT: Always use the Component**: Use `<CommonButton />` instead of raw `<button>` HTML tags. **Never** use raw `<button>` tags anywhere in the project. If you see one during an AI generation task, refactor it immediately.
2. **Icons**: Support for leading or trailing icons is usually implemented using PrimeIcons or explicit props depending on the `CommonButton` setup. Use `<template #icon-left>` or `#icon-right` slots for custom icons like SVG images.
3. **Props over Slots or Classes**: Always use the provided props rather than slot inheritance or Tailwind utility overrides. Specifically, pass the button text with `title="..."`, background with `bgColor="bg-variant"`, and text color with `textColor="..."`. Set `fullWidth` for 100% container sizing.
4. **Loading/Disabled State**: Always bind `:loading="isLoading"` when waiting for an API response to prevent multiple submissions, and show the integrated loader spinner automatically.

## Implementation Example

```vue
<template>
  <div class="flex gap-4">
    <!-- Standard Primary Button -->
    <CommonButton
      title="Save Changes"
      bgColor="bg-primary-300"
      textColor="text-white font-semibold text-sm"
      type="submit"
      fullWidth
    />

    <!-- Secondary/Outline Button -->
    <CommonButton 
      title="Cancel"
      bgColor="bg-neutral-30"
      textColor="text-neutral-500 font-semibold text-sm"
      type="button" 
      @click="cancelAction"
      fullWidth
    />
  </div>
</template>
```
