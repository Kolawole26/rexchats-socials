<template>
  <section class="bg-neutral-surface border border-neutral-line rounded-2xl p-6">
    <OwnTable
      :columns="columns"
      title="All Products"
      :row_count="tableData.length"
      count_label=""
      :mock-data="tableData"
      :loading="isLoading"
      :metadata="metadata"
      :hasSearch="false"
      :hasPagination="true"
      @onPagination="updateStateAndFetch"
      @onLimit="updateStateAndFetch"
      @onView="goToInventoryItem"
    >
      <template #actions>
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div class="w-full sm:w-[274px]">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText
                v-model="search"
                placeholder="Search"
                class="w-full"
                @input="onSearchInput"
              />
            </IconField>
          </div>

          <CommonButton
            title="Export"
            type="button"
            bgColor="bg-transparent border border-primary-300 hover:bg-primary-50 !h-10"
            textColor="text-primary-400 button"
            createIcon="download"
            @click="exportCsv"
          />
        </div>
      </template>

      <template #header>
        <div class="hidden" />
      </template>

      <template #product_id="slotProps">
        <p class="body-small text-neutral-primary">
          {{ slotProps.data.product_id }}
        </p>
      </template>

      <template #product="slotProps">
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="w-10 h-10 rounded-lg bg-neutral-muted flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <span class="body-small font-semibold text-neutral-secondary">
              {{ getProductInitials(slotProps.data.product_name) }}
            </span>
          </div>

          <p class="body-small text-neutral-primary truncate">
            {{ slotProps.data.product_name }}
          </p>
        </div>
      </template>

      <template #variants="slotProps">
        <span
          class="inline-flex items-center rounded-lg px-3 py-1 bg-neutral-muted text-neutral-primary body-xsmall"
        >
          {{ slotProps.data.variants }} Variants
        </span>
      </template>

      <template #stock_count="slotProps">
        <p class="body-small text-neutral-primary">
          {{ slotProps.data.stock_count }}
        </p>
      </template>
    </OwnTable>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import OwnTable from '~/components/common/table/OwnTable.vue'

definePageMeta({
  layout: 'default',
  customProp: 'Inventory'
})

const isLoading = ref(false)

const goToInventoryItem = async (row) => {
  const rawId = String(row?.product_id || '').replace('#', '').trim()
  if (!rawId) return
  await navigateTo('/inventory/' + rawId)
}

const page = ref(1)
const limit = ref(10)
const search = ref('')

const products = ref([
  { product_id: '#124567', product_name: 'Jasmin Jacket', variants: 4, stock_count: 12 },
  { product_id: '#124568', product_name: 'Nike Sweat Shirt', variants: 4, stock_count: 20 },
  { product_id: '#124569', product_name: 'Plain Trouser', variants: 4, stock_count: 12 },
  { product_id: '#124570', product_name: 'Nike Runner', variants: 4, stock_count: 12 },
  { product_id: '#124571', product_name: 'Gucci Bag', variants: 4, stock_count: 12 },
  { product_id: '#124572', product_name: 'Polo Ralph Face Cap', variants: 4, stock_count: 12 },
  { product_id: '#124573', product_name: 'Polo Ralph Shirt', variants: 4, stock_count: 12 },
  { product_id: '#124574', product_name: 'Loafer', variants: 4, stock_count: 12 },
  { product_id: '#124575', product_name: 'Ankle Top Sneaker', variants: 4, stock_count: 12 },
  { product_id: '#124576', product_name: 'Office Shirt', variants: 4, stock_count: 12 },
  { product_id: '#124577', product_name: 'Ball Gown', variants: 4, stock_count: 3 }
])

const columns = ref([
  { field: 'product_id', header: 'Product ID', sortable: false },
  { field: 'product', header: 'Product', sortable: false },
  { field: 'variants', header: 'Variants', sortable: false },
  { field: 'stock_count', header: 'Stock Count', sortable: false }
])

const filteredProducts = computed(() => {
  const query = String(search.value || '').trim().toLowerCase()
  if (!query) return products.value

  return products.value.filter((p) => {
    return (
      String(p.product_id || '').toLowerCase().includes(query) ||
      String(p.product_name || '').toLowerCase().includes(query)
    )
  })
})

const metadata = computed(() => {
  const total = filteredProducts.value.length
  const pages = Math.max(1, Math.ceil(total / limit.value))
  const safePage = Math.min(Math.max(1, page.value), pages)

  if (safePage !== page.value) page.value = safePage

  return {
    page: safePage,
    limit: limit.value,
    total,
    pages
  }
})

const tableData = computed(() => {
  const start = (metadata.value.page - 1) * metadata.value.limit
  return filteredProducts.value.slice(start, start + metadata.value.limit)
})

const onSearchInput = () => {
  page.value = 1
}

const updateStateAndFetch = (actionType, value1) => {
  if (actionType === 'page') page.value = value1
  if (actionType === 'limit') {
    limit.value = value1
    page.value = 1
  }
}

const getProductInitials = (name) => {
  const source = String(name || '').trim()
  if (!source) return 'P'
  const parts = source.split(/\s+/).slice(0, 2)
  return parts
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

const exportCsv = () => {
  if (!process.client) return

  const rows = filteredProducts.value.map((p) => ({
    product_id: p.product_id,
    product_name: p.product_name,
    variants: p.variants,
    stock_count: p.stock_count
  }))

  const headers = ['Product ID', 'Product', 'Variants', 'Stock Count']
  const lines = [
    headers.join(','),
    ...rows.map((r) =>
      [r.product_id, r.product_name, String(r.variants), String(r.stock_count)]
        .map((v) => `"${String(v ?? '').replaceAll('"', '""')}"`)
        .join(',')
    )
  ]

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'inventory.csv'
  link.click()

  URL.revokeObjectURL(url)
}
</script>




