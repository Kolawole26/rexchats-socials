---
name: table
description: Standardized approach to creating and managing data tables using OwnTable in Nuxt 3.
---

# Table Skill

This project uses **OwnTable** for rendering and managing data tables on the frontend. It includes built-in support for pagination, sorting, filtering, and custom slot rendering.

## Rules & Best Practices
1. **Always use OwnTable** for displaying tabular data.
2. **Custom Slots**: Use custom templates (e.g., `#column_name`) to format cell content, render badges, or display complex data instead of modifying the raw data before passing it.
3. **Pagination & Server-side filtering**: Handle pagination and filtering states by listening to table events (`@onPagination`, `@onSort`, `@onSearch`, etc.) and updating standard reactive properties (`page`, `limit`, `search`, etc.).
4. **Loading States**: Always provide a `:loading` prop boolean bound to the data fetching state.
5. **Metadata**: Provide a valid `:metadata` object reflecting total pages, limits, and records for appropriate pagination controls.

## Optimized Implementation Example

```vue
<template>
  <section class="bg-neutral-10 p-6 rounded-lg">
    <OwnTable
      :columns="columns"
      title="All Transactions"
      :mock-data="tableData"
      :loading="isPageLoading"
      @onPagination="updateStateAndFetch"
      @onSort="updateStateAndFetch"
      @onSearch="updateStateAndFetch"
      @onLimit="updateStateAndFetch"
      @onView="onViewDetails"
      :row_count="total"
      :metadata="metadata"
      :disable-view="isVirtualCardSelected"
    >
      <!-- Filter Slot -->
      <template #filter>
        <FormSelect
          v-model="users"
          placeholder="All Users"
          class="bulk-select min-w-32"
          hide-error
          :showClear="true"
          name="users"
          optionLabel="name"
          item-value="value"
          :options="usersOptions"
          :onTable="true"
          :filter="true"
          @change="fetchData"
        />

        <button
          :class="[
            'h-[48px] px-5 rounded-[8px] flex justify-center items-center bg-none border text-sm font-normal transition-colors duration-200',
            hasActiveFilters
              ? ' bg-primary-75 border-neutral-100 text-neutral-200 '
              : 'border-neutral-100 text-neutral-200 hover:bg-primary-75 hover:border-primary-75',
          ]"
          @click="toggle"
          aria-haspopup="true"
          aria-controls="overlay_menu"
        >
          <span class="mr-2">
            <BaseCustomIcon name="filter" />
          </span>
          <p>Filter</p>
        </button>
        <!-- Reusable Menu Component -->
        <ModalFilterMenu
          ref="reusableMenu"
          :items="menuItems"
          @toggle="handleMenuToggle"
          @reset="handleResetFilters"
        />
        <div class="card flex rounded-lg justify-center items-center date-range-box w-full sm:w-fit max-w-[169px] relative">
          <DatePicker
            v-model="fromDate"
            class="h-12 shadow-none w-full"
            placeholder="From Date"
            @update:modelValue="fetchData"
          />
          <i
            class="pi pi-times closeIcon text-sm cursor-pointer absolute sm:right-12 right-3 top-1/2 -translate-y-1/2"
            @click="fromDate = null; fetchData();"
            v-if="fromDate"
          ></i>
        </div>
        <div class="card flex rounded-lg justify-center items-center date-range-box w-full sm:w-fit max-w-[169px] relative">
          <DatePicker
            v-model="toDate"
            class="h-12 shadow-none"
            placeholder="To Date"
            @update:modelValue="fetchData"
          />
          <i
            class="pi pi-times closeIcon text-sm cursor-pointer absolute sm:right-12 right-3 top-1/2 -translate-y-1/2"
            @click="toDate = null; fetchData();"
            v-if="toDate"
          ></i>
        </div>

        <CommonButton
          title=""
          bgColor="bg-primary-50 border border-primary-300 font-medium text-sm"
          textColor="text-primary-400"
          type="button"
          createIcon="download"
          @click="exportExcel"
          :loading="isExporting"
        />
      </template>

      <!-- Custom Column Templates -->
      <template #transaction_id="slotProps">
        <div class="flex items-center gap-2">
          <div>
            <p class="mb-1 truncate">{{ slotProps.data.transaction_id }}</p>
            <p class="text-neutral-200 text-xs">
              {{ slotProps.data.third_party_transaction_id }}
            </p>
          </div>
        </div>
      </template>
      <template #first_name="slotProps">
        <div class="flex items-center gap-2">
          <div>
            <p class="mb-1 truncate">
              {{ slotProps.data.first_name }} {{ slotProps.data.last_name }}
            </p>
            <p class="text-neutral-200 text-xs">
              {{ slotProps.data.user_name }}
            </p>
          </div>
        </div>
      </template>
      <template #amount="slotProps">
        <div class="flex items-center gap-2">
          <div>
            <p class="mb-1 truncate">
              {{ getCurrencySymbol() }}
              {{ amountFunction(slotProps.data.amount) }}
            </p>
          </div>
        </div>
      </template>

      <template #service="slotProps">
        <div class="flex items-center gap-2">
          <div>
            <p class="mb-1 truncate">
              {{ slotProps.data.service }}
              {{ slotProps.data.label ? `(${slotProps.data.label})` : "" }}
            </p>
          </div>
        </div>
      </template>

      <template #type="slotProps">
        <div class="flex items-center gap-[6px]">
          <i
            v-if="slotProps.data.type === 'Debit'"
            class="pi pi-arrow-up-right text-[12px] text-danger-300 leading-none"
          />
          <i
            v-else
            class="pi pi-arrow-down-left text-[12px] text-success-300 leading-none"
          />
          <p class="">{{ slotProps.data.type }}</p>
        </div>
      </template>
      <template #date="slotProps">
        <div class="flex items-center gap-2">
          <div>
            <p class="mb-1">
              {{
                slotProps?.data?.date
                  ? moment(slotProps.data.date).format("MMM DD, YYYY")
                  : "Not available"
              }}
            </p>
            <p class="text-neutral-200 text-xs">
              {{
                slotProps?.data?.date
                  ? moment(slotProps.data.date).format("h:mm A")
                  : "Not available"
              }}
            </p>
          </div>
        </div>
      </template>

      <template #status="slotProps">
        <div class="flex items-center gap-2">
          <!-- Normal status -->
          <CommonStatus :status="slotProps.data.status" />

          <!-- Partial Complete badge -->
          <span
            v-if="slotProps.data.social_boost_meta?.is_parital_complete"
            class="inline-flex items-center rounded-full bg-warning-50 text-warning-400 px-1.5 py-[1px] text-xs leading-none font-medium"
          >
            Partial
          </span>
        </div>
      </template>
    </OwnTable>
    <Sidebar
      v-model:visible="viewDetails"
      position="right"
      :style="{ maxWidth: '400px', width: '100%' }"
      modal
      class="custom-modal-drawer rounded-tl-lg rounded-bl-lg"
      :showCloseIcon="false"
      :show-header="false"
    >
      <div class="flex items-center justify-between px-6 py-4 bg-neutral-20">
        <h5 class="text-neutral-500">Transaction Receipt</h5>
        <button @click="viewDetails = false">
          <i
            class="pi pi-times text-neutral-500 text-base hover:bg-primary-50 p-3 hover:rounded-full"
          />
        </button>
      </div>
      <div class="">
        <TransactionsDrawer :transactionId="transactionId" />
      </div>
    </Sidebar>
    <Toast />
  </section>
</template>

<script setup>
import OwnTable from "~/components/common/table/OwnTable.vue";
import FormSelect from "~/components/common/input/FormSelect.vue";
import moment from "moment";
import { ref, computed, onBeforeMount } from "vue";

const { showSuccess } = useToastHandler();
const fromDate = ref(null);
const toDate = ref(null);
const transactionId = ref();
const viewDetails = ref(false);

// Table States
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const order = ref(-1);
const search = ref("");
const isPageLoading = ref(true);
const isLoading = ref(false);
const isExporting = ref(false);
const filter = ref("");
const tableData = ref([]);
const metadata = ref([{ page: 1, limit: 10, total: 0, pages: 1 }]);

// Filter States
const status = ref("");
const service = ref(null);
const serviceOptions = ref([]);
const users = ref(null);
const usersOptions = ref([]);
const type = ref("");
const route = ref(null);
const moreFilter = ref();
const isSocialBoostPartialComplete = ref(false);

const columns = ref([
  { field: "transaction_id", header: "Transaction ID", sortable: false },
  { field: "first_name", header: "Users", sortable: false },
  { field: "service", header: "Services", sortable: false },
  { field: "type", header: "Type", sortable: false },
  { field: "amount", header: "Amount", sortable: false },
  { field: "status", header: "Status", sortable: false },
  { field: "date", header: "Date", sortable: false },
]);

const isVirtualCardSelected = computed(() => {
  const selectedService = serviceOptions.value.find((opt) => opt.value === service.value);
  return selectedService && selectedService.name.toLowerCase().includes("virtual card");
});

const getCurrencySymbol = () => {
  if (isVirtualCardSelected.value) return "$";
  return "₦";
};

// Amount formatting helper placeholder
const amountFunction = (amount) => amount;

const onViewDetails = (e) => {
  if (isVirtualCardSelected.value) return;
  viewDetails.value = true;
  transactionId.value = e._id || e;
};

const menuItems = ref([
  { label: "Services", field: "Select", options: [] },
  {
    label: "Status",
    field: "Select",
    options: [
      { name: "Pending", value: "Pending" },
      { name: "Completed", value: "Completed" },
    ],
  },
  {
    label: "Type",
    field: "Select",
    options: [
      { name: "Credit", value: "Credit" },
      { name: "Debit", value: "Debit" },
    ],
  },
]);

const reusableMenu = ref();

const toggle = (event) => {
  reusableMenu.value.toggle(event);
};

const handleMenuToggle = (event) => {
  if (Array.isArray(event) && event.length > 0) {
    if (event[0] !== undefined) service.value = event[0];
    if (event[1]) status.value = event[1];
    if (event[2]) type.value = event[2];
    
    page.value = 1;
    fetchData();
  }
};

const hasActiveFilters = computed(() => {
  return !!service.value || !!status.value || !!type.value || !!route.value || isSocialBoostPartialComplete.value === true;
});

const handleResetFilters = () => {
  service.value = null;
  status.value = "";
  type.value = "";
  route.value = "";
  moreFilter.value = null;
  isSocialBoostPartialComplete.value = false;
  page.value = 1;
  fetchData();
};

onBeforeMount(async () => {
  setTimeout(() => {
    fetchData();
    fetchUsersAndServices();
  }, 1000);
});

const fetchUsersAndServices = async () => {
  // Mock implementations for fetching dropdown data
  serviceOptions.value = [
    { name: "Wallet", value: "wallet" },
    { name: "Virtual Card", value: "virtual_card" }
  ];
  menuItems.value[0].options = serviceOptions.value;

  usersOptions.value = [
    { name: "John Doe", value: "1" },
    { name: "Jane Smith", value: "2" }
  ];
};

const fetchData = async () => {
  isPageLoading.value = true;
  
  // Data extraction logic based on table states (page, limit, filter, search, etc.)
  // e.g. Call your API here passing { limit: limit.value, page: page.value, ...filters }
  
  setTimeout(() => {
    // Mock response parsing
    tableData.value = [];
    metadata.value = [{ page: page.value, limit: limit.value, total: 100, pages: 10 }];
    total.value = 100;
    
    isPageLoading.value = false;
  }, 500);
};

const updateStateAndFetch = (actionType, value1, value2 = null) => {
  if (actionType === "page") page.value = value1;
  else if (actionType === "search") search.value = value1;
  else if (actionType === "sort") {
    order.value = value1;
    filter.value = value2;
  }
  else if (actionType === "limit") limit.value = value1;
  else return;
  
  fetchData();
};

const exportExcel = async () => {
  isExporting.value = true;
  
  setTimeout(() => {
    isExporting.value = false;
    showSuccess("Export completed successfully");
  }, 1000);
};
</script>
```
