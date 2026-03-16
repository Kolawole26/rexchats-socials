<template>
  <div class="flex flex-col gap-4">
    <div>
      <h4 class="text-neutral-primary">Product information</h4>
    </div>

    <div class="flex flex-col gap-2">
      <p class="label text-neutral-primary">Product Name</p>
      <FormText
        v-model="productForm.name"
        inputId="product-name"
        name="product_name"
        placeholder="Enter product name"
        :error="errors?.name"
        @update:modelValue="onValidate('name')"
      />
    </div>

    <div class="flex flex-col gap-2">
      <p class="label text-neutral-primary">Category</p>
      <FormSelect
        v-model="productForm.category"
        name="product_category"
        placeholder="Select"
        :options="categoryOptions"
        :showClear="true"
        :error="errors?.category"
        @change="onValidate('category')"
      />
    </div>

    <div class="flex flex-col gap-2">
      <p class="label text-neutral-primary">Status</p>
      <FormSelect
        v-model="productForm.status"
        name="product_status"
        placeholder="Select"
        :options="statusOptions"
        :showClear="true"
        :error="errors?.status"
        @change="onValidate('status')"
      />
    </div>

    <div class="flex flex-col gap-2">
      <p class="label text-neutral-primary">Description (optional)</p>
      <FormText
        v-model="productForm.description"
        inputId="product-description"
        name="product_description"
        type="textarea"
        placeholder="Enter"
        :error="errors?.description"
        @update:modelValue="onValidate('description')"
      />
    </div>
  </div>
</template>

<script setup>
import FormSelect from '~/components/common/input/FormSelect.vue'
import FormText from '~/components/common/input/FormText.vue'

const props = defineProps({
  productForm: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  categoryOptions: { type: Array, default: () => [] },
  statusOptions: { type: Array, default: () => [] },
  validateField: { type: Function, default: null }
})

const onValidate = (field) => {
  if (!props.validateField) return
  props.validateField(field)
}
</script>
