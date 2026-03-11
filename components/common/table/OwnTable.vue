<template>
  <div class="relative">
    <div class=" flex items-center mb-1">
      <h4 class=" font-semibold capitalize" v-if="title">
      {{ title }}
    </h4>
    <div
      class="flex items-center ml-2 bg-neutral-20 border border-neutral-100 py-[1px] px-[6px] rounded-full b-shadow"
    >
      <div class="w-[6px] h-[6px] rounded-full bg-[#367EE8] mr-[6px]"></div>
      <span class="text-neutral-l-800 body-xsmall"
        >{{ row_count }} {{ count_label }}</span
      >
    </div>
    </div>
    <p v-if="description" class="body-regular text-neutral-l-600 mb-4">
      {{ description }}
    </p>

    <div class="grid">
      <div class="col-12 overflow-auto">
        <div class="card text-sm font-normal capitalize">
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
                <div
                  class="flex bg-transparent justify-start items-center flex-wrap gap-2"
                >
                  <div class="text-left" v-if="hasSearch">
                    <div class="sm:w-[274px] w-full max-w-full">
                      <IconField class="">
                        <InputIcon class="pi pi-search dark:!text-[#8F8E93]"> </InputIcon>
                        <InputText
                          v-model="search"
                          @input="onInput"
                          placeholder="Search"
                          class="w-full"
                        />
                      </IconField>
                    </div>
                  </div>
                  <slot name="dateFilter"></slot>
                </div>

                <div
                  class="flex bg-transparent xl:justify-end items-center flex-wrap gap-2"
                >
                  <slot name="filter"></slot>
                  <!-- <div class="flex justify-end items-center" v-if="hasLimit">
                    <label for="limit" class="text-sm text-[#7C7C7A] mr-2">{{
                      "show"
                    }}</label>
                    <FormSelect
                      placeholder="10"
                      name="limit"
                      :options="limits"
                      id="limit"
                      v-model="limit"
                      item-text="name"
                      item-value="value"
                      @update:model-value="onLimit"
                      hideError
                    />
                  </div> -->
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
                class="cursor-pointer body-small text-neutral-300"
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
              <div
                class="flex flex-col items-center justify-center gap-6 py-12"
              >
              <div class=" bg-neutral-30 p-5 rounded-full">
                <BaseCustomIcon name="table" />
              </div>

              <div v-if="loading" class="flex items-center justify-center gap-2 py-20">
                  <p class="body-small text-neutral-text_secondary">Loading data...</p>
                  <i class="pi pi-spin pi-spinner text-2xl text-primary-300"></i>
                </div>

                <div v-else class="text-center max-w-[406px]">
                  <h4 class="mb-2">No Data to Show</h4>
                  <p class="body-normal text-neutral-200">
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
            <!-- <div
              class="mb-6 sm:mb-0 text-[#5C5C5C] bg-primary-50 w-max px-5 py-2 rounded-full"
            >
              <p class="sm:text-base text-sm lowercase">
                Showing {{ metadata.page }} of {{ metadata.pages }}
              </p>
            </div> -->

            <Paginator
              v-if="mockData && mockData.length > 0 && hasPagination"
              v-model="metadata.page"
              :rows="metadata.limit"
              :totalRecords="metadata.total"
              :rowsPerPageOptions="limits"
              @page="onPage($event)"
              @update:rows="onPageLimit($event)"
            />
          </div>
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import debounce from "lodash/debounce";
import { useToast } from "primevue/usetoast";
import FormSelect from "~/components/common/input/FormSelect.vue";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  columns: {
    type: Array,
    required: true,
    default: () => [],
  },
  mockData: {
    type: Array,
    required: true,
    default: () => [],
  },
  otherFilter: {
    type: Object,
    default: () => {},
  },
  url: {
    type: String,
    default: "",
  },
  subPath: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  count_label: {
    type: String,
    default: "",
  },
  row_count: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: "",
  },
  dateFilter: {
    type: Boolean,
    default: true,
  },
  hasSearch: {
    type: Boolean,
    default: true,
  },
  hasLimit: {
    type: Boolean,
    default: false,
  },
  hasPagination: {
    type: Boolean,
    default: true,
  },
  plainInfo: {
    type: Boolean,
    default: false,
  },
  itemsBulkActions: {
    type: Array,
    default: () => [],
  },
  metadata: {
    type: Array,
    default: () => [{ page: 1, limit: 10, total: 0, pages: 1 }],
  },
});

const first = ref(0);
const selectedProduct = ref(null);
const search = ref("");
// const tableData = ref([]);
const limits = [10, 20, 30];
const page = ref(1);
const limit = ref(10);
const pages = ref(1);
const total = ref(1);
const loading = ref(false);
const filter = ref("");
const order = ref(1);
const selectedColumns = ref([...props.columns]);
const emit = defineEmits([
  "bulkChange",
  "create",
  "onPagination",
  "onSearch",
  "onSort",
  "onLimit",
  "onReload",
  "onView",
]);
const toast = useToast();

onMounted(() => {
  onToggle(selectedColumns.value);
});
onBeforeMount(async () => {
  reset();
});

const onToggle = (val) => {
  selectedColumns.value = props.columns.filter((col) => val.includes(col));
};
const sort = (e) => {
  emit("onSort", "sort", e.sortOrder, e.sortField);
  order.value = e.sortOrder;
};
const onPage = ($event) => {
  page.value = $event.page + 1;
  emit("onPagination", "page", page.value);
};
const onPageLimit = ($event) => {
  limit.value = $event
  if (props.metadata.limit !== limit.value) {
    emit("onLimit", "limit", limit.value);
  };
};
const onInput = () => {
  emit("onSearch", "search", search.value);
};
const view = (e) => {
  emit("onView", e.data);
};
const onLimit = (info) => {
  emit("onLimit", "limit", limit.value);
};
const tableReload = (info) => {
  emit("onReload", "reload");
};
const reset = () => {
  first.value = (page.value - 1) * limit.value;
};


</script>

<style>
.p-datatable-column-title {
  @apply text-sm text-neutral-200 !font-normal;
}

.p-datatable-column-header-content {
  @apply text-neutral-20 py-1;
}

.p-datatable-header-cell {
  @apply !bg-neutral-20;
}

.p-paginator-page {
  @apply !text-neutral-500;
}
.p-paginator-content button {
  @apply !text-neutral-500;
}
.p-paginator-rpp-dropdown {
  @apply py-3 !px-3;
}
.p-paginator-page.p-paginator-page-selected {
  @apply !bg-neutral-500 !text-neutral-10;
}
</style>
