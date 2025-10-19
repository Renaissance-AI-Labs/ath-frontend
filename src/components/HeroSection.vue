<template>
    <section class="section-hero">
        <!-- == Head Section -->
        <div class="sect-header">
            <div class="container">
                <div class="s-meta text-caption font-2">
                    <p class="s-number_order wg-counter">
                        [ <span class="text-white">BACK</span> TO ]
                    </p>
                    <p class="s-label">[ <span class="text-white hacker-text_transform">FUTURE</span> ]</p>
                </div>
            </div>
        </div>
        <span class="br-line"></span>
        <!-- == Tagline Section -->
        <div class="sect-tagline">
            <div class="container">
                <div class="sect-tagline_inner">
                    <span class="hafl-plus pst-left_bot wow bounceInScale"></span>
                    <span class="hafl-plus pst-right_bot wow bounceInScale"></span>
                    <p class="s-name text-caption font-2">
                        <span class="bar-group type-left">
                            <span class="bar_center"></span>
                        </span>
                        <span class="hacker-text_transform no-delay">
                            YOUR ALL-IN-ONE ATHENA PLATFORM
                        </span>
                        <span class="bar-group type-right">
                            <span class="bar_center"></span>
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <span class="br-line"></span>
        <!-- == Main Section -->
        <div class="sect-main">
            <div class="container">
                <div class="sect-title wow fadeInUp">
                    <h1 class="s-title font-3 title-big">
                        Athena Protocol <br>
                        <!-- <span class="text-change_wrap">
                            <span class="text-change_rotating">这里没有<span class="icon icon-gemini"></span>CEO
                            </span>
                            <span class="text-change_rotating">这里没有<span
                                    class="icon icon-gemini"></span>营销团队
                            </span>
                            <span class="text-change_rotating">Built on<span class="icon icon-cloud"></span>Claude.
                            </span>
                        </span> -->
                    </h1>
                    <p class="s-sub_title" style="color: #fff;">
                        {{ t('hero.subtitle') }}
                    </p>
                </div>
            </div>
            <span class="br-line"></span>
            <div class="container"> 
                <div class="leave-somthing"> 
                    <!-- ----- 保留节目 ---- -->
                </div>
            </div>
            <!-- <div class="tf-brand assets-title">
                <div class="container">
                    <h5 class="title text-caption font-2 letter-space-0 fw-normal wg-counter wow fadeInUp assets-title-content">您的资产在此处安睡 </h5>
                </div>
            </div> -->
            <div class="container">
                <div class="sect-content position-relative">
                    <div class="box-ask-wrap">
                        <div class="box-ask">
                            <form class="form-ask wow fadeInUp form-ask-bg">
                                <div class="box-ask-inner">
                                    <!-- S5~S7 Level Watermark -->
                                    <div v-if="userLevel && ['S5', 'S6', 'S7'].includes(userLevel)" 
                                         class="level-watermark"
                                         :class="`level-${userLevel.toLowerCase()}`">
                                        {{ userLevel }}
                                    </div>
                                    <div class="form-content" style="margin-bottom: 20px;">
                                        <div class="tf-brand assets-title">
                                            <div class="container">
                                                <h5 class="title text-caption font-2 letter-space-0 fw-normal wg-counter wow fadeInUp assets-title-content">{{ t('hero.assetsTitle') }}</h5>
                                            </div>
                                        </div>
                                        <p class="style-2 coins-title" style="text-align: center; padding: 7px 11px; margin-bottom: 26px;">
                                          <span v-if="isLoading">{{ t('common.loading') }}</span>
                                          <span v-else>
                                            <AnimatedNumber :value="stakedBalance" :decimals="6" /> {{ t('common.token') }}
                                          </span>
                                        </p>

                                        <div class="tf-brand assets-title">
                                            <div class="container">
                                                <h3 class="title text-caption font-2 letter-space-0 fw-normal wg-counter wow fadeInUp assets-title-content" style="font-size: 16px !important;">{{ t('hero.friendsBoost') }}</h3>
                                            </div>
                                        </div>
                                        <p class="style-2 coins-title" style="text-align: center; padding: 7px 11px; margin-bottom: 26px; font-size: 14px !important;">
                                          <span v-if="isLoading">{{ t('common.loading') }}</span>
                                           <span v-else>
                                            <AnimatedNumber :value="friendsBoost" :decimals="6" /> {{ t('common.token') }}
                                            <span v-if="userLevel" class="user-level-badge">{{ userLevel }}</span>
                                          </span>
                                        </p>

                                        <fieldset class="field-bottom button-add-pool">
                                            <div class="field_left">
                                                <a href="#" @click.prevent="handleInjectPoolClick" class="btn-ip ip-modern text-body-3" style="padding: 7px 7px !important; gap: 4px !important;">
                                                    <i class="icon-plus fs-10"></i>
                                                    {{ t('hero.injectPool') }}
                                                </a>
                                                <a href="#" @click.prevent="shareFriendLink" class="btn-ip ip-modern text-body-3" style="padding: 7px 7px !important; gap: 4px !important;">
                                                    <i class="icon-arrow-caret-down  fs-8"></i>
                                                    {{ t('hero.shareFriend') }}
                                                </a>
                                                <div class="reward-button-wrapper">
                                                    <a href="#" @click.prevent="handleClaimLevelReward" class="btn-ip ip-modern text-body-3" v-if="isAuthenticated" style="padding: 7px 7px !important; gap: 4px !important;">
                                                        <i class="icon-arrow-top fs-14"></i>
                                                        {{ t('hero.achievementReward') }}
                                                    </a>
                                                    <div v-if="walletState.hasClaimableRewards" class="red-dot"></div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <span class="hafl-plus pst-left_bot item_bot wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot item_bot wow bounceInScale"></span>
                        <span class="hafl-plus pst-left_top item_top wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_top item_top wow bounceInScale"></span>
                    </div>
                    <span class="line_section"></span>

                </div>
            </div>
            <span class="br-line"></span>
            <!-- == Brand -->
            <!-- <div class="tf-brand"> -->
                <!-- <div class="container"> -->
                    <!-- <div class="tf-brand_inner"> -->
                        <!-- <h5 class="title text-caption font-2 letter-space-0 fw-normal wg-counter wow fadeInUp">TRUSTED
                            BY <span class="odometer" data-number="6000">1000</span>+ HIGHLY PRODUCTIVE COMPANY</h5> -->
                        <!-- <div class="infiniteSlide infiniteSlide_brand" data-clone="3">
                            <div class="image-brand">
                                <img class="lazyload" src="/asset/images/brand/brand-1.png"
                                    data-src="/asset/images/brand/brand-1.png" alt="Brand">
                            </div>
                            <div class="image-brand">
                                <img class="lazyload" src="/asset/images/brand/brand-2.png"
                                    data-src="/asset/images/brand/brand-2.png" alt="Brand">
                            </div>
                            <div class="image-brand">
                                <img class="lazyload" src="/asset/images/brand/brand-3.png"
                                    data-src="/asset/images/brand/brand-3.png" alt="Brand">
                            </div>
                            <div class="image-brand">
                                <img class="lazyload" src="/asset/images/brand/brand-4.png"
                                    data-src="/asset/images/brand/brand-4.png" alt="Brand">
                            </div>
                            <div class="image-brand">
                                <img class="lazyload" src="/asset/images/brand/brand-5.png"
                                    data-src="/asset/images/brand/brand-5.png" alt="Brand">
                            </div>
                            <div class="image-brand">
                                <img class="lazyload" src="/asset/images/brand/brand-6.png"
                                    data-src="/asset/images/brand/brand-6.png" alt="Brand">
                            </div>
                        </div> -->
                        <!-- <span class="hafl-plus pst-left_bot item_bot wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot item_bot wow bounceInScale"></span> -->
                    <!-- </div> -->
                <!-- </div> -->
            <!-- </div> -->
            <!-- <span class="br-line"></span> -->
            <!-- == Bottom Section -->
            <div class="sect-bottom">
            </div>
        </div>
    </section>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted
} from 'vue';
import {
  walletState
} from '../services/wallet';
import {
  getUserStakedBalance,
  getFriendsBoost,
  checkIfUserHasReferrer,
  getTeamKpiBigNumber,
  S1_THRESHOLD,
  S2_THRESHOLD,
  S3_THRESHOLD,
  S4_THRESHOLD,
  S5_THRESHOLD,
  S6_THRESHOLD,
  S7_THRESHOLD
} from '../services/contracts';
import {
  showToast
} from '../services/notification';
import AnimatedNumber from './AnimatedNumber.vue'; // Import the new component
import { t } from '@/i18n';
import { ethers } from 'ethers';

