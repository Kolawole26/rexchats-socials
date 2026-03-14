
---
name: modal-filter-menu
description: Standardized filtering UX using ModalFilterMenu (components/modal/filterMenu.vue) instead of sidebars.
---

# ModalFilterMenu Skill

This project standardizes table filtering using the ModalFilterMenu overlay component.

## When to use

- Pages with tables that need lightweight filtering (Logistics/Conversations/Complaints pattern).
- Any place a right-side filter drawer/sidebar was previously used for simple filters.

## Rules

1. Use ModalFilterMenu (OverlayPanel) for table filters; do not build new filter sidebars for table filters.
2. Buttons: Never use raw button tags; use CommonButton.
3. Typography: Do not use Tailwind font-size utilities; use global typography classes.
4. Keep filter state in the page:
   - items describes the UI.
   - Selected values are emitted back on apply.
   - The page updates its reactive filters and resets pagination.

## Component

File: components/modal/filterMenu.vue

## Items format

Each item is one of:

- Select field:
  - { label: "Platform", field: "Select", options: [{ name, value }] }
- Date range:
  - { label: "Date", hasDates: true }

## Events

- reset: User clicked reset (page should clear filters + reset pagination).
- apply: Receives an array of selected values aligned to the items order.

## Reference usage

- pages/logistics.vue

## Example

    <CommonButton
      title="Filter"
      type="button"
      bgColor="bg-neutral-surface border border-neutral-line hover:bg-neutral-muted !h-10"
      textColor="text-neutral-secondary button"
      createIcon="filter"
      @click="openFilterMenu"
    />

    <ModalFilterMenu
      ref="filterMenuRef"
      :items="filterMenuItems"
      @reset="resetFilters"
      @apply="applyFilters"
    />
