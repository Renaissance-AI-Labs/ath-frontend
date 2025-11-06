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
                        <div v-else-if="!isUidBound" class="uid-form">
                            <h4>绑定您的交易所UID</h4>
                            <p style="color: #a9c2e2; font-size: 14px; margin-bottom: 20px;">首次投资前，需要将您的钱包地址与交易所UID进行绑定。</p>
                            <div class="form-group">
                                <label for="uidInput">请输入您的UID</label>
                                <input id="uidInput" type="text" v-model="inputUid" placeholder="例如: 1001">
                            </div>
                            <button @click="handleBindUid" :disabled="isBinding" class="submit-btn">
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
                                <label for="amountInput" class="form-label">请输入投资数量 (JU)</label>
                                <input id="amountInput" type="text" v-model="investmentAmount" class="form-input" placeholder="例如: 1.5">
                            </div>
                            <button @click="handleInvest" class="btn-ip btn-confirm" style="width:100%">
                                确定投资
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row">
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
import { watch, ref, computed } from 'vue';
import { walletState } from '@/services/wallet';
import { 
  initializeJuChainContracts, 
  getUsdtJuBalance,
  getBoundUid,
  bindUid 
} from '@/services/juchainContracts';
import AnimatedNumber from '@/components/AnimatedNumber.vue';
import { showToast } from '@/services/notification';
import { t } from '@/i18n';

const usdtJuBalance = ref(0);
const isLoadingBalance = ref(true);
const isLoadingUid = ref(true);
const isBinding = ref(false);

const boundUid = ref("0");
const inputUid = ref("");
const investmentAmount = ref("");

const isUidBound = computed(() => boundUid.value !== "0");

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
    console.error(error);
    showToast(error.reason || "UID 绑定失败");
  } finally {
    isBinding.value = false;
  }
};

const handleInvest = () => {
  // Placeholder for the investment logic
  console.log(`准备投资: UID=${boundUid.value}, 金额=${investmentAmount.value}`);
  showToast(`准备投资: UID=${boundUid.value}, 算力数量=${investmentAmount.value}`);
};

const fetchBalance = async () => {
  if (walletState.isConnected && walletState.network === 'JuChain') {
    isLoadingBalance.value = true;
    initializeJuChainContracts();
    const balance = await getUsdtJuBalance();
    usdtJuBalance.value = parseFloat(balance);
    isLoadingBalance.value = false;
  }
};

watch(() => walletState.network, (newNetwork) => {
  if (newNetwork) {
    console.log('当前连接的网络是:', newNetwork);
    if (newNetwork === 'JuChain') {
      fetchBalance();
      checkUidBinding();
    }
  }
}, { immediate: true });

watch(() => walletState.address, (newAddress) => {
  if (newAddress && walletState.network === 'JuChain') {
    fetchBalance();
    checkUidBinding();
  }
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
}

.form-input:disabled {
  background-color: rgba(0, 0, 0, 0.4);
  cursor: not-allowed;
  opacity: 0.7;
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
  padding: 30px;
}
</style>