const emits = defineEmits(['open-inject-modal', 'open-claim-reward-modal']);

const stakedBalance = ref(0); // Use number type
const friendsBoost = ref(0); // Use number type
const userLevel = ref(''); // User's S level (e.g., 'S5', 'S6', 'S7')
let fetchInterval = null;
const isInitialFetch = ref(true); // Flag for the first fetch

const isAuthenticated = computed(() => walletState.isAuthenticated);
const isLoading = computed(() => isAuthenticated.value && isInitialFetch.value);


const fetchHeroData = async () => {
  if (!isAuthenticated.value || !walletState.contractsInitialized) {
    console.log('[HeroSection] 跳过数据获取 - 未认证或合约未初始化');
    return;
  }

  if (isInitialFetch.value) {
    console.log("[HeroSection] 正在首次加载数据...");
  } else {
    // console.log("每6秒刷新数据...");
  }

  try {
    // Optimize: Only call getTeamKpiBigNumber once, use it for both friendsBoost and level calculation
    const [newStakedBalance, kpi] = await Promise.all([
      getUserStakedBalance(),
      getTeamKpiBigNumber(),
    ]);
    
    // Convert string from contract to number for the component
    stakedBalance.value = parseFloat(newStakedBalance) || 0;
    
    // Convert KPI BigInt to formatted number for friendsBoost display
    friendsBoost.value = parseFloat(ethers.formatUnits(kpi, 18)) || 0;
    
    // Calculate user level based on KPI
    if (kpi >= S7_THRESHOLD) {
      userLevel.value = 'S7';
    } else if (kpi >= S6_THRESHOLD) {
      userLevel.value = 'S6';
    } else if (kpi >= S5_THRESHOLD) {
      userLevel.value = 'S5';
    } else if (kpi >= S4_THRESHOLD) {
      userLevel.value = 'S4';
    } else if (kpi >= S3_THRESHOLD) {
      userLevel.value = 'S3';
    } else if (kpi >= S2_THRESHOLD) {
      userLevel.value = 'S2';
    } else if (kpi >= S1_THRESHOLD) {
      userLevel.value = 'S1';
    } else {
      userLevel.value = ''; // No level if below S1 threshold
    }
  } catch (error) {
    console.error("刷新数据失败:", error);
  } finally {
    // This logic ensures the initial "Loading..." state is cleared
    if (isInitialFetch.value) {
      isInitialFetch.value = false;
    }
  }
};

