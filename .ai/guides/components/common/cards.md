# Components / common / cards.vue Guide

**Purpose:** Reusable container component for rendering visually distinct content groups, dashboards widgets, or distinct data sections.

---

## Structure

- Lives at `components/common/cards.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `String` | No | `''` | Optional title displayed in the card header. |
| `padding`| `String` | No | `'p-4'` | Customizable padding classes around the content. |

---

## Responsibilities

- **Content Containment** — grouping related information together.
- **Styling Consistency** — applying a uniform border radius, shadow, and background.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

```vue
<CommonCards title="Dashboard Overview">
  <p>Here is some content for the card.</p>
</CommonCards>
```
