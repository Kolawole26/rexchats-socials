---
name: dashboard-insights
description: Standard dashboard patterns (cards + charts + date filter) with role-based views using ModalFilterMenu and Joi.
---

# Dashboard Insights Skill

Use this skill when implementing or refactoring the Dashboard (pages/index.vue) or similar insights pages.

## Requirements

- Do not change the app header or main sidebar layout.
- Typography: Use global typography classes from assets/css/global.css (body-*, label, button, and semantic headings). Do not use Tailwind font-size utilities (text-sm, text-base, text-[...]).
- Buttons: Use CommonButton (no raw <button> tags).
- Cards: Use CommonCards for summary stats.
- Filters: Use ModalFilterMenu (components/modal/filterMenu.vue) like pages/logistics.vue.
- Validation: Use Joi (see .ai/skills/form-validation) to validate filter values before applying.

## Recommended UI Structure

1. Header row
   - Left: page heading (e.g. All insight)
   - Right: Filter button opening ModalFilterMenu

2. Summary cards
   - 3 cards in a responsive grid.

3. Charts section
   - Vendor role: single large line chart.
   - Admin role: line chart + doughnut chart (top products) in a two-column grid.

## Role Handling

Derive the current role from useUserDetailsStore() (user localStorage object). Normalize common keys:
- user.role
- user.user_role
- user.account_type

Treat any role containing admin as admin; otherwise render vendor view.

## Filter Validation (Joi)

Validate date range values on @apply from ModalFilterMenu:
- If one date is set, require both.
- Ensure fromDate <= toDate.
- On invalid input: do not apply filters; show an error toast using useToastHandler().

## Charts

Use chart wrapper components in components/chart/* (Line/Doughnut/etc.).
Prefer pulling colors from CSS variables via getComputedStyle(document.documentElement).

## References

- pages/logistics.vue — ModalFilterMenu usage.
- components/common/cards.vue — card formatting.
- assets/css/colors.css — CSS variables used for chart colors.
