<template>
  <div class="flex flex-col gap-6 p-6">
    <div class="flex flex-col gap-4">
      <div>
        <h4 class="text-neutral-primary">Account Information</h4>
      </div>

      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">First Name</p>
        <FormText
          v-model="vendorForm.firstName"
          inputId="vendor-first-name"
          name="first_name"
          placeholder="Enter first name"
          :error="errors?.firstName"
          @input="onValidate('firstName')"
        />
      </div>

      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Last Name</p>
        <FormText
          v-model="vendorForm.lastName"
          inputId="vendor-last-name"
          name="last_name"
          placeholder="Enter last name"
          :error="errors?.lastName"
          @input="onValidate('lastName')"
        />
      </div>

      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Business Name</p>
        <FormText
          v-model="vendorForm.businessName"
          inputId="vendor-business-name"
          name="business_name"
          placeholder="Enter business name"
          :error="errors?.businessName"
          @input="onValidate('businessName')"
        />
      </div>

      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Business Location</p>
        <FormSelect
          v-model="vendorForm.location"
          name="business_location"
          placeholder="Select"
          :options="locationOptions"
          :showClear="true"
          :error="errors?.location"
          @change="onValidate('location')"
        />
      </div>

      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Email Address</p>
        <FormText
          v-model="vendorForm.email"
          inputId="vendor-email"
          name="email"
          placeholder="example@mail.com"
          :error="errors?.email"
          @input="onValidate('email')"
        />
      </div>

      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Phone Number</p>
        <FormText
          v-model="vendorForm.phone"
          inputId="vendor-phone"
          name="phone"
          placeholder="00 000 000"
          :error="errors?.phone"
          @input="onValidate('phone')"
        />
      </div>
    </div>

    <div v-if="mode !== 'create'" class="flex flex-col gap-4">
      <div class="pt-2 border-t border-neutral-line">
        <h4 class="text-neutral-primary">Platform Access</h4>
      </div>

      <div class="flex flex-col gap-3">
        <div class="bg-neutral-muted border border-neutral-line rounded-2xl p-4 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <span
              class="w-10 h-10 rounded-xl bg-neutral-surface flex items-center justify-center text-info-300 shrink-0"
              aria-hidden="true"
            >
              <BaseCustomIcon name="facebook" customClass="w-5 h-5" />
            </span>
            <div class="min-w-0">
              <p class="label text-neutral-primary">Facebook</p>
              <p class="body-small text-neutral-secondary truncate">Give access to facebook AI Bot</p>
            </div>
          </div>

          <InputSwitch v-model="vendorForm.facebookAccess" />
        </div>

        <div class="bg-neutral-muted border border-neutral-line rounded-2xl p-4 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <span
              class="w-10 h-10 rounded-xl bg-neutral-surface flex items-center justify-center text-danger-300 shrink-0"
              aria-hidden="true"
            >
              <BaseCustomIcon name="instagram" customClass="w-5 h-5" />
            </span>
            <div class="min-w-0">
              <p class="label text-neutral-primary">Instagram</p>
              <p class="body-small text-neutral-secondary truncate">Give access to Instagram AI Bot</p>
            </div>
          </div>

          <InputSwitch v-model="vendorForm.instagramAccess" />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="pt-2 border-t border-neutral-line">
        <h4 class="text-neutral-primary">Other Information</h4>
      </div>

      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Detailed Description</p>
        <FormText
          v-model="vendorForm.description"
          inputId="vendor-description"
          name="description"
          type="textarea"
          placeholder="Enter"
          :error="errors?.description"
          @input="onValidate('description')"
        />
      </div>

      <div v-if="mode !== 'create'" class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Frequently Asked Questions (optional)</p>
        <FormText
          v-model="vendorForm.faq"
          inputId="vendor-faq"
          name="faq"
          type="textarea"
          placeholder="Enter"
          :error="errors?.faq"
          @input="onValidate('faq')"
        />
      </div>
    </div>

    <div v-if="mode !== 'create'" class="flex flex-col gap-4">
      <div class="pt-2 border-t border-neutral-line">
        <h4 class="text-neutral-primary">Management Control</h4>
      </div>

      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Vendor Account Status</p>
        <FormSelect
          v-model="vendorForm.status"
          name="vendor_status"
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
          :title="submitLabel"
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
import FormSelect from '~/components/common/input/FormSelect.vue'
import FormText from '~/components/common/input/FormText.vue'

const props = defineProps({
  mode: { type: String, default: 'create' },
  vendorForm: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  locationOptions: { type: Array, default: () => [] },
  statusOptions: { type: Array, default: () => [] },
  validateField: { type: Function, default: null },
  submitLabel: { type: String, default: 'Save' }
})

const emit = defineEmits(['cancel', 'save'])

const onValidate = (field) => {
  if (!props.validateField) return
  props.validateField(field)
}
</script>