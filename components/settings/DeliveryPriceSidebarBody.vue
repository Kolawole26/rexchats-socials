<template>
  <div class="flex flex-col gap-6 p-6 h-full">
    <div class="flex flex-col gap-2">
      <p class="label text-neutral-primary">Delivery Price</p>
      <FormText
        v-model="deliveryPriceForm.amount"
        inputId="delivery-price"
        name="delivery_price"
        type="number"
        :placeholder="currency ? currency + '0.00' : '0.00'"
        :error="errors?.amount"
        @input="onValidate('amount')"
      />
    </div>

    <div class="mt-auto pt-6 border-t border-neutral-line">
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
  deliveryPriceForm: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  currency: { type: String, default: '' },
  validateField: { type: Function, default: null }
})

const emit = defineEmits(['cancel', 'save'])

const onValidate = (field) => {
  if (!props.validateField) return
  props.validateField(field)
}
</script>