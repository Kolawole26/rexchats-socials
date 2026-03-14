<template>
  <section class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <NuxtLink to="/inventory" class="body-small text-neutral-secondary hover:underline">
        Inventory
      </NuxtLink>
      <span class="body-small text-neutral-secondary" aria-hidden="true">/</span>
      <p class="body-small font-semibold text-neutral-primary">#{{ inventoryId }}</p>
    </div>

    <div
      class="inline-flex items-center bg-neutral-surface border border-neutral-line rounded-xl p-1 gap-1 w-fit"
      role="tablist"
      aria-label="Inventory status"
    >
      <CommonButton
        v-for="tab in statusTabs"
        :key="tab.value"
        type="button"
        size="sm"
        :bgColor="
          selectedStatus === tab.value
            ? 'bg-neutral-muted !h-9'
            : 'bg-transparent hover:bg-neutral-muted !h-9'
        "
        :textColor="
          selectedStatus === tab.value
            ? 'text-neutral-primary button'
            : 'text-neutral-secondary button'
        "
        @click="selectedStatus = tab.value; page = 1"
        :aria-selected="selectedStatus === tab.value"
        role="tab"
      >
        {{ tab.label }}
      </CommonButton>
    </div>

    <section class="bg-neutral-surface border border-neutral-line rounded-2xl p-6">
      <OwnTable
        :columns="columns"
        title="All Inventory"
        :row_count="tableData.length"
        count_label=""
        :mock-data="tableData"
        :loading="isLoading"
        :metadata="metadata"
        :hasSearch="false"
        :hasPagination="true"
        @onPagination="updateState"
        @onLimit="updateState"
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
          <div class="flex items-center gap-2 flex-wrap">
            <span
              v-for="(v, idx) in slotProps.data.variants"
              :key="idx"
              class="inline-flex items-center rounded-full px-3 py-1 bg-neutral-muted text-neutral-primary body-xsmall"
            >
              {{ v }}
            </span>
          </div>
        </template>

        <template #stock_count="slotProps">
          <p class="body-small text-neutral-primary">
            {{ slotProps.data.stock_count }}
          </p>
        </template>

        <template #status="slotProps">
          <span
            class="inline-flex items-center gap-2 rounded-full px-3 py-1 body-xsmall"
            :class="getStatusClasses(slotProps.data.stock_count)"
          >
            <BaseCustomIcon :name="getStatusIcon(slotProps.data.stock_count)" customClass="w-4 h-4" />
            {{ getStatusLabel(slotProps.data.stock_count) }}
          </span>
        </template>

        <template #adjust="slotProps">
          <div class="flex items-center gap-2">
            <CommonButton
              type="button"
              size="sm"
              bgColor="bg-neutral-muted hover:bg-neutral-line !h-10 !w-10 !px-0"
              textColor="text-neutral-primary"
              :disabled="slotProps.data.stock_count <= 0"
              @click="adjustStock(slotProps.data, -1)"
            >
              <BaseCustomIcon name="minus" customClass="w-4 h-4" />
            </CommonButton>

            <CommonButton
              type="button"
              size="sm"
              bgColor="bg-neutral-muted hover:bg-neutral-line !h-10 !w-10 !px-0"
              textColor="text-neutral-primary"
              @click="adjustStock(slotProps.data, 1)"
            >
              <BaseCustomIcon name="plus" customClass="w-4 h-4" />
            </CommonButton>
          </div>
        </template>
      </OwnTable>
    </section>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import OwnTable from '~/components/common/table/OwnTable.vue'

definePageMeta({
  layout: 'default',
  customProp: 'Inventory',
  prevNavProp: 'Inventory',
  prevNavLink: 'inventory'
})

const route = useRoute()

const inventoryId = computed(() => {
  const value = route.params?.id
  return value ? String(value) : ''
})

const isLoading = ref(false)

const page = ref(1)
const limit = ref(10)
const search = ref('')
const selectedStatus = ref('all')

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'In Stock', value: 'in_stock' },
  { label: 'Low Stock', value: 'low_stock' },
  { label: 'Out of Stock', value: 'out_of_stock' }
]

const columns = ref([
  { field: 'product', header: 'Product', sortable: false },
  { field: 'variants', header: 'Variants', sortable: false },
  { field: 'stock_count', header: 'Stock Count', sortable: false },
  { field: 'status', header: 'Status', sortable: false },
  { field: 'adjust', header: 'Adjust', sortable: false }
])

const sizes = ['Small (S)', 'Medium (M)', 'Large (L)', 'Extra Large (XL)']
const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Brown', 'Grey', 'Purple']

const rows = ref(
  sizes.flatMap((size, sizeIndex) =>
    colors.map((color, colorIndex) => {
      const code = (sizeIndex * colors.length + colorIndex) % 6
      const stock_count = code === 0 ? 0 : code === 1 ? 2 : code === 2 ? 1 : 4

      return {
        product_name: 'Jasmin Jacket',
        variants: [size, color],
        stock_count
      }
    })
  )
)

const getStatusKey = (count) => {
  const value = Number(count || 0)
  if (value <= 0) return 'out_of_stock'
  if (value <= 2) return 'low_stock'
  return 'in_stock'
}

const filteredRows = computed(() => {
  const query = String(search.value || '').trim().toLowerCase()
  const status = selectedStatus.value

  return rows.value.filter((r) => {
    const matchesSearch = !query
      ? true
      : String(r.product_name || '').toLowerCase().includes(query) ||
        (Array.isArray(r.variants) && r.variants.join(' ').toLowerCase().includes(query))

    if (!matchesSearch) return false

    if (status === 'all') return true
    return getStatusKey(r.stock_count) === status
  })
})

const metadata = computed(() => {
  const total = filteredRows.value.length
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
  return filteredRows.value.slice(start, start + metadata.value.limit)
})

const onSearchInput = () => {
  page.value = 1
}

const updateState = (actionType, value1) => {
  if (actionType === 'page') page.value = value1
  if (actionType === 'limit') {
    limit.value = value1
    page.value = 1
  }
}

const adjustStock = (row, delta) => {
  if (!row) return
  const next = Math.max(0, Number(row.stock_count || 0) + Number(delta || 0))
  row.stock_count = next
}

const getStatusLabel = (count) => {
  const key = getStatusKey(count)
  if (key === 'in_stock') return 'In Stock'
  if (key === 'low_stock') return 'Low Stock'
  return 'Out of Stock'
}

const getStatusIcon = (count) => {
  const key = getStatusKey(count)
  if (key === 'in_stock') return 'check_circle'
  if (key === 'low_stock') return 'not_disturb'
  return 'cancel-red'
}

const getStatusClasses = (count) => {
  const key = getStatusKey(count)
  if (key === 'in_stock') return 'bg-success-50 text-success-300'
  if (key === 'low_stock') return 'bg-warning-50 text-warning-300'
  return 'bg-danger-50 text-danger-300'
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

  const rowsToExport = filteredRows.value.map((r) => ({
    product_name: r.product_name,
    variants: Array.isArray(r.variants) ? r.variants.join(' | ') : '',
    stock_count: r.stock_count,
    status: getStatusLabel(r.stock_count)
  }))

  const headers = ['Product', 'Variants', 'Stock Count', 'Status']
  const lines = [
    headers.join(','),
    ...rowsToExport.map((r) =>
      [r.product_name, r.variants, String(r.stock_count), r.status]
        .map((v) => `"${String(v ?? '').replaceAll('"', '""')}"`)
        .join(',')
    )
  ]

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `inventory-${inventoryId.value || 'item'}.csv`
  link.click()

  URL.revokeObjectURL(url)
}
</script>

