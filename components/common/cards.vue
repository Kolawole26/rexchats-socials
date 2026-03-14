<template>
  <div class="bg-neutral-surface border border-neutral-line rounded-2xl p-5">
    <div class="flex items-center gap-x-2 mb-2">
      <div
        class="w-10 h-10 rounded-xl flex items-center justify-center"
        :class="resolvedIconWrapperClass"
      >
        <BaseCustomIcon :name="icon" :customClass="iconClass" />
      </div>
      <p class="body-small text-neutral-secondary">{{ title }}</p>
    </div>

    <div class="flex flex-col">
      <h3 class="text-neutral-primary">{{ formattedValue }}</h3>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  iconWrapperClass: {
    type: String,
    default: ''
  },
  iconClass: {
    type: String,
    default: 'w-5 h-5'
  },

  // Backwards-compatible alias
  color: {
    type: String,
    default: ''
  },

  // Optional formatting
  format: {
    type: String,
    default: 'number',
    validator: (val) => ['number', 'currency', 'percent', 'raw'].includes(val)
  },
  currency: {
    type: String,
    default: 'USD'
  },
  locale: {
    type: String,
    default: 'en-US'
  },
  decimals: {
    type: Number,
    default: null
  }
})

const resolvedIconWrapperClass = computed(() => {
  return props.iconWrapperClass || props.color || 'bg-brand-purple-background text-brand-purple-foreground'
})

const formattedValue = computed(() => {
  if (props.value === null || props.value === undefined) return '—'
  if (props.format === 'raw') return String(props.value)

  if (typeof props.value === 'string') return props.value

  const numValue = props.value
  if (typeof numValue !== 'number' || Number.isNaN(numValue)) return String(props.value)

  if (props.format === 'currency') {
    let formatted = new Intl.NumberFormat(props.locale, {
      style: 'currency',
      currency: props.currency,
      minimumFractionDigits: props.decimals !== null ? props.decimals : 2,
      maximumFractionDigits: props.decimals !== null ? props.decimals : 2
    }).format(numValue)

    if (props.currency === 'NGN') {
      formatted = formatted.replace('NGN', '₦')
    }

    return formatted.replace(/\s/g, '')
  }

  if (props.format === 'percent') {
    return new Intl.NumberFormat(props.locale, {
      style: 'percent',
      minimumFractionDigits: props.decimals !== null ? props.decimals : 0,
      maximumFractionDigits: props.decimals !== null ? props.decimals : 0
    }).format(numValue / 100)
  }

  return new Intl.NumberFormat(props.locale, {
    minimumFractionDigits: props.decimals !== null ? props.decimals : 0,
    maximumFractionDigits:
      props.decimals !== null ? props.decimals : numValue % 1 !== 0 ? 2 : 0
  }).format(numValue)
})
</script>