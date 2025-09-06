<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-body">
        <div class="title_holder">
          <h3>连接钱包</h3>
          <p class="connect-text-1">请选择一个钱包以继续</p>
        </div>
        <div class="wallet-list">
          <ul>
            <li>
              <a href="#">
                <img src="/asset/images/wallet/okx-logo.png" alt="OKX Wallet" class="wallet-icon okx-icon">
                <span>OKX Wallet</span>
                <i class="icon icon-arrow-right"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <img src="/asset/images/wallet/MetaMask-icon-fox-with-margins.svg" alt="MetaMask" class="wallet-icon metamask-icon">
                <span>MetaMask</span>
                <i class="icon icon-arrow-right"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <img src="/asset/images/wallet/tp-logo.png" alt="TokenPocket" class="wallet-icon">
                <span>TokenPocket</span>
                <i class="icon icon-arrow-right"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <button @click="close" class="close-button">
        <i class="icon icon-close"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GetStartedModal',
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(12, 12, 14, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 350px;
  min-height: 400px;
  padding: 20px;
  border: 1px solid var(--line);
  backdrop-filter: blur(16px);
  border-radius: 28px;
  background: var(--bg-2);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.modal-body {
  width: 100%;
  height: 100%;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: var(--white);
  font-size: 24px;
  cursor: pointer;
}

.title_holder {
  text-align: center;
  margin-bottom: 20px;
}

.title_holder h3 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #ffffff;
}

.title_holder p {
  color: var(--text-2);
}

.connect-text-1 {
  margin-top: 40px;
}

.wallet-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.wallet-list li {
  margin-bottom: 15px;
}

.wallet-list a {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border: 1px solid var(--line);
  border-radius: 12px;
  text-decoration: none;
  color: var(--white);
  transition: all 0.3s ease-in-out;
  background: var(--bg-2);
}

.wallet-list a:hover {
  border-color: var(--primary);
  background-color: rgba(var(--primary-rgb), 0.1);
}

.wallet-icon {
  width: 32px;
  height: 32px;
  margin-right: 20px;
  border-radius: 8px;
}

.okx-icon {
  background-color: white;
}

.metamask-icon {
  background-color: white;
}

.wallet-list span {
  margin-left: auto;
  margin-right: 15px;
  font-size: 16px;
}

.wallet-list .icon-arrow-right {
  font-size: 20px;
  color: var(--text-2);
  transition: color 0.3s ease;
}

.wallet-list a:hover .icon-arrow-right {
  color: var(--primary);
}


/* Transitions */
.modal-enter-active {
  transition: opacity 0.3s ease;
}
.modal-enter-active .modal-content {
  transition: transform 0.4s 0.1s ease, opacity 0.4s 0.1s ease;
}

.modal-enter-from {
  opacity: 0;
}
.modal-enter-from .modal-content {
  transform: translateY(20px);
  opacity: 0;
}

.modal-leave-active {
  transition: opacity 0.3s 0.1s ease;
}
.modal-leave-active .modal-content {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.modal-leave-to {
  opacity: 0;
}
.modal-leave-to .modal-content {
  transform: translateY(20px);
  opacity: 0;
}
</style>
