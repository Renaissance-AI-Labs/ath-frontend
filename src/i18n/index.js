// i18n configuration and language management
import { reactive, computed } from 'vue';

// Language state management
export const i18nState = reactive({
  currentLanguage: 'zh-cn', // Default to Simplified Chinese
  languages: {
    'zh-cn': { name: '简体中文', code: 'zh-cn' },
    'zh-tw': { name: '繁体中文', code: 'zh-tw' },
    'en': { name: 'English', code: 'en' },
    'ja': { name: '日本語', code: 'ja' },
    'ko': { name: '한국어', code: 'ko' }
  }
});

// Language packs
const languagePacks = {
  'zh-cn': {
    // Header
    'header.connectWallet': '连接钱包',
    
    // Footer
    'footer.aboutUs': '了解我们',
    'footer.whitepaper': '白皮书',
    'footer.copyright': '© 2025 Athena Protocol. ALL RIGHTS RESERVED.',
    
    // Hero Section
    'hero.subtitle': '只有代码、数学，以及一个由 AI 驱动的、不可阻挡的价值创造机器',
    'hero.assetsTitle': '您的资产在此处安睡',
    'hero.friendsBoost': '好友带来的助力',
    'hero.injectPool': '注入底池',
    'hero.shareFriend': '分享好友',
    'hero.achievementReward': '成就奖励',
    
    // Connect Wallet Modal
    'wallet.connectTitle': '连接钱包',
    'wallet.connectSubtitle': '请选择一个钱包以继续',
    'wallet.connectedTitle': '钱包已连接',
    'wallet.address': '地址',
    'wallet.network': '网络',
    'wallet.disconnect': '断开连接',
    'wallet.noWalletDetected': '未检测到钱包。',
    'wallet.installWallet': '请安装 OKX Wallet 或 TokenPocket 后重试。',
    
    // Language Modal
    'language.switchTitle': '切换语言',
    'language.selectLanguage': '请选择您的语言',
    
    // Inject Pool Modal
    'inject.title': '注入底池',
    'inject.amountLabel': '投资数量：',
    'inject.amountPlaceholder': '输入数量',
    'inject.maxAmount': '最大: {amount} USDT',
    'inject.durationLabel': '投资天数：',
    'inject.duration1Day': '1天，复利0.3%',
    'inject.duration15Days': '15天，复利0.6%',
    'inject.duration30Days': '30天，复利1.2%',
    'inject.days1': '1天',
    'inject.rate1': '复利0.3%',
    'inject.days15': '15天',
    'inject.rate15': '复利0.6%',
    'inject.days30': '30天',
    'inject.rate30': '复利1.2%',
    'inject.cancel': '取消',
    'inject.approving': '授权中...',
    'inject.enterAmount': '请输入数量',
    'inject.approveUsdt': '请授权USDT',
    'inject.nextStep': '下一步',
    'inject.confirmStake': '确认质押',
    'inject.insufficientBalance': '您的USDT余额不足',
    'inject.maxAmountExceeded': '当前最多可注入 {amount} USDT',
    'inject.approveSuccess': '授权成功！',
    'inject.approveFailed': '授权失败或被拒绝',
    'inject.soldOut': '当前全网质押额度已售罄',
    
    // Claim Reward Modal
    'claim.title': '领取您的成就奖励',
    'claim.loading': '正在查询您的成就奖励...',
    'claim.noReward': '暂无',
    'claim.claiming': '领取中',
    'claim.claim': '领取',
    'claim.close': '关闭',
    'claim.connectWallet': '请先连接并授权您的钱包',
    
    // Confirm Referrer Modal
    'referrer.title': '请确认推荐人',
    'referrer.addressLabel': '推荐人地址:',
    'referrer.loading': '加载中...',
    'referrer.cancel': '取消',
    'referrer.confirm': '确认推荐人并质押',
    
    // Toast Notifications
    'toast.connectWalletFirst': '请先连接并授权您的钱包',
    'toast.stakeAndBindFirst': '请先质押并绑定推荐人',
    'toast.copied': '已复制到剪贴板',
    'toast.claimSuccess': '奖励领取成功！',
    'toast.claimFailed': '奖励领取失败',
    'toast.networkSwitched': '已成功切换到 {networkName}',
    'toast.investmentSubmitted': '投资已提交，请稍后在X Node中查看',
    'toast.copySuccess': '复制成功！链接已复制到剪贴板',
    'toast.copyFailed': '复制失败，请检查浏览器权限',
    'toast.refreshDataFailed': '刷新数据失败',
    'toast.loadingData': '正在首次加载数据...',
    'toast.poolNotInitialized': '奖金池合约未初始化或钱包未连接',
    'toast.txSent': '交易已发送，等待确认...',
    'toast.fetchDataFailed': '获取质押数据失败',
    'toast.stakingNotInitialized': '质押合约未初始化',
    'toast.invalidOrderId': '无效的订单ID',
    'toast.unstakeSuccess': '赎回成功！',
    'toast.unstakeFailed': '赎回失败: {reason}',
    'toast.calculateFailed': '无法计算预期输出，质押中止',
    'toast.stakeFailed': '质押失败: {reason}',
    'toast.refreshData': '每6秒刷新数据...',
    'toast.stakingRequest': '正在处理质押请求...',
    'toast.insufficientBalance': '错误：您的USDT余额不足 (当前: {balance})',
    'toast.invalidReferrer': '错误：推荐人地址无效或未质押',
    'toast.stakeSuccessRefresh': '质押成功！页面即将刷新。',
    'toast.stakeFailedRetry': '质押失败，请稍后重试。',
    'toast.fetchReferrerFailed': '错误：无法获取您已绑定的推荐人地址。',
    
    // Testimonial Section
    'testimonial.connectFuture': '连接未来',
    'testimonial.yourselfShapesFuture': 'Yourself shapes the future.',
    'testimonial.futureJourneyLine1': '一同探索',
    'testimonial.futureJourneyLine2': '未来的旅途',
    'testimonial.genesis': '创世',
    'testimonial.genesisEn': 'Genesis',
    'testimonial.genesisDesc': '协议部署，LCC 功能上线，Athena AI™ v1.0 开始自主运行，开启一个前所未有的未来。',
    'testimonial.expansion': '扩张',
    'testimonial.expansionEn': 'Expansion',
    'testimonial.expansionDesc': '金库贴现票据 (TDN) V1 的合约接口被激活，协议开始主动进行资产负债表管理， 望眼前所未有的蓝图。',
    'testimonial.handover': '移交',
    'testimonial.handoverEn': 'The Handover',
    'testimonial.handoverDesc': '协议的最高管理权限被转移至一个时间锁合约，AthenaDAO 的治理模块上线， 忠诚调停时间线秩序。',
    'testimonial.dissolution': '消亡',
    'testimonial.dissolutionEn': 'The Nyx Dissolution',
    'testimonial.dissolutionDesc': '在投票确认协议稳定后，时间锁到期，The Nyx Collective 的部署密钥将被永久销毁以进入自主进化阶段。',
    
    // Countdown Timer
    'countdown.remaining': '剩余：',
    'countdown.expired': '已到期可赎回',
    'countdown.days': '天',
    'countdown.hours': '时',
    'countdown.minutes': '分',
    'countdown.seconds': '秒',
    
    // HowToUse Section
    'howToUse.governFuture': '治理未来',
    'howToUse.ruleOverAll': 'Rule Over All',
    'howToUse.controlWealth': '在这里 — 掌控你的财富',
    'howToUse.controlWealthDesc': '捐赠至底池的资金，将依额度每日累积。最高享 1.2% 自动复利，周期不超过 30 天。',
    'howToUse.investmentList': '投资列表',
    'howToUse.redemptionList': '赎回列表',
    'howToUse.loadingStakingData': '正在加载质押数据...',
    'howToUse.connectWalletFirst': '请先连接钱包以查看您的质押订单',
    'howToUse.contractInitFailed': '合约初始化失败，请刷新重试',
    'howToUse.noInvestmentOrders': '您还没有任何进行中的质押订单',
    'howToUse.noRedemptionOrders': '您还没有已赎回的订单',
    'howToUse.principal': '母金：',
    'howToUse.interest': '收益：',
    'howToUse.redeeming': '赎回中...',
    'howToUse.redeem': '赎回',
    'howToUse.redeemed': '已赎回',
    'howToUse.waitingRedeem': '等待赎回',
    'howToUse.staking': 'STAKING',
    'howToUse.redeemedStatus': 'REDEEMED',
    
    // Share Friend Modal
    'share.title': '分享链接给好友',
    'share.teamId': '邀请您的好友：',
    'share.linkLabel': '您的分享链接：',
    'share.hint': '若复制失败请长按链接手动复制分享',
    'share.button': '复制链接给好友',
    'share.myReferralsLabel': '我邀请的好友：',
    'share.referralsUnit': '位',
    'share.noReferrals': '暂无邀请的好友',
    'share.kpiLabel': '助力',
    'share.assetsLabel': '资产',
    'share.loadingReferrals': '查询中...',
    
    // Common
    'common.loading': 'Loading...',
    'common.token': 'TOKEN',
    'common.ath': 'ATH'
  },
  
  'zh-tw': {
    // Header
    'header.connectWallet': '連接錢包',
    
    // Footer
    'footer.aboutUs': '了解我們',
    'footer.whitepaper': '白皮書',
    'footer.copyright': '© 2025 Athena Protocol. ALL RIGHTS RESERVED.',
    
    // Hero Section
    'hero.subtitle': '只有代碼、數學，以及一個由 AI 驅動的、不可阻擋的價值創造機器',
    'hero.assetsTitle': '您的資產在此處安睡',
    'hero.friendsBoost': '好友帶來的助力',
    'hero.injectPool': '注入底池',
    'hero.shareFriend': '分享好友',
    'hero.achievementReward': '成就獎勵',
    
    // Connect Wallet Modal
    'wallet.connectTitle': '連接錢包',
    'wallet.connectSubtitle': '請選擇一個錢包以繼續',
    'wallet.connectedTitle': '錢包已連接',
    'wallet.address': '地址',
    'wallet.network': '網絡',
    'wallet.disconnect': '斷開連接',
    'wallet.noWalletDetected': '未檢測到錢包。',
    'wallet.installWallet': '請安裝 OKX Wallet 或 TokenPocket 後重試。',
    
    // Language Modal
    'language.switchTitle': '切換語言',
    'language.selectLanguage': '請選擇您的語言',
    
    // Inject Pool Modal
    'inject.title': '注入底池',
    'inject.amountLabel': '投資數量：',
    'inject.amountPlaceholder': '輸入數量',
    'inject.maxAmount': '最大: {amount} USDT',
    'inject.durationLabel': '投資天數：',
    'inject.duration1Day': '1天，複利0.3%',
    'inject.duration15Days': '15天，複利0.6%',
    'inject.duration30Days': '30天，複利1.2%',
    'inject.days1': '1天',
    'inject.rate1': '複利0.3%',
    'inject.days15': '15天',
    'inject.rate15': '複利0.6%',
    'inject.days30': '30天',
    'inject.rate30': '複利1.2%',
    'inject.cancel': '取消',
    'inject.approving': '授權中...',
    'inject.enterAmount': '請輸入數量',
    'inject.approveUsdt': '請授權USDT',
    'inject.nextStep': '下一步',
    'inject.confirmStake': '確認質押',
    'inject.insufficientBalance': '您的USDT餘額不足',
    'inject.maxAmountExceeded': '當前最多可注入 {amount} USDT',
    'inject.approveSuccess': '授權成功！',
    'inject.approveFailed': '授權失敗或被拒絕',
    'inject.soldOut': '當前全網質押額度已售罄',
    
    // Claim Reward Modal
    'claim.title': '領取您的成就獎勵',
    'claim.loading': '正在查詢您的成就獎勵...',
    'claim.noReward': '暫無',
    'claim.claiming': '領取中',
    'claim.claim': '領取',
    'claim.close': '關閉',
    'claim.connectWallet': '請先連接並授權您的錢包',
    
    // Confirm Referrer Modal
    'referrer.title': '請確認推薦人',
    'referrer.addressLabel': '推薦人地址:',
    'referrer.loading': '加載中...',
    'referrer.cancel': '取消',
    'referrer.confirm': '確認推薦人並質押',
    
    // Testimonial Section
    'testimonial.connectFuture': '連接未來',
    'testimonial.yourselfShapesFuture': 'Yourself shapes the future.',
    'testimonial.futureJourneyLine1': '一同探索',
    'testimonial.futureJourneyLine2': '未來的旅途',
    'testimonial.genesis': '創世',
    'testimonial.genesisEn': 'Genesis',
    'testimonial.genesisDesc': '協議部署，LCC 功能上線，Athena AI™ v1.0 開始自主運行，開啟一個前所未有的未來。',
    'testimonial.expansion': '擴張',
    'testimonial.expansionEn': 'Expansion',
    'testimonial.expansionDesc': '金庫貼現票據 (TDN) V1 的合約接口被激活，協議開始主動進行資產負債表管理， 望眼前所未有的藍圖。',
    'testimonial.handover': '移交',
    'testimonial.handoverEn': 'The Handover',
    'testimonial.handoverDesc': '協議的最高管理權限被轉移至一個時間鎖合約，AthenaDAO 的治理模塊上線， 忠誠調停時間線秩序。',
    'testimonial.dissolution': '消亡',
    'testimonial.dissolutionEn': 'The Nyx Dissolution',
    'testimonial.dissolutionDesc': '在投票確認協議穩定後，時間鎖到期，The Nyx Collective 的部署密鑰將被永久銷毀以進入自主進化階段。',
    
    // Countdown Timer
    'countdown.remaining': '剩餘：',
    'countdown.expired': '已到期可贖回',
    'countdown.days': '天',
    'countdown.hours': '時',
    'countdown.minutes': '分',
    'countdown.seconds': '秒',
    
    // HowToUse Section
    'howToUse.governFuture': '治理未來',
    'howToUse.ruleOverAll': 'Rule Over All',
    'howToUse.controlWealth': '在這裡 — 掌控你的財富',
    'howToUse.controlWealthDesc': '捐贈至底池的資金，將依額度每日累積。最高享 1.2% 自動複利，週期不超過 30 天。',
    'howToUse.investmentList': '投資列表',
    'howToUse.redemptionList': '贖回列表',
    'howToUse.loadingStakingData': '正在加載質押數據...',
    'howToUse.connectWalletFirst': '請先連接錢包以查看您的質押訂單',
    'howToUse.contractInitFailed': '合約初始化失敗，請刷新重試',
    'howToUse.noInvestmentOrders': '您還沒有任何進行中的質押訂單',
    'howToUse.noRedemptionOrders': '您還沒有已贖回的訂單',
    'howToUse.principal': '母金：',
    'howToUse.interest': '收益：',
    'howToUse.redeeming': '贖回中...',
    'howToUse.redeem': '贖回',
    'howToUse.redeemed': '已贖回',
    'howToUse.waitingRedeem': '等待贖回',
    'howToUse.staking': 'STAKING',
    'howToUse.redeemedStatus': 'REDEEMED',
    
    // Toast Notifications
    'toast.connectWalletFirst': '請先連接並授權您的錢包',
    'toast.stakeAndBindFirst': '請先進行質押並綁定您的推薦好友',
    'toast.copied': '複製成功！鏈接已複製到剪貼板',
    'toast.copyFailed': '複製失敗，請檢查瀏覽器權限',
    'toast.refreshDataFailed': '刷新數據失敗',
    'toast.loadingData': '正在首次加載數據...',
    'toast.poolNotInitialized': '獎金池合約未初始化或錢包未連接',
    'toast.txSent': '交易已發送，等待確認...',
    'toast.claimSuccess': '獎勵領取成功！',
    'toast.claimFailed': '領取失敗: {reason}',
    'toast.networkSwitched': '{networkName}に正常に切り替わりました',
    'toast.investmentSubmitted': '投資が送信されました、後ほどX Nodeで確認してください',
    'toast.fetchDataFailed': '獲取質押數據失敗',
    'toast.stakingNotInitialized': '質押合約未初始化',
    'toast.invalidOrderId': '無効な訂單ID',
    'toast.unstakeSuccess': '贖回成功！',
    'toast.unstakeFailed': '贖回失敗: {reason}',
    'toast.calculateFailed': '無法計算預期輸出，質押中止',
    'toast.stakeFailed': '質押失敗: {reason}',
    'toast.refreshData': '每6秒刷新數據...',
    'toast.stakingRequest': '正在處理質押請求...',
    'toast.insufficientBalance': '錯誤：您的USDT餘額不足 (當前: {balance})',
    'toast.invalidReferrer': '錯誤：推薦人地址無效或未質押',
    'toast.stakeSuccessRefresh': '質押成功！頁面即將刷新。',
    'toast.stakeFailedRetry': '質押失敗，請稍後重試。',
    'toast.fetchReferrerFailed': '錯誤：無法獲取您已綁定的推薦人地址。',
    
    // Share Friend Modal
    'share.title': '分享鏈接給好友',
    'share.teamId': '邀請您的好友：',
    'share.linkLabel': '您的分享鏈接：',
    'share.hint': '若複製失敗請長按鏈接手動複製分享',
    'share.button': '複製鏈接給好友',
    'share.myReferralsLabel': '我邀請的好友：',
    'share.referralsUnit': '位',
    'share.noReferrals': '暫無邀請的好友',
    'share.kpiLabel': '助力',
    'share.assetsLabel': '資產',
    'share.loadingReferrals': '查詢中...',
    
    // Common
    'common.loading': 'Loading...',
    'common.token': 'TOKEN',
    'common.ath': 'ATH'
  },
  
  'en': {
    // Header
    'header.connectWallet': 'Connect Wallet',
    
    // Footer
    'footer.aboutUs': 'About Us',
    'footer.whitepaper': 'Whitepaper',
    'footer.copyright': '© 2025 Athena Protocol. ALL RIGHTS RESERVED.',
    
    // Hero Section
    'hero.subtitle': 'Only code, mathematics, and an AI-driven, unstoppable value creation machine',
    'hero.assetsTitle': 'Your assets rest here',
    'hero.friendsBoost': 'Boost from friends',
    'hero.injectPool': 'Inject Pool',
    'hero.shareFriend': 'Share Friend',
    'hero.achievementReward': 'Achievement Reward',
    
    // Connect Wallet Modal
    'wallet.connectTitle': 'Connect Wallet',
    'wallet.connectSubtitle': 'Please select a wallet to continue',
    'wallet.connectedTitle': 'Wallet Connected',
    'wallet.address': 'Address',
    'wallet.network': 'Network',
    'wallet.disconnect': 'Disconnect',
    'wallet.noWalletDetected': 'No wallet detected.',
    'wallet.installWallet': 'Please install OKX Wallet or TokenPocket and try again.',
    
    // Language Modal
    'language.switchTitle': 'Switch Language',
    'language.selectLanguage': 'Please select your language',
    
    // Inject Pool Modal
    'inject.title': 'Inject Pool',
    'inject.amountLabel': 'Investment Amount:',
    'inject.amountPlaceholder': 'Enter amount',
    'inject.maxAmount': 'Max: {amount} USDT',
    'inject.durationLabel': 'Investment Days:',
    'inject.duration1Day': '1 day, 0.3% compound',
    'inject.duration15Days': '15 days, 0.6% compound',
    'inject.duration30Days': '30 days, 1.2% compound',
    'inject.days1': '1 Day',
    'inject.rate1': '0.3% APY',
    'inject.days15': '15 Days',
    'inject.rate15': '0.6% APY',
    'inject.days30': '30 Days',
    'inject.rate30': '1.2% APY',
    'inject.cancel': 'Cancel',
    'inject.approving': 'Approving...',
    'inject.enterAmount': 'Please enter amount',
    'inject.approveUsdt': 'Please approve USDT',
    'inject.nextStep': 'Next Step',
    'inject.confirmStake': 'Confirm Stake',
    'inject.insufficientBalance': 'Insufficient USDT balance',
    'inject.maxAmountExceeded': 'Maximum {amount} USDT can be injected',
    'inject.approveSuccess': 'Approval successful!',
    'inject.approveFailed': 'Approval failed or rejected',
    'inject.soldOut': 'The global staking quota is currently sold out',
    
    // Claim Reward Modal
    'claim.title': 'Claim Your Achievement Rewards',
    'claim.loading': 'Querying your achievement rewards...',
    'claim.noReward': 'None',
    'claim.claiming': 'Claiming',
    'claim.claim': 'Claim',
    'claim.close': 'Close',
    'claim.connectWallet': 'Please connect and authorize your wallet first',
    
    // Confirm Referrer Modal
    'referrer.title': 'Please Confirm Referrer',
    'referrer.addressLabel': 'Referrer Address:',
    'referrer.loading': 'Loading...',
    'referrer.cancel': 'Cancel',
    'referrer.confirm': 'Confirm Referrer and Stake',
    
    // Testimonial Section
    'testimonial.connectFuture': 'Connect Future',
    'testimonial.yourselfShapesFuture': 'Yourself shapes the future.',
    'testimonial.futureJourneyLine1': 'Let\'s Explore Together',
    'testimonial.futureJourneyLine2': 'The Journey of the Future',
    'testimonial.genesis': 'Genesis',
    'testimonial.genesisEn': 'Genesis',
    'testimonial.genesisDesc': 'Protocol deployed, LCC functionality launched, Athena AI™ v1.0 begins autonomous operation, opening an unprecedented future.',
    'testimonial.expansion': 'Expansion',
    'testimonial.expansionEn': 'Expansion',
    'testimonial.expansionDesc': 'Treasury Discount Note (TDN) V1 contract interface activated, protocol begins active balance sheet management, envisioning unprecedented horizons.',
    'testimonial.handover': 'The Handover',
    'testimonial.handoverEn': 'The Handover',
    'testimonial.handoverDesc': 'Protocol\'s supreme management authority transferred to a timelock contract, AthenaDAO governance module launched, faithfully mediating timeline order.',
    'testimonial.dissolution': 'The Nyx Dissolution',
    'testimonial.dissolutionEn': 'The Nyx Dissolution',
    'testimonial.dissolutionDesc': 'After voting confirms protocol stability, timelock expires, The Nyx Collective\'s deployment keys will be permanently destroyed to enter autonomous evolution stage.',
    
    // Countdown Timer
    'countdown.remaining': 'Remaining: ',
    'countdown.expired': 'Expired, Redeemable',
    'countdown.days': 'd ',
    'countdown.hours': 'h ',
    'countdown.minutes': 'm ',
    'countdown.seconds': 's',
    
    // HowToUse Section
    'howToUse.governFuture': 'Govern Future',
    'howToUse.ruleOverAll': 'Rule Over All',
    'howToUse.controlWealth': 'Here — Control Your Wealth',
    'howToUse.controlWealthDesc': 'Funds donated to the pool will accumulate daily based on the amount. Enjoy up to 1.2% automatic compound interest with a cycle not exceeding 30 days.',
    'howToUse.investmentList': 'Investment List',
    'howToUse.redemptionList': 'Redemption List',
    'howToUse.loadingStakingData': 'Loading staking data...',
    'howToUse.connectWalletFirst': 'Please connect your wallet to view your staking orders',
    'howToUse.contractInitFailed': 'Contract initialization failed, please refresh and try again',
    'howToUse.noInvestmentOrders': 'You have no ongoing staking orders',
    'howToUse.noRedemptionOrders': 'You have no redeemed orders',
    'howToUse.principal': 'Principal: ',
    'howToUse.interest': 'Return: ',
    'howToUse.redeeming': 'Redeeming...',
    'howToUse.redeem': 'Redeem',
    'howToUse.redeemed': 'Redeemed',
    'howToUse.waitingRedeem': 'Waiting to Redeem',
    'howToUse.staking': 'STAKING',
    'howToUse.redeemedStatus': 'REDEEMED',
    
    // Toast Notifications
    'toast.connectWalletFirst': 'Please connect and authorize your wallet first',
    'toast.stakeAndBindFirst': 'Please stake and bind your referral friend first',
    'toast.copied': 'Copied to clipboard',
    'toast.copyFailed': 'Copy failed, please check browser permissions',
    'toast.refreshDataFailed': 'Failed to refresh data',
    'toast.loadingData': 'Loading data for the first time...',
    'toast.poolNotInitialized': 'Reward pool contract not initialized or wallet not connected',
    'toast.txSent': 'Transaction sent, awaiting confirmation...',
    'toast.claimSuccess': 'Rewards claimed successfully!',
    'toast.claimFailed': 'Claim failed: {reason}',
    'toast.fetchDataFailed': 'Failed to fetch staking data',
    'toast.stakingNotInitialized': 'Staking contract not initialized',
    'toast.invalidOrderId': 'Invalid order ID',
    'toast.unstakeSuccess': 'Unstake successful!',
    'toast.unstakeFailed': 'Unstake failed: {reason}',
    'toast.calculateFailed': 'Unable to calculate expected output, staking aborted',
    'toast.stakeFailed': 'Staking failed: {reason}',
    'toast.refreshData': 'Refreshing data every 6 seconds...',
    'toast.stakingRequest': 'Processing stake request...',
    'toast.insufficientBalance': 'Error: Insufficient USDT balance (Current: {balance})',
    'toast.invalidReferrer': 'Error: Referrer address is invalid or has not staked',
    'toast.stakeSuccessRefresh': 'Stake successful! The page will refresh shortly.',
    'toast.stakeFailedRetry': 'Stake failed, please try again later.',
    'toast.fetchReferrerFailed': 'Error: Could not retrieve your bound referrer address.',
    
    // Share Friend Modal
    'share.title': 'Share Link with Friends',
    'share.teamId': 'Your Referrer:',
    'share.linkLabel': 'Your Referral Link:',
    'share.hint': 'If copying fails, please long-press the link to manually copy and share',
    'share.button': 'Copy Link for Friends',
    'share.myReferralsLabel': 'My Referrals:',
    'share.referralsUnit': '', // In English, "3 Referrals" is more natural, the unit is part of the word.
    'share.noReferrals': 'No Referrals Yet',
    'share.kpiLabel': 'Boost',
    'share.assetsLabel': 'Assets',
    'share.loadingReferrals': 'Loading...',
    
    // Common
    'common.loading': 'Loading...',
    'common.token': 'TOKEN',
    'common.ath': 'ATH'
  },
  
  'ja': {
    // Header
    'header.connectWallet': 'ウォレット接続',
    
    // Footer
    'footer.aboutUs': '私たちについて',
    'footer.whitepaper': 'ホワイトペーパー',
    'footer.copyright': '© 2025 Athena Protocol. ALL RIGHTS RESERVED.',
    
    // Hero Section
    'hero.subtitle': 'コード、数学、そしてAI駆動の止められない価値創造マシンのみ',
    'hero.assetsTitle': 'あなたの資産はここで休んでいます',
    'hero.friendsBoost': '友人からのブースト',
    'hero.injectPool': 'プール注入',
    'hero.shareFriend': '友人を共有',
    'hero.achievementReward': '実績報酬',
    
    // Connect Wallet Modal
    'wallet.connectTitle': 'ウォレット接続',
    'wallet.connectSubtitle': '続行するウォレットを選択してください',
    'wallet.connectedTitle': 'ウォレット接続済み',
    'wallet.address': 'アドレス',
    'wallet.network': 'ネットワーク',
    'wallet.disconnect': '切断',
    'wallet.noWalletDetected': 'ウォレットが検出されません。',
    'wallet.installWallet': 'OKX WalletまたはTokenPocketをインストールして再試行してください。',
    
    // Language Modal
    'language.switchTitle': '言語切り替え',
    'language.selectLanguage': '言語を選択してください',
    
    // Inject Pool Modal
    'inject.title': 'プール注入',
    'inject.amountLabel': '投資金額：',
    'inject.amountPlaceholder': '金額を入力',
    'inject.maxAmount': '最大: {amount} USDT',
    'inject.durationLabel': '投資日数：',
    'inject.duration1Day': '1日、複利0.3%',
    'inject.duration15Days': '15日、複利0.6%',
    'inject.duration30Days': '30日、複利1.2%',
    'inject.days1': '1日',
    'inject.rate1': '複利0.3%',
    'inject.days15': '15日',
    'inject.rate15': '複利0.6%',
    'inject.days30': '30日',
    'inject.rate30': '複利1.2%',
    'inject.cancel': 'キャンセル',
    'inject.approving': '承認中...',
    'inject.enterAmount': '金額を入力してください',
    'inject.approveUsdt': 'USDTを承認してください',
    'inject.nextStep': '次のステップ',
    'inject.confirmStake': 'ステーキング確認',
    'inject.insufficientBalance': 'USDT残高が不足しています',
    'inject.maxAmountExceeded': '最大{amount} USDTまで注入可能',
    'inject.approveSuccess': '承認成功！',
    'inject.approveFailed': '承認失敗または拒否されました',
    
    // Claim Reward Modal
    'claim.title': '実績報酬を受け取る',
    'claim.loading': '実績報酬を照会中...',
    'claim.noReward': 'なし',
    'claim.claiming': '受け取り中',
    'claim.claim': '受け取る',
    'claim.close': '閉じる',
    'claim.connectWallet': 'まずウォレットを接続して承認してください',
    
    // Confirm Referrer Modal
    'referrer.title': '紹介者を確認してください',
    'referrer.addressLabel': '紹介者アドレス:',
    'referrer.loading': '読み込み中...',
    'referrer.cancel': 'キャンセル',
    'referrer.confirm': '紹介者を確認してステーキング',
    
    // Testimonial Section
    'testimonial.connectFuture': '未来を接続',
    'testimonial.yourselfShapesFuture': 'Yourself shapes the future.',
    'testimonial.futureJourneyLine1': '共に探索しましょう',
    'testimonial.futureJourneyLine2': '未来への旅路',
    'testimonial.genesis': '創世',
    'testimonial.genesisEn': 'Genesis',
    'testimonial.genesisDesc': 'プロトコル展開、LCC機能稼働開始、Athena AI™ v1.0が自律運転を開始し、前例のない未来を切り開きます。',
    'testimonial.expansion': '拡張',
    'testimonial.expansionEn': 'Expansion',
    'testimonial.expansionDesc': 'トレジャリー割引手形 (TDN) V1 の契約インターフェースが起動し、プロトコルは積極的にバランスシート管理を開始し、前例のない青写真を展望します。',
    'testimonial.handover': '移譲',
    'testimonial.handoverEn': 'The Handover',
    'testimonial.handoverDesc': 'プロトコルの最高管理権限がタイムロック契約に移転され、AthenaDAOのガバナンスモジュールが稼働開始し、忠実にタイムライン秩序を調停します。',
    'testimonial.dissolution': '消滅',
    'testimonial.dissolutionEn': 'The Nyx Dissolution',
    'testimonial.dissolutionDesc': '投票でプロトコルの安定性が確認された後、タイムロックが期限切れとなり、The Nyx Collectiveの展開キーは永久に破棄され、自律進化段階に入ります。',
    
    // Countdown Timer
    'countdown.remaining': '残り：',
    'countdown.expired': '期限切れ、償還可能',
    'countdown.days': '日',
    'countdown.hours': '時間',
    'countdown.minutes': '分',
    'countdown.seconds': '秒',
    
    // HowToUse Section
    'howToUse.governFuture': '未来を統治',
    'howToUse.ruleOverAll': 'Rule Over All',
    'howToUse.controlWealth': 'ここで — あなたの富をコントロール',
    'howToUse.controlWealthDesc': 'プールに寄付された資金は、金額に応じて毎日蓄積されます。最大1.2%の自動複利を享受し、サイクルは30日を超えません。',
    'howToUse.investmentList': '投資リスト',
    'howToUse.redemptionList': '償還リスト',
    'howToUse.loadingStakingData': 'ステーキングデータを読み込み中...',
    'howToUse.connectWalletFirst': 'ステーキング注文を表示するには、まずウォレットを接続してください',
    'howToUse.contractInitFailed': 'コントラクトの初期化に失敗しました。ページを更新して再試行してください',
    'howToUse.noInvestmentOrders': '進行中のステーキング注文がありません',
    'howToUse.noRedemptionOrders': '償還済みの注文がありません',
    'howToUse.principal': '元本：',
    'howToUse.interest': '収益：',
    'howToUse.redeeming': '償還中...',
    'howToUse.redeem': '償還',
    'howToUse.redeemed': '償還済み',
    'howToUse.waitingRedeem': '償還待ち',
    'howToUse.staking': 'STAKING',
    'howToUse.redeemedStatus': 'REDEEMED',
    
    // Toast Notifications
    'toast.connectWalletFirst': 'まずウォレットを接続して承認してください',
    'toast.stakeAndBindFirst': '最初にリファラーをステークしてバインドしてください',
    'toast.copied': 'クリップボードにコピーされました',
    'toast.copyFailed': 'コピー失敗、ブラウザの権限を確認してください',
    'toast.refreshDataFailed': 'データの更新に失敗しました',
    'toast.loadingData': '初回データ読み込み中...',
    'toast.poolNotInitialized': '報酬プールコントラクトが初期化されていないか、ウォレットが接続されていません',
    'toast.txSent': 'トランザクションが送信されました、確認を待っています...',
    'toast.claimSuccess': '報酬の請求に成功しました！',
    'toast.claimFailed': '報酬の請求に失敗しました',
    'toast.networkSwitched': '{networkName}に正常に切り替わりました',
    'toast.investmentSubmitted': '投資が送信されました、後ほどX Nodeで確認してください',
    'toast.fetchDataFailed': 'ステーキングデータの取得に失敗しました',
    'toast.stakingNotInitialized': 'ステーキングコントラクトが初期化されていません',
    'toast.invalidOrderId': '無効な注文ID',
    'toast.unstakeSuccess': '償還に成功しました！',
    'toast.unstakeFailed': '償還失敗: {reason}',
    'toast.calculateFailed': '予想出力の計算ができません、ステーキングを中止します',
    'toast.stakeFailed': 'ステーキング失敗: {reason}',
    'toast.refreshData': '6秒ごとにデータを更新中...',
    'toast.stakingRequest': 'ステーキングリクエストを処理中...',
    'toast.insufficientBalance': 'エラー：USDT残高が不足しています（現在：{balance}）',
    'toast.invalidReferrer': 'エラー：紹介者アドレスが無効か、ステーキングされていません',
    'toast.stakeSuccessRefresh': 'ステーキング成功！ページを更新します。',
    'toast.stakeFailedRetry': 'ステーキングに失敗しました。後でもう一度お試しください。',
    'toast.fetchReferrerFailed': 'エラー：バインドされた紹介者アドレスを取得できませんでした。',
    
    // Share Friend Modal
    'share.title': '友達にリンクを共有',
    'share.teamId': '紹介者：',
    'share.linkLabel': 'あなたの紹介リンク：',
    'share.hint': 'コピーに失敗した場合は、リンクを長押しして手動でコピーして共有してください',
    'share.button': '友達にリンクをコピー',
    'share.myReferralsLabel': '私の紹介：',
    'share.referralsUnit': '名',
    'share.noReferrals': 'まだ紹介がありません',
    'share.kpiLabel': 'ブースト',
    'share.assetsLabel': '資産',
    'share.loadingReferrals': '読み込み中...',
    
    // Common
    'common.loading': 'Loading...',
    'common.token': 'TOKEN',
    'common.ath': 'ATH'
  },
  
  'ko': {
    // Header
    'header.connectWallet': '지갑 연결',
    
    // Footer
    'footer.aboutUs': '우리에 대해',
    'footer.whitepaper': '백서',
    'footer.copyright': '© 2025 Athena Protocol. ALL RIGHTS RESERVED.',
    
    // Hero Section
    'hero.subtitle': '코드, 수학, 그리고 AI가 구동하는 막을 수 없는 가치 창조 기계만',
    'hero.assetsTitle': '귀하의 자산이 여기서 쉬고 있습니다',
    'hero.friendsBoost': '친구들의 부스트',
    'hero.injectPool': '풀 주입',
    'hero.shareFriend': '친구 공유',
    'hero.achievementReward': '성취 보상',
    
    // Connect Wallet Modal
    'wallet.connectTitle': '지갑 연결',
    'wallet.connectSubtitle': '계속하려면 지갑을 선택하세요',
    'wallet.connectedTitle': '지갑 연결됨',
    'wallet.address': '주소',
    'wallet.network': '네트워크',
    'wallet.disconnect': '연결 해제',
    'wallet.noWalletDetected': '지갑이 감지되지 않았습니다.',
    'wallet.installWallet': 'OKX Wallet 또는 TokenPocket을 설치하고 다시 시도하세요.',
    
    // Language Modal
    'language.switchTitle': '언어 전환',
    'language.selectLanguage': '언어를 선택하세요',
    
    // Inject Pool Modal
    'inject.title': '풀 주입',
    'inject.amountLabel': '투자 금액:',
    'inject.amountPlaceholder': '금액 입력',
    'inject.maxAmount': '최대: {amount} USDT',
    'inject.durationLabel': '투자 일수:',
    'inject.duration1Day': '1일, 복리 0.3%',
    'inject.duration15Days': '15일, 복리 0.6%',
    'inject.duration30Days': '30일, 복리 1.2%',
    'inject.days1': '1일',
    'inject.rate1': '복리 0.3%',
    'inject.days15': '15일',
    'inject.rate15': '복리 0.6%',
    'inject.days30': '30일',
    'inject.rate30': '복리 1.2%',
    'inject.cancel': '취소',
    'inject.approving': '승인 중...',
    'inject.enterAmount': '금액을 입력하세요',
    'inject.approveUsdt': 'USDT를 승인하세요',
    'inject.nextStep': '다음 단계',
    'inject.confirmStake': '스테이킹 확인',
    'inject.insufficientBalance': 'USDT 잔액이 부족합니다',
    'inject.maxAmountExceeded': '최대 {amount} USDT까지 주입 가능',
    'inject.approveSuccess': '승인 성공!',
    'inject.approveFailed': '승인 실패 또는 거부됨',
    'inject.soldOut': '현재 글로벌 스테이킹 할당량이 모두 판매되었습니다',

    // Claim Reward Modal
    'claim.title': '성취 보상 받기',
    'claim.loading': '성취 보상을 조회 중...',
    'claim.noReward': '없음',
    'claim.claiming': '받는 중',
    'claim.claim': '받기',
    'claim.close': '닫기',
    'claim.connectWallet': '먼저 지갑을 연결하고 승인하세요',
    
    // Confirm Referrer Modal
    'referrer.title': '추천인을 확인하세요',
    'referrer.addressLabel': '추천인 주소:',
    'referrer.loading': '로딩 중...',
    'referrer.cancel': '취소',
    'referrer.confirm': '추천인 확인 및 스테이킹',
    
    // Testimonial Section
    'testimonial.connectFuture': '미래 연결',
    'testimonial.yourselfShapesFuture': 'Yourself shapes the future.',
    'testimonial.futureJourneyLine1': '함께 탐험하세요',
    'testimonial.futureJourneyLine2': '미래의 여정',
    'testimonial.genesis': '창세',
    'testimonial.genesisEn': 'Genesis',
    'testimonial.genesisDesc': '프로토콜 배포, LCC 기능 출시, Athena AI™ v1.0이 자율 운영을 시작하여 전례 없는 미래를 엽니다.',
    'testimonial.expansion': '확장',
    'testimonial.expansionEn': 'Expansion',
    'testimonial.expansionDesc': '재무부 할인 어음 (TDN) V1의 계약 인터페이스가 활성화되고, 프로토콜은 적극적으로 대차대조표 관리를 시작하여 전례 없는 청사진을 전망합니다.',
    'testimonial.handover': '이양',
    'testimonial.handoverEn': 'The Handover',
    'testimonial.handoverDesc': '프로토콜의 최고 관리 권한이 타임락 계약으로 이전되고, AthenaDAO 거버넌스 모듈이 출시되어 충실하게 타임라인 질서를 중재합니다.',
    'testimonial.dissolution': '소멸',
    'testimonial.dissolutionEn': 'The Nyx Dissolution',
    'testimonial.dissolutionDesc': '투표로 프로토콜 안정성이 확인된 후, 타임락이 만료되면 The Nyx Collective의 배포 키는 영구적으로 파괴되어 자율 진화 단계로 진입합니다.',
    
    // Countdown Timer
    'countdown.remaining': '남은 시간: ',
    'countdown.expired': '만료됨, 상환 가능',
    'countdown.days': '일 ',
    'countdown.hours': '시간 ',
    'countdown.minutes': '분 ',
    'countdown.seconds': '초',
    
    // HowToUse Section
    'howToUse.governFuture': '미래를 통치',
    'howToUse.ruleOverAll': 'Rule Over All',
    'howToUse.controlWealth': '여기서 — 당신의 부를 통제하세요',
    'howToUse.controlWealthDesc': '풀에 기부된 자금은 금액에 따라 매일 누적됩니다. 최대 1.2% 자동 복리를 누리며, 주기는 30일을 초과하지 않습니다.',
    'howToUse.investmentList': '투자 목록',
    'howToUse.redemptionList': '상환 목록',
    'howToUse.loadingStakingData': '스테이킹 데이터 로딩 중...',
    'howToUse.connectWalletFirst': '스테이킹 주문을 보려면 먼저 지갑을 연결하세요',
    'howToUse.contractInitFailed': '컨트랙트 초기화 실패, 새로고침 후 다시 시도하세요',
    'howToUse.noInvestmentOrders': '진행 중인 스테이킹 주문이 없습니다',
    'howToUse.noRedemptionOrders': '상환된 주문이 없습니다',
    'howToUse.principal': '원금: ',
    'howToUse.interest': '수익: ',
    'howToUse.redeeming': '상환 중...',
    'howToUse.redeem': '상환',
    'howToUse.redeemed': '상환됨',
    'howToUse.waitingRedeem': '상환 대기',
    'howToUse.staking': 'STAKING',
    'howToUse.redeemedStatus': 'REDEEMED',
    
    // Toast Notifications
    'toast.connectWalletFirst': '먼저 지갑을 연결하고 승인하세요',
    'toast.stakeAndBindFirst': '먼저 스테이킹하고 추천인을 바인딩하세요',
    'toast.copied': '클립보드에 복사됨',
    'toast.copyFailed': '복사 실패, 브라우저 권한을 확인하세요',
    'toast.refreshDataFailed': '데이터 새로고침 실패',
    'toast.loadingData': '첫 번째 데이터 로딩 중...',
    'toast.poolNotInitialized': '보상 풀 계약이 초기화되지 않았거나 지갑이 연결되지 않았습니다',
    'toast.txSent': '거래가 전송되었습니다, 확인 대기 중...',
    'toast.claimSuccess': '보상 청구 성공!',
    'toast.claimFailed': '보상 청구 실패',
    'toast.networkSwitched': '{networkName}(으)로 성공적으로 전환되었습니다',
    'toast.investmentSubmitted': '투자가 제출되었습니다. 나중에 X Node에서 확인하십시오',
    'toast.fetchDataFailed': '스테이킹 데이터 가져오기 실패',
    'toast.stakingNotInitialized': '스테이킹 계약이 초기화되지 않았습니다',
    'toast.invalidOrderId': '잘못된 주문 ID',
    'toast.unstakeSuccess': '언스테이킹 성공!',
    'toast.unstakeFailed': '언스테이킹 실패: {reason}',
    'toast.calculateFailed': '예상 출력을 계산할 수 없습니다, 스테이킹 중단',
    'toast.stakeFailed': '스테이킹 실패: {reason}',
    'toast.refreshData': '6초마다 데이터 새로고침 중...',
    'toast.stakingRequest': '스테이킹 요청 처리 중...',
    'toast.insufficientBalance': '오류: USDT 잔액이 부족합니다 (현재: {balance})',
    'toast.invalidReferrer': '오류: 추천인 주소가 유효하지 않거나 스테이킹되지 않았습니다',
    'toast.stakeSuccessRefresh': '스테이킹 성공! 페이지가 곧 새로고침됩니다.',
    'toast.stakeFailedRetry': '스테이킹에 실패했습니다. 나중에 다시 시도해주세요.',
    'toast.fetchReferrerFailed': '오류: 연결된 추천인 주소를 가져올 수 없습니다.',
    
    // Share Friend Modal
    'share.title': '친구에게 링크 공유',
    'share.teamId': '추천인:',
    'share.linkLabel': '귀하의 추천 링크:',
    'share.hint': '복사에 실패하면 링크를 길게 눌러 수동으로 복사하여 공유하십시오',
    'share.button': '친구에게 링크 복사',
    'share.myReferralsLabel': '내 추천:',
    'share.referralsUnit': '명',
    'share.noReferrals': '아직 추천인이 없습니다',
    'share.kpiLabel': '부스트',
    'share.assetsLabel': '자산',
    'share.loadingReferrals': '조회 중...',
    
    // Common
    'common.loading': 'Loading...',
    'common.token': 'TOKEN',
    'common.ath': 'ATH'
  }
};

