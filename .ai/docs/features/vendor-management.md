---
title: Vendor Management Page UI
description: Vendor table with filtering/export and a right-side drawer for adding and viewing vendor information.
---

# Vendor Management Page UI

## Route

- /vendor-management (Nuxt: pages/vendor-management.vue)

## UI

- Summary cards: Total / Active / Suspended vendors (computed from table data).
- Status tabs: All / Active / Suspended (client-side filter).
- Vendors table: built with OwnTable + slots (platform icons, date/time stack, status badge, row actions menu).
- Table actions: Search + ModalFilterMenu filter + Export + Add Vendor.
- Row actions menu: View Vendor + Activate/Suspend Vendor.
- Sidebar (PrimeVue Sidebar, Logistics style):
  - Add Vendor form (Account Information + Other Information).
  - Vendor Information form (adds Platform Access toggles + Management Control status).

## Components / Files

- pages/vendor-management.vue: Main page implementation and sidebar state.
- components/vendor/VendorSidebarBody.vue: Vendor add/view form body with Joi validation hooks.
- components/common/cards.vue (CommonCards): Summary stat cards.
- components/common/table/OwnTable.vue: Table wrapper.
- components/modal/filterMenu.vue (ModalFilterMenu): Reusable filter overlay.
- components/common/input/FormSelect.vue and components/common/input/FormText.vue: Form controls used in the sidebar.

## Validation

- Uses Joi per-field validation (errors passed via the :error prop) following .ai/skills/form-validation.

## Typography

- No Tailwind font-size utilities are used on the page; typography relies on assets/css/global.css utilities (heading tags, body-small/body-xsmall, label, button).