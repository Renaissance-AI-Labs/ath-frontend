<template>
    <header class="navbar">
        <div class="navbar-top">
            <img src="./assets/images/logo.png" alt="Logo" class="logo">
            <div class="wallet-address">{{ $t('navbar.walletAddress') }}</div>
        </div>
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
    </header>

    <main class="container">
        <section class="asset-card">
            <h2>{{ $t('assetCard.title') }}</h2>
            <div class="asset-amount">
                <span>{{ $t('assetCard.amount') }}</span>
            </div>
            <button class="donate-button" @click="isPopupVisible = true">{{ $t('assetCard.donateButton') }}</button>
        </section>

        <section class="info-card asset-details">
            <div class="detail-row">
                <span>{{ $t('assetDetails.performance') }}</span>
                <span>{{ $t('assetDetails.performanceValue') }}</span>
            </div>
            <div class="detail-row">
                <span>{{ $t('assetDetails.link') }}</span>
                <span class="wallet-link">{{ $t('assetDetails.linkValue') }}</span>
            </div>
        </section>

        <section class="info-card investment-plan">
            <div class="card-header">
                <div class="line"></div>
                <h3>{{ $t('investmentPlan.title') }}</h3>
            </div>
            <p>{{ $t('investmentPlan.description') }}</p>
        </section>

        <section class="transactions-card">
            <div class="tabs">
                <div class="tab" :class="{ active: activeTab === 'investment' }" @click="activeTab = 'investment'">{{ $t('transactions.investmentList') }}</div>
                <div class="tab" :class="{ active: activeTab === 'redemption' }" @click="activeTab = 'redemption'">{{ $t('transactions.redemptionList') }}</div>
            </div>
            <div class="table">
                <div class="table-header">
                    <div class="col col-1">{{ $t('transactions.headers.id') }}</div>
                    <div class="col col-2">{{ $t('transactions.headers.date') }}</div>
                    <div class="col col-3">{{ $t('transactions.headers.principal') }}</div>
                    <div class="col col-4">{{ $t('transactions.headers.profit') }}</div>
                    <div v-if="activeTab === 'investment'" class="col col-5">{{ $t('transactions.headers.action') }}</div>
                    <div v-else class="col col-5">{{ $t('transactions.headers.progress') }}</div>
                </div>
                <div class="table-body">
                    <div v-if="activeTab === 'investment'">
                        <div class="table-row" v-for="item in investmentData" :key="item.id">
                            <div class="col col-1">{{ item.id }}</div>
                            <div class="col col-2">{{ item.date }}</div>
                            <div class="col col-3">{{ item.principal }}</div>
                            <div class="col col-4">{{ item.profit }}</div>
                            <div class="col col-5">
                                <button class="action-button">{{ $t('transactions.redeemButton') }}</button>
                            </div>
                        </div>
                         <div v-if="investmentData.length === 0" class="no-data">{{ $t('transactions.noData') }}</div>
                    </div>
                     <div v-if="activeTab === 'redemption'">
                        <div class="table-row" v-for="item in redemptionData" :key="item.id">
                           <div class="col col-1">{{ item.id }}</div>
                            <div class="col col-2">{{ item.date }}</div>
                            <div class="col col-3">{{ item.principal }}</div>
                            <div class="col col-4">{{ item.profit }}</div>
                            <div class="col col-5">{{ $t(item.progress) }}</div>
                        </div>
                         <div v-if="redemptionData.length === 0" class="no-data">{{ $t('transactions.noData') }}</div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <DonatePopup v-if="isPopupVisible" @close="isPopupVisible = false" />
</template>

<script setup>
import { ref } from 'vue';
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
</script>
