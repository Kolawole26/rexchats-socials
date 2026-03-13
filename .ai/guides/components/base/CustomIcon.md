# Components / base / CustomIcon.vue Guide

**Purpose:** Reusable dynamic SVG icon component that lazily imports any icon from the `~/assets/icons/` directory as a Vue component. Use `<BaseCustomIcon>` wherever an SVG icon is needed instead of inlining raw SVG markup.

---

## Structure

- Lives at `components/base/CustomIcon.vue`.
- Uses `<script setup>` with `shallowRef` for the resolved icon component (avoids deep reactivity overhead on component references).
- Dynamically imports SVG files using Vite's `?component` query suffix (requires `vite-svg-loader` — configured in `nuxt.config.ts`).
- Re-executes the import whenever the `name` prop changes via `watch`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `name` | `String` | Yes | — | Filename of the SVG (without `.svg`), relative to `~/assets/icons/` |
| `customClass` | `String \| Array \| Object` | No | `''` | Additional CSS classes forwarded to the rendered SVG element |

---

## Responsibilities

- **Lazy SVG loading** — asynchronously imports `~/assets/icons/<name>.svg?component` so unused icons are not bundled unless needed.
- **Graceful fallback** — logs a `console.warn` and sets `iconComponent` to `null` if an icon file does not exist, preventing broken renders.
- **Reactive name changes** — `watch(() => props.name, ...)` ensures the icon updates when the `name` prop is changed at runtime.
- **Class forwarding** — applies `svg-icon` base class plus any `customClass` prop value on the rendered SVG element for flexible sizing and colouring via Tailwind.

---

## Exporting

Components in `components/` are auto-imported by Nuxt — no explicit import is required.

Usage:

```vue
<!-- Renders ~/assets/icons/arrow-right.svg as a Vue component -->
<BaseCustomIcon name="arrow-right" />

<!-- With custom Tailwind classes -->
<BaseCustomIcon name="user" customClass="w-5 h-5 text-primary-500" />
```

- Icon files **must** be placed in `~/assets/icons/` and use `.svg` extension.
- The component name is derived from the folder path: `components/base/CustomIcon.vue` → `<BaseCustomIcon>`.
- Do not inline raw `<svg>` HTML in templates — always register the icon file and use this component.
- Size the icon in CSS (e.g. `w-4 h-4`) rather than using `width`/`height` SVG attributes.
