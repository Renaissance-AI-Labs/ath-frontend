<template>
  <div class="crash-view">
    <div class="section-page-title">
      <div class="sect-tagline">
        <div class="container">
          <div class="sect-tagline_inner">
            <span class="hafl-plus pst-left_bot wow bounceInScale"></span>
            <span class="hafl-plus pst-right_bot wow bounceInScale"></span>
            <div class="s-name text-caption ">
              <div class="breadcrumbs-list" style="font-size: 30px; margin-top: 10px; margin-bottom: 0px;">
                <!-- <router-link to="/" class="text-white link ">CRASH</router-link>
                <span> & </span> -->
                <span class="crash-title no-delay">CRASH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span class="br-line"></span>
    </div>

    <section class="flat-spacing-2 crash-container" style="padding-top: 0px !important;">
      <div class="container">
        <div class="row">
          <!-- Game Section -->
          <div class="col-lg-12 mb-5">
            <div class="crash-game-wrapper">
              
              <!-- Left: Controls -->
              <div class="crash-controls">
                <div class="control-group">
                  <label class="">{{ t('crash.betAmount') }}</label>
                  <div class="input-group">
                    <input 
                      type="number" 
                      v-model="betAmount" 
                      @blur="handleBetAmountBlur"
                      :disabled="gameState !== 'IDLE' && gameState !== 'RESULT'"
                      :placeholder="`${minBet} - ${maxBet}`" 
                      :min="minBet"
                      :max="maxBet"
                      class="form-control "
                    />
                    <div class="input-group-append">
                      <button class=" append-btn" @click="setAmountPercent(0.5)" :disabled="gameState !== 'IDLE' && gameState !== 'RESULT'">1/2</button>
                      <button class=" append-btn" @click="setAmountPercent(2)" :disabled="gameState !== 'IDLE' && gameState !== 'RESULT'">2x</button>
                      <button class=" append-btn" @click="setMaxAmount" :disabled="gameState !== 'IDLE' && gameState !== 'RESULT'">Max</button>
                    </div>
                  </div>
                  <div class="balance-text ">
                    {{ t('crash.balance', { amount: parseFloat(athBalance).toFixed(4) }) }}
                  </div>
                </div>

                <div class="control-group mt-2">
                  <label class="">{{ t('crash.prediction') }}</label>
                  <div class="input-group">
                    <input 
                      type="number" 
                      v-model="prediction" 
                      @blur="handlePredictionBlur"
                      :disabled="gameState !== 'IDLE' && gameState !== 'RESULT'"
                      :placeholder="placeholderText" 
                      step="0.01"
                      :min="minPrediction"
                      :max="maxPrediction"
                      class="form-control "
                    />
                    <div class="input-group-append">
                      <div class="prediction-arrows">
                        <button class="arrow-btn left" @click="adjustPrediction(-1)" :disabled="gameState !== 'IDLE' && gameState !== 'RESULT'">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
                        </button>
                        <button class="arrow-btn right" @click="adjustPrediction(1)" :disabled="gameState !== 'IDLE' && gameState !== 'RESULT'">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="win-chance ">
                    {{ t('crash.winChance', { chance: winChance }) }}
                  </div> -->
                </div>

                <div class="action-btn-wrapper mt-3">
                  <!-- Connect Wallet -->
                  <button v-if="!walletState.isConnected" class="tf-button style-1 w-100" @click="connectWallet">
                    {{ t('crash.connectWallet') }}
                  </button>
                  
                  <!-- Approve -->
                  <button v-else-if="needsApproval" class="tf-button style-1 w-100" @click="handleApprove" :disabled="isApproving">
                    {{ isApproving ? t('crash.approving') : t('crash.approve') }}
                  </button>
                  
                  <!-- Bet -->
                  <button v-else-if="gameState === 'IDLE' || gameState === 'RESULT'" class="tf-button style-1 w-100 btn-bet" @click="handleBet" :disabled="isBetting">
                    {{ isBetting ? t('crash.betting') : t('crash.bet') }}
                  </button>

                  <!-- Waiting Block -->
                  <button v-else-if="gameState === 'WAITING_BLOCK'" class="tf-button style-1 w-100 disabled" disabled>
                    {{ t('crash.waitingBlock') }}
                  </button>
                  
                  <!-- Settle -->
                  <button v-else-if="gameState === 'READY_TO_SETTLE'" class="tf-button style-1 w-100 btn-settle" @click="handleSettle">
                    {{ settleButtonText }}
                  </button>

                   <!-- Settling -->
                  <button v-else-if="gameState === 'SETTLING'" class="tf-button style-1 w-100 disabled" disabled>
                    {{ t('crash.settling') }}
                  </button>
                  
                  <!-- Animating -->
                  <button v-else-if="gameState === 'ANIMATING'" class="tf-button style-1 w-100 disabled" disabled>
                    {{ t('crash.launching') }}
                  </button>
                  
                  <div class="debug-buttons mt-2" style="display: flex; gap: 10px;">
                    <button class="tf-button style-1 w-50" @click="testCrashAnim" style="height: 40px !important; font-size: 12px; background: #333; border: 1px solid #555;">Test Crash</button>
                    <button class="tf-button style-1 w-50" @click="testWinAnim" style="height: 40px !important; font-size: 12px; background: #333; border: 1px solid #555;">Test Win</button>
                  </div>
                </div>
              </div>

              <!-- Right: Canvas -->
              <div class="crash-canvas-container">
                <canvas ref="gameCanvas" id="crashCanvas"></canvas>
                
                <!-- Overlay Info -->
                <div class="canvas-overlay">
                  <!-- Loading / Waiting -->
                  <div v-if="gameState === 'WAITING_BLOCK'" class="status-overlay">
                    <div class="spinner-border text-primary" role="status"></div>
                    <div class="mt-2 ">{{ t('crash.waitingBlockOverlay') }}</div>
                  </div>

                  <!-- Multiplier Display (Always visible during game, and result) -->
                  <div v-if="gameState === 'ANIMATING' || gameState === 'RESULT'" class="multiplier-display-wrapper">
                      <div class="multiplier-display " :class="[multiplierClass, { 'crashed-anim': gameState === 'RESULT' && !lastGameWon, 'won-anim': gameState === 'RESULT' && lastGameWon }]">
                        {{ currentMultiplier.toFixed(2) }}x
                      </div>
                      
                      <!-- Result Status Text -->
                      <div v-if="gameState === 'RESULT'" class="result-status " :class="lastGameWon ? 'text-success' : 'text-danger'">
                        {{ lastGameWon ? 'YOU WON' : 'CRASHED' }}
                      </div>
                      
                      <div v-if="gameState === 'RESULT' && lastGameWon" class="result-payout  text-success">
                        +{{ lastPayout }} ATH
                      </div>
                  </div>
                </div>
                
                <!-- Time Label (Right of X-Axis) -->
                <div v-if="gameState === 'ANIMATING' || gameState === 'RESULT'" class="time-display-wrapper" style="position: absolute; right: 25px; bottom: 40px; color: #ffffff; font-family: 'Geist', sans-serif; font-weight: bold;">
                    {{ currentTimeLabel }}s
                </div>
              </div>
            </div>
          </div>

          <!-- History Section -->
          <div class="col-lg-12">
            <div class="history-tabs">
              <button class="tab-btn " :class="{ active: activeTab === 'my' }" @click="activeTab = 'my'">{{ t('crash.myBets') }}</button>
              <button class="tab-btn " :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">{{ t('crash.allBets') }}</button>
            </div>
            
            <div class="history-table-wrapper">
              <table class="table  text-white">
                <thead>
                  <tr>
                    <th>{{ t('crash.time') }}</th>
                    <th v-if="activeTab === 'all'">{{ t('crash.player') }}</th>
                    <th>{{ t('crash.betCol') }}</th>
                    <th>{{ t('crash.predictionCol') }}</th>
                    <th>{{ t('crash.result') }}</th>
                    <th>{{ t('crash.payout') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in historyData" :key="index">
                    <td>{{ formatTime(item.timestamp) }}</td>
                    <td v-if="activeTab === 'all'">{{ formatAddr(item.player) }}</td>
                    <td>{{ formatAmount4(item.amount) }}</td>
                    <td>{{ item.prediction.toFixed(2) }}x</td>
                    <td :class="getResultColor(item)">
                        {{ formatCrashPoint(item.crashPoint) }}
                    </td>
                    <td :class="{ 'text-success': item.won }">
                      {{ formatAmount4(item.payout) }}
                    </td>
                  </tr>
                  <tr v-if="historyData.length === 0">
                    <td colspan="6" class="text-center">{{ t('crash.noHistory') }}</td>
                  </tr>
                </tbody>
              </table>
              
              <!-- Simple Pagination -->
              <div class="pagination-controls mt-3 text-center" v-if="hasMoreHistory">
                <button class="btn-sm btn-outline-light" @click="loadMoreHistory">{{ t('crash.loadMore') }}</button>
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
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import HomeRightSidebar from '../components/HomeRightSidebar.vue';
import { 
  getAthBalance, 
  getAthAllowance, 
  approveAth, 
  placeBet, 
  settleBet, 
  getActiveBet,
  getUserHistory,
  getUserHistoryLength,
  getGlobalHistory,
  getGlobalHistoryLength,
  getGameConfig
} from '../services/crash';
import { walletState, connectWallet as walletConnect } from '../services/wallet';
import { showToast } from '../services/notification';
import { t } from '../i18n';

export default {
  name: 'CrashView',
  setup() {
    // --- State ---
    const gameState = ref('IDLE'); // IDLE, BETTING, WAITING_BLOCK, READY_TO_SETTLE, SETTLING, ANIMATING, RESULT
    const betAmount = ref('');
    const prediction = ref('');
    const athBalance = ref('0');
    const athAllowance = ref('0');
    
    const isBetting = ref(false);
    const isApproving = ref(false);
    
    const currentMultiplier = ref(1.00);
    const crashPoint = ref(0);
    const lastGameWon = ref(false);
    const lastPayout = ref('0');
    
    const activeTab = ref('my');
    const historyData = ref([]);
    const historyCursor = ref(0);
    const hasMoreHistory = ref(false); // Simplified for now
    
    const gameCanvas = ref(null);
    let animationFrameId = null;
    let blockCheckInterval = null;
    let countdownInterval = null; // Separate interval for smooth countdown

    const minBet = ref(1);
    const maxBet = ref(2000);
    const minPrediction = ref(1.01);
    const maxPrediction = ref(100);

    const expirationSeconds = ref(0); // Seconds until expiration
    const currentTimeLabel = ref(0); // Current elapsed time in seconds for display

    // Sidebar State
    const isSidebarOpen = ref(false);
    
    const openSidebar = () => {
        isSidebarOpen.value = true;
    };
    
    const closeSidebar = () => {
        isSidebarOpen.value = false;
    };
    
    const placeholderText = computed(() => {
        const min = typeof minPrediction.value === 'number' ? minPrediction.value : 1.01;
        const max = typeof maxPrediction.value === 'number' ? maxPrediction.value : 100;
        return `${min.toFixed(2)} - ${max.toFixed(2)}`;
    });

    // --- Computed ---
    const settleButtonText = computed(() => {
        if (expirationSeconds.value > 0) {
            return `${t('crash.settle')} (${expirationSeconds.value}s)`;
        }
        // If expired, let user re-bet. The contract will handle voiding the old bet if user calls it, 
        // but UI should probably prompt to start new.
        // Wait, "Void" (funds returned) is different from "Expired" (funds lost).
        // If blockhash expires (256 blocks), user loses bet. 
        // So showing "Bet Expired" is correct for status, but we want to allow new bet.
        
        // Requirement 1: If user refreshed page, and bet is expired, it should still show "Settle" or handle it.
        // Requirement 2: After successful settle (voided or not), show IDLE/Bet button.
        
        if (gameState.value === 'READY_TO_SETTLE' && expirationSeconds.value === 0) {
             // technically expired
             return t('crash.betExpired'); 
        }
        return t('crash.settle');
    });

    const needsApproval = computed(() => {
        if (!betAmount.value) return false;
        return parseFloat(athAllowance.value) < parseFloat(betAmount.value);
    });

    const winChance = computed(() => {
        const p = parseFloat(prediction.value);
        if (!p || p <= 1) return 0;
        // Edge is 1-5% usually, formula: (99 / prediction)
        return (95 / p).toFixed(2); // Assuming 5% edge from contract default
    });

    const multiplierClass = computed(() => {
        if (gameState.value === 'RESULT' && !lastGameWon.value) return 'text-danger';
        if (currentMultiplier.value >= parseFloat(prediction.value)) return 'text-success';
        return 'text-white';
    });

    // --- Lifecycle ---
    onMounted(async () => {
        if (walletState.isConnected && walletState.contractsInitialized) {
            await initGame();
        }
        
        // Listen for window resize to fix canvas
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        drawIdleCanvas();
    });

    onUnmounted(() => {
        cancelAnimationFrame(animationFrameId);
        clearInterval(blockCheckInterval);
        clearInterval(countdownInterval);
        window.removeEventListener('resize', resizeCanvas);
    });

    watch(() => walletState.isConnected, async (connected) => {
        if (connected) {
            // Wait for contracts to be initialized if needed
            if (walletState.contractsInitialized) {
                await initGame();
            }
        }
    });

    watch(() => walletState.contractsInitialized, async (initialized) => {
        if (initialized && walletState.isConnected) {
            console.log("Contracts initialized, starting game...");
            await initGame();
        }
    });

    watch(activeTab, async () => {
        historyCursor.value = 0;
        await loadHistory();
    });

    // --- Methods ---

    const initGame = async () => {
        console.log("Initializing game...");
        // 确保合约已初始化
        if (!walletState.contractsInitialized) {
            console.warn("Contracts not initialized yet, skipping initGame");
            return;
        }
        const config = await getGameConfig();
        if (config) {
            if (config.minBet) minBet.value = parseFloat(config.minBet);
            if (config.maxBet) maxBet.value = parseFloat(config.maxBet);
            if (config.minPrediction) minPrediction.value = config.minPrediction;
            if (config.maxPrediction) maxPrediction.value = config.maxPrediction;
        }
        await refreshBalance();
        await checkActiveBet();
        await loadHistory();
    };

    const refreshBalance = async () => {
        athBalance.value = await getAthBalance();
        athAllowance.value = await getAthAllowance();
    };

    const checkActiveBet = async () => {
        const bet = await getActiveBet();
        if (bet) {
            console.log("Found active bet:", bet);
            // Check if we need to wait for block or can settle
            const provider = walletState.signer?.provider;
            if (!provider) return; // Should be connected
            
            const currentBlock = await provider.getBlockNumber();
            
            // Restore inputs
            betAmount.value = bet.amount;
            prediction.value = bet.prediction.toFixed(2);

            if (currentBlock > bet.betBlock) {
                gameState.value = 'READY_TO_SETTLE';
                
                // Initialize countdown for existing bet
                const expiryBlock = bet.betBlock + 255;
                const remainingBlocks = Math.max(0, expiryBlock - currentBlock);
                const estimatedSeconds = Math.floor(remainingBlocks * 0.75); // 0.75s per block approx on BSC/similar

                if (remainingBlocks > 0) {
                     expirationSeconds.value = estimatedSeconds;
                     startCountdown();
                     // No need to start block checker here as we have the state and timer
                } else {
                     expirationSeconds.value = 0;
                     // Expired
                }

            } else {
                gameState.value = 'WAITING_BLOCK';
                startBlockCheck(bet.betBlock);
            }
        } else {
            gameState.value = 'IDLE';
            drawIdleCanvas();
        }
    };

    const stopBlockCheck = () => {
        clearInterval(blockCheckInterval);
        clearInterval(countdownInterval);
        blockCheckInterval = null;
        countdownInterval = null;
    };

    const startBlockCheck = (targetBlock) => {
        clearInterval(blockCheckInterval);
        clearInterval(countdownInterval);
        
        // Initial set
        expirationSeconds.value = 0;
        
        // 1. Block checker: updates gameState and syncs countdown time with chain occasionally
        blockCheckInterval = setInterval(async () => {
            const provider = walletState.signer?.provider;
            if (!provider) return;
            const current = await provider.getBlockNumber();
            console.log(`Checking block: ${current} > ${targetBlock}`);
            
            if (current > targetBlock) {
                gameState.value = 'READY_TO_SETTLE';
                
                // Sync remaining time from chain ONCE
                const expiryBlock = targetBlock + 255;
                const remainingBlocks = Math.max(0, expiryBlock - current);
                const estimatedSeconds = Math.floor(remainingBlocks * 0.75); // 0.75s per block
                
                expirationSeconds.value = estimatedSeconds;
                startCountdown();

                // Stop checking blocks, rely on local countdown
                clearInterval(blockCheckInterval);
                blockCheckInterval = null;
            } else {
                // Still waiting
                gameState.value = 'WAITING_BLOCK';
                expirationSeconds.value = 0;
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
        }, 2000); // Check blocks every 2s to save RPC calls
    };

    const startCountdown = () => {
        clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            if (expirationSeconds.value > 0) {
                expirationSeconds.value--;
            } else {
                // Expired
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
        }, 1000);
    };

    const connectWallet = () => {
        walletConnect('okx'); // Default or open modal
    };

    const handleApprove = async () => {
        isApproving.value = true;
        const success = await approveAth();
        if (success) {
            showToast(t('toast.txSuccess'));
            await refreshBalance();
        }
        isApproving.value = false;
    };

    const handleBet = async () => {
        if (!betAmount.value || !prediction.value) return;
        
        // Reset visual state if we are coming from RESULT
        if (gameState.value === 'RESULT') {
             gameState.value = 'IDLE'; // Optional transition
             // Clear canvas? Maybe not needed as it will switch to waiting block soon
        }

        console.log("handleBet parameters:", { betAmount: betAmount.value, prediction: parseFloat(prediction.value) });
        isBetting.value = true;
        const success = await placeBet(betAmount.value, parseFloat(prediction.value));
        if (success) {
            showToast(t('toast.txSuccess'));
            await refreshBalance();
            // Get current block to wait
            const provider = walletState.signer?.provider;
            const currentBlock = await provider.getBlockNumber();
            
            gameState.value = 'WAITING_BLOCK';
            // Start checking for NEXT block (current + 1 usually, but bet stores the block it was mined in)
            // Wait, placeBet waits for tx.wait(), so the tx is in a block.
            // We need block.number > betBlock.
            // We can call getActiveBet to get the exact betBlock.
            const bet = await getActiveBet();
            if (bet) {
                startBlockCheck(bet.betBlock);
            }
        }
        isBetting.value = false;
    };

    const handleSettle = async () => {
        stopBlockCheck();
        gameState.value = 'SETTLING';
        const result = await settleBet();
        
        if (result) {
            console.log("Settle result:", result);
            
            if (result.voided) {
                showToast(t('crash.betExpired'));
                gameState.value = 'IDLE';
                // Reset to idle canvas
                drawIdleCanvas();
                return;
            }

            crashPoint.value = result.crashPoint;
            lastGameWon.value = result.won;
            lastPayout.value = result.payout;
            
            // Start Animation
            startAnimation(result.crashPoint);
        } else {
            // Failed to settle - could be network error OR truly expired/failed
            // If it failed because it's expired/not found, we should probably reset to IDLE so user can bet again.
            // For now, keep as is unless we know why it failed.
            // If the error was "No active bet found", settleBet returns null.
            
            // If we are here, it means settleBet returned null.
            // Check if we still have an active bet?
            const bet = await getActiveBet();
            if (!bet) {
                // No bet found, so we are IDLE
                gameState.value = 'IDLE';
                drawIdleCanvas();
            } else {
                 // Bet exists but settle failed (maybe network), stay in READY_TO_SETTLE
                 gameState.value = 'READY_TO_SETTLE';
                 startBlockCheck(bet.betBlock);
            }
        }
    };

    // --- Animation Logic ---
    const resizeCanvas = () => {
        const canvas = gameCanvas.value;
        if (canvas) {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            if (gameState.value === 'IDLE') drawIdleCanvas();
        }
    };

    const drawIdleCanvas = () => {
        const canvas = gameCanvas.value;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        
        // Define padding for axes
        const paddingBottom = 40; 
        const paddingRight = 15; // NEW
        
        const drawH = h - paddingBottom;
        const drawW = w - paddingRight; // UPDATED

        ctx.clearRect(0, 0, w, h);
        
        // Draw Faint Grid
        ctx.strokeStyle = 'rgba(51, 51, 51, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x <= drawW; x += 50) { ctx.moveTo(x, 0); ctx.lineTo(x, drawH); }
        for (let y = 0; y < drawH; y += 50) { ctx.moveTo(0, y); ctx.lineTo(drawW, y); }
        
        // Axis line
        ctx.moveTo(0, drawH);
        ctx.lineTo(drawW, drawH);
        ctx.stroke();

        // Draw static curve preview (dashed or faint)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.setLineDash([5, 5]); // Dashed line for preview
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, drawH);
        ctx.quadraticCurveTo(drawW/2, drawH, drawW, drawH*0.2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash

        // Draw "Ready" text or waiting pulse
        ctx.font = '20px "Geist", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = 'center';
        ctx.fillText(t('crash.waitingForNextRound'), drawW/2, drawH/2);
    };

    const startAnimation = (targetPoint) => {
        gameState.value = 'ANIMATING';
        currentMultiplier.value = 1.00;
        
        const canvas = gameCanvas.value;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        
        // Special case: Instant crash
        if (targetPoint < 1.01) {
             currentMultiplier.value = 1.00; // Force display 1.00
             endGame();
             return;
        }

        const startTime = Date.now();
        // Duration: log(target) / k. Let's say 2.0x takes 3 seconds.
        // 2 = e^(k*3) -> ln(2) = 3k -> k = 0.23
        // To make it exciting, higher multipliers should take longer but accelerate visually.
        // We'll use a fixed time scale for the X axis.
        
        const k = 0.00006; // Growth factor per ms approx
        
        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime; // ms
            
            // Formula: M = e^(k * t)
            // k=0.00006. e^(0.00006 * 10000) = e^0.6 = 1.82x in 10s.
            let nextM = Math.exp(k * elapsed);
            
            if (nextM >= targetPoint) {
                nextM = targetPoint;
                currentMultiplier.value = nextM;
                drawFrame(ctx, w, h, nextM, elapsed);
                endGame();
                return;
            }
            
            currentMultiplier.value = nextM;
            drawFrame(ctx, w, h, nextM, elapsed);
            animationFrameId = requestAnimationFrame(animate);
        };
        
        animate();
    };

    const drawFrame = (ctx, w, h, multiplier, elapsed) => {
        ctx.clearRect(0, 0, w, h);
        
        const k = 0.00006;

        // --- Calculate Viewport ---
        const maxTime = Math.max(8000, elapsed * 1.0); // Minimum 8s viewport
        const maxMult = Math.max(2, multiplier * 1.2);

        // Define padding for axes
        const paddingBottom = 40; // Increased to make room for labels
        const paddingLeft = 0;   // No left axis labels yet
        const paddingRight = 15; // Right padding for dot visibility
        
        // Effective drawing area
        const drawH = h - paddingBottom;
        const drawW = w - paddingRight; // Full width minus padding

        // Update time label display
        currentTimeLabel.value = (elapsed / 1000).toFixed(1);

        // Draw Grid
        ctx.strokeStyle = 'rgba(51, 51, 51, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x <= drawW; x += 50) { ctx.moveTo(x, 0); ctx.lineTo(x, drawH); } // Vertical lines stop at drawH
        for (let y = 0; y < drawH; y += 50) { ctx.moveTo(0, y); ctx.lineTo(drawW, y); } // Horizontal lines
        
        // Draw bottom axis line
        ctx.moveTo(0, drawH);
        ctx.lineTo(drawW, drawH);
        
        ctx.stroke();

        // --- Draw X-Axis Labels (Below the graph area) ---
        ctx.save();
        ctx.font = 'bold 12px "Geist", sans-serif'; // Bold font
        ctx.fillStyle = '#ffffff'; // White color
        ctx.textAlign = 'center';
        
        // Dynamic labels logic
        let labels = [];
        const maxSeconds = Math.ceil(maxTime / 1000);
        
        if (maxSeconds <= 8) {
            labels = [2, 4, 6, 8];
        } else {
            labels = [maxSeconds - 6, maxSeconds - 4, maxSeconds - 2, maxSeconds];
        }

        const positions = [0.25, 0.50, 0.75, 1.0];
        
        labels.forEach((sec, index) => {
             const xPos = positions[index] * drawW;
             const yPos = h - 15; // Position below the drawing area
             
             if (index === 3) {
                 ctx.textAlign = 'right';
                 ctx.fillText(sec + 's', xPos - 10, yPos); 
             } else {
                 ctx.textAlign = 'center';
                 ctx.fillText(sec + 's', xPos, yPos); 
             }
        });
        ctx.restore();

        // Pre-calculate points to avoid multiple loops
        const points = [];
        const step = 50; // ms
        for (let t = 0; t <= elapsed; t += step) {
            const m = Math.exp(k * t);
            const x = (t / maxTime) * drawW;
            const y = drawH - ((m - 1) / (maxMult - 1)) * drawH; // Scale to drawH
            points.push({ x, y });
        }
        
        // Current Point
        const curX = (elapsed / maxTime) * drawW;
        const curY = drawH - ((multiplier - 1) / (maxMult - 1)) * drawH;
        points.push({ x: curX, y: curY });

        if (points.length < 2) return;

        // --- 1. Draw Blue Area Under Curve ---
        // Solid fill #ff9d02
        ctx.fillStyle = '#ff9d02'; 
        ctx.beginPath();
        ctx.moveTo(points[0].x, drawH); // Start bottom-left at drawH
        ctx.lineTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
             ctx.lineTo(points[i].x, points[i].y);
        }
        
        ctx.lineTo(points[points.length-1].x, drawH); // Drop to bottom-right at drawH
        ctx.closePath();
        ctx.fill();

        // --- 2. Draw The Line Curve (Clean White) ---
        ctx.save();
        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff9d02'; // Orange glow to match fill
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 5; // Thicker line
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        ctx.restore();

        // --- 3. Draw End Dot (Curve color circle) ---
        // Request: "尽头的箭头改成一个曲线同色圆点"
        ctx.save();
        ctx.translate(curX, curY);
        
        // Draw Dot
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2); // 6px radius
        ctx.fillStyle = '#ffffff'; // Curve color (white)
        ctx.fill();
        
        // Optional: Add a glow or ring? "曲线同色" -> White.
        // Maybe an outer glow ring?
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff9d02';
        ctx.fill();

        ctx.restore();
    };

    const endGame = () => {
        gameState.value = 'RESULT';
        refreshBalance();
        loadHistory();
        
        // Removed auto-reset. User must click Bet to start next round.
        // Result stays on screen.
    };

    // --- Helper UI Methods ---
    const setAmountPercent = (p) => {
        if (!athBalance.value) return;
        const bal = parseFloat(athBalance.value);
        let current = parseFloat(betAmount.value || 0);
        
        // If current input is 0 or empty, try to set a base value if user clicks modifier
        if (current === 0) {
             // Optional: could set to minBet if desired, but standard behavior is 0*x = 0
        }

        let v;
        if (p === 2) {
             v = current * 2;
        } else if (p === 0.5) {
             v = current * 0.5;
        } else {
             // Fallback for other percentages if added later (e.g. bal * p)
             v = bal * p;
        }
        
        // Clamp to min/max
        if (v > maxBet.value) v = maxBet.value;
        if (v > bal) v = bal; // Cannot bet more than balance
        
        // If calculated value is less than minBet (but not 0), logic usually allows it or clamps it?
        // Let's just format it. User will get error if < minBet on submit.
        
        betAmount.value = v.toFixed(4);
    };
    
    const setMaxAmount = () => {
        const bal = parseFloat(athBalance.value);
        betAmount.value = Math.min(bal, maxBet.value).toFixed(4);
    };

    const formatTime = (ts) => {
        const date = new Date(ts * 1000);
        const Y = date.getFullYear();
        const M = (date.getMonth() + 1).toString().padStart(2, '0');
        const D = date.getDate().toString().padStart(2, '0');
        const h = date.getHours().toString().padStart(2, '0');
        const m = date.getMinutes().toString().padStart(2, '0');
        const s = date.getSeconds().toString().padStart(2, '0');
        return `${Y}-${M}-${D} ${h}:${m}:${s}`;
    };
    
    const formatAddr = (addr) => {
        if (!addr) return '???';
        return addr.substring(0, 6) + '...' + addr.substring(addr.length - 4);
    };

    const formatCrashPoint = (val) => {
        if (val === 0) return 'Expired';
        if (val < 1.01) return '1.00x';
        return val.toFixed(2) + 'x';
    };

    const formatAmount4 = (val) => {
        if (!val) return '0.0000';
        const num = parseFloat(val);
        if (isNaN(num)) return '0.0000';
        // Truncate to 4 decimals
        return (Math.floor(num * 10000) / 10000).toFixed(4);
    };

    const getResultColor = (item) => {
        if (item.crashPoint === 0) return 'text-danger'; // Timeout
        if (item.crashPoint < 1.01) return 'text-danger'; // Instant crash
        // For history
        if (item.crashPoint >= 1.01) return 'text-success'; // Unified Green for all winning/active states
        return 'text-white'; 
    };

    const loadHistory = async () => {
        if (activeTab.value === 'my') {
            const length = await getUserHistoryLength();
            const start = Math.max(0, length - 50);
            const raw = await getUserHistory(start, 50);
            historyData.value = raw.reverse(); // Newest first
        } else {
            // For global history
            const length = await getGlobalHistoryLength();
            const start = Math.max(0, length - 50);
            const raw = await getGlobalHistory(start, 50);
            historyData.value = raw.reverse(); // Newest first
        }
        hasMoreHistory.value = false; // Disable pagination for MVP
    };
    
    const loadMoreHistory = () => {
        // Implement if needed
    };

    const handleBetAmountBlur = () => {
        if (betAmount.value === '' || betAmount.value === null) return;
        let val = parseFloat(betAmount.value);
        if (isNaN(val)) {
            betAmount.value = '';
            return;
        }
        
        if (val < minBet.value) val = minBet.value;
        if (val > maxBet.value) val = maxBet.value;
        
        betAmount.value = parseFloat(val.toFixed(4)).toString();
    };

    const handlePredictionBlur = () => {
        if (prediction.value === '' || prediction.value === null) return;
        let val = parseFloat(prediction.value);
        
        if (isNaN(val)) {
            val = minPrediction.value;
        }

        if (val < minPrediction.value) val = minPrediction.value;
        if (val > maxPrediction.value) val = maxPrediction.value;

        prediction.value = val.toFixed(2);
    };

    const adjustPrediction = (delta) => {
        if (gameState.value !== 'IDLE' && gameState.value !== 'RESULT') return;
        
        let current = parseFloat(prediction.value);
        if (isNaN(current)) current = minPrediction.value; // Default to min if empty
        
        // If current is less than min (e.g. empty -> min), and we are adding, start from min.
        // If we are subtracting from min, stay at min.
        
        let newVal = current + delta;
        
        if (newVal < minPrediction.value) newVal = minPrediction.value;
        if (newVal > maxPrediction.value) newVal = maxPrediction.value;
        
        prediction.value = newVal.toFixed(2);
    };

    const testCrashAnim = () => {
        lastGameWon.value = false;
        startAnimation(1.20); // Crashes at 1.20x
    };
    
    const testWinAnim = () => {
        lastGameWon.value = true;
        lastPayout.value = '100'; // Fake payout
        startAnimation(5.00); // Crashes at 5.00x but we won
    };

    return {
        t,
        gameState,
        betAmount,
        prediction,
        athBalance,
        athAllowance,
        isBetting,
        isApproving,
        needsApproval,
        winChance,
        multiplierClass,
        currentMultiplier,
        lastGameWon,
        lastPayout,
        activeTab,
        historyData,
        hasMoreHistory,
        gameCanvas,
        walletState,
        
        connectWallet,
        handleApprove,
        handleBet,
        handleSettle,
        setAmountPercent,
        setMaxAmount,
        formatTime,
        formatAddr,
        formatCrashPoint,
        formatAmount4,
        getResultColor,
        loadMoreHistory,
        placeholderText,
        settleButtonText,
        minBet,
        maxBet,
        minPrediction,
        maxPrediction,
        handleBetAmountBlur,
        handlePredictionBlur,
        adjustPrediction,
        isSidebarOpen,
        openSidebar,
        closeSidebar,
        testCrashAnim,
        testWinAnim,
        currentTimeLabel
    };
  },
  components: {
    HomeRightSidebar
  }
};
</script>

