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
                <router-link to="/" class="text-white link font-2">
                  HOME
                </router-link>
                <span>/</span>
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
    
    <section class="flat-spacing-3">
      <div class="container">
        <!-- 3.1 Core Data Display -->
        <h2 class="s-title only-title ol-tt-2 font-3 text-linear text-center px-16 mb-5">
          {{ t('banker.dashboard') }}
        </h2>
        
        <div class="row mb-5">
            <!-- Total Liquidity -->
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="stat-card">
                    <h5 class="text-white-50 font-2 mb-2">{{ t('banker.tvl') }}</h5>
                    <h3 class="text-white font-3">{{ formatNumber(bankerData.tvl) }} ATH</h3>
                </div>
            </div>
             <!-- My Principal -->
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="stat-card">
                    <h5 class="text-white-50 font-2 mb-2">{{ t('banker.myPrincipal') }}</h5>
                    <h3 class="text-white font-3">{{ formatNumber(bankerData.invested) }} ATH</h3>
                </div>
            </div>
            <!-- Current Position Value -->
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="stat-card">
                    <h5 class="text-white-50 font-2 mb-2">{{ t('banker.currentValue') }}</h5>
                    <h3 class="text-white font-3">{{ formatNumber(bankerData.value) }} ATH</h3>
                    <div class="small mt-1" :class="bankerData.pnl >= 0 ? 'text-success' : 'text-danger'">
                         PnL: {{ bankerData.pnl >= 0 ? '+' : '' }}{{ formatNumber(bankerData.pnl) }} ATH
                    </div>
                </div>
            </div>
             <!-- Current Net Value -->
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="stat-card">
                    <h5 class="text-white-50 font-2 mb-2">{{ t('banker.sharePrice') }}</h5>
                    <h3 class="text-white font-3">1 Share = {{ formatNumber(bankerData.sharePrice) }} ATH</h3>
                </div>
            </div>
            <!-- Pending Reward -->
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="stat-card">
                    <h5 class="text-white-50 font-2 mb-2">{{ t('banker.pendingDividend') }}</h5>
                    <h3 class="text-highlight font-3">{{ formatNumber(bankerData.pending) }} ATH</h3>
                    <button class="btn-action btn-sm mt-2" @click="handleHarvest" :disabled="loading || bankerData.pending <= 0">
                        {{ loading ? t('banker.processing') : t('banker.harvest') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- 3.2 Interactions -->
        <div class="row">
            <!-- Deposit -->
            <div class="col-lg-6 mb-4">
                <div class="action-card">
                    <h4 class="text-white font-3 mb-4">{{ t('banker.depositTitle') }}</h4>
                    <p class="text-white-50 mb-4">
                        {{ t('banker.depositDesc') }}
                        <br>
                        <small class="text-warning">{{ t('banker.lockWarning', { duration: formatDuration(bankerData.lockPeriod) }) }}</small>
                    </p>
                    
                    <div class="form-group mb-3">
                        <label class="text-white mb-2">{{ t('banker.amountLabel') }}</label>
                        <div class="input-group">
                            <input type="number" v-model="depositAmount" class="form-control" placeholder="0.0">
                            <button class="btn-outline-secondary" type="button" @click="setMaxDeposit">Max</button>
                        </div>
                        <small class="text-white-50">{{ t('banker.balanceLabel', { amount: formatNumber(athBalance) }) }}</small>
                    </div>

                    <div class="d-flex gap-3">
                        <button v-if="!isApproved" class="btn-action w-100" @click="handleApprove" :disabled="loading">
                            {{ loading ? t('banker.approving') : t('banker.approve') }}
                        </button>
                        <button v-else class="btn-action w-100" @click="handleDeposit" :disabled="loading || !depositAmount">
                            {{ loading ? t('banker.depositing') : t('banker.deposit') }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Withdraw -->
            <div class="col-lg-6 mb-4">
                <div class="action-card">
                    <h4 class="text-white font-3 mb-4">{{ t('banker.withdrawTitle') }}</h4>
                    <p class="text-white-50 mb-4">
                        {{ t('banker.withdrawDesc') }}
                    </p>
                    
                     <div v-if="isLocked" class="alert alert-warning mb-3">
                        <i class="icon icon-Lock"></i> {{ t('banker.lockedStatus', { time: lockCountdown }) }}
                    </div>

                    <div class="form-group mb-3">
                        <label class="text-white mb-2">{{ t('banker.withdrawSharesLabel') }}</label>
                        <div class="input-group">
                            <input type="number" v-model="withdrawShares" class="form-control" placeholder="0.0">
                            <button class="btn-outline-secondary" type="button" @click="setMaxWithdraw">Max</button>
                        </div>
                        <small class="text-white-50">{{ t('banker.availableShares', { amount: formatNumber(bankerData.shares) }) }}</small>
                    </div>

                    <button class="btn-action w-100" @click="handleWithdraw" :disabled="loading || isLocked || !withdrawShares">
                        {{ loading ? t('banker.withdrawing') : t('banker.withdraw') }}
                    </button>
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
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
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
        if (diff <= 0) return '00:00:00';
        
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    });
    
    const isApproved = computed(() => {
        if (!depositAmount.value) return parseFloat(allowance.value) > 0;
        return parseFloat(allowance.value) >= parseFloat(depositAmount.value);
    });

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
    
    const formatNumber = (num) => {
        if (!num) return '0.00';
        return parseFloat(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '0s';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
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
        t
    };
  }
};
</script>

<style scoped>
.stat-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 24px;
    height: 100%;
}

.action-card {
    background: #111;
    border: 1px solid #333;
    border-radius: 12px;
    padding: 30px;
    height: 100%;
}

.text-highlight {
    color: #ffd700;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.btn-action {
    background: #333;
    color: #fff;
    border: 1px solid #444;
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-action:hover:not(:disabled) {
    background: #444;
    border-color: #666;
}

.btn-action:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.input-group .form-control {
    background: #222;
    border-color: #444;
    color: #fff;
}

.input-group .btn-outline-secondary {
    border-color: #444;
    color: #aaa;
}
.input-group .btn-outline-secondary:hover {
    background: #333;
    color: #fff;
}

.text-success { color: #22c55e !important; }
.text-danger { color: #ef4444 !important; }
</style>
