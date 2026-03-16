<template>
  <span
    v-if="resolved.label"
    class="inline-flex items-center gap-2 rounded-full px-3 py-1 body-xsmall capitalize"
    :class="resolved.classes"
  >
    <BaseCustomIcon v-if="resolved.icon" :name="resolved.icon" customClass="w-4 h-4" />
    {{ resolved.label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'CommonStatus' })

const props = defineProps({
  status: { type: String, default: '' },
  label: { type: String, default: '' }
})

const normalize = (value) => String(value ?? '').toLowerCase().trim().replaceAll('_', ' ').replaceAll('-', ' ').replace(/\s+/g, ' ')

const toTitleCase = (value) => String(value ?? "").trim().replaceAll("_", " ").replaceAll("-", " ").replace(/\s+/g, " ")

const resolved = computed(() => {
  const raw = toTitleCase(props.label || props.status)
  const s = normalize(props.status || props.label)
  if (!s || !raw) return { label: '', icon: '', classes: '' }
  const success = ['completed', 'active', 'paid', 'sent', 'resolved', 'delivered', 'verified', 'success']
  const warning = ['unverified', 'archived', 'in progress', 'pending', 'confirmed', 'processing']
  const danger = ['cancelled', 'canceled', 'suspended', 'rejected', 'failed', 'ended', 'deleted', 'returned', 'refund', 'inactive']

  if (success.includes(s)) {
    return { label: raw, icon: 'check_circle', classes: 'text-success-300 dark:text-success-75 bg-success-50 dark:bg-success-500' }
  }

  if (warning.includes(s)) {
    return { label: raw, icon: 'not_disturb', classes: 'text-warning-300 dark:text-warning-75 bg-warning-50 dark:bg-warning-500' }
  }

  if (danger.includes(s)) {
    return { label: raw, icon: 'suspend', classes: 'text-danger-300 dark:text-danger-75 bg-danger-50 dark:bg-danger-500' }
  }

  return { label: raw, icon: '', classes: 'bg-neutral-muted text-neutral-secondary dark:bg-neutral-surface dark:text-neutral-secondary' }
})

</script>













