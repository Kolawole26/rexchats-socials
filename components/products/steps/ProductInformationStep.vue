<template>
  <section class="max-w-[720px] mx-auto w-full">
    <h3 class="text-neutral-primary mb-6">Product Information</h3>

    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Product Name</p>
        <FormText
          v-model="productForm.name"
          inputId="product-name"
          name="product_name"
          placeholder="Enter product name"
          :error="errors?.name"
          @input="onValidate('name')"
        />
      </div>

      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Product Description</p>
        <FormText
          v-model="productForm.description"
          inputId="product-description"
          name="product_description"
          type="textarea"
          placeholder="Enter brief description"
          :error="errors?.description"
          @input="onValidate('description')"
        />
      </div>

      <ProductImagesUploader
        v-model="productForm.images"
        :error="errors?.images"
        @input="onValidate('images')"
      />
    </div>
  </section>
</template>

<script setup>
import FormText from '~/components/common/input/FormText.vue'
import ProductImagesUploader from '~/components/products/forms/ProductImagesUploader.vue'

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
