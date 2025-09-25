<template>
    <section class="section-how-to" id="howToUse">
        <!-- == Head Section -->
        <div class="sect-header">
            <div class="container">
                <div class="s-meta text-caption font-2">
                    <p class="s-number_order wg-counter">
                        [ <span class="text-white">02</span> / 04 ]
                    </p>
                    <p class="s-label">[ <span class="text-white hacker-text_transform">治理未来
</span> ]</p>
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
                            Rule Over All
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
        <div class="sect-main flat-animate-tab img-position">
            <!-- <div class="visual-object">
                <div class="object_img wow bounceInScale">
                    <div class="image">
                        <img src="/asset/images/artora-img/anime-2.gif" alt="Image" class="benefit-gif-2 gif-place-2">
                    </div>
                </div>
            </div> -->
            <div class="s-img_item wow bounceInScale">
                <img class="lazyload" src="/asset/images/section/gradient-ring-bg.webp"
                    data-src="/asset/images/section/gradient-ring-bg.webp" alt="Background">
            </div>
            <div class="container">
                <div class="sect-title wow fadeInUp title-position">
                    <h2 class="s-title font-3 m-0" style="color: #fff;">
                        在这里 — <br>
                        掌控你的财富
                    </h2>
                    <p class="s-sub_title" style="margin-top: 14px; color: #fff;">
                        捐赠至底池的资金，将依额度每日累积。 <br
                            class="d-none d-lg-block">
                        最高享 1.2% 自动复利，周期不超过 30 天。
                    </p>
                </div>
                <div class="row">
                    <div class="col-md-6 offset-xl-2 col-xl-4 order-list">

                        <div class="tabs-container">
                            <button class="toggle-button" @click="toggleTab">
                                <span class="tab-text" :class="{ active: activeTab === 'investment' }">投资列表</span>
                                <span class="tab-divider"></span>
                                <span class="tab-text" :class="{ active: activeTab === 'redemption' }">赎回列表</span>
                            </button>
                        </div>

                        <div v-if="isLoading" class="loading-state" :class="`list-${listMode}`">
                            <div class="stars-bg stars-bg-1">
                                <div class="stars"></div>
                                <div class="stars2"></div>
                                <div class="stars3"></div>
                            </div>
                            <p>正在加载质押数据...</p>
                        </div>
                        <div v-else-if="!walletState.isAuthenticated" class="empty-state" :class="`list-${listMode}`">
                            <div class="stars-bg stars-bg-1">
                                <div class="stars"></div>
                                <div class="stars2"></div>
                                <div class="stars3"></div>
                            </div>
                            <p>请先连接钱包以查看您的质押订单</p>
                        </div>
                        <div v-else-if="!walletState.contractsInitialized" class="empty-state" :class="`list-${listMode}`">
                            <div class="stars-bg stars-bg-1">
                                <div class="stars"></div>
                                <div class="stars2"></div>
                                <div class="stars3"></div>
                            </div>
                            <p>合约初始化失败，请刷新重试</p>
                        </div>
                        <div v-else-if="filteredItems.length === 0" class="empty-state" :class="`list-${listMode}`">
                            <div class="stars-bg stars-bg-1">
                                <div class="stars"></div>
                                <div class="stars2"></div>
                                <div class="stars3"></div>
                            </div>
                            <p v-if="activeTab === 'investment'">您还没有任何质押订单</p>
                            <p v-else>您还没有已赎回订单</p>
                        </div>
                        <template v-else>
                            <ul class="tab-how_to position-relative mx-1 wow fadeInUp" role="tablist" :class="`list-${listMode}`">
                                <li v-for="(item, index) in paginatedItems" :key="((currentPage - 1) * itemsPerPage) + index" class="nav-tab-item li-style" role="presentation">
                                    <!-- <li class="br-line has-dot"></li> -->
                                    <div data-bs-toggle="tab" data-bs-target="#step3" class="btn_tab" aria-selected="true" role="tab">
                                        <div :class="`stars-bg stars-bg-${(index % 3) + 1}`">
                                            <div class="stars"></div>
                                            <div class="stars2"></div>
                                            <div class="stars3"></div>
                                        </div>
                                        <div class="card-content">
                                            <div style="display: flex; flex-direction: row; justify-content: space-between;">
                                                <h5 class="name h5-list-style" :data-text="`CODE-${String(((currentPage - 1) * itemsPerPage) + index + 1).padStart(2, '0')}`">STAKING-CODE-{{ String(((currentPage - 1) * itemsPerPage) + index + 1).padStart(2, '0') }}</h5>
                                                <h5 class="name h5-list-style" :data-text="item.stakeDate">{{ item.stakeDate }}</h5>
                                            </div>
                                            <div style="display: flex; flex-direction: row; justify-content: space-between;">
                                                <p class="desc p-list-style">母金：$ {{ parseFloat(item.principal).toFixed(4) }}</p>
                                                <p class="desc p-list-style">子金：$ {{ parseFloat(item.interest).toFixed(4) }}</p>
                                            </div>

                                            <div class="status-box">
                                                <CountdownTimer :target-timestamp="item.expiryTimestamp" />
                                                <div class="status-box-button">
                                                    <button v-if="item.displayStatus === 'redeemable'" class="tf-btn text-body-3 style-2 animate-btn animate-dark">可赎回</button>
                                                    <button v-else-if="item.displayStatus === 'redeemed'" class="tf-btn text-body-3 style-2 animate-btn animate-dark" disabled>已赎回</button>
                                                    <button v-else class="tf-btn text-body-3 style-2 animate-btn animate-dark" disabled>等待赎回</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div v-if="totalPages > 1" class="pagination-list">
                                <a href="#" class="pagination-item" @click.prevent="prevPage" :class="{ 'disabled': currentPage === 1 }">
                                    <span class="icon icon-CaretDoubleRight fs-20" style="transform: rotate(180deg);"></span>
                                </a>
                                <a v-for="page in displayedPages" :key="page" href="#" class="pagination-item" :class="{ 'active': currentPage === page }" @click.prevent="goToPage(page)">
                                    <span>{{ page }}</span>
                                </a>
                                <a href="#" class="pagination-item" @click.prevent="nextPage" :class="{ 'disabled': currentPage === totalPages }">
                                    <span class="icon icon-CaretDoubleRight fs-20"></span>
                                </a>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="position-relative has-hafl_plus">
                    <span class="hafl-plus pst-left_bot item_bot wow bounceInScale"></span>
                    <span class="hafl-plus pst-right_bot item_bot wow bounceInScale"></span>
                </div>
            </div>
        </div>
        <span class="br-line"></span>
        <!-- == Bottom Section -->
        <div class="sect-bottom">
            <div class="container">
                <div class="box-hacker has-overlay_linear mx-1">
                    <p class="hacker-text text-caption font-2 text-uppercase hackerText">
                        qW8bL2nRM4ZpYk5gJfXvCt1uHdEo93NTaVxBYmOe7rPQnKDlcUs0AjzhFiGSwLXtRpUo6NMJvqa7bT2EfyCdx9KWZhgL1nFMR3YUJ5toepXAGvqBzNcdwskLm4iT7OPuVHxayJZErm5QbgCnX1UL2D9ptYfOEK0sWhRAgJmzliNu67BXFoQYPCHtvnwMJeaZKRxdo3TfLUGqc48sbE9NYpJAgmWTVrhXxLFo517zkidC3
                    </p>
                </div>
            </div>
        </div>
        <span class="br-line"></span>
    </section>
