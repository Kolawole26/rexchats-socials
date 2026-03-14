<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="computedClasses"
    @click="onClick"
  >
    <span v-if="loading" class="inline-flex items-center justify-center">
      <i class="pi pi-spin pi-spinner text-current body-small" />
    </span>

    <BaseCustomIcon
      v-else-if="createIcon"
      :name="createIcon"
      customClass=""
    />

    <slot name="icon-left" />

    <span v-if="title">{{ title }}</span>
    <span v-else><slot /></span>

    <slot name="icon-right" />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  type: { type: String, default: 'button' },

  // Design-system props used across the app
  bgColor: { type: String, default: '' },
  textColor: { type: String, default: '' },
  fullWidth: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  createIcon: { type: String, default: '' },

  // Backwards-compatible props (still supported)
  color: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  outline: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])

const computedClasses = computed(() => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-50 disabled:cursor-not-allowed button'

  const sizes = {
    sm: 'px-3 py-2 h-9',
    md: 'px-4 py-2.5 h-10',
    lg: 'px-6 py-3 h-12'
  }

  const legacyColors = {
    primary: props.outline
      ? 'border border-primary-300 text-primary-300 hover:bg-primary-50'
      : 'bg-primary-300 text-neutral-inverted hover:bg-primary-400',
    secondary: props.outline
      ? 'border border-neutral-line text-neutral-primary hover:bg-neutral-muted'
      : 'bg-neutral-muted text-neutral-primary hover:bg-neutral-line',
    danger: props.outline
      ? 'border border-danger-300 text-danger-300 hover:bg-danger-50'
      : 'bg-danger-300 text-neutral-inverted hover:bg-danger-400'
  }

  const resolvedBg = props.bgColor
    ? props.bgColor
    : legacyColors[props.color] || legacyColors.primary

  const resolvedText = props.textColor ? props.textColor : ''

  return [
    base,
    sizes[props.size] || sizes.md,
    resolvedBg,
    resolvedText,
    props.fullWidth ? 'w-full' : ''
  ].join(' ')
})

const onClick = (event) => {
  if (props.disabled || props.loading) return
  emit('click', event)
}
</script>

