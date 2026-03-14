<template>
  <div class="w-full">
    <div class="flex items-center mb-10">
      <BaseCustomIcon name="logo" customClass="w-[144px] h-8 text-primary-300" />
    </div>

    <div class="mb-10">
      <h3 class="text-neutral-primary">Welcome <span aria-hidden="true">👋</span></h3>
      <p class="body-small text-neutral-secondary mt-2">Please enter your details to continue</p>
    </div>

    <form @submit.prevent="onSubmit" class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Email Address</p>
        <FormText
          v-model="email"
          inputId="login-email"
          name="email"
          placeholder="example@mail.com"
          :error="errors.email"
          @input="validateField('email')"
        />
      </div>

      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Password</p>
        <FormText
          v-model="password"
          inputId="login-password"
          name="password"
          type="password"
          placeholder="Enter your password"
          :error="errors.password"
          @input="validateField('password')"
        />
      </div>

      <div class="flex justify-end -mt-2">
        <NuxtLink
          to="/auth/forgot-password"
          class="body-small font-semibold text-primary-500 hover:underline"
        >
          Forgot Password?
        </NuxtLink>
      </div>

      <CommonButton
        title="Log In"
        type="submit"
        bgColor="bg-primary-300 hover:bg-primary-400 !h-12 rounded-xl"
        textColor="text-neutral-inverted button"
        :loading="isLoading"
        fullWidth
      />
    </form>
  </div>
</template>

<script setup>
import Joi from 'joi'
import { ref } from 'vue'
import FormText from '~/components/common/input/FormText.vue'

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errors = ref({})

const validationSchema = {
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email address is required',
      'string.email': 'Enter a valid email address',
      'any.required': 'Email address is required'
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required'
    })
}

const validateField = (field) => {
  const value = { email: email.value, password: password.value }[field]
  const { error } = validationSchema[field].validate(value)

  if (error) {
    errors.value[field] = error.details[0].message
    return
  }

  delete errors.value[field]
}

const onSubmit = async () => {
  validateField('email')
  validateField('password')

  if (errors.value.email || errors.value.password) return

  isLoading.value = true

  // UI-phase behavior: validate locally then navigate.
  // Backend integration should wire into the auth-flow store + API composables.
  await new Promise((r) => setTimeout(r, 600))
  await navigateTo('/', { replace: true })
}
</script>
