---
name: responsive-design
description: Standardization for building responsive layouts and components across all screen sizes.
---

# Responsive Design Skill

This project strictly follows a **Mobile-First** approach using Tailwind CSS. All components and layouts must be built to perfectly scale and adapt across mobile, tablet, and desktop viewports.

## Rules & Best Practices

1. **Mobile-First Approach**: Always write styles for mobile screens (default, no prefix) first, then progressively enhance for larger screens using Tailwind's breakpoint prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`).
   - E.g., Use `w-full md:w-1/2 lg:w-1/3` instead of `w-1/3 md:w-1/2 max-md:w-full`.

2. **Tailwind Breakpoints**: Adhere to standard breakpoints:
   - `sm`: 640px (Large phones)
   - `md`: 768px (Tablets)
   - `lg`: 1024px (Laptops)
   - `xl`: 1280px (Desktop)
   - `2xl`: 1536px (Large screens)

3. **Flexible Layouts (Flexbox & Grid)**:
   - Always prefer CSS Flexbox or CSS Grid for structural layouts over absolute positioning or static widths.
   - Use `flex-col` on mobile that transforms into `md:flex-row` for stacked content.
   - Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for listing dynamic items like cards.

4. **Fluid Sizing and Spacing**:
   - Avoid fixed heights (`h-[500px]`) and fixed widths (`w-[400px]`) unless specifically required for an icon or a very strict container. Utilize max-widths (`max-w-md`, `max-w-full`) and relative dimensions (`w-full`, `h-full`, `flex-1`).
   - Use padding (`p-4 md:p-6 lg:p-8`) to maintain breathing room around edges on smaller devices.

5. **Hidden / Visible Elements**:
   - For UI elements meant only for desktop (like a sidebar), hide them on mobile using `hidden lg:block` or `hidden lg:flex`.
   - For mobile-only elements (like a hamburger menu), hide them on desktop using `block lg:hidden`.

## Implementation Example

```vue
<template>
  <!-- Main Container: Stacked on mobile, side-by-side on desktop -->
  <div class="flex flex-col lg:flex-row w-full min-h-screen bg-general-background-light dark:bg-general-background-dark">
    
    <!-- Sidebar: Hidden on mobile, visible on laptop (lg) -->
    <aside class="hidden lg:flex w-[250px] flex-col p-6 border-r border-general-line-light dark:border-general-line-dark">
      <nav>Sidebar Navigation</nav>
    </aside>

    <!-- Mobile Header: Visible on mobile, hidden on laptop -->
    <header class="flex lg:hidden items-center justify-between p-4 border-b border-general-line-light">
      <span>Mobile Logo</span>
      <button>Menu</button>
    </header>

    <!-- Main Content Area: Fills remaining space -->
    <main class="flex-1 w-full p-4 md:p-8 lg:p-12 overflow-y-auto">
      <h1 class="mb-6">Dashboard Overview</h1>

      <!-- Responsive Grid for Statistics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div class="bg-white dark:bg-general-surface-dark p-4 rounded-xl shadow-sm">Card 1</div>
        <div class="bg-white dark:bg-general-surface-dark p-4 rounded-xl shadow-sm">Card 2</div>
        <div class="bg-white dark:bg-general-surface-dark p-4 rounded-xl shadow-sm">Card 3</div>
      </div>
    </main>
  </div>
</template>
```
