// composables/toast.js
// Centralized toast notification handler with deduplication support.
// Usage: const { showToast } = useToastHandler()
// OR disable toasts in a page: const { showToast } = useToastHandler({ silent: true })

import { useToast } from 'primevue/usetoast'

// Shared state across all composable instances (module-level)
const _shownMessages = new Map() // key: message string, value: timestamp
const DEBOUNCE_MS = 5000 // Duration to suppress duplicate messages (5 seconds)

export function useToastHandler(options = {}) {
    const toast = useToast()
    const silent = options.silent ?? false // Set true to suppress all toasts in that component/page

    const showToast = ({ severity = 'info', summary = '', detail, life = 5000 } = {}) => {
        if (silent) return // Skip entirely if caller opted out

        const now = Date.now()
        const lastShown = _shownMessages.get(detail)

        // Prevent duplicate toasts within the debounce window
        if (lastShown && now - lastShown < DEBOUNCE_MS) return

        _shownMessages.set(detail, now)

        // Auto-clean the map after the debounce period to prevent memory leaks
        setTimeout(() => {
            _shownMessages.delete(detail)
        }, DEBOUNCE_MS)

        toast.add({ severity, summary, detail, life })
    }

    const showSuccess = (detail, options = {}) =>
        showToast({ severity: 'success', summary: 'Success', detail, ...options })

    const showError = (detail, options = {}) =>
        showToast({ severity: 'error', summary: '', detail, life: 5000, ...options })

    const showInfo = (detail, options = {}) =>
        showToast({ severity: 'info', summary: '', detail, ...options })

    return { showToast, showSuccess, showError, showInfo }
}
