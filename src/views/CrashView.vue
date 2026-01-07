<template>
  <div class="crash-view">
    <div class="section-page-title">
      <div class="sect-tagline">
        <div class="container">
          <div class="sect-tagline_inner">
            <span class="hafl-plus pst-left_bot wow bounceInScale"></span>
            <span class="hafl-plus pst-right_bot wow bounceInScale"></span>
            <div class="s-name text-caption " style="display: flex; flex-direction: column; align-items: center; padding-bottom: 10px !important;">
              <div class="breadcrumbs-list" style="font-size: 30px; margin-top: 0px; margin-bottom: 0px;">
                <!-- <router-link to="/" class="text-white link ">BLAST</router-link>
                <span> & </span> -->
                <span class="crash-title no-delay">BLAST</span>
              </div>
              
              <!-- Recent Winners Ticker -->
              <div class="recent-winners-ticker-container">
                  <TransitionGroup name="list" tag="div" class="recent-winners-ticker" ref="tickerRef">
                     <div class="winner-item" 
                          v-for="w in visibleWinners" 
                          :key="w.id"
                          :class="w.displayValue >= 2 ? 'theme-bg' : 'gray-blue-bg'">
                        <span class="winner-mult">{{ (w.displayValue < 1.01 ? 1.00 : w.displayValue).toFixed(2) }}x</span>
                     </div>
                  </TransitionGroup>
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
                      @input="(e) => handleInput(e, 'bet', 4)"
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
                  <div class="balance-text " :class="{ 'text-danger': isInsufficientBalance }">
                    {{ t('crash.balance', { amount: formatAmount4(athBalance) }) }}
                  </div>
                </div>

                <div class="control-group mt-1">
                  <label class="">{{ t('crash.prediction') }}</label>
                  <div class="input-group">
                    <input 
                      type="number" 
                      v-model="prediction" 
                      @blur="handlePredictionBlur"
                      @input="(e) => handleInput(e, 'prediction', 2)"
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

                <div class="action-btn-wrapper mt-2">
                  <!-- Connect Wallet -->
                  <button v-if="!walletState.isConnected" class="tf-button style-1 w-100" @click="connectWallet">
                    {{ t('crash.connectWallet') }}
                  </button>
                  
                  <!-- Approve -->
                  <button v-else-if="needsApproval" class="tf-button style-1 w-100 btn-approve-highlight" @click="handleApprove" :disabled="isApproving">
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
                  <div v-else-if="gameState === 'READY_TO_SETTLE'" class="w-100">
                    <button class="tf-button style-1 w-100 btn-settle" @click="handleSettle" :class="{ 'btn-expired': expirationSeconds === 0, 'btn-pulse-border': expirationSeconds > 0 }">
                        <span v-if="expirationSeconds > 0">{{ t('crash.clickToSettle') }}</span>
                        <span v-else>{{ t('crash.settleExpired') }}</span>
                        <span v-if="expirationSeconds > 0" class="countdown-timer text-warning" style="margin-left: 8px;">
                            {{ expirationSeconds }}s
                        </span>
                    </button>
                    <div class="settle-tip mt-2 text-warning" style="font-size: 11px; line-height: 1.4;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 4px; display: inline-block; vertical-align: middle;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                        <span v-if="expirationSeconds > 0">{{ t('crash.settleTip1') }}</span>
                        <span v-else>{{ t('crash.settleTip2') }}</span>
                    </div>
                  </div>

                   <!-- Settling -->
                  <button v-else-if="gameState === 'SETTLING'" class="tf-button style-1 w-100 disabled" disabled>
                    <span v-if="isExpiredSettle">{{ t('crash.preparingNextRound') }}</span>
                    <span v-else>{{ t('crash.settling') }}</span>
                  </button>
                  
                  <!-- Animating -->
                  <button v-else-if="gameState === 'ANIMATING'" class="tf-button style-1 w-100 disabled" disabled>
                    {{ t('crash.launching') }}
                  </button>
                  
                  <!-- <div class="debug-buttons mt-2" style="display: flex; gap: 10px;">
                    <button class="tf-button style-1 w-33" @click="testCrashAnim" style="height: 40px !important; font-size: 12px; background: #333; border: 1px solid #555;">Test Crash</button>
                    <button class="tf-button style-1 w-33" @click="testWinAnim" style="height: 40px !important; font-size: 12px; background: #333; border: 1px solid #555;">Test Win</button>
                    <button class="tf-button style-1 w-33" @click="testSettle" style="height: 40px !important; font-size: 12px; background: #333; border: 1px solid #555;">Test Settle</button>
                  </div> -->
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
                      
                      <!-- Current Payout (Animating) - HIDDEN as per request (inaccurate estimate)
                      <div v-if="gameState === 'ANIMATING'" class="current-payout text-highlight-gold" style="font-size: 1.5rem; font-weight: bold; margin-top: 5px; text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);">
                          +{{ (parseFloat(betAmount || 0) * currentMultiplier).toFixed(4) }} ATH
                      </div>
                      -->

                      <!-- Result Status Text -->
                      <div v-if="gameState === 'RESULT'" class="result-status " :class="lastGameWon ? 'text-success' : 'text-danger'">
                        {{ lastGameWon ? t('crash.resultWon') : t('crash.resultLost') }}
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
            <div class="history-tabs d-flex justify-content-between align-items-center">
              <div class="left-tabs" style="display: flex;">
                <button class="tab-btn " :class="{ active: activeTab === 'my' }" @click="switchTab('my')">{{ t('crash.myBets') }}</button>
                <button class="tab-btn " :class="{ active: activeTab === 'all' }" @click="switchTab('all')">{{ t('crash.allBets') }}</button>
              </div>
              <div class="right-tabs" style="display: flex;">
                <button class="tab-btn " :class="{ active: activeTab === 'rules' }" @click="switchTab('rules')">{{ t('crash.rules') }}</button>
                <button class="tab-btn " :class="{ active: activeTab === 'fairness' }" @click="switchTab('fairness')">{{ t('crash.fairness') }}</button>
              </div>
            </div>
            
            <div class="history-table-wrapper" v-if="activeTab === 'my' || activeTab === 'all'">
              <table class="table  text-white">
                <thead>
                  <tr>
                    <th>{{ t('crash.betCol') }}</th>
                    <th>{{ t('crash.predictionCol') }}</th>
                    <th>{{ t('crash.result') }}</th>
                    <th>{{ t('crash.payout') }}</th>
                    <th>{{ t('crash.block') }}</th>
                    <th v-if="activeTab === 'all'">{{ t('crash.player') }}</th>
                    <th>{{ t('crash.time') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in historyData" :key="index">
                    <td>{{ formatAmount4(item.amount) }}</td>
                    <td>{{ item.prediction.toFixed(2) }}x</td>
                    <td :class="getResultColor(item)">
                        {{ formatCrashPoint(item.crashPoint) }}
                    </td>
                    <td :class="{ 'text-success': item.won }">
                      {{ formatAmount4(item.payout) }}
                    </td>
                    <td>
                        <a :href="`${explorerBaseUrl}/block/${item.betBlock}`" target="_blank" class="text-primary" style="text-decoration: none; font-family: monospace;">
                            {{ item.betBlock }}
                        </a>
                    </td>
                    <td v-if="activeTab === 'all'">{{ formatAddr(item.player) }}</td>
                    <td>{{ formatTime(item.timestamp) }}</td>
                  </tr>
                  <tr v-if="historyData.length === 0">
                    <td colspan="7" class="text-center">{{ t('crash.noHistory') }}</td>
                  </tr>
                </tbody>
              </table>
              
              <!-- Simple Pagination -->
              <div class="pagination-controls mt-3 text-center" v-if="hasMoreHistory">
                <button class="btn-sm btn-outline-light" @click="loadMoreHistory">{{ t('crash.loadMore') }}</button>
              </div>
            </div>

            <!-- Rules Content -->
            <div class="history-table-wrapper text-white p-4" v-if="activeTab === 'rules'">
                <h4 class="mb-3">{{ t('crash.rules') }}</h4>
                <div style="white-space: pre-line; line-height: 1.6; color: var(--text-2);">
                    {{ t('crash.rulesContent') }}
                </div>
            </div>

            <!-- Fairness Content -->
            <div class="history-table-wrapper text-white p-4" v-if="activeTab === 'fairness'">
                <h4 class="mb-4 text-highlight-gold" style="font-family: 'Geist', sans-serif;">{{ t('crash.fairness') }}</h4>
                <p class="mb-4" style="color: var(--text-2); line-height: 1.6;">
                     {{ t('crash.fairnessContent') }}
                </p>

                <!-- Steps -->
                <div class="fairness-steps">
                    <div class="step-item mb-4">
                        <h5 class="text-white mb-2" style="font-size: 1.1rem;">{{ t('crash.fairness.step1') }}</h5>
                        <p class="small" style="color: var(--text-2);">{{ t('crash.fairness.step1Desc') }}</p>
                    </div>
                    <div class="step-item mb-4">
                        <h5 class="text-white mb-2" style="font-size: 1.1rem;">{{ t('crash.fairness.step2') }}</h5>
                        <p class="small" style="color: var(--text-2);">{{ t('crash.fairness.step2Desc') }}</p>
                    </div>
                    <div class="step-item mb-4">
                        <h5 class="text-white mb-2" style="font-size: 1.1rem;">{{ t('crash.fairness.step3') }}</h5>
                        <p class="small" style="color: var(--text-2);">{{ t('crash.fairness.step3Desc') }}</p>
                    </div>
                </div>

                <!-- Calculator -->
                <div class="verification-calculator p-4" style="background: rgba(0,0,0,0.3); border-radius: 16px; border: 1px solid var(--line);">
                    <h5 class="mb-3 text-white">{{ t('crash.fairness.calcTitle') }}</h5>
                    
                    <div class="form-group mb-3">
                        <label class="small mb-1" style="color: var(--text-2);">{{ t('crash.fairness.addrLabel') }}</label>
                        <input type="text" v-model="verifyAddress" class="form-control text-white verify-input" style="background: rgba(255,255,255,0.05); border-color: var(--line);" placeholder="0x...">
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                             <label class="small mb-1" style="color: var(--text-2);">{{ t('crash.fairness.edgeLabel') }}</label>
                             <input type="number" v-model="verifyEdge" readonly class="form-control text-white verify-input" style="background: rgba(255,255,255,0.05); border-color: var(--line);" placeholder="10">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="small mb-1" style="color: var(--text-2);">{{ t('crash.fairness.blockLabel') }}</label>
                            <input type="number" v-model="verifyBlock" class="form-control text-white verify-input" style="background: rgba(255,255,255,0.05); border-color: var(--line);" placeholder="12345678">
                        </div>
                    </div>
                    
                    <div class="form-group mb-4">
                        <label class="small mb-1" style="color: var(--text-2);">{{ t('crash.fairness.hashLabel') }}</label>
                        <input type="text" v-model="verifyHash" class="form-control text-white verify-input" style="background: rgba(255,255,255,0.05); border-color: var(--line);" placeholder="0x...">
                    </div>
                    
                    <button class="tf-button style-1 w-100 mb-3 btn-bet" @click="verifyFairness">
                        {{ t('crash.fairness.verifyBtn') }}
                    </button>
                    
                    <!-- Result -->
                    <div v-if="verifyResult" class="result-box text-center p-3" style="background: rgba(255,255,255,0.1); border-radius: 12px;">
                        <div class="small mb-1" style="color: var(--text-2);">{{ t('crash.fairness.resultLabel') }}</div>
                        <div class="h2 mb-0" :class="verifyResult === 'Error' ? 'text-danger' : 'text-success'">
                            {{ verifyResult }}
                        </div>
                    </div>
                </div>

                <!-- Why Block Hash -->
                <div class="mt-5">
                    <h5 class="text-white mb-2" style="font-size: 1.1rem;">{{ t('crash.fairness.whyHash') }}</h5>
                    <p class="small mb-4" style="line-height: 1.6; color: var(--text-2);">{{ t('crash.fairness.whyHashDesc') }}</p>

                    <!-- Formula Section -->
                    <div class="formula-section p-4" style="background: rgba(0,0,0,0.4); border: 1px solid var(--line); border-radius: 12px;">
                        <h6 class="text-white mb-4" style="font-family: 'Times New Roman', Times, serif; font-size: 1.1rem; font-style: italic; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">{{ t('crash.fairness.formulaTitle') }}</h6>
                        
                        <div class="math-content mb-4" style="font-family: 'Times New Roman', Times, serif; color: #e2e8f0; font-size: 1.2rem; line-height: 1.8;">
                            <!-- Seed Formula -->
                            <div class="equation mb-3 d-flex align-items-center justify-content-center">
                                <span class="var">S</span>
                                <span class="mx-2">=</span>
                                <span class="func">Keccak256</span>
                                <span>(</span>
                                <span class="var-highlight">H</span>
                                <span class="mx-1">,</span>
                                <span class="var-highlight">A</span>
                                <span class="mx-1">,</span>
                                <span class="var-highlight">B</span>
                                <span>)</span>
                            </div>

                            <!-- Random Value Formula -->
                            <div class="equation mb-3 d-flex align-items-center justify-content-center">
                                <span class="var">R</span>
                                <span class="mx-2">=</span>
                                <span class="var">S</span>
                                <span class="mx-2 math-op">mod</span>
                                <span>10000</span>
                            </div>

                            <!-- Multiplier Formula -->
                            <div class="equation mb-2 d-flex align-items-center justify-content-center">
                                <span class="var">Multiplier</span>
                                <span class="mx-2">=</span>
                                <div class="fraction d-inline-flex flex-column align-items-center" style="vertical-align: middle;">
                                    <span class="numerator" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 2px;">10000 <span class="math-op">&times;</span> (1 <span class="math-op">&minus;</span> <span class="var-highlight">E</span>)</span>
                                    <span class="denominator" style="padding-top: 2px;">10000 <span class="math-op">&minus;</span> <span class="var">R</span></span>
                                </div>
                            </div>
                        </div>

                        <!-- Legend -->
                        <div class="legend small pt-3" style="border-top: 1px solid rgba(255,255,255,0.1);">
                            <div class="row g-2">
                                <div class="col-6 mb-1">
                                    <span class="var-highlight me-2">H</span> = {{ t('crash.fairness.hashLabel') }}
                                </div>
                                <div class="col-6 mb-1">
                                    <span class="var-highlight me-2">A</span> = {{ t('crash.fairness.addrLabel') }}
                                </div>
                                <div class="col-6 mb-1">
                                    <span class="var-highlight me-2">B</span> = {{ t('crash.fairness.blockLabel') }}
                                </div>
                                <div class="col-6 mb-1">
                                    <span class="var-highlight me-2">E</span> = {{ t('crash.fairness.edgeLabel') }}
                                </div>
                            </div>
                        </div>
                        <!-- Formula Annotations -->
                        <div class="mt-4 pt-3" style="border-top: 1px solid rgba(255,255,255,0.1); color: var(--text-2); font-size: 0.9rem;">
                            <div class="mb-2">
                                <span class="func fw-bold text-white">Keccak256:</span> {{ t('crash.fairness.formula.keccak') }}
                            </div>
                            <div class="mb-2">
                                <span class="math-op fw-bold text-white">mod:</span> {{ t('crash.fairness.formula.mod') }}
                            </div>
                            <div class="mb-0">
                                <span class="var fw-bold text-white">Multiplier:</span> {{ t('crash.fairness.formula.multiplier') }}
                            </div>
                        </div>
                    </div>

                    <!-- Third-Party Verification -->
                    <div v-if="verifyInputHex" class="third-party-verify p-4 mt-4" style="border: 1px dashed var(--line); border-radius: 12px; background: rgba(255, 255, 255, 0.02);">
                        <h6 class="text-white mb-2" style="font-family: 'Times New Roman', Times, serif; font-style: italic;">{{ t('crash.fairness.thirdPartyTitle') }}</h6>
                        <p class="small mb-3" style="color: var(--text-2);">{{ t('crash.fairness.thirdPartyDesc') }}</p>
                        
                        <!-- Data Composition Breakdown -->
                        <div class="mb-4">
                            <label class="small mb-2 text-white" style="font-weight: 600;">{{ t('crash.fairness.dataComposition') }}</label>
                            <p class="small mb-2" style="color: var(--text-2); font-size: 11px;" v-html="t('crash.fairness.dataCompositionDesc')"></p>
                            
                            <div class="composition-box p-3" style="background: rgba(0,0,0,0.3); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                                <!-- Hash -->
                                <div class="mb-2">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <span class="small" style="color: #a0aec0; font-size: 11px;">1. {{ t('crash.fairness.hashLabel') }} (bytes32)</span>
                                    </div>
                                    <div class="text-break text-monospace" style="color: #e2e8f0; font-family: monospace; font-size: 11px; word-break: break-all;">
                                        {{ verifyInputPartHash }}
                                    </div>
                                </div>
                                <!-- Address -->
                                <div class="mb-2">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <span class="small" style="color: #a0aec0; font-size: 11px;">2. {{ t('crash.fairness.addrLabel') }} (address)</span>
                                    </div>
                                    <div class="text-break text-monospace" style="color: #e2e8f0; font-family: monospace; font-size: 11px; word-break: break-all;">
                                        {{ verifyInputPartAddr }}
                                    </div>
                                </div>
                                <!-- Block -->
                                <div class="mb-1">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <span class="small" style="color: #a0aec0; font-size: 11px;">3. {{ t('crash.fairness.blockLabel') }} (uint256)</span>
                                    </div>
                                    <div class="text-break text-monospace" style="color: #e2e8f0; font-family: monospace; font-size: 11px; word-break: break-all;">
                                        {{ verifyBlock }}
                                    </div>
                                </div>
                            </div>
                            <div class="text-center my-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                            </div>
                        </div>

                        <!-- Step 1 -->
                        <div class="mb-3">
                            <label class="small mb-1 text-white">{{ t('crash.fairness.copyInput') }}</label>
                            <div class="input-group">
                                <textarea class="form-control" :value="verifyInputHex" readonly rows="3" style="font-family: monospace; font-size: 12px; background: rgba(0,0,0,0.2) !important; color: #a855f7 !important; resize: vertical;"></textarea>
                                <button class="btn btn-outline-secondary" type="button" @click="copyHexInput" style="height: auto;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                </button>
                            </div>
                        </div>

                        <!-- Step 2 -->
                        <div class="mb-3 mt-4 pt-3" style="border-top: 1px dashed rgba(255,255,255,0.1);">
                            <label class="small mb-2 text-white">{{ t('crash.fairness.tp_step2Title') }}</label>
                            <p class="small mb-3" style="color: var(--text-2); line-height: 1.5;" v-html="t('crash.fairness.tp_step2Desc')"></p>
                            <a href="https://emn178.github.io/online-tools/keccak_256.html" target="_blank" class="d-block">
                                <button class="btn btn-sm btn-outline-light w-100" style="text-align: left; display: flex; justify-content: space-between; align-items: center;">
                                    <span>{{ t('crash.fairness.toolLinkText') }}</span>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                </button>
                            </a>
                        </div>
                        
                        <!-- Step 3: Hex to Decimal -->
                        <div class="mb-3 mt-4 pt-3" style="border-top: 1px dashed rgba(255,255,255,0.1);" v-if="verifySeedHex">
                            <label class="small mb-2 text-white">{{ t('crash.fairness.tp_step3Title') }}</label>
                            <p class="small mb-3" style="color: var(--text-2); line-height: 1.5;" v-html="t('crash.fairness.tp_step3Desc')"></p>
                            
                            <a href="https://www.binaryhexconverter.com/hex-to-decimal-converter" target="_blank" class="d-block">
                                <button class="btn btn-sm btn-outline-light w-100" style="text-align: left; display: flex; justify-content: space-between; align-items: center;">
                                    <span>{{ t('crash.fairness.step4Tool') }}</span>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                </button>
                            </a>
                        </div>

                        <!-- Step 4: Final Calculation -->
                        <div class="mb-3 mt-4 pt-3" style="border-top: 1px dashed rgba(255,255,255,0.1);" v-if="verifySeedHex">
                            <label class="small mb-2 text-white">{{ t('crash.fairness.tp_step4Title') }}</label>
                            <p class="small mb-0" style="color: var(--text-2); line-height: 1.6; white-space: pre-line;" v-html="t('crash.fairness.tp_step4Desc')"></p>
                        </div>
                    </div>
                </div>
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
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import { solidityPackedKeccak256, solidityPacked } from 'ethers';
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
  getGameConfig,
  DEFAULT_PREDICTION
} from '../services/crash';
import { walletState, connectWallet as walletConnect } from '../services/wallet';
import { APP_ENV } from '../services/environment';
import { showToast } from '../services/notification';
import { t } from '../i18n';

export default {
  name: 'CrashView',
  setup() {
    // --- State ---
    const gameState = ref('IDLE'); // IDLE, BETTING, WAITING_BLOCK, READY_TO_SETTLE, SETTLING, ANIMATING, RESULT
    const betAmount = ref('');
    const prediction = ref(DEFAULT_PREDICTION.toFixed(2));
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

    const minBet = ref(0.01);
    const maxBet = ref(100);
    const minPrediction = ref(1.01);
    const maxPrediction = ref(100);

    const expirationSeconds = ref(0); // Seconds until expiration
    const isExpiredSettle = ref(false); // Flag to track if we are settling an expired bet
    const currentTimeLabel = ref(0); // Current elapsed time in seconds for display

    const recentWinners = ref([]); // Pool of winners to show
    const visibleWinners = ref([]); // Currently visible winners
    let winnersInterval = null;
    let tickerInterval = null;
    const tickerRef = ref(null);
    const isTickerPaused = ref(false); // Controls ticker updates to avoid spoilers

    // Fairness Calculator State
    const verifyAddress = ref('');
    const verifyBlock = ref('');
    const verifyHash = ref('');
    const verifyEdge = ref(10);
    const verifyResult = ref(null);
    const verifyStatus = ref(''); 
    const verifyInputHex = ref('');
    const verifySeedHex = ref('');
    const verifyInputPartHash = ref('');
    const verifyInputPartAddr = ref('');
    const verifyInputPartBlock = ref('');

    watch(() => walletState.address, (addr) => {
        if (addr && !verifyAddress.value) verifyAddress.value = addr;
    }, { immediate: true });

    const verifyFairness = () => {
        if (!walletState.isConnected) {
            showToast(t('toast.connectWalletFirst'));
            return;
        }

        try {
            verifyStatus.value = '';
            verifyResult.value = null;

            if (!verifyAddress.value || !verifyBlock.value || !verifyHash.value) {
                 showToast(t('crash.fairness.inputError'));
                 return;
            }

            // Clean inputs
            const addr = verifyAddress.value.trim();
            const blockNum = verifyBlock.value.toString().trim();
            const hash = verifyHash.value.trim();
            const edge = parseInt(verifyEdge.value);

            // Calculate Seed: keccak256(abi.encodePacked(blockHash, player, betBlock))
            // Note: Order matters! Contract: keccak256(abi.encodePacked(blockHash, msg.sender, b.betBlock))
            // Ethers v6 solidityPackedKeccak256 expects (types, values)
            const seed = solidityPackedKeccak256(
                ['bytes32', 'address', 'uint256'],
                [hash, addr, blockNum]
            );
            verifySeedHex.value = seed;

            // Generate raw hex for third-party verification
            // The input to Keccak256 is the packed bytes of the arguments
            verifyInputPartHash.value = hash;
            verifyInputPartAddr.value = addr;
            verifyInputPartBlock.value = solidityPacked(['uint256'], [blockNum]);
            
            // For simple concatenation: Hash + Address (raw) + Block (raw 32 bytes)
            // solidityPacked handles this correctly.
            // Removing 0x prefix if user prefers manual copy without it?
            // But usually hex tools handle 0x.
            // If the user says "Spliced data is wrong", maybe they mean the VISUAL "+" signs.
            
            // User requested direct splicing: Hash + Address + Block(hex)
            // Also remove leading 0x from hash
            verifyInputHex.value = hash.replace(/^0x/i, '') + addr.replace(/^0x/i, '') + BigInt(blockNum).toString(16).padStart(64, '0');

            // Calculate Crash Point
            // h = seed % 10000
            const seedBig = BigInt(seed);
            const h = seedBig % 10000n;
            
            // multiplier = (10000 - edge*100) * 100 / (10000 - h)
            const houseEdgeVal = BigInt(edge);
            const numerator = (10000n - houseEdgeVal * 100n) * 100n;
            const denominator = 10000n - h;
            
            if (denominator === 0n) {
                verifyResult.value = 'Infinity'; 
                return;
            }

            // We do integer division first as per solidity, then convert to float for display
            // But to display decimals accurately we can just do float division here
            // Contract uses integer division.
            // Example: 900000 / 10000 = 90.
            // 900000 / 9000 = 100.
            
            const crashPointBig = numerator / denominator;
            const resultDisplay = Number(crashPointBig) / 100;
            
            verifyResult.value = resultDisplay.toFixed(2) + 'x';
            verifyStatus.value = 'match'; 
            
        } catch (e) {
            console.error("Verification error:", e);
            verifyStatus.value = 'mismatch'; 
            verifyResult.value = "Error";
            showToast("Verification failed: " + e.message);
        }
    };

    const copyHexInput = async () => {
        if (!verifyInputHex.value) return;
        copyToClipboard(verifyInputHex.value);
    };

    const copySeedHex = async () => {
        if (!verifySeedHex.value) return;
        copyToClipboard(verifySeedHex.value);
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            showToast(t('toast.copied'));
        } catch (err) {
            // Fallback for non-secure contexts
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                showToast(t('toast.copied'));
            } catch (e) {
                showToast(t('toast.copyFailed'));
            }
            document.body.removeChild(textArea);
        }
    };

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

    const explorerBaseUrl = computed(() => {
        return APP_ENV === 'PROD' ? 'https://bscscan.com' : 'https://testnet.bscscan.com';
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

    const isInsufficientBalance = computed(() => {
        const bal = parseFloat(athBalance.value || 0);
        const amount = parseFloat(betAmount.value || 0);
        // 如果余额为0，显示红色
        if (bal === 0) return true;
        // 如果输入了金额且金额大于余额，显示红色
        if (amount > 0 && amount > bal) return true;
        return false;
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
        // Start winners feed immediately to show results ASAP
        await fetchRecentWinners();
        startTicker(); // Ticker will auto-fill if visible is empty
        winnersInterval = setInterval(fetchRecentWinners, 4000);

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
        clearInterval(winnersInterval);
        clearInterval(tickerInterval);
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

    const fetchRecentWinners = async () => {
        try {
            const length = await getGlobalHistoryLength();
            if (length === 0) return;
            
            // Fetch last 50 to find winners
            const size = 50;
            const start = Math.max(0, length - size);
            const raw = await getGlobalHistory(start, size);
            
            // Show ALL results (both won and lost/crashed)
            // Sort by timestamp or block number ascending (oldest first)
            // Filter out "Expired" (crashPoint === 0)
            const allResults = raw
                .filter(item => item.crashPoint > 0)
                .sort((a, b) => a.timestamp - b.timestamp);
            
            // Update pool of potential winners to show
            // Add unique ID to facilitate keying
            // Use crashPoint (result) instead of prediction
            const newPool = allResults.map(w => ({
                ...w,
                displayValue: w.crashPoint, 
                id: `${w.betBlock}-${w.player}-${w.crashPoint}`
            }));
            
            // If we have no visible winners (initial load), fill it up with latest 4
            // But user wants "one by one" rolling effect. 
            // So we don't initialize visibleWinners directly. 
            // We just update recentWinners, and let the ticker handle the "rolling in".
            
            // However, to avoid showing 100 items rolling in, we should ensure recentWinners 
            // only contains the items we WANT to eventually show (or close to it).
            // But recentWinners is also our history cache.
            
            // Logic update: recentWinners is the SOURCE. Ticker moves items from Source to Visible.
            // If visible is empty, Ticker should start picking from (Source.length - 4).
            
            recentWinners.value = newPool;
        } catch (e) {
            console.error("Error fetching winners:", e);
        }
    };

    // Ticker logic: Adds one item from recentWinners to visibleWinners every few seconds
    // shifting the oldest out if length > 4
    const startTicker = () => {
         // Clear existing
         if (tickerInterval) clearInterval(tickerInterval);
         
         tickerInterval = setInterval(() => {
             // Pause ticker during animation and shortly after to avoid spoilers
             if (isTickerPaused.value) return;

             // Find next item to show
             // We want to show the next item from recentWinners that is NOT in visibleWinners
             // Assuming recentWinners is sorted Old -> New.
             
             if (recentWinners.value.length === 0) return;
             
             // Initial fill logic: if empty, start from the last 4 items
             if (visibleWinners.value.length === 0) {
                 const startIndex = Math.max(0, recentWinners.value.length - 4);
                 // Push the first one
                 visibleWinners.value.push(recentWinners.value[startIndex]);
                 return;
             }
             
             // Get the last item in visible
             const lastVisible = visibleWinners.value[visibleWinners.value.length - 1];
             
             // Find index of lastVisible in recentWinners
             const idx = recentWinners.value.findIndex(w => w.id === lastVisible.id);
             
             let nextItem = null;
             
             if (idx !== -1 && idx < recentWinners.value.length - 1) {
                 // There is a newer item
                 nextItem = recentWinners.value[idx + 1];
             } else if (idx === -1) {
                 // lastVisible not found in recent (maybe list refreshed completely), take latest
                 // To be safe, if we are completely lost, maybe reset or take (end-3)?
                 // Let's just take the one after (length-4) if possible to restart the flow
                 // Or just take the very last one?
                 nextItem = recentWinners.value[recentWinners.value.length - 1];
                 
                 // Prevent duplicates if nextItem is already in visible (e.g. at other position)
                 if (visibleWinners.value.some(w => w.id === nextItem.id)) {
                     nextItem = null;
                 }
             }
             
             if (nextItem) {
                 // Add next item
                 visibleWinners.value.push(nextItem);
                 // remove first if length > 4
                 if (visibleWinners.value.length > 4) {
                     visibleWinners.value.shift();
                 }
             }
             
         }, 1000); // Update every 1 second (faster)
    };

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
        
        // Always draw idle canvas to show axes
        drawIdleCanvas();

        if (bet && bet.betBlock > 0) {
            console.log("Found active bet:", bet);
            // Check if we need to wait for block or can settle
            const provider = walletState.signer?.provider;
            if (!provider) return; // Should be connected
            
            const currentBlock = await provider.getBlockNumber();
            
            // Restore inputs
            betAmount.value = bet.amount;
            prediction.value = bet.prediction.toFixed(2);

            if (currentBlock > bet.betBlock) {
                // Initialize countdown for existing bet
                const expiryBlock = bet.betBlock + 255;
                const remainingBlocks = Math.max(0, expiryBlock - currentBlock);
                const estimatedSeconds = Math.ceil(remainingBlocks * 0.75); // 0.75s per block approx on BSC/similar

                expirationSeconds.value = estimatedSeconds;
                if (remainingBlocks > 0) {
                     startCountdown();
                }
                
                gameState.value = 'READY_TO_SETTLE';
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
            console.log(`[区块监听] 当前区块: ${current}, 目标投注区块: ${targetBlock}, 是否满足(当前 > 目标): ${current > targetBlock}`);
            
            if (current > targetBlock) {
                console.log("[区块监听] 区块条件满足，切换至 READY_TO_SETTLE");
                // Sync remaining time from chain ONCE
                const expiryBlock = targetBlock + 255;
                const remainingBlocks = Math.max(0, expiryBlock - current);
                const estimatedSeconds = Math.ceil(remainingBlocks * 0.75); // 0.75s per block
                
                expirationSeconds.value = estimatedSeconds;
                if (estimatedSeconds > 0) startCountdown();

                gameState.value = 'READY_TO_SETTLE';

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
        const val = parseFloat(betAmount.value || 0);
        const bal = parseFloat(athBalance.value || 0);
        
        if (val > bal) {
             showToast(t('crash.insufficientBalance'));
             return;
        }

        if (!betAmount.value || !prediction.value) {
            showToast(t('crash.inputError'));
            return;
        }
        
        // Reset visual state if we are coming from RESULT
        if (gameState.value === 'RESULT') {
             gameState.value = 'IDLE'; // Optional transition
        }
        
        drawIdleCanvas(); // Ensure clean grid

        console.log("handleBet parameters:", { betAmount: betAmount.value, prediction: parseFloat(prediction.value) });
        isBetting.value = true;
        const success = await placeBet(betAmount.value, parseFloat(prediction.value));
        if (success) {
            showToast(t('toast.txSuccess'));
            await refreshBalance();
            fetchRecentWinners(); // Immediate refresh
            // Get current block to wait
            const provider = walletState.signer?.provider;
            const currentBlock = await provider.getBlockNumber();
            
            gameState.value = 'WAITING_BLOCK';
            // Start checking for NEXT block (current + 1 usually, but bet stores the block it was mined in)
            // Wait, placeBet waits for tx.wait(), so the tx is in a block.
            // We need block.number > betBlock.
            // We can call getActiveBet to get the exact betBlock.
            
            console.log("投注交易确认，尝试从合约获取 ActiveBet 信息...");
            // Simple retry loop (3 times) to ensure node has indexed the bet
            let bet = null;
            for (let i = 0; i < 3; i++) {
                bet = await getActiveBet();
                if (bet && bet.betBlock > 0) break;
                console.warn(`第 ${i+1} 次获取 ActiveBet 失败，等待 500ms 重试...`);
                await new Promise(r => setTimeout(r, 500));
            }

            console.log("最终获取到的 ActiveBet:", bet);

            if (bet && bet.betBlock > 0) {
                console.log(`成功获取 ActiveBet，目标区块: ${bet.betBlock}，启动监听...`);
                startBlockCheck(bet.betBlock);
            } else {
                console.error("多次尝试后仍未获取到 ActiveBet，界面将卡在 WAITING_BLOCK，请检查节点延迟。");
            }
        }
        isBetting.value = false;
    };

    const handleSettle = async () => {
        // Record if we are settling an expired bet before stopping checks
        isExpiredSettle.value = expirationSeconds.value <= 0;
        
        // Stop checks temporarily
        stopBlockCheck();
        
        // Optimistically set settling state
        gameState.value = 'SETTLING';
        
        try {
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
                 // Failed to settle (e.g. user rejected)
                 // Restore state to allow retry
                 console.log("Settle returned null, restoring state");
                 
                 // Check if we still have an active bet to be safe
                 const bet = await getActiveBet();
                 if (bet) {
                     // Restore state
                     gameState.value = 'READY_TO_SETTLE';
                     
                     // Restore timer based on current block
                     const provider = walletState.signer?.provider;
                     if (provider) {
                         const current = await provider.getBlockNumber();
                         const expiryBlock = bet.betBlock + 255;
                         const remainingBlocks = Math.max(0, expiryBlock - current);
                         // Recalculate time
                         expirationSeconds.value = Math.ceil(remainingBlocks * 0.75);
                         if (remainingBlocks > 0) startCountdown();
                     }
                 } else {
                     gameState.value = 'IDLE';
                     drawIdleCanvas();
                 }
            }
        } catch (e) {
             console.error("Handle settle error:", e);
             // Restore state on error
             gameState.value = 'READY_TO_SETTLE';
             // Resume countdown if needed (simple resume)
             if (expirationSeconds.value > 0) startCountdown();
        }
    };

    // --- Animation Logic ---
    const resizeCanvas = () => {
        const canvas = gameCanvas.value;
        if (canvas) {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            // Draw idle canvas for static states to ensure axes are visible
            if (['IDLE', 'WAITING_BLOCK', 'READY_TO_SETTLE', 'SETTLING', 'RESULT'].includes(gameState.value)) {
                 drawIdleCanvas();
            }
        }
    };

    const drawIdleCanvas = () => {
        const canvas = gameCanvas.value;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        
        // Define padding for axes
        const paddingTop = 20; // Added top padding
        const paddingBottom = 40; 
        const paddingRight = 15;
        const paddingLeft = 10; 
        
        const drawH = h - paddingBottom - paddingTop;
        const drawW = w - paddingRight - paddingLeft;

        ctx.clearRect(0, 0, w, h);
        
        // Draw Faint Grid (Vertical)
        ctx.strokeStyle = 'rgba(51, 51, 51, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Vertical lines
        for (let i = 1; i <= 4; i++) {
            const x = paddingLeft + (drawW / 4) * i;
            ctx.moveTo(x, paddingTop);
            ctx.lineTo(x, paddingTop + drawH);
        }

        // Horizontal lines (5 intervals)
        for (let i = 0; i <= 5; i++) {
            const y = paddingTop + drawH - (drawH / 5) * i;
            ctx.moveTo(paddingLeft, y);
            ctx.lineTo(w - paddingRight, y);
        }
        ctx.stroke();

        // Draw Axes
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#555'; 
        // X Axis
        ctx.moveTo(paddingLeft, paddingTop + drawH);
        ctx.lineTo(w - paddingRight, paddingTop + drawH);
        // Y Axis
        ctx.moveTo(paddingLeft, paddingTop);
        ctx.lineTo(paddingLeft, paddingTop + drawH);
        ctx.stroke();

        // Draw static curve preview
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.setLineDash([5, 5]); 
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, paddingTop + drawH);
        ctx.quadraticCurveTo(paddingLeft + drawW/2, paddingTop + drawH, paddingLeft + drawW, paddingTop + drawH*0.2);
        ctx.stroke();
        ctx.setLineDash([]); 

        // Draw "Ready" text
        // ctx.font = '20px "Geist", sans-serif';
        // ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        // ctx.textAlign = 'center';
        // ctx.fillText(t('crash.waitingForNextRound'), paddingLeft + drawW/2, paddingTop + drawH/2);

        // Draw X-Axis Labels
        ctx.save();
        ctx.font = 'bold 12px "Geist", sans-serif'; 
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.textAlign = 'center';
        
        const labels = [2, 4, 6, 8];
        const positions = [0.25, 0.50, 0.75, 1.0];
        
        labels.forEach((sec, index) => {
             const xPos = paddingLeft + positions[index] * drawW;
             const yPos = h - 15; 
             
             if (index === 3) {
                 ctx.textAlign = 'right';
                 ctx.fillText(sec + 's', xPos, yPos); 
             } else {
                 ctx.textAlign = 'center';
                 ctx.fillText(sec + 's', xPos, yPos); 
             }
        });
        ctx.restore();

        // Draw Y-Axis Labels (Last to be on top)
        ctx.save();
        ctx.font = 'bold 12px "Geist", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        const idleMaxMult = 2.0;
        for (let i = 0; i <= 5; i++) {
            const y = paddingTop + drawH - (drawH / 5) * i;
            const val = 1.0 + (idleMaxMult - 1.0) * (i / 5);
            const text = val.toFixed(1) + 'x';
            
            // Draw background for compactness
            const textWidth = ctx.measureText(text).width;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(paddingLeft + 2, y - 8, textWidth + 6, 16);
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText(text, paddingLeft + 5, y);
        }
        ctx.restore();
    };

    const startAnimation = (targetPoint) => {
        gameState.value = 'ANIMATING';
        isTickerPaused.value = true; // Pause ticker during animation
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
        const paddingTop = 20; // Added top padding
        const paddingBottom = 40; 
        const paddingLeft = 10;   // Reduced from 60 to 10
        const paddingRight = 15; 
        
        // Effective drawing area
        const drawH = h - paddingBottom - paddingTop;
        const drawW = w - paddingRight - paddingLeft;

        // Update time label display
        currentTimeLabel.value = (elapsed / 1000).toFixed(1);

        // Draw Grid
        ctx.strokeStyle = 'rgba(51, 51, 51, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        // Vertical Lines (4 intervals for X)
        for (let i = 1; i <= 4; i++) {
            const x = paddingLeft + (drawW / 4) * i;
            ctx.moveTo(x, paddingTop); 
            ctx.lineTo(x, paddingTop + drawH); 
        }

        // Horizontal Lines (5 intervals for Y)
        for (let i = 0; i <= 5; i++) {
             const y = paddingTop + drawH - (drawH / 5) * i;
             ctx.moveTo(paddingLeft, y);
             ctx.lineTo(w - paddingRight, y);
        }
        
        ctx.stroke();

        // Draw Axes
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#555';
        // X Axis
        ctx.moveTo(paddingLeft, paddingTop + drawH);
        ctx.lineTo(w - paddingRight, paddingTop + drawH);
        // Y Axis
        ctx.moveTo(paddingLeft, paddingTop);
        ctx.lineTo(paddingLeft, paddingTop + drawH);
        ctx.stroke();

        // --- Draw X-Axis Labels (Below the graph area) ---
        ctx.save();
        ctx.font = 'bold 12px "Geist", sans-serif'; 
        ctx.fillStyle = '#ffffff'; 
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
             const xPos = paddingLeft + positions[index] * drawW;
             const yPos = h - 15; 
             
             if (index === 3) {
                 ctx.textAlign = 'right';
                 ctx.fillText(sec + 's', xPos, yPos); 
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
            const x = paddingLeft + (t / maxTime) * drawW;
            const y = paddingTop + drawH - ((m - 1) / (maxMult - 1)) * drawH; 
            points.push({ x, y });
        }
        
        // Current Point
        const curX = paddingLeft + (elapsed / maxTime) * drawW;
        const curY = paddingTop + drawH - ((multiplier - 1) / (maxMult - 1)) * drawH;
        points.push({ x: curX, y: curY });

        if (points.length < 2) return;

        // --- 1. Draw Blue Area Under Curve ---
        // Solid fill #ff9d02
        ctx.fillStyle = '#ff9d02'; 
        ctx.beginPath();
        ctx.moveTo(points[0].x, paddingTop + drawH); // Start bottom-left at drawH
        ctx.lineTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
             ctx.lineTo(points[i].x, points[i].y);
        }
        
        ctx.lineTo(points[points.length-1].x, paddingTop + drawH); // Drop to bottom-right at drawH
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

        // --- Draw Y-Axis Labels (MOVED TO END) ---
        ctx.save();
        ctx.font = 'bold 12px "Geist", sans-serif'; 
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        for (let i = 0; i <= 5; i++) {
             const y = paddingTop + drawH - (drawH / 5) * i;
             const val = 1.0 + (maxMult - 1.0) * (i / 5);
             const text = val.toFixed(1) + 'x';

             // Draw background for compactness
             const textWidth = ctx.measureText(text).width;
             ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
             ctx.fillRect(paddingLeft + 2, y - 8, textWidth + 6, 16);

             ctx.fillStyle = '#ffffff'; 
             ctx.fillText(text, paddingLeft + 5, y);
        }
        ctx.restore();
    };

    const switchTab = (tab) => {
        if (gameState.value === 'ANIMATING' || gameState.value === 'SETTLING') return;
        activeTab.value = tab;
    };

    const endGame = () => {
        gameState.value = 'RESULT';
        refreshBalance();
        
        // Resume ticker and refresh data after 2 seconds to avoid spoilers
        setTimeout(() => {
            // If a new game has started animating, don't unpause/refresh
            if (gameState.value === 'ANIMATING') return; 

            fetchRecentWinners();
        loadHistory();
            isTickerPaused.value = false;
        }, 2000);
    };

    // --- Helper UI Methods ---
    const setAmountPercent = (p) => {
        if (!athBalance.value) return;
        const bal = parseFloat(athBalance.value);
        
        if (bal <= 0) {
            showToast(t('crash.insufficientBalance'));
            return;
        }

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
        if (bal <= 0) {
            showToast(t('crash.insufficientBalance'));
            return;
        }
        
        if (bal <= maxBet.value) {
            betAmount.value = formatAmount4(athBalance.value);
        } else {
            betAmount.value = maxBet.value.toFixed(4);
        }
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

    const getResultColor = (item) => {
        if (item.crashPoint === 0) return 'text-danger'; // Timeout
        if (item.crashPoint < 1.01) return 'text-danger'; // Instant crash
        // For history
        if (item.crashPoint >= 1.01) return 'text-success'; // Unified Green for all winning/active states
        return 'text-white'; 
    };

    const loadHistory = async () => {
        if (activeTab.value === 'rules' || activeTab.value === 'fairness') return;

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

    const handleInput = (e, type, limit) => {
        let val = e.target.value;
        if (val && val.includes('.')) {
            const parts = val.split('.');
            if (parts[1] && parts[1].length > limit) {
                val = parts[0] + '.' + parts[1].substring(0, limit);
                e.target.value = val;
                if (type === 'bet') betAmount.value = val;
                else if (type === 'prediction') prediction.value = val;
            }
        }
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

    const testSettle = () => {
        gameState.value = 'READY_TO_SETTLE';
        expirationSeconds.value = 30;
        startCountdown();
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
        isExpiredSettle,
        handleBetAmountBlur,
        handlePredictionBlur,
        adjustPrediction,
        isSidebarOpen,
        openSidebar,
        closeSidebar,
        testCrashAnim,
        testWinAnim,
        testSettle,
        currentTimeLabel,
        expirationSeconds,
        isInsufficientBalance,
        handleInput,
        switchTab,
        recentWinners,
        visibleWinners,
        tickerRef,
        verifyAddress,
        verifyBlock,
        verifyHash,
        verifyEdge,
        verifyResult,
        verifyStatus,
        verifyInputHex,
        verifyInputPartHash,
        verifyInputPartAddr,
        verifyInputPartBlock,
        verifySeedHex,
        copySeedHex,
        verifyFairness,
        copyHexInput,
        explorerBaseUrl
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
  font-size: 80px;
  font-weight: 900;
  font-style: italic;
  text-transform: uppercase;
  background: linear-gradient(180deg, #FFFFFF 20%, #9ca3af 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.3));
  animation: title-pulse 3s ease-in-out infinite alternate;
  letter-spacing: -2px;
  position: relative;
  display: inline-block;
  padding: 0 10px;
  line-height: 1;
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
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  transform: skewX(-25deg);
  animation: shine 4s infinite;
  pointer-events: none;
}

@keyframes title-pulse {
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
  }
  100% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 25px rgba(255, 255, 255, 0.6));
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
  padding: 20px 10px;
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
  gap: 10px;
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
  background: #101011;
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
  font-size: 2.5rem;
  font-weight: 800;
  text-shadow: 0 4px 20px rgba(0,0,0,0.5);
  font-family: 'Geist', sans-serif;
  line-height: 1;
  transition: transform 0.1s;
}

.result-status {
    font-size: 2.5rem;
    font-weight: 900;
    font-style: italic;
    margin-top: 10px;
    letter-spacing: -1px;
    text-transform: uppercase;
    animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
}

.text-success.result-status {
    background-image: linear-gradient(180deg, #4ade80 0%, #22c55e 100%);
    filter: drop-shadow(0 0 10px rgba(34, 197, 94, 0.6));
}

.text-danger.result-status {
    background-image: linear-gradient(180deg, #f87171 0%, #ef4444 100%);
    filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.6));
}

.result-payout {
    font-size: 1.5rem;
    font-weight: 900;
    font-style: italic;
    margin-top: 5px;
    background-image: linear-gradient(180deg, #4ade80 0%, #22c55e 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    filter: drop-shadow(0 0 10px rgba(34, 197, 94, 0.6));
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
  margin-top: 0px; /* Reduced from 6px */
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

.input-group .form-control::placeholder {
  color: rgba(255, 255, 255, 0.5) !important;
  font-weight: 500;
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
.btn-bet, .btn-settle, .btn-approve-highlight {
    background: var(--primary) !important;
    background-image: none !important; /* Ensure no gradient overrides it */
    color: #fff !important;
    border-color: var(--primary) !important;
    /* box-shadow: none !important; Removed to allow animation */
}

.btn-bet:hover:not(:disabled), .btn-settle:hover, .btn-approve-highlight:hover:not(:disabled) {
    filter: brightness(1.1);
    transform: translateY(-2px);
    color: #fff !important;
}

.btn-expired {
    background: #555 !important;
    border-color: #555 !important;
    opacity: 0.8;
}

.history-tabs {
  margin-bottom: 15px;
}
.tab-btn {
  background: transparent;
  border: none;
  color: var(--text-2);
  padding: 8px 10px;
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

@keyframes border-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(200, 229, 241, 0.8);
  }
  100% {
    box-shadow: 0 0 0 7px rgba(255, 157, 2, 0);
  }
}

.btn-pulse-border {
  position: relative;
  overflow: visible !important; /* Ensure shadow isn't clipped */
}

.btn-pulse-border::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 999px;
  animation: border-pulse 2s infinite;
  pointer-events: none;
  z-index: 1; /* On top of button content if needed, or adjust */
}

/* Recent Winners Ticker */
.recent-winners-ticker-container {
    width: 100%;
    overflow: hidden; /* Hide anything spilling out */
    display: flex;
    justify-content: center;
    margin-top: 5px;
    min-height: 32px;
}

.recent-winners-ticker {
    display: flex;
    justify-content: center;
    gap: 15px;
    /* transition for smooth sliding not strictly needed if we animate items entering/leaving, 
       but we can animate the container shift if desired. 
       For "rolling out", adding item to right and removing left is standard ticker. 
    */
}

.winner-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-family: 'Geist', sans-serif;
    color: var(--text-2);
    white-space: nowrap;
    /* transition handled by list class */
}

/* Ticker Animations */
.list-enter-active,
.list-leave-active,
.list-move {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
  position: absolute; /* Essential for smooth list move */
}

.winner-item.theme-bg {
    background-color: var(--primary);
    color: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border: 1px solid transparent; /* Maintain size consistency */
}

.winner-item.gray-blue-bg {
    background-color: #4a5568; /* Gray Blue */
    color: #e2e8f0;
    border: 1px solid transparent;
}

.winner-name {
    opacity: 0.9;
    font-weight: 500;
}

.winner-mult {
    font-weight: 800;
}

.verify-input::placeholder {
    color: rgba(255, 255, 255, 0.7) !important;
    opacity: 1;
}

.verification-calculator .tf-button {
    height: 56px !important;
    border-radius: 999px;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.var {
    font-style: italic;
    font-weight: bold;
    font-family: 'Times New Roman', Times, serif;
}

.var-highlight {
    font-style: italic;
    font-weight: bold;
    color: var(--primary);
    font-family: 'Times New Roman', Times, serif;
}

.func {
    font-family: 'Times New Roman', Times, serif;
}

.math-op {
    font-family: 'Times New Roman', Times, serif;
}
</style>
