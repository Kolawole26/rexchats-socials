<template>
  <section class="flex flex-col gap-8">
    <div class="flex items-center gap-2">
      <NuxtLink to="/products" class="body-small text-neutral-secondary hover:underline">Products</NuxtLink>
      <BaseCustomIcon name="chevron-down" customClass="w-4 h-4 text-neutral-secondary -rotate-90" />
      <p class="body-small text-neutral-primary font-semibold">Edit Product</p>
    </div>

    <div class="max-w-[720px] mx-auto w-full">
      <div class="relative flex items-start justify-between gap-4">
        <div class="absolute left-0 right-0 top-5 h-[2px] bg-neutral-line" aria-hidden="true" />
        <div class="absolute left-0 top-5 h-[2px] bg-primary-100" :style="{ width: progressWidth }" aria-hidden="true" />

        <div v-for="(step, index) in steps" :key="step.key" class="relative z-10 flex flex-col items-center gap-2 w-full">
          <span class="w-10 h-10 rounded-full flex items-center justify-center border" :class="stepCircleClass(index + 1)">
            <BaseCustomIcon v-if="index + 1 < currentStep" name="check-green" customClass="w-5 h-5" />
            <span
              v-else
              class="w-2 h-2 rounded-full"
              :class="index + 1 === currentStep ? 'bg-primary-300' : 'bg-neutral-line'"
            />
          </span>
          <p class="body-small text-neutral-primary text-center">{{ step.label }}</p>
        </div>
      </div>
    </div>

    <ProductInformationStep
      v-if="currentStep === 1"
      :product-form="productForm"
      :errors="errors"
      :validate-field="validateField"
    />

    <AdditionalInformationStep
      v-else-if="currentStep === 2"
      :product-form="productForm"
      :errors="errors"
      :variant-errors="variantErrors"
      :type-options="typeOptions"
      :validate-field="validateField"
      :validate-variant-field="validateVariantField"
      @open-keywords="keywordModalOpen = true"
      @add-variant="addVariant"
      @remove-variant="removeVariant"
      @remove-keyword="removeKeyword"
      @variants-toggle="onVariantsToggle"
    />

    <ProductReviewStep v-else :product-form="productForm" />

    <div class="max-w-[720px] mx-auto w-full flex items-center justify-between gap-4 pt-4">
      <CommonButton
        title="Back"
        type="button"
        bgColor="bg-neutral-muted hover:bg-neutral-line !h-12 rounded-xl"
        textColor="text-neutral-primary button"
        @click="onBack"
      />

      <CommonButton
        :title="primaryButtonLabel"
        type="button"
        bgColor="bg-primary-300 hover:bg-primary-400 !h-12 rounded-xl"
        textColor="text-neutral-inverted button"
        @click="onPrimary"
      />
    </div>

    <AddKeywordsModal
      v-model:isVisible="keywordModalOpen"
      :options="keywordOptions"
      @add="addKeyword"
      @close="keywordModalOpen = false"
    />
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Joi from 'joi'

import AddKeywordsModal from '~/components/products/AddKeywordsModal.vue'
import AdditionalInformationStep from '~/components/products/steps/AdditionalInformationStep.vue'
import ProductInformationStep from '~/components/products/steps/ProductInformationStep.vue'
import ProductReviewStep from '~/components/products/steps/ProductReviewStep.vue'

import sample1 from '~/assets/images/products/sample-1.png'
import sample2 from '~/assets/images/products/sample-2.png'
import sample3 from '~/assets/images/products/sample-3.png'
import sample4 from '~/assets/images/products/sample-4.png'
import sample5 from '~/assets/images/products/sample-5.png'
import sample6 from '~/assets/images/products/sample-6.png'

const route = useRoute()
const router = useRouter()

const steps = [
  { key: 'info', label: 'Product Information' },
  { key: 'additional', label: 'Additional Information' },
  { key: 'review', label: 'ProductReview' }
]

const currentStep = ref(1)
const keywordModalOpen = ref(false)

const typeOptions = [
  { name: 'Jacket', value: 'Jacket' },
  { name: 'Shirt', value: 'Shirt' },
  { name: 'Trouser', value: 'Trouser' },
  { name: 'Sneakers', value: 'Sneakers' }
]

