<template>
  <div>
    <span class="br-line"></span>
    <HeroSection @open-inject-modal="openInjectModal" @open-claim-reward-modal="openClaimRewardModal" />
    <!-- <FeatureSection /> -->
    <HowToUseSection />
    <!-- <BenefitSection /> -->
    <!-- <PricingSection /> -->
    <TestimonialSection />
    <!-- <FAQSection /> -->
    <!-- <CTASection /> -->

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
import {
  walletState
} from '../services/wallet';
import {
  stakeWithInviter,
  getReferrer,
  isReferrerValid,
  getMaxStakeAmount,
  getUsdtBalance
} from '../services/contracts';
import {
  showToast
} from '../services/notification';


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
    // CTASection,
    ClaimRewardModal,
  },
  data() {
    return {
      isInjectModalVisible: false,
      isConfirmReferrerModalVisible: false,
      isClaimRewardModalVisible: false, // <-- Add state for the new modal
      injectionData: null, // To store data from the first modal
      isStaking: false, // To lock UI during transaction
      walletState: walletState,
    };
  },
  methods: {
    openInjectModal() {
      this.isInjectModalVisible = true;
    },
    closeInjectModal() {
      this.isInjectModalVisible = false;
    },
    openClaimRewardModal() {
      this.isClaimRewardModalVisible = true;
    },
    closeClaimRewardModal() {
      this.isClaimRewardModalVisible = false;
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
      showToast("正在处理质押请求...");

      // Final real-time balance check
      const realTimeBalance = await getUsdtBalance();
      const amountToStake = this.injectionData.amount;
      if (parseFloat(realTimeBalance) < parseFloat(amountToStake)) {
        showToast(`错误：您的USDT余额不足 (当前: ${parseFloat(realTimeBalance).toFixed(4)})`);
        this.isStaking = false;
        return;
      }

      // Final on-chain validation for the parent address
      console.log(`[指挥官] 对新用户的推荐人地址进行最终链上校验: ${parentAddress}`);
      const isParentValid = await isReferrerValid(parentAddress);
      if (!isParentValid) {
        console.error(`[指挥官] 推荐人地址校验失败: ${parentAddress}`);
        showToast("错误：推荐人地址无效或未质押");
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
        showToast("质押成功！页面即将刷新。");
        setTimeout(() => window.location.reload(), 2000);
      } else {
        console.error("[指挥官] 质押交易失败");
        showToast("质押失败，请稍后重试。");
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
        showToast(`错误：您的USDT余额不足 (当前: ${parseFloat(realTimeBalance).toFixed(4)})`);
        this.isStaking = false;
        return;
      }

      console.log("[指挥官] 开始从合约获取已绑定的推荐人地址...");
      const parentAddress = await getReferrer();
      if (!parentAddress || parentAddress.startsWith('0x000')) {
        console.error("[指挥官] 获取老用户的推荐人地址失败");
        showToast("错误：无法获取您已绑定的推荐人地址。");
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
        showToast("质押成功！页面即将刷新。");
        setTimeout(() => window.location.reload(), 2000);
      } else {
        console.error("[指挥官] 质押交易失败");
        showToast("质押失败，请稍后重试。");
      }
      this.isStaking = false;
    }
  }
};
</script>
