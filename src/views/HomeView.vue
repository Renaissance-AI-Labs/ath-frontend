<template>
  <div>
    <span class="br-line"></span>
    <HeroSection @open-inject-modal="openInjectModal" @open-claim-reward-modal="openClaimRewardModal" @open-share-friend-modal="openShareFriendModal" />
    <!-- <FeatureSection /> -->
    <HowToUseSection />
    <!-- <BenefitSection /> -->
    <!-- <PricingSection /> -->
     <CTASection />
    <TestimonialSection />
    <!-- <FAQSection /> -->
    

    <transition name="modal">
      <InjectPoolModal 
        v-if="isInjectModalVisible" 
        @close="closeInjectModal"
        @confirm="handleInjectionConfirm"
      />
    </transition>

    <transition name="modal">
      <ConfirmReferrerModal
        v-if="isConfirmReferrerModalVisible"
        @close="closeConfirmReferrerModal"
        @confirm="handleReferrerConfirm"
      />
    </transition>

    <transition name="modal">
        <ClaimRewardModal v-if="isClaimRewardModalVisible" @close="closeClaimRewardModal" />
    </transition>
    
    <transition name="modal">
      <ShareFriendModal 
        v-if="isShareFriendModalVisible" 
        :referral-link="referralLinkForModal"
        :referrer-address="referrerAddressForModal"
        @close="closeShareFriendModal"
      />
    </transition>

    <!-- Sidebar Trigger Button -->
    <div class="btn-sidebar-mb d-lg-none right">
        <button @click="openSidebar" style="background-color: #111111;">
            <img src="/asset/images/section/platform.svg" alt="Menu" width="50" height="50">
        </button>
    </div>

    <!-- Right Sidebar -->
    <HomeRightSidebar 
      :is-open="isSidebarOpen" 
      @close="closeSidebar" 
    />
  </div>
</template>

<script>
import HeroSection from '../components/HeroSection.vue';
// import FeatureSection from '../components/FeatureSection.vue';
import BenefitSection from '../components/BenefitSection.vue';
import HowToUseSection from '../components/HowToUseSection.vue';
import FeatureSection from '../components/FeatureSection.vue';
import TestimonialSection from '../components/TestimonialSection.vue';
import PricingSection from '../components/PricingSection.vue';
import FAQSection from '../components/FAQSection.vue';
import CTASection from '../components/CTASection.vue';
import InjectPoolModal from '../components/InjectPoolModal.vue';
import ConfirmReferrerModal from '../components/ConfirmReferrerModal.vue';
import ClaimRewardModal from '../components/ClaimRewardModal.vue'; // <-- Import the new modal
import ShareFriendModal from '../components/ShareFriendModal.vue';
import HomeRightSidebar from '../components/HomeRightSidebar.vue';

import {
  walletState
} from '../services/wallet';
import {
  stakeWithInviter,
  getReferrer,
  isReferrerValid,
  getMaxStakeAmount,
  getUsdtBalance,
  checkAllClaimableRewards
} from '../services/contracts';
import {
  showToast
} from '../services/notification';
import {
    onMounted,
    watch
} from 'vue';
import { t } from '@/i18n';