<style scoped>
.crash-title {
  font-family: 'Geist', sans-serif;
  font-size: 60px;
  font-weight: 800;
  text-transform: uppercase;
  color: #e0e0e0;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  animation: breathing 3s ease-in-out infinite alternate;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
  display: inline-block;
  padding: 0 10px; /* Add padding to prevent clipping */
  line-height: 1.2; /* Ensure enough height */
}

.crash-title::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(255, 255, 255, 0.8) 50%,
    transparent 100%
  );
  transform: skewX(-25deg);
  animation: shine 4s infinite;
  pointer-events: none;
}

@keyframes shine {
  0%, 80% {
    left: -100%;
    opacity: 0;
  }
  85% {
    opacity: 1;
  }
  100% {
    left: 200%;
    opacity: 0;
  }
}

@keyframes breathing {
  0% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
    opacity: 0.85;
    transform: scale(1);
  }
  100% {
    text-shadow: 0 0 25px rgba(255, 255, 255, 0.9), 0 0 10px rgba(224, 224, 224, 0.6);
    opacity: 1;
    transform: scale(1.02);
  }
}

.crash-container {
  padding-bottom: 80px;
}
/* Card Style consistent with Home/Modal */
.crash-game-wrapper {
  background: var(--bg-2);
  border: 1px solid var(--line);
  border-radius: 28px;
  backdrop-filter: blur(16px);
  padding: 30px;
  margin-bottom: 30px;
}

