<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-auto p-6">
      <div class="flex flex-col gap-6">
        <ProductDetailsForm
          :productForm="productForm"
          :errors="errors"
          :categoryOptions="categoryOptions"
          :statusOptions="statusOptions"
          :validateField="validateField"
        />

        <ProductPricingForm
          :productForm="productForm"
          :errors="errors"
          :validateField="validateField"
        />

        <ProductMediaForm
          :productForm="productForm"
          :errors="errors"
          :validateField="validateField"
          :sizeOptions="sizeOptions"
          :colorOptions="colorOptions"
          :categoryOptions="categoryOptions"
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
          :title="submitLabel"
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
import ProductDetailsForm from '~/components/products/forms/ProductDetailsForm.vue'
import ProductMediaForm from '~/components/products/forms/ProductMediaForm.vue'
import ProductPricingForm from '~/components/products/forms/ProductPricingForm.vue'

const props = defineProps({
  productForm: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  validateField: { type: Function, default: null },
  categoryOptions: { type: Array, default: () => [] },
  statusOptions: { type: Array, default: () => [] },
  sizeOptions: { type: Array, default: () => [] },
  colorOptions: { type: Array, default: () => [] },
  submitLabel: { type: String, default: 'Add Product' }
})

const emit = defineEmits(['cancel', 'save'])
</script>
