<template>
    <header id="header" class="tf-header">
        <div class="container">
            <div class="row d-flex align-items-center">
                <div class="col-5 col-lg-3">
                    <div class="header-left">
                        <router-link to="/" class="logo-site">
                            <img src="/asset/images/logo/ATNENA_LOGO.png" alt="LOGO">
                        </router-link>
                    </div>
                </div>
                <div class="col-6 d-none d-lg-block">
                    <nav class="box-navigation" style="display: none;">
                        <ul class="box-nav-menu main-nav_menu">
                            <li class="menu-item">
                                <router-link to="/" class="item-link tf-btn style-transparent text-body-3 animate-btn">
                                    Home
                                </router-link>
                            </li>
                            <li class="menu-item">
                                <router-link to="/blog" class="item-link tf-btn style-transparent text-body-3 animate-btn">
                                    Blog
                                </router-link>
                            </li>
                            <li class="menu-item">
                                <a href="javascript:void(0)" class="item-link tf-btn style-transparent text-body-3 animate-btn">
                                    Page
                                    <i class="icon icon-arrow-caret-down fs-7"></i>
                                </a>
                                <div class="sub-menu">
                                    <ul class="sub-menu_list">
                                        <li><router-link to="/about-us" class="sub-menu_link">About Us</router-link></li>
                                        <li><router-link to="/faq" class="sub-menu_link">FAQs</router-link></li>
                                        <li><router-link to="/pricing" class="sub-menu_link">Pricing</router-link></li>
                                        <li><router-link to="/use-case" class="sub-menu_link">Use Case</router-link></li>
                                        <li><router-link to="/use-case-detail" class="sub-menu_link">Use Case Detail</router-link></li>
                                        <li><router-link to="/404" class="sub-menu_link">404</router-link></li>
                                    </ul>
                                </div>
                            </li>
                            <li class="menu-item">
                                <router-link to="/contact-us" class="item-link tf-btn style-transparent text-body-3 animate-btn">
                                    Contact Us
                                </router-link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div class="col-7 col-lg-3">
                    <div class="header-right">
                        <div class="btn_group">
                            <!-- <a href="#" class="tf-btn text-body-3 animate-btn d-none d-sm-flex">
                                Log in
                            </a> -->
                            <!-- Global icon for future internationalization -->
                            <img src="/asset/icon/custom/global.png" alt="Global" class="global-icon" style="width: 20px; height: 20px; margin-right: 2px; cursor: pointer; opacity: 0.8;" @click="openLanguageModal">
                            <a v-if="!walletState.isConnected" href="#" @click.prevent="openModal" class="tf-btn text-body-3 style-2 animate-btn animate-dark">
                                {{ t('header.connectWallet') }}
                            </a>
                            <a v-else href="#" @click.prevent="openModal" class="wallet-address tf-btn text-body-3 style-2 animate-btn animate-dark">
                                {{ formattedAddress }}
                            </a>
                            <a href="#mobileMenu" class="btn-menu_mobile d-none" data-bs-toggle="offcanvas">
                                <i class="icon icon-menu"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import { walletState, formatAddress } from '@/services/wallet.js';
import { computed } from 'vue';
import { t } from '@/i18n';

export default {
  name: 'Header',
  setup() {
    const formattedAddress = computed(() => formatAddress(walletState.address));

    return {
      walletState,
      formattedAddress,
      t,
    };
  },
  methods: {
    openModal() {
      this.$emit('open-get-started-modal');
    },
    openLanguageModal() {
      this.$emit('open-language-modal');
    }
  }
}
</script>

<style scoped>
</style>


