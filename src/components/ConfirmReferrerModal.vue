<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="stars-bg">
        <div class="stars"></div>
        <div class="stars2"></div>
        <div class="stars3"></div>
      </div>
      <div class="modal-body-custom">
        <div class="title_holder">
          <h3>{{ t('referrer.title') }}</h3>
        </div>
        
        <div class="form-group">
          <label class="form-label">{{ t('referrer.addressLabel') }}</label>
          <div class="address-box">
            <span v-if="isLoading">{{ t('referrer.loading') }}</span>
            <span v-else>{{ formattedReferrerAddress }}</span>
          </div>
        </div>

        <div class="button-group">
          <button class="btn-ip btn-cancel" style="font-size: 14px !important;" @click="$emit('close')">{{ t('referrer.cancel') }}</button>
          <button class="btn-ip btn-confirm" style="font-size: 14px !important;" @click="handleConfirm" :disabled="isLoading || !pendingReferrer">{{ t('referrer.confirm') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getRootReferrer
} from '../services/contracts';
import {
  formatAddress
} from '../services/wallet';
import { t } from '@/i18n';

export default {
  name: 'ConfirmReferrerModal',
  props: {
    // referrerAddress prop is no longer needed as the component will fetch it.
  },
  emits: ['close', 'confirm'],
  setup() {
    return {
      t,
    };
  },
  data() {
    return {
      pendingReferrer: null,
      isLoading: true,
    };
  },
  computed: {
    formattedReferrerAddress() {
      if (!this.pendingReferrer) {
        return 'N/A';
      }
      return formatAddress(this.pendingReferrer);
    }
  },
  methods: {
    async fetchReferrer() {
      this.isLoading = true;
      // 1. Check URL for ?ref= parameter first
      const urlParams = new URLSearchParams(window.location.search);
      const refFromUrl = urlParams.get('ref');

      if (refFromUrl && refFromUrl.startsWith('0x') && refFromUrl.length === 42) {
        console.log(`[确认推荐人弹窗] 成功从URL中解析到推荐人地址: ${refFromUrl}`);
        this.pendingReferrer = refFromUrl;
      } else {
        // 2. If no valid ref in URL, get the root referrer from the contract
        console.log("[确认推荐人弹窗] URL中无推荐人, 开始从合约获取根推荐人...");
        this.pendingReferrer = await getRootReferrer();
        console.log(`[确认推荐人弹窗] 成功从合约获取到根推荐人地址: ${this.pendingReferrer}`);
      }
      this.isLoading = false;
    },
    handleConfirm() {
      // Pass the determined referrer address back to the parent
      if (this.pendingReferrer) {
        console.log(`[确认推荐人弹窗] 用户已确认推荐人地址: ${this.pendingReferrer}, 进入最终质押流程`);
        this.$emit('confirm', this.pendingReferrer);
      }
    }
  },
  mounted() {
    this.fetchReferrer();
  }
};
</script>

<style scoped>
/* Styles copied from InjectPoolModal.vue for 100% consistency */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(12, 12, 14, 0.8);
  display: flex; justify-content: center; align-items: center; z-index: 1050;
}
.modal-content {
  position: relative; width: 90%; max-width: 380px; padding: 20px;
  border: 1px solid var(--line); backdrop-filter: blur(16px);
  border-radius: 28px; background: var(--bg-2);
  overflow: hidden; /* Added to contain stars */
}
.modal-body-custom { 
  width: 100%; 
  position: relative;
  z-index: 1;
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
  padding-left: 5px;
}

/* This is the referrer address display, styled like an input */
.address-box {
  width: 100%;
  padding: 15px 20px;
  background-color: #0c0c0e;
  border: 1px solid var(--line);
  border-radius: 12px;
  color: var(--white);
  font-size: 14px; /* Slightly smaller for address */
  font-family: 'Courier New', Courier, monospace;
  text-align: center;
  word-wrap: break-word;
  box-sizing: border-box; /* Ensures padding is included in width */
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 30px;
}
.btn-ip {
    flex: 1;
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
    cursor: pointer;
    font-size: 16px;
}
.btn-ip:hover {
    color: var(--primary);
    border-color: var(--primary);
}
.btn-cancel {
  /* Inherits base .btn-ip style */
  color: var(--text-2);
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

/* Starry background effect */
.stars-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  border-radius: 28px;
  overflow: hidden;
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
</style>
