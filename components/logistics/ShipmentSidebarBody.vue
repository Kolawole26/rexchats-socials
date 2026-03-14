<template>
  <div class="flex flex-col gap-6 p-6">
    <div v-if="mode === 'create'" class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Tracking Number</p>
        <FormText
          v-model="shipmentForm.trackingNumber"
          inputId="tracking-number"
          name="tracking_number"
          placeholder="Enter a tracking number"
          :error="errors?.trackingNumber"
          @input="onValidate('trackingNumber')"
        />
      </div>

      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Delivery Price (Optional)</p>
        <FormText
          v-model="shipmentForm.deliveryPrice"
          inputId="delivery-price"
          name="delivery_price"
          type="number"
          placeholder="€0.00"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <p class="label text-neutral-primary">Courier</p>
          <FormSelect
            v-model="shipmentForm.courier"
            name="shipment_courier"
            placeholder="Select"
            :options="courierOptions"
            :showClear="true"
            :error="errors?.courier"
            @change="onValidate('courier')"
          />
        </div>

        <div class="flex flex-col gap-2">
          <p class="label text-neutral-primary">Shipping Status</p>
          <FormSelect
            v-model="shipmentForm.status"
            name="shipping_status"
            placeholder="Confirmed"
            :options="shippingStatusOptions"
            :showClear="true"
            :error="errors?.status"
            @change="onValidate('status')"
          />
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col gap-2">
      <p class="label text-neutral-primary">Shipping Status</p>
      <FormSelect
        v-model="shipmentForm.status"
        name="shipping_status"
        placeholder="Confirmed"
        :options="shippingStatusOptions"
        :showClear="true"
        :error="errors?.status"
        @change="onValidate('status')"
      />
    </div>

    <div class="flex flex-col gap-4">
      <div class="border border-neutral-line rounded-2xl p-5">
        <CommonButton
          type="button"
          bgColor="bg-transparent !px-0"
          textColor="text-neutral-primary button w-full"
          @click="sections.orderDetails = !sections.orderDetails"
          fullWidth
        >
          <div class="w-full flex items-center justify-between">
            <p class="body-small text-neutral-secondary tracking-wide">ORDER DETAILS</p>
            <BaseCustomIcon
              name="chevron-down"
              customClass="text-neutral-secondary"
              :class="sections.orderDetails ? 'rotate-180' : ''"
            />
          </div>
        </CommonButton>

        <div v-if="sections.orderDetails" class="mt-4 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <p class="body-small text-neutral-secondary">Phone Number</p>
            <p class="body-small text-neutral-primary">{{ selectedRow?.customer_phone || 'N/A' }}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="body-small text-neutral-secondary">Platform</p>
            <div class="flex items-center gap-2">
              <span
                class="w-5 h-5 rounded-full bg-info-50 text-info-300 flex items-center justify-center"
                aria-hidden="true"
              >
                <BaseCustomIcon name="facebook" customClass="w-3.5 h-3.5" />
              </span>
              <p class="body-small text-neutral-primary">Facebook</p>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <p class="body-small text-neutral-secondary">Order ID</p>
            <p class="body-small text-neutral-primary">{{ selectedRow?.order_id || 'N/A' }}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="body-small text-neutral-secondary">Date</p>
            <p class="body-small text-neutral-primary">
              {{ selectedRow?.date || 'N/A' }} · {{ selectedRow?.time || '' }}
            </p>
          </div>
          <div class="flex items-center justify-between">
            <p class="body-small text-neutral-secondary">Order Status</p>
            <span
              class="inline-flex items-center rounded-full px-3 py-1 bg-warning-50 text-warning-300 body-xsmall"
            >
              {{ selectedRow?.status || 'Pending' }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <p class="body-small text-neutral-secondary">Payment</p>
            <span
              class="inline-flex items-center rounded-full px-3 py-1 bg-warning-50 text-warning-300 body-xsmall"
            >
              Pending
            </span>
          </div>
        </div>
      </div>

      <div class="border border-neutral-line rounded-2xl p-5">
        <CommonButton
          type="button"
          bgColor="bg-transparent !px-0"
          textColor="text-neutral-primary button w-full"
          @click="sections.items = !sections.items"
          fullWidth
        >
          <div class="w-full flex items-center justify-between">
            <p class="body-small text-neutral-secondary tracking-wide">ITEM(S)</p>
            <BaseCustomIcon
              name="chevron-down"
              customClass="text-neutral-secondary"
              :class="sections.items ? 'rotate-180' : ''"
            />
          </div>
        </CommonButton>

        <div v-if="sections.items" class="mt-4 flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <p class="body-small text-neutral-primary">1x Xhaketa Dimërore (M / Black)</p>
            <p class="body-small text-neutral-primary">€500.00</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="body-small text-neutral-primary">1x Xhaketa Dimërore (M / Purple)</p>
            <p class="body-small text-neutral-primary">€200.00</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="body-small text-neutral-primary">1x Xhaketa Dimërore (M / Purple)</p>
            <p class="body-small text-neutral-primary">€250.00</p>
          </div>

          <div class="border-t border-neutral-line pt-4 flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <p class="body-small text-neutral-secondary">Item Total</p>
              <p class="body-small text-neutral-primary">€950.00</p>
            </div>
            <div class="flex items-center justify-between">
              <p class="body-small text-neutral-secondary">Delivery</p>
              <p class="body-small text-neutral-primary">€50.00</p>
            </div>
            <div class="flex items-center justify-between">
              <p class="body-small text-neutral-secondary">Total Amount</p>
              <h4 class="text-neutral-primary">€1,000.00</h4>
            </div>
          </div>
        </div>
      </div>

      <div class="border border-neutral-line rounded-2xl p-5">
        <CommonButton
          type="button"
          bgColor="bg-transparent !px-0"
          textColor="text-neutral-primary button w-full"
          @click="sections.deliveryDetails = !sections.deliveryDetails"
          fullWidth
        >
          <div class="w-full flex items-center justify-between">
            <p class="body-small text-neutral-secondary tracking-wide">DELIVERY DETAILS</p>
            <BaseCustomIcon
              name="chevron-down"
              customClass="text-neutral-secondary"
              :class="sections.deliveryDetails ? 'rotate-180' : ''"
            />
          </div>
        </CommonButton>

        <div v-if="sections.deliveryDetails" class="mt-4 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <p class="body-small text-neutral-secondary">Address</p>
            <p class="body-small text-neutral-primary">Rruga B, Hyrja 12, Banesa 45</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="body-small text-neutral-secondary">Postal Code</p>
            <p class="body-small text-neutral-primary">10000</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="body-small text-neutral-secondary">City</p>
            <p class="body-small text-neutral-primary">{{ selectedRow?.city || 'N/A' }}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="body-small text-neutral-secondary">Tracking ID</p>
            <p class="body-small text-neutral-primary">{{ selectedRow?.tracking_id || 'N/A' }}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="body-small text-neutral-secondary">Courier</p>
            <p class="body-small text-neutral-primary">{{ selectedRow?.courier || 'N/A' }}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="body-small text-neutral-secondary">Date</p>
            <p class="body-small text-neutral-primary">
              {{ selectedRow?.date || 'N/A' }} · {{ selectedRow?.time || '' }}
            </p>
          </div>
        </div>
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
import { reactive } from 'vue'
import FormSelect from '~/components/common/input/FormSelect.vue'
import FormText from '~/components/common/input/FormText.vue'

const props = defineProps({
  mode: { type: String, default: 'create' },
  shipmentForm: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  courierOptions: { type: Array, default: () => [] },
  shippingStatusOptions: { type: Array, default: () => [] },
  selectedRow: { type: Object, default: null },
  validateField: { type: Function, default: null }
})

const emit = defineEmits(['cancel', 'save'])

const sections = reactive({
  orderDetails: true,
  items: true,
  deliveryDetails: true
})

const onValidate = (field) => {
  if (!props.validateField) return
  props.validateField(field)
}
</script>
