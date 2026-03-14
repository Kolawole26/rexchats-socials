<template>
  <section class="flex flex-col gap-6">
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <CommonCards
        title="All Conversations"
        :value="allConversationsCount"
        icon="conversations"
        iconWrapperClass="bg-brand-purple-background text-brand-purple-foreground"
      />

      <CommonCards
        title="AI Conversations"
        :value="aiConversationsCount"
        icon="conversations"
        iconWrapperClass="bg-brand-moss-background text-brand-moss-foreground"
      />

      <CommonCards
        title="Pause Conversation"
        :value="pausedConversationsCount"
        icon="conversations"
        iconWrapperClass="bg-brand-persian-background text-brand-persian-foreground"
      />
    </section>

    <div
      class="inline-flex items-center bg-neutral-surface border border-neutral-line rounded-xl p-1 gap-1 w-fit"
      role="tablist"
      aria-label="Conversation tabs"
    >
      <CommonButton
        v-for="tab in tabs"
        :key="tab.value"
        type="button"
        size="sm"
        :bgColor="
          selectedTab === tab.value
            ? 'bg-neutral-muted !h-9'
            : 'bg-transparent hover:bg-neutral-muted !h-9'
        "
        :textColor="
          selectedTab === tab.value
            ? 'text-neutral-primary button'
            : 'text-neutral-secondary button'
        "
        @click="selectedTab = tab.value; page = 1"
        :aria-selected="selectedTab === tab.value"
        role="tab"
      >
        {{ tab.label }}
      </CommonButton>
    </div>

    <section class="bg-neutral-surface border border-neutral-line rounded-2xl p-6">
      <OwnTable
        :columns="columns"
        title="All conversations"
        :row_count="metadata.total"
        count_label=""
        :mock-data="tableData"
        :loading="isLoading"
        :metadata="metadata"
        :hasSearch="false"
        :hasPagination="true"
        @onPagination="updateState"
        @onLimit="updateState"
        @onView="openConversationSidebarFromRow"
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

        <template #last_message="slotProps">
          <p class="body-small text-neutral-primary truncate max-w-[320px]">{{ slotProps.data.last_message }}</p>
        </template>

        <template #ai_status="slotProps">
          <span
            class="inline-flex items-center rounded-full px-3 py-1 body-xsmall"
            :class="aiStatusBadgeClass(slotProps.data.ai_status)"
          >
            {{ aiStatusLabel(slotProps.data.ai_status) }}
          </span>
        </template>

        <template #last_activity="slotProps">
          <div class="flex flex-col min-w-0">
            <p class="body-small text-neutral-primary">{{ slotProps.data.date || 'N/A' }}</p>
            <p class="body-xsmall text-neutral-secondary">{{ slotProps.data.time || '' }}</p>
          </div>
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
              aria-controls="conversation_menu"
              @click.stop="toggleRowMenu($event, slotProps.data)"
            />
          </div>
        </template>
      </OwnTable>
      <Menu ref="rowMenuRef" id="conversation_menu" :model="rowMenuItems" :popup="true" class="w-[240px]">
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
      v-model:visible="conversationSidebarOpen"
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
          >
            <BaseCustomIcon name="conversations" customClass="" />
          </div>
          <div class="flex flex-col min-w-0">
            <h4 class="text-neutral-primary truncate">View Conversation</h4>
            <p class="body-small text-neutral-secondary truncate">
              {{ selectedRow?.customer_name || 'Customer' }}
            </p>
          </div>
        </div>

        <CommonButton
          aria-label="Close"
          type="button"
          title=""
          bgColor="bg-transparent hover:bg-neutral-muted !h-10 !w-10 !px-0"
          textColor="text-neutral-secondary"
          createIcon="cancel-red"
          @click="closeConversationSidebar"
        />
      </div>

      <ConversationSidebarBody :selectedRow="selectedRow" />
    </Sidebar>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import OwnTable from '~/components/common/table/OwnTable.vue'
import ConversationSidebarBody from '~/components/conversations/ConversationSidebarBody.vue'

definePageMeta({
  layout: 'default',
  customProp: 'Conversations'
})

const { showSuccess } = useToastHandler()

const isLoading = ref(false)

const allConversationsCount = ref('6,900')
const aiConversationsCount = ref('6,900')
const pausedConversationsCount = ref('19')

const page = ref(1)
const limit = ref(10)
const search = ref('')
const selectedTab = ref('all')

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'AI Conversations', value: 'ai' },
  { label: 'Paused Conversations', value: 'paused' }
]

const columns = ref([
  { field: 'customer', header: 'Customer', sortable: false },
  { field: 'platform', header: 'Platform', sortable: false },
  { field: 'last_message', header: 'Last Message', sortable: false },
  { field: 'ai_status', header: 'AI Status', sortable: false },
  { field: 'last_activity', header: 'Last Actively', sortable: false },
  { field: 'actions_col', header: '', sortable: false }
])

const baseActive = {
  customer_name: 'Micheal Scofield',
  customer_phone: '+383 44 123 456',
  platform: 'Facebook',
  last_message: 'Do you have this in blue?',
  ai_status: 'active',
  date: 'Feb 12, 2025',
  time: '11:59 PM'
}

const basePaused = {
  customer_name: 'Micheal Scofield',
  customer_phone: '+383 44 123 456',
  platform: 'Instagram',
  last_message: 'Do you have this in blue?',
  ai_status: 'paused',
  date: 'Feb 12, 2025',
  time: '11:59 PM'
}

