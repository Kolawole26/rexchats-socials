
<template>
  <section class="flex flex-col gap-6">
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="bg-neutral-surface border border-neutral-line rounded-2xl p-5 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-info-50 text-info-300 flex items-center justify-center">
          <BaseCustomIcon name="logistics" customClass="w-5 h-5" />
        </div>
        <div class="flex flex-col">
          <p class="body-small text-neutral-secondary">Shipped Orders</p>
          <h3 class="text-neutral-primary">{{ shippedCount }}</h3>
        </div>
      </div>

      <div class="bg-neutral-surface border border-neutral-line rounded-2xl p-5 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-success-50 text-success-300 flex items-center justify-center">
          <BaseCustomIcon name="check_circle" customClass="w-5 h-5" />
        </div>
        <div class="flex flex-col">
          <p class="body-small text-neutral-secondary">Delivered Orders</p>
          <h3 class="text-neutral-primary">{{ deliveredCount }}</h3>
        </div>
      </div>

      <div class="bg-neutral-surface border border-neutral-line rounded-2xl p-5 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-danger-50 text-danger-300 flex items-center justify-center">
          <BaseCustomIcon name="cancel-red" customClass="w-5 h-5" />
        </div>
        <div class="flex flex-col">
          <p class="body-small text-neutral-secondary">Returned Orders</p>
          <h3 class="text-neutral-primary">{{ returnedCount }}</h3>
        </div>
      </div>
    </section>

    <div
      class="inline-flex items-center bg-neutral-surface border border-neutral-line rounded-xl p-1 gap-1 w-fit"
      role="tablist"
      aria-label="Shipment status"
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
        title="All shippings"
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

        <template #courier="slotProps">
          <span class="inline-flex items-center rounded-full px-3 py-1 bg-neutral-muted text-neutral-primary body-xsmall">
            {{ slotProps.data.courier || 'N/A' }}
          </span>
        </template>

        <template #tracking_id="slotProps">
          <p class="body-small text-neutral-primary">{{ slotProps.data.tracking_id || 'N/A' }}</p>
        </template>

        <template #city="slotProps">
          <p class="body-small text-neutral-primary">{{ slotProps.data.city || 'N/A' }}</p>
        </template>

        <template #date="slotProps">
          <div class="flex flex-col min-w-0">
            <p class="body-small text-neutral-primary">{{ slotProps.data.date || 'N/A' }}</p>
            <p class="body-xsmall text-neutral-secondary">{{ slotProps.data.time || '' }}</p>
          </div>
        </template>

        <template #status="slotProps">
          <span class="inline-flex items-center rounded-full px-3 py-1 body-xsmall" :class="statusBadgeClass(slotProps.data.status)">
            {{ slotProps.data.status || 'Pending' }}
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
              aria-controls="shipment_menu"
              @click.stop="toggleRowMenu($event, slotProps.data)"
            />
          </div>
        </template>
      </OwnTable>

      <Menu ref="rowMenuRef" id="shipment_menu" :model="rowMenuItems" :popup="true" class="w-[220px]">
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
      v-model:visible="shipmentSidebarOpen"
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
            <BaseCustomIcon name="logistics" customClass="" />
          </div>
          <div class="flex flex-col">
            <h4 class="text-neutral-primary">{{ shipmentSidebarTitle }}</h4>
            <p class="body-small text-neutral-secondary">Set up shipping and send your customers order</p>
          </div>
        </div>

        <CommonButton
          aria-label="Close"
          type="button"
          title=""
          bgColor="bg-transparent hover:bg-neutral-muted !h-10 !w-10 !px-0"
          textColor="text-neutral-secondary"
          createIcon="cancel-red"
          @click="closeShipmentSidebar"
        />
      </div>

      <ShipmentSidebarBody
        :shipmentForm="shipmentForm"
        :mode="shipmentMode"
        :errors="shipmentErrors"
        :courierOptions="courierOptions"
        :shippingStatusOptions="shippingStatusOptions"
        :selectedRow="selectedRow"
        :validateField="validateShipmentField"
        @cancel="closeShipmentSidebar"
        @save="saveShipment"
      />
    </Sidebar>

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
          @click="orderSidebarOpen = false"
        />
      </div>

      <OrderSidebarBody
        :selectedRow="selectedRow"
        @cancel="orderSidebarOpen = false"
        @save="orderSidebarOpen = false"
      />
    </Sidebar>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import Joi from 'joi'