.history-table-wrapper {
  background: var(--bg-2);
  border: 1px solid var(--line);
  border-radius: 28px;
  backdrop-filter: blur(16px);
  padding: 10px;
  margin-bottom: 30px;
}

.crash-game-wrapper {
  display: flex;
  gap: 30px;
  min-height: 500px;
}

.crash-controls {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}
.crash-canvas-container {
  flex-grow: 1;
  background: #000;
  /* border-radius: 0; Removed round corners */
  /* border: 1px solid #333; Restored border */
  position: relative;
  overflow: hidden;
}
canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.canvas-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
  z-index: 10;
  width: 100%; /* Ensure centering works well */
}
.multiplier-display {
  font-size: 5rem;
  font-weight: 800;
  text-shadow: 0 4px 20px rgba(0,0,0,0.5);
  font-family: 'Geist', sans-serif;
  line-height: 1;
  transition: transform 0.1s;
}

.result-status {
    font-size: 2rem;
    font-weight: 900;
    margin-top: 10px;
    letter-spacing: 2px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.8);
    animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.result-payout {
    font-size: 1.5rem;
    margin-top: 5px;
    animation: slideUpFade 0.5s ease-out 0.2s backwards;
}

/* Animations */
.crashed-anim {
    color: #ef4444 !important;
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    text-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
}