const conversations = ref([
  ...Array.from({ length: 6 }, () => ({ ...baseActive })),
  ...Array.from({ length: 4 }, () => ({ ...basePaused }))
])

const filters = reactive({
  ai_status: null,
  platform: null,
  fromDate: null,
  toDate: null
})

const aiStatusOptions = [
  { name: 'AI Active', value: 'active' },
  { name: 'AI Paused', value: 'paused' }
]

const platformOptions = [
  { name: 'Facebook', value: 'facebook' },
  { name: 'Instagram', value: 'instagram' }
]

const filterMenuItems = computed(() => [
  { label: 'AI Status', field: 'Select', options: aiStatusOptions },
  { label: 'Platform', field: 'Select', options: platformOptions },
  { label: 'Last Actively', hasDates: true }
])

const filterMenuRef = ref(null)

const openFilterMenu = (event) => {
  filterMenuRef.value?.toggle(event)
}

const resetFilters = () => {
  filters.ai_status = null
  filters.platform = null
  filters.fromDate = null
  filters.toDate = null
  page.value = 1
}

const applyFilters = (values) => {
  const dateRange = values?.[2] || { fromDate: null, toDate: null }

  filters.ai_status = values?.[0] || null
  filters.platform = values?.[1] || null
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

const filteredConversations = computed(() => {
  const q = normalize(search.value)

  return conversations.value
    .filter((c) => {
      if (selectedTab.value === 'all') return true
      if (selectedTab.value === 'ai') return normalize(c.ai_status) === 'active'
      if (selectedTab.value === 'paused') return normalize(c.ai_status) === 'paused'
      return true
    })
    .filter((c) => {
      if (!filters.ai_status) return true
      return normalize(c.ai_status) === normalize(filters.ai_status)
    })
    .filter((c) => {
      if (!filters.platform) return true
      return normalize(c.platform).includes(normalize(filters.platform))
    })
    .filter((c) => {
      if (!filters.fromDate && !filters.toDate) return true
      const activityDate = new Date(c.date)
      if (Number.isNaN(activityDate.getTime())) return true

      if (filters.fromDate && activityDate < toStartOfDay(filters.fromDate)) return false
      if (filters.toDate && activityDate > toEndOfDay(filters.toDate)) return false

      return true
    })
    .filter((c) => {
      if (!q) return true
      const haystack = [
        c.customer_name,
        c.customer_phone,
        c.platform,
        c.last_message,
        c.ai_status,
        c.date,
        c.time
      ]
        .map(normalize)
        .join(' ')

      return haystack.includes(q)
    })
})
const metadata = computed(() => {
  const total = filteredConversations.value.length
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
  return filteredConversations.value.slice(start, start + metadata.value.limit)
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

const aiStatusLabel = (status) => {
  const s = normalize(status)
  if (s === 'paused') return 'AI Paused'
  if (s === 'active') return 'AI Active'
  return 'AI Off'
}

const aiStatusBadgeClass = (status) => {
  const s = normalize(status)
  if (s === 'paused') return 'bg-danger-50 text-danger-300'
  if (s === 'active') return 'bg-info-50 text-info-300'
  return 'bg-neutral-muted text-neutral-secondary'
}
const exportCsv = () => {
  const headers = ['Customer', 'Phone', 'Platform', 'Last Message', 'AI Status', 'Date', 'Time']
  const lines = [headers]

  filteredConversations.value.forEach((c) => {
    lines.push([
      c.customer_name,
      c.customer_phone,
      platformLabel(c.platform),
      c.last_message,
      aiStatusLabel(c.ai_status),
      c.date,
      c.time
    ])
  })

  const csv = lines
    .map((row) => row.map((value) => String(value ?? '').replaceAll(',', ' ')).join(','))
    .join(String.fromCharCode(10))

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'conversations.csv'
  link.click()

  URL.revokeObjectURL(url)
}
const rowMenuRef = ref(null)
const selectedRow = ref(null)

const rowMenuItems = computed(() => {
  const status = normalize(selectedRow.value?.ai_status)
  const isPaused = status === 'paused'

  const toggleItem = isPaused
    ? { label: 'Active Conversation', icon: 'conversations', action: 'activate' }
    : { label: 'Pause Conversation', icon: 'not_disturb', action: 'pause' }

  return [
    { label: 'View Conversation', icon: 'eye', action: 'view' },
    toggleItem
  ]
})

const toggleRowMenu = (event, row) => {
  if (event && typeof event.stopPropagation === 'function') event.stopPropagation()
  selectedRow.value = row
  rowMenuRef.value?.toggle(event)
}

const conversationSidebarOpen = ref(false)

const openConversationSidebarFromRow = (row) => {
  selectedRow.value = row
  conversationSidebarOpen.value = true
}

const closeConversationSidebar = () => {
  conversationSidebarOpen.value = false
}

const onRowMenuCommand = (item) => {
  if (!item || !item.action) return

  if (item.action === 'view') {
    // openConversationSidebarFromRow(selectedRow.value)
    return
  }

  if (item.action === 'pause') {
    if (selectedRow.value) selectedRow.value.ai_status = 'paused'
    showSuccess('Conversation paused')
    return
  }

  if (item.action === 'activate') {
    if (selectedRow.value) selectedRow.value.ai_status = 'active'
    showSuccess('Conversation activated')
  }
}
</script>