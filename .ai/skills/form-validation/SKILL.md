---
name: form-validation
description: Standardized approach to real-time form validation using Joi in Nuxt 3.
---

# Form Validation Skill

This project uses **Joi** for form validation on the frontend, combined with standard Vue `ref` properties for reactive state. The standard approach involves real-time per-field validation without rendering raw error spans in the templates.

## Rules & Best Practices
1. **Always use Joi** for defining schemas. Do not use custom if/else logic for standard string/number checks.
2. **Per-Field Validation**: Trigger validation explicitly when a user inputs data by binding an `@input` or `@change` event to a `validateField` function.
3. **Pass Errors as Props**: Do **NOT** render error messages using `<span>` elements outside the component. Pass the error directly to the `FormText` or `FormSelect` inputs using the `:error` prop.
4. **Schema Map**: Map individual field names to specific Joi rules in a `validationSchema` object.
5. **Computed Form Validity**: Optionally block form submissions entirely by verifying validity using a `computed` property verifying all fields and checking for an empty `errors.value` map.

## Optimized Implementation Example

```vue
<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-6">
    <CommonInputFormSelect
      v-model="beneficiary"
      label="Beneficiaries"
      :options="beneficiaries"
      placeholder="Select"
      required
      name="beneficiary"
      :error="errors.beneficiary"
    />

    <CommonInputFormText
      v-model="amount"
      label="Amount"
      type="number"
      placeholder="How much ?"
      required
      :disabled="deals?.meta?.amount ? true : false"
      :error="errors.amount"
      @input="validateField('amount')"
    />

    <CommonInputFormText
      v-model="phoneNumber"
      label="Phone Number"
      type="number"
      placeholder="Enter phone number"
      required
      :error="errors.phoneNumber"
      @input="validateField('phoneNumber')"
    />
    
    <CommonInputFormText
      v-model="password"
      label="Password"
      type="password"
      placeholder="Enter password"
      required
      :error="errors.password"
      @input="validateField('password')"
    />

    <CommonInputFormSelect
      v-model="networkProvider"
      label="Network Provider"
      :options="networkOptions"
      placeholder="Select"
      required
      name="network_provider"
      :disabled="deals?.meta?.service_provider ? true : false"
      :error="errors.networkProvider"
      @change="validateField('networkProvider')"
    />

    <!-- Modal Footer -->
    <div class="flex items-center gap-4 pt-4 border-t border-neutral-100 mt-2">
      <div class="w-full">
        <CommonButton
          title="Cancel"
          bgColor="bg-neutral-30"
          textColor="text-neutral-500 font-semibold text-sm"
          type="button"
          @click="emit('close')"
          fullWidth
        />
      </div>

      <div class="w-full">
        <CommonButton
          :title="buttonText"
          bgColor="bg-primary-300"
          textColor="text-neutral-500 dark:text-neutral-10 font-semibold text-sm"
          type="submit"
          :loading="isLoading"
          fullWidth
        />
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch, inject } from "vue";
import Joi from "joi";

const props = defineProps({
  buttonText: { type: String, default: "Proceed" },
  beneficiaries: { type: Array, required: false },
  deals: { type: Object, required: false },
});

const emit = defineEmits(["close", "proceed"]);

const networkOptions = inject("networks", []);
const isLoading = ref(false);
const errors = ref({});

const beneficiary = ref();
const amount = ref();
const phoneNumber = ref("");
const networkProvider = ref();
const password = ref();


const validationSchema = {
  amount: Joi.number()
    .min(props.deals ? 1 : 100)
    .required()
    .messages({
      "any.required": "Amount is required",
      "number.base": "Amount must be a number",
      "number.min": `Amount must be at least ${props.deals ? 1 : 100}`,
    }),
  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required.",
      "string.pattern.base": "Phone number must be between 10 and 15 digits.",
    }),
  networkProvider: Joi.object().required().messages({
    "any.required": "Network Provider is required.",
    "object.base": "Network Provider must be a valid object.",
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .required()
    .messages({
      "any.required": "Password is required",
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number",
    }),
};

const isFormValid = computed(() => {
  return (
    amount.value &&
    phoneNumber.value &&
    networkProvider.value &&
    password.value &&
    !errors.value.amount &&
    !errors.value.phoneNumber &&
    !errors.value.networkProvider &&
    !errors.value.password
  );
});

const validateField = (field) => {
  const value = {
    amount: amount.value,
    phoneNumber: phoneNumber.value,
    networkProvider: networkProvider.value,
    password: password.value,
  }[field];

  const { error } = validationSchema[field].validate(value);

  if (error) {
    errors.value[field] = error.details[0].message;
  } else {
    delete errors.value[field];
  }
};

const onSubmit = async () => {
  Object.keys(validationSchema).forEach((field) => validateField(field));
  
  if (isFormValid.value) {
    isLoading.value = true;
    
    // Process purely form completion logic without integration details here
    setTimeout(() => {
      isLoading.value = false;
      console.log('Validation successful, emitting payload.');
      emit('proceed');
    }, 1000);
  }
};

</script>
```
