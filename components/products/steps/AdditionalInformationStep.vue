<template>
  <section class="max-w-[720px] mx-auto w-full">
    <h3 class="text-neutral-primary mb-6">Additional Information</h3>

    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Product Type</p>
        <FormSelect
          v-model="productForm.type"
          name="product_type"
          placeholder="e.g. shirt, shoe"
          :options="typeOptions"
          :showClear="true"
          :error="errors?.type"
          @change="onValidate('type')"
        />
      </div>

      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="min-w-0">
            <p class="label text-neutral-primary">
              Product Keyword
              <span class="body-xsmall text-neutral-secondary">(To help AI)</span>
            </p>
          </div>

          <CommonButton
            type="button"
            title="Add keyword"
            bgColor="bg-transparent hover:bg-primary-50 !h-10 !px-2"
            textColor="text-primary-300 button"
            createIcon="plus"
            @click="emit('open-keywords')"
          />
        </div>

        <div class="border border-neutral-line rounded-2xl bg-neutral-surface p-4">
          <div
            v-if="!productForm.keywords || productForm.keywords.length < 1"
            class="flex flex-col items-center justify-center gap-2 py-6"
          >
            <div class="w-10 h-10 rounded-xl bg-neutral-muted flex items-center justify-center">
              <p class="body-small text-neutral-primary">#</p>
            </div>
            <p class="body-xsmall text-neutral-secondary text-center max-w-[280px]">
              Add keywords to this product to help our AI attend to orders smarter
            </p>
          </div>

          <div v-else class="flex flex-wrap gap-2">
            <span
              v-for="keyword in productForm.keywords"
              :key="keyword"
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100"
            >
              <p class="body-xsmall text-primary-300">{{ keyword }}</p>
              <CommonButton
                aria-label="Remove keyword"
                type="button"
                title=""
                bgColor="bg-transparent hover:bg-primary-75 !h-6 !w-6 !px-0"
                textColor="text-primary-300"
                createIcon="cancel-red"
                @click.prevent.stop="emit('remove-keyword', keyword)"
              />
            </span>
          </div>
        </div>
      </div>

      <div class="bg-neutral-surface border border-neutral-line rounded-2xl p-4 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 min-w-0">
          <span class="w-7 h-7 rounded-full border border-primary-100 text-primary-300 flex items-center justify-center">
            <span class="body-xsmall">?</span>
          </span>
          <p class="label text-neutral-primary">Does this product have variant(s)</p>
        </div>

        <InputSwitch v-model="productForm.hasVariants" @change="onVariantsToggle" />
      </div>

      <div v-if="productForm.hasVariants" class="bg-neutral-surface border border-neutral-line rounded-2xl p-4">
        <div class="grid grid-cols-[24px_1fr_1fr_1fr_auto] gap-3 items-center mb-3">
          <div />
          <p class="body-xsmall text-neutral-secondary">Size</p>
          <p class="body-xsmall text-neutral-secondary">Colour</p>
          <p class="body-xsmall text-neutral-secondary">Price</p>
          <div />
        </div>

        <div class="flex flex-col gap-4">
          <div
            v-for="(variant, index) in productForm.variants"
            :key="index"
            class="grid grid-cols-[24px_1fr_1fr_1fr_auto] gap-3 items-start"
          >
            <p class="body-small text-neutral-secondary pt-2">{{ index + 1 }}</p>

            <FormText
              v-model="variant.size"
              inputId="variant-size"
              name="variant_size"
              placeholder="Enter size"
              :error="variantErrors && variantErrors[index] ? variantErrors[index].size : ''"
              @input="onValidateVariant(index, 'size')"
            />

            <FormText
              v-model="variant.colour"
              inputId="variant-colour"
              name="variant_colour"
              placeholder="Enter colour"
              :error="variantErrors && variantErrors[index] ? variantErrors[index].colour : ''"
              @input="onValidateVariant(index, 'colour')"
            />

            <FormText
              v-model="variant.price"
              inputId="variant-price"
              name="variant_price"
              type="number"
              placeholder="€0.0"
              :error="variantErrors && variantErrors[index] ? variantErrors[index].price : ''"
              @input="onValidateVariant(index, 'price')"
            />

            <div class="flex items-center gap-2 pt-1">
              <CommonButton
                aria-label="Add variant"
                type="button"
                title=""
                bgColor="bg-transparent hover:bg-neutral-muted !h-10 !w-10 !px-0 border border-neutral-line"
                textColor="text-primary-300"
                createIcon="plus"
                @click="emit('add-variant')"
                v-if="index === productForm.variants.length - 1"
              />

              <CommonButton
                aria-label="Remove variant"
                type="button"
                title=""
                bgColor="bg-transparent hover:bg-neutral-muted !h-10 !w-10 !px-0 border border-neutral-line"
                textColor="text-danger-300"
                createIcon="trash"
                @click="emit('remove-variant', index)"
                v-if="productForm.variants.length > 1"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Product Price</p>
        <FormText
          v-model="productForm.price"
          inputId="product-price"
          name="product_price"
          type="number"
          placeholder="€0.00"
          :error="errors?.price"
          @input="onValidate('price')"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import FormSelect from '~/components/common/input/FormSelect.vue'
import FormText from '~/components/common/input/FormText.vue'

const props = defineProps({
  productForm: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  variantErrors: { type: Array, default: () => [] },
  typeOptions: { type: Array, default: () => [] },
  validateField: { type: Function, default: null },
  validateVariantField: { type: Function, default: null }
})

const emit = defineEmits([
  'open-keywords',
  'add-variant',
  'remove-variant',
  'remove-keyword',
  'variants-toggle'
])

const onValidate = (field) => {
  if (!props.validateField) return
  props.validateField(field)
}

const onValidateVariant = (index, field) => {
  if (!props.validateVariantField) return
  props.validateVariantField(index, field)
}

const onVariantsToggle = () => {
  emit('variants-toggle')
}
</script>
