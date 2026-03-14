---
title: App Shell Layout
description: Default layout updated to match the new header/sidebar design with a collapsible sidebar.
---

# App Shell Layout

## What Changed

- Sidebar is now light (neutral-surface) with section dividers (neutral-line) and token-based navigation states.
- Sidebar supports desktop collapse (icons-only) and persists in localStorage as sidebar-collapsed.
- Header matches the design: page title, notifications, and user menu.

## Files

- layouts/default.vue: Handles mobile open/close + desktop collapse offsets.
- components/partials/TheSidebar.vue: Collapsible nav + theme toggle + user card.
- components/partials/TheHeader.vue: Title + notifications + user menu.
- assets/icons/*.svg: Added missing sidebar/header icons using currentColor.

## Color Tokens

- Active navigation: bg-primary-300 + text-neutral-inverted
- Inactive navigation: text-primary-400
- Text: text-neutral-primary, text-neutral-secondary
- Dividers/borders: border-neutral-line