import OwnTable from '~/components/common/table/OwnTable.vue'
import ShipmentSidebarBody from '~/components/logistics/ShipmentSidebarBody.vue'
import OrderSidebarBody from '~/components/logistics/OrderSidebarBody.vue'

definePageMeta({
  layout: 'default',
  customProp: 'Logistics'
})

const isLoading = ref(false)

const page = ref(1)
const limit = ref(10)
const search = ref('')
const selectedStatus = ref('all')

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'Shipped', value: 'Shipped' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Returned', value: 'Returned' }
]

const columns = ref([
  { field: 'order_id', header: 'Order ID', sortable: false },
  { field: 'customer', header: 'Customer', sortable: false },
  { field: 'courier', header: 'Courier', sortable: false },
  { field: 'tracking_id', header: 'Tracking ID', sortable: false },
  { field: 'city', header: 'City', sortable: false },
  { field: 'date', header: 'Date', sortable: false },
  { field: 'status', header: 'Status', sortable: false },
  { field: 'actions_col', header: '', sortable: false }
])
const shipments = ref([
  {
    order_id: '#124567',
    customer_name: 'Micheal Scofield',
    customer_phone: '+383 44 123 456',
    courier: 'N/A',
    tracking_id: 'N/A',
    city: 'Kosovo',
    date: 'Feb 12, 2025',
    time: '11:59 PM',
    status: 'Pending'
  },
  {
    order_id: '#124568',
    customer_name: 'Micheal Scofield',
    customer_phone: '+383 44 123 456',
    courier: 'N/A',
    tracking_id: 'N/A',
    city: 'Albania',
    date: 'Feb 12, 2025',
    time: '11:59 PM',
    status: 'Pending'
  },
  {
    order_id: '#124569',
    customer_name: 'Micheal Scofield',
    customer_phone: '+383 44 123 456',
    courier: 'NPOST',
    tracking_id: '#0987654',
    city: 'Albania',
    date: 'Feb 12, 2025',
    time: '11:59 PM',
    status: 'Shipped'
  },
  {
    order_id: '#124570',
    customer_name: 'Micheal Scofield',
    customer_phone: '+383 44 123 456',
    courier: 'Posta Door2Door',
    tracking_id: '#0987654',
    city: 'Macedonia',
    date: 'Feb 12, 2025',
    time: '11:59 PM',
    status: 'Delivered'
  },
  {
    order_id: '#124571',
    customer_name: 'Micheal Scofield',
    customer_phone: '+383 44 123 456',
    courier: 'Speed Posta',
    tracking_id: '#0987654',
    city: 'Kosovo',
    date: 'Feb 12, 2025',
    time: '11:59 PM',
    status: 'Shipped'
  },
  {
    order_id: '#124572',
    customer_name: 'Micheal Scofield',
    customer_phone: '+383 44 123 456',
    courier: 'Mik Mik Courier',
    tracking_id: '#0987654',
    city: 'Kosovo',
    date: 'Feb 12, 2025',
    time: '11:59 PM',
    status: 'Delivered'
  },
  {
    order_id: '#124573',
    customer_name: 'Micheal Scofield',
    customer_phone: '+383 44 123 456',
    courier: 'Kosovo Post',
    tracking_id: '#0987654',
    city: 'Kosovo',
    date: 'Feb 12, 2025',
    time: '11:59 PM',
    status: 'Shipped'
  },
  {
    order_id: '#124574',
    customer_name: 'Micheal Scofield',
    customer_phone: '+383 44 123 456',
    courier: 'Kosovo Post',
    tracking_id: '#0987654',
    city: 'Kosovo',
    date: 'Feb 12, 2025',
    time: '11:59 PM',
    status: 'Returned'
  }
])
const filters = reactive({
  courier: null,
  city: null,
  status: null,
  fromDate: null,
  toDate: null
})

