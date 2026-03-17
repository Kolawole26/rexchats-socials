---
name: chart-components
description: Standard rules for using components/chart/* wrappers and chart colors/options.
---

# Chart Components Skill


Use this skill when adding or updating charts on pages (Dashboard, Logistics, Products insights).

## Rules


- Use the existing wrappers in components/chart (Line, Doughnut, Bar, Pie).
- Colors: prefer CSS variables from assets/css/colors.css (read via getComputedStyle(document.documentElement)).
- Typography: do not use Tailwind font-size utilities; use global typography classes for labels/headers around charts.
- Avoid hardcoding colors unless a CSS-variable fallback is required.

## Line chart sizing

- Prefer passing a heightClass to ChartLine so the chart area matches the designs.
  Example: <ChartLine :chartData="data" :chartOptions="opts" :labels="[]" :colors="[]" heightClass="h-[420px] md:h-[560px]" />

## Files

- components/chart/Line.vue
- components/chart/Doughnut.vue
- components/chart/Bar.vue
- components/chart/Pie.vue
