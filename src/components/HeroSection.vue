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
                        只有代码、数学，以及一个由 AI 驱动的、不可阻挡的<br class="d-none d-sm-block">价值创造机器
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
                                    <div class="form-content" style="margin-bottom: 20px;">
                                        <div class="tf-brand assets-title">
                                            <div class="container">
                                                <h5 class="title text-caption font-2 letter-space-0 fw-normal wg-counter wow fadeInUp assets-title-content">您的资产在此处安睡 </h5>
                                            </div>
                                        </div>
                                        <p class="style-2 coins-title" style="text-align: center; padding: 7px 11px; margin-bottom: 26px;">
                                          <span v-if="isLoading">Loading...</span>
                                          <span v-else>
                                            <AnimatedNumber :value="stakedBalance" :decimals="6" /> TOKEN
                                          </span>
                                        </p>

                                        <div class="tf-brand assets-title">
                                            <div class="container">
                                                <h3 class="title text-caption font-2 letter-space-0 fw-normal wg-counter wow fadeInUp assets-title-content" style="font-size: 16px !important;"> 好友带来的助力 </h3>
                                            </div>
                                        </div>
                                        <p class="style-2 coins-title" style="text-align: center; padding: 7px 11px; margin-bottom: 26px; font-size: 14px !important;">
                                          <span v-if="isLoading">Loading...</span>
                                           <span v-else>
                                            <AnimatedNumber :value="friendsBoost" :decimals="6" /> TOKEN
                                          </span>
                                        </p>

                                        <fieldset class="field-bottom button-add-pool">
                                            <div class="field_left">
                                                <a href="#" @click.prevent="handleInjectPoolClick" class="btn-ip ip-modern text-body-3">
                                                    <i class="icon-plus fs-10"></i>
                                                    注入底池
                                                </a>
                                                <a href="#" @click.prevent="shareFriendLink" class="btn-ip ip-modern text-body-3">
                                                    <i class="icon-arrow-caret-down  fs-8"></i>
                                                    分享好友
                                                </a>
                                                <a href="#" @click.prevent="handleClaimLevelReward" class="btn-ip ip-modern text-body-3">
                                                    <i class="icon-arrow-top fs-14"></i>
                                                    等级奖励
                                                </a>
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
  checkIfUserHasReferrer
} from '../services/contracts';
import {
  showToast
} from '../services/notification';
import AnimatedNumber from './AnimatedNumber.vue'; // Import the new component

const emits = defineEmits(['open-inject-modal', 'open-claim-reward-modal']);

const stakedBalance = ref(0); // Use number type
const friendsBoost = ref(0); // Use number type
let fetchInterval = null;
const isInitialFetch = ref(true); // Flag for the first fetch

const isAuthenticated = computed(() => walletState.isAuthenticated);
const isLoading = computed(() => isAuthenticated.value && isInitialFetch.value);


const fetchHeroData = async () => {
  if (!isAuthenticated.value) return;

  if (isInitialFetch.value) {
    // console.log("正在首次加载数据...");
  } else {
    // console.log("每6秒刷新数据...");
  }

  try {
    const [newStakedBalance, newFriendsBoost] = await Promise.all([
      getUserStakedBalance(),
      getFriendsBoost(),
    ]);
    // Convert string from contract to number for the component
    stakedBalance.value = parseFloat(newStakedBalance) || 0;
    friendsBoost.value = parseFloat(newFriendsBoost) || 0;
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
    showToast('请先连接并授权您的钱包');
    return;
  }
  emits('open-inject-modal');
};

const shareFriendLink = async () => {
  if (!isAuthenticated.value) {
    showToast('请先连接并授权您的钱包');
    return;
  }
  const isEligible = await checkIfUserHasReferrer();
  if (!isEligible) {
    showToast('请先进行质押并绑定您的推荐好友');
    return;
  }
  const referralLink = `${window.location.origin}?ref=${walletState.address}`;
  try {
    await navigator.clipboard.writeText(referralLink);
    showToast('复制成功！链接已复制到剪贴板');
  } catch (err) {
    console.error('无法复制链接: ', err);
    showToast('复制失败，请检查浏览器权限');
  }
};

const handleClaimLevelReward = () => {
  emits('open-claim-reward-modal');
};

watch(isAuthenticated, (isAuth) => {
  if (isAuth) {
    startFetching();
  } else {
    stopFetching();
    resetData();
  }
});


onMounted(() => {
  if (isAuthenticated.value) {
    startFetching();
  }
});

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
</style>


