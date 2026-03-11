// composables/error.js
import { ref } from 'vue'

export function useErrorHandler() {
  const error = ref(null)
  const statusCode = ref(null)

  const statusMessages = {
    400: 'Please check your input and try again.',
    409: 'Conflict error. Please try again later.',
    498: 'Invalid token. Please log in again.',
    423: 'Resource is locked. Please try again later.',
    429: 'Too many requests. Please try again later.',
    422: 'Unprocessable entity. Please check your input.',
    default: 'An unexpected error occurred. Please try again.',
  }

  function handleError(err) {
    // Extract status code from the error response
    const errorResponse = err
    const extractedStatusCode = errorResponse.status_code  || err.response?.status_code 
    
    // Set statusCode - keep it null if no valid status code found
    statusCode.value = extractedStatusCode || null
    
    // Set error message based on whether we have a valid status code
    if (statusCode.value === null || statusCode.value === undefined) {
      // No status code available (internet off, etc.) - use default message
      error.value = statusMessages.default;
    } else {
      // We have a status code - use the specific message or the original error message
      error.value = errorResponse.message;
    }
  
    // Optional: Redirect on specific errors
     if (statusCode.value == 401) {
      if (process.client) {
            const theme = localStorage.getItem('color-theme'); // Save theme
    localStorage.clear(); // Clear everything
    if (theme) {
      localStorage.setItem('color-theme', theme); // Restore theme
    }
        navigateTo("/login?toast=Session Expired");
      }
     }
     if (statusCode.value == 440) {
      if (process.client) {
            const theme = localStorage.getItem('color-theme'); // Save theme
    localStorage.clear(); // Clear everything
    if (theme) {
      localStorage.setItem('color-theme', theme); // Restore theme
    }
        navigateTo("/login?toast=Session Expired");
      }
     }


    return { error: error.value, statusCode: statusCode.value }
  }

  function clearError() {
    error.value = null
    statusCode.value = null
  }

  return { error, statusCode, handleError, clearError }
}
