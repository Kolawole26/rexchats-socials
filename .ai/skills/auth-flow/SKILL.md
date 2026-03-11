---
name: auth-flow
description: Standardized handling of authentication data, JWT tokens, and user state upon login.
---

# Authentication Flow Skill

This project utilizes a Pinia store (`useUserDetailsStore`) combined with `storeToRefs` to globally maintain authentication tokens and user profiles upon successful login.

## Rules & Best Practices
1. **API Integration Phase Only**: The logic to extract tokens and store user information belongs strictly to the backend integration phase. When building out pure UI components (the "UI Phase"), rely strictly on raw Form logic and fake success navigation—do not mock or inject dummy Pinia stores.
2. **Never use Local Storage manually**: Do not write tokens directly to `localStorage` or cookies manually within components. Rely entirely on the integrated Pinia store (`user`, `token`, and `auth` refs).
3. **Centralized Store Extraction**: Use `storeToRefs(useUserDetailsStore())` to destruct the global reactive tokens so Vue can react properly to sign-ins and logouts.
4. **MFA Routing**: If a user requires Multi-Factor Authentication (`mfa_required` is true), temporarily cache their credentials in `sessionStorage` and navigate them to the `/verify-login` page without passing credentials directly in the URL query strings.
5. **Successful Login Action**: When an API returns a successful token, assign the token and user data to the Pinia refs directly. Display a success Toast, execute `navigateTo('/', { replace: true })`, and subsequently `window.location.reload()` if a hard reset of application composables is necessary.

## Implementation Flow Example

```javascript
// inside a Login Component Setup
import { useUserDetailsStore } from "@/store/userDetailsStore";
import { storeToRefs } from "pinia";
const userDetailsStore = useUserDetailsStore();
const { user, token, auth } = storeToRefs(userDetailsStore);

const { sendRequest } = useApiRequest();
const { handleError, clearError } = useErrorHandler();
const { showSuccess, showError } = useToastHandler();

const loginUser = async (credentials) => {
  clearError();

  try {
    const Params = {
      method: "POST",
      endpoint: "loginUser",
      data: credentials,
    };

    const response = await sendRequest(Params);

    // 2. Standard Login Success
    token.value = response.data.token;
    user.value = response.data.user;
    auth.value = response.data.auth;

    showSuccess(response.message);
    
    // 3. Navigation
    await navigateTo("/", { replace: true });
    
    // Force a fresh mount of Nuxt plugins if necessary
    setTimeout(() => {
      window.location.reload();
    }, 1000);

  } catch (err) {
    const { error } = handleError(err);
    showError(error);
  }
};
```