export default {
  name: 'HomeView',
  components: {
    HeroSection,
    // FeatureSection,
    BenefitSection,
    HowToUseSection,
    // PricingSection,
    TestimonialSection,
    FAQSection,
    InjectPoolModal,
    ConfirmReferrerModal,
    CTASection,
    ClaimRewardModal,
    ShareFriendModal,
    HomeRightSidebar,
  },
  data() {
    return {
      isSidebarOpen: false,
      isInjectModalVisible: false,
      isConfirmReferrerModalVisible: false,
      isClaimRewardModalVisible: false, // <-- Add state for the new modal
      isShareFriendModalVisible: false,
      referralLinkForModal: '',
      referrerAddressForModal: '',
      injectionData: null, // To store data from the first modal
      isStaking: false, // To lock UI during transaction
      walletState: walletState,
    };
  },
  methods: {
    openSidebar() {
        this.isSidebarOpen = true;
    },
    closeSidebar() {
        this.isSidebarOpen = false;
    },
    openInjectModal() {
      this.isInjectModalVisible = true;
    },
    closeInjectModal() {
      this.isInjectModalVisible = false;
    },
    openShareFriendModal(data) {
      this.referralLinkForModal = data.referralLink;
      this.referrerAddressForModal = data.referrerAddress || '';
      this.isShareFriendModalVisible = true;
    },
    closeShareFriendModal() {
      this.isShareFriendModalVisible = false;
    },
    openClaimRewardModal() {
      this.isClaimRewardModalVisible = true;
    },
    closeClaimRewardModal() {
      this.isClaimRewardModalVisible = false;
      // When the modal is closed, re-check for rewards to update the red dot
      checkAllClaimableRewards();
    },
    async handleInjectionConfirm(data) {
      console.log('Injection data received:', data);
      this.injectionData = data;
      this.isInjectModalVisible = false;

      // Decide the next step based on user status
      if (this.walletState.isNewUser) {
        this.isConfirmReferrerModalVisible = true;
      } else {
        // Old user flow: directly proceed to stake
        await this.executeStakeForOldUser();
      }
    },
    closeConfirmReferrerModal() {
      this.isConfirmReferrerModalVisible = false;
    },
    async handleReferrerConfirm(pendingReferrer) {
      console.log('Referrer confirmed by user:', pendingReferrer);
      this.isConfirmReferrerModalVisible = false;
      // New user flow: proceed to stake with validation
      await this.executeStakeForNewUser(pendingReferrer);
    },

    // --- Staking Execution Logic ---

    async executeStakeForNewUser(parentAddress) {
      if (this.isStaking) return;
      this.isStaking = true;
      console.log(`[指挥官] 开始为新用户执行质押流程...`);
      showToast(t("toast.stakingRequest"));

      // Final real-time balance check
      const realTimeBalance = await getUsdtBalance();
      const amountToStake = this.injectionData.amount;
      if (parseFloat(realTimeBalance) < parseFloat(amountToStake)) {
        showToast(t('toast.insufficientBalance', { balance: parseFloat(realTimeBalance).toFixed(4) }));
        this.isStaking = false;
        return;
      }

      // Final on-chain validation for the parent address
      console.log(`[指挥官] 对新用户的推荐人地址进行最终链上校验: ${parentAddress}`);
      const isParentValid = await isReferrerValid(parentAddress);
      if (!isParentValid) {
        console.error(`[指挥官] 推荐人地址校验失败: ${parentAddress}`);
        showToast(t("toast.invalidReferrer"));
        this.isStaking = false;
        return;
      }
      console.log(`[指挥官] 推荐人地址校验成功`);

      const { amount, duration } = this.injectionData;

      // Diagnostic log for max stake amount
      const maxAmount = await getMaxStakeAmount();
      console.log(`[指挥官] 诊断信息: 当前允许的最大质押额: ${maxAmount} USDT, 用户尝试质押: ${amount} USDT`);

      console.log(`[指挥官] 即将调用 stakeWithInviter, 参数为:`, { amount, stakeIndex: duration, parentAddress });
      const success = await stakeWithInviter(amount, duration, parentAddress);

      if (success) {
        console.log("[指挥官] 质押交易成功");
        showToast(t("toast.stakeSuccessRefresh"));
        setTimeout(() => window.location.reload(), 2000);
      } else {
        console.error("[指挥官] 质押交易失败");
        showToast(t("toast.stakeFailedRetry"));
      }
      this.isStaking = false;
    },

    async executeStakeForOldUser() {
      if (this.isStaking) return;
      this.isStaking = true;
      console.log("[指挥官] 开始为老用户执行质押流程...");
      // showToast("正在获取推荐人信息并质押...");

      // Final real-time balance check
      const realTimeBalance = await getUsdtBalance();
      const amountToStake = this.injectionData.amount;
      if (parseFloat(realTimeBalance) < parseFloat(amountToStake)) {
        showToast(t('toast.insufficientBalance', { balance: parseFloat(realTimeBalance).toFixed(4) }));
        this.isStaking = false;
        return;
      }

      console.log("[指挥官] 开始从合约获取已绑定的推荐人地址...");
      const parentAddress = await getReferrer();
      if (!parentAddress || parentAddress.startsWith('0x000')) {
        console.error("[指挥官] 获取老用户的推荐人地址失败");
        showToast(t("toast.fetchReferrerFailed"));
        this.isStaking = false;
        return;
      }
      console.log(`[指挥官] 成功获取到老用户的推荐人地址: ${parentAddress}`);
      
      const { amount, duration } = this.injectionData;

      // Diagnostic log for max stake amount
      const maxAmount = await getMaxStakeAmount();
      console.log(`[指挥官] 诊断信息: 当前允许的最大质押额: ${maxAmount} USDT, 用户尝试质押: ${amount} USDT`);

      console.log(`[指挥官] 即将调用 stakeWithInviter, 参数为:`, { amount, stakeIndex: duration, parentAddress });
      const success = await stakeWithInviter(amount, duration, parentAddress);
      
      if (success) {
        console.log("[指挥官] 质押交易成功");
        showToast(t("toast.stakeSuccessRefresh"));
        setTimeout(() => window.location.reload(), 2000);
      } else {
        console.error("[指挥官] 质押交易失败");
        showToast(t("toast.stakeFailedRetry"));
      }
      this.isStaking = false;
    }
  },
  mounted() {
    // autoConnectWallet(); // This line is removed as per the new_code, as autoConnectWallet is no longer imported.
  },
  setup() {
    // Watch for authentication changes to update the red dot indicator
    watch(() => [walletState.isAuthenticated, walletState.contractsInitialized], ([isAuth, contractsReady]) => {
      if (isAuth && contractsReady) {
        checkAllClaimableRewards();
      }
    });

    // This is needed for the template to access walletState
    return {
      walletState,
      t, // Expose t function to the template
    };
  }
};
</script>

<style scoped>
/* Scoped styles can be empty if using global classes */
</style>
