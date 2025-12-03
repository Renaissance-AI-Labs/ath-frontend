<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <!-- Starry background effect -->
      <div class="stars-bg">
        <div class="stars"></div>
        <div class="stars2"></div>
        <div class="stars3"></div>
      </div>

      <div class="modal-body-custom">
        <!-- Header -->
        <div class="title_holder">
          <h3>{{ t('claim.title') }}</h3>
        </div>

        <!-- Authenticated View -->
        <div v-if="walletState.isAuthenticated" class="reward-content">
            <div v-if="isLoading" class="loading-state-rewards">
                <p>{{ t('claim.loading') }}</p>
            </div>
            <div v-else>
                <div class="level-reward-section">
                    <div class="level-reward-title">{{ t('claim.levelRewardTitle') }}</div>
                    <div class="hexagon-container">
                        <div class="hexagon-wrapper">
                            <div class="hexagon" :class="{ 'is-unlocked': s5_kpiMet }">
                                <span class="level-text level-s5">S5</span>
                            </div>
                            <div class="reward-display">
                                <span>{{ parseFloat(s5_rewards) > 0 ? parseFloat(s5_rewards).toFixed(2) + ' ' + t('common.ath') : t('claim.noReward') }}</span>
                            </div>
                            <button @click="claim(5)" :disabled="parseFloat(s5_rewards) <= 0 || isClaiming[5]" class="tf-btn text-body-3 style-1 animate-btn animate-dark btn-claim">
                                {{ isClaiming[5] ? t('claim.claiming') : t('claim.claim') }}
                            </button>
                        </div>
                        <div class="hexagon-wrapper">
                            <div class="hexagon" :class="{ 'is-unlocked': s6_kpiMet }">
                                <span class="level-text level-s6">S6</span>
                            </div>
                            <div class="reward-display">
                                <span>{{ parseFloat(s6_rewards) > 0 ? parseFloat(s6_rewards).toFixed(2) + ' ' + t('common.ath') : t('claim.noReward') }}</span>
                            </div>
                            <button @click="claim(6)" :disabled="parseFloat(s6_rewards) <= 0 || isClaiming[6]" class="tf-btn text-body-3 style-1 animate-btn animate-dark btn-claim">
                                {{ isClaiming[6] ? t('claim.claiming') : t('claim.claim') }}
                            </button>
                        </div>
                        <div class="hexagon-wrapper">
                            <div class="hexagon" :class="{ 'is-unlocked': s7_kpiMet }">
                                <span class="level-text level-s7">S7</span>
                            </div>
                            <div class="reward-display">
                                <span>{{ parseFloat(s7_rewards) > 0 ? parseFloat(s7_rewards).toFixed(2) + ' ' + t('common.ath') : t('claim.noReward') }}</span>
                            </div>
                            <button @click="claim(7)" :disabled="parseFloat(s7_rewards) <= 0 || isClaiming[7]" class="tf-btn text-body-3 style-1 animate-btn animate-dark btn-claim">
                                {{ isClaiming[7] ? t('claim.claiming') : t('claim.claim') }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Node Rewards Section -->
                <div v-if="showNodePointSection" class="node-reward-section">
                    <div class="node-reward-title">{{ t('claim.nodeRewardTitle') }}</div>
                    <div class="node-reward-content">
                        <span class="reward-amount">{{ truncatedNodeRewards }} {{ t('common.ath') }}</span>
                        <button 
                            @click="claimNodeReward" 
                            :disabled="parseFloat(node_rewards) <= 0 || isClaimingNodeReward" 
                            :class="{ 'pseudo-disabled': !isPreacher }"
                            class="tf-btn text-body-3 style-1 animate-btn animate-dark btn-claim">
                            {{ isClaimingNodeReward ? t('claim.claiming') : t('claim.claim') }}
                        </button>
                    </div>
                </div>

                <!-- Dividend Rewards Section -->
                <div v-if="showDividendPointSection" class="node-reward-section">
                    <div class="node-reward-title">{{ t('claim.dividendRewardTitle') }}</div>
                    <div class="node-reward-content">
                        <span class="reward-amount">{{ truncatedDividendRewards }} USDT</span>
                        <button 
                            @click="claimDividendReward" 
                            :disabled="parseFloat(dividend_rewards) <= 0 || isClaimingDividendReward" 
                            :class="{ 'pseudo-disabled': !isPreacher }"
                            class="tf-btn text-body-3 style-1 animate-btn animate-dark btn-claim">
                            {{ isClaimingDividendReward ? t('claim.claiming') : t('claim.claim') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Unauthenticated View -->
        <div v-else class="unauthenticated-view">
            <p>{{ t('claim.connectWallet') }}</p>
        </div>

      </div>
      <button @click="$emit('close')" class="close-button">
        <i class="icon icon-close"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import {
    ref,
    onMounted,
    watch,
    computed
} from 'vue';
import {
    walletState
} from '../services/wallet';
import {
    getTeamKpiBigNumber,
    getS5PendingRewards,
    getS6PendingRewards,
    getS7PendingRewards,
    claimS5Rewards,
    claimS6Rewards,
    claimS7Rewards,
    getNodePointRewards,
    claimNodePointRewards,
    checkIsPreacher,
    getDividendPointRewards,
    claimDividendPointRewards,
    S5_THRESHOLD,
    S6_THRESHOLD,
    S7_THRESHOLD
} from '../services/contracts';
import { t } from '@/i18n';
import { showToast } from '../services/notification';

const emit = defineEmits(['close']);
const isLoading = ref(true);
const s5_kpiMet = ref(false);
const s6_kpiMet = ref(false);
const s7_kpiMet = ref(false);
const s5_rewards = ref('0');
const s6_rewards = ref('0');
const s7_rewards = ref('0');
const node_rewards = ref('0');
const dividend_rewards = ref('0');
const showNodePointSection = ref(false);
const showDividendPointSection = ref(false);
const isPreacher = ref(false);
const isClaiming = ref({
    5: false,
    6: false,
    7: false
});
const isClaimingNodeReward = ref(false);
const isClaimingDividendReward = ref(false);

const truncatedNodeRewards = computed(() => {
    const num = parseFloat(node_rewards.value);
    if (isNaN(num)) return '0.0000';
    // Truncate to 4 decimal places without rounding
    const truncated = Math.floor(num * 10000) / 10000;
    return truncated.toFixed(4); // Use toFixed to ensure 4 decimal places are shown
});

const truncatedDividendRewards = computed(() => {
    const num = parseFloat(dividend_rewards.value);
    if (isNaN(num)) return '0.0000';
    const truncated = Math.floor(num * 10000) / 10000;
    return truncated.toFixed(4);
});

const fetchRewardData = async () => {
    // This check is now slightly redundant due to the watcher, but good for safety.
    if (!walletState.isAuthenticated || !walletState.contractsInitialized) return;

    isLoading.value = true;
    try {
        const [kpi, s5Rewards, s6Rewards, s7Rewards, nodeRewards, preacherStatus, dividendRewards] = await Promise.all([
            getTeamKpiBigNumber(),
            getS5PendingRewards(),
            getS6PendingRewards(),
            getS7PendingRewards(),
            getNodePointRewards(),
            checkIsPreacher(),
            getDividendPointRewards()
        ]);

        // --- Exclusive Level Check Logic ---
        // A user can only be at one level at a time.
        const kpiMetS7 = kpi >= S7_THRESHOLD;
        const kpiMetS6 = kpi >= S6_THRESHOLD;
        const kpiMetS5 = kpi >= S5_THRESHOLD;

        s7_kpiMet.value = kpiMetS7;
        s6_kpiMet.value = kpiMetS6 && !kpiMetS7;
        s5_kpiMet.value = kpiMetS5 && !kpiMetS6;

        s5_rewards.value = s5Rewards;
        s6_rewards.value = s6Rewards;
        s7_rewards.value = s7Rewards;
        node_rewards.value = nodeRewards;
        dividend_rewards.value = dividendRewards;
        isPreacher.value = preacherStatus;

        // --- Conditional Visibility for Node Point Section ---
        const nodeRewardsNum = parseFloat(nodeRewards);
        // The section is shown if the value truncated to 4 decimal places is greater than 0.
        showNodePointSection.value = Math.floor(nodeRewardsNum * 10000) > 0;

        // --- Conditional Visibility for Dividend Point Section ---
        const dividendRewardsNum = parseFloat(dividendRewards);
        // Show if rewards > 0
        showDividendPointSection.value = Math.floor(dividendRewardsNum * 10000) > 0;

        console.log(`[成就奖励数据] 获取成功:
          - 用户KPI (原始值): ${kpi.toString()}
          - S5门槛: ${S5_THRESHOLD.toString()} -> 是否达到: ${s5_kpiMet.value}
          - S6门槛: ${S6_THRESHOLD.toString()} -> 是否达到: ${s6_kpiMet.value}
          - S7门槛: ${S7_THRESHOLD.toString()} -> 是否达到: ${s7_kpiMet.value}
          - S5待领奖励: ${s5_rewards.value} ATH
          - S6待领奖励: ${s6_rewards.value} ATH
          - S7待领奖励: ${s7_rewards.value} ATH
          - Node Point待领奖励: ${node_rewards.value} ATH
          - Dividend Point待领奖励: ${dividend_rewards.value} USDT
          - 是否为Preacher: ${isPreacher.value}
        `);

    } catch (error) {
        console.error("Failed to fetch reward data:", error);
    } finally {
        isLoading.value = false;
    }
};

const claim = async (level) => {
    if (isClaiming.value[level]) return; // Prevent double clicks
    isClaiming.value[level] = true;
    console.log(`[领取操作] 开始为 S${level} 领取奖励...`);

    let success = false;
    try {
        switch (level) {
            case 5:
                success = await claimS5Rewards();
                break;
            case 6:
                success = await claimS6Rewards();
                break;
            case 7:
                success = await claimS7Rewards();
                break;
            default:
                console.error("Invalid level for claim:", level);
        }

        if (success) {
            console.log(`[领取操作] S${level} 奖励领取成功, 正在刷新数据...`);
            // The success toast is shown in contracts.js, just refetch data here.
            await fetchRewardData(); // Refetch data to update the UI
        } else {
            console.log(`[领取操作] S${level} 奖励领取失败或用户取消。`);
            // Failure toast is also handled in contracts.js
        }
    } catch (error) {
        console.error(`[领取操作] S${level} 领取过程中发生意外错误:`, error);
    } finally {
        isClaiming.value[level] = false;
    }
};

const claimNodeReward = async () => {
    // First, check if the user is a preacher.
    if (!isPreacher.value) {
        showToast(t('toast.stake200Tokens'));
        return;
    }

    if (isClaimingNodeReward.value || parseFloat(node_rewards.value) <= 0) return;
    isClaimingNodeReward.value = true;
    console.log('[领取操作] 开始为 Node Point 领取奖励...');

    try {
        const success = await claimNodePointRewards();
        if (success) {
            console.log('[领取操作] Node Point 奖励领取成功!');
            showToast(t('toast.claimSuccess')); // Using a generic success message for now
            emit('close');
        } else {
            console.log('[领取操作] Node Point 奖励领取失败或用户取消。');
            // Failure toast is handled in contracts.js
        }
    } catch (error) {
        console.error('[领取操作] Node Point 领取过程中发生意外错误:', error);
    } finally {
        isClaimingNodeReward.value = false;
    }
};

const claimDividendReward = async () => {
    if (!isPreacher.value) {
        showToast(t('toast.stake200Tokens'));
        return;
    }

    if (isClaimingDividendReward.value || parseFloat(dividend_rewards.value) <= 0) return;
    isClaimingDividendReward.value = true;
    console.log('[领取操作] 开始为 Dividend Point 领取奖励...');

    try {
        const success = await claimDividendPointRewards();
        if (success) {
            console.log('[领取操作] Dividend Point 奖励领取成功!');
            // Success toast is handled in contracts.js
            emit('close');
        } else {
            console.log('[领取操作] Dividend Point 奖励领取失败或用户取消。');
        }
    } catch (error) {
        console.error('[领取操作] Dividend Point 领取过程中发生意外错误:', error);
    } finally {
        isClaimingDividendReward.value = false;
    }
};

// Fetch data when the modal becomes visible and the user is authenticated.
watch(() => walletState.isAuthenticated, (isAuth) => {
    if (isAuth && walletState.contractsInitialized) {
        fetchRewardData();
    } else {
        // Reset data if user disconnects
        isLoading.value = true;
        s5_kpiMet.value = false;
        s6_kpiMet.value = false;
        s7_kpiMet.value = false;
        s5_rewards.value = '0';
        s6_rewards.value = '0';
        s7_rewards.value = '0';
        node_rewards.value = '0';
        dividend_rewards.value = '0';
        showNodePointSection.value = false;
        showDividendPointSection.value = false;
        isPreacher.value = false;
    }
}, {
    immediate: true
});
</script>

<style scoped>
/* Reuse styles from other modals for consistency */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.close-button {
  position: absolute;
  top: 30px;
  right: 20px;
  background: transparent;
  border: none;
  color: var(--white);
  font-size: 24px;
  cursor: pointer;
  z-index: 20; /* Higher z-index to ensure it's clickable */
}

.modal-content {
  background: rgba(20, 20, 21, 0.75);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

.modal-body-custom {
    position: relative;
    z-index: 2;
}

.title_holder {
  text-align: center;
  margin-bottom: 25px;
  color: #fff;
}

.title_holder h3 {
    font-size: 24px;
    font-weight: 600;
}

.reward-content {
    text-align: center;
    color: #ccc;
    min-height: 100px; /* Give some space for content */
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    /* Let's adjust margin since the content inside is growing */
    margin: 40px 0;
}

.level-reward-section {
    border: 1px solid var(--line);
    border-radius: 15px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.03);
}

.level-reward-title {
    color: #fff;
    font-size: 16px;
    text-align: center;
    margin-bottom: 20px;
    font-family: 'ChillRoundF', sans-serif;
}

.node-reward-section {
    border-radius: 15px;
    padding: 12px 20px;
    /* Static gradient background, no animation */
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03));
    margin-top: 20px;
    position: relative;
    overflow: hidden;
    /* Use a subtle border */
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Subtle shine effect using a pseudo-element (Hardware Accelerated) */
.node-reward-section::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    transform: translateX(-100%);
    animation: subtle-shine 6s ease-in-out infinite;
    pointer-events: none; /* Ensure clicks pass through */
    will-change: transform;
    z-index: 1;
}

@keyframes subtle-shine {
    0%, 20% {
        transform: translateX(-100%);
    }
    50%, 100% {
        transform: translateX(200%);
    }
}

.node-reward-title {
    color: #fff;
    font-size: 16px;
    text-align: center;
    margin-bottom: 15px;
    font-family: 'ChillRoundF', sans-serif;
}

.node-reward-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.reward-amount {
    color: #fff;
    font-size: 14px;
    min-height: 20px;
    font-family: 'ChillRoundF', sans-serif;
    text-shadow: 0 0 4px var(--primary);
}

.unauthenticated-view {
    margin: 90px 0;
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    font-family: 'ChillRoundF', sans-serif;
}

.loading-state-rewards {
    min-height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    font-family: 'ChillRoundF', sans-serif;
}

.hexagon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px; /* Space between hexagons */
}