.won-anim {
    color: #22c55e !important;
    text-shadow: 0 0 20px rgba(34, 197, 94, 0.6);
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

@keyframes pulse-green {
    0% { transform: scale(1); text-shadow: 0 0 20px rgba(34, 197, 94, 0.6); }
    50% { transform: scale(1.1); text-shadow: 0 0 40px rgba(34, 197, 94, 0.9); }
    100% { transform: scale(1); text-shadow: 0 0 20px rgba(34, 197, 94, 0.6); }
}

@keyframes slideUpFade {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.3); }
  50% { opacity: 1; transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

.status-overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.6);
    padding: 20px;
    border-radius: 16px;
    backdrop-filter: blur(4px);
}

.status-message {
  font-size: 1rem;
  color: #aaa;
  margin-top: 10px;
}

.control-group label {
  color: var(--text-2);
  margin-bottom: 4px; /* Reduced from 8px */
  display: block;
  font-size: 14px;
}
.balance-text {
  font-size: 0.8rem;
  color: var(--text-2);
  opacity: 0.7;
  text-align: right;
  margin-top: 4px; /* Reduced from 6px */
}
.win-chance {
  font-size: 0.8rem;
  color: #666;
  margin-top: 2px; /* Reduced from 4px */
}

/* Input Styling */
.input-group {
    background-color: #0c0c0e;
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 6px;
    display: flex;
    align-items: center;
    transition: border-color 0.3s;
}
.input-group:focus-within {
    border-color: var(--primary);
}

