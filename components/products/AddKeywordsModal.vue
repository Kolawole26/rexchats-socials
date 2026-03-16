<template>
  <Dialog
    v-model:visible="modalVisible"
    modal
    :show-header="false"
    class="w-full max-w-[420px] rounded-2xl p-0"
  >
    <div class="flex items-center px-6 py-4 bg-neutral-surface border-b border-neutral-line">
      <CommonButton
        aria-label="Close"
        type="button"
        title=""
        bgColor="bg-transparent hover:bg-primary-50 !h-10 !w-10 !px-0"
        textColor="text-neutral-primary"
        createIcon="cancel-red"
        @click="closeModal"
      />
      <h5 class="mx-auto text-neutral-primary">Add Keywords</h5>
    </div>

    <form class="p-6" @submit.prevent="onSubmit">
      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Keyword</p>
        <FormSelect
          v-model="keyword"
          name="keyword"
          placeholder="Select"
          :options="options"
          :showClear="true"
          :error="errors.keyword"
          @change="validateField('keyword')"
        />
      </div>

      <div class="flex items-center gap-4 pt-6 border-t border-neutral-line mt-6">
        <div class="w-full">
          <CommonButton
            title="Cancel"
            type="button"
            bgColor="bg-neutral-muted hover:bg-neutral-line !h-12 rounded-xl"
            textColor="text-neutral-primary button"
            fullWidth
            @click="closeModal"
          />
        </div>

        <div class="w-full">
          <CommonButton
            title="Add"
            type="submit"
            bgColor="bg-primary-300 hover:bg-primary-400 !h-12 rounded-xl"
            textColor="text-neutral-inverted button"
            fullWidth
          />
        </div>
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import Joi from 'joi'

import FormSelect from '~/components/common/input/FormSelect.vue'

const props = defineProps({
  isVisible: { type: Boolean, required: true },
  options: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:isVisible', 'close', 'add'])

const modalVisible = computed({
  get: () => props.isVisible,
  set: (value) => emit('update:isVisible', value)
})

const keyword = ref(null)
const errors = ref({})

const validationSchema = {
  keyword: Joi.string().required().messages({
    'string.empty': 'Keyword is required',
    'any.required': 'Keyword is required'
  })
}

const validateField = (field) => {
  const rule = validationSchema[field]
  if (!rule) return

  const value = { keyword: keyword.value }[field]
  const result = rule.validate(value)

  if (result.error) {
    errors.value[field] = result.error.details[0].message
    return
  }

  delete errors.value[field]
}

const reset = () => {
  keyword.value = null
  errors.value = {}
}

const closeModal = () => {
  reset()
  emit('close')
  emit('update:isVisible', false)
}

const onSubmit = () => {
  validateField('keyword')
  if (errors.value.keyword) return

  emit('add', keyword.value)
  closeModal()
}

watch(
  () => props.isVisible,
  (visible) => {
    if (!visible) reset()
  }
)
</script>
