# package.json Scripts Guide

**Purpose:** Defines the npm scripts available for developing, building, previewing, and linting the project. All team members and CI pipelines should use these scripts rather than running Nuxt or ESLint CLI commands directly.

---

## Structure

The `scripts` block in `package.json`:

```json
{
  "scripts": {
    "build":       "nuxt build",
    "dev":         "nuxt dev",
    "dev_2":       "infisical run --env=dev --path=/Base -- nuxt dev",
    "generate":    "nuxt generate",
    "preview":     "nuxt preview",
    "postinstall": "nuxt prepare",
    "lint":        "eslint .",
    "lint:fix":    "eslint . --fix"
  }
}
```

---

## Responsibilities

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `nuxt dev` | Starts the local development server with HMR |
| `dev_2` | `infisical run … nuxt dev` | Starts dev server with secrets injected from Infisical (used when the project requires secret management) |
| `build` | `nuxt build` | Compiles the production bundle |
| `generate` | `nuxt generate` | Generates a fully static site |
| `preview` | `nuxt preview` | Previews the production build locally |
| `postinstall` | `nuxt prepare` | Auto-runs after `npm install` to generate Nuxt type definitions |
| `lint` | `eslint .` | Checks all files for linting errors |
| `lint:fix` | `eslint . --fix` | Auto-fixes fixable lint errors |

---

## Exporting

No export — `package.json` is consumed by npm/yarn/pnpm directly.

Usage:

```bash
# Normal development
npm run dev

# Development with Infisical secrets
npm run dev_2

# Check linting before committing
npm run lint

# Fix lint errors automatically
npm run lint:fix

# Production build
npm run build
```

- Always run `npm run lint` before opening a pull request.
- `postinstall` runs automatically — do not skip or remove it; it generates `.nuxt/` types needed for TypeScript and IDE support.
- When adding new scripts, follow the existing convention (lowercase, hyphen-separated) and document the purpose here.
