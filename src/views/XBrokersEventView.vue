<template>
    <section class="section-cta">
        <!-- == Head Section -->
        <div class="sect-header">
            <div class="container">
                <div class="s-meta text-caption font-2">
                    <p class="s-number_order wg-counter">
                        <router-link to="/" style="text-decoration: none; color: inherit;">
                        [ <span class="text-white">返回Athena首页<span class="odometer" data-number=""></span></span> ]
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
        <span class="br-line"></span>
        <!-- == Tagline Section
        <div class="sect-tagline">
            <div class="container">
                <div class="sect-tagline_inner">
                    <span class="hafl-plus pst-left_bot wow bounceInScale"></span>
                    <span class="hafl-plus pst-right_bot wow bounceInScale"></span>
                    <h6 class="s-name text-caption font-2">
                        <span class="bar-group type-left">
                            <span class="bar_center"></span>
                        </span>
                        <span class="hacker-text_transform no-delay">
                            Let the synchronization begin
                        </span>
                        <span class="bar-group type-right">
                            <span class="bar_center"></span>
                        </span>
                    </h6>
                </div>
            </div>
        </div>
        <span class="br-line"></span> -->
        <!-- == Main Section -->
        <div class="sect-main position-relative">
            <div class="s-img_item">
                <img class="lazyload" src="/asset/images/section/color-bg-2.webp"
                    data-src="/asset/images/section/color-bg-2.webp" alt="BG">
            </div>
            <div class="container">
                <div class="sect-title wow fadeInUp">
                    <h2 class="s-title font-3" style="color: #fff;">
                        Athena & xBrokers <br>
                        官方生态战略合作
                    </h2>
                    <p class="s-sub_title" style="color: #fff;">
                        通过Athena渠道投资 <br>
                        获取4倍xBrokers算力收益
                    </p>
                </div>
                <div name="buyJUchain">
                    <div v-if="walletState.isConnected && walletState.network === 'JuChain'">
                        <!-- Loading State -->
                        <div v-if="isLoadingUid" class="uid-form">
                            <p>正在检查UID绑定状态...</p>
                        </div>

                        <!-- UID Not Bound Form -->
                        <div v-else-if="!isUidBound" class="uid-form form-ask">
                            <h4 class="s-title" style="text-align: center; margin-bottom: 10px;">绑定您的交易所UID</h4>
                            <p style="color: #a9c2e2; font-size: 14px; margin-bottom: 20px; text-align: center;">首次投资前，需将钱包地址与交易所UID绑定</p>
                            <div class="form-group">
                                <label for="uidInput" class="form-label">请输入您的UID</label>
                                <input id="uidInput" type="text" v-model="inputUid" class="form-input" placeholder="例如: 1001">
                            </div>
                            <button @click="handleBindUid" :disabled="isBinding" class="btn-ip btn-confirm" style="width:100%">
                                {{ isBinding ? '正在绑定...' : '确认绑定' }}
                            </button>
                        </div>

                        <!-- UID Bound Form (Investment) -->
                        <div v-else class="uid-form form-ask">
                            <h4 class="s-title" style="text-align: center; margin-bottom: 20px;">投资xBrokers算力</h4>
                            <div class="form-group">
                                <label class="form-label">您已绑定的交易所UID</label>
                                <input type="text" :value="boundUid" class="form-input" disabled>
                            </div>
                            <div class="form-group">
                                <label for="amountInput" class="form-label">请输入投资数量 (USDT-JU)</label>
                                <div class="amount-input-container">
                                    <input id="amountInput" type="text" :value="investmentAmount" @input="handleAmountInput" class="form-input" placeholder="例如: 100">
                                    <button @click="fillMax" class="max-btn" v-html="maxButtonText"></button>
                                </div>
                            </div>
                            <button @click="handleInvest" :disabled="isProcessing" class="btn-ip btn-confirm" style="width:100%">
                                {{ actionButtonText }}
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row" style="margin-bottom: 30px;">
                    <div class="col-11 col-md-8 col-xl-4 mx-auto">
                        <p class="form-note text-center">
                            xBrokers · 全球化金融服务平台<br/>自由、透明、高效化资本流动
                        </p>
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
                <div class="box-hacker has-overlay_linear">
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
import { watch, ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { walletState } from '@/services/wallet';
import { 
  initializeJuChainContracts, 
  getUsdtJuBalance,
  getBoundUid,
  bindUid,
  getUsdtJuAllowance,
  approveUsdtJu,
  purchasePower
} from '@/services/juchainContracts';
import AnimatedNumber from '@/components/AnimatedNumber.vue';
import { showToast } from '@/services/notification';
import { t } from '@/i18n';

const usdtJuBalance = ref(0);
const isLoadingBalance = ref(true);
const isLoadingUid = ref(true);
const isBinding = ref(false);
const isProcessing = ref(false); // For approve/deposit actions

const boundUid = ref("0");
const inputUid = ref("");
const investmentAmount = ref("");
const allowance = ref("0");
const athenaStakedAmount = ref(0);

const isUidBound = computed(() => boundUid.value !== "0");
const needsAllowance = computed(() => {
  const amount = parseFloat(investmentAmount.value) || 0;
  const currentAllowance = parseFloat(allowance.value) || 0;
  // An allowance of less than the requested amount is considered insufficient.
  return amount > 0 && currentAllowance < amount;
});

const actionButtonText = computed(() => {
  if (isProcessing.value) return "处理中...";
  if (needsAllowance.value) return "授权USDT";
  
  const amount = parseFloat(investmentAmount.value);
  if (!isNaN(amount) && amount > 0) {
    const estimatedPower = amount * 4;
    return `确定投资 (约${estimatedPower.toLocaleString()}T)`;
  }
  
  return "确定投资";
});

const maxButtonText = computed(() => {
  const balance = usdtJuBalance.value.toFixed(2);
  return `MAX<br><span class="balance-amount">${balance}</span>`;
});

const checkAllowance = async () => {
  if (walletState.isConnected && walletState.network === 'JuChain') {
    allowance.value = await getUsdtJuAllowance();
  }
};

const checkUidBinding = async () => {
  if (walletState.isConnected && walletState.network === 'JuChain') {
    isLoadingUid.value = true;
    try {
      const uid = await getBoundUid();
      boundUid.value = uid;
    } finally {
      isLoadingUid.value = false;
    }
  }
};

const fetchBalance = async () => {
  if (walletState.isConnected && walletState.network === 'JuChain') {
    isLoadingBalance.value = true;
    const balance = await getUsdtJuBalance();
    usdtJuBalance.value = parseFloat(balance);
    isLoadingBalance.value = false;
  }
};

const fetchAllData = async () => {
  if (walletState.isConnected && walletState.network === 'JuChain') {
    initializeJuChainContracts();
    await Promise.all([
      fetchBalance(),
      checkUidBinding(),
      checkAllowance()
    ]);
  }
};

const handleBindUid = async () => {
  if (!inputUid.value || isNaN(Number(inputUid.value)) || Number(inputUid.value) <= 0) {
    showToast("请输入有效的用户UID");
    return;
  }
  isBinding.value = true;
  try {
    const tx = await bindUid(inputUid.value);
    showToast("交易已发送，等待确认...");
    await tx.wait();
    showToast("UID 绑定成功！");
    await checkUidBinding(); // Re-check to update UI
  } catch (error) {
    console.error("User action failed:", error);
    // Suppress toast notification if the user deliberately cancelled the transaction.
    if (error.code !== 'ACTION_REJECTED' && error.code !== 4001) {
      showToast(error.reason || "UID 绑定失败");
    }
  } finally {
    isBinding.value = false;
  }
};

const handleAmountInput = (event) => {
  let value = event.target.value;
  // Remove any non-numeric characters except for a single decimal point
  value = value.replace(/[^0-9.]/g, '');
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }
  investmentAmount.value = value;
};

