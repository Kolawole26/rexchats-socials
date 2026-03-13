---
name: svg-icons
description: Rules for utilizing SVG icons across the application.
---

# SVG & Icons Skill

This project utilizes a centralized custom icon component (`BaseCustomIcon.vue`) to manage SVG assets. Inline SVG codes or raw `<img>` tags for standard icons and logos should be avoided.

## Rules & Best Practices
1. **Always use `<BaseCustomIcon>`**: For standard UI icons and logos, utilize the base component instead of raw `<img>` tags or embedding inline `<svg>` elements directly into page templates.
2. **Name Prop**: Pass the correct identifier to the `name` prop (e.g., `name="users"`).
3. **Enforce `currentColor`**: When adding an exported SVG to the project (like an icon or logo), ALWAYS open the `.svg` code and replace static hex/rgb color codes (e.g., `fill="#1800AD"`) with `fill="currentColor"` (or `stroke="currentColor"` depending on the design). This allows the SVG to automatically inherit text colors passed via tailwind classes from the parent component.
4. **Styling**: Apply styling (like dimensions and colors) directly to the component using Tailwind classes (e.g., `class="w-[18px] h-[18px] text-primary-300"`). The underlying SVG will inherit this color directly.
5. **Adding New Icons**: If a new icon is needed from Figma, export it as an SVG, optimize it, replace colors with `currentColor`, and add it to the internal dictionary/template logic within `components/base/CustomIcon.vue`.

## Implementation Example

```vue
<template>
  <div class="flex items-center gap-2">
    <!-- Correct Usage: Using the Base Component -->
    <BaseCustomIcon name="users" class="text-neutral-500" />
    <span class="body-small">Users</span>

    <!-- Correct Usage: Logo -->
    <BaseCustomIcon name="logo" />
    
    <!-- INCORRECT: Do not use raw image tags for internal app icons -->
    <!-- <img src="/icons/users.svg" class="w-[18px]" /> -->
  </div>
</template>
```