.hexagon-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px; /* Space between hexagon and button */
}

.hexagon {
    width: 80px;
    height: 110px; /* Increased from 92.38px to make it taller */
    position: relative;
    /* Adjusted polygon points to stretch vertically */
    clip-path: polygon(50% 0%, 100% 20%, 100% 80%, 50% 100%, 0% 80%, 0% 20%);
    background-color: rgba(255, 255, 255, 0.05); /* Slight inner fill for substance */
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden; /* Crucial for containing the shine effect */
}

/* Plain border for locked state (default) */
.hexagon::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    clip-path: inherit;
    background-color: transparent;
    border: 2px solid rgba(255, 255, 255, 0.4);
    transition: all 0.3s ease-in-out;
}

/* --- UNLOCKED (ENHANCED) STATE STYLES --- */

/* Glowing border for unlocked state */
.hexagon.is-unlocked::before {
    border-color: white;
    filter: drop-shadow(0 0 5px white) drop-shadow(0 0 10px white);
    opacity: 0.8;
}

/* Shine effect for unlocked state */
.hexagon.is-unlocked::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%);
    transform: translateX(-150%) skewX(-30deg);
    z-index: 1;
    animation: shine-effect 4s ease-in-out infinite;
}

/* Staggered animation delay for the shine effect */
.hexagon-wrapper:nth-child(2) .hexagon.is-unlocked::after {
    animation-delay: 0.3s;
}

