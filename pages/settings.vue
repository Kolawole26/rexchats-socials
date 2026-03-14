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
        :showCloseIcon="false"
        class="w-full sm:w-[420px]"
      >
        <template #header>
          <div class="w-full flex items-center justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-10 h-10 rounded-xl bg-info-50 text-info-300 flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <BaseCustomIcon name="logistics" customClass="w-5 h-5" />
              </div>
              <div class="min-w-0">
                <h4 class="text-neutral-primary">Delivery Price</h4>
                <p class="body-small text-neutral-secondary truncate">
                  Set price for delivery location
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
              @click="deliveryEditorOpen = false"
            />
          </div>
        </template>

        <div class="flex flex-col h-full">
          <div class="flex flex-col gap-2">
            <p class="label text-neutral-primary">Delivery Price</p>
            <FormText
              v-model="deliveryDraftAmount"
              inputId="delivery-price"
              name="delivery_price"
              type="number"
              :placeholder="
                selectedDeliveryPrice ? selectedDeliveryPrice.currency + '0.00' : '0.00'
              "
            />
          </div>

          <div class="mt-auto pt-6 border-t border-neutral-line">
            <div class="flex items-center gap-4">
              <CommonButton
                title="Cancel"
                type="button"
                bgColor="bg-neutral-muted hover:bg-neutral-line !h-12 rounded-xl flex-1"
                textColor="text-neutral-primary button"
                @click="deliveryEditorOpen = false"
              />
              <CommonButton
                title="Save"
                type="button"
                bgColor="bg-primary-300 hover:bg-primary-400 !h-12 rounded-xl flex-1"
                textColor="text-neutral-inverted button"
                @click="saveDeliveryPrice"
              />
            </div>
          </div>
        </div>
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
import { computed, ref, watch } from 'vue'
import FormText from '~/components/common/input/FormText.vue'
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
const deliveryDraftAmount = ref('')

const openDeliveryEditor = (price) => {
  selectedDeliveryPrice.value = price
  deliveryDraftAmount.value = String(price?.amount ?? '')
  deliveryEditorOpen.value = true
}

const saveDeliveryPrice = () => {
  if (!selectedDeliveryPrice.value) {
    deliveryEditorOpen.value = false
    return
  }

  const parsed = Number(deliveryDraftAmount.value)
  if (Number.isNaN(parsed)) return

  deliveryPrices.value = deliveryPrices.value.map((p) =>
    p.id === selectedDeliveryPrice.value.id ? { ...p, amount: parsed } : p
  )

  selectedDeliveryPrice.value = null
  deliveryEditorOpen.value = false
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




