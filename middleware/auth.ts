import { useUserDetailsStore } from "@/store/userDetailsStore";
import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware(() => {
  const { token, user } = storeToRefs(useUserDetailsStore());

    const localtoken = localStorage.getItem('token');
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
  
    user.value = localUser;
    token.value = localtoken;
 

    if (!(token.value && user.value )) return navigateTo('/login');
  });