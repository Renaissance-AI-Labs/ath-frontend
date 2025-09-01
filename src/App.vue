<template>
    <header class="navbar">
        <img src="./assets/images/logo.png" alt="Logo" class="logo">
        <div class="wallet-address">{{ $t('navbar.walletAddress') }}</div>
        <!-- Language switcher will be moved to the left panel -->
    </header>

    <div class="left-panel">
        <section class="info-card card" :ref="el => { if (el) cardsRef.push(el) }">
            <h3>{{ $t('assetDetails.title') }}</h3>
            <div class="detail-row">
                <span>{{ $t('assetDetails.performance') }}</span>
                <span>{{ $t('assetDetails.performanceValue') }}</span>
            </div>
            <div class="detail-row">
                <span>{{ $t('assetDetails.link') }}</span>
                <span class="wallet-link">{{ $t('assetDetails.linkValue') }}</span>
            </div>
        </section>
        
        <div class="language-switcher-container card" :ref="el => { if (el) cardsRef.push(el) }">
             <div class="language-switcher">
                <div 
                    v-for="lang in languages" 
                    :key="lang.code" 
                    class="lang-item" 
                    :class="{ active: locale === lang.code }"
                    @click="switchLanguage(lang.code)">
                    {{ lang.name }}
                </div>
            </div>
        </div>
    </div>

    <div class="center-panel">
        <section class="asset-card card" :ref="el => { if (el) cardsRef.push(el) }">
            <h2>{{ $t('assetCard.title') }}</h2>
            <div class="asset-amount">
                <span>{{ $t('assetCard.amount') }}</span>
            </div>
            <button class="donate-button" @click="isPopupVisible = true">{{ $t('assetCard.donateButton') }}</button>
        </section>
    </div>

    <div class="right-panel">
        <section class="transactions-card card" :ref="el => { if (el) cardsRef.push(el) }">
            <div class="tabs">
                <div class="tab" :class="{ active: activeTab === 'investment' }" @click="activeTab = 'investment'">{{ $t('transactions.investmentList') }}</div>
                <div class="tab" :class="{ active: activeTab === 'redemption' }" @click="activeTab = 'redemption'">{{ $t('transactions.redemptionList') }}</div>
            </div>
            <div class="table">
                <div class="table-header">
                    <div class="col">{{ $t('transactions.headers.id') }}</div>
                    <div class="col">{{ $t('transactions.headers.date') }}</div>
                    <div class="col">{{ $t('transactions.headers.principal') }}</div>
                    <div class="col">{{ $t('transactions.headers.profit') }}</div>
                    <div class="col center">{{ $t('transactions.headers.action') }}</div>
                </div>
                <div class="table-body">
                    <div v-if="activeTab === 'investment'">
                        <div v-if="investmentData.length > 0">
                            <div class="table-row" v-for="item in investmentData" :key="item.id">
                                <div class="col" :data-label="$t('transactions.headers.id')">{{ item.id }}</div>
                                <div class="col" :data-label="$t('transactions.headers.date')">{{ item.date }}</div>
                                <div class="col" :data-label="$t('transactions.headers.principal')">{{ item.principal }}</div>
                                <div class="col" :data-label="$t('transactions.headers.profit')">{{ item.profit }}</div>
                                <div class="col center action-col" :data-label="$t('transactions.headers.action')">
                                    <button class="action-button">{{ $t('transactions.redeemButton') }}</button>
                                </div>
                            </div>
                        </div>
                        <div v-else class="no-data">{{ $t('transactions.noData') }}</div>
                    </div>
                    <div v-if="activeTab === 'redemption'">
                        <div v-if="redemptionData.length > 0">
                            <div class="table-row" v-for="item in redemptionData" :key="item.id">
                                <div class="col" :data-label="$t('transactions.headers.id')">{{ item.id }}</div>
                                <div class="col" :data-label="$t('transactions.headers.date')">{{ item.date }}</div>
                                <div class="col" :data-label="$t('transactions.headers.principal')">{{ item.principal }}</div>
                                <div class="col" :data-label="$t('transactions.headers.profit')">{{ item.profit }}</div>
                                <div class="col center" :data-label="$t('transactions.headers.progress')">{{ $t(item.progress) }}</div>
                            </div>
                        </div>
                        <div v-else class="no-data">{{ $t('transactions.noData') }}</div>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <DonatePopup v-if="isPopupVisible" @close="isPopupVisible = false" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import DonatePopup from './components/DonatePopup.vue';

const { t, locale } = useI18n();

const isPopupVisible = ref(false);
const activeTab = ref('investment');

const languages = ref([
    { code: 'en', name: 'English' },
    { code: 'zh', name: '简体中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'ru', name: 'POCCИЯ' },
]);

const switchLanguage = (langCode) => {
    locale.value = langCode;
};

const investmentData = ref([
    { id: 1, date: '2023-10-26 10:00', principal: 1000, profit: 12 },
    { id: 2, date: '2023-10-25 15:30', principal: 500, profit: 6 },
]);

const redemptionData = ref([
    { id: 1, date: '2023-10-24 12:00', principal: 800, profit: 9.6, progress: 'transactions.status.redeemed' },
]);

// Holographic card effect
const cardsRef = ref([]);

const handleMouseMove = (e) => {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    target.style.setProperty("--x", `${x}px`);
    target.style.setProperty("--y", `${y}px`);
};

onMounted(() => {
    cardsRef.value.forEach(card => {
        card.addEventListener('mousemove', handleMouseMove);
    });
});

onUnmounted(() => {
    cardsRef.value.forEach(card => {
        card.removeEventListener('mousemove', handleMouseMove);
    });
});
</script>
