<template>
  <section class="flex flex-col gap-6">
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <CommonCards
        title="Total Vendors"
        :value="totalVendors"
        icon="vendor"
        iconWrapperClass="bg-brand-purple-background text-brand-purple-foreground"
      />

      <CommonCards
        title="Active Vendors"
        :value="activeVendors"
        icon="users"
        iconWrapperClass="bg-brand-moss-background text-brand-moss-foreground"
      />

      <CommonCards
        title="Suspended Vendors"
        :value="suspendedVendors"
        icon="not_disturb"
        iconWrapperClass="bg-brand-pink-background text-brand-pink-foreground"
      />
    </section>

    <div
      class="inline-flex items-center bg-neutral-surface border border-neutral-line rounded-xl p-1 gap-1 w-fit"
      role="tablist"
      aria-label="Vendor status"
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
        :aria-selected="selectedStatus === tab.value"
        role="tab"
        @click="selectedStatus = tab.value; page = 1"
      >
        {{ tab.label }}
      </CommonButton>
    </div>

    <section class="bg-neutral-surface border border-neutral-line rounded-2xl p-6">
      <OwnTable
        :columns="columns"
        title="All vendors"
        :row_count="metadata.total"
        count_label=""
        :mock-data="tableData"
        :loading="isLoading"
        :metadata="metadata"
        :hasSearch="false"
        :hasPagination="true"
        @onPagination="updateState"
        @onLimit="updateState"
        @onView="openVendorSidebarFromRow"
      >
        <template #actions>
          <div class="flex items-center gap-3 w-full sm:w-auto flex-wrap">
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

            <CommonButton
              title="Add Vendor"
              type="button"
              bgColor="bg-primary-300 hover:bg-primary-400 !h-10"
              textColor="text-neutral-inverted button"
              createIcon="plus"
              @click="openVendorSidebar('create')"
            />
          </div>
        </template>

        <template #header><div class="hidden" /></template>

        <template #owner="slotProps">
          <p class="body-small text-neutral-primary">{{ vendorOwnerName(slotProps.data) }}</p>
        </template>

        <template #business_name="slotProps">
          <p class="body-small text-neutral-primary">{{ slotProps.data.businessName }}</p>
        </template>

        <template #email="slotProps">
          <p class="body-small text-neutral-primary">{{ slotProps.data.email }}</p>
        </template>

        <template #platform="slotProps">
          <div class="flex items-center gap-6 flex-wrap">
            <div v-for="p in slotProps.data.platforms" :key="p" class="flex items-center gap-2">
              <span
                class="w-5 h-5 rounded-full flex items-center justify-center"
                :class="platformPillClass(p)"
                aria-hidden="true"
              >
                <BaseCustomIcon :name="platformIcon(p)" customClass="w-3.5 h-3.5" />
              </span>
              <p class="body-small text-neutral-primary">{{ platformLabel(p) }}</p>
            </div>
          </div>
        </template>

        <template #date_registered="slotProps">
          <div class="flex flex-col min-w-0">
            <p class="body-small text-neutral-primary">{{ slotProps.data.date }}</p>
            <p class="body-xsmall text-neutral-secondary">{{ slotProps.data.time }}</p>
          </div>
        </template>

        <template #status="slotProps">
          <span
            class="inline-flex items-center gap-2 rounded-full px-3 py-1 body-xsmall"
            :class="statusPillClass(slotProps.data.status)"
          >
            <span class="w-4 h-4 flex items-center justify-center" aria-hidden="true">
              <BaseCustomIcon :name="statusIcon(slotProps.data.status)" customClass="w-4 h-4" />
            </span>
            {{ statusLabel(slotProps.data.status) }}
          </span>
        </template>

        <template #actions_col="slotProps">
          <div class="flex justify-end">
            <CommonButton
              title=""
              type="button"
              bgColor="bg-transparent hover:bg-neutral-muted p-1"
              textColor="text-neutral-secondary"
              createIcon="3dot"
              aria-haspopup="true"
              aria-controls="vendor_menu"
              @click.stop="toggleRowMenu($event, slotProps.data)"
            />
          </div>
        </template>
      </OwnTable>

      <Menu ref="rowMenuRef" id="vendor_menu" :model="rowMenuItems" :popup="true" class="w-[240px]">
        <template #item="{ item, props }">
          <a
            v-ripple
            href="#"
            v-bind="props.action"
            class="flex items-center justify-between"
            @click.prevent="onRowMenuCommand(item)"
          >
            <span class="ml-2 body-xsmall text-neutral-primary">{{ item.label }}</span>
            <div class="w-4" :class="item.iconClass || 'text-neutral-secondary'">
              <BaseCustomIcon :name="item.icon" />
            </div>
          </a>
        </template>
      </Menu>
    </section>

    <Sidebar
      v-model:visible="vendorSidebarOpen"
      position="right"
      :style="{ maxWidth: '400px', width: '100%' }"
      modal
      class="custom-modal-drawer rounded-tl-lg rounded-bl-lg"
      :showCloseIcon="false"
      :show-header="false"
    >
      <div class="w-full flex items-start justify-between gap-3 p-6">
        <div class="flex items-start gap-3">
          <div
            class="p-2 rounded-xl bg-neutral-background border border-neutral-line flex items-center justify-center text-neutral-primary"
            aria-hidden="true"
          >
            <BaseCustomIcon name="vendor" customClass="" />
          </div>
          <div class="flex flex-col">
            <h4 class="text-neutral-primary">{{ vendorSidebarTitle }}</h4>
            <p class="body-small text-neutral-secondary">{{ vendorSidebarSubtitle }}</p>
          </div>
        </div>

        <CommonButton
          aria-label="Close"
          type="button"
          title=""
          bgColor="bg-transparent hover:bg-neutral-muted !h-10 !w-10 !px-0"
          textColor="text-neutral-secondary"
          createIcon="cancel-red"
          @click="closeVendorSidebar"
        />
      </div>

      <VendorSidebarBody
        :mode="vendorSidebarMode"
        :vendorForm="vendorForm"
        :errors="vendorErrors"
        :locationOptions="locationOptions"
        :statusOptions="statusOptions"
        :validateField="validateVendorField"
        :submitLabel="vendorSubmitLabel"
        @cancel="closeVendorSidebar"
        @save="saveVendor"
      />
    </Sidebar>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import Joi from 'joi'
