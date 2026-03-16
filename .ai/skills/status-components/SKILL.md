---
name: status-components
description: Standard status pill mapping using components/common/status.vue.
---

# Status Components Skill

Use this skill whenever you need a status pill/badge (Active, Suspended, Pending, etc.).

## Rules
- Always use the shared component at components/common/status.vue (CommonStatus).
- Do not re-implement status color/icon logic inside pages.
- Use typography from assets/css/global.css (body-xsmall for pills). Avoid Tailwind font-size utilities.

## Props
- status: string (used for color/icon mapping)
- label: optional string (display override)

## Extending statuses
If a new status value is introduced, update components/common/status.vue mapping lists.
Keep mapping case-insensitive (normalize input).
