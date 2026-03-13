---
name: api-integration
description: Standards for integrating with backend APIs using the central HTTP client and standardized request loops.
---

# API Integration Skill

This project utilizes a centralized API composable (`useApiRequest()`) and an endpoint map to handle all HTTP requests. Combining this closely with form submissions requires a clear execution flow utilizing standardized loading flags, error handling, and parameter sanitization.

## Rules & Best Practices
1. **Centralized Composables**: Always use `const { sendRequest } = useApiRequest()`. DO NOT use `fetch` or `axios` directly.
2. **Error Forwarding**: Catch request exceptions and parse them properly using `const { handleError } = useErrorHandler()`. Use `useToastHandler()` to surface these backend logic errors cleanly and avoid duplicates.
3. **Data Sanitization**: Before passing data to API endpoints, clean them up—e.g., using a `useQueryParams` or manual filtering to remove undefined / null keys if necessary.
4. **Structured Payloads**: Bundle your API specifications within a `Params` object containing `method`, `endpoint`, and `data`/`query`.
5. **UI Loading Lifecycles**: Always flip a reactive `isLoading` to true before sending the request, wait for the response, and then accurately revert the loader back to `false` inside a `finally` block to guarantee it runs whether there was an error or not.

## Optimized Implementation Example

```vue

<script setup>
import { ref, computed, watch, inject } from "vue";
import Joi from "joi";
// Nuxt handles auto-importing components like CommonInputFormText and CommonButton 

const { handleError } = useErrorHandler();
const { sendRequest } = useApiRequest();
const { showError } = useToastHandler();

const props = defineProps({
  buttonText: { type: String, default: "Proceed" },
  beneficiaries: { type: Array, required: false },
  service: { type: Object, required: true },
  repeat: { type: Object, required: false },
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


const onHandleFormSubmit = async () => {
  isLoading.value = true;

  try {
    const formData = {
      deal_id: props.deals ? props.deals._id : null,
      service_id: props.service._id,
      amount: Number(amount.value),
      phone: phoneNumber.value,
      network_id: networkProvider.value?.network_id,
      service_provider: networkProvider.value?.name,
    };
    
    // Sanitize with useQueryParams if available globally
    const cleanedFormData = typeof useQueryParams === 'function' ? useQueryParams(formData) : formData;

    const Params = {
      method: "POST",
      endpoint: "transactionOrder",
      data: cleanedFormData,
    };

    const data = await sendRequest(Params);
    emit("proceed", data.data);
  } catch (err) {
    const { error } = handleError(err);
    showError(error);
  } finally {
    isLoading.value = false;
  }
};

</script>
```
