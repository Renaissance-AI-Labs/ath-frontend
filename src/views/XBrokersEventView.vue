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
                    <div class="balance-display" v-if="walletState.isConnected && walletState.network === 'JuChain'">
                        <div class="balance-label">USDT-JU Balance</div>
                        <div class="balance-value">
                            <span v-if="isLoading">Loading...</span>
                            <AnimatedNumber v-else :value="usdtJuBalance" :decimals="4" />
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
import { watch, ref } from 'vue';
import { walletState } from '@/services/wallet';
import { initializeJuChainContracts, getUsdtJuBalance } from '@/services/juchainContracts';
import AnimatedNumber from '@/components/AnimatedNumber.vue';

const usdtJuBalance = ref(0);
const isLoading = ref(true);

const fetchBalance = async () => {
  if (walletState.isConnected && walletState.network === 'JuChain') {
    isLoading.value = true;
    initializeJuChainContracts();
    const balance = await getUsdtJuBalance();
    usdtJuBalance.value = parseFloat(balance);
    isLoading.value = false;
  }
};

watch(() => walletState.network, (newNetwork) => {
  if (newNetwork) {
    console.log('当前连接的网络是:', newNetwork);
    if (newNetwork === 'JuChain') {
      fetchBalance();
    }
  }
}, { immediate: true });

watch(() => walletState.address, (newAddress) => {
  if (newAddress && walletState.network === 'JuChain') {
    fetchBalance();
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
</style>
