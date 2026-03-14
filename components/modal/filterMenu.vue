<template>
  <OverlayPanel ref="op" id="overlay_menu" :popup="true" class="w-[240px] rounded-lg">
    <div class="flex items-center px-4 py-[10px] bg-neutral-surface border-b border-neutral-100">
      <CommonButton
        aria-label="Close"
        type="button"
        title=""
        bgColor="bg-transparent hover:bg-primary-50 !h-10 !w-10 !px-0"
        textColor="text-neutral-text_primary"
        createIcon="cancel-red"
        @click="toggle"
      />
      <p class="mx-auto button text-neutral-text_primary">Filter</p>
    </div>

    <div class="p-4">
      <div v-for="(item, index) in items" :key="index" class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <label class="body-small text-neutral-text_primary">{{ item.label }}</label>
          <p
            class="body-small text-primary-300 cursor-pointer hover:underline"
            @click="handleClear(index)"
          >
            Clear
          </p>
        </div>

        <FormSelect
          v-if="item.field === 'Select'"
          v-model="selectedValues[index]"
          :options="item.options"
          placeholder="Select"
          class="h-[36px]"
          name="field"
          @change="handleSelectChange(index)"
        />

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

      <div class="flex items-center gap-4 pt-4 border-t border-neutral-100">
        <CommonButton
          title="Reset"
          bgColor="bg-neutral-muted !h-8"
          textColor="text-neutral-text_primary button"
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

watch(
  () => props.items,
  (newItems) => {
    selectedValues.value = newItems.map((item) =>
      item.hasDates ? { fromDate: null, toDate: null } : null
    )
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

const handleClear = (index) => {
  const item = props.items[index]
  selectedValues.value[index] = item.hasDates ? { fromDate: null, toDate: null } : null
}

const resetModal = () => {
  selectedValues.value = props.items.map((item) =>
    item.hasDates ? { fromDate: null, toDate: null } : null
  )
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
