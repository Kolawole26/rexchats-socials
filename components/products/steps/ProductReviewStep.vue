<template>
  <section class="max-w-[720px] mx-auto w-full">
    <h3 class="text-neutral-primary mb-6">Product Review</h3>

    <div class="flex flex-col gap-6">
      <div class="bg-neutral-surface border border-neutral-line rounded-2xl p-6">
        <div class="flex flex-col gap-4">
          <div>
            <p class="body-xsmall text-neutral-secondary">Product Title</p>
            <p class="body-small text-neutral-primary mt-1">{{ productForm.name || '—' }}</p>
          </div>

          <div class="border-t border-neutral-line pt-4">
            <p class="body-xsmall text-neutral-secondary">Product Description</p>
            <p class="body-small text-neutral-primary mt-1">{{ productForm.description || '—' }}</p>
          </div>

          <div class="border-t border-neutral-line pt-4">
            <p class="body-xsmall text-neutral-secondary mb-3">Product Images</p>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                v-for="(img, index) in images"
                :key="index"
                class="h-[110px] rounded-2xl overflow-hidden bg-neutral-muted border border-neutral-line"
              >
                <img v-if="img" :src="img" alt="Product image" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <BaseCustomIcon name="products" customClass="w-6 h-6 text-neutral-secondary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-neutral-surface border border-neutral-line rounded-2xl p-6">
        <div class="flex flex-col gap-4">
          <div>
            <p class="body-xsmall text-neutral-secondary">Product Type</p>
            <p class="body-small text-neutral-primary mt-1">{{ productForm.type || '—' }}</p>
          </div>

          <div class="border-t border-neutral-line pt-4">
            <p class="body-xsmall text-neutral-secondary mb-3">Product Keywords</p>

            <div v-if="productForm.keywords && productForm.keywords.length" class="flex flex-wrap gap-2">
              <span
                v-for="keyword in productForm.keywords"
                :key="keyword"
                class="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 border border-primary-100"
              >
                <p class="body-xsmall text-primary-300">{{ keyword }}</p>
              </span>
            </div>

            <p v-else class="body-small text-neutral-secondary">No keywords added</p>
          </div>

          <div class="border-t border-neutral-line pt-4">
            <div v-if="productForm.hasVariants" class="flex flex-col gap-4">
              <div class="flex items-center gap-2">
                <p class="body-small text-neutral-primary">This product has</p>
                <span class="bg-primary-50 border border-primary-75 rounded-full px-3 py-1">
                  <p class="body-xsmall text-neutral-primary">{{ variantCount }}</p>
                </span>
                <p class="body-small text-neutral-primary">variant(s)</p>
              </div>

              <div class="bg-neutral-surface border border-neutral-line rounded-2xl p-4">
                <div class="grid grid-cols-[24px_1fr_1fr_1fr] gap-3 items-center mb-3">
                  <div />
                  <p class="body-xsmall text-neutral-secondary">Size</p>
                  <p class="body-xsmall text-neutral-secondary">Colour</p>
                  <p class="body-xsmall text-neutral-secondary">Price</p>
                </div>

                <div class="flex flex-col gap-4">
                  <div
                    v-for="(variant, index) in productForm.variants"
                    :key="index"
                    class="grid grid-cols-[24px_1fr_1fr_1fr] gap-3"
                  >
                    <p class="body-small text-neutral-secondary">{{ index + 1 }}.</p>
                    <p class="body-small text-neutral-primary">{{ variant.size || '—' }}</p>
                    <p class="body-small text-neutral-primary">{{ variant.colour || '—' }}</p>
                    <p class="body-small text-neutral-primary">{{ formatCurrency(variant.price) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-else>
              <p class="body-xsmall text-neutral-secondary">Product Price</p>
              <p class="body-small text-neutral-primary mt-1">{{ formatCurrency(productForm.price) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  productForm: { type: Object, required: true }
})

const currency = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2
})

const formatCurrency = (value) => {
  const n = Number(value || 0)
  if (Number.isNaN(n)) return '—'
  return currency.format(n)
}

const images = computed(() => {
  const value = Array.isArray(props.productForm.images) ? props.productForm.images : []
  const next = value.slice(0, 4)
  while (next.length < 4) next.push(null)
  return next
})

const variantCount = computed(() => {
  const list = Array.isArray(props.productForm.variants) ? props.productForm.variants : []
  return list.length
})
</script>
