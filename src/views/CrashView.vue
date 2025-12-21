<template>
  <div class="crash-view">
    <div class="section-page-title">
      <div class="sect-tagline">
        <div class="container">
          <div class="sect-tagline_inner">
            <span class="hafl-plus pst-left_bot wow bounceInScale"></span>
            <span class="hafl-plus pst-right_bot wow bounceInScale"></span>
            <div class="s-name text-caption font-2">
              <div class="breadcrumbs-list">
                <router-link to="/" class="text-white link font-2">HOME</router-link>
                <span>/</span>
                <span class="hacker-text_transform no-delay current-page">CRASH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span class="br-line"></span>
    </div>

    <section class="flat-spacing-2 crash-container">
      <div class="container">
        <div class="row">
          <!-- Game Section -->
          <div class="col-lg-12 mb-5">
            <div class="crash-game-wrapper">
              
              <!-- Left: Controls -->
              <div class="crash-controls">
                <div class="control-group">
                  <label class="font-2">{{ t('crash.betAmount') }}</label>
                  <div class="input-group">
                    <input 
                      type="number" 
                      v-model="betAmount" 
                      @blur="handleBetAmountBlur"
                      :disabled="gameState !== 'IDLE'"
                      :placeholder="`${minBet} - ${maxBet}`" 
                      :min="minBet"
                      :max="maxBet"
                      class="form-control font-2"
                    />
                    <div class="input-group-append">
                      <button class="font-2 append-btn" @click="setAmountPercent(0.5)" :disabled="gameState !== 'IDLE'">1/2</button>
                      <button class="font-2 append-btn" @click="setAmountPercent(2)" :disabled="gameState !== 'IDLE'">2x</button>
                      <button class="font-2 append-btn" @click="setMaxAmount" :disabled="gameState !== 'IDLE'">Max</button>
                    </div>
                  </div>
                  <div class="balance-text font-2">
                    {{ t('crash.balance', { amount: parseFloat(athBalance).toFixed(4) }) }}
                  </div>
                </div>

                <div class="control-group mt-3">
                  <label class="font-2">{{ t('crash.prediction') }}</label>
                  <div class="input-group">
                    <input 
                      type="number" 
                      v-model="prediction" 
                      @blur="handlePredictionBlur"
                      :disabled="gameState !== 'IDLE'"
                      :placeholder="placeholderText" 
                      step="0.01"
                      :min="minPrediction"
                      :max="maxPrediction"
                      class="form-control font-2"
                    />
                    <div class="input-group-append">
                      <div class="prediction-arrows">
                        <button class="arrow-btn left" @click="adjustPrediction(-1)" :disabled="gameState !== 'IDLE'">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
                        </button>
                        <button class="arrow-btn right" @click="adjustPrediction(1)" :disabled="gameState !== 'IDLE'">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="win-chance font-2">
                    {{ t('crash.winChance', { chance: winChance }) }}
                  </div> -->
                </div>

                <div class="action-btn-wrapper mt-4">
                  <!-- Connect Wallet -->
                  <button v-if="!walletState.isConnected" class="tf-button style-1 w-100" @click="connectWallet">
                    {{ t('crash.connectWallet') }}
                  </button>
                  
                  <!-- Approve -->
                  <button v-else-if="needsApproval" class="tf-button style-1 w-100" @click="handleApprove" :disabled="isApproving">
                    {{ isApproving ? t('crash.approving') : t('crash.approve') }}
                  </button>
                  
                  <!-- Bet -->
                  <button v-else-if="gameState === 'IDLE'" class="tf-button style-1 w-100 btn-bet" @click="handleBet" :disabled="isBetting">
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
                  <button v-else-if="gameState === 'ANIMATING' || gameState === 'RESULT'" class="tf-button style-1 w-100 disabled" disabled>
                    {{ t('crash.launching') }}
                  </button>
                </div>
              </div>

              <!-- Right: Canvas -->
              <div class="crash-canvas-container">
                <canvas ref="gameCanvas" id="crashCanvas"></canvas>
                
                <!-- Overlay Info -->
                <div class="canvas-overlay">
                  <div class="multiplier-display font-2" :class="multiplierClass">
                    {{ currentMultiplier.toFixed(2) }}x
                  </div>
                  <div v-if="gameState === 'RESULT'" class="result-message font-2" :class="{ 'text-success': lastGameWon, 'text-danger': !lastGameWon }">
                    {{ lastGameWon ? t('crash.youWon', { amount: lastPayout }) : t('crash.crashed') }}
                  </div>
                  <div v-if="gameState === 'WAITING_BLOCK'" class="status-message font-2">
                    {{ t('crash.waitingBlockOverlay') }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- History Section -->
          <div class="col-lg-12">
            <div class="history-tabs">
              <button class="tab-btn font-2" :class="{ active: activeTab === 'my' }" @click="activeTab = 'my'">{{ t('crash.myBets') }}</button>
              <button class="tab-btn font-2" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">{{ t('crash.allBets') }}</button>
            </div>
            
            <div class="history-table-wrapper">
              <table class="table font-2 text-white">
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
                    <td>{{ parseFloat(item.amount).toFixed(2) }}</td>
                    <td>{{ item.prediction.toFixed(2) }}x</td>
                    <td :class="getResultColor(item)">
                        {{ formatCrashPoint(item.crashPoint) }}
                    </td>
                    <td :class="{ 'text-success': item.won }">
                      {{ parseFloat(item.payout).toFixed(2) }}
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
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
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
        if (gameState.value === 'READY_TO_SETTLE' && expirationSeconds.value === 0) {
             // Technically we should check if we ever *had* time, but 0 usually means expired or just started.
             // If we entered READY_TO_SETTLE, we calc time. If it's 0, it means expired.
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
            if (currentBlock > bet.betBlock) {
                gameState.value = 'READY_TO_SETTLE';
            } else {
                gameState.value = 'WAITING_BLOCK';
                startBlockCheck(bet.betBlock);
            }
            
            // Restore inputs
            betAmount.value = bet.amount;
            prediction.value = bet.prediction.toFixed(2);
        } else {
            gameState.value = 'IDLE';
            drawIdleCanvas();
        }
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
                
                // Sync remaining time from chain
                const expiryBlock = targetBlock + 255;
                const remainingBlocks = Math.max(0, expiryBlock - current);
                // Update expirationSeconds based on latest block data
                const estimatedSeconds = Math.floor(remainingBlocks * 0.75); // 0.75s per block
                
                // Only update if significantly different to avoid jitter, OR if we just started tracking
                // But wait, if we are counting down smoothly, we don't want to jump up/down every second.
                // Let's take the chain data as "truth" but only apply it if our local countdown drifted too much (> 3s)
                if (Math.abs(expirationSeconds.value - estimatedSeconds) > 3 || expirationSeconds.value === 0) {
                     expirationSeconds.value = estimatedSeconds;
                }
                
                // Start smooth countdown if not running
                if (!countdownInterval) {
                    startCountdown();
                }
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
        gameState.value = 'SETTLING';
        const result = await settleBet();
        
        if (result) {
            console.log("Settle result:", result);
            
            if (result.voided) {
                showToast(t('crash.betExpired'));
                gameState.value = 'IDLE';
                return;
            }

            crashPoint.value = result.crashPoint;
            lastGameWon.value = result.won;
            lastPayout.value = result.payout;
            
            // Start Animation
            startAnimation(result.crashPoint);
        } else {
            // Failed to settle
            gameState.value = 'READY_TO_SETTLE';
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

        ctx.clearRect(0, 0, w, h);
        
        // Draw grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Simple grid
        for (let x = 0; x < w; x += 50) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
        for (let y = 0; y < h; y += 50) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
        ctx.stroke();

        // Draw static curve preview
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.quadraticCurveTo(w/2, h, w, h*0.2);
        ctx.stroke();
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
            
            // Formula: M = e^(0.00015 * t)
            // t in ms. e^(0.00015 * 10000) = e^1.5 = 4.48x in 10s.
            // e^(0.00015 * 20000) = e^3 = 20x in 20s.
            let nextM = Math.exp(0.00015 * elapsed);
            
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
        
        // Draw Grid (Same as idle)
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x < w; x += 50) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
        for (let y = 0; y < h; y += 50) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
        ctx.stroke();
        
        // Draw Curve
        // Map time (x) and multiplier (y) to canvas coords.
        // We need the curve to stay within view, so we scale the view based on current M.
        
        ctx.strokeStyle = multiplier >= parseFloat(prediction.value) ? '#00ff00' : '#ffffff';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(0, h); // Start bottom left
        
        // Plot points up to current time
        // We iterate pixels on X axis to map to time
        // Or better: iterate time steps
        
        // Viewport Logic: 
        // X axis: 0 to max(10s, current_time * 1.2)
        // Y axis: 1 to max(2x, current_M * 1.2)
        
        const maxTime = Math.max(10000, elapsed * 1.2);
        const maxMult = Math.max(2, multiplier * 1.2);
        
        for (let t = 0; t <= elapsed; t += 50) { // Step 50ms
            const m = Math.exp(0.00015 * t);
            
            const x = (t / maxTime) * w;
            const y = h - ((m - 1) / (maxMult - 1)) * h; // Map 1..maxMult to h..0
            
            ctx.lineTo(x, y);
        }
        
        // Line to current point
        const curX = (elapsed / maxTime) * w;
        const curY = h - ((multiplier - 1) / (maxMult - 1)) * h;
        ctx.lineTo(curX, curY);
        
        ctx.stroke();
        
        // Draw Rocket/Dot at tip
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(curX, curY, 6, 0, Math.PI * 2);
        ctx.fill();
    };

    const endGame = () => {
        gameState.value = 'RESULT';
        refreshBalance();
        loadHistory();
        
        // Reset to IDLE after 5 seconds
        setTimeout(() => {
            if (gameState.value === 'RESULT') {
                gameState.value = 'IDLE';
                betAmount.value = ''; // Optional: clear bet
                drawIdleCanvas();
            }
        }, 5000);
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
        return new Date(ts * 1000).toLocaleTimeString();
    };
    
    const formatAddr = (addr) => {
        if (!addr) return '???';
        return addr.substring(0, 6) + '...';
    };

    const formatCrashPoint = (val) => {
        if (val === 0) return 'Expired';
        if (val < 1.01) return '1.00x';
        return val.toFixed(2) + 'x';
    };

    const getResultColor = (item) => {
        if (item.crashPoint === 0) return 'text-danger'; // Timeout
        if (item.crashPoint < 1.01) return 'text-danger'; // Instant crash
        // For history
        if (item.crashPoint >= 10) return 'text-highlight-gold';
        if (item.crashPoint >= 2) return 'text-highlight-green';
        if (item.crashPoint >= 1.01 && item.crashPoint < 2) return 'text-purple'; // 1.01x - 1.99x Purple
        return 'text-white'; 
    };

    const loadHistory = async () => {
        if (activeTab.value === 'my') {
            const length = await getUserHistoryLength();
            const start = Math.max(0, length - 20);
            const raw = await getUserHistory(start, 20);
            historyData.value = raw.reverse(); // Newest first
        } else {
            // For global history
            const length = await getGlobalHistoryLength();
            const start = Math.max(0, length - 20);
            const raw = await getGlobalHistory(start, 20);
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
        if (gameState.value !== 'IDLE') return;
        
        let current = parseFloat(prediction.value);
        if (isNaN(current)) current = minPrediction.value; // Default to min if empty
        
        // If current is less than min (e.g. empty -> min), and we are adding, start from min.
        // If we are subtracting from min, stay at min.
        
        let newVal = current + delta;
        
        if (newVal < minPrediction.value) newVal = minPrediction.value;
        if (newVal > maxPrediction.value) newVal = maxPrediction.value;
        
        prediction.value = newVal.toFixed(2);
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
        adjustPrediction
    };
  }
};
</script>

