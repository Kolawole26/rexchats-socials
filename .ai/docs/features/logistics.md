---
title: Logistics Page UI
description: Logistics shipments table with filtering/export and sidebars for order + shipment management.
---

# Logistics Page UI

## Route

- /logistics (Nuxt: pages/logistics.vue)

## UI

- Summary cards: Shipped / Delivered / Returned counts (computed from table data).
- Status tabs: All / Shipped / Delivered / Returned (client-side filter).
- Shipments table: built with OwnTable + slots (customer info, courier pill, date/time stack, status badge, row actions menu).
- Row actions menu: Create/Update Shipment + View Order.
- Sidebars (PrimeVue Sidebar):
  - Filter sidebar (Courier/City/Status/Date range).
  - Shipment sidebar (Create/Update Shipment form + collapsible Order Details/Items/Delivery Details).
  - Order sidebar (order details view).

## Components / Files

- pages/logistics.vue: Main page implementation and sidebar state.
- components/common/table/OwnTable.vue: Table wrapper (emits row click via onView).
- components/common/button.vue (CommonButton): Used for all clickable actions.
- components/common/input/FormSelect.vue and components/common/input/FormText.vue: Form controls used in sidebars.

## Typography

- No Tailwind font-size utilities are used on the page; typography relies on assets/css/global.css utilities (body-small/body-xsmall and heading tags).
