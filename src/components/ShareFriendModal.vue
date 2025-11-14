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
          <h3>{{ t('share.title') }}</h3>
        </div>
        
        <div class="share-content" style="margin-top: 30px;">
          <div class="input-wrapper">
            <label class="share-link-label">{{ t('share.linkLabel') }}</label>
            <textarea :value="referralLink" readonly class="share-link-input" @focus="$event.target.select()"></textarea>
          </div>
          <p class="share-hint">{{ t('share.hint') }}</p>
          <a href="#" @click.prevent="copyLink" class="btn-ip ip-modern text-body-3 copy-btn">
            {{ t('share.button') }}
          </a>
          <div class="divider" v-if="teamId"></div>
          <div class="team-id-section" v-if="teamId">
            <label class="team-id-label">{{ t('share.teamId') }}</label>
            <p class="team-id-value">{{ teamId }}</p>
          </div>
          
          <!-- <div class="divider"></div> -->

          <!-- New Referral Info Section -->
          <div class="team-id-section">
            <div class="referral-label-container">
              <span class="referral-label-text">{{ t('share.myReferralsLabel') }}</span>
              <span class="referral-label-count">{{ formattedReferralCount }}</span>
            </div>
            
            <!-- Loading State -->
            <div v-if="isLoadingReferrals" class="loading-message">
              <p>{{ t('share.loadingReferrals') }}</p>
            </div>
            
            <!-- Data/Empty States -->
            <div v-else>
              <div v-if="referralCount > 0">
                <div class="referral-switcher">
                  <a href="#" @click.prevent="showPrevious" style="margin-top: 28px;" class="pagination-item" :class="{ 'disabled': currentIndex === 0 }">
                    <span class="icon icon-CaretDoubleRight" style="transform: rotate(180deg);"></span>
                  </a>
                  <div class="switcher-content">
                    <div>
                      <p class="switcher-address">{{ currentReferralAddress }}</p>
                      <div class="info-container">
                        <div class="info-row asset-row">
                          <span class="info-label">{{ t('share.assetsLabel') }}</span>
                          <span class="info-value">{{ formattedBalance }}</span>
                        </div>
                        <div class="info-row kpi-row">
                          <span class="info-label">{{ t('share.kpiLabel') }}</span>
                          <span class="info-value">{{ formattedKpi }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <a href="#" @click.prevent="showNext" style="margin-top: 28px;" class="pagination-item" :class="{ 'disabled': currentIndex >= referralCount - 1 }">
                    <span class="icon icon-CaretDoubleRight"></span>
                  </a>
                </div>
                <p class="referral-counter">{{ currentIndex + 1 }} / {{ referralCount }}</p>
              </div>
              
              <div v-else class="no-referrals-message">
                <p>{{ t('share.noReferrals') }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
      <button @click="close" class="close-button">
        <i class="icon icon-close"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, computed, ref, watch } from 'vue';
import { showToast } from '@/services/notification';
import { t } from '@/i18n';
import { getReferralsFromSubgraph } from '@/services/subgraph';
import { walletState } from '@/services/wallet';
import { getTeamKpiByAddress, getUserStakedBalanceByAddress } from '@/services/contracts';

export default {
  name: 'ShareFriendModal',
  props: {
    referralLink: {
      type: String,
      required: true,
    },
    referrerAddress: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const referralCount = ref(0);
    const referrals = ref([]);
    const currentIndex = ref(0);
    const currentReferralKpiRaw = ref(null);
    const currentReferralBalanceRaw = ref(null);
    const isLoadingReferrals = ref(true);

    const close = () => {
      emit('close');
    };

    const copyLink = () => {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = props.referralLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast(t('toast.copySuccess'));
      } catch (err) {
        console.error('无法复制链接: ', err);
        showToast(t('toast.copyFailed'));
      }
    };

    const teamId = computed(() => {
      if (!props.referrerAddress || props.referrerAddress.length < 10) {
        return '';
      }
      // Format: 0x + first 4 chars + ... + last 4 chars
      const prefix = props.referrerAddress.slice(0, 6); // 0x + first 4 chars
      const suffix = props.referrerAddress.slice(-4); // last 4 chars
      return `${prefix}...${suffix}`;
    });

    const formattedKpi = computed(() => {
      if (currentReferralKpiRaw.value === null) return '--';
      return parseFloat(currentReferralKpiRaw.value).toFixed(2);
    });

    const formattedBalance = computed(() => {
      if (currentReferralBalanceRaw.value === null) return '--';
      return parseFloat(currentReferralBalanceRaw.value).toFixed(2);
    });

    const formattedReferralCount = computed(() => {
      const unit = t('share.referralsUnit');
      return unit ? `${referralCount.value} ${unit}` : referralCount.value;
    });

    const currentReferralAddress = computed(() => {
      if (referrals.value.length === 0) {
        return '';
      }
      const address = referrals.value[currentIndex.value];
      const prefix = address.slice(0, 6);
      const suffix = address.slice(-4);
      return `${prefix}...${suffix}`;
    });

    const showNext = () => {
      if (currentIndex.value < referralCount.value - 1) {
        currentIndex.value++;
      }
    };

    const showPrevious = () => {
      if (currentIndex.value > 0) {
        currentIndex.value--;
      }
    };
    
    const fetchReferralData = async () => {
      isLoadingReferrals.value = true;
      const userAddress = walletState.address;
      if (!userAddress) {
        console.error("User address not found");
        isLoadingReferrals.value = false;
        return;
      }
      const data = await getReferralsFromSubgraph(userAddress);
      referralCount.value = data.referralCount;
      referrals.value = data.referrals;
      isLoadingReferrals.value = false;
    };

    const fetchDataForCurrentReferral = async () => {
      if (referrals.value.length === 0) return;
      
      try {
        const address = referrals.value[currentIndex.value];
        
        // Fetch KPI and Balance in parallel
        const [kpi, balance] = await Promise.all([
          getTeamKpiByAddress(address),
          getUserStakedBalanceByAddress(address)
        ]);

        currentReferralKpiRaw.value = kpi;
        currentReferralBalanceRaw.value = balance;

      } catch (error) {
        console.error("Failed to fetch referral data:", error);
        currentReferralKpiRaw.value = null;
        currentReferralBalanceRaw.value = null;
      }
    };

    watch(currentIndex, fetchDataForCurrentReferral);

    onMounted(async () => {
      document.body.style.overflow = 'hidden';
      await fetchReferralData();
      if (referralCount.value > 0) {
        await fetchDataForCurrentReferral();
      }
    });

    onUnmounted(() => {
      document.body.style.overflow = '';
    });

    return {
      close,
      copyLink,
      teamId,
      t,
      referralCount,
      currentIndex,
      currentReferralAddress,
      formattedKpi,
      formattedBalance,
      isLoadingReferrals,
      showNext,
      showPrevious,
      formattedReferralCount,
    };
  },
};
</script>

