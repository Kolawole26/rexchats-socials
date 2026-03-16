<template>
  <section class="flex flex-col gap-6">
    <section class="bg-neutral-surface border border-neutral-line rounded-2xl overflow-hidden">
      <div class="grid grid-cols-1 md:grid-cols-[1fr_360px]">
        <div class="p-6 flex items-center gap-4">
          <div
            class="w-14 h-14 rounded-2xl bg-primary-300 text-neutral-inverted flex items-center justify-center font-semibold"
            aria-hidden="true"
          >
            {{ initials }}
          </div>

          <div class="min-w-0">
            <p class="body-regular text-neutral-primary font-semibold truncate">{{ profile.fullName }}</p>
            <p class="body-small text-neutral-secondary truncate">{{ profile.email }}</p>
          </div>

          <div class="ml-auto">
            <span
              v-if="isAdmin"
              class="inline-flex items-center rounded-full px-3 py-1 body-xsmall bg-primary-50 text-primary-300"
            >
              Admin
            </span>
            <CommonStatus v-else :status="profile.status" />
          </div>
        </div>

        <div
          class="hidden md:block bg-cover bg-no-repeat bg-right"
          :style="{ backgroundImage: `url(${profileBg})` }"
          aria-hidden="true"
        />
      </div>
    </section>

    <section class="bg-neutral-surface border border-neutral-line rounded-2xl p-6">
      <div class="mb-6">
        <h3 class="text-neutral-primary">Your Account Information</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-neutral-line">
        <div class="flex flex-col gap-2">
          <p class="body-small text-neutral-secondary">Full Name</p>
          <p class="body-regular text-neutral-primary">{{ profile.fullName }}</p>
        </div>

        <div v-if="isVendor" class="flex flex-col gap-2">
          <p class="body-small text-neutral-secondary">Business Name</p>
          <p class="body-regular text-neutral-primary">{{ profile.businessName }}</p>
        </div>

        <div class="flex flex-col gap-2">
          <p class="body-small text-neutral-secondary">Email Address</p>
          <p class="body-regular text-neutral-primary">{{ profile.email }}</p>
        </div>

        <template v-if="isVendor">
          <div class="flex flex-col gap-2">
            <p class="body-small text-neutral-secondary">Phone Number</p>
            <p class="body-regular text-neutral-primary">{{ profile.phone }}</p>
          </div>

          <div class="flex flex-col gap-2">
            <p class="body-small text-neutral-secondary">Business Location</p>
            <p class="body-regular text-neutral-primary">{{ profile.location }}</p>
          </div>

          <div class="flex flex-col gap-2">
            <p class="body-small text-neutral-secondary">Account Status</p>
            <div class="w-fit"><CommonStatus :status="profile.status" /></div>
          </div>
        </template>

        <div v-if="isAdmin" class="flex flex-col gap-2">
          <p class="body-small text-neutral-secondary">Role</p>
          <span class="inline-flex items-center rounded-full px-3 py-1 body-xsmall bg-primary-50 text-primary-300 w-fit">Admin</span>
        </div>
      </div>

      <div v-if="isVendor" class="pt-6 border-b border-neutral-line pb-6 mb-6">
        <div class="flex items-center gap-2 mb-2">
          <p class="body-small text-neutral-secondary">Description</p>
          <CommonButton
            aria-label="Edit description"
            type="button"
            title=""
            bgColor="bg-transparent hover:bg-neutral-muted !h-8 !w-8 !px-0 rounded-lg"
            textColor="text-primary-400"
            createIcon="pen"
            @click="openDescriptionSidebar"
          />
        </div>

        <p class="body-regular text-neutral-primary whitespace-pre-line max-w-[696px]">{{ profile.description }}</p>
      </div>

      <div class="mb-4">
        <h3 class="text-neutral-primary">Settings</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button type="button" class="flex items-start justify-between gap-4 py-4 border-b border-neutral-line w-full text-left" @click="openPasswordSidebar">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <p class="body-small text-neutral-secondary">Password</p>
              <span class="text-primary-400"><BaseCustomIcon name="pen" customClass="" /></span>
            </div>
            <p class="body-regular text-neutral-primary">Change Your Password</p>
          </div>
        </button>

        <button
          v-if="isVendor"
          type="button"
          class="flex items-start justify-between gap-4 py-4 border-b border-neutral-line w-full text-left"
          @click="deleteAccountModal = true"
        >
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <p class="body-small text-neutral-secondary">Account Control</p>
              <span class="text-danger-300"><BaseCustomIcon name="trash" customClass="" /></span>
            </div>
            <p class="body-regular text-neutral-primary">Delete Your Account</p>
          </div>
        </button>
      </div>
    </section>


    <Sidebar
      v-model:visible="descriptionSidebarOpen"
      position="right"
      :style="{ maxWidth: '400px', width: '100%' }"
      modal
      class="custom-modal-drawer rounded-tl-lg rounded-bl-lg"
      :showCloseIcon="false"
      :show-header="false"
    >
      <div class="w-full flex items-start justify-between gap-3 p-6">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-xl bg-neutral-background border border-neutral-line flex items-center justify-center text-neutral-primary">
            <BaseCustomIcon name="users" customClass="" />
          </div>
          <div class="flex flex-col">
            <h4 class="text-neutral-primary">Description</h4>
            <p class="body-small text-neutral-secondary">This is used to setup your profile</p>
          </div>
        </div>

        <CommonButton
          aria-label="Close"
          type="button"
          title=""
          bgColor="bg-transparent hover:bg-neutral-muted !h-10 !w-10 !px-0"
          textColor="text-neutral-secondary"
          createIcon="cancel-red"
          @click="closeDescriptionSidebar"
        />
      </div>
      <ProfileDescriptionSidebarBody
        :form="descriptionForm"
        :errors="descriptionErrors"
        :validateField="validateDescriptionField"
        @cancel="closeDescriptionSidebar"
        @save="saveDescription"
      />
    </Sidebar>

    <Sidebar
      v-model:visible="passwordSidebarOpen"
      position="right"
      :style="{ maxWidth: '400px', width: '100%' }"
      modal
      class="custom-modal-drawer rounded-tl-lg rounded-bl-lg"
      :showCloseIcon="false"
      :show-header="false"
    >
      <div class="w-full flex items-start justify-between gap-3 p-6">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-xl bg-neutral-background border border-neutral-line flex items-center justify-center text-neutral-primary">
            <BaseCustomIcon name="settings" customClass="" />
          </div>
          <div class="flex flex-col">
            <h4 class="text-neutral-primary">Change password</h4>
            <p class="body-small text-neutral-secondary">Reset your account password</p>
          </div>
        </div>

        <CommonButton
          aria-label="Close"
          type="button"
          title=""
          bgColor="bg-transparent hover:bg-neutral-muted !h-10 !w-10 !px-0"
          textColor="text-neutral-secondary"
          createIcon="cancel-red"
          @click="closePasswordSidebar"
        />
      </div>
      <ProfileChangePasswordSidebarBody
        :form="changePasswordForm"
        :errors="changePasswordErrors"
        :validateField="validateChangePasswordField"
        @cancel="closePasswordSidebar"
        @save="savePassword"
      />
    </Sidebar>

    <ModalConfirmation
      :isOpen="deleteAccountModal"
      title="Delete Account"
      confirmationMessage="Are you sure you want to delete your account?"
      informationText="This action cannot be undone."
      actionButtonText="Delete"
      actionButtonClass="bg-danger-300 hover:bg-danger-400"
      :requireReason="false"
      btnIcon=""
      @close="deleteAccountModal = false"
      @confirm="confirmDeleteAccount"
    />
  </section>
