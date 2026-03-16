<template>
  <section class="flex flex-col gap-6">
    <div
      class="inline-flex items-center bg-neutral-surface border border-neutral-line rounded-xl p-1 gap-1 w-fit"
      role="tablist"
      aria-label="Settings tabs"
    >
      <CommonButton
        v-for="tab in visibleTabs"
        :key="tab.value"
        type="button"
        size="sm"
        :bgColor="
          activeTab === tab.value
            ? 'bg-neutral-muted !h-9'
            : 'bg-transparent hover:bg-neutral-muted !h-9'
        "
        :textColor="
          activeTab === tab.value
            ? 'text-neutral-primary button'
            : 'text-neutral-secondary button'
        "
        :aria-selected="activeTab === tab.value"
        role="tab"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </CommonButton>
    </div>

    <section
      v-if="activeTab === 'general'"
      class="bg-neutral-surface border border-neutral-line rounded-2xl p-6"
    >
      <div v-if="isVendor" class="mb-5">
        <h3 class="text-neutral-primary">All general settings</h3>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          v-for="channel in channels"
          :key="channel.key"
          class="bg-neutral-muted border border-neutral-line rounded-2xl p-6 flex flex-col gap-6"
        >
          <div class="flex items-start justify-between gap-4">
            <div
              class="w-10 h-10 rounded-xl bg-neutral-surface flex items-center justify-center"
              :class="channel.iconColor"
              aria-hidden="true"
            >
              <BaseCustomIcon :name="channel.icon" customClass="w-5 h-5" />
            </div>

            <span
              class="inline-flex items-center gap-2 rounded-full px-3 py-1 body-xsmall"
              :class="
                channelEnabled(channel.key)
                  ? 'bg-success-50 text-success-300'
                  : 'bg-danger-50 text-danger-300'
              "
            >
              <BaseCustomIcon
                :name="channelEnabled(channel.key) ? 'check-green' : 'cancel-red'"
                customClass="w-4 h-4"
              />
              {{ channelEnabled(channel.key) ? 'Active' : 'Suspended' }}
            </span>
          </div>

          <div class="flex flex-col gap-1">
            <h4 class="text-neutral-primary">{{ channel.label }}</h4>
            <p class="body-small text-neutral-secondary">
              {{ isAdmin ? channel.adminDescription : channel.vendorDescription }}
            </p>
          </div>

          <div>
            <CommonButton
              :title="channelEnabled(channel.key) ? 'Switch Off' : 'Switch On'"
              type="button"
              bgColor="bg-primary-300 hover:bg-primary-400 !h-10 rounded-xl"
              textColor="text-neutral-inverted button"
              @click="toggleChannel(channel.key)"
            >
              <template #icon-right>
                <BaseCustomIcon
                  :name="channelEnabled(channel.key) ? 'cancel-red' : 'check-green'"
                  customClass="w-4 h-4"
                />
              </template>
            </CommonButton>
          </div>
        </div>
      </div>
    </section>

    <section
      v-else-if="activeTab === 'logistics'"
      class="bg-neutral-surface border border-neutral-line rounded-2xl p-6"
    >
      <div class="mb-5">
        <h3 class="text-neutral-primary">Your delivery prices</h3>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          v-for="price in deliveryPrices"
          :key="price.id"
          class="bg-neutral-muted border border-neutral-line rounded-2xl p-6 flex flex-col gap-6"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-10 h-10 rounded-xl bg-neutral-surface flex items-center justify-center"
                :class="price.iconColor"
                aria-hidden="true"
              >
                <BaseCustomIcon name="logistics" customClass="w-5 h-5" />
              </div>
              <h5 class="text-neutral-primary truncate">{{ price.location }}</h5>
            </div>

            <span
              class="inline-flex items-center rounded-full px-3 py-1 bg-neutral-surface text-neutral-secondary body-xsmall shrink-0"
            >
              per delivery
            </span>
          </div>

          <h3 class="text-neutral-primary">
            {{ price.currency }}{{ formatMoney(price.amount) }}
          </h3>

          <CommonButton
            title="Edit"
            type="button"
            bgColor="bg-primary-300 hover:bg-primary-400 !h-10 rounded-xl w-fit"
            textColor="text-neutral-inverted button"
            @click="openDeliveryEditor(price)"
          >
            <template #icon-right>
              <BaseCustomIcon name="pen" customClass="w-4 h-4" />
            </template>
          </CommonButton>
        </div>
      </div>

      <Sidebar
        v-model:visible="deliveryEditorOpen"
        position="right"
        :style="{ maxWidth: '400px', width: '100%' }"
        modal
        class="custom-modal-drawer rounded-tl-lg rounded-bl-lg"
        :showCloseIcon="false"
        :show-header="false"
      >
        <div class="w-full flex items-start justify-between gap-3 p-6">
          <div class="flex items-start gap-3 min-w-0">
            <div
              class="p-2 rounded-xl bg-neutral-background border border-neutral-line flex items-center justify-center text-neutral-primary"
              aria-hidden="true"
            >
              <BaseCustomIcon name="logistics" customClass="" />
            </div>
            <div class="flex flex-col min-w-0">
              <h4 class="text-neutral-primary">Delivery Price</h4>
              <p class="body-small text-neutral-secondary truncate">
                Set price for {{ selectedDeliveryPrice?.location || 'delivery location' }}
              </p>
            </div>
          </div>

          <CommonButton
            aria-label="Close"
            type="button"
            title=""
            bgColor="bg-transparent hover:bg-neutral-muted !h-10 !w-10 !px-0"
            textColor="text-neutral-secondary"
            createIcon="cancel-red"
            @click="closeDeliveryEditor"
          />
        </div>

        <DeliveryPriceSidebarBody
          :deliveryPriceForm="deliveryPriceForm"
          :errors="deliveryPriceErrors"
          :currency="selectedDeliveryPrice?.currency || ''"
          :validateField="validateDeliveryPriceField"
          @cancel="closeDeliveryEditor"
          @save="saveDeliveryPrice"
        />
      </Sidebar>
    </section>

    <section
      v-else-if="activeTab === 'faqs'"
      class="bg-neutral-surface border border-neutral-line rounded-2xl p-6"
    >
      <div class="mb-5">
        <h3 class="text-neutral-primary">Your frequently asked questions</h3>
      </div>

      <div class="flex flex-col gap-6">
        <div
          v-for="(row, index) in faqs"
          :key="row.id"
          class="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4 items-end"
        >
          <div class="flex flex-col gap-2">
            <p class="label text-neutral-primary">Question {{ index + 1 }}</p>
            <FormText
              v-model="row.question"
              :inputId="'faq-question-' + row.id"
              name="faq_question"
              placeholder="Enter question"
            />
          </div>

          <div class="flex flex-col gap-2">
            <p class="label text-neutral-primary">Answer</p>
            <FormText
              v-model="row.answer"
              :inputId="'faq-answer-' + row.id"
              name="faq_answer"
              placeholder="Enter answer"
            />
          </div>

          <div class="flex items-center gap-3 justify-end">
            <CommonButton
              aria-label="Delete FAQ"
              type="button"
              title=""
              bgColor="bg-danger-50 hover:bg-danger-100 !h-10 !w-10 !px-0 rounded-xl"
              textColor="text-danger-300"
              createIcon="trash"
              :disabled="faqs.length === 1"
              @click="removeFaq(row.id)"
            />

            <CommonButton
              v-if="index === faqs.length - 1"
              aria-label="Add FAQ"
              type="button"
              title=""
              bgColor="bg-neutral-muted hover:bg-neutral-line !h-10 !w-10 !px-0 rounded-xl"
              textColor="text-neutral-secondary"
              createIcon="plus"
              @click="addFaq"
            />
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
import Joi from 'joi'
import { computed, reactive, ref, watch } from 'vue'
import FormText from '~/components/common/input/FormText.vue'
import DeliveryPriceSidebarBody from '~/components/settings/DeliveryPriceSidebarBody.vue'
import { useUserDetailsStore } from '~/store/userDetailsStore'