<style scoped>
/* Reusing styles from ConnectWalletModal for consistency */
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
  height: 100vh; /* Use viewport height to ensure full screen coverage */
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 350px;
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
  z-index: 2;
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

.share-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 15%,
    rgba(255, 255, 255, 0.3) 85%,
    transparent 100%
  );
  margin: 30px 0 30px 0;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.1);
}

.team-id-section {
  width: 100%;
  text-align: left;
  margin-bottom: 20px; /* Add margin to separate from the new section */
}

/* New styles for the split label */
.referral-label-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 8px; /* Same margin as the old label had */
}

.referral-label-text,
.referral-label-count {
  color: var(--white);
  font-size: 14px;
  font-weight: 500;
}

.referral-label-count {
  font-family: 'monospace', 'BlinkMacSystemFont', sans-serif;
}


/* Remove the old wrapper class */
.referral-switcher, .no-referrals-message, .loading-message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 10px 15px; /* Match team-id-value for consistency */
  min-height: 80px; /* Ensure a consistent height */
}

.no-referrals-message, .loading-message {
  justify-content: center;
  color: var(--text-2);
  font-size: 14px;
  min-height: 110px; /* Match the height of switcher + counter */
}
.no-referrals-message p, .loading-message p {
  margin: 0;
}

/* Styles from HowToUseSection for pagination buttons */
.pagination-item {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;
    line-height: 36px;
    border-radius: 50%;
    border: 1px solid var(--line);
    background: transparent;
    color: var(--text-2);
    font-weight: 600;
    transition: all .3s ease;
    text-decoration: none;
}

.pagination-item:hover {
    color: var(--primary);
    border-color: var(--primary);
}

.pagination-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}


.switcher-arrow {
  background: transparent;
  border: none;
  color: var(--white);
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.switcher-arrow:disabled {
  color: var(--text-2);
  cursor: not-allowed;
}

.switcher-content {
  text-align: left;
  flex-grow: 1;
  padding: 0 10px;
}

.switcher-address, .switcher-kpi, .switcher-assets, .info-label, .info-value {
  color: var(--white);
  font-size: 14px;
  font-family: 'monospace', 'BlinkMacSystemFont', sans-serif;
}

.switcher-address {
  text-align: center;
  margin-bottom: 8px;
}

.info-container {
  width: 100%;
  padding: 0 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-row + .info-row {
  margin-top: 0px;
}

.asset-row .info-label,
.asset-row .info-value {
  font-weight: bold;
}

.switcher-loading {
  font-size: 14px;
  color: var(--text-2);
}

.referral-counter {
  margin-top: 15px;
  font-size: 12px;
  color: var(--text-2);
  width: 100%;
  text-align: center;
}

.team-id-label {
  display: block;
  color: var(--white);
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
}

.team-id-value {
  display: block;
  color: var(--white);
  font-size: 14px;
  font-family: 'monospace', 'BlinkMacSystemFont', sans-serif;
  margin: 0;
  padding: 10px 15px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--line);
  border-radius: 8px;
  letter-spacing: 1px;
  text-align: center;
}

.share-hint {
  color: var(--text-2);
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
}

.input-wrapper {
  width: 100%;
  margin-bottom: 20px;
}

.share-link-label {
  display: block;
  color: var(--white);
  font-size: 14px;
  margin-bottom: 8px;
  text-align: left;
  font-weight: 500;
}

.share-link-input {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--line);
  color: var(--white);
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  overflow-x: auto;
  resize: none;
  word-break: break-all;
}

.share-link-input:focus {
  outline: none;
  border-color: var(--primary);
}

.copy-btn {
  width: 100%;
  text-align: center;
  padding: 12px;
}

/* Reusing button style from ConnectWalletModal */
.btn-ip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: linear-gradient(0deg, rgba(20, 20, 21, 0.82), rgba(20, 20, 21, 0.82)),
        linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%);
    border: 1px solid var(--line);
    box-shadow: 0px 1px 1px 0px #FFFFFF2E inset, 0px 0px 4px 0px #FFFFFF0F inset, 0px 0px 8px 0px #FFFFFF14 inset, 0px 0px 16px 0px #FFFFFF1F inset;
    padding: 7px 12px;
    border-radius: 999px;
    transition: all .3s ease;
    color: var(--text-2);
    text-decoration: none;
}
.btn-ip:hover {
    color: var(--primary);
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
.modal-body {
    position: relative;
    z-index: 1;
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
