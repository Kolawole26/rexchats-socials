---
title: Reference Guide for the Examples Feature
description: Comprehensive technical reference for the Examples feature implementation.
---

# Reference: Examples Feature

This document serves as an information-oriented technical reference for the Examples feature. It covers the exported components, functions, and state shapes without providing tutorials or explanations of their rationale.

## State Shape (Pinia Store)

**Store ID**: `examples`

```ts
interface ExampleState {
  items: ExampleItem[];
  isLoading: boolean;
  selectedId: string | null;
  error: null | ErrorResponse;
}

interface ExampleItem {
  id: string; // UUID string
  title: string;
  description: string;
  createdAt: string; // ISO 8601 Date
}
```

## Available Composables

### `useExamples`

Provides reactive data and methods for the examples API module.

**Returns:**
- `examples: Ref<ExampleItem[]>`: The reactive list of examples.
- `pending: Ref<boolean>`: True while fetching data.
- `error: Ref<Error | null>`: The error object, if the latest request failed.
- `fetchExamples()`: Function to retrieve the examples payload.
- `createExample(payload: Partial<ExampleItem>)`: Function to create a new example item.
- `deleteExample(id: string)`: Function to remove an example item.

## UI Components (`components/examples/`)

### `ExampleCard.vue`

Displays a single example item in a responsive grid.

**Props:**
- `example: ExampleItem` (required): The object containing data.
- `isSelected: boolean` (optional, default: `false`): Highlights the card visually if true.

**Events:**
- `@select(id: string)`: Fired when the card is clicked.
- `@remove(id: string)`: Fired when the card's delete button is clicked.

### `ExampleListView.vue`

A container iterating over multiple `ExampleCard` components.

**Props:**
- `items: ExampleItem[]` (required): Array of examples to render.
