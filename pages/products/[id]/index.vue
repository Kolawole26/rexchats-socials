<template>
  <section class="flex flex-col gap-8">
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-2 min-w-0">
        <NuxtLink to="/products" class="body-small text-neutral-secondary hover:underline">Products</NuxtLink>
        <BaseCustomIcon name="chevron-down" customClass="w-4 h-4 text-neutral-secondary -rotate-90" />
        <p class="body-small text-neutral-primary font-semibold truncate">{{ product.name }}</p>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <div class="w-[160px]">
          <FormSelect
            v-model="product.status"
            name="product_status"
            placeholder="Select"
            :options="statusOptions"
          />
        </div>

        <CommonButton
          title="Edit"
          type="button"
          bgColor="bg-primary-300 hover:bg-primary-400 !h-10"
          textColor="text-neutral-inverted button"
          createIcon="pen"
          @click="goToEdit"
        />

        <CommonButton
          aria-label="Delete product"
          title=""
          type="button"
          bgColor="bg-danger-300 hover:bg-danger-400 !h-10 !w-10 !px-0"
          textColor="text-neutral-inverted"
          createIcon="trash"
          @click="onDelete"
        />
      </div>
    </div>

    <div class="max-w-[720px] mx-auto w-full">
      <h3 class="text-neutral-primary mb-6">{{ product.name }}</h3>

      <div class="flex flex-col gap-6">
        <div class="bg-neutral-surface border border-neutral-line rounded-2xl p-6">
          <div class="flex flex-col gap-4">
            <div>
              <p class="body-xsmall text-neutral-secondary">Product Title</p>
              <p class="body-small text-neutral-primary mt-1">{{ product.name }}</p>
            </div>

            <div class="border-t border-neutral-line pt-4">
              <p class="body-xsmall text-neutral-secondary">Product ID</p>
              <p class="body-small text-neutral-primary mt-1">#{{ product.id }}</p>
            </div>

            <div class="border-t border-neutral-line pt-4">
              <p class="body-xsmall text-neutral-secondary">Product Description</p>
              <p class="body-small text-neutral-primary mt-1">{{ product.description }}</p>
            </div>

            <div class="border-t border-neutral-line pt-4">
              <p class="body-xsmall text-neutral-secondary mb-3">Product Images</p>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div
                  v-for="(img, index) in product.images"
                  :key="index"
                  class="h-[110px] rounded-2xl overflow-hidden bg-neutral-muted border border-neutral-line"
                >
                  <img :src="img" alt="Product image" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-neutral-surface border border-neutral-line rounded-2xl p-6">
          <div class="flex flex-col gap-4">
            <div>
              <p class="body-xsmall text-neutral-secondary">Product Type</p>
              <p class="body-small text-neutral-primary mt-1">{{ product.type }}</p>
            </div>

            <div class="border-t border-neutral-line pt-4">
              <p class="body-xsmall text-neutral-secondary mb-3">Product Keywords</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="keyword in product.keywords"
                  :key="keyword"
                  class="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 border border-primary-100"
                >
                  <p class="body-xsmall text-primary-300">{{ keyword }}</p>
                </span>
              </div>
            </div>

            <div class="border-t border-neutral-line pt-4">
              <div class="flex items-center gap-2">
                <p class="body-small text-neutral-primary">This product has</p>
                <span class="bg-primary-50 border border-primary-75 rounded-full px-3 py-1">
                  <p class="body-xsmall text-neutral-primary">{{ product.variants.length }}</p>
                </span>
                <p class="body-small text-neutral-primary">variant(s)</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-neutral-surface border border-neutral-line rounded-2xl p-6">
          <div class="grid grid-cols-[24px_1fr_1fr_1fr] gap-3 items-center mb-3">
            <div />
            <p class="body-xsmall text-neutral-secondary">Size</p>
            <p class="body-xsmall text-neutral-secondary">Colour</p>
            <p class="body-xsmall text-neutral-secondary">Price</p>
          </div>

          <div class="flex flex-col gap-4">
            <div
              v-for="(variant, index) in product.variants"
              :key="index"
              class="grid grid-cols-[24px_1fr_1fr_1fr] gap-3"
            >
              <p class="body-small text-neutral-secondary">{{ index + 1 }}.</p>
              <p class="body-small text-neutral-primary">{{ variant.size }}</p>
              <p class="body-small text-neutral-primary">{{ variant.colour }}</p>
              <p class="body-small text-neutral-primary">{{ formatCurrency(variant.price) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import sample1 from '~/assets/images/products/sample-1.png'
import sample2 from '~/assets/images/products/sample-2.png'
import sample3 from '~/assets/images/products/sample-3.png'
import sample4 from '~/assets/images/products/sample-4.png'
import sample5 from '~/assets/images/products/sample-5.png'
import sample6 from '~/assets/images/products/sample-6.png'

const route = useRoute()
const router = useRouter()

const statusOptions = [
  { name: 'Active', value: 'active' },
  { name: 'Inactive', value: 'inactive' }
]

const currency = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2
})

const formatCurrency = (value) => {
  const n = Number(value || 0)
  if (Number.isNaN(n)) return '�'
  return currency.format(n)
}

const allProducts = [
  {
    id: '12345',
    name: 'Jasmin Jacket',
    description:
      'This is a unisex leather jacket suitable for winter or spring weather but can be rocked whenever',
    type: 'Jacket',
    status: 'active',
    images: [sample1, sample1, sample1, sample1],
    keywords: [
      '#Shirt',
      '#Leather',
      '#Jacket',
      '#Jasmin',
      '#JasminJacket',
      '#BikerJacket',
      '#BlackJacket',
      '#Premium',
      '#PremiumJacket'
    ],
    variants: [
      { size: 'Medium (XL)', colour: 'Black', price: 100 },
      { size: 'Large (L)', colour: 'Black', price: 100 },
      { size: 'Extra Large (XL)', colour: 'Black', price: 100 }
    ]
  },
  {
    id: '12346',
    name: 'Nike Sweat Shirt',
    description: 'Comfortable sweat shirt for all seasons.',
    type: 'Shirt',
    status: 'inactive',
    images: [sample2, sample2, sample2, sample2],
    keywords: ['#Shirt', '#Premium'],
    variants: [
      { size: 'Small', colour: 'Grey', price: 50 },
      { size: 'Medium', colour: 'Grey', price: 50 }
    ]
  },
  {
    id: '12347',
    name: 'Plain Trouser',
    description: 'A classic plain trouser for everyday use.',
    type: 'Trouser',
    status: 'active',
    images: [sample3, sample3, sample3, sample3],
    keywords: ['#Trouser'],
    variants: [{ size: '32', colour: 'Black', price: 40 }]
  }
]

const findById = (id) => {
  const match = allProducts.find((p) => String(p.id) === String(id))
  return match || allProducts[0]
}

const initial = findById(route.params.id)

const product = reactive({
  id: initial.id,
  name: initial.name,
  description: initial.description,
  type: initial.type,
  status: initial.status,
  images: initial.images,
  keywords: initial.keywords,
  variants: initial.variants
})

const goToEdit = () => {
  router.push('/products/' + String(product.id) + '/edit')
}

const onDelete = () => {
  router.push('/products')
}
</script>