definePageMeta({
  layout: 'default',
  customProp: 'Settings'
})

const userStore = useUserDetailsStore()

const role = computed(() => {
  const rawUser = userStore?.user?.value ?? userStore?.user ?? {}
  const rawRole =
    rawUser?.role ??
    rawUser?.user_role ??
    rawUser?.userRole ??
    rawUser?.type ??
    rawUser?.accountType ??
    rawUser?.account_type ??
    ''

  return String(rawRole || '').toLowerCase()
})

const isAdmin = computed(() => role.value.includes('admin'))
const isVendor = computed(() => role.value.includes('vendor') || !isAdmin.value)

const tabs = [
  { label: 'General', value: 'general' },
  { label: 'Logistics', value: 'logistics' },
  { label: 'FAQs', value: 'faqs' }
]

const visibleTabs = computed(() => (isVendor.value ? tabs : [tabs[0]]))
const activeTab = ref('general')

watch(
  () => isVendor.value,
  (next) => {
    if (!next) activeTab.value = 'general'
  },
  { immediate: true }
)
const channels = ref([
  {
    key: 'facebook',
    label: 'Facebook',
    icon: 'facebook',
    iconColor: 'text-info-300',
    adminDescription: 'This controls the AI access to Facebook chat for all vendors',
    vendorDescription: 'This controls the AI access to your vendor Facebook account chats'
  },
  {
    key: 'instagram',
    label: 'Instagram',
    icon: 'instagram',
    iconColor: 'text-danger-300',
    adminDescription: 'This controls the AI access to Instagram chat for all vendors',
    vendorDescription: 'This controls the AI access to your vendor Instagram chats'
  }
])

