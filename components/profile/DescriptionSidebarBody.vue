<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-auto p-6">
      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Description</p>
        <FormText
          v-model="form.description"
          name="description"
          type="textarea"
          placeholder="Enter"
          :error="errors?.description"
          @input="onValidate('description')"
        />
      </div>
    </div>

    <div class="bg-neutral-surface border-t border-neutral-line p-6">
      <div class="flex items-center gap-3">
        <CommonButton
          title="Cancel"
          type="button"
          bgColor="bg-neutral-muted hover:bg-neutral-line !h-12 rounded-xl"
          textColor="text-neutral-primary button"
          fullWidth
          @click="emit('cancel')"
        />
        <CommonButton
          title="Save"
          type="button"
          bgColor="bg-primary-300 hover:bg-primary-400 !h-12 rounded-xl"
          textColor="text-neutral-inverted button"
          fullWidth
          @click="emit('save')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import FormText from '~/components/common/input/FormText.vue'

const props = defineProps({
  form: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  validateField: { type: Function, default: null }
})

const emit = defineEmits(['cancel', 'save'])

const onValidate = (field) => {
  if (!props.validateField) return
  props.validateField(field)
}
</script>