.input-group .form-control {
    border: none !important;
    background: transparent !important;
    padding: 10px 15px !important;
    color: var(--white) !important;
    height: auto !important;
    box-shadow: none !important;
    font-size: 16px;
}

/* Append Buttons */
.input-group-append {
  display: flex;
  gap: 6px;
  padding-right: 6px;
}

.append-btn {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-2);
  border: 1px solid var(--line);
  width: 42px; 
  height: 38px; 
  border-radius: 10px;
  padding: 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
.append-btn:hover {
  background: var(--primary);
  color: var(--white);
  border-color: var(--primary);
}

/* Prediction Arrows */
.prediction-arrows {
  display: flex;
  height: 38px;
  width: 90px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--line);
  border-radius: 10px;
  overflow: hidden;
}

.arrow-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-2);
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.arrow-btn:hover:not(:disabled) {
  background: var(--primary);
  color: #fff;
}

.arrow-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.arrow-btn.left {
  border-right: 1px solid var(--line);
}

/* Action Buttons */
.action-btn-wrapper .tf-button {
  width: 100%;
  display: flex; 
  align-items: center; 
  justify-content: center;
  background: linear-gradient(0deg, rgba(20, 20, 21, 0.82), rgba(20, 20, 21, 0.82)),
        linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%);
  border: 1px solid var(--line);
  box-shadow: 0px 1px 1px 0px #FFFFFF2E inset, 0px 0px 4px 0px #FFFFFF0F inset;
  color: var(--text-2) !important;
  font-size: 16px;
  font-weight: 600;
  height: 56px !important;
  border-radius: 999px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.action-btn-wrapper .tf-button:hover:not(:disabled) {
    border-color: var(--primary);
    color: var(--primary) !important;
}