import OwnTable from '~/components/common/table/OwnTable.vue'
import VendorSidebarBody from '~/components/vendor/VendorSidebarBody.vue'

definePageMeta({
  layout: 'default',
  customProp: 'Vendor Management'
})

const isLoading = ref(false)
const page = ref(1)
const limit = ref(10)
const search = ref('')

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Suspended', value: 'suspended' }
]

const selectedStatus = ref('all')

const locationOptions = [
  { name: 'Kosovo', value: 'Kosovo' },
  { name: 'Albania', value: 'Albania' },
  { name: 'Macedonia', value: 'Macedonia' }
]

const platformOptions = [
  { name: 'Facebook', value: 'facebook' },
  { name: 'Instagram', value: 'instagram' }
]

const statusOptions = [
  { name: 'Active', value: 'active' },
  { name: 'Suspended', value: 'suspended' }
]

const vendors = ref([
  {
    id: 'vendor-1',
    firstName: 'Rita',
    lastName: 'Chevron',
    businessName: "Rita's Clothing",
    email: 'rita@mail.com',
    phone: '+383 12 345 678',
    location: 'Kosovo',
    platforms: ['facebook', 'instagram'],
    date: 'Feb 12, 2025',
    time: '11:59 PM',
    status: 'active',
    description: '',
    faq: '',
    facebookAccess: true,
    instagramAccess: true
  },
  {
    id: 'vendor-2',
    firstName: 'Rita',
    lastName: 'Chevron',
    businessName: "Rita's Clothing",
    email: 'rita@mail.com',
    phone: '+383 12 345 678',
    location: 'Albania',
    platforms: ['facebook'],
    date: 'Feb 12, 2025',
    time: '11:59 PM',
    status: 'active',
    description: '',
    faq: '',
    facebookAccess: true,
    instagramAccess: false
  },
  {
    id: 'vendor-3',
    firstName: 'Rita',
    lastName: 'Chevron',
    businessName: "Rita's Clothing",
    email: 'rita@mail.com',
    phone: '+383 12 345 678',
    location: 'Macedonia',
    platforms: ['facebook', 'instagram'],
    date: 'Feb 12, 2025',
    time: '11:59 PM',
    status: 'suspended',
    description: '',
    faq: '',
    facebookAccess: true,
    instagramAccess: true
  }
])

