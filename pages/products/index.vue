<template>
  <section class="flex flex-col gap-6">
    <section class="bg-neutral-surface border border-neutral-line rounded-2xl p-6">
      <div class="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div class="flex items-center gap-2 min-w-0">
          <h4 class="font-semibold text-neutral-primary truncate">All your products</h4>
          <div class="bg-primary-50 border border-primary-75 rounded-[100px] px-[7px] py-[1px]">
            <span class="body-xsmall text-neutral-primary">{{ filteredProducts.length }}</span>
          </div>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <div class="w-full sm:w-[274px]">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="search" placeholder="Search" class="w-full" @input="onSearchInput" />
            </IconField>
          </div>

          <CommonButton
            title="Filter"
            type="button"
            bgColor="bg-neutral-surface border border-neutral-line hover:bg-neutral-muted !h-10"
            textColor="text-neutral-secondary button"
            createIcon="filter"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            @click="openFilterMenu"
          />

          <ModalFilterMenu
            ref="filterMenuRef"
            :items="filterMenuItems"
            @reset="resetFilters"
            @apply="applyFilters"
          />

          <CommonButton
            title="Add Product"
            type="button"
            bgColor="bg-primary-300 hover:bg-primary-400 !h-10"
            textColor="text-neutral-inverted button"
            createIcon="plus"
            @click="goToAddProduct"
          />
        </div>
      </div>

      <div
        v-if="paginatedProducts.length"
        class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        <ProductsProductCard
          v-for="product in paginatedProducts"
          :key="product.id"
          :to="'/products/' + product.id"
          :product-id="product.id"
          :name="product.name"
          :image="product.image"
          :status="product.status"
          :price="product.price"
          :variant-count="product.variantCount"
          @edit="goToProduct(product.id)"
        />
      </div>

      <div v-else class="flex flex-col items-center justify-center gap-6 py-12">
        <div class="bg-neutral-muted p-5 rounded-full">
          <BaseCustomIcon name="products" />
        </div>
        <div class="text-center max-w-[406px]">
          <h4 class="mb-2 text-neutral-primary">No Products</h4>
          <p class="body-regular text-neutral-secondary">
            Your products will be displayed here when available.
          </p>
        </div>
      </div>

      <div
        v-if="filteredProducts.length"
        class="sm:flex sm:justify-center sm:items-center mt-8"
      >
        <Paginator
          :first="paginatorFirst"
          :rows="metadata.limit"
          :totalRecords="filteredProducts.length"
          :rowsPerPageOptions="limits"
          @page="onPage"
          @update:rows="onPageLimit"
        />
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import sample1 from '~/assets/images/products/sample-1.png'
import sample2 from '~/assets/images/products/sample-2.png'
import sample3 from '~/assets/images/products/sample-3.png'
import sample4 from '~/assets/images/products/sample-4.png'
import sample5 from '~/assets/images/products/sample-5.png'
import sample6 from '~/assets/images/products/sample-6.png'

const router = useRouter()

const filterMenuRef = ref(null)

const search = ref('')

const metadata = reactive({
  page: 1,
  limit: 10
})

const limits = [10, 20, 30]

const filters = reactive({
  status: null,
  minPrice: null,
  maxPrice: null,
  fromDate: null,
  toDate: null
})

const filterMenuItems = [
  {
    label: 'Status',
    field: 'Select',
    options: [
      { name: 'Active', value: 'active' },
      { name: 'Inactive', value: 'inactive' }
    ]
  },
  {
    label: 'Price',
    hasPrices: true
  },
  {
    label: 'Date Added',
    hasDates: true
  }
]

