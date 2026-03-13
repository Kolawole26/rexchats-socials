# Testing Guide

This guide outlines the patterns and standards for testing in this Nuxt 3 application using **Vitest**.

Testing is mandatory for any feature or business logic. We use **Vitest** for unit, component, and integration testing.

## Standards

1.  **Unit Tests**: Required for all composables and stores. Focus on logic, state transitions, and edge cases.
2.  **Component Tests**: Required for all UI components and pages. Focus on rendering, user interactions (clicks, inputs), and prop reactivity.
3.  **Integration Tests**: Required for complex multi-step flows (e.g., authentication, form submission).

## Tools

*   **Vitest**: Test runner.
*   **@vue/test-utils**: Library for mounting and interacting with Vue components.
*   **@nuxt/test-utils**: Nuxt-specific utilities (runtime context, mocking).
*   **Happy DOM**: Web-based browser environment for testing.

---

## Patterns

### 1. Testing Composables

Composables that use Nuxt-specific injects (like `useRuntimeConfig` or `useFetch`) should be tested within a Nuxt context.

```ts
import { describe, it, expect } from 'vitest'
import { registerEndpoint } from '@/composables/endpoints'

describe('Endpoints Composable', () => {
  it('should return the correct endpoint path', () => {
    expect(endpoints.login).toBe('/auth/login')
  })
})
```

### 2. Testing Pinia Stores

Always reset the store before each test. Use `createTestingPinia` if you need to mock actions.

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/store/user'

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('sets the user correctly', () => {
    const store = useUserStore()
    store.setUser({ name: 'John Doe' })
    expect(store.user.name).toBe('John Doe')
  })
})
```

### 3. Testing Components

Focus on what the user sees and does.

```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import CustomButton from '@/components/common/button.vue'

describe('CustomButton', () => {
  it('renders properties when passed', () => {
    const wrapper = mount(CustomButton, {
      props: { label: 'Click Me' }
    })
    expect(wrapper.text()).toContain('Click Me')
  })

  it('emits click event on click', async () => {
    const wrapper = mount(CustomButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
```

---

## Running Tests

| Command              | Purpose                  |
| -------------------- | ------------------------ |
| `npm run test`       | Run all tests            |
| `npm run test:watch` | Run tests in watch mode  |
| `npm run test:ui`    | View tests in Vitest UI  |
| `npm run test:coverage` | Check code coverage      |

## Mocking

### Mocking API Requests

We use `vi.mock` for external dependencies and the central API client.

```ts
vi.mock('@/composables/api', () => ({
  useApiRequest: () => ({
    sendRequest: vi.fn().mockResolvedValue({ data: { success: true } })
  })
}))
```