</template>
<script setup>
import {
  ref,
  computed,
  watch
} from 'vue';
import {
  walletState
} from '../services/wallet';
import {
  getUserStakingData
} from '../services/contracts';
import CountdownTimer from './CountdownTimer.vue';

const allStakingItems = ref([]);
const isLoading = ref(true);
const activeTab = ref('investment'); // 'investment' or 'redemption'
const currentPage = ref(1);
const itemsPerPage = ref(4); // 3 items per page as per current UI
const listMode = ref('show'); // 'show' or 'hide' for transitions

const fetchStakingData = async () => {
  console.log('[订单列表-检查] fetchStakingData 被调用。认证状态:', walletState.isAuthenticated, '合约初始化状态:', walletState.contractsInitialized);
  // Now we check both authentication and contract initialization
  if (!walletState.isAuthenticated || !walletState.contractsInitialized) {
    allStakingItems.value = [];
    isLoading.value = false;
    return;
  }
  isLoading.value = true;
  try {
    console.log('[订单列表-检查] 条件满足，准备调用 getUserStakingData...');
    allStakingItems.value = await getUserStakingData();
  } finally {
    isLoading.value = false;
  }
};

watch(() => [walletState.isAuthenticated, walletState.address, walletState.contractsInitialized], ([isAuth, address, contractsReady]) => {
  console.log(`[订单列表-检查] 监听到状态变化 -> isAuth: ${isAuth}, address: ${address}, contractsReady: ${contractsReady}`);
  // Only fetch data when both authenticated and contracts are ready
  if (isAuth && contractsReady) {
    fetchStakingData();
  } else {
    // Clear data if user disconnects or contracts fail
    allStakingItems.value = [];
    isLoading.value = false;
    activeTab.value = 'investment'; // Reset tab on disconnect
    currentPage.value = 1;
  }
}, {
  immediate: true
});