const normalize = (v) => String(v ?? '').toLowerCase().trim()

const totalVendors = computed(() => vendors.value.length)
const activeVendors = computed(() => vendors.value.filter((v) => normalize(v.status) === 'active').length)
const suspendedVendors = computed(() => vendors.value.filter((v) => normalize(v.status) === 'suspended').length)

const filters = reactive({
  platform: null,
  location: null,
  status: null,
  fromDate: null,
  toDate: null
})

const filterMenuItems = computed(() => [
  { label: 'Platform', field: 'Select', options: platformOptions },
  { label: 'Location', field: 'Select', options: locationOptions },
  { label: 'Status', field: 'Select', options: statusOptions },
  { label: 'Date', hasDates: true }
])

const filterMenuRef = ref(null)

const openFilterMenu = (event) => {
  filterMenuRef.value?.toggle(event)
}

const resetFilters = () => {
  filters.platform = null
  filters.location = null
  filters.status = null
  filters.fromDate = null
  filters.toDate = null
  page.value = 1
}

const applyFilters = (values) => {
  const dateRange = values?.[3] || { fromDate: null, toDate: null }

  filters.platform = values?.[0] || null
  filters.location = values?.[1] || null
  filters.status = values?.[2] || null
  filters.fromDate = dateRange?.fromDate || null
  filters.toDate = dateRange?.toDate || null

  const nextStatus = normalize(filters.status)
  if (nextStatus === 'active' || nextStatus === 'suspended') {
    selectedStatus.value = nextStatus
  }

  page.value = 1
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

const effectiveStatus = computed(() => {
  const fromMenu = normalize(filters.status)
  if (fromMenu) return fromMenu

  const fromTab = normalize(selectedStatus.value)
  if (fromTab && fromTab !== 'all') return fromTab

  return null
})

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

const statusLabel = (status) => {
  const s = normalize(status)
  if (s === 'suspended') return 'Suspended'
  return 'Active'
}

const statusIcon = (status) => {
  const s = normalize(status)
  if (s === 'suspended') return 'cancel-red'
  return 'check-green'
}

const statusPillClass = (status) => {
  const s = normalize(status)
  if (s === 'suspended') return 'bg-danger-50 text-danger-300'
  return 'bg-success-50 text-success-300'
}

const filteredVendors = computed(() => {
  const q = normalize(search.value)
  const status = effectiveStatus.value

  return vendors.value
    .filter((v) => {
      if (!status) return true
      return normalize(v.status) === status
    })
    .filter((v) => {
      if (!filters.platform) return true
      return (v.platforms || []).map(normalize).includes(normalize(filters.platform))
    })
    .filter((v) => {
      if (!filters.location) return true
      return normalize(v.location) === normalize(filters.location)
    })
    .filter((v) => {
      if (!filters.fromDate && !filters.toDate) return true
      const activityDate = new Date(v.date)
      if (Number.isNaN(activityDate.getTime())) return true

      if (filters.fromDate && activityDate < toStartOfDay(filters.fromDate)) return false
      if (filters.toDate && activityDate > toEndOfDay(filters.toDate)) return false

      return true
    })
    .filter((v) => {
      if (!q) return true

      const haystack = [
        v.firstName,
        v.lastName,
        v.businessName,
        v.email,
        v.phone,
        v.location,
        statusLabel(v.status),
        (v.platforms || []).map(platformLabel).join(' '),
        v.date,
        v.time
      ]
        .map(normalize)
        .join(' ')

      return haystack.includes(q)
    })
})

const metadata = computed(() => {
  const total = filteredVendors.value.length
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
  return filteredVendors.value.slice(start, start + metadata.value.limit)
})

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
const columns = ref([
  { field: 'owner', header: "Owner's Name", sortable: false },
  { field: 'business_name', header: 'Business Name', sortable: false },
  { field: 'email', header: 'Email', sortable: false },
  { field: 'platform', header: 'Platform', sortable: false },
  { field: 'date_registered', header: 'Date Registered', sortable: false },
  { field: 'status', header: 'Status', sortable: false },
  { field: 'actions_col', header: '', sortable: false }
])

const vendorOwnerName = (vendor) => {
  return `${vendor?.firstName || ''} ${vendor?.lastName || ''}`.trim() || 'N/A'
}

const exportCsv = () => {
  const headers = [
    "Owner's Name",
    'Business Name',
    'Email',
    'Platform',
    'Location',
    'Date',
    'Time',
    'Status'
  ]

  const lines = [headers]

  filteredVendors.value.forEach((v) => {
    lines.push([
      vendorOwnerName(v),
      v.businessName,
      v.email,
      (v.platforms || []).map(platformLabel).join(' | '),
      v.location,
      v.date,
      v.time,
      statusLabel(v.status)
    ])
  })

  const csv = lines
    .map((row) => row.map((value) => String(value ?? '').replaceAll(',', ' ')).join(','))
    .join(String.fromCharCode(10))

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'vendors.csv'
  link.click()

  URL.revokeObjectURL(url)
}

const rowMenuRef = ref(null)
const selectedRow = ref(null)

const rowMenuItems = computed(() => {
  const s = normalize(selectedRow.value?.status)
  const toggleLabel = s === 'suspended' ? 'Activate Vendor' : 'Suspend Vendor'
  const toggleIcon = s === 'suspended' ? 'check-green' : 'cancel-red'
  const toggleAction = s === 'suspended' ? 'activate' : 'suspend'
  const toggleIconClass = s === 'suspended' ? 'text-success-300' : 'text-danger-300'

  return [
    { label: 'View Vendor', icon: 'eye', action: 'view' },
    { label: toggleLabel, icon: toggleIcon, action: toggleAction, iconClass: toggleIconClass }
  ]
})

const toggleRowMenu = (event, row) => {
  if (event && typeof event.stopPropagation === 'function') event.stopPropagation()
  selectedRow.value = row
  rowMenuRef.value?.toggle(event)
}

const onRowMenuCommand = (item) => {
  if (!item || !item.action) return
  if (item.action === 'view') return openVendorSidebar('info', selectedRow.value)
  if (item.action === 'activate') return setVendorStatus(selectedRow.value, 'active')
  if (item.action === 'suspend') return setVendorStatus(selectedRow.value, 'suspended')
}

const setVendorStatus = (vendor, status) => {
  if (!vendor) return

  const nextStatus = normalize(status)

  vendors.value = vendors.value.map((v) =>
    v.id === vendor.id ? { ...v, status: nextStatus } : v
  )

  if (selectedRow.value?.id === vendor.id) {
    selectedRow.value = { ...selectedRow.value, status: nextStatus }
  }
}

const vendorSidebarOpen = ref(false)
const vendorSidebarMode = ref('create')

const vendorSidebarTitle = computed(() =>
  vendorSidebarMode.value === 'create' ? 'Add a vendor' : 'Vendor information'
)

const vendorSidebarSubtitle = computed(() =>
  vendorSidebarMode.value === 'create'
    ? 'Onboard a vendor to the platform'
    : 'See details about this vendor'
)

const vendorSubmitLabel = computed(() =>
  vendorSidebarMode.value === 'create' ? 'Add Vendor' : 'Save'
)

const vendorForm = reactive({
  id: null,
  firstName: '',
  lastName: '',
  businessName: '',
  location: null,
  email: '',
  phone: '',
  description: '',
  faq: '',
  facebookAccess: true,
  instagramAccess: true,
  status: 'active'
})

const vendorErrors = ref({})
const vendorValidationSchema = computed(() => {
  const base = {
    firstName: Joi.string().trim().min(2).required().messages({
      'string.empty': 'First name is required',
      'any.required': 'First name is required',
      'string.min': 'First name must be at least 2 characters'
    }),
    lastName: Joi.string().trim().min(2).required().messages({
      'string.empty': 'Last name is required',
      'any.required': 'Last name is required',
      'string.min': 'Last name must be at least 2 characters'
    }),
    businessName: Joi.string().trim().min(2).required().messages({
      'string.empty': 'Business name is required',
      'any.required': 'Business name is required',
      'string.min': 'Business name must be at least 2 characters'
    }),
    location: Joi.string().required().messages({
      'string.empty': 'Business location is required',
      'any.required': 'Business location is required'
    }),
    email: Joi.string().trim().email({ tlds: { allow: false } }).required().messages({
      'string.empty': 'Email address is required',
      'any.required': 'Email address is required',
      'string.email': 'Enter a valid email address'
    }),
    phone: Joi.string().trim().pattern(/^[+0-9\s-]{7,20}$/).required().messages({
      'string.empty': 'Phone number is required',
      'any.required': 'Phone number is required',
      'string.pattern.base': 'Enter a valid phone number'
    }),
    description: Joi.string().allow('').max(500).messages({
      'string.max': 'Description must be at most 500 characters'
    })
  }

  if (vendorSidebarMode.value === 'create') {
    return base
  }

  return {
    ...base,
    faq: Joi.string().allow('').max(500).messages({
      'string.max': 'FAQ must be at most 500 characters'
    }),
    status: Joi.string().required().messages({
      'string.empty': 'Vendor status is required',
      'any.required': 'Vendor status is required'
    })
  }
})

const validateVendorField = (field) => {
  const rule = vendorValidationSchema.value[field]
  if (!rule) return

  const valueMap = {
    firstName: vendorForm.firstName,
    lastName: vendorForm.lastName,
    businessName: vendorForm.businessName,
    location: vendorForm.location,
    email: vendorForm.email,
    phone: vendorForm.phone,
    description: vendorForm.description,
    faq: vendorForm.faq,
    status: vendorForm.status
  }

  const result = rule.validate(valueMap[field])

  if (result.error) {
    vendorErrors.value[field] = result.error.details[0].message
    return
  }

  delete vendorErrors.value[field]
}

const validateVendorForm = () => {
  const keys = Object.keys(vendorValidationSchema.value)
  keys.forEach((field) => validateVendorField(field))
  return keys.every((field) => !vendorErrors.value[field])
}

const openVendorSidebar = (mode, vendor = null) => {
  vendorSidebarMode.value = mode
  vendorErrors.value = {}

  vendorForm.id = vendor?.id || null
  vendorForm.firstName = vendor?.firstName || ''
  vendorForm.lastName = vendor?.lastName || ''
  vendorForm.businessName = vendor?.businessName || ''
  vendorForm.location = vendor?.location || null
  vendorForm.email = vendor?.email || ''
  vendorForm.phone = vendor?.phone || ''
  vendorForm.description = vendor?.description || ''
  vendorForm.faq = vendor?.faq || ''
  vendorForm.facebookAccess = Boolean(vendor?.facebookAccess ?? true)
  vendorForm.instagramAccess = Boolean(vendor?.instagramAccess ?? true)
  vendorForm.status = vendor?.status || 'active'

  vendorSidebarOpen.value = true
}

const openVendorSidebarFromRow = (row) => {
  openVendorSidebar('info', row)
}

const closeVendorSidebar = () => {
  vendorSidebarOpen.value = false
}

const saveVendor = () => {
  if (!validateVendorForm()) return

  if (vendorSidebarMode.value === 'create') {
    const id = `vendor-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

    vendors.value = [
      {
        id,
        firstName: vendorForm.firstName.trim(),
        lastName: vendorForm.lastName.trim(),
        businessName: vendorForm.businessName.trim(),
        email: vendorForm.email.trim(),
        phone: vendorForm.phone.trim(),
        location: vendorForm.location,
        platforms: ['facebook', 'instagram'],
        date: 'Feb 12, 2025',
        time: '11:59 PM',
        status: 'active',
        description: vendorForm.description || '',
        faq: '',
        facebookAccess: true,
        instagramAccess: true
      },
      ...vendors.value
    ]

    vendorSidebarOpen.value = false
    return
  }

  if (!vendorForm.id) {
    vendorSidebarOpen.value = false
    return
  }

  vendors.value = vendors.value.map((v) => {
    if (v.id !== vendorForm.id) return v

    return {
      ...v,
      firstName: vendorForm.firstName.trim(),
      lastName: vendorForm.lastName.trim(),
      businessName: vendorForm.businessName.trim(),
      location: vendorForm.location,
      email: vendorForm.email.trim(),
      phone: vendorForm.phone.trim(),
      description: vendorForm.description || '',
      faq: vendorForm.faq || '',
      facebookAccess: Boolean(vendorForm.facebookAccess),
      instagramAccess: Boolean(vendorForm.instagramAccess),
      status: normalize(vendorForm.status)
    }
  })

  vendorSidebarOpen.value = false
}
</script>