
---
name: cards
description: Standardized stat/summary cards using the CommonCards component (components/common/cards.vue).
---

# Cards Skill

This project uses a shared CommonCards component for summary/stat cards (e.g., Logistics + Conversations).

## When to use

- Any page that needs small metric cards (icon + label + value).
- To keep spacing, typography, borders, and icon badge styling consistent across the app.

## Rules

1. Use CommonCards instead of recreating the card layout manually.
2. Typography: Do not use Tailwind font-size utilities (text-sm, text-xs, text-base, text-[...]). Use headings and global classes from assets/css/global.css (e.g., body-small, body-xsmall).
3. Colors: Do not hardcode hex colors. Use existing semantic/brand classes (e.g., bg-brand-*-background, text-brand-*-foreground).
4. Icons: Use BaseCustomIcon via the component icon prop (do not inline SVG in pages).

## Component

File: components/common/cards.vue

## Props (core)

- title (String, required): Card label.
- value (String|Number, required): Card value.
- icon (String, required): Icon name for BaseCustomIcon.
- iconWrapperClass (String, optional): Classes applied to the icon badge wrapper (background + text color).

## Props (optional)

- iconClass (String): Icon size classes (default: w-5 h-5).
- format (String): number | currency | percent | raw (default: number).
- currency, locale, decimals: Only used when format is currency/percent.

## Example

    <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <CommonCards
        title="Shipped Orders"
        :value="shippedCount"
        icon="logistics"
        iconWrapperClass="bg-brand-blue-background text-brand-blue-foreground"
      />
    </section>
