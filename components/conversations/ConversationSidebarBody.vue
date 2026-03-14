<template>
  <div class="flex flex-col gap-4 p-6">
    <div class="border border-neutral-line rounded-2xl p-5">
      <div class="flex items-center justify-between">
        <p class="body-small text-neutral-secondary tracking-wide">CONVERSATION DETAILS</p>
        <BaseCustomIcon name="chevron-down" customClass="text-neutral-secondary rotate-180" />
      </div>

      <div class="mt-4 flex flex-col gap-3">
        <div class="flex items-center justify-between gap-6">
          <p class="body-small text-neutral-secondary">Customer</p>
          <p class="body-small text-neutral-primary text-right truncate">
            {{ selectedRow?.customer_name || 'N/A' }}
          </p>
        </div>

        <div class="flex items-center justify-between gap-6">
          <p class="body-small text-neutral-secondary">Phone</p>
          <p class="body-small text-neutral-primary text-right truncate">
            {{ selectedRow?.customer_phone || 'N/A' }}
          </p>
        </div>

        <div class="flex items-center justify-between gap-6">
          <p class="body-small text-neutral-secondary">Platform</p>
          <div class="flex items-center gap-2">
            <span
              class="w-5 h-5 rounded-full flex items-center justify-center"
              :class="platformPillClass"
              aria-hidden="true"
            >
              <BaseCustomIcon :name="platformIcon" customClass="w-3.5 h-3.5" />
            </span>
            <p class="body-small text-neutral-primary">{{ platformLabel }}</p>
          </div>
        </div>

        <div v-if="selectedRow?.type" class="flex items-center justify-between gap-6">
          <p class="body-small text-neutral-secondary">Type</p>
          <span class="inline-flex items-center rounded-full px-3 py-1 bg-neutral-muted text-neutral-primary body-xsmall">
            {{ selectedRow.type }}
          </span>
        </div>

        <div v-if="selectedRow?.ai_status" class="flex items-center justify-between gap-6">
          <p class="body-small text-neutral-secondary">AI Status</p>
          <span
            class="inline-flex items-center rounded-full px-3 py-1 body-xsmall"
            :class="aiBadgeClass"
          >
            {{ aiStatusLabel }}
          </span>
        </div>
      </div>
    </div>

    <div class="border border-neutral-line rounded-2xl p-5">
      <div class="flex items-center justify-between">
        <p class="body-small text-neutral-secondary tracking-wide">LAST MESSAGE</p>
        <BaseCustomIcon name="chevron-down" customClass="text-neutral-secondary rotate-180" />
      </div>

      <div class="mt-4">
        <p class="body-small text-neutral-primary">
          {{ selectedRow?.last_message || 'No message available' }}
        </p>
      </div>
    </div>

    <div class="border border-neutral-line rounded-2xl p-5">
      <div class="flex items-center justify-between">
        <p class="body-small text-neutral-secondary tracking-wide">LAST ACTIVITY</p>
        <BaseCustomIcon name="chevron-down" customClass="text-neutral-secondary rotate-180" />
      </div>

      <div class="mt-4 flex flex-col gap-1">
        <p class="body-small text-neutral-primary">{{ selectedRow?.date || 'N/A' }}</p>
        <p class="body-xsmall text-neutral-secondary">{{ selectedRow?.time || '' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedRow: { type: Object, default: null }
})

const platform = computed(() => String(props.selectedRow?.platform || '').toLowerCase())

const platformIcon = computed(() => {
  if (platform.value.includes('insta')) return 'instagram'
  return 'facebook'
})

const platformLabel = computed(() => {
  if (platform.value.includes('insta')) return 'Instagram'
  return 'Facebook'
})

const platformPillClass = computed(() => {
  if (platform.value.includes('insta')) return 'bg-danger-50 text-danger-300'
  return 'bg-info-50 text-info-300'
})

const aiStatus = computed(() => String(props.selectedRow?.ai_status || '').toLowerCase())

const aiStatusLabel = computed(() => {
  if (aiStatus.value === 'paused') return 'AI Paused'
  if (aiStatus.value === 'active') return 'AI Active'
  return 'AI Off'
})

const aiBadgeClass = computed(() => {
  if (aiStatus.value === 'paused') return 'bg-danger-50 text-danger-300'
  if (aiStatus.value === 'active') return 'bg-info-50 text-info-300'
  return 'bg-neutral-muted text-neutral-secondary'
})
</script>