</template>

<script setup>
import Joi from 'joi'
import { computed, reactive, ref, watch } from 'vue'
import { useUserDetailsStore } from '~/store/userDetailsStore'
import profileBg from '~/assets/images/profile-bg.png'

definePageMeta({
  layout: 'default',
  customProp: 'Profile Information'
})

const userStore = useUserDetailsStore()

const rawUser = computed(() => userStore?.user?.value ?? userStore?.user ?? {})

const role = computed(() => {
  const u = rawUser.value || {}
  const rawRole =
    u?.role ??
    u?.user_role ??
    u?.userRole ??
    u?.type ??
    u?.accountType ??
    u?.account_type ??
    ''

  return String(rawRole || '').toLowerCase()
})

const isAdmin = computed(() => role.value.includes('admin'))
const isVendor = computed(() => role.value.includes('vendor') || !isAdmin.value)

const profile = reactive({
  fullName: 'Jane Doe',
  email: 'janedoe@mail.com',
  businessName: 'Janes SuperStore',
  phone: '+383 12 345 678',
  location: 'Albania',
  status: 'active',
  description:
    'We are an online fashion store selling casual clothing for men and women including hoodies, t-shirts, sweatshirts, and accessories.\nCustomers can browse products, ask about sizes, colors, and prices directly through Instagram or Facebook messages. Orders are placed through chat and delivered within 2-5 business days depending on the location.'
})