<style scoped>
.crash-container {
  padding-bottom: 80px;
}
.crash-game-wrapper {
  display: flex;
  gap: 20px;
  background: #111;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 20px;
  min-height: 500px;
}
.crash-controls {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}
.crash-canvas-container {
  flex-grow: 1;
  background: #000;
  border-radius: 8px;
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
}
.multiplier-display {
  font-size: 4rem;
  font-weight: bold;
}
.result-message {
  font-size: 1.5rem;
  margin-top: 10px;
}
.status-message {
  font-size: 1rem;
  color: #aaa;
  margin-top: 10px;
}

.control-group label {
  color: #888;
  margin-bottom: 5px;
  display: block;
}
.balance-text {
  font-size: 0.8rem;
  color: #666;
  text-align: right;
  margin-top: 4px;
}
.win-chance {
  font-size: 0.8rem;
  color: #666;
  margin-top: 4px;
}

/* Ensure input group append items stay inline */
.input-group-append {
  display: flex;
}

/* Fix for invisible text in buttons */
.append-btn {
  background: #333;
  color: #fff;
  border: 1px solid #444;
  width: 42px; /* Fixed width for consistency */
  height: 46px; /* Match input height if standard is ~45-46px */
  padding: 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.append-btn:hover {
  background: #444;
}

/* Ensure input height matches */
.input-group .form-control {
    height: 46px;
}

.prediction-arrows {
  display: flex;
  flex-direction: row;
  height: 46px;
  border: 1px solid #444;
  border-left: none;
  background: #333;
  width: 126px; /* Match top buttons (42*3) */
}

.arrow-btn {
  flex: 1; /* Distribute space evenly */
  background: transparent;
  border: none;
  color: #888;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.arrow-btn:hover:not(:disabled) {
  background: #444;
  color: #fff;
}

.arrow-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.arrow-btn.left {
  border-right: 1px solid #444;
}

/* Fix for action buttons container */
.action-btn-wrapper .tf-button {
  color: #fff !important; /* Force white text */
}
.action-btn-wrapper .tf-button.disabled {
  background: #333 !important;
  color: #888 !important;
  border-color: #444 !important;
  cursor: not-allowed;
}

.btn-bet {
    font-size: 1.3rem !important;
    font-weight: 800 !important;
    height: 56px !important;
    background: #333 !important;
    color: #fff !important;
    border: 1px solid #444 !important;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    margin-top: 10px;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
}

.btn-bet:hover:not(:disabled) {
    background: #444 !important;
    transform: translateY(-2px);
}

.btn-settle {
    font-size: 1.3rem !important;
    font-weight: 800 !important;
    height: 56px !important;
    background: #333 !important;
    color: #fff !important;
    border: 1px solid #444 !important;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    margin-top: 10px;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
}

.btn-settle:hover {
    background: #444 !important;
    transform: translateY(-2px);
}

.history-tabs {
  margin-bottom: 15px;
}
.tab-btn {
  background: transparent;
  border: none;
  color: #666;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}
.tab-btn.active {
  color: #fff;
  border-bottom-color: #fff;
}
.history-table-wrapper {
  background: #111;
  border-radius: 8px;
  padding: 15px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.history-table-wrapper table {
  white-space: nowrap;
  margin-bottom: 0;
  color: #fff !important;
  background-color: transparent !important;
}

.history-table-wrapper table th,
.history-table-wrapper table td {
  background-color: transparent !important;
  border-color: #333 !important;
  color: #fff !important;
}

.history-table-wrapper table thead th {
    border-bottom: 2px solid #444 !important;
    color: #888 !important;
    font-weight: 600;
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
