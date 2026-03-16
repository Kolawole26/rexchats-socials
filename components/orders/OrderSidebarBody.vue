<template>
  <div class="flex flex-col gap-4 p-6">
    <div class="border border-neutral-line rounded-2xl p-5">
      <CommonButton
        type="button"
        title=""
        bgColor="bg-transparent hover:bg-neutral-muted !h-auto !px-0 !py-0"
        textColor=""
        class="w-full !justify-between !rounded-none"
        @click="sections.orderDetails = !sections.orderDetails"
      >
        <span class="body-small text-neutral-secondary tracking-wide">ORDER DETAILS</span>
        <BaseCustomIcon
          name="chevron-down"
          :customClass="chevronClass(sections.orderDetails)"
        />
      </CommonButton>

      <div v-if="sections.orderDetails" class="mt-4 flex flex-col gap-3">
        <div class="flex items-center justify-between gap-4">
          <p class="body-small text-neutral-secondary">Customer</p>
          <p class="body-small text-neutral-primary text-right">{{ selectedOrder?.customer_name || 'N/A' }}</p>
        </div>
        <div class="flex items-center justify-between gap-4">
          <p class="body-small text-neutral-secondary">Phone Number</p>
          <p class="body-small text-neutral-primary text-right">{{ selectedOrder?.customer_phone || 'N/A' }}</p>
        </div>
        <div class="flex items-center justify-between gap-4">
          <p class="body-small text-neutral-secondary">Platform</p>
          <div class="flex items-center gap-2">
            <span
              class="w-5 h-5 rounded-full flex items-center justify-center"
              :class="platformPillClass(selectedOrder?.platform)"
              aria-hidden="true"
            >
              <BaseCustomIcon :name="platformIcon(selectedOrder?.platform)" customClass="w-3.5 h-3.5" />
            </span>
            <p class="body-small text-neutral-primary">{{ platformLabel(selectedOrder?.platform) }}</p>
          </div>
        </div>
        <div class="flex items-center justify-between gap-4">
          <p class="body-small text-neutral-secondary">Order ID</p>
          <p class="body-small text-neutral-primary text-right">{{ selectedOrder?.order_id || 'N/A' }}</p>
        </div>
        <div class="flex items-center justify-between gap-4">
          <p class="body-small text-neutral-secondary">Date</p>
          <p class="body-small text-neutral-primary text-right">
            {{ selectedOrder?.date || 'N/A' }}<span v-if="selectedOrder?.time"> · {{ selectedOrder?.time }}</span>
          </p>
        </div>
        <div class="flex items-center justify-between gap-4">
          <p class="body-small text-neutral-secondary">Order Status</p>
          <span class="inline-flex items-center rounded-full px-3 py-1 body-xsmall" :class="orderStatusClass(selectedOrder?.status)">
            {{ orderStatusLabel(selectedOrder?.status) }}
          </span>
        </div>
        <div class="flex items-center justify-between gap-4">
          <p class="body-small text-neutral-secondary">Payment</p>
          <span class="inline-flex items-center rounded-full px-3 py-1 body-xsmall" :class="paymentStatusClass(selectedOrder?.payment)">
            {{ paymentStatusLabel(selectedOrder?.payment) }}
          </span>
        </div>
      </div>
    </div>

    <div class="border border-neutral-line rounded-2xl p-5">
      <CommonButton
        type="button"
        title=""
        bgColor="bg-transparent hover:bg-neutral-muted !h-auto !px-0 !py-0"
        textColor=""
        class="w-full !justify-between !rounded-none"
        @click="sections.items = !sections.items"
      >
        <span class="body-small text-neutral-secondary tracking-wide">ITEM(S)</span>
        <BaseCustomIcon
          name="chevron-down"
          :customClass="chevronClass(sections.items)"
        />
      </CommonButton>

      <div v-if="sections.items" class="mt-4 flex flex-col gap-4">
        <div v-if="!selectedOrder?.items || selectedOrder.items.length < 1" class="py-2">
          <p class="body-small text-neutral-secondary">No items available.</p>
        </div>

        <div v-else class="flex flex-col gap-4">
          <div
            v-for="(item, index) in selectedOrder.items"
            :key="index"
            class="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 items-start"
          >
            <p class="body-small text-neutral-primary">
              {{ item.qty }}x {{ item.name }}
            </p>
            <p class="body-small text-neutral-primary">{{ item.size || 'N/A' }}</p>
            <div class="flex items-center gap-2">
              <span
                class="w-3 h-3 rounded-full"
                :class="item.colorClass || 'bg-neutral-line'"
                aria-hidden="true"
              />
              <p class="body-small text-neutral-primary">{{ item.color || 'N/A' }}</p>
            </div>
            <p class="body-small text-neutral-primary">X{{ item.unitCount || 1 }}</p>
            <p class="body-small text-neutral-primary text-right">{{ formatCurrency(item.price) }}</p>
          </div>
        </div>

        <div class="border-t border-neutral-line pt-4 flex flex-col gap-3">
          <div class="flex items-center justify-between gap-4">
            <p class="body-small text-neutral-secondary">Item Total</p>
            <p class="body-small text-neutral-primary">{{ formatCurrency(selectedOrder?.item_total) }}</p>
          </div>
          <div class="flex items-center justify-between gap-4">
            <p class="body-small text-neutral-secondary">Delivery</p>
            <p class="body-small text-neutral-primary">{{ formatCurrency(selectedOrder?.delivery_fee) }}</p>
          </div>
          <div class="flex items-center justify-between gap-4">
            <p class="body-small text-neutral-secondary">Total Amount</p>
            <h4 class="text-neutral-primary">{{ formatCurrency(selectedOrder?.total_amount) }}</h4>
          </div>
        </div>
      </div>
    </div>

    <div class="border border-neutral-line rounded-2xl p-5">
      <CommonButton
        type="button"
        title=""
        bgColor="bg-transparent hover:bg-neutral-muted !h-auto !px-0 !py-0"
        textColor=""
        class="w-full !justify-between !rounded-none"
        @click="sections.delivery = !sections.delivery"
      >
        <span class="body-small text-neutral-secondary tracking-wide">DELIVERY DETAILS</span>
        <BaseCustomIcon
          name="chevron-down"
          :customClass="chevronClass(sections.delivery)"
        />
      </CommonButton>

      <div v-if="sections.delivery" class="mt-4 flex flex-col gap-3">
        <div class="flex items-center justify-between gap-4">
          <p class="body-small text-neutral-secondary">Address</p>
          <p class="body-small text-neutral-primary text-right">{{ selectedOrder?.address || 'N/A' }}</p>
        </div>
        <div class="flex items-center justify-between gap-4">
          <p class="body-small text-neutral-secondary">Postal Code</p>
          <p class="body-small text-neutral-primary text-right">{{ selectedOrder?.postal_code || 'N/A' }}</p>
        </div>
        <div class="flex items-center justify-between gap-4">
          <p class="body-small text-neutral-secondary">City</p>
          <p class="body-small text-neutral-primary text-right">{{ selectedOrder?.city || 'N/A' }}</p>
        </div>
        <div class="flex items-center justify-between gap-4">
          <p class="body-small text-neutral-secondary">Tracking ID</p>
          <div class="flex items-center gap-2">
            <span
              v-if="selectedOrder?.tracking_id"
              class="inline-flex items-center rounded-lg px-3 py-1 bg-neutral-muted body-small text-neutral-primary"
            >
              {{ selectedOrder.tracking_id }}
            </span>
            <span v-else class="body-small text-neutral-primary">n/a</span>

            <CommonButton
              v-if="selectedOrder?.tracking_id"
              aria-label="Copy tracking id"
              type="button"
              title=""
              bgColor="bg-neutral-muted hover:bg-neutral-line !h-8 !w-8 !px-0 rounded-lg"
              textColor="text-neutral-secondary"
              createIcon="copy"
              @click="copyTrackingId"
            />
          </div>
        </div>
        <div class="flex items-center justify-between gap-4">
          <p class="body-small text-neutral-secondary">Courier</p>
          <p class="body-small text-neutral-primary text-right">{{ selectedOrder?.courier || 'N/A' }}</p>
        </div>
        <div class="flex items-center justify-between gap-4">
          <p class="body-small text-neutral-secondary">Date</p>
          <p class="body-small text-neutral-primary text-right">
            {{ selectedOrder?.date || 'N/A' }}<span v-if="selectedOrder?.time"> · {{ selectedOrder?.time }}</span>
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Payment Status</p>
        <FormSelect
          v-model="orderForm.payment"
          name="payment_status"
          placeholder="Select"
          :options="paymentOptions"
          :showClear="true"
          :error="errors?.payment"
          @change="onValidate('payment')"
        />
      </div>

      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Order Status</p>
        <FormSelect
          v-model="orderForm.status"
          name="order_status"
          placeholder="Select"
          :options="statusOptions"
          :showClear="true"
          :error="errors?.status"
          @change="onValidate('status')"
        />
      </div>
    </div>

    <div class="pt-6 border-t border-neutral-line">
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
import { reactive, watch } from 'vue'
import FormSelect from '~/components/common/input/FormSelect.vue'

