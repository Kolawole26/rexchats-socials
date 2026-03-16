<template>
  <div class="flex flex-col gap-4">
    <div class="pt-2 border-t border-neutral-line">
      <h4 class="text-neutral-primary">Variants and media</h4>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Sizes (optional)</p>
        <FormSelect
          v-model="productForm.sizes"
          name="product_sizes"
          placeholder="Select"
          :options="sizeOptions"
          :showClear="true"
          multiple
          :error="errors?.sizes"
          @change="onValidate('sizes')"
        />
      </div>

      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Colors (optional)</p>
        <FormSelect
          v-model="productForm.colors"
          name="product_colors"
          placeholder="Select"
          :options="colorOptions"
          :showClear="true"
          multiple
          :error="errors?.colors"
          @change="onValidate('colors')"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between gap-4">
        <div class="min-w-0">
          <p class="label text-neutral-primary">Product Images</p>
          <p class="body-small text-neutral-secondary">Upload at least one image (SVG/PNG/JPG).</p>
        </div>

        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          multiple
          @change="onFilesSelected"
        />

        <CommonButton
          title="Upload"
          type="button"
          bgColor="bg-transparent border border-primary-300 hover:bg-primary-50 !h-10"
          textColor="text-primary-400 button"
          createIcon="plus"
          @click="fileInputRef?.click()"
        />
      </div>

      <p v-if="errors?.images" class="body-xsmall text-danger-300">{{ errors.images }}</p>

      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="img in previewImages"
          :key="img.id"
          class="relative border border-neutral-line rounded-xl overflow-hidden bg-neutral-muted"
        >
          <img :src="img.url" alt="" class="w-full h-20 object-cover" />
          <CommonButton aria-label="Remove image" type="button" title="" bgColor="absolute top-2 right-2 bg-neutral-surface/90 border border-neutral-line hover:bg-neutral-muted !h-7 !w-7 !px-0" textColor="text-neutral-secondary" createIcon="cancel-red" @click="removeImage(img.id)" />
        </div>

        <div
          v-if="!previewImages.length"
          class="col-span-3 border border-dashed border-neutral-line rounded-xl p-6 bg-neutral-background"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-neutral-surface border border-neutral-line flex items-center justify-center text-primary-400">
              <BaseCustomIcon name="products" customClass="w-5 h-5" />
            </div>
            <div>
              <p class="body-small text-neutral-primary font-semibold">No images selected</p>
              <p class="body-xsmall text-neutral-secondary">Click Upload to add product images.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-start gap-3 p-4 bg-neutral-muted border border-neutral-line rounded-2xl">
        <div class="w-10 h-10 rounded-xl bg-neutral-surface border border-neutral-line flex items-center justify-center text-neutral-secondary" aria-hidden="true">
          <BaseCustomIcon name="eye" customClass="w-5 h-5" />
        </div>
        <div class="min-w-0">
          <p class="label text-neutral-primary">Preview</p>
          <p class="body-small text-neutral-secondary">This is how your product selection looks after input.</p>
          <div class="mt-3 flex items-center gap-3">
            <img :src="previewPrimaryUrl" alt="" class="w-12 h-12 rounded-xl object-cover border border-neutral-line bg-neutral-muted" />
            <div class="min-w-0">
              <p class="body-small text-neutral-primary font-semibold truncate">{{ productForm.name || 'Product name' }}</p>
              <p class="body-xsmall text-neutral-secondary truncate">
                {{ categoryLabel || 'Category' }} · {{ priceLabel || '€0.00' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import FormSelect from '~/components/common/input/FormSelect.vue'
import sample1 from '~/assets/images/products/sample-1.svg'

const props = defineProps({
  productForm: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  validateField: { type: Function, default: null },
  sizeOptions: { type: Array, default: () => [] },
  colorOptions: { type: Array, default: () => [] },
  categoryOptions: { type: Array, default: () => [] }
})

const fileInputRef = ref(null)

const onValidate = (field) => {
  if (!props.validateField) return
  props.validateField(field)
}

const previewImages = computed(() => {
  const list = Array.isArray(props.productForm.images) ? props.productForm.images : []
  return list
    .map((item) => ({
      id: item?.id,
      url: item?.url
    }))
    .filter((i) => i.id && i.url)
})

const previewPrimaryUrl = computed(() => previewImages.value[0]?.url || sample1)

const categoryLabel = computed(() => {
  const value = props.productForm.category
  const opt = props.categoryOptions.find((o) => o.value === value)
  return opt ? opt.name : ''
})

const priceLabel = computed(() => {
  const v = props.productForm.price
  const n = Number(v)
  if (Number.isNaN(n)) return ''
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(n)
})

const onFilesSelected = (event) => {
  const input = event?.target
  const files = input?.files ? Array.from(input.files) : []
  if (!files.length) return

  if (!Array.isArray(props.productForm.images)) props.productForm.images = []

  files.forEach((file) => {
    const id = `img-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
    const url = URL.createObjectURL(file)
    props.productForm.images.push({ id, url, name: file.name })
  })

  onValidate('images')

  if (input) input.value = ''
}

const removeImage = (id) => {
  const list = Array.isArray(props.productForm.images) ? props.productForm.images : []
  const idx = list.findIndex((i) => i?.id === id)
  if (idx === -1) return

  const url = list[idx]?.url
  if (url && String(url).startsWith('blob:')) {
    try {
      URL.revokeObjectURL(url)
    } catch (_) {}
  }

  list.splice(idx, 1)
  onValidate('images')
}
</script>

