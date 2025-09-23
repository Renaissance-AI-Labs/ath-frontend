<template>
  <transition name="toast-fade">
    <div v-if="notification.visible" class="toast-notification">
      {{ notification.message }}
    </div>
  </transition>
</template>

<script>
import { notificationState } from '../services/notification';

export default {
  name: 'ToastNotification',
  setup() {
    return {
      notification: notificationState,
    };
  }
};
</script>

<style scoped>
.toast-notification {
  position: fixed;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 999px; /* Pill shape */
  background: var(--primary);
  color: var(--white);
  font-size: 16px;
  font-weight: 500;
  z-index: 9999;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  white-space: nowrap;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