// Translation function
export function t(key, params = {}) {
  const currentPack = languagePacks[i18nState.currentLanguage];
  if (!currentPack) {
    console.warn(`Language pack not found for: ${i18nState.currentLanguage}`);
    return key;
  }
  
  let translation = currentPack[key];
  if (translation === undefined) {
    console.warn(`Translation key not found: ${key} for language: ${i18nState.currentLanguage}`);
    return key;
  }
  
  // Replace parameters in translation
  Object.keys(params).forEach(param => {
    translation = translation.replace(`{${param}}`, params[param]);
  });
  
  return translation;
}

// Language switching function
export function setLanguage(languageCode) {
  if (i18nState.languages[languageCode]) {
    i18nState.currentLanguage = languageCode;
    localStorage.setItem('ath_language', languageCode);
    console.log(`Language switched to: ${languageCode}`);
    // Refresh the page to ensure all components update properly
    window.location.reload();
  } else {
    console.warn(`Language not supported: ${languageCode}`);
  }
}

// Initialize language from localStorage
export function initializeLanguage() {
  const savedLanguage = localStorage.getItem('ath_language');
  if (savedLanguage && i18nState.languages[savedLanguage]) {
    i18nState.currentLanguage = savedLanguage;
  }
}

// Computed properties
export const currentLanguage = computed(() => i18nState.currentLanguage);
export const availableLanguages = computed(() => [
  i18nState.languages['zh-tw'],
  i18nState.languages['zh-cn'],
  i18nState.languages['en'],
  i18nState.languages['ko'],
  i18nState.languages['ja'],
]);
