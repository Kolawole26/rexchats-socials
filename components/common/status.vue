<template>
  <div class=" body-small">
    <button
      class=" text-success-300 dark:text-success-75 bg-success-50 dark:bg-success-500 py-[1px] rounded-[100px] pl-[4px] pr-2 flex items-center gap-[4px] capitalize"
      v-if="
        status === 'Completed' || status === 'Active' || status === 'Paid' || status === 'Sent' || status === 'Resolved'
      "
    >
    <!-- <div class="w-[5px] h-[5px] rounded-full bg-success-100 dark:bg-success-75"></div> -->
      <div>
        <BaseCustomIcon name="check_circle" />
      </div>
      {{ status }}
    </button>

    <button
      class=" text-warning-300 dark:text-warning-75 bg-warning-50 dark:bg-warning-500 py-[1px] rounded-[100px] pl-[4px] pr-2 flex items-center gap-[4px] capitalize"
      v-else-if="
        status === 'Unverified' || status === 'Archived' || status === 'In Progress' || status === 'Pending'
      "
    >
    <!-- <div class="w-[5px] h-[5px] rounded-full bg-warning-100 dark:bg-warning-75"></div> -->
    <div>
        <BaseCustomIcon name="not_disturb" />
      </div>
      {{ status }}
    </button>
    <button
      class=" text-danger-300 dark:text-danger-75 dark:bg-danger-500 bg-[#FDEEEE] py-[1px] rounded-[100px] pl-[4px] pr-2 flex items-center gap-[4px] capitalize"
      v-else-if="status === 'Cancelled' || status === 'Suspended' || status === 'Rejected' || status === 'Failed' || status === 'Ended' || status === 'Deleted'"
    >
    <!-- <div class="w-[5px] h-[5px] rounded-full bg-danger-100 dark:bg-danger-75"></div> -->
    <div>
      <BaseCustomIcon name="suspend" />
      </div>
      {{ status }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  status: {
    type: String,
  },
});
</script>