const props = defineProps({
  selectedOrder: { type: Object, default: null },
  orderForm: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  paymentOptions: { type: Array, default: () => [] },
  statusOptions: { type: Array, default: () => [] },
  validateField: { type: Function, default: null }
})

const emit = defineEmits(['cancel', 'save'])

const sections = reactive({
  orderDetails: false,
  items: true,
  delivery: true
})

watch(
  () => props.selectedOrder,
  () => {
    sections.orderDetails = false
    sections.items = true
    sections.delivery = true
  }
)

const onValidate = (field) => {
  if (!props.validateField) return
  props.validateField(field)
}

const normalize = (value) => String(value ?? '').toLowerCase().trim()

const platformIcon = (platform) => {
  const p = normalize(platform)
  if (p.includes('insta')) return 'instagram'
  return 'facebook'
}

const platformLabel = (platform) => {
  const p = normalize(platform)
  if (p.includes('insta')) return 'Instagram'
  return 'Facebook'
}

const platformPillClass = (platform) => {
  const p = normalize(platform)
  if (p.includes('insta')) return 'bg-danger-50 text-danger-300'
  return 'bg-info-50 text-info-300'
}

const orderStatusLabel = (status) => {
  const s = normalize(status)
  if (!s) return 'Pending'
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const orderStatusClass = (status) => {
  const s = normalize(status)
  if (s === 'shipped') return 'bg-info-50 text-info-300'
  if (s === 'delivered') return 'bg-success-50 text-success-300'
  if (s === 'returned') return 'bg-danger-50 text-danger-300'
  if (s === 'confirmed') return 'bg-primary-50 text-primary-300'
  return 'bg-warning-50 text-warning-300'
}

const paymentStatusLabel = (status) => {
  const s = normalize(status)
  if (!s) return 'Pending'
  if (s === 'paid') return 'Paid'
  if (s === 'refund') return 'Refund'
  return 'Pending'
}

const paymentStatusClass = (status) => {
  const s = normalize(status)
  if (s === 'paid') return 'bg-success-50 text-success-300'
  if (s === 'refund') return 'bg-danger-50 text-danger-300'
  return 'bg-warning-50 text-warning-300'
}

const formatCurrency = (value) => {
  const n = Number(value)
  if (Number.isNaN(n)) return '€0.00'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(n)
}

const chevronClass = (isOpen) => {
  return [
    'text-neutral-secondary transition-transform duration-200',
    isOpen ? 'rotate-0' : '-rotate-90'
  ].join(' ')
}

const copyTrackingId = async () => {
  const value = props.selectedOrder?.tracking_id
  if (!value) return

  try {
    await navigator.clipboard.writeText(String(value))
  } catch (e) {
    console.warn('Unable to copy tracking id', e)
  }
}
</script>