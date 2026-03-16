<template>
  <div class="flex flex-col gap-4">
    <div class="pt-2 border-t border-neutral-line">
      <h4 class="text-neutral-primary">Pricing and inventory</h4>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Price</p>
        <FormText
          v-model="productForm.price"
          inputId="product-price"
          name="product_price"
          type="number"
          placeholder="€0.00"
          :error="errors?.price"
          @update:modelValue="onValidate('price')"
        />
      </div>

      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Stock Count</p>
        <FormText
          v-model="productForm.stock"
          inputId="product-stock"
          name="product_stock"
          type="number"
          placeholder="0"
          :error="errors?.stock"
          @update:modelValue="onValidate('stock')"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">SKU (optional)</p>
        <FormText
          v-model="productForm.sku"
          inputId="product-sku"
          name="product_sku"
          placeholder="Enter SKU"
          :error="errors?.sku"
          @update:modelValue="onValidate('sku')"
        />
      </div>

      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Compare at price (optional)</p>
        <FormText
          v-model="productForm.compareAtPrice"
          inputId="product-compare-price"
          name="product_compare_price"
          type="number"
          placeholder="€0.00"
          :error="errors?.compareAtPrice"
          @update:modelValue="onValidate('compareAtPrice')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import FormText from '~/components/common/input/FormText.vue'

const props = defineProps({
  productForm: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  validateField: { type: Function, default: null }
})

const onValidate = (field) => {
  if (!props.validateField) return
  props.validateField(field)
}
</script>