const fillMax = () => {
  // Use the fetched USDT-JU balance
  investmentAmount.value = usdtJuBalance.value.toString();
};

const handleInvest = async () => {
  // **[NEW] Staking requirement check**
  if (athenaStakedAmount.value < 1000) {
    showToast("需在Athena中质押1000TOKEN");
    return;
  }

  const amount = parseFloat(investmentAmount.value);
  if (isNaN(amount) || amount <= 0) {
    showToast("请输入有效的投资金额");
    return;
  }

  // **[FIX 1] Balance Check**
  const userBalance = parseFloat(usdtJuBalance.value);
  if (amount > userBalance) {
    showToast("USDT-JU 余额不足");
    return;
  }
  
  isProcessing.value = true;
  try {
    if (needsAllowance.value) {
      // --- Approve Logic (now infinite) ---
      showToast("需要授权，请在钱包中确认...");
      const tx = await approveUsdtJu();
      showToast("交易已发送，等待授权确认...");
      await tx.wait();
      showToast("授权成功！");
      await checkAllowance(); // Re-check allowance after approval
    } else {
      // --- Deposit Logic ---
      showToast("正在发起投资，请在钱包中确认...");
      const tx = await purchasePower(investmentAmount.value);
      showToast("交易已发送，等待投资确认...");
      await tx.wait();
      showToast(t('toast.investmentSubmitted'), 5000);
      // Optionally, refresh balance or clear input after success
      await fetchBalance();
      investmentAmount.value = "";
    }
  } catch (error) {
    console.error("User action failed:", error);
    // Suppress toast notification if the user deliberately cancelled the transaction.
    if (error.code !== 'ACTION_REJECTED' && error.code !== 4001) {
      showToast(error.reason || "操作失败");
    }
  } finally {
    isProcessing.value = false;
  }
};