const courierOptions = [
  { name: 'N/A', value: 'N/A' },
  { name: 'NPOST', value: 'NPOST' },
  { name: 'Posta Door2Door', value: 'Posta Door2Door' },
  { name: 'Speed Posta', value: 'Speed Posta' },
  { name: 'Mik Mik Courier', value: 'Mik Mik Courier' },
  { name: 'Kosovo Post', value: 'Kosovo Post' }
]

const cityOptions = [
  { name: 'Kosovo', value: 'Kosovo' },
  { name: 'Albania', value: 'Albania' },
  { name: 'Macedonia', value: 'Macedonia' }
]

const shippingStatusOptions = [
  { name: 'Confirmed', value: 'Confirmed' },
  { name: 'Pending', value: 'Pending' },
  { name: 'Shipped', value: 'Shipped' },
  { name: 'Delivered', value: 'Delivered' },
  { name: 'Returned', value: 'Returned' }
]

const filterMenuItems = computed(() => [
  { label: 'Courier', field: 'Select', options: courierOptions },
  { label: 'City', field: 'Select', options: cityOptions },
  { label: 'Status', field: 'Select', options: shippingStatusOptions },
  { label: 'Date', hasDates: true }
])

const filterMenuRef = ref(null)

const openFilterMenu = (event) => {
  filterMenuRef.value?.toggle(event)
}

const resetFilters = () => {
  filters.courier = null
  filters.city = null
  filters.status = null
  filters.fromDate = null
  filters.toDate = null
  page.value = 1
}

const applyFilters = (values) => {
  const dateRange = values?.[3] || { fromDate: null, toDate: null }

  filters.courier = values?.[0] || null
  filters.city = values?.[1] || null
  filters.status = values?.[2] || null
  filters.fromDate = dateRange?.fromDate || null
  filters.toDate = dateRange?.toDate || null
  page.value = 1
}
const normalize = (v) => String(v ?? '').toLowerCase().trim()

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

const filteredShipments = computed(() => {
  const statusFilter = selectedStatus.value
  const q = normalize(search.value)

  return shipments.value
    .filter((s) => {
      if (statusFilter === 'all') return true
      return normalize(s.status) === normalize(statusFilter)
    })
    .filter((s) => {
      if (!filters.courier) return true
      return normalize(s.courier) === normalize(filters.courier)
    })
    .filter((s) => {
      if (!filters.city) return true
      return normalize(s.city) === normalize(filters.city)
    })
    .filter((s) => {
      if (!filters.status) return true
      return normalize(s.status) === normalize(filters.status)
    })
    .filter((s) => {
      if (!filters.fromDate && !filters.toDate) return true
      const shipDate = new Date(s.date)
      if (Number.isNaN(shipDate.getTime())) return true

      if (filters.fromDate && shipDate < toStartOfDay(filters.fromDate)) return false
      if (filters.toDate && shipDate > toEndOfDay(filters.toDate)) return false

      return true
    })
    .filter((s) => {
      if (!q) return true
      const haystack = [
        s.order_id,
        s.customer_name,
        s.customer_phone,
        s.courier,
        s.tracking_id,
        s.city,
        s.status
      ]
        .map(normalize)
        .join(' ')

      return haystack.includes(q)
    })
})