const toggleTab = () => {
  listMode.value = 'hide'; // Start fade out animation
  setTimeout(() => {
    activeTab.value = activeTab.value === 'investment' ? 'redemption' : 'investment';
    currentPage.value = 1; // Reset to first page on tab switch
    listMode.value = 'show'; // Start fade in animation
  }, 150); // This duration should match the CSS transition duration
};


const filteredItems = computed(() => {
  if (activeTab.value === 'investment') {
    // Investment list shows non-redeemed items
    return allStakingItems.value.filter(item => item.displayStatus !== 'redeemed');
  } else { // redemption list
    // Redemption list shows redeemed items
    return allStakingItems.value.filter(item => item.displayStatus === 'redeemed');
  }
});

// Calculate total pages based on the filtered list
const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage.value));

// Create a computed property for the items on the current page from the filtered list
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredItems.value.slice(start, end);
});

// Methods to change the page
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const displayedPages = computed(() => {
  const maxDisplayed = 5;
  const pages = [];

  if (totalPages.value <= maxDisplayed) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    let startPage;
    let endPage;

    if (currentPage.value <= 3) {
      // At the beginning
      startPage = 1;
      endPage = maxDisplayed;
    } else if (currentPage.value >= totalPages.value - 2) {
      // At the end
      startPage = totalPages.value - maxDisplayed + 1;
      endPage = totalPages.value;
    } else {
      // In the middle
      startPage = currentPage.value - 2;
      endPage = currentPage.value + 2;
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  }
  return pages;
});
</script>
<style scoped>

.tab-how_to,
.empty-state,
.loading-state {
  transition: opacity 0.15s ease-in-out;
}
.list-hide {
  opacity: 0;
}
.list-show {
  opacity: 1;
}

.tabs-container {
    display: flex;
    margin-bottom: 20px;
    justify-content: center; /* Center the button */
}

.toggle-button {
    /* Base styles from .btn-ip */
    background: var(--primary-gradient);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 10px 20px;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 280px; /* Shorten the width */
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: relative;
}

.toggle-button .tab-text {
    transition: all 0.3s ease;
}

.toggle-button:hover {
    box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.5);
}

.toggle-button:hover .tab-text {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}

.tab-text {
    flex-grow: 1;
    text-align: center;
    color: rgba(255, 255, 255, 0.7); /* Dim inactive tabs */
    transition: all 0.3s ease;
}