const channelState = ref({
  facebook: true,
  instagram: false
})

const channelEnabled = (key) => Boolean(channelState.value[key])
const toggleChannel = (key) => {
  channelState.value = { ...channelState.value, [key]: !channelEnabled(key) }
}

const deliveryPrices = ref([
  { id: 'kosovo', location: 'Kosovo', currency: '€', amount: 2, iconColor: 'text-info-300' },
  { id: 'albania', location: 'Albania', currency: '€', amount: 5, iconColor: 'text-primary-300' },
  { id: 'macedonia', location: 'Macedonia', currency: '€', amount: 5, iconColor: 'text-success-300' }
])

const deliveryEditorOpen = ref(false)
const selectedDeliveryPrice = ref(null)

const deliveryPriceForm = reactive({
  amount: ''
})

const deliveryPriceErrors = ref({})
const deliveryPriceValidationSchema = {
  amount: Joi.number().min(0).empty('').required().messages({
    'any.required': 'Delivery price is required',
    'number.base': 'Enter a valid delivery price',
    'number.min': 'Delivery price cannot be negative'
  })
}

const validateDeliveryPriceField = (field) => {
  const rule = deliveryPriceValidationSchema[field]
  if (!rule) return

  const valueMap = {
    amount: deliveryPriceForm.amount
  }

  const result = rule.validate(valueMap[field])

  if (result.error) {
    deliveryPriceErrors.value[field] = result.error.details[0].message
    return
  }

  delete deliveryPriceErrors.value[field]
}

const validateDeliveryPriceForm = () => {
  const keys = Object.keys(deliveryPriceValidationSchema)
  keys.forEach((field) => validateDeliveryPriceField(field))
  return keys.every((field) => !deliveryPriceErrors.value[field])
}

const closeDeliveryEditor = () => {
  deliveryEditorOpen.value = false
  selectedDeliveryPrice.value = null
  deliveryPriceForm.amount = ''
  deliveryPriceErrors.value = {}
}

const openDeliveryEditor = (price) => {
  selectedDeliveryPrice.value = price
  deliveryPriceErrors.value = {}
  deliveryPriceForm.amount = String(price?.amount ?? '')
  deliveryEditorOpen.value = true
}

const saveDeliveryPrice = () => {
  if (!selectedDeliveryPrice.value) {
    closeDeliveryEditor()
    return
  }

  if (!validateDeliveryPriceForm()) return

  const parsed = Number(deliveryPriceForm.amount)
  if (Number.isNaN(parsed)) return

  deliveryPrices.value = deliveryPrices.value.map((p) =>
    p.id === selectedDeliveryPrice.value.id ? { ...p, amount: parsed } : p
  )

  closeDeliveryEditor()
}

const formatMoney = (amount) => {
  const n = Number(amount)
  if (Number.isNaN(n)) return '0.00'
  return n.toFixed(2)
}

const faqs = ref([
  { id: 'faq-1', question: '', answer: '' },
  { id: 'faq-2', question: '', answer: '' }
])

const addFaq = () => {
  faqs.value = [
    ...faqs.value,
    {
      id: 'faq-' + (Date.now().toString(36) + Math.random().toString(36).slice(2)),
      question: '',
      answer: ''
    }
  ]
}

const removeFaq = (id) => {
  if (faqs.value.length <= 1) return
  faqs.value = faqs.value.filter((row) => row.id !== id)
}
</script>





