<template>
  <article class="bg-neutral-surface border border-neutral-line rounded-2xl overflow-hidden">
    <NuxtLink :to="to" class="block focus:outline-none focus:ring-2 focus:ring-primary-100">
      <div class="h-[150px] bg-neutral-muted overflow-hidden">
        <img :src="image" :alt="name" class="w-full h-full object-cover" loading="lazy" />
      </div>

      <div class="p-4">
        <p class="body-xsmall text-neutral-secondary">#{{ productId }}</p>

        <div class="flex items-start justify-between gap-3 mt-1">
          <div class="min-w-0">
            <p class="body-small font-semibold text-neutral-primary truncate">{{ name }}</p>
            <p class="body-small text-neutral-primary">{{ priceLabel }}</p>
          </div>

          <CommonButton
            aria-label="Edit product"
            type="button"
            title=""
            bgColor="bg-transparent hover:bg-neutral-muted !h-9 !w-9 !px-0 border border-neutral-line"
            textColor="text-primary-300"
            createIcon="pen"
            @click.prevent.stop="emit('edit')"
          />
        </div>

        <div class="flex items-center justify-between gap-3 mt-3">
          <p class="body-xsmall text-neutral-secondary">{{ variantsLabel }}</p>
          <CommonStatus :status="status" />
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  to: { type: [String, Object], required: true },
  productId: { type: [String, Number], required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, default: 'active' },
  price: { type: Number, default: 0 },
  variantCount: { type: Number, default: 0 }
})

const emit = defineEmits(['edit'])

const currency = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2
})

const priceLabel = computed(() => {
  const value = currency.format(Number(props.price || 0))
  return props.variantCount > 0 ? value + '+' : value
})

const variantsLabel = computed(() => {
  const count = Number(props.variantCount || 0)
  if (!count) return 'No Variant'
  return String(count) + ' Variant'
})
</script>
