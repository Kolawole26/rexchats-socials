---
name: typography
description: Standardization for typography sizing, weights, and styles.
---

# Typography Skill

Typography is controlled globally via `assets/css/global.css`. Standard CSS classes map to responsive Tailwind configurations, ensuring consistency across breakpoints for heading and body texts.

## Rules & Best Practices
1. **STRICT ENFORCEMENT: Never use arbitrary font utilities**: Avoid using arbitrary classes like `text-[12px]`, `text-[14px]`, `text-[16px]`, `text-sm`, `text-base` etc. Always use semantic HTML and global classes instead. If you encounter raw `text-[size]` classes, refactor them immediately.
2. **Utilize Global Styles**: The `global.css` automatically styles raw tags like `<h1>`, `<h2>`, and `<h3>`. Use standard semantic HTML where applicable.
3. **Use Utility Classes for Body Text**: If you need standard body text sizes, apply the predefined classes rather than raw tailwind utilities:
   - `.body-large` (18px-20px)
   - `.body-regular` (16px)
   - `.body-small` (14px)
   - `.body-xsmall` (12px)
4. **Labels & Buttons**: Specific UI components have `.label` or `.button` classes applied to standardize font-weight and line-heights.

## Implementation Example

```vue
<template>
  <article>
    <!-- Responsive H1 automatically applied from global.css -->
    <h1>Main Dashboard Title</h1>
    
    <!-- Specific utility class for standard body text -->
    <p class="body-regular text-general-secondary-light dark:text-general-secondary-dark">
      Welcome to your dashboard. Review the latest activities below.
    </p>

    <!-- Specific utility class for tiny helper texts -->
    <span class="body-xsmall text-general-tertiary-light dark:text-general-tertiary-dark">
      Last updated 5 mins ago
    </span>
  </article>
</template>
```
