
<template>
  <section class="flex flex-col gap-6">
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <CommonCards
        title="Pending Orders"
        :value="pendingCount"
        icon="orders"
        iconWrapperClass="bg-brand-pink-background text-brand-pink-foreground"
      />

      <CommonCards
        title="Confirmed Orders"
        :value="confirmedCount"
        icon="orders"
        iconWrapperClass="bg-brand-purple-background text-brand-purple-foreground"
      />

      <CommonCards
        title="Shipped Orders"
        :value="shippedCount"
        icon="orders"
        iconWrapperClass="bg-brand-blue-background text-brand-blue-foreground"
      />

      <CommonCards
        title="Delivered Orders"
        :value="deliveredCount"
        icon="orders"
        iconWrapperClass="bg-brand-moss-background text-brand-moss-foreground"
      />

      <CommonCards
        title="Returned Orders"
        :value="returnedCount"
        icon="orders"
        iconWrapperClass="bg-brand-pink-background text-brand-pink-foreground"
      />
    </section>

    <div
      class="inline-flex items-center bg-neutral-surface border border-neutral-line rounded-xl p-1 gap-1 w-fit"
      role="tablist"
      aria-label="Order status"
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
        title="All orders"
        :row_count="metadata.total"
        count_label=""
        :mock-data="tableData"
        :loading="isLoading"
        :metadata="metadata"
        :hasSearch="false"
        :hasPagination="true"
        @onPagination="updateState"
        @onLimit="updateState"
        @onView="openOrderSidebarFromRow"
      >
        <template #actions>
          <div class="flex items-center gap-3 w-full sm:w-auto">
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
              title="Export"
              type="button"
              bgColor="bg-transparent border border-primary-300 hover:bg-primary-50 !h-10"
              textColor="text-primary-400 button"
              createIcon="download"
              @click="exportCsv"
            />
          </div>
        </template>

        <template #header><div class="hidden" /></template>

        <template #order_id="slotProps">
          <p class="body-small text-neutral-primary">{{ slotProps.data.order_id }}</p>
        </template>

        <template #customer="slotProps">
          <div class="flex flex-col min-w-0">
            <p class="body-small text-neutral-primary truncate">{{ slotProps.data.customer_name }}</p>
            <p class="body-xsmall text-neutral-secondary truncate">{{ slotProps.data.customer_phone }}</p>
          </div>
        </template>

        <template #platform="slotProps">
          <div class="flex items-center gap-2">
            <span
              class="w-5 h-5 rounded-full flex items-center justify-center"
              :class="platformPillClass(slotProps.data.platform)"
              aria-hidden="true"
            >
              <BaseCustomIcon :name="platformIcon(slotProps.data.platform)" customClass="w-3.5 h-3.5" />
            </span>
            <p class="body-small text-neutral-primary">{{ platformLabel(slotProps.data.platform) }}</p>
          </div>
        </template>

        <template #quantity="slotProps">
          <p class="body-small text-neutral-primary">{{ slotProps.data.quantity }}</p>
        </template>

        <template #item_price="slotProps">
          <p class="body-small text-neutral-primary">{{ formatCurrency(slotProps.data.item_price) }}</p>
        </template>

        <template #payment="slotProps">
          <span class="inline-flex items-center gap-2 rounded-full px-3 py-1 body-xsmall" :class="paymentPillClass(slotProps.data.payment)">
            {{ paymentLabel(slotProps.data.payment) }}
          </span>
        </template>

        <template #date="slotProps">
          <div class="flex flex-col min-w-0">
            <p class="body-small text-neutral-primary">{{ slotProps.data.date || 'N/A' }}</p>
            <p class="body-xsmall text-neutral-secondary">{{ slotProps.data.time || '' }}</p>
          </div>
        </template>

        <template #status="slotProps">
          <span class="inline-flex items-center rounded-full px-3 py-1 body-xsmall" :class="orderStatusClass(slotProps.data.status)">
            {{ orderStatusLabel(slotProps.data.status) }}
          </span>
        </template>

        <template #actions_col="slotProps">
          <div class="flex justify-end">
            <CommonButton
              title=""
              type="button"
              bgColor="bg-transparent hover:bg-neutral-muted !h-10 !w-10 !px-0"
              textColor="text-neutral-secondary"
              createIcon="3dot"
              aria-haspopup="true"
              aria-controls="order_menu"
              @click.stop="toggleRowMenu($event, slotProps.data)"
            />
          </div>
        </template>
      </OwnTable>

      <Menu ref="rowMenuRef" id="order_menu" :model="rowMenuItems" :popup="true" class="w-[220px]">
        <template #item="{ item, props }">
          <a
            v-ripple
            href="#"
            v-bind="props.action"
            class="flex items-center justify-between"
            @click.prevent="onRowMenuCommand(item)"
          >
            <span class="ml-2 body-xsmall text-neutral-primary">{{ item.label }}</span>
            <div class="w-4 text-neutral-secondary"><BaseCustomIcon :name="item.icon" /></div>
          </a>
        </template>
      </Menu>
    </section>


    <Sidebar
      v-model:visible="orderSidebarOpen"
      position="right"
      :style="{ maxWidth: '400px', width: '100%' }"
      modal
      class="custom-modal-drawer rounded-tl-lg rounded-bl-lg"
      :showCloseIcon="false"
      :show-header="false"
    >
      <div class="w-full flex items-start justify-between gap-3 p-6">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-xl bg-neutral-background border border-neutral-line flex items-center justify-center text-neutral-primary">
            <BaseCustomIcon name="orders" customClass="" />
          </div>
          <div class="flex flex-col">
            <h4 class="text-neutral-primary">Your order</h4>
            <p class="body-small text-neutral-secondary">View and manage your customer order details</p>
          </div>
        </div>

        <CommonButton
          aria-label="Close"
          type="button"
          title=""
          bgColor="bg-transparent hover:bg-neutral-muted !h-10 !w-10 !px-0"
          textColor="text-neutral-secondary"
          createIcon="cancel-red"
          @click="closeOrderSidebar"
        />
      </div>

      <OrderSidebarBody
        :selectedOrder="selectedOrder"
        :orderForm="orderForm"
        :errors="orderErrors"
        :paymentOptions="paymentOptions"
        :statusOptions="orderStatusOptions"
        :validateField="validateOrderField"
        @cancel="closeOrderSidebar"
        @save="saveOrder"
      />
    </Sidebar>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import Joi from 'joi'