const products = ref([
  {
    id: '12345',
    name: 'Jasmin Jacket',
    price: 100,
    variantCount: 4,
    status: 'active',
    dateAdded: new Date('2025-02-12T10:00:00Z'),
    image: sample1
  },
  {
    id: '12346',
    name: 'Nike Sweat Shirt',
    price: 50,
    variantCount: 4,
    status: 'active',
    dateAdded: new Date('2025-02-12T11:00:00Z'),
    image: sample2
  },
  {
    id: '12347',
    name: 'Plain Trouser',
    price: 40,
    variantCount: 4,
    status: 'active',
    dateAdded: new Date('2025-02-11T12:00:00Z'),
    image: sample3
  },
  {
    id: '12348',
    name: 'Nike Runner',
    price: 281,
    variantCount: 4,
    status: 'inactive',
    dateAdded: new Date('2025-02-10T12:00:00Z'),
    image: sample4
  },
  {
    id: '12349',
    name: 'Gucci Bag',
    price: 21,
    variantCount: 4,
    status: 'active',
    dateAdded: new Date('2025-02-09T12:00:00Z'),
    image: sample5
  },
  {
    id: '12350',
    name: 'Polo Ralph Face Cap',
    price: 15,
    variantCount: 4,
    status: 'inactive',
    dateAdded: new Date('2025-02-08T12:00:00Z'),
    image: sample3
  },
  {
    id: '12351',
    name: 'Polo Ralph Shirt',
    price: 56.99,
    variantCount: 4,
    status: 'active',
    dateAdded: new Date('2025-02-07T12:00:00Z'),
    image: sample6
  },
  {
    id: '12352',
    name: 'Loafer',
    price: 320,
    variantCount: 4,
    status: 'inactive',
    dateAdded: new Date('2025-02-06T12:00:00Z'),
    image: sample1
  },
  {
    id: '12353',
    name: 'Ankle Top Sneakers',
    price: 67.1,
    variantCount: 4,
    status: 'active',
    dateAdded: new Date('2025-02-05T12:00:00Z'),
    image: sample5
  },
  {
    id: '12354',
    name: 'Office Shirt',
    price: 55,
    variantCount: 4,
    status: 'inactive',
    dateAdded: new Date('2025-02-04T12:00:00Z'),
    image: sample2
  },
  {
    id: '12355',
    name: 'Ball Gown',
    price: 86,
    variantCount: 4,
    status: 'active',
    dateAdded: new Date('2025-02-03T12:00:00Z'),
    image: sample4
  },
  {
    id: '12356',
    name: 'Summer Shirt',
    price: 20,
    variantCount: 4,
    status: 'inactive',
    dateAdded: new Date('2025-02-02T12:00:00Z'),
    image: sample3
  }
])

const normalize = (value) => String(value || '').toLowerCase().trim()

const filteredProducts = computed(() => {
  const q = normalize(search.value)

  return products.value.filter((p) => {
    const nameMatch = !q || normalize(p.name).includes(q) || String(p.id).includes(q)

    const statusMatch = !filters.status || normalize(p.status) === normalize(filters.status)

    const min = filters.minPrice === '' || filters.minPrice === null ? null : Number(filters.minPrice)
    const max = filters.maxPrice === '' || filters.maxPrice === null ? null : Number(filters.maxPrice)

    const priceMatch =
      (min === null || Number(p.price) >= min) && (max === null || Number(p.price) <= max)

    const from = filters.fromDate instanceof Date ? filters.fromDate : null
    const to = filters.toDate instanceof Date ? filters.toDate : null

    const dateMatch = (!from || p.dateAdded >= from) && (!to || p.dateAdded <= to)

    return nameMatch && statusMatch && priceMatch && dateMatch
  })
})

const paginatedProducts = computed(() => {
  const start = (Number(metadata.page) - 1) * Number(metadata.limit)
  return filteredProducts.value.slice(start, start + Number(metadata.limit))
})

const paginatorFirst = computed(() => {
  const currentPage = Number(metadata.page || 1)
  const currentLimit = Number(metadata.limit || 10)
  return Math.max(0, (currentPage - 1) * currentLimit)
})

const onSearchInput = () => {
  metadata.page = 1
}

const openFilterMenu = (event) => {
  filterMenuRef.value?.toggle(event)
}

const resetFilters = () => {
  filters.status = null
  filters.minPrice = null
  filters.maxPrice = null
  filters.fromDate = null
  filters.toDate = null
  metadata.page = 1
}

const applyFilters = (selected) => {
  filters.status = selected && selected[0] ? selected[0] : null

  const prices = selected && selected[1] ? selected[1] : null
  filters.minPrice = prices ? prices.minPrice : null
  filters.maxPrice = prices ? prices.maxPrice : null

  const dates = selected && selected[2] ? selected[2] : null
  filters.fromDate = dates ? dates.fromDate : null
  filters.toDate = dates ? dates.toDate : null

  metadata.page = 1
}

const onPage = (event) => {
  metadata.page = Number(event.page) + 1
}

const onPageLimit = (rows) => {
  const nextLimit = Number(rows)
  if (Number(metadata.limit) !== nextLimit) {
    metadata.limit = nextLimit
    metadata.page = 1
  }
}

const goToAddProduct = () => {
  router.push('/products/add')
}

const goToProduct = (id) => {
  router.push('/products/' + String(id))
}
</script>