.tab-text.active {
    color: #fff;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}

.tab-divider {
    width: 1px;
    height: 20px; /* Adjust height as needed */
    background: linear-gradient(to bottom, transparent, #fff, transparent);
    opacity: 0.5;
}


.empty-state,
.loading-state {
  /* Replicating the style of .btn_tab for consistency */
  background: rgba(20, 20, 21, 0.5);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 50px 20px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  text-align: center;
  color: #fff;
  position: relative;
  overflow: hidden;
  /* Adjust font size or other properties as needed */
}

.empty-state p,
.loading-state p {
    position: relative;
    z-index: 2;
}


.order-list {
    margin-top: 30px; 
    color: #fff;
}

.status-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.tf-btn.style-2 {
    background-color: #161c416b;
    width: 100px;
}

.tf-btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-item.active {
  background-color: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.pagination-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.img-position {
    margin-top: 30px;
}

.title-position {
    padding-top: 0px;
}

.pagination-list {
    margin-top: 50px;
    display: flex;
    justify-content: center; /* Align to the center */
    align-items: center; /* Vertically align items */
}

.benefit-gif-2 {
    transform: scale(1.5);
}

.gif-place-2 {
    padding-top: 0px !important;
    margin-bottom: 30px !important;
}

.tab-how_to .nav-tab-item .btn_tab {
    background: rgba(20, 20, 21, 0.5);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 16px;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    transition: all .3s ease;
    position: relative;
    overflow: hidden;
}

/* .tab-how_to .nav-tab-item .btn_tab:hover {
    border-color: #1d2d97a8;
    transform: translateY(-5px);
} */

.tab-how_to .nav-tab-item .btn_tab .number-step {
    margin-bottom: 8px;
}

.tab-how_to .nav-tab-item .btn_tab .name {
    margin-bottom: 16px;
}

.tab-how_to .nav-tab-item .btn_tab .desc {
    margin-bottom: 6px;
}

.tab-how_to .nav-tab-item .btn_tab .desc:last-of-type {
    margin-bottom: 0;
}

.tab-how_to .nav-tab-item .btn_tab .status-box {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #ffffff2d;
}

.li-style {
    margin-bottom: 20px !important;
}

.h5-list-style {
    margin-bottom: 0px !important;
    font-size: 12px;
}

.tab-how_to .btn_tab {
    gap: 0px !important;
}

.p-list-style {
    font-size: 16px;
}

/* Starry background effect */
.stars-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
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
  animation: animStar 20s linear infinite;
  box-shadow: 123px 45px #FFF, 255px 189px #FFF, 345px 8px #FFF, 99px 345px #FFF, 487px 233px #FFF, 321px 487px #FFF, 499px 10px #FFF, 23px 187px #FFF, 176px 455px #FFF, 433px 321px #FFF, 45px 23px #FFF, 231px 480px #FFF, 467px 98px #FFF, 33px 256px #FFF, 198px 321px #FFF, 349px 465px #FFF, 480px 12px #FFF, 12px 190px #FFF, 256px 432px #FFF, 490px 211px #FFF, 54px 49px #FFF, 289px 344px #FFF, 411px 189px #FFF, 76px 287px #FFF, 201px 477px #FFF, 389px 23px #FFF, 477px 376px #FFF, 156px 143px #FFF, 301px 499px #FFF, 432px 65px #FFF;
}

.stars2 {
  width: 2px;
  height: 2px;
  animation: animStar 40s linear infinite;
  box-shadow: 234px 123px #FFF, 456px 345px #FFF, 12px 487px #FFF, 498px 65px #FFF, 213px 289px #FFF, 45px 456px #FFF, 345px 98px #FFF, 187px 399px #FFF, 432px 187px #FFF, 88px 88px #FFF, 287px 465px #FFF, 478px 243px #FFF, 143px 32px #FFF, 365px 398px #FFF, 499px 488px #FFF;
}

.stars3 {
  width: 3px;
  height: 3px;
  animation: animStar 60s linear infinite;
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

.card-content {
  position: relative;
  z-index: 1;
}

/* Unique animation delays for each card */
.stars-bg-2 .stars { animation-delay: -5s; }
.stars-bg-2 .stars2 { animation-delay: -10s; }
.stars-bg-2 .stars3 { animation-delay: -15s; }

.stars-bg-3 .stars { animation-delay: -10s; }
.stars-bg-3 .stars2 { animation-delay: -20s; }
.stars-bg-3 .stars3 { animation-delay: -30s; }

.pagination-list .pagination-item {
    width: 36px;
    height: 36px;
    line-height: 36px;
}

</style>


