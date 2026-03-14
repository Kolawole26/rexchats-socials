---
title: Single Inventory Page UI
description: Inventory item/variant listing with status tabs, stock adjustment controls, and export.
---

# Single Inventory Page UI

## Route

- /inventory/:id (Nuxt: pages/inventory/[id].vue)

## UI

- Breadcrumb: links back to /inventory and shows the current #id.
- Status tabs: All / In Stock / Low Stock / Out of Stock (client-side filtering).
- Table: Product, Variants (chips), Stock Count, Status (pill), Adjust (+/-).
- Export: CSV export of the currently filtered rows.

## Files

- pages/inventory/[id].vue: Single-inventory page implementation (mock data, filtering, pagination, adjust, export).
- assets/icons/plus.svg and assets/icons/minus.svg: Icon buttons for stock adjustment.

## Typography

- Uses global typography utilities from assets/css/global.css (body-small, body-xsmall, heading tags) instead of Tailwind font-size utilities.