const resetData = () => {
  stakedBalance.value = 0;
  friendsBoost.value = 0;
  userLevel.value = '';
  isInitialFetch.value = true; // Reset flag on disconnect
};

const startFetching = () => {
  stopFetching(); // Ensure no multiple intervals are running
  fetchHeroData(); // Fetch immediately
  fetchInterval = setInterval(fetchHeroData, 6000);
};

const stopFetching = () => {
  if (fetchInterval) {
    clearInterval(fetchInterval);
    fetchInterval = null;
  }
};

const handleInjectPoolClick = () => {
  if (!isAuthenticated.value) {
    showToast(t('toast.connectWalletFirst'));
    return;
  }
  emits('open-inject-modal');
};

const shareFriendLink = async () => {
  if (!isAuthenticated.value) {
    showToast(t('toast.connectWalletFirst'));
    return;
  }
  const isEligible = await checkIfUserHasReferrer();
  if (!isEligible) {
    showToast(t('toast.stakeAndBindFirst'));
    return;
  }
  const referralLink = `${window.location.origin}?ref=${walletState.address}`;
  try {
    // Create temporary textarea element for better compatibility (especially for mobile wallets like TP)
    const textArea = document.createElement('textarea');
    textArea.value = referralLink;
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

const handleClaimLevelReward = () => {
  emits('open-claim-reward-modal');
};

watch(() => [isAuthenticated.value, walletState.contractsInitialized], ([isAuth, contractsReady]) => {
  console.log(`[HeroSection] 状态变化 - isAuth: ${isAuth}, contractsReady: ${contractsReady}`);
  if (isAuth && contractsReady) {
    startFetching();
  } else {
    stopFetching();
    if (!isAuth) {
      resetData();
    }
  }
}, { immediate: true });


onUnmounted(() => {
  stopFetching();
});
</script>

<style scoped>

.text-change_wrap {
    margin-top: 50px;
    font-size: 18px;
}

.title-big {
    font-size: 48px;
    color: #fff;
}

.coins-title {
    font-size: 26px;
    font-family: 'monospace', 'BlinkMacSystemFont', sans-serif;
    
    /* Shimmer Effect on Text */
    background: linear-gradient(90deg, #f6faff 20%, #b3e8ff 40%, #fafbff 60%);
    background-size: 200% auto;
    color: #fff;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
    to {
        background-position: -200% center;
    }
}

.button-add-pool {
    justify-content: center !important;
}

.assets-title {
    margin-top: 40px;
    /* margin-bottom: 10px !important; */
}

.assets-title-content {
    font-size: 20px !important;
    color: #fff;
    margin-bottom: 10px !important;
    font-weight: bold !important;
}

.form-ask-bg {
    background-color: #11111300;
}

.level-watermark {
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 160px;
    font-weight: 900;
    z-index: 0;
    pointer-events: none;
    user-select: none;
    letter-spacing: 12px;
}

/* S5 - Light Blue (浅蓝色) */
.level-s5 {
    color: rgba(147, 197, 253, 0.12);
    text-shadow: 
        0 0 60px rgba(147, 197, 253, 0.28),
        0 0 100px rgba(186, 230, 253, 0.2),
        0 0 140px rgba(224, 242, 254, 0.15);
    animation: glowLightBlueS5 6s ease-in-out infinite;
}

@keyframes glowLightBlueS5 {
    0%, 100% {
        text-shadow: 
            0 0 60px rgba(147, 197, 253, 0.28),
            0 0 100px rgba(186, 230, 253, 0.2),
            0 0 140px rgba(224, 242, 254, 0.15);
        opacity: 0.6;
    }
    50% {
        text-shadow: 
            0 0 80px rgba(147, 197, 253, 0.4),
            0 0 120px rgba(186, 230, 253, 0.3),
            0 0 160px rgba(224, 242, 254, 0.22);
        opacity: 0.8;
    }
}

/* S6 - Lighter Blue (更浅蓝色) */
.level-s6 {
    color: rgba(186, 230, 253, 0.12);
    text-shadow: 
        0 0 60px rgba(186, 230, 253, 0.25),
        0 0 100px rgba(224, 242, 254, 0.18),
        0 0 140px rgba(240, 249, 255, 0.12);
    animation: glowLighterBlue 6s ease-in-out infinite;
}

@keyframes glowLighterBlue {
    0%, 100% {
        text-shadow: 
            0 0 60px rgba(186, 230, 253, 0.25),
            0 0 100px rgba(224, 242, 254, 0.18),
            0 0 140px rgba(240, 249, 255, 0.12);
        opacity: 0.6;
    }
    50% {
        text-shadow: 
            0 0 80px rgba(186, 230, 253, 0.38),
            0 0 120px rgba(224, 242, 254, 0.28),
            0 0 160px rgba(240, 249, 255, 0.2);
        opacity: 0.8;
    }
}

/* S7 - Silver White (银白色) */
.level-s7 {
    color: rgba(229, 228, 226, 0.12);
    text-shadow: 
        0 0 60px rgba(229, 228, 226, 0.35),
        0 0 100px rgba(241, 245, 249, 0.25),
        0 0 140px rgba(248, 250, 252, 0.18);
    animation: glowSilverWhite 6s ease-in-out infinite;
}

@keyframes glowSilverWhite {
    0%, 100% {
        text-shadow: 
            0 0 60px rgba(229, 228, 226, 0.35),
            0 0 100px rgba(241, 245, 249, 0.25),
            0 0 140px rgba(248, 250, 252, 0.18);
        opacity: 0.6;
    }
    50% {
        text-shadow: 
            0 0 80px rgba(229, 228, 226, 0.5),
            0 0 120px rgba(241, 245, 249, 0.38),
            0 0 160px rgba(248, 250, 252, 0.28);
        opacity: 0.8;
    }
}

.box-ask-inner {
    position: relative;
}

.form-content {
    position: relative;
    z-index: 1;
}

.user-level-badge {
    margin-left: 8px;
    padding: 2px 8px;
    background: linear-gradient(135deg, #e2e5eb 0%, #4b79a2 100%);
    border-radius: 6px;
    font-size: 12px;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 1px 1px rgb(0 0 0 / 64%);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
    display: inline-block;
    vertical-align: middle;
    animation: glow 4s ease-in-out infinite;
}

/* @keyframes glow {
    0%, 100% {
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
    }
    50% {
        box-shadow: 0 2px 12px rgba(102, 164, 234, 0.8);
    }
} */

.reward-button-wrapper {
    position: relative;
    display: inline-block;
}

.red-dot {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 10px;
  height: 10px;
  background-color: #101e2e;
  border-radius: 50%;
  border: 1px solid white;
}
</style>