watch(
  () => rawUser.value,
  (u) => {
    const name = u?.name || u?.full_name || profile.fullName
    const email = u?.email || profile.email

    profile.fullName = String(name || profile.fullName)
    profile.email = String(email || profile.email)

    if (isVendor.value) {
      profile.businessName = String(u?.business_name || u?.businessName || profile.businessName)
      profile.phone = String(u?.phone || u?.phone_number || u?.phoneNumber || profile.phone)
      profile.location = String(u?.location || u?.business_location || u?.businessLocation || profile.location)
      profile.status = String(u?.status || profile.status)
      profile.description = String(u?.description || profile.description)
    }
  },
  { immediate: true }
)

const initials = computed(() => {
  const source = profile.fullName || 'JD'
  const parts = String(source).trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase()).join('') || 'JD'
})

const descriptionSidebarOpen = ref(false)
const passwordSidebarOpen = ref(false)
const deleteAccountModal = ref(false)

const descriptionForm = reactive({
  description: ''
})

const descriptionErrors = ref({})
const descriptionValidationSchema = {
  description: Joi.string().trim().min(10).max(500).required().messages({
    'string.empty': 'Description is required',
    'any.required': 'Description is required',
    'string.min': 'Description must be at least 10 characters',
    'string.max': 'Description must be at most 500 characters'
  })
}

const validateDescriptionField = (field) => {
  const rule = descriptionValidationSchema[field]
  if (!rule) return

  const result = rule.validate(descriptionForm[field])
  if (result.error) {
    descriptionErrors.value[field] = result.error.details[0].message
    return
  }

  delete descriptionErrors.value[field]
}

const validateDescriptionForm = () => {
  const keys = Object.keys(descriptionValidationSchema)
  keys.forEach((field) => validateDescriptionField(field))
  return keys.every((field) => !descriptionErrors.value[field])
}

const openDescriptionSidebar = () => {
  descriptionErrors.value = {}
  descriptionForm.description = profile.description || ''
  descriptionSidebarOpen.value = true
}

const closeDescriptionSidebar = () => {
  descriptionSidebarOpen.value = false
}

const saveDescription = () => {
  if (!validateDescriptionForm()) return
  profile.description = String(descriptionForm.description || '').trim()
  closeDescriptionSidebar()
}

const changePasswordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const changePasswordErrors = ref({})

const validateChangePasswordField = (field) => {
  const schema = {
    oldPassword: Joi.string().required().messages({
      'string.empty': 'Old password is required',
      'any.required': 'Old password is required'
    }),
    newPassword: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$/)
      .required()
      .messages({
        'string.empty': 'New password is required',
        'any.required': 'New password is required',
        'string.min': 'New password must be at least 8 characters',
        'string.pattern.base': 'New password must include an uppercase letter, a lowercase letter, and a number'
      }),
    confirmPassword: Joi.any()
      .valid(changePasswordForm.newPassword)
      .required()
      .messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Confirm password is required'
      })
  }

  const rule = schema[field]
  if (!rule) return

  const valueMap = {
    oldPassword: changePasswordForm.oldPassword,
    newPassword: changePasswordForm.newPassword,
    confirmPassword: changePasswordForm.confirmPassword
  }

  const result = rule.validate(valueMap[field])
  if (result.error) {
    changePasswordErrors.value[field] = result.error.details[0].message
    return
  }

  delete changePasswordErrors.value[field]
}

const validateChangePasswordForm = () => {
  const fields = ['oldPassword', 'newPassword', 'confirmPassword']
  fields.forEach((f) => validateChangePasswordField(f))
  return fields.every((f) => !changePasswordErrors.value[f])
}

watch(
  () => changePasswordForm.newPassword,
  () => {
    if (!changePasswordForm.confirmPassword) return
    validateChangePasswordField('confirmPassword')
  }
)

const openPasswordSidebar = () => {
  changePasswordErrors.value = {}
  changePasswordForm.oldPassword = ''
  changePasswordForm.newPassword = ''
  changePasswordForm.confirmPassword = ''
  passwordSidebarOpen.value = true
}

const closePasswordSidebar = () => {
  passwordSidebarOpen.value = false
}

const savePassword = () => {
  if (!validateChangePasswordForm()) return
  closePasswordSidebar()
}

const confirmDeleteAccount = () => {
  deleteAccountModal.value = false
}
</script>

