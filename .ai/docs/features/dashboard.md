---
title: Dashboard Page UI
description: Role-based dashboard insights with cards, charts, and date filtering via ModalFilterMenu.
---

# Dashboard Page UI

## Route

- / (Nuxt: pages/index.vue)

## Roles

- Admin: shows Revenue Breakdown (line chart) + Top Products (doughnut chart).
- Vendor: shows Vendors Revenue Breakdown (line chart only).

Role is derived from useUserDetailsStore().user and normalized from common keys (role, user_role, account_type, type). Any role containing admin is treated as admin.

## UI

- Header row: Page title (All insight) + Filter action.
- Summary cards: Revenue / Delivered Orders / Complaints (uses CommonCards).
- Charts:
  - Line chart uses components/chart/Line.vue.
  - Doughnut chart uses components/chart/Doughnut.vue.

## Filters

- Uses components/modal/filterMenu.vue (ModalFilterMenu) for date range filtering.
- Date range is validated with Joi before applying:
  - If one date is selected, both are required.
  - From date must be before/equals To date.

## Components / Files

- pages/index.vue: Dashboard implementation.
- components/common/cards.vue (CommonCards): Summary stat cards.
- components/common/button.vue (CommonButton): Filter action.
- components/modal/filterMenu.vue (ModalFilterMenu): Date filter overlay.
- components/chart/Line.vue and components/chart/Doughnut.vue: Chart wrappers.

## Typography

- No Tailwind font-size utilities are used on the page; typography relies on assets/css/global.css (heading tags + button/label/body-* classes).

