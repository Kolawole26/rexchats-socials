---
title: Complaints Page UI
description: Complaints table with filtering/export and a conversation detail drawer.
---

# Complaints Page UI

## Route

- /complaints (Nuxt: pages/complaints.vue)

## UI

- Complaints table: OwnTable with customer/platform/last message/type/last activity columns.
- Actions: Search + ModalFilterMenu filter + Export.
- Row actions menu: View Conversation.
- Drawer: PrimeVue Sidebar styled like other pages, body rendered with ConversationSidebarBody.

## Components / Files

- pages/complaints.vue: Page implementation and table/drawer state.
- components/common/table/OwnTable.vue: Table wrapper.
- components/modal/filterMenu.vue (ModalFilterMenu): Reusable filter overlay.
- components/conversations/ConversationSidebarBody.vue: Drawer content.

## Typography

- No Tailwind font-size utilities are used; typography relies on assets/css/global.css utilities (body-small/body-xsmall and heading tags).