<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <!-- Starry Background Effect -->
      <div class="stars-bg">
          <div class="stars"></div>
          <div class="stars2"></div>
          <div class="stars3"></div>
      </div>
      <div class="modal-body">
        <div class="title_holder">
          <h3>注入资产</h3>
        </div>

        <!-- Amount Input Group -->
        <div class="form-group">
          <label class="form-label">投资数量：</label>
          <div class="amount-input-group">
            <div class="input-wrapper">
              <input 
                type="text" 
                inputmode="decimal"
                :value="amount"
                @input="handleAmountInput"
                placeholder="输入数量" 
                class="form-input"
                :class="{ 'input-error': isAmountInvalid }"
              >
            </div>
            <div class="balance-info">
              <a href="#" @click.prevent="fillMax" class="btn-ip ip-modern text-body-3 balance-btn">
                最大: {{ userTokenBalance }}
              </a>
            </div>
          </div>
        </div>

        <!-- Duration Dropdown Group -->
        <div class="form-group">
          <label class="form-label">投资天数：</label>
          <CustomSelect :options="durationOptions" v-model="selectedDuration" />
        </div>

        <!-- Action Buttons -->
        <div class="button-group">
          <a href="#" @click.prevent="close" class="btn-ip ip-modern text-body-3 btn-cancel">
            取消
          </a>
          <a href="#" @click.prevent="handleConfirm" class="btn-ip ip-modern text-body-3 btn-confirm">
            确定
          </a>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import CustomSelect from './CustomSelect.vue';

export default {
  name: 'InjectPoolModal',
  components: {
    CustomSelect,
  },
  setup(props, { emit }) {
    const amount = ref('');
    const selectedDuration = ref(15);
    const userTokenBalance = ref(10000); // Placeholder for user's token balance

    const isAmountInvalid = computed(() => {
      // Use parseFloat for correct numeric comparison (handles integers and decimals)
      return parseFloat(amount.value) > userTokenBalance.value;
    });

    const durationOptions = [
      { value: 1, text: '1天，复利0.3%' },
      { value: 15, text: '15天，复利0.6%' },
      { value: 30, text: '30天，复利1.2%' },
    ];

    const close = () => {
      emit('close');
    };

    const handleAmountInput = (event) => {
      let value = event.target.value;
      // 1. Remove any character that is not a digit or a period.
      value = value.replace(/[^0-9.]/g, '');
      // 2. Ensure there's at most one period.
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }
      amount.value = value;
    };

    const fillMax = () => {
      amount.value = userTokenBalance.value;
    };

    const handleConfirm = () => {
      // Basic validation
      if (!amount.value || amount.value <= 0) {
        alert('请输入有效的数量');
        return;
      }
      if (amount.value > userTokenBalance.value) {
        alert('余额不足');
        return;
      }
      emit('confirm', { amount: amount.value, duration: selectedDuration.value });
      close();
    };

    return {
      amount,
      selectedDuration,
      userTokenBalance,
      durationOptions,
      isAmountInvalid,
      close,
      fillMax,
      handleConfirm,
      handleAmountInput,
    };
  }
};
</script>

