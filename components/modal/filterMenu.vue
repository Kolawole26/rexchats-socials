<template>
  <OverlayPanel ref="op" id="overlay_menu" :popup="true" class="w-[240px] rounded-lg">
    <!-- Header -->
    <div class="flex items-center px-4 py-[10px] bg-neutral-surface border-b border-neutral-100">
      <button @click="toggle">
        <i class="pi pi-times text-neutral-text_primary label hover:bg-primary-50 p-2 rounded-full" />
      </button>
      <p class="mx-auto button text-neutral-text_primary">Filter</p>
    </div>

    <!-- Content -->
    <div class="p-4">
      <div v-for="(item, index) in items" :key="index" class="mb-4">
        <!-- Label & Clear -->
        <div class="flex justify-between items-center mb-2">
          <label class="body-small text-neutral-text_primary">{{ item.label }}</label>
          <p
            class="body-small text-primary-300 cursor-pointer hover:underline"
            @click="handleClear(index)"
          >
            Clear
          </p>
        </div>

        <!-- Select Field -->
        <FormSelect
          v-if="item.field === 'Select'"
          v-model="selectedValues[index]"
          :options="item.options"
          optionLabel="name"
          item-value="value"
          placeholder="Select"
          class="h-[36px]"
          name="field"
          @change="handleSelectChange(index)"
        />

        <!-- Date Range Fields -->
        <div v-if="item.hasDates" class="flex items-center gap-2">
          <DatePicker
            v-model="selectedValues[index].fromDate"
            class="!h-10 shadow-none w-full"
            placeholder="From"
            @update:modelValue="updateDateValue(index, 'fromDate', $event)"
          />
          <DatePicker
            v-model="selectedValues[index].toDate"
            class="!h-10 shadow-none w-full"
            placeholder="To"
            @update:modelValue="updateDateValue(index, 'toDate', $event)"
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center gap-4 pt-4 border-t border-neutral-100">
        <CommonButton
          title="Reset"
          bgColor="bg-neutral-muted"
          textColor="text-neutral-text_primary button !h-8"
          type="button"
          class="w-full"
          @click="resetModal"
        />
        <CommonButton
          title="Apply"
          bgColor="bg-primary-300 !h-8"
          textColor="text-white button"
          type="button"
          class="w-full"
          :loading="isLoading"
          @click="applyFilters"
        />
      </div>
    </div>
  </OverlayPanel>
</template>

<script setup>
import { ref, watch } from 'vue'
import FormSelect from '~/components/common/input/FormSelect.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['toggle', 'reset', 'apply'])

const op = ref(null)
const selectedValues = ref([])
const isLoading = ref(false)

// Initialize selected values when items change
watch(
  () => props.items,
  (newItems) => {
    selectedValues.value = newItems.map((item) =>
      item.hasDates ? { fromDate: null, toDate: null } : null
    )
  },
  { immediate: true }
)

// --- Toggle Overlay ---
const toggle = (event) => {
  op.value.toggle(event)
  emit('toggle', event)
}

// --- Update Date Value ---
const updateDateValue = (index, key, value) => {
  if (!selectedValues.value[index]) {
    selectedValues.value[index] = { fromDate: null, toDate: null }
  }
  selectedValues.value[index][key] = value
}

// --- Clear a Single Filter ---
const handleClear = (index) => {
  const item = props.items[index]
  selectedValues.value[index] = item.hasDates
    ? { fromDate: null, toDate: null }
    : null
}

// --- Reset All Filters ---
const resetModal = () => {
  selectedValues.value = props.items.map((item) =>
    item.hasDates ? { fromDate: null, toDate: null } : null
  )
  emit('reset')
  op.value.hide()
}

// --- Apply Filters ---
const applyFilters = () => {
  emit('apply', [...selectedValues.value])
  op.value.hide()
}

// Expose toggle to parent
defineExpose({ toggle })
</script>