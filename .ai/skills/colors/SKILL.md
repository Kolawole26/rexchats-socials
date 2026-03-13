---
name: colors
description: Standardization for CSS variable color mappings across light and dark modes.
---

# Colors Skill

This project utilizes a robust design system with predefined CSS variables in `assets/css/colors.css`. Tailwind CSS has been configured to read these variables automatically under the `general` namespace.

## Rules & Best Practices
1. **Never use raw Hex or RGB values**: E.g., never use `bg-[#121212]` or `text-blue-500`.
2. **Always Reference `colors.css` via Tailwind Config**: Use semantic naming exactly as defined in the Figma designs, mapped through `tailwind.config.js`.
3. **Dark Mode Syntax**: Ensure your Tailwind classes handle dark mode by utilizing the `dark:` prefix alongside the CSS variable map.
4. **Primary vs. Background**: `general-primary` typically denotes the standard text color (black in light mode, white in dark mode), while `general-background` or `general-surface` is for wrapper components.
5. **Figma Colors Extraction**: When generating colors from the Figma design system, do not change the variable names in `assets/css/colors.css`. Only update the color codes so each existing variable name remains the same.

## Implementation Example

```vue
<template>
  <!-- Correct usage of background and text colors -->
  <div class="bg-general-background-light dark:bg-general-background-dark">
    
    <!-- Using semantic names for primary text -->
    <h1 class="text-general-primary-light dark:text-general-primary-dark">
      Heading Title
    </h1>
    
    <!-- Using lines and secondary colors -->
    <div class="border border-general-line-light dark:border-general-line-dark">
      <p class="text-general-secondary-light dark:text-general-secondary-dark">
        Descriptive paragraph text here...
      </p>
    </div>
    
  </div>
</template>
```
