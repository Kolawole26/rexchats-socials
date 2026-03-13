<template>
  <div class="bg-neutral-20 px-[20px] py-[16px] rounded-lg">
    <div class="flex items-center mb-[6px] text-neutral-l-600">
      <div class="mr-[2px]" :class="color">
        <BaseCustomIcon :name="icon" />
      </div>
      <p class="body-small text-neutral-l-600">{{ title }}</p>
    </div>
    <div class="flex items-center">
      <h2 class="text-neutral-500 mr-3">{{ formattedValue }}</h2>
      <div v-if="trendIcon" class="flex items-center">
        <BaseCustomIcon :name="trendIcon" />
        <p
          class="body-regular"
          :class="[
            trendIcon === 'trending-down'
              ? 'text-danger-e-5'
              : trendIcon === 'trending-up'
                ? 'text-success-5'
                : 'text-warning-5'
          ]"
        >
          10%
        </p>
      </div>
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
  color: {
    type: String,
    required: true
  },
  navIcon: {
    type: String,
    required: false
  },
  navLink: {
    type: String,
    required: false
  },
  icon: {
    type: String,
    default: ''
  },
  trendIcon: {
    type: String,
    default: ''
  },
  format: {
    type: String,
    default: 'number', // 'number', 'currency', 'percent'
    validator: (val) => ['number', 'currency', 'percent'].includes(val)
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
    default: null // null means auto (depends on format)
  }
})

const formattedValue = computed(() => {
  // Handle empty values
  if (props.value === null || props.value === undefined) {
    return '—'
  }

  // Convert to number if it's a numeric string
  const numValue = typeof props.value === 'string' ? parseFloat(props.value) : props.value

  // Check if the value is a valid number
  if (typeof numValue !== 'number' || isNaN(numValue)) {
    return props.value // Return original value if not numeric
  }

  // Format based on format type
  let formatted
  switch (props.format) {
    case 'currency':
      formatted = new Intl.NumberFormat(props.locale, {
        style: 'currency',
        currency: props.currency,
        minimumFractionDigits: props.decimals !== null ? props.decimals : 2,
        maximumFractionDigits: props.decimals !== null ? props.decimals : 2
      }).format(numValue)

      // Replace "NGN" with "₦" for Nigerian Naira
      if (props.currency === 'NGN') {
        formatted = formatted.replace('NGN', '₦')
      }

      // Remove the space between the currency symbol and the value
      formatted = formatted.replace(/\s/g, '')
      return formatted

    case 'percent':
      return new Intl.NumberFormat(props.locale, {
        style: 'percent',
        minimumFractionDigits: props.decimals !== null ? props.decimals : 0,
        maximumFractionDigits: props.decimals !== null ? props.decimals : 0
      }).format(numValue / 100)

    case 'number':
    default:
      return new Intl.NumberFormat(props.locale, {
        minimumFractionDigits: props.decimals !== null ? props.decimals : 0,
        maximumFractionDigits: props.decimals !== null ? props.decimals : numValue % 1 !== 0 ? 2 : 0
      }).format(numValue)
  }
})
</script>
