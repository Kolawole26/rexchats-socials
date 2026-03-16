---
name: sidebar-drawer
description: Pattern for PrimeVue right drawers (Logistics-style) with componentized body and pinned footer.
---

# Sidebar Drawer Skill

Use this when implementing a PrimeVue Sidebar drawer (right side) for forms.

## Rules
- Do not change the app header or the main navigation sidebar layout.
- Use typography classes from assets/css/global.css (body-*, label, button). Do not use Tailwind font-size utilities (text-sm, text-base, text-[...]).

## Drawer structure (Logistics reference)
1) PrimeVue Sidebar
- position: right
- class: custom-modal-drawer rounded-tl-lg rounded-bl-lg
- showCloseIcon: false
- show-header: false (custom header)

2) Content order
- First child inside Sidebar must be the header container div (p-6).
- Everything after the header must be extracted into a dedicated component (e.g. SomethingSidebarBody.vue).

## Body component pattern
- Wrapper: flex flex-col h-full
- Scroll area: flex-1 overflow-auto
- Footer actions (Cancel/Save) must always be visible at the bottom (use sticky bottom-0 or an equivalent pattern).
- Use CommonButton for actions.

## Example
<Sidebar ...>
  <div class="w-full ... p-6">...</div>
  <MySidebarBody @cancel="close" @save="submit" />
</Sidebar>