const metadata = computed(() => {
  const total = filteredShipments.value.length
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
  return filteredShipments.value.slice(start, start + metadata.value.limit)
})
const shippedCount = computed(() => shipments.value.filter((s) => normalize(s.status) === 'shipped').length)
const deliveredCount = computed(() => shipments.value.filter((s) => normalize(s.status) === 'delivered').length)
const returnedCount = computed(() => shipments.value.filter((s) => normalize(s.status) === 'returned').length)

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

  filteredShipments.value.forEach((s) => {
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
  link.download = 'shipments.csv'
  link.click()

  URL.revokeObjectURL(url)
}

const rowMenuRef = ref(null)
const selectedRow = ref(null)

const rowMenuItems = computed(() => {
  const hasShipment = Boolean(
    selectedRow.value && selectedRow.value.tracking_id && selectedRow.value.tracking_id !== 'N/A'
  )

  return [
    {
      label: hasShipment ? 'Update Shipment' : 'Create Shipment',
      icon: 'logistics',
      action: hasShipment ? 'update_shipment' : 'create_shipment'
    },
    {
      label: 'View Order',
      icon: 'eye',
      action: 'view_order'
    }
  ]
})

const toggleRowMenu = (event, row) => {
  if (event && typeof event.stopPropagation === 'function') event.stopPropagation()
  selectedRow.value = row
  rowMenuRef.value?.toggle(event)
}

const shipmentSidebarOpen = ref(false)
const shipmentMode = ref('create')

const shipmentSidebarTitle = computed(() =>
  shipmentMode.value === 'update' ? 'Update Shipment' : 'Create Shipment'
)

const shipmentForm = reactive({
  trackingNumber: '',
  deliveryPrice: '',
  courier: null,
  status: null
})

const shipmentErrors = ref({})
const shipmentValidationSchema = computed(() => {
  const statusRule = Joi.string().required().messages({
    'string.empty': 'Shipping status is required',
    'any.required': 'Shipping status is required'
  })

  if (shipmentMode.value !== 'create') {
    return { status: statusRule }
  }

  return {
    trackingNumber: Joi.string().trim().min(3).required().messages({
      'string.empty': 'Tracking number is required',
      'any.required': 'Tracking number is required',
      'string.min': 'Tracking number must be at least 3 characters'
    }),
    courier: Joi.string().required().messages({
      'string.empty': 'Courier is required',
      'any.required': 'Courier is required'
    }),
    status: statusRule
  }
})

const validateShipmentField = (field) => {
  const valueMap = {
    trackingNumber: shipmentForm.trackingNumber,
    courier: shipmentForm.courier,
    status: shipmentForm.status
  }

  const rule = shipmentValidationSchema.value[field]
  if (!rule) return

  const result = rule.validate(valueMap[field])

  if (result.error) {
    shipmentErrors.value[field] = result.error.details[0].message
    return
  }

  delete shipmentErrors.value[field]
}

const validateShipmentForm = () => {
  const keys = Object.keys(shipmentValidationSchema.value)
  keys.forEach((field) => validateShipmentField(field))
  return keys.every((field) => !shipmentErrors.value[field])
}
const openShipmentSidebar = (mode) => {
  shipmentMode.value = mode
  shipmentErrors.value = {}

  shipmentForm.trackingNumber = ''
  shipmentForm.deliveryPrice = ''
  shipmentForm.courier = null
  shipmentForm.status = null

  if (mode === 'update') {
    shipmentForm.status = selectedRow.value?.status || null
    shipmentSidebarOpen.value = true
    return
  }

  shipmentForm.status = 'Confirmed'
  shipmentSidebarOpen.value = true
}

const closeShipmentSidebar = () => {
  shipmentSidebarOpen.value = false
}

const saveShipment = () => {
  if (!selectedRow.value) {
    shipmentSidebarOpen.value = false
    return
  }

  if (!validateShipmentForm()) return

  if (shipmentMode.value === 'create') {
    if (shipmentForm.trackingNumber) {
      selectedRow.value.tracking_id = '#' + String(shipmentForm.trackingNumber).trim()
    }
    if (shipmentForm.courier) {
      selectedRow.value.courier = shipmentForm.courier
    }
    if (
      shipmentForm.deliveryPrice !== '' &&
      shipmentForm.deliveryPrice !== null &&
      shipmentForm.deliveryPrice !== undefined
    ) {
      selectedRow.value.delivery_price = shipmentForm.deliveryPrice
    }
  }

  if (shipmentForm.status) {
    selectedRow.value.status = shipmentForm.status
  }

  shipmentSidebarOpen.value = false
}

const orderSidebarOpen = ref(false)

const openOrderSidebarFromRow = (row) => {
  selectedRow.value = row
  orderSidebarOpen.value = true
}

const onRowMenuCommand = (item) => {
  if (!item || !item.action) return

  if (item.action === 'create_shipment') return openShipmentSidebar('create')
  if (item.action === 'update_shipment') return openShipmentSidebar('update')
  if (item.action === 'view_order') {
    orderSidebarOpen.value = true
    return
  }
}
</script>