const keywordOptions = [
  { name: '#Shirt', value: '#Shirt' },
  { name: '#Leather', value: '#Leather' },
  { name: '#Jacket', value: '#Jacket' },
  { name: '#Jasmin', value: '#Jasmin' },
  { name: '#JasminJacket', value: '#JasminJacket' },
  { name: '#BikerJacket', value: '#BikerJacket' },
  { name: '#BlackJacket', value: '#BlackJacket' },
  { name: '#Premium', value: '#Premium' },
  { name: '#PremiumJacket', value: '#PremiumJacket' }
]

const allProducts = [
  {
    id: '12345',
    name: 'Jasmin Jacket',
    description:
      'This is a unisex leather jacket suitable for winter or spring weather but can be rocked whenever',
    type: 'Jacket',
    images: [sample1, sample1, sample1, sample1],
    keywords: [
      '#Shirt',
      '#Leather',
      '#Jacket',
      '#Jasmin',
      '#JasminJacket',
      '#BikerJacket',
      '#BlackJacket',
      '#Premium',
      '#PremiumJacket'
    ],
    variants: [
      { size: 'Medium (XL)', colour: 'Black', price: 100 },
      { size: 'Large (L)', colour: 'Black', price: 100 },
      { size: 'Extra Large (XL)', colour: 'Black', price: 100 }
    ]
  },
{
  id: "12346",
  name: "Nike Sweat Shirt",
  description: "Comfortable sweat shirt for all seasons.",
  type: "Shirt",
  images: [sample2, sample2, sample2, sample2],
  keywords: ["#Shirt", "#Premium"],
  price: 50,
  variants: []
},
  {
    id: '12347',
    name: 'Plain Trouser',
    description: 'A classic plain trouser for everyday use.',
    type: 'Trouser',
    images: [sample3, sample3, sample3, sample3],
    keywords: ['#Trouser'],
    variants: [{ size: '32', colour: 'Black', price: 40 }]
  }
]

const findById = (id) => {
  const match = allProducts.find((p) => String(p.id) === String(id))
  return match || allProducts[0]
}

const initial = findById(route.params.id)

const fillImages = (images) => {
  const list = Array.isArray(images) ? images.slice(0, 4) : []
  while (list.length < 4) list.push(null)
  return list
}

const hasVariants = Array.isArray(initial.variants) && initial.variants.length > 0

const productForm = reactive({
  name: initial.name || '',
  description: initial.description || '',
  images: fillImages(initial.images),
  type: initial.type || null,
  keywords: Array.isArray(initial.keywords) ? initial.keywords : [],
  hasVariants,
  price: hasVariants ? '' : String((initial.price ?? '') || ''),
  variants: hasVariants
    ? initial.variants.map((v) => ({
        size: v.size || '',
        colour: v.colour || '',
        price: String(v.price ?? '')
      }))
    : [{ size: '', colour: '', price: '' }]
})

const errors = ref({})
const variantErrors = ref([])

const progressWidth = computed(() => {
  const total = steps.length - 1
  if (total <= 0) return '0%'
  const ratio = (Number(currentStep.value) - 1) / total
  const safe = Math.max(0, Math.min(1, ratio))
  return String(Math.round(safe * 100)) + '%'
})

const primaryButtonLabel = computed(() => {
  if (currentStep.value === 3) return 'Save Product'
  return 'Continue'
})

const stepCircleClass = (stepNumber) => {
  if (stepNumber < currentStep.value) {
    return 'bg-primary-300 border-primary-300 text-neutral-inverted'
  }

  if (stepNumber === currentStep.value) {
    return 'bg-neutral-surface border-primary-300 text-primary-300'
  }

  return 'bg-neutral-muted border-neutral-line text-neutral-secondary'
}


const validationSchema = computed(() => {
  return {
    name: Joi.string().trim().min(2).required().messages({
      'string.empty': 'Product name is required',
      'any.required': 'Product name is required',
      'string.min': 'Product name must be at least 2 characters'
    }),
    description: Joi.string().trim().min(10).required().messages({
      'string.empty': 'Product description is required',
      'any.required': 'Product description is required',
      'string.min': 'Product description must be at least 10 characters'
    }),
    images: Joi.array().custom((value, helpers) => {
      if (Array.isArray(value) && value.some((v) => Boolean(v))) return value
      return helpers.error('any.custom')
    }).messages({
      'any.custom': 'At least one product image is required'
    }),
    type: Joi.string().required().messages({
      'string.empty': 'Product type is required',
      'any.required': 'Product type is required'
    }),
    price: Joi.number().positive().required().messages({
      'any.required': 'Product price is required',
      'number.base': 'Product price must be a number',
      'number.positive': 'Product price must be greater than 0'
    })
  }
})

