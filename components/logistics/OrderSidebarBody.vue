<template>
  <div class="flex flex-col gap-4 p-6">
    <div class="border border-neutral-line rounded-2xl p-5">
      <div class="flex items-center justify-between">
        <p class="body-small text-neutral-secondary tracking-wide">ORDER DETAILS</p>
        <BaseCustomIcon name="chevron-down" customClass="text-neutral-secondary rotate-180" />
      </div>

      <div class="mt-4 flex flex-col gap-3">
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
          <span class="inline-flex items-center rounded-full px-3 py-1 bg-warning-50 text-warning-300 body-xsmall">
            {{ selectedRow?.status || 'Pending' }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <p class="body-small text-neutral-secondary">Payment</p>
          <span class="inline-flex items-center rounded-full px-3 py-1 bg-warning-50 text-warning-300 body-xsmall">
            Pending
          </span>
        </div>
      </div>
    </div>

    <div class="border border-neutral-line rounded-2xl p-5">
      <div class="flex items-center justify-between">
        <p class="body-small text-neutral-secondary tracking-wide">ITEM(S)</p>
        <BaseCustomIcon name="chevron-down" customClass="text-neutral-secondary rotate-180" />
      </div>

      <div class="mt-4 flex flex-col gap-4">
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
      <div class="flex items-center justify-between">
        <p class="body-small text-neutral-secondary tracking-wide">DELIVERY DETAILS</p>
        <BaseCustomIcon name="chevron-down" customClass="text-neutral-secondary rotate-180" />
      </div>

      <div class="mt-4 flex flex-col gap-3">
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
defineProps({
  selectedRow: { type: Object, default: null }
})

const emit = defineEmits(['cancel', 'save'])
</script>
