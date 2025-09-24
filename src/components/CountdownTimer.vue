<template>
  <span class="desc clock">剩余：{{ displayTime }}</span>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  computed
} from 'vue';

const props = defineProps({
  targetTimestamp: {
    type: Number,
    required: true,
  },
});

const now = ref(Date.now());
let interval = null;

const timeRemaining = computed(() => {
  const remaining = props.targetTimestamp - now.value;
  return remaining > 0 ? remaining : 0;
});

const isExpired = computed(() => timeRemaining.value <= 0);

const days = computed(() => Math.floor(timeRemaining.value / (1000 * 60 * 60 * 24)));
const hours = computed(() => Math.floor((timeRemaining.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
const minutes = computed(() => Math.floor((timeRemaining.value % (1000 * 60 * 60)) / (1000 * 60)));
const seconds = computed(() => Math.floor((timeRemaining.value % (1000 * 60)) / 1000));

const displayTime = computed(() => {
  if (isExpired.value) {
    return '已到期';
  }
  return `${days.value}天${hours.value}时${minutes.value}分${seconds.value}秒`;
});

const updateNow = () => {
  now.value = Date.now();
};

onMounted(() => {
  interval = setInterval(updateNow, 1000);
});

onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
  }
});
</script>

<style scoped>
/* The component will inherit styles from its parent, so no specific styles are needed here. */
/* The .desc.clock classes are applied on the parent element in HowToUseSection.vue */
.clock {
  /* This ensures the component doesn't introduce its own styling, respecting the parent's styles. */
  all: unset;
}
</style>