const variantSchema = {
  size: Joi.string().trim().required().messages({
    'string.empty': 'Size is required',
    'any.required': 'Size is required'
  }),
  colour: Joi.string().trim().required().messages({
    'string.empty': 'Colour is required',
    'any.required': 'Colour is required'
  }),
  price: Joi.number().positive().required().messages({
    'any.required': 'Price is required',
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be greater than 0'
  })
}

const validateField = (field) => {
  const rule = validationSchema.value[field]
  if (!rule) return

  const valueMap = {
    name: productForm.name,
    description: productForm.description,
    images: productForm.images,
    type: productForm.type,
    price: productForm.price
  }

  if (productForm.hasVariants && field === 'price') {
    delete errors.value.price
    return
  }

  const result = rule.validate(valueMap[field])

  if (result.error) {
    errors.value[field] = result.error.details[0].message
    return
  }

  delete errors.value[field]
}

const ensureVariantErrorIndex = (index) => {
  if (!Array.isArray(variantErrors.value)) variantErrors.value = []
  if (!variantErrors.value[index]) variantErrors.value[index] = {}
}

const validateVariantField = (index, field) => {
  ensureVariantErrorIndex(index)
  const rule = variantSchema[field]
  if (!rule) return

  const row = productForm.variants && productForm.variants[index] ? productForm.variants[index] : {}
  const value = row[field]

  const result = rule.validate(value)

  if (result.error) {
    variantErrors.value[index][field] = result.error.details[0].message
    return
  }

  delete variantErrors.value[index][field]
}

const validateVariants = () => {
  const list = Array.isArray(productForm.variants) ? productForm.variants : []
  if (list.length < 1) return false

  list.forEach((_, index) => {
    validateVariantField(index, 'size')
    validateVariantField(index, 'colour')
    validateVariantField(index, 'price')
  })

  return list.every((_, index) => {
    const rowErrors = variantErrors.value[index] || {}
    return !rowErrors.size && !rowErrors.colour && !rowErrors.price
  })
}

const validateStep = (step) => {
  if (step === 1) {
    validateField('name')
    validateField('description')
    validateField('images')

    return !errors.value.name && !errors.value.description && !errors.value.images
  }

  if (step === 2) {
    validateField('type')

    if (productForm.hasVariants) {
      const okVariants = validateVariants()
      return !errors.value.type && okVariants
    }

    validateField('price')
    return !errors.value.type && !errors.value.price
  }

  return true
}

const validateAll = () => {
  const ok1 = validateStep(1)
  const ok2 = validateStep(2)
  return ok1 && ok2
}

const addKeyword = (value) => {
  if (!value) return
  const list = Array.isArray(productForm.keywords) ? productForm.keywords : []
  if (list.includes(value)) return
  productForm.keywords = [...list, value]
}

const removeKeyword = (keyword) => {
  const list = Array.isArray(productForm.keywords) ? productForm.keywords : []
  productForm.keywords = list.filter((k) => k !== keyword)
}

const addVariant = () => {
  productForm.variants = [...productForm.variants, { size: '', colour: '', price: '' }]
}

const removeVariant = (index) => {
  const list = Array.isArray(productForm.variants) ? productForm.variants : []
  if (list.length < 2) return

  productForm.variants = list.filter((_, i) => i !== index)
  variantErrors.value = (Array.isArray(variantErrors.value) ? variantErrors.value : []).filter((_, i) => i !== index)
}

const onVariantsToggle = () => {
  if (productForm.hasVariants) {
    delete errors.value.price
    if (!Array.isArray(productForm.variants) || productForm.variants.length < 1) {
      productForm.variants = [{ size: '', colour: '', price: '' }]
    }
    return
  }

  variantErrors.value = []
}

const onBack = () => {
  if (currentStep.value > 1) {
    currentStep.value = currentStep.value - 1
    return
  }

  router.push('/products/' + String(initial.id))
}

const onPrimary = () => {
  const ok = validateStep(currentStep.value)
  if (!ok) return

  if (currentStep.value < 3) {
    currentStep.value = currentStep.value + 1
    return
  }

  if (!validateAll()) return
  router.push('/products/' + String(initial.id))
}
</script>
