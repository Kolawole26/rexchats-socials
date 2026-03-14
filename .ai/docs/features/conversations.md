---
title: Conversations Page UI
description: Conversations dashboard with summary cards, AI status tabs, filtering/export, and conversation detail drawer.
---

# Conversations Page UI

## Route

- /conversations (Nuxt: pages/conversations.vue)

## UI

- Summary cards: All Conversations / AI Conversations / Pause Conversation.
- Tabs: All / AI Conversations / Paused Conversations (client-side filter).
- Conversations table: OwnTable with slots for customer details, platform badge, last message, AI status pill, and last activity.
- Actions: Search + ModalFilterMenu filter + Export.
- Row actions menu: View Conversation and Pause/Activate Conversation (based on current AI status).
- Drawer: PrimeVue Sidebar styled like other pages, body rendered with ConversationSidebarBody.

## Components / Files

- pages/conversations.vue: Page implementation and table/drawer state.
- components/common/cards.vue (CommonCards): Summary stat cards.
- components/common/table/OwnTable.vue: Table wrapper.
- components/modal/filterMenu.vue (ModalFilterMenu): Reusable filter overlay.
- components/conversations/ConversationSidebarBody.vue: Drawer content for conversation details.

## Typography

- No Tailwind font-size utilities are used; typography relies on assets/css/global.css utilities (body-small/body-xsmall and heading tags).