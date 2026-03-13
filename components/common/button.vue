<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="computedClasses"
    @click="onClick"
  >
    <slot name="icon-left" />
    <span><slot /></span>
    <slot name="icon-right" />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  color: {
    type: String,
    default: 'primary' // 'primary', 'secondary', 'danger', etc.
  },
  size: {
    type: String,
    default: 'md' // 'sm', 'md', 'lg'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  outline: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

/* ---------- CLASS COMPUTATION ---------- */
const computedClasses = computed(() => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3'
  }

  const colors = {
    primary: props.outline
      ? 'border border-blue-500 text-blue-500 hover:bg-blue-50'
      : 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: props.outline
      ? 'border border-gray-400 text-gray-700 hover:bg-gray-50'
      : 'bg-gray-500 text-white hover:bg-gray-600',
    danger: props.outline
      ? 'border border-red-500 text-red-600 hover:bg-red-50'
      : 'bg-red-500 text-white hover:bg-red-600'
  }

  return [
    base,
    sizes[props.size] || sizes.md,
    colors[props.color] || colors.primary,
    props.fullWidth ? 'w-full' : ''
  ].join(' ')
})

/* ---------- CLICK HANDLER ---------- */
const onClick = () => {
  if (!props.disabled) emit('click')
}
</script>

