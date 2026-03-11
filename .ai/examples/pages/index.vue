<template>
    <div>

    </div>
  </template>
  
<script setup>
import { useUserDetailsStore } from "@/store/userDetailsStore";
import { storeToRefs } from "pinia";


const userDetailsStore = useUserDetailsStore()
// destructure store values (so each ref value is used individually)
const { user } = storeToRefs(userDetailsStore);


onMounted(() => {
  console.log(">>>>>>", user.value);
});


</script>