<style scoped>
/* Reusing styles from ConnectWalletModal and adding new ones */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(12, 12, 14, 0.8);
  display: flex; justify-content: center; align-items: center; z-index: 1050;
}
.modal-content {
  position: relative; width: 90%; max-width: 380px; padding: 20px;
  border: 1px solid var(--line); backdrop-filter: blur(16px);
  border-radius: 28px; background: var(--bg-2);
}
.modal-body { width: 100%; }
.close-button {
  position: absolute; top: 20px; right: 20px; background: transparent;
  border: none; color: var(--white); font-size: 24px; cursor: pointer;
}
.title_holder { text-align: center; margin-bottom: 30px; }
.title_holder h3 { font-size: 24px; color: #ffffff; }

.form-group {
  margin: 20px 0 30px 0;
}
.form-label {
  display: block;
  text-align: left;
  color: var(--text-2);
  margin-bottom: 10px;
  font-size: 14px;
  padding-left: 5px; /* Align with balance button */
}
.input-wrapper {
  position: relative;
}
.form-input, .form-select {
  width: 100%;
  padding: 15px 20px;
  background-color: #0c0c0e;
  border: 1px solid var(--line);
  border-radius: 12px;
  color: var(--white);
  font-size: 16px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.form-input:focus, .form-select:focus {
  outline: none;
  border-color: var(--primary);
}
.form-select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23888' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}

.balance-info {
  margin-top: 8px;
  text-align: left;
}
.balance-btn {
  background: none;
  border: none;
  color: var(--text-2);
  cursor: pointer;
  padding: 5px;
  font-size: 14px;
  text-decoration: underline;
}
.balance-btn:hover {
  color: var(--primary);
}

.amount-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.amount-input-group .input-wrapper {
  flex-grow: 1;
}
.amount-input-group .balance-info {
  flex-shrink: 0;
}
.balance-btn {
  padding: 8px 12px; /* Adjust padding to fit the text */
  white-space: nowrap; /* Prevent text from wrapping */
  font-size: 12px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 30px;
}
.btn-ip {
    flex: 1; /* Make buttons take equal width */
    text-align: center;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    background: linear-gradient(0deg, rgba(20, 20, 21, 0.82), rgba(20, 20, 21, 0.82)),
        linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%);
    border: 1px solid var(--line);
    box-shadow: 0px 1px 1px 0px #FFFFFF2E inset, 0px 0px 4px 0px #FFFFFF0F inset, 0px 0px 8px 0px #FFFFFF14 inset, 0px 0px 16px 0px #FFFFFF1F inset;
    padding: 12px;
    border-radius: 999px;
    transition: all .3s ease;
    color: var(--text-2);
    text-decoration: none;
}
.btn-ip:hover {
    color: var(--primary);
    border-color: var(--primary);
}
.btn-confirm {
    color: var(--white);
    background: var(--primary);
    border-color: var(--primary);
}
.btn-confirm:hover {
    color: var(--white);
    filter: brightness(1.1);
}

/* Starry background effect from HowToUseSection */
.stars-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  border-radius: 28px; /* Match modal content's border-radius */
  overflow: hidden; /* Ensure stars don't leak outside rounded corners */
}
.modal-body {
    position: relative;
    z-index: 1; /* Ensure modal content is on top of the background */
}

.stars, .stars2, .stars3 {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  background: transparent;
}
.stars {
  animation: animStar 50s linear infinite;
  box-shadow: 123px 45px #FFF, 255px 189px #FFF, 345px 8px #FFF, 99px 345px #FFF, 487px 233px #FFF, 321px 487px #FFF, 499px 10px #FFF, 23px 187px #FFF, 176px 455px #FFF, 433px 321px #FFF, 45px 23px #FFF, 231px 480px #FFF, 467px 98px #FFF, 33px 256px #FFF, 198px 321px #FFF, 349px 465px #FFF, 480px 12px #FFF, 12px 190px #FFF, 256px 432px #FFF, 490px 211px #FFF, 54px 49px #FFF, 289px 344px #FFF, 411px 189px #FFF, 76px 287px #FFF, 201px 477px #FFF, 389px 23px #FFF, 477px 376px #FFF, 156px 143px #FFF, 301px 499px #FFF, 432px 65px #FFF;
}
.stars2 {
  width: 2px;
  height: 2px;
  animation: animStar 100s linear infinite;
  box-shadow: 234px 123px #FFF, 456px 345px #FFF, 12px 487px #FFF, 498px 65px #FFF, 213px 289px #FFF, 45px 456px #FFF, 345px 98px #FFF, 187px 399px #FFF, 432px 187px #FFF, 88px 88px #FFF, 287px 465px #FFF, 478px 243px #FFF, 143px 32px #FFF, 365px 398px #FFF, 499px 488px #FFF;
}
.stars3 {
  width: 3px;
  height: 3px;
  animation: animStar 150s linear infinite;
  box-shadow: 87px 345px #FFF, 465px 87px #FFF, 234px 487px #FFF, 487px 234px #FFF, 156px 156px #FFF, 387px 432px #FFF, 432px 32px #FFF;
}
.stars:after, .stars2:after, .stars3:after {
  content: " ";
  position: absolute;
  top: 250px;
  width: inherit;
  height: inherit;
  background: transparent;
  box-shadow: inherit;
}
@keyframes animStar {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-250px);
  }
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
.form-input.input-error {
  color: #b60e0e; /* A clear red color for error state */
}
</style>
