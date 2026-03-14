---
title: Inventory Page UI
description: Inventory page table UI with search, export, and pagination using OwnTable.
---

# Inventory Page UI

## Route

- /inventory: Inventory listing page (uses layouts/default.vue).

## UI

- Page title is set via definePageMeta (customProp: Inventory) to drive the header title.
- Table is rendered via OwnTable with an actions slot (search + export) to match the design layout.

## Components / Files

- pages/inventory/index.vue: Inventory page implementation (mock data, client-side search, pagination, CSV export).
- components/common/table/OwnTable.vue: Standard table wrapper around PrimeVue DataTable + Paginator.
- components/common/button.vue (CommonButton): Used for the Export action.

## Typography

- Inventory page content uses typography utilities from assets/css/global.css (body-small, body-xsmall, and heading tags) instead of Tailwind font-size utilities.

## Notes

- Inventory data is currently mocked in pages/inventory/index.vue. When wiring to backend, replace the local array with API results via useApiRequest() and keep the same page, limit, and search states.

