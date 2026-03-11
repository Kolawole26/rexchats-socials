// composables/api.js

import { ref } from 'vue'
import { useUserDetailsStore } from '@/store/userDetailsStore'
import { storeToRefs, createPinia } from 'pinia'

const pinia = createPinia();
const userDetailsStore = useUserDetailsStore(pinia);
const { token } = storeToRefs(userDetailsStore);

export function useApiRequest() {
  const runtimeConfig = useRuntimeConfig()
  const baseURL = runtimeConfig.public.BASE_URL

  const sendRequest = async (params) => {
    const {
      method = 'GET',  // HTTP method, default to 'GET'
      endpoint,        // API endpoint
      data = null,     // Data for POST, PUT, PATCH requests
      queryParams = {},// Query parameters
      customOptions = {}, // Additional options (e.g., headers)
      id = null        // Optional ID to append to the URL
    } = params;

    const { handleError } = useErrorHandler()
    const queryString = new URLSearchParams(queryParams).toString()
    let url;
    if (endpoints[endpoint]) {
      url =
        baseURL + endpoints[endpoint] + (id ? `/${id}` : '') + (queryString ? `?${queryString}` : "");
    } else {
      url = baseURL + endpoint + (queryString ? `?${queryString}` : "");
    }

    const headers = {
        Authorization: token.value ? `Bearer ${token.value}` : '',
        'Content-Type': 'application/json',
        ...customOptions.headers
    }

    const requestOptions = {
      method,
      headers,
      ...customOptions,
    }
  // If it's not a GET request and data exists
  if (method !== 'GET' && data) {
    // Check if data is an instance of FormData
    if (data instanceof FormData) {
      // Let the browser automatically handle Content-Type for FormData
      delete requestOptions.headers['Content-Type'];
      requestOptions.body = data;
    } else {
      // If it's not FormData, handle it as JSON
      requestOptions.body = JSON.stringify(data);
    }
  }

    try {
      const response = await useFetch(url, requestOptions)

      if (response.error.value) {

        throw response.error.value.data
      }
      return response.data.value
    } catch (err) {
      await handleError(err)
      throw err
    }
  }

  return { sendRequest }
}

