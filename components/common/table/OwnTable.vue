<template>
  <div class="relative">
    <div
      v-if="title || $slots.actions || showCountBadge"
      class="flex items-center justify-between gap-4 flex-wrap mb-4"
    >
      <div class="flex items-center gap-2 min-w-0">
        <h4
          v-if="title"
          class="font-semibold capitalize truncate text-neutral-primary"
        >
          {{ title }}
        </h4>

        <div
          v-if="showCountBadge"
          class="bg-primary-50 border border-primary-75 rounded-[100px] px-[7px] py-[1px]"
        >
          <span class="body-xsmall text-neutral-primary">
            {{ row_count }}<span v-if="count_label"> {{ count_label }}</span>
          </span>
        </div>
      </div>

      <div v-if="$slots.actions" class="w-full sm:w-auto">
        <slot name="actions" />
      </div>
    </div>

    <p v-if="description" class="body-regular text-neutral-secondary mb-4">
      {{ description }}
    </p>

    <div class="grid">
      <div class="col-12 overflow-auto">
        <div class="card body-small font-normal capitalize">
          <DataTable
            v-model:selection="selectedProduct"
            :value="mockData"
            rowGroupMode="rowspan"
            sortMode="single"
            :sortOrder="1"
            scrollable
            responsiveLayout="scroll"
            class="mb-6"
            @sort="sort"
            @row-click="view"
          >
            <slot name="header">
              <div
                :class="
                  plainInfo
                    ? 'flex justify-between items-center overflow-auto table-header flex-wrap gap-2'
                    : 'py-5 flex justify-between items-center overflow-auto table-header flex-wrap gap-2'
                "
              >
                <div class="flex bg-transparent justify-start items-center flex-wrap gap-2">
                  <div class="text-left" v-if="hasSearch">
                    <div class="sm:w-[274px] w-full max-w-full">
                      <IconField>
                        <InputIcon class="pi pi-search" />
                        <InputText
                          v-model="search"
                          @input="onInput"
                          placeholder="Search"
                          class="w-full"
                        />
                      </IconField>
                    </div>
                  </div>
                  <slot name="dateFilter" />
                </div>

                <div class="flex bg-transparent xl:justify-end items-center flex-wrap gap-2">
                  <slot name="filter" />
                </div>
              </div>
            </slot>

            <slot name="items">
              <Column
                selectionMode="multiple"
                headerStyle="width: 3rem"
                v-if="itemsBulkActions && itemsBulkActions.length > 0"
              ></Column>
              <Column
                v-for="(column, index) in selectedColumns"
                :key="index"
                :sortable="column.sortable"
                :field="column.field"
                :header="column.header"
                :style="column.style"
                :frozen="!!column.frozen"
                :class="column.class"
                alignFrozen="right"
                class="cursor-pointer body-small text-neutral-secondary"
              >
                <template #body="slotProps">
                  <slot
                    :name="column.field"
                    v-bind="slotProps"
                    v-if="slotProps && slotProps.data"
                  >
                    {{ slotProps.data[column.field] }}
                  </slot>
                </template>
              </Column>
            </slot>

            <template #footer v-if="!mockData || mockData.length < 1">
              <div class="flex flex-col items-center justify-center gap-6 py-12">
                <div class="bg-neutral-muted p-5 rounded-full">
                  <BaseCustomIcon name="table" />
                </div>

                <div v-if="props.loading" class="flex items-center justify-center gap-2 py-20">
                  <p class="body-small text-neutral-secondary">Loading data...</p>
                  <i class="pi pi-spin pi-spinner body-large text-primary-300"></i>
                </div>

                <div v-else class="text-center max-w-[406px]">
                  <h4 class="mb-2 text-neutral-primary">No Data to Show</h4>
                  <p class="body-regular text-neutral-secondary">
                    Your information will be displayed here when available.
                  </p>
                </div>
              </div>
            </template>
          </DataTable>

          <div
            class="sm:flex sm:justify-center sm:items-center"
            v-if="mockData && mockData.length > 0 && hasPagination"
          >
            <Paginator
              :first="paginatorFirst"
              :rows="metadata.limit"
              :totalRecords="metadata.total"
              :rowsPerPageOptions="limits"
              @page="onPage"
              @update:rows="onPageLimit"
            />
          </div>
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  columns: {
    type: Array,
    required: true,
    default: () => []
  },
  mockData: {
    type: Array,
    required: true,
    default: () => []
  },
  otherFilter: {
    type: Object,
    default: () => ({})
  },
  url: {
    type: String,
    default: ''
  },
  subPath: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  count_label: {
    type: String,
    default: ''
  },
  row_count: {
    type: Number,
    default: 0
  },
  showCountBadge: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    default: ''
  },
  dateFilter: {
    type: Boolean,
    default: true
  },
  hasSearch: {
    type: Boolean,
    default: true
  },
  hasLimit: {
    type: Boolean,
    default: false
  },
  hasPagination: {
    type: Boolean,
    default: true
  },
  plainInfo: {
    type: Boolean,
    default: false
  },
  itemsBulkActions: {
    type: Array,
    default: () => []
  },
  metadata: {
    type: Object,
    default: () => ({ page: 1, limit: 10, total: 0, pages: 1 })
  }
})

const selectedProduct = ref(null)
const search = ref('')
const limits = [10, 20, 30]
const selectedColumns = ref([...props.columns])

const paginatorFirst = computed(() => {
  const currentPage = Number(props.metadata?.page || 1)
  const currentLimit = Number(props.metadata?.limit || 10)
  return Math.max(0, (currentPage - 1) * currentLimit)
})

const emit = defineEmits([
  'bulkChange',
  'create',
  'onPagination',
  'onSearch',
  'onSort',
  'onLimit',
  'onReload',
  'onView'
])

onMounted(() => {
  onToggle(selectedColumns.value)
})

const onToggle = (val) => {
  selectedColumns.value = props.columns.filter((col) => val.includes(col))
}

const sort = (e) => {
  emit('onSort', 'sort', e.sortOrder, e.sortField)
}

const onPage = (event) => {
  const nextPage = Number(event.page) + 1
  emit('onPagination', 'page', nextPage)
}

const onPageLimit = (rows) => {
  const nextLimit = Number(rows)
  if (Number(props.metadata?.limit) !== nextLimit) {
    emit('onLimit', 'limit', nextLimit)
  }
}

const onInput = () => {
  emit('onSearch', 'search', search.value)
}

const view = (e) => {
  emit('onView', e.data)
}
</script>