import OwnTable from '~/components/common/table/OwnTable.vue'
import OrderSidebarBody from '~/components/orders/OrderSidebarBody.vue'

definePageMeta({
  layout: 'default',
  customProp: 'Orders'
})

const isLoading = ref(false)

const page = ref(1)
const limit = ref(10)
const search = ref('')
const selectedStatus = ref('all')

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Returned', value: 'returned' }
]

const columns = ref([
  { field: 'order_id', header: 'Order ID', sortable: false },
  { field: 'customer', header: 'Customer', sortable: false },
  { field: 'platform', header: 'Platform', sortable: false },
  { field: 'quantity', header: 'Quantity', sortable: false },
  { field: 'item_price', header: 'Item Price', sortable: false },
  { field: 'payment', header: 'Payment', sortable: false },
  { field: 'date', header: 'Date', sortable: false },
  { field: 'status', header: 'Status', sortable: false },
  { field: 'actions_col', header: '', sortable: false }
])
const orders = ref([
  {
    id: 'order-1',
    order_id: '#124567',
    customer_name: 'Micheal Scofield',
    customer_phone: '+383 44 123 456',
    platform: 'facebook',
    quantity: 12,
    item_price: 1000,
    payment: 'pending',
    date: 'Feb 12, 2025',
    time: '11:59 PM',
    status: 'shipped',
    tracking_id: '#1234567',
    courier: 'NPOST',
    city: 'PrishtinÃƒÂ«',
    address: 'Rruga B, Hyrja 12, Banesa 45',
    postal_code: '10000',
    item_total: 950,
    delivery_fee: 50,
    total_amount: 1000,
    items: [
      {
        qty: 1,
        name: 'Xhaketa DimÃƒÂ«rore (M / Black)',
        size: 'M',
        color: 'Red',
        colorClass: 'bg-danger-300',
        unitCount: 1,
        price: 500
      },
      {
        qty: 1,
        name: 'Xhaketa DimÃƒÂ«rore (M / Black)',
        size: 'M',
        color: 'Purple',
        colorClass: 'bg-primary-300',
        unitCount: 1,
        price: 200
      },
      {
        qty: 1,
        name: 'Xhaketa DimÃƒÂ«rore (M / Black)',
        size: 'M',
        color: 'Purple',
        colorClass: 'bg-primary-300',
        unitCount: 1,
        price: 250
      }
    ]
  },
  {
    id: 'order-2',
    order_id: '#124568',
    customer_name: 'Micheal Scofield',
    customer_phone: '+383 44 123 456',
    platform: 'facebook',
    quantity: 12,
    item_price: 1000,
    payment: 'pending',
    date: 'Feb 12, 2025',
    time: '11:59 PM',
    status: 'confirmed',
    tracking_id: null,
    courier: 'N/A',
    city: 'PrishtinÃƒÂ«',
    address: 'Rruga B, Hyrja 12, Banesa 45',
    postal_code: '10000',
    item_total: 950,
    delivery_fee: 50,
    total_amount: 1000,
    items: []
  },
  {
    id: 'order-3',
    order_id: '#124569',
    customer_name: 'Micheal Scofield',
    customer_phone: '+383 44 123 456',
    platform: 'instagram',
    quantity: 12,
    item_price: 1000,
    payment: 'pending',
    date: 'Feb 12, 2025',
    time: '11:59 PM',
    status: 'pending',
    tracking_id: null,
    courier: 'N/A',
    city: 'PrishtinÃƒÂ«',
    address: 'Rruga B, Hyrja 12, Banesa 45',
    postal_code: '10000',
    item_total: 950,
    delivery_fee: 50,
    total_amount: 1000,
    items: []
  },
  {
    id: 'order-4',
    order_id: '#124570',
    customer_name: 'Micheal Scofield',
    customer_phone: '+383 44 123 456',
    platform: 'instagram',
    quantity: 12,
    item_price: 1000,
    payment: 'refund',
    date: 'Feb 12, 2025',
    time: '11:59 PM',
    status: 'returned',
    tracking_id: null,
    courier: 'NPOST',
    city: 'PrishtinÃƒÂ«',
    address: 'Rruga B, Hyrja 12, Banesa 45',
    postal_code: '10000',
    item_total: 950,
    delivery_fee: 50,
    total_amount: 1000,
    items: []
  },
  {
    id: 'order-5',
    order_id: '#124571',
    customer_name: 'Micheal Scofield',
    customer_phone: '+383 44 123 456',
    platform: 'instagram',
    quantity: 12,
    item_price: 1000,
    payment: 'paid',
    date: 'Feb 12, 2025',
    time: '11:59 PM',
    status: 'delivered',
    tracking_id: '#1234567',
    courier: 'NPOST',
    city: 'PrishtinÃƒÂ«',
    address: 'Rruga B, Hyrja 12, Banesa 45',
    postal_code: '10000',
    item_total: 950,
    delivery_fee: 50,
    total_amount: 1000,
    items: []
  },
  {
    id: 'order-6',
    order_id: '#124572',
    customer_name: 'Jane Doe',
    customer_phone: '+383 44 456 789',
    platform: 'facebook',
    quantity: 8,
    item_price: 780,
    payment: 'paid',
    date: 'Feb 13, 2025',
    time: '10:10 AM',
    status: 'delivered',
    tracking_id: '#9911223',
    courier: 'NPOST',
    city: 'PrishtinÃƒÂ«',
    address: 'Rruga A, Hyrja 3, Banesa 11',
    postal_code: '10000',
    item_total: 750,
    delivery_fee: 30,
    total_amount: 780,
    items: []
  },
  {
    id: 'order-7',
    order_id: '#124573',
    customer_name: 'Rita Chevron',
    customer_phone: '+383 44 222 333',
    platform: 'facebook',
    quantity: 2,
    item_price: 150,
    payment: 'pending',
    date: 'Feb 14, 2025',
    time: '04:45 PM',
    status: 'pending',
    tracking_id: null,
    courier: 'N/A',
    city: 'PrishtinÃƒÂ«',
    address: 'Rruga C, Hyrja 2, Banesa 5',
    postal_code: '10000',
    item_total: 130,
    delivery_fee: 20,
    total_amount: 150,
    items: []
  },
  {
    id: 'order-8',
    order_id: '#124574',
    customer_name: 'Rita Chevron',
    customer_phone: '+383 44 222 333',
    platform: 'instagram',
    quantity: 1,
    item_price: 200,
    payment: 'pending',
    date: 'Feb 15, 2025',
    time: '09:25 AM',
    status: 'confirmed',
    tracking_id: null,
    courier: 'N/A',
    city: 'PrishtinÃƒÂ«',
    address: 'Rruga C, Hyrja 2, Banesa 5',
    postal_code: '10000',
    item_total: 180,
    delivery_fee: 20,
    total_amount: 200,
    items: []
  },
  {
    id: 'order-9',
    order_id: '#124575',
    customer_name: 'Rita Chevron',
    customer_phone: '+383 44 222 333',
    platform: 'facebook',
    quantity: 4,
    item_price: 420,
    payment: 'paid',
    date: 'Feb 16, 2025',
    time: '01:05 PM',
    status: 'shipped',
    tracking_id: '#2200114',
    courier: 'NPOST',
    city: 'PrishtinÃƒÂ«',
    address: 'Rruga C, Hyrja 2, Banesa 5',
    postal_code: '10000',
    item_total: 390,
    delivery_fee: 30,
    total_amount: 420,
    items: []
  },
  {
    id: 'order-10',
    order_id: '#124576',
    customer_name: 'Rita Chevron',
    customer_phone: '+383 44 222 333',
    platform: 'instagram',
    quantity: 6,
    item_price: 620,
    payment: 'refund',
    date: 'Feb 17, 2025',
    time: '06:55 PM',
    status: 'returned',
    tracking_id: null,
    courier: 'NPOST',
    city: 'PrishtinÃƒÂ«',
    address: 'Rruga C, Hyrja 2, Banesa 5',
    postal_code: '10000',
    item_total: 590,
    delivery_fee: 30,
    total_amount: 620,
    items: []
  }
])
const filters = reactive({
  platform: null,
  payment: null,
  minPrice: null,
  maxPrice: null,
  fromDate: null,
  toDate: null
})

