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
                <!-- <router-link to="/" class="text-white link font-2">
                  {{ t('personal.home') }}
                </router-link>
                <span>/</span> -->
                <span class="hacker-text_transform no-delay current-page">
                  {{ t('personal.title') }}
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

    <section class="flat-spacing-3 pt-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-10 col-xl-8 mx-auto">
            
            <!-- User Stats Section -->
            <div class="stats-grid mb-5">
              <div class="row align-items-center">
                <div class="col-12 mb-4">
                  <div class="stat-item text-center">
                    <h5 class="font-2 text-white opacity-75 mb-2 text-uppercase spacing-1">{{ t('personal.currentLevel') }}</h5>
                    <div class="stat-value">
                      <span class="font-3 text-white h1 fw-bold">Lv {{ userLevel }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="col-12">
                  <div class="stat-item text-center">
                    <h5 class="font-2 text-white opacity-75 mb-2 text-uppercase spacing-1">{{ t('personal.teamTotalBet') }}</h5>
                    <div class="stat-value">
                      <span class="font-3 text-linear h2 fw-bold">{{ formatAmount(totalWin) }}</span>
                      <span class="font-2 text-white opacity-75 ms-2">{{ t('common.ath') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Level Up Progress Bar -->
            <div class="progress-section px-4 px-md-5">
               <div class="d-flex justify-content-between align-items-end mb-3">
                 <h4 class="font-3 text-white mb-0 h5">
                   {{ isMaxLevel ? t('personal.maxLevelReached') : t('personal.nextLevelProgress') }}
                 </h4>
               </div>
               
               <div v-if="!isMaxLevel" class="level-progress-container">
                 <div class="progress-track">
                    <div class="progress-fill" :style="{ width: progressPercent + '%' }">
                      <div class="progress-glow"></div>
                    </div>
                 </div>
                 
                 <div class="d-flex justify-content-between text-caption text-white opacity-50 mt-2 font-2">
                    <span>{{ t('personal.current') }}: {{ formatAmount(totalWin) }}</span>
                    <span>{{ t('personal.target') }}: {{ formatAmount(nextLevelTarget) }} ({{ t('personal.need') }} {{ formatAmount(remainingToNextLevel) }} {{ t('common.ath') }})</span>
                 </div>
               </div>
               
               <div v-else class="text-center py-4">
                 <p class="text-linear h4 font-3">{{ t('personal.maxLevelDesc') }}</p>
               </div>
            </div>

            <!-- Loading/Connect Hint -->
            <div v-if="!walletState.isConnected" class="text-center mt-5">
               <p class="text-white mb-4 opacity-75">{{ t('personal.connectWalletHint') }}</p>
               <a href="#" @click.prevent="connectWallet" class="tf-btn style-2 text-body-3 animate-btn animate-dark px-5">
                  {{ t('personal.connectWalletBtn') }}
               </a>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- Sidebar Trigger Button -->
    <div class="btn-sidebar-mb d-lg-none right">
        <button @click="openSidebar" style="background-color: #111111;">
            <img src="/asset/images/section/speed.svg" alt="Menu" width="50" height="50" style="transform: rotate(180deg);">
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
import { ref, onMounted, watch, computed } from 'vue';
import HomeRightSidebar from '../components/HomeRightSidebar.vue';
import { walletState } from '../services/wallet';
import { getPersonalCenterData } from '../services/gameLevel';
import { t } from '../i18n';

export default {
  name: 'PersonalCenterView',
  components: {
    HomeRightSidebar
  },
  setup() {
    const userLevel = ref(0);
    const totalWin = ref("0");
    const levelConfigs = ref([]);
    const isLoading = ref(false);
    
    // New refs for progress
    const nextLevelTarget = ref("0");
    const isMaxLevel = ref(false);

    // Sidebar State
    const isSidebarOpen = ref(false);
    
    const openSidebar = () => {
        isSidebarOpen.value = true;
    };
    
    const closeSidebar = () => {
        isSidebarOpen.value = false;
    };

    const loadData = async () => {
      if (!walletState.isConnected) return;
      
      isLoading.value = true;
      try {
        const data = await getPersonalCenterData();
        userLevel.value = data.level;
        totalWin.value = data.totalWin;
        levelConfigs.value = data.configs;
        
        // Calculate progress
        const sortedConfigs = data.configs.sort((a, b) => a.level - b.level);
        const nextConfig = sortedConfigs.find(c => c.level > userLevel.value);
        
        if (nextConfig) {
             nextLevelTarget.value = nextConfig.minWinAmount;
             isMaxLevel.value = false;
        } else {
             // If no next config, user is at max level or logic is different
             // Check if userLevel is indeed the highest in configs
             if (sortedConfigs.length > 0 && userLevel.value >= sortedConfigs[sortedConfigs.length - 1].level) {
                 isMaxLevel.value = true;
             } else if (sortedConfigs.length === 0) {
                 // No configs loaded
                 isMaxLevel.value = false; 
             } else {
                 // Fallback
                 isMaxLevel.value = true;
             }
        }

      } catch (e) {
        console.error("Failed to load personal center data", e);
      } finally {
        isLoading.value = false;
      }
    };
    
    const progressPercent = computed(() => {
        if (isMaxLevel.value) return 100;
        const current = parseFloat(totalWin.value);
        const target = parseFloat(nextLevelTarget.value);
        if (target <= 0) return 0;
        const p = (current / target) * 100;
        return Math.min(Math.max(p, 0), 100);
    });
    
    const remainingToNextLevel = computed(() => {
        if (isMaxLevel.value) return "0";
        const current = parseFloat(totalWin.value);
        const target = parseFloat(nextLevelTarget.value);
        const diff = target - current;
        return diff > 0 ? diff.toString() : "0";
    });

    onMounted(() => {
      if (walletState.isConnected) {
        loadData();
      }
    });

    watch(() => walletState.isConnected, (newVal) => {
      if (newVal) {
        loadData();
      } else {
        userLevel.value = 0;
        totalWin.value = "0";
        isMaxLevel.value = false;
      }
    });

    // Helper to format large numbers
    const formatAmount = (val) => {
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

    const connectWallet = () => {
        document.dispatchEvent(new CustomEvent('open-wallet-modal'));
    }

    return {
      walletState,
      userLevel,
      totalWin,
      levelConfigs,
      isLoading,
      formatAmount,
      connectWallet,
      nextLevelTarget,
      isMaxLevel,
      progressPercent,
      remainingToNextLevel,
      isSidebarOpen,
      openSidebar,
      closeSidebar,
      t
    };
  }
};
</script>

<style scoped>
.stats-grid {
    padding: 20px 0;
}

.border-white-10 {
    border-color: rgba(255, 255, 255, 0.1) !important;
}

.spacing-1 {
    letter-spacing: 1px;
}

/* Progress Bar Styles */
.level-progress-container {
    width: 100%;
}

.progress-track {
    width: 100%;
    height: 8px; /* Thinner track for cleaner look */
    background: rgba(255, 255, 255, 0.08); /* More subtle track */
    border-radius: 4px;
    overflow: hidden;
    position: relative;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00C8FF, #0080FF, #8A2BE2);
    background-size: 200% 100%;
    border-radius: 4px;
    transition: width 0.6s ease-out;
    position: relative;
    animation: gradientMove 3s linear infinite;
    box-shadow: 0 0 15px rgba(0, 200, 255, 0.4); /* Add glow to the bar itself */
}

.progress-glow {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 20px; /* Wider glow */
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 20px rgba(255, 255, 255, 1);
    filter: blur(4px);
    opacity: 0.5;
}

@keyframes gradientMove {
    0% { background-position: 100% 0; }
    100% { background-position: 0 0; }
}
</style>