onMounted(() => {
  const route = useRoute();
  const staked = parseFloat(route.query.staked) || 0;
  athenaStakedAmount.value = staked;
  console.log(`Received staked amount from Athena: ${staked}`);
});

watch(() => walletState.network, (newNetwork) => {
  if (newNetwork) {
    console.log('当前连接的网络是:', newNetwork);
    if (newNetwork === 'JuChain') {
      fetchAllData();
    }
  }
}, { immediate: true });

watch(() => walletState.address, (newAddress) => {
  if (newAddress && walletState.network === 'JuChain') {
    fetchAllData();
  }
});

watch(investmentAmount, () => {
  // This watcher is not strictly necessary for logic, but can be useful
  // for real-time validation feedback in the future.
  // For now, it implicitly triggers the `needsAllowance` computed property re-evaluation.
});
</script>
<script>
export default {
    name: 'XBrokersEventView',
    components: {
        AnimatedNumber
    }
}
</script>
<style scoped>
.balance-display {
  color: #fff;
  text-align: center;
  margin: 40px 0;
}
.balance-value {
  font-size: 28px;
  font-weight: bold;
  margin-top: 10px;
}
.balance-label {
  font-size: 16px;
  color: #a9c2e2;
}

/* Reusing and adapting styles from the homepage and modals */
.form-ask {
  background-color: var(--bg-2);
  padding: 30px;
  border-radius: 12px;
  border: 1px solid var(--line);
  max-width: 420px;
  margin: 60px auto;
  color: #fff;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-2);
  font-size: 14px;
  text-align: left;
}

.form-input {
  width: 100%;
  padding: 15px 20px;
  background-color: #0c0c0e;
  border: 1px solid var(--line);
  border-radius: 12px;
  color: var(--white);
  font-size: 16px;
  box-sizing: border-box; /* Ensure padding and border are included in the height */
}

.form-input:disabled {
  background-color: rgba(0, 0, 0, 0.4);
  cursor: not-allowed;
  opacity: 0.7;
}

.amount-input-container {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.amount-input-container .form-group {
  flex-grow: 1;
  margin-bottom: 0; /* Remove margin from inner group */
}

.max-btn {
  background: none;
  border: 1px solid var(--line);
  color: var(--text-2);
  padding: 5px 15px;
  border-radius: 12px;
  cursor: pointer;
  height: 54px; /* Match input height */
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.2;
  font-size: 14px;
  box-sizing: border-box; /* Ensure padding and border are included in the height */
}

.max-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.btn-ip {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    background: linear-gradient(0deg, rgba(20, 20, 21, 0.82), rgba(20, 20, 21, 0.82)),
        linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%);
    border: 1px solid var(--line);
    box-shadow: 0px 1px 1px 0px #FFFFFF2E inset, 0px 0px 4px 0px #FFFFFF0F inset, 0px 0px 8px 0px #FFFFFF14 inset, 0px 0px 16px 0px #FFFFFF1F inset;
    padding: 12px;
    border-radius: 999px;
    transition: all .3s ease;
    color: var(--text-2);
    text-decoration: none;
    cursor: pointer;
}

.btn-ip:hover {
    color: var(--primary);
    border-color: var(--primary);
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

.btn-ip:disabled {
  background: #2c3a75;
  border-color: #2c3a75;
  color: #a9c2e2;
  cursor: wait;
  opacity: 0.6;
}

div[name="buyJUchain"] {
  padding: 0 20px;
}
</style>