const platformOptions = [
  { name: 'Facebook', value: 'facebook' },
  { name: 'Instagram', value: 'instagram' }
]

const paymentOptions = [
  { name: 'Pending', value: 'pending' },
  { name: 'Paid', value: 'paid' },
  { name: 'Refund', value: 'refund' }
]
const orderStatusOptions = [
  { name: 'Pending', value: 'pending' },
  { name: 'Confirmed', value: 'confirmed' },
  { name: 'Shipped', value: 'shipped' },
  { name: 'Delivered', value: 'delivered' },
  { name: 'Returned', value: 'returned' }
]
const filterMenuItems = computed(() => [
  { label: 'Platform', field: 'Select', options: platformOptions },
  { label: 'Payment', field: 'Select', options: paymentOptions },
  { label: 'Price', hasPrices: true },
  { label: 'Date', hasDates: true }
])

const filterMenuRef = ref(null)

const openFilterMenu = (event) => {
  filterMenuRef.value?.toggle(event)
}

const resetFilters = () => {
  filters.platform = null
  filters.payment = null
  filters.minPrice = null
  filters.maxPrice = null
  filters.fromDate = null
  filters.toDate = null
  page.value = 1
}

const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return null
  const cleaned = String(value).replace(/[^0-9.]/g, '')
  const n = Number(cleaned)
  return Number.isNaN(n) ? null : n
}

const applyFilters = (values) => {
  const priceRange = values?.[2] || { minPrice: null, maxPrice: null }
  const dateRange = values?.[3] || { fromDate: null, toDate: null }

  filters.platform = values?.[0] || null
  filters.payment = values?.[1] || null
  filters.minPrice = toNumber(priceRange?.minPrice)
  filters.maxPrice = toNumber(priceRange?.maxPrice)
  filters.fromDate = dateRange?.fromDate || null
  filters.toDate = dateRange?.toDate || null
  page.value = 1
}
const normalize = (v) => String(v ?? '').toLowerCase().trim()
const platformIcon = (platform) => {
  const p = normalize(platform)
  if (p.includes('insta')) return 'instagram'
  return 'facebook'
}

const platformLabel = (platform) => {
  const p = normalize(platform)
  if (p.includes('insta')) return 'Instagram'
  return 'Facebook'
}

const platformPillClass = (platform) => {
  const p = normalize(platform)
  if (p.includes('insta')) return 'bg-danger-50 text-danger-300'
  return 'bg-info-50 text-info-300'
}

const paymentLabel = (status) => {
  const s = normalize(status)
  if (s === 'paid') return 'Paid'
  if (s === 'refund') return 'Refund'
  return 'Pending'
}

const paymentPillClass = (status) => {
  const s = normalize(status)
  if (s === 'paid') return 'bg-success-50 text-success-300'
  if (s === 'refund') return 'bg-danger-50 text-danger-300'
  return 'bg-warning-50 text-warning-300'
}

