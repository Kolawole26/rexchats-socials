<template>
  <OverlayPanel
    ref="op"
    id="overlay_menu"
    :popup="true"
    class="w-[280px] rounded-2xl border border-neutral-line"
  >
    <div class="flex items-center px-4 py-3 bg-neutral-surface border-b border-neutral-line">
      <CommonButton
        aria-label="Close"
        type="button"
        title=""
        bgColor="bg-transparent hover:bg-primary-50 !h-10 !w-10 !px-0"
        textColor="text-neutral-primary"
        createIcon="cancel-red"
        @click="toggle"
      />
      <p class="mx-auto button text-neutral-primary">Filter by</p>
    </div>

    <div class="p-4">
      <div v-for="(item, index) in items" :key="index" class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <label class="body-small text-neutral-secondary">{{ item.label }}</label>
          <p class="body-small text-primary-300 cursor-pointer hover:underline" @click="handleClear(index)">
            Clear
          </p>
        </div>

        <FormSelect
          v-if="item.field === 'Select'"
          v-model="selectedValues[index]"
          :options="item.options"
          placeholder="Select"
          class="!h-12"
          name="field"
          @change="handleSelectChange(index)"
        />

        <DatePicker
          v-else-if="item.hasDate"
          v-model="selectedValues[index]"
          class="!h-12 shadow-none w-full"
          placeholder="Select"
        />

        <div v-else-if="item.hasPrices" class="flex items-center gap-2">
          <InputText
            v-model="selectedValues[index].minPrice"
            inputmode="decimal"
            placeholder="€0.0"
            class="!h-12 shadow-none w-full"
            @update:modelValue="updatePriceValue(index, 'minPrice', $event)"
          />
          <InputText
            v-model="selectedValues[index].maxPrice"
            inputmode="decimal"
            placeholder="€0.0"
            class="!h-12 shadow-none w-full"
            @update:modelValue="updatePriceValue(index, 'maxPrice', $event)"
          />
        </div>

        <div v-else-if="item.hasDates" class="flex items-center gap-2">
          <DatePicker
            v-model="selectedValues[index].fromDate"
            class="!h-12 shadow-none w-full"
            placeholder="From"
            @update:modelValue="updateDateValue(index, 'fromDate', $event)"
          />
          <DatePicker
            v-model="selectedValues[index].toDate"
            class="!h-12 shadow-none w-full"
            placeholder="To"
            @update:modelValue="updateDateValue(index, 'toDate', $event)"
          />
        </div>
      </div>

      <div class="flex items-center gap-4 pt-4 border-t border-neutral-line">
        <CommonButton
          title="Reset"
          bgColor="bg-neutral-muted !h-10"
          textColor="text-neutral-primary button"
          type="button"
          class="w-full"
          @click="resetModal"
        />
        <CommonButton
          title="Apply"
          bgColor="bg-primary-300 !h-10"
          textColor="text-neutral-inverted button"
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

watch(
  () => props.items,
  (newItems) => {
    selectedValues.value = newItems.map((item) => {
      if (item.hasDates) return { fromDate: null, toDate: null }
      if (item.hasPrices) return { minPrice: null, maxPrice: null }
      return null
    })
  },
  { immediate: true }
)

const toggle = (event) => {
  op.value.toggle(event)
  emit('toggle', event)
}

const updateDateValue = (index, key, value) => {
  if (!selectedValues.value[index]) {
    selectedValues.value[index] = { fromDate: null, toDate: null }
  }
  selectedValues.value[index][key] = value
}

const updatePriceValue = (index, key, value) => {
  if (!selectedValues.value[index]) {
    selectedValues.value[index] = { minPrice: null, maxPrice: null }
  }
  selectedValues.value[index][key] = value
}

const handleClear = (index) => {
  const item = props.items[index]
  if (item.hasDates) {
    selectedValues.value[index] = { fromDate: null, toDate: null }
    return
  }

  if (item.hasPrices) {
    selectedValues.value[index] = { minPrice: null, maxPrice: null }
    return
  }

  selectedValues.value[index] = null
}

const resetModal = () => {
  selectedValues.value = props.items.map((item) => {
    if (item.hasDates) return { fromDate: null, toDate: null }
    if (item.hasPrices) return { minPrice: null, maxPrice: null }
    return null
  })

  emit('reset')
  op.value.hide()
}

const applyFilters = () => {
  emit('apply', [...selectedValues.value])
  op.value.hide()
}

const handleSelectChange = () => {}

defineExpose({ toggle })
</script>

