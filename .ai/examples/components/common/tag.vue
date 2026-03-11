<template>
  <div>
    <Tag :value="info" :style="getTagStyle(info)" rounded />
  </div>
</template>

<script setup>
import Tag from "primevue/tag";

const props = defineProps({
  info: {
    type: String,
  },
  back_g: {
    type: Boolean,
    default: true,
  },
  border: {
    type: Boolean,
    default: false,
  },
});

// Example function to determine tag style based on feature
const getTagStyle = (feature) => {
  switch (feature) {
    case "Estimate Request":
    case "Yes":
    case "Vendor Management":
    case "Content Moderation":
      return {
        backgroundColor: props.back_g ? "#F7EEFC" : "transparent",
        color: "#AF52DE",
        borderColor: "#F7EEFC",
      };
    case "Product Enquiry":
    case "Subscription":
    case "PROVIDER":
    case "Team Management":
      return {
        backgroundColor: props.back_g ? "#EBF8FD" : "transparent",
        color: "#0B84BA",
        borderColor: "#EBF8FD",
      };
      case "INSTALLATIONS":
      return {
        backgroundColor: props.back_g ? "#E9F8EE" : "transparent",
        color: "#1A9346",
        borderColor: "#E9F8EE",
      };
      case "FINANCING":
      return {
        backgroundColor: props.back_g ? "#FFF9E6" : "transparent",
        color: "#CC9A01",
        borderColor: "#FFF9E6",
      };
      case "SERVICES & REPAIRS":
      return {
        backgroundColor: props.back_g ? "#FDE7E7" : "transparent",
        color: "#BF0E0E",
        borderColor: "#FDE7E7",
      };
    case "Buyer Management":
      return {
        backgroundColor: props.back_g ? "#FEEDF1" : "transparent",
        color: "#F54B73",
        borderColor: "#FEEDF1",
      };
    case "Redeemed":
    case "No":
      return {
        backgroundColor: props.back_g ? "#FDE7E7" : "transparent",
        color: "#A70D0D",
        borderColor: "#F89E9E",
      };
    case "Updated Profile":
    case "Services":
      return {
        backgroundColor: props.back_g ? "#E7F6FD" : "transparent",
        color: "#0A73A3",
        borderColor: "#9CDAF6",
      };
    case "User Management":
    case "User":
      return {
        backgroundColor: props.back_g ? "#FCF4EE" : "transparent",
        color: "#E59055",
        borderColor: "#FCF4EE",
      };
    case "User Broadcasts":
    case "Post":
      return {
        backgroundColor: props.back_g ? "#FFF0F0" : "transparent",
        color: "#FF6D6C",
        borderColor: "#FFF0F0",
      };
    case "Comment":
      return {
        backgroundColor: props.back_g ? "#F7F3FE" : "transparent",
        color: "#AA84F6",
        borderColor: "#F7F3FE",
      };
    default:
      return {
        backgroundColor: props.back_g ? "#FCFCFD" : "transparent",
        color: "#3A3A3A",
        borderColor: "#D9D9DB",
      };
  }
};
</script>