const orderStatusLabel = (status) => {
  const s = normalize(status)
  if (!s) return 'Pending'
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const orderStatusClass = (status) => {
  const s = normalize(status)
  if (s === 'shipped') return 'bg-info-50 text-info-300'
  if (s === 'delivered') return 'bg-success-50 text-success-300'
  if (s === 'returned') return 'bg-danger-50 text-danger-300'
  if (s === 'confirmed') return 'bg-primary-50 text-primary-300'
  return 'bg-warning-50 text-warning-300'
}

const formatCurrency = (value) => {
  const n = Number(value)
  if (Number.isNaN(n)) return 'â‚¬0.00'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(n)
}

const toStartOfDay = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

const toEndOfDay = (date) => {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

const filteredOrders = computed(() => {
  const statusFilter = normalize(selectedStatus.value)
  const q = normalize(search.value)

  return orders.value.filter((o) => {
    if (statusFilter !== 'all' && normalize(o.status) !== statusFilter) return false

    if (filters.platform && normalize(o.platform) !== normalize(filters.platform)) return false
    if (filters.payment && normalize(o.payment) !== normalize(filters.payment)) return false

    const price = Number(o.item_price)
    if (filters.minPrice !== null && price < filters.minPrice) return false
    if (filters.maxPrice !== null && price > filters.maxPrice) return false

    const d = new Date(o.date)
    if (!Number.isNaN(d.getTime())) {
      if (filters.fromDate && d < toStartOfDay(filters.fromDate)) return false
      if (filters.toDate && d > toEndOfDay(filters.toDate)) return false
    }

    if (!q) return true

    const haystack = [o.order_id, o.customer_name, o.customer_phone, o.platform, o.payment, o.status]
      .map(normalize)
      .join(' ')

    return haystack.includes(q)
  })
})
const metadata = computed(() => {
  const total = filteredOrders.value.length
  const pages = Math.max(1, Math.ceil(total / limit.value))
  const safePage = Math.min(page.value, pages)

  return {
    page: safePage,
    limit: limit.value,
    total,
    pages
  }
})

const tableData = computed(() => {
  const start = (metadata.value.page - 1) * metadata.value.limit
  return filteredOrders.value.slice(start, start + metadata.value.limit)
})
const pendingCount = computed(() => orders.value.filter((s) => normalize(s.status) === 'pending').length)
const confirmedCount = computed(() => orders.value.filter((s) => normalize(s.status) === 'confirmed').length)
const shippedCount = computed(() => orders.value.filter((s) => normalize(s.status) === 'shipped').length)
const deliveredCount = computed(() => orders.value.filter((s) => normalize(s.status) === 'delivered').length)
const returnedCount = computed(() => orders.value.filter((s) => normalize(s.status) === 'returned').length)

const onSearchInput = () => {
  page.value = 1
}

const updateState = (key, value) => {
  if (key === 'page') page.value = value
  if (key === 'limit') {
    limit.value = value
    page.value = 1
  }
}

const statusBadgeClass = (status) => {
  const s = normalize(status)
  if (s === 'shipped') return 'bg-info-50 text-info-300'
  if (s === 'delivered') return 'bg-success-50 text-success-300'
  if (s === 'returned') return 'bg-danger-50 text-danger-300'
  return 'bg-warning-50 text-warning-300'
}
const csvEscape = (value) => {
  return '"' + String(value ?? '').replaceAll('"', '""') + '"'
}


const exportCsv = () => {
  const headers = ['Order ID', 'Customer', 'Phone', 'Courier', 'Tracking ID', 'City', 'Date', 'Time', 'Status']
  const lines = [headers.join(',')]

  filteredOrders.value.forEach((s) => {
    const row = [
      s.order_id,
      s.customer_name,
      s.customer_phone,
      s.courier,
      s.tracking_id,
      s.city,
      s.date,
      s.time,
      s.status
    ]

    lines.push(row.map(csvEscape).join(','))
  })

  const blob = new Blob([lines.join('\\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'orders.csv'
  link.click()

  URL.revokeObjectURL(url)
}

const rowMenuRef = ref(null)
const selectedRow = ref(null)

const rowMenuItems = computed(() => [{ label: 'View Order', icon: 'eye', action: 'view' }])

const toggleRowMenu = (event, row) => {
  if (event && typeof event.stopPropagation === 'function') event.stopPropagation()
  selectedRow.value = row
  rowMenuRef.value?.toggle(event)
}

const orderSidebarOpen = ref(false)
const selectedOrder = ref(null)

const orderForm = reactive({
  payment: null,
  status: null
})

const orderErrors = ref({})

const orderValidationSchema = {
  payment: Joi.string().required().messages({
    'string.empty': 'Payment status is required',
    'any.required': 'Payment status is required'
  }),
  status: Joi.string().required().messages({
    'string.empty': 'Order status is required',
    'any.required': 'Order status is required'
  })
}

const validateOrderField = (field) => {
  const rule = orderValidationSchema[field]
  if (!rule) return

  const result = rule.validate(orderForm[field])

  if (result.error) {
    orderErrors.value[field] = result.error.details[0].message
    return
  }

  delete orderErrors.value[field]
}

const validateOrderForm = () => {
  const keys = Object.keys(orderValidationSchema)
  keys.forEach((field) => validateOrderField(field))
  return keys.every((field) => !orderErrors.value[field])
}

const openOrderSidebarFromRow = (row) => {
  selectedRow.value = row
  selectedOrder.value = row
  orderErrors.value = {}

  orderForm.payment = row?.payment || null
  orderForm.status = row?.status || null

  orderSidebarOpen.value = true
}

const closeOrderSidebar = () => {
  orderSidebarOpen.value = false
}

const saveOrder = () => {
  if (!selectedOrder.value) {
    closeOrderSidebar()
    return
  }

  if (!validateOrderForm()) return

  selectedOrder.value.payment = orderForm.payment
  selectedOrder.value.status = orderForm.status

  closeOrderSidebar()
}

const onRowMenuCommand = (item) => {
  if (!item || item.action !== 'view') return
  if (!selectedRow.value) return
  openOrderSidebarFromRow(selectedRow.value)
}
</script>