.hexagon-wrapper:nth-child(3) .hexagon.is-unlocked::after {
    animation-delay: 0.6s;
}

@keyframes shine-effect {
    0% {
        transform: translateX(-250%) skewX(-30deg);
    }
    100% {
        transform: translateX(250%) skewX(-30deg);
    }
}

.btn-claim {
    padding: 8px 0px;
    font-size: 14px;
    min-width: 90px;
    /* The disabled styles are now handled by the .tf-btn[disabled] selector from the global CSS */
}

.btn-claim.pseudo-disabled {
    background-image: none !important;
    background-color: #21212B !important;
    opacity: 0.6 !important;
    cursor: not-allowed !important;
}

.btn-claim[disabled],
.tf-btn.style-1[disabled] {
    background-image: none !important;
    background-color: #21212B !important;
    opacity: 0.6 !important;
    cursor: not-allowed !important;
}

/* Plain text style for locked state (default) */
.level-text {
    font-family: 'ChillRoundF', sans-serif; /* Using a cool, rounded font */
    font-size: 28px;
    z-index: 2; /* Ensure text is above the background effects */
    color: rgba(255, 255, 255, 0.6);
    text-shadow: none;
    transition: all 0.3s ease-in-out;
}

/* --- UNLOCKED (ENHANCED) TEXT STYLES --- */

.hexagon.is-unlocked .level-s5 {
    /* Copper */
    color: #bba89a;
    text-shadow: 0 0 4px #bba89a, 0 0 8px #ffb366;
}

.hexagon.is-unlocked .level-s6 {
    /* Silver */
    color: #ccdfe6;
    text-shadow: 0 0 4px #ffffff, 0 0 8px #d7d7d7, 0 0 12px #c0c0c0;
}

.hexagon.is-unlocked .level-s7 {
    /* Gold */
    color: #d8d2be;
    text-shadow: 0 0 4px #f0c43c, 0 0 8px #ffd700, 0 0 12px #fff8dc;
}


.button-group-center {
    display: flex;
    justify-content: center;
}

.btn-confirm {
    min-width: 150px;
}

/* Starry background effect - Copied from InjectPoolModal */
.stars-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

@keyframes animStar {
  from { transform: translateY(0px); }
  to { transform: translateY(-500px); }
}

.reward-display {
    color: #fff;
    font-size: 14px;
    min-height: 20px;
    font-family: 'ChillRoundF', sans-serif;
    text-shadow: 0 0 4px var(--primary);
}
</style>
