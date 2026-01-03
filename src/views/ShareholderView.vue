<template>
  <div>
    <!-- Page Title -->
    <div class="section-page-title">
      <div class="sect-tagline">
        <div class="container">
          <div class="sect-tagline_inner">
            <span class="hafl-plus pst-left_bot wow bounceInScale"></span>
            <span class="hafl-plus pst-right_bot wow bounceInScale"></span>
            <div class="s-name text-caption font-2">
              <span class="bar-group type-left">
                <span class="bar_center"></span>
              </span>
              <div class="breadcrumbs-list">
                <span></span>
                <span class="hacker-text_transform no-delay current-page">
                  SHAREHOLDER
                </span>
              </div>
              <span class="bar-group type-right">
                <span class="bar_center"></span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <span class="br-line"></span>
    </div>
    <!-- /Page Title -->
    
    <section class="flat-spacing-3" style="padding-top: 10px; padding-bottom: 10px;">
      <div class="container" style="padding: 0 30px;">
        <!-- 3.1 Core Data Display -->
        
        <div class="row mb-3">
            <!-- Total Liquidity -->
            <div class="col-md-3 col-6 mb-3">
                <div class="stat-card">
                    <h5 class="text-white-50 font-2 mb-2 fs-small">{{ t('banker.tvl') }}</h5>
                    <h3 class="text-white font-3 fs-medium">{{ formatNumber(bankerData.tvl) }} ATH</h3>
                </div>
            </div>
             <!-- My Principal -->
            <div class="col-md-3 col-6 mb-3">
                <div class="stat-card">
                    <h5 class="text-white-50 font-2 mb-2 fs-small">{{ t('banker.myPrincipal') }}</h5>
                    <h3 class="text-white font-3 fs-medium">{{ formatNumber(bankerData.invested) }} ATH</h3>
                </div>
            </div>
            <!-- Current Position Value -->
            <div class="col-md-3 col-6 mb-3">
                <div class="stat-card">
                    <h5 class="text-white-50 font-2 mb-2 fs-small">{{ t('banker.currentValue') }}</h5>
                    <h3 class="text-white font-3 fs-medium">{{ formatNumber(bankerData.value) }} ATH</h3>
                    <div class="small mt-1 fs-extra-small" :class="bankerData.pnl >= 0 ? 'text-success' : 'text-danger'">
                         PnL: {{ bankerData.pnl >= 0 ? '+' : '' }}{{ formatNumber(bankerData.pnl) }} ATH
                    </div>
                </div>
            </div>
             <!-- Current Net Value -->
            <div class="col-md-3 col-6 mb-3">
                <div class="stat-card">
                    <h5 class="text-white-50 font-2 mb-2 fs-small">{{ t('banker.sharePrice') }}</h5>
                    <h3 class="text-white font-3 fs-medium">{{ formatNumber(bankerData.sharePrice) }} ATH</h3>
                    <div class="small mt-1 fs-extra-small text-white-50">
                        {{ t('banker.myShares') }}: {{ formatNumber(bankerData.shares) }}
                    </div>
                </div>
            </div>
            <!-- Pending Reward -->
            <div class="col-12 mb-3">
                <div class="stat-card d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div>
                        <h5 class="text-white-50 font-2 mb-1 fs-small">{{ t('banker.pendingDividend') }}</h5>
                        <h3 class="text-white font-3 fs-medium mb-0">{{ formatNumber(bankerData.pending) }} ATH</h3>
                    </div>
                    <div style="min-width: 120px;">
                        <button class="tf-btn w-100 py-2 px-3 fs-small" @click="handleHarvest" :disabled="loading || bankerData.pending <= 0">
                            {{ loading ? t('banker.processing') : t('banker.harvest') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 3.2 Interactions (Tabs) -->
        <div class="row justify-content-center">
            <div class="col-lg-8 col-md-10">
                <div class="action-card">
                    <!-- Tabs Header -->
                    <div class="d-flex border-bottom border-secondary mb-4">
                        <button 
                            class="tab-btn flex-fill pb-3 font-2 fs-medium" 
                            :class="{ active: activeTab === 'deposit' }"
                            @click="activeTab = 'deposit'"
                        >
                            {{ t('banker.depositTitle') }}
                        </button>
                        <button 
                            class="tab-btn flex-fill pb-3 font-2 fs-medium" 
                            :class="{ active: activeTab === 'withdraw' }"
                            @click="activeTab = 'withdraw'"
                        >
                            {{ t('banker.withdrawTitle') }}
                        </button>
                    </div>

                    <!-- Deposit Content -->
                    <div v-if="activeTab === 'deposit'">
                        <p class="text-white-50 mb-4 fs-small text-center">
                            {{ t('banker.depositDesc') }}
                            <br>
                            <small class="text-warning d-block mt-2">{{ t('banker.lockWarning', { duration: formatDuration(bankerData.lockPeriod) }) }}</small>
                        </p>
                        
                        <div class="form-group mb-4">
                            <label class="text-white mb-2 fs-small">{{ t('banker.amountLabel') }}</label>
                            <div class="input-container d-flex align-items-center">
                                <input type="number" v-model="depositAmount" class="form-control custom-input" placeholder="0.0">
                                <button class="max-btn" type="button" @click="setMaxDeposit">MAX</button>
                            </div>
                            <small class="text-white-50 fs-extra-small mt-1 d-block">{{ t('banker.balanceLabel', { amount: formatNumber(athBalance) }) }}</small>
                        </div>

                        <div class="d-flex gap-3">
                            <button v-if="!isApproved" class="tf-btn w-100" @click="handleApprove" :disabled="loading">
                                {{ loading ? t('banker.approving') : t('banker.approve') }}
                            </button>
                            <button v-else class="tf-btn w-100" @click="handleDeposit" :disabled="loading || !depositAmount">
                                {{ loading ? t('banker.depositing') : t('banker.deposit') }}
                            </button>
                        </div>
                    </div>

                    <!-- Withdraw Content -->
                    <div v-if="activeTab === 'withdraw'">
                        <p class="text-white-50 mb-4 fs-small text-center">
                            {{ t('banker.withdrawDesc') }}
                        </p>
                        
                        <div v-if="isLocked" class="alert alert-warning mb-3 fs-small">
                            <i class="icon icon-Lock"></i> {{ t('banker.lockedStatus', { time: lockCountdown }) }}
                        </div>

                        <div class="form-group mb-4">
                            <label class="text-white mb-2 fs-small">{{ t('banker.withdrawSharesLabel') }}</label>
                            <div class="input-container d-flex align-items-center">
                                <input type="number" v-model="withdrawShares" class="form-control custom-input" placeholder="0.0">
                                <button class="max-btn" type="button" @click="setMaxWithdraw">MAX</button>
                            </div>
                            <small class="text-white-50 fs-extra-small mt-1 d-block">{{ t('banker.availableShares', { amount: formatNumber(bankerData.shares) }) }}</small>
                        </div>

                        <button class="tf-btn w-100" @click="handleWithdraw" :disabled="loading || isLocked || !withdrawShares">
                            {{ loading ? t('banker.withdrawing') : t('banker.withdraw') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- FAQ -->
         <div class="row mt-5">
            <div class="col-12">
                <h4 class="text-white font-3 mb-4">{{ t('banker.faqTitle') }}</h4>
                 <div class="accordion" id="bankerFaq">
                    <div class="card bg-transparent border-secondary mb-3">
                        <div class="card-header" id="headingOne">
                            <h5 class="mb-0">
                                <button class="btn btn-link text-white text-decoration-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                                    {{ t('banker.faq1Question') }}
                                </button>
                            </h5>
                        </div>
                        <div id="collapseOne" class="collapse show" data-bs-parent="#bankerFaq">
                            <div class="card-body text-white-50">
                                {{ t('banker.faq1Answer') }}
                            </div>
                        </div>
                    </div>
                    <div class="card bg-transparent border-secondary">
                        <div class="card-header" id="headingTwo">
                            <h5 class="mb-0">
                                <button class="btn btn-link text-white text-decoration-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                                    {{ t('banker.faq2Question') }}
                                </button>
                            </h5>
                        </div>
                        <div id="collapseTwo" class="collapse" data-bs-parent="#bankerFaq">
                            <div class="card-body text-white-50">
                                {{ t('banker.faq2Answer') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>

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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import HomeRightSidebar from '../components/HomeRightSidebar.vue';
import { walletState } from '../services/wallet';
import { 
    getBankerData, 
    approveAthForBanker, 
    getAthAllowanceForBanker, 
    depositBanker, 
    withdrawBanker, 
    harvestBanker 
} from '../services/banker';
import { contractAddresses } from '../services/contracts'; // Use generic ath balance from somewhere or fetch it specifically
import { athContract } from '../services/contracts';
import { ethers } from 'ethers';
import { t } from '../i18n';

export default {
  name: 'ShareholderView',
  components: {
    HomeRightSidebar
  },
  setup() {
    const loading = ref(false);
    const bankerData = ref({
        invested: 0,
        shares: 0,
        sharePrice: 1,
        pending: 0,
        tvl: 0,
        value: 0,
        pnl: 0,
        lockPeriod: 0,
        lastDepositTime: 0
    });
    const athBalance = ref('0');
    const depositAmount = ref('');
    const withdrawShares = ref('');
    const allowance = ref('0');
    
    // Sidebar State
    const isSidebarOpen = ref(false);
    
    const openSidebar = () => {
        isSidebarOpen.value = true;
    };
    
    const closeSidebar = () => {
        isSidebarOpen.value = false;
    };

    // Countdown logic
    const now = ref(Math.floor(Date.now() / 1000));
    let timer = null;

    const isLocked = computed(() => {
        const unlockTime = bankerData.value.lastDepositTime + bankerData.value.lockPeriod;
        return now.value < unlockTime;
    });

    const lockCountdown = computed(() => {
        const unlockTime = bankerData.value.lastDepositTime + bankerData.value.lockPeriod;
        const diff = unlockTime - now.value;
        if (diff <= 0) return '0日0时0分0秒';
        
        const d = Math.floor(diff / 86400);
        const h = Math.floor((diff % 86400) / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        return `${d}日${h}时${m}分${s}秒`;
    });
    
    const isApproved = computed(() => {
        if (!depositAmount.value) return parseFloat(allowance.value) > 0;
        return parseFloat(allowance.value) >= parseFloat(depositAmount.value);
    });

    const activeTab = ref('deposit');

    const loadData = async () => {
        console.log('[ShareholderView] loadData called. isConnected:', walletState.isConnected);
        if (!walletState.isConnected) return;
        
        const data = await getBankerData();
        if (data) bankerData.value = data;
        
        allowance.value = await getAthAllowanceForBanker();
        
        if (athContract && walletState.address) {
            const bal = await athContract.balanceOf(walletState.address);
            athBalance.value = ethers.formatUnits(bal, 18);
        }
    };

    // Watch for wallet connection status changes
    watch(() => walletState.isConnected, (newVal) => {
        if (newVal) {
            loadData();
        } else {
             // Reset data if disconnected
             bankerData.value = {
                invested: 0,
                shares: 0,
                sharePrice: 1,
                pending: 0,
                tvl: 0,
                value: 0,
                pnl: 0,
                lockPeriod: 0,
                lastDepositTime: 0
            };
            athBalance.value = '0';
            depositAmount.value = '';
            withdrawShares.value = '';
            allowance.value = '0';
        }
    });

    onMounted(() => {
        loadData();
        timer = setInterval(() => {
            now.value = Math.floor(Date.now() / 1000);
        }, 1000);
    });

    onUnmounted(() => {
        if (timer) clearInterval(timer);
    });

    const handleApprove = async () => {
        loading.value = true;
        const success = await approveAthForBanker();
        if (success) await loadData();
        loading.value = false;
    };

    const handleDeposit = async () => {
        loading.value = true;
        const success = await depositBanker(depositAmount.value);
        if (success) {
            depositAmount.value = '';
            await loadData();
        }
        loading.value = false;
    };

    const handleWithdraw = async () => {
        loading.value = true;
        const success = await withdrawBanker(withdrawShares.value);
        if (success) {
            withdrawShares.value = '';
            await loadData();
        }
        loading.value = false;
    };

    const handleHarvest = async () => {
        loading.value = true;
        const success = await harvestBanker();
        if (success) await loadData();
        loading.value = false;
    };

    const setMaxDeposit = () => {
        depositAmount.value = athBalance.value;
    };

    const setMaxWithdraw = () => {
        withdrawShares.value = bankerData.value.shares;
    };
    
    const formatNumber = (val) => {
        if (val === undefined || val === null || val === '') return '0.0000';
        let str = val.toString();
        
        // Check for valid number
        if (isNaN(parseFloat(str))) return '0.0000';
        
        // Handle scientific notation
        if (str.includes('e') || str.includes('E')) {
            str = parseFloat(val).toFixed(20);
        }

        const parts = str.split('.');
        if (parts.length === 1) {
             return parts[0] + '.0000';
        }
        
        return parts[0] + '.' + parts[1].substring(0, 4).padEnd(4, '0');
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '0日0时0分0秒';
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${d}日${h}时${m}分${s}秒`;
    };

    return {
        bankerData,
        athBalance,
        depositAmount,
        withdrawShares,
        isApproved,
        loading,
        isLocked,
        lockCountdown,
        handleApprove,
        handleDeposit,
        handleWithdraw,
        handleHarvest,
        setMaxDeposit,
        setMaxWithdraw,
        formatNumber,
        formatDuration,
        activeTab,
        t,
        isSidebarOpen,
        openSidebar,
        closeSidebar
    };
  }
};
</script>

<style scoped>
.stat-card {
    background: transparent;
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 15px;
    height: 100%;
}

.action-card {
    background: transparent;
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 30px;
    height: 100%;
}

.text-highlight {
    color: #ffd700;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.btn-action {
    background: transparent;
    color: var(--white);
    border: 1px solid var(--line);
    padding: 8px 20px;
    border-radius: 4px;
    font-weight: 600;
    transition: all 0.3s ease;
    cursor: pointer;
}

.btn-action:hover:not(:disabled) {
    background: var(--line);
    border-color: var(--line);
}

.btn-action:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.tf-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 32px;
    background: var(--white);
    color: var(--black);
    border-radius: 4px;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    font-family: 'DepartureMono', sans-serif;
}

.tf-btn:hover:not(:disabled) {
    background: var(--line);
    color: var(--white);
}

.tf-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.input-group .form-control {
    background: transparent;
    border-color: var(--line);
    color: var(--white);
    border-right: none;
    border-radius: 4px 0 0 4px;
}

.input-group .form-control:focus {
    box-shadow: none;
    border-color: var(--line);
}

.input-group .btn-outline-secondary {
    border-color: var(--line);
    color: var(--text-2);
    border-left: none;
    border-radius: 0 4px 4px 0;
}

.input-group .btn-outline-secondary:hover {
    background: transparent;
    color: var(--white);
    border-color: var(--line);
}

.text-success { color: #22c55e !important; }
.text-danger { color: #ef4444 !important; }

/* Input Container Styling */
.input-container {
    background: transparent;
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 0 12px;
    transition: border-color 0.3s ease;
}

.input-container:focus-within {
    border-color: var(--white);
}

.custom-input {
    background: transparent !important;
    border: none !important;
    color: var(--white) !important;
    padding: 12px 0;
    box-shadow: none !important;
    width: 100%;
}

.custom-input::placeholder {
    color: var(--text-2);
}

.max-btn {
    background: rgba(255, 255, 255, 0.1);
    color: var(--white);
    border: none;
    border-radius: 4px;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-left: 8px;
    font-family: 'DepartureMono', sans-serif;
}

.max-btn:hover {
    background: var(--white);
    color: var(--black);
}

.tab-btn {
    background: transparent;
    border: none;
    color: var(--text-2);
    cursor: pointer;
    transition: all 0.3s ease;
    border-bottom: 2px solid transparent;
}

.tab-btn:hover {
    color: var(--white);
}

.tab-btn.active {
    color: var(--white);
    border-bottom-color: var(--white);
}

/* Remove old input-group styles that are no longer needed or might conflict */
.input-group .form-control,
.input-group .btn-outline-secondary {
    display: none; 
}

/* Font size adjustments for mobile/responsive */
.fs-small {
    font-size: 14px;
}

.fs-medium {
    font-size: 20px;
}

.fs-extra-small {
    font-size: 12px;
}

/* Specific overrides for very small screens if needed */
@media (max-width: 576px) {
    .fs-small {
        font-size: 12px;
    }
    .fs-medium {
        font-size: 16px;
    }
    .stat-card {
        padding: 16px; /* Reduce padding on mobile */
    }
}
</style>