.action-btn-wrapper .tf-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Primary Action Buttons (Bet, Settle) */
.btn-bet, .btn-settle {
    background: var(--primary) !important;
    color: #fff !important;
    border-color: var(--primary) !important;
    box-shadow: none !important;
}

.btn-bet:hover:not(:disabled), .btn-settle:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
    color: #fff !important;
}

.history-tabs {
  margin-bottom: 15px;
}
.tab-btn {
  background: transparent;
  border: none;
  color: var(--text-2);
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  opacity: 0.6;
  transition: all 0.3s;
}
.tab-btn:hover {
    opacity: 1;
}
.tab-btn.active {
  color: #fff;
  opacity: 1;
  border-bottom-color: var(--primary);
}

.history-table-wrapper {
  overflow-x: auto;
  max-height: 500px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.history-table-wrapper table {
  white-space: nowrap;
  margin-bottom: 0;
  color: var(--text-2) !important;
  background-color: transparent !important;
  width: 100%;
}

.history-table-wrapper table th,
.history-table-wrapper table td {
  background-color: transparent !important;
  border-color: var(--line) !important;
  color: var(--text-2) !important;
  padding: 8px 6px; /* Reduced padding for compact view */
  font-size: 13px;  /* Slightly smaller font */
}

.history-table-wrapper table thead th {
    border-bottom: 1px solid var(--line) !important;
    color: var(--text-2) !important;
    font-weight: 600;
    position: sticky;
    top: 0;
    background-color: #141415 !important; 
    z-index: 1;
    opacity: 1;
    padding: 10px 6px; /* Header slightly taller but still compact */
}

.text-purple {
    color: #a855f7 !important;
}

.text-highlight-green {
    color: #22c55e !important;
    font-weight: 700;
    text-shadow: 0 0 10px rgba(34, 197, 94, 0.4);
}

.text-highlight-gold {
    color: #ffd700 !important;
    font-weight: 700;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
}

@media (max-width: 991px) {
  .crash-game-wrapper {
    flex-direction: column-reverse;
  }
  .crash-controls {
    width: 100%;
  }
  .crash-canvas-container {
    height: 300px;
  }
}
</style>
