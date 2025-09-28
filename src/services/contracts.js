import { ethers } from 'ethers';
import { walletState } from './wallet';
import { toRaw } from 'vue';
import { showToast } from '../services/notification';

// --- Helper to get USDT decimals based on environment ---
export const getUsdtDecimals = () => {
  const isProduction = import.meta.env.PROD;
  // Production (Mainnet) USDT uses 6 decimals, Development (Testnet) test USDT uses 18
  return isProduction ? 6 : 18;
};

// --- Import ABIs ---
import referralAbi from '../abis/referral.json';
import stakingAbi from '../abis/staking.json';
import athAbi from '../abis/ath.json';
import s5poolAbi from '../abis/s5pool.json';
import s6poolAbi from '../abis/s6pool.json';
import s7poolAbi from '../abis/s7pool.json';
// No need for a separate USDT ABI if it follows ERC20 standard like `ath.json`
// import usdtAbi from '../abis/usdt.json';

const uniswapV2RouterAbi = [
  "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)"
];

// --- Contract Addresses ---
const contractAddresses = {
  referral: {
    production: '', // To be deployed
    development: '0x1Ad59D67a7D413b0F053d33cf4Ec1FC92190C83A',
  },
  staking: {
    production: '', // To be deployed
    development: '0x13FdD65cfC3CbC91609aD1Ea642312Aa682760c7',
  },
  ath: {
    production: '', // To be deployed
    development: '0x72CfC4eE2620019aD2d90abF51a0B6fF673456c6',
  },
  usdt: {
    production: '0x55d398326f99059fF775485246999027B3197955', // BNB Mainnet USDT
    development: '0xaE36d423c5B05f80926AaEAE0Fca978A74C0aA01', // BNB Testnet USDT
  },
  router: {
    production: '0x10ED43C718714eb63d5aA57B78B54704E256024E', // PancakeSwap Router V2 on BNB Mainnet
    development: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1', // PancakeSwap Router V2 on BNB Testnet
  },
  s5pool: {
    production: '', // To be deployed
    development: '0xb65b398eB4d9FcAeaC8046A3c9Eb84d4eA60ed2d',
  },
  s6pool: {
    production: '', // To be deployed
    development: '0xa28CC3Ea8E349c41bfDd4eE84d99C224e31620c9',
  },
  s7pool: {
    production: '', // To be deployed
    development: '0x1041DDd9585387BC4Aad8bc914db26d1FBbf2D00',
  }
};

// --- Contract Instances ---
let referralContract;
let stakingContract;
let athContract;
let usdtContract;
let routerContract;
let s5poolContract;
let s6poolContract;
let s7poolContract;

// We need to export these for other modules to use them.
export { referralContract, stakingContract, athContract, usdtContract, s5poolContract, s6poolContract, s7poolContract };

// --- KPI Thresholds (as per Staking.sol) ---
const THRESHOLDS = {
  production: {
    S5: 1000000n * (10n ** 18n), // 1 Million USDT value
    S6: 3000000n * (10n ** 18n), // 3 Million USDT value
    S7: 5000000n * (10n ** 18n), // 5 Million USDT value
  },
  development: {
    S5: 15000n * (10n ** 18n),   // Test: 15,000 USDT value
    S6: 18000n * (10n ** 18n),   // Test: 18,000 USDT value
    S7: 21000n * (10n ** 18n),   // Test: 21,000 USDT value
  }
};

const isProduction = import.meta.env.PROD;
const env = isProduction ? 'production' : 'development';

export const S5_THRESHOLD = THRESHOLDS[env].S5;
export const S6_THRESHOLD = THRESHOLDS[env].S6;
export const S7_THRESHOLD = THRESHOLDS[env].S7;


/**
 * Initializes all contract instances with the current signer from walletState.
 * This should be called after a successful wallet connection.
 */
export const initializeContracts = async () => {
  const rawSigner = toRaw(walletState.signer);
  if (!rawSigner) {
    console.warn("Cannot initialize contracts without a signer.");
    return;
  }

  const isProduction = import.meta.env.PROD;
  const env = isProduction ? 'production' : 'development';

  console.log(`Initializing contracts for ${env} environment.`);

  // Get addresses for the current environment
  const referralAddress = contractAddresses.referral[env];
  const stakingAddress = contractAddresses.staking[env];
  const athAddress = contractAddresses.ath[env];
  const usdtAddress = contractAddresses.usdt[env];
  const routerAddress = contractAddresses.router[env];
  const s5poolAddress = contractAddresses.s5pool[env];
  const s6poolAddress = contractAddresses.s6pool[env];
  const s7poolAddress = contractAddresses.s7pool[env];

  // Create new contract instances using the raw, unwrapped signer
  referralContract = new ethers.Contract(referralAddress, referralAbi, rawSigner);
  stakingContract = new ethers.Contract(stakingAddress, stakingAbi, rawSigner);
  athContract = new ethers.Contract(athAddress, athAbi, rawSigner);
  usdtContract = new ethers.Contract(usdtAddress, athAbi, rawSigner);
  routerContract = new ethers.Contract(routerAddress, uniswapV2RouterAbi, rawSigner);
  s5poolContract = new ethers.Contract(s5poolAddress, s5poolAbi, rawSigner);
  s6poolContract = new ethers.Contract(s6poolAddress, s6poolAbi, rawSigner);
  s7poolContract = new ethers.Contract(s7poolAddress, s7poolAbi, rawSigner);

  console.log("Contracts initialized:", {
    referral: await referralContract.getAddress(),
    staking: await stakingContract.getAddress(),
    ath: await athContract.getAddress(),
    usdt: await usdtContract.getAddress(),
    router: await routerContract.getAddress(),
    s5pool: await s5poolContract.getAddress(),
    s6pool: await s6poolContract.getAddress(),
    s7pool: await s7poolContract.getAddress(),
  });

  walletState.contractsInitialized = true;
  console.log("[合约] 初始化成功, contractsInitialized 状态已更新为 true");
};

/**
 * Resets all contract instances.
 * This should be called on wallet disconnection or account change.
 */
export const resetContracts = () => {
  referralContract = null;
  stakingContract = null;
  athContract = null;
  usdtContract = null;
  routerContract = null;
  s5poolContract = null;
  s6poolContract = null;
  s7poolContract = null;
  console.log("Contract instances have been reset.");
};

/**
 * Fetches the user's raw team KPI as a BigInt for comparisons.
 * @returns {Promise<bigint>} The user's team KPI as a BigInt.
 */
export const getTeamKpiBigNumber = async () => {
    if (!stakingContract || !walletState.address) {
        console.warn("Staking contract not initialized or user not connected.");
        return 0n;
    }
    try {
        return await stakingContract.getTeamKpi(walletState.address);
    } catch (error) {
        console.error("Error fetching team KPI BigNumber:", error);
        return 0n;
    }
};


/**
 * Fetches the total real-time value (principal + interest) of the current user's stakes.
 * @returns {Promise<string>} The user's total staked value, formatted as a string.
 */
export const getUserStakedBalance = async () => {
  if (!stakingContract || !walletState.address) {
    console.warn("Staking contract not initialized or user not connected.");
    return "0";
  }
  try {
    // Call the balanceOf method to get the user's total staked value (principal + interest).
    const totalValue = await stakingContract.balanceOf(walletState.address);
    // Format from Wei to standard unit
    const formattedValue = ethers.formatUnits(totalValue, 18); // Assuming 18 decimals
    // console.log(`获取到用户质押总价值: ${formattedValue}`);
    return formattedValue;
  } catch (error) {
    console.error("Error fetching staked balance:", error);
    return "0";
  }
};

/**
 * Fetches the team KPI (friends boost) for the current user.
 * @returns {Promise<string>} The user's team KPI, formatted as a string.
 */
export const getFriendsBoost = async () => {
  if (!stakingContract || !walletState.address) {
    console.warn("Staking contract not initialized or user not connected.");
    return "0";
  }
  try {
    // Call the getTeamKpi method to get the user's total team performance.
    const kpi = await stakingContract.getTeamKpi(walletState.address);
    // Format from Wei to standard unit
    const formattedKpi = ethers.formatUnits(kpi, 18); // Assuming 18 decimals
    // console.log(`获取到好友助力值 (团队KPI): ${formattedKpi}`);
    return formattedKpi;
  } catch (error) {
    console.error("Error fetching friends boost (team KPI):", error);
    return "0";
  }
};

/**
 * Generic function to fetch pending rewards from a pool contract.
 * @param {ethers.Contract} poolContract The contract instance (e.g., s5poolContract).
 * @returns {Promise<string>} Formatted pending rewards.
 */
const getPendingRewards = async (poolContract) => {
    if (!poolContract || !walletState.address) {
        // This is a normal state if contracts are not yet initialized, so using console.log
        // console.log("Pool contract not initialized or user not connected for rewards check.");
        return "0";
    }
    try {
        const isProduction = import.meta.env.PROD;
        const env = isProduction ? 'production' : 'development';
        const athAddress = contractAddresses.ath[env];

        // The correct function name from the ABI is getTokenRewards
        const rewards = await poolContract.getTokenRewards(walletState.address, athAddress);
        return ethers.formatUnits(rewards, 18);
    } catch (error) {
        console.error(`Error fetching pending rewards from ${await poolContract.getAddress()}:`, error);
        return "0";
    }
};

/**
 * Fetches pending rewards from the S5 pool for the current user.
 * @returns {Promise<string>} Formatted S5 pending rewards.
 */
export const getS5PendingRewards = async () => getPendingRewards(s5poolContract);

/**
 * Fetches pending rewards from the S6 pool for the current user.
 * @returns {Promise<string>} Formatted S6 pending rewards.
 */
export const getS6PendingRewards = async () => getPendingRewards(s6poolContract);

/**
 * Fetches pending rewards from the S7 pool for the current user.
 * @returns {Promise<string>} Formatted S7 pending rewards.
 */
export const getS7PendingRewards = async () => getPendingRewards(s7poolContract);


/**
 * Generic function to claim rewards from a pool contract.
 * @param {ethers.Contract} poolContract The contract instance (e.g., s5poolContract).
 * @returns {Promise<boolean>} True if the claim was successful.
 */
const claimRewards = async (poolContract) => {
    if (!poolContract || !walletState.address) {
        showToast("奖金池合约未初始化或钱包未连接");
        return false;
    }
    try {
        const isProduction = import.meta.env.PROD;
        const env = isProduction ? 'production' : 'development';
        const athAddress = contractAddresses.ath[env];

        // The claim function from the ABI is harvest(tokenAddress)
        const tx = await poolContract.harvest(athAddress);
        showToast("交易已发送，等待确认...");
        await tx.wait();
        showToast("奖励领取成功！");
        return true;
    } catch (error) {
        if (error.code === 'ACTION_REJECTED') {
            console.log("User rejected the transaction.");
            // No toast for user rejection
        } else {
            console.error(`Error claiming rewards from ${await poolContract.getAddress()}:`, error);
            showToast(`领取失败: ${error.reason || '未知错误'}`);
        }
        return false;
    }
};

/**
 * Claims rewards from the S5 pool.
 * @returns {Promise<boolean>} True if successful.
 */
export const claimS5Rewards = async () => claimRewards(s5poolContract);

/**
 * Claims rewards from the S6 pool.
 * @returns {Promise<boolean>} True if successful.
 */
export const claimS6Rewards = async () => claimRewards(s6poolContract);

/**
 * Claims rewards from the S7 pool.
 * @returns {Promise<boolean>} True if successful.
 */
export const claimS7Rewards = async () => claimRewards(s7poolContract);

/**
 * Checks all reward pools to see if the user has any pending rewards.
 * Updates the global walletState.hasClaimableRewards.
 * @returns {Promise<boolean>} True if there are any claimable rewards.
 */
export const checkAllClaimableRewards = async () => {
    if (!walletState.isAuthenticated || !walletState.contractsInitialized) {
        walletState.hasClaimableRewards = false;
        return false;
    }
    try {
        // We can run these checks in parallel for performance
        const [s5, s6, s7] = await Promise.all([
            getS5PendingRewards(),
            getS6PendingRewards(),
            getS7PendingRewards(),
        ]);

        const hasRewards = parseFloat(s5) > 0 || parseFloat(s6) > 0 || parseFloat(s7) > 0;
        walletState.hasClaimableRewards = hasRewards;
        console.log(`[小红点检查] 检查完成. 是否有奖励可领: ${hasRewards}`);
        return hasRewards;
    } catch (error) {
        console.error("[小红点检查] 检查可领奖励时出错:", error);
        walletState.hasClaimableRewards = false;
        return false;
    }
};


export const getUserStakingData = async () => {
  if (!stakingContract || !walletState.address) {
    console.warn("Staking contract not initialized or user not connected.");
    return [];
  }
  // console.log(`[质押列表] 开始获取数据, 用户地址: ${walletState.address}`);

  try {
    const count = await stakingContract.stakeCount(walletState.address);
    const stakeCount = Number(count);
    // console.log(`[质押列表] 获取到总质押笔数: ${stakeCount}`);


    if (stakeCount === 0) {
      // console.log("[质押列表] 用户无质押记录, 停止获取.");
      return [];
    }

    const recordPromises = [];
    const rewardPromises = [];
    const indices = [];

    // Loop from newest to oldest
    for (let i = stakeCount - 1; i >= 0; i--) {
      indices.push(i);
      recordPromises.push(stakingContract.userStakeRecord(walletState.address, i));
      rewardPromises.push(stakingContract.rewardOfSlot(walletState.address, i));
    }

    const records = await Promise.all(recordPromises);
    const rewards = await Promise.all(rewardPromises);

    // console.log("[质押列表] 批量获取到原始Record数据:", records);
    // console.log("[质押列表] 批量获取到原始Reward数据:", rewards);

    const stakeDurations = [86400, 1296000, 2592000]; // 1, 15, 30 days in seconds

    const formattedData = records.map((record, index) => {
      const originalIndex = indices[index];
      const totalValue = rewards[index];

      let interest;
      if (record.status === true) { // Redeemed
        interest = record.finalReward > 0 ? record.finalReward - record.amount : 0n;
      } else { // In-progress
        const totalValue = totalValue ? BigInt(totalValue.toString()) : 0n;
        interest = totalValue > record.amount ? totalValue - record.amount : 0n;
      }

      const stakeTimeInSeconds = Number(record.stakeTime);
      const stakeDurationInSeconds = stakeDurations[Number(record.stakeIndex)];
      const expiryTimestamp = (stakeTimeInSeconds + stakeDurationInSeconds) * 1000;

      let displayStatus = 'waiting';
      if (record.status === true) {
        displayStatus = 'redeemed';
      } else if (expiryTimestamp <= Date.now()) {
        displayStatus = 'redeemable';
      }

      const decimals = getUsdtDecimals();

      return {
        principal: ethers.formatUnits(record.amount, decimals),
        interest: ethers.formatUnits(interest, decimals),
        stakeDate: new Date(stakeTimeInSeconds * 1000).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/\//g, '-'),
        expiryTimestamp: expiryTimestamp,
        displayStatus: displayStatus,
        originalIndex: originalIndex, // Add the original index here
      };
    });

    // console.log("[质押列表] 数据处理完成, 最终格式化后数据:", formattedData);
    return formattedData;

  } catch (error) {
    console.error("[质押列表] 获取数据时发生严重错误:", error);
    showToast("获取质押数据失败");
    return [];
  }
};

export const unstake = async (id) => {
  if (!stakingContract) {
    showToast("质押合约未初始化");
    return false;
  }
  if (typeof id !== 'number' || id < 0) {
    showToast("无效的订单ID");
    return false;
  }

  console.log(`[赎回操作] 准备为 ID 为 ${id} 的订单发起交易...`);

  try {
    // Dry-run the transaction first to catch potential reverts without sending a transaction.
    await stakingContract.unstake.staticCall(id);
    console.log("[赎回操作] 静态调用检查通过，交易很可能会成功。");

    const tx = await stakingContract.unstake(id);
    console.log(`[赎回操作] 交易已发送, Hash: ${tx.hash}. 等待链上确认...`);
    // showToast("交易已发送，等待确认...");

    const receipt = await tx.wait();
    console.log("[赎回操作] 交易成功!", receipt);
    showToast("赎回成功！");

    return true;
  } catch (error) {
    // Check if the error is due to user rejecting the transaction in their wallet.
    if (error.code === 'ACTION_REJECTED') {
      console.log("[赎回操作] 用户拒绝了交易。");
      // No toast notification needed for user-initiated cancellation.
    } else {
      console.error("[赎回操作] 交易失败 (可能是静态调用检查时发现问题):", error);
      showToast(`赎回失败: ${error.reason || error.message}`);
    }
    return false;
  }
};


export const checkIfUserHasReferrer = async () => {
  if (!referralContract || !walletState.address) {
    console.log("Referral contract not initialized or user not connected.");
    // Default to false to prevent sharing if state is unclear
    return false;
  }
  try {
    const hasReferrer = await referralContract.isBindReferral(walletState.address);
    console.log(`用户是否已绑定推荐人: ${hasReferrer}`);
    return hasReferrer;
  } catch (error) {
    console.error("Error checking user's referrer status:", error);
    return false; // Default to false on error
  }
};

/**
 * Fetches the USDT balance for the current user.
 * @returns {Promise<string>} The user's USDT balance, formatted as a string.
 */
export const getUsdtBalance = async () => {
  if (!usdtContract || !walletState.address) {
    console.warn("USDT contract not initialized or user not connected.");
    return "0";
  }
  try {
    const balance = await usdtContract.balanceOf(walletState.address);
    return ethers.formatUnits(balance, getUsdtDecimals());
  } catch (error) {
    console.error("Error fetching USDT balance:", error);
    return "0";
  }
};

// --- Staking and Referral Flow Functions ---

/**
 * Uses the Uniswap Router to get the expected amount of ATH for a given USDT amount.
 * @param {bigint} usdtAmountIn The amount of USDT in, as a BigInt (6 decimals).
 * @returns {Promise<bigint>} The expected amount of ATH out, as a BigInt (18 decimals).
 */
const getExpectedAthAmount = async (usdtAmountIn) => {
  if (!routerContract) {
    console.error("Router contract not initialized.");
    return 0n;
  }
  const isProduction = import.meta.env.PROD;
  const env = isProduction ? 'production' : 'development';
  const usdtAddress = contractAddresses.usdt[env];
  const athAddress = contractAddresses.ath[env];
  
  console.log(`[滑点计算] 预查询参数:`, {
    '输入USDT (wei)': usdtAmountIn.toString(),
    'USDT地址': usdtAddress,
    'ATH地址': athAddress
  });

  try {
    const amountsOut = await routerContract.getAmountsOut(usdtAmountIn, [usdtAddress, athAddress]);
    console.log(`[滑点计算] 预查询结果:`, {
      '输出ATH (wei)': amountsOut[1].toString(),
      'ATH地址': athAddress
    });
    return amountsOut[1]; // The second element is the output amount
  } catch (error) {
    console.error("Error fetching expected ATH amount from router:", error);
    return 0n;
  }
};

/**
 * Gets the current USDT allowance for the staking contract.
 * @returns {Promise<string>} The allowance amount in ethers (string).
 */
export const getUsdtAllowance = async () => {
  const stakingAddress = contractAddresses.staking[import.meta.env.PROD ? 'production' : 'development'];
  if (!usdtContract || !walletState.address || !stakingAddress) {
    console.warn("USDT contract not initialized, wallet not connected, or staking address missing.");
    return "0";
  }
  try {
    const allowance = await usdtContract.allowance(walletState.address, stakingAddress);
    return ethers.formatUnits(allowance, getUsdtDecimals());
  } catch (error) {
    console.error("Error fetching USDT allowance:", error);
    return "0";
  }
};

/**
 * Approves the staking contract to spend a certain amount of USDT.
 * Instead of a specific amount, this will now approve the maximum possible amount.
 * @returns {Promise<boolean>} True if the approval transaction was successful, false otherwise.
 */
export const approveUsdt = async () => {
  const stakingAddress = contractAddresses.staking[import.meta.env.PROD ? 'production' : 'development'];
  if (!usdtContract || !stakingAddress) {
    console.error("USDT contract not initialized or staking address missing.");
    return false;
  }
  try {
    const tx = await usdtContract.approve(stakingAddress, ethers.MaxUint256);
    await tx.wait(); // Wait for the transaction to be mined
    console.log("USDT max approval successful, transaction hash:", tx.hash);
    return true;
  } catch (error) {
    console.error("Error approving USDT:", error);
    return false;
  }
};

/**
 * Gets the referrer for an existing user.
 * @returns {Promise<string|null>} The referrer's address or null if not found/error.
 */
export const getReferrer = async () => {
  if (!referralContract || !walletState.address) {
    console.warn("Referral contract not initialized or user not connected.");
    return null;
  }
  try {
    return await referralContract.getReferral(walletState.address);
  } catch (error) {
    console.error("Error fetching referrer:", error);
    return null;
  }
};

/**
 * Gets the root address from the referral contract.
 * @returns {Promise<string|null>} The root referrer's address or null if error.
 */
export const getRootReferrer = async () => {
  if (!referralContract) {
    console.warn("Referral contract not initialized.");
    return null;
  }
  try {
    return await referralContract.getRootAddress();
  } catch (error) {
    console.error("Error fetching root referrer:", error);
    return null;
  }
};

/**
 * Checks if a given address is a valid referrer (i.e., has already staked).
 * @param {string} referrerAddress The address to check.
 * @returns {Promise<boolean>} True if the referrer is valid.
 */
export const isReferrerValid = async (referrerAddress) => {
  if (!referralContract) {
    console.warn("Referral contract not initialized.");
    return false;
  }
  try {
    return await referralContract.isBindReferral(referrerAddress);
  } catch (error) {
    console.error("Error validating referrer:", error);
    return false;
  }
};

/**
 * Executes the final staking transaction.
 * @param {string} amount The amount of USDT to stake, in ethers.
 * @param {number} stakeIndex The index for the staking duration (e.g., 1, 15, 30).
 * @param {string} parentAddress The address of the referrer.
 * @returns {Promise<boolean>} True if the transaction was successful.
 */
export const stakeWithInviter = async (amount, stakeIndex, parentAddress) => {
  if (!stakingContract) {
    showToast("质押合约未初始化");
    return false;
  }
  try {
    const decimals = getUsdtDecimals();
    const amountInWei = ethers.parseUnits(amount, decimals);
    
    // --- Calculate amountOutMin with 5% slippage ---
    const expectedAth = await getExpectedAthAmount(amountInWei / 2n); // Only half is swapped
    if (expectedAth === 0n) {
      console.error("Could not calculate expected ATH amount, aborting stake.");
      showToast("无法计算预期输出，质押中止");
      return false;
    }
    const slippageTolerance = 10n; // 10%
    const amountOutMin = (expectedAth * (100n - slippageTolerance)) / 100n;
    
    console.log(`[滑点计算] 结果:`, {
      '预期获得ATH (wei)': expectedAth.toString(),
      '最小接受ATH (wei)': amountOutMin.toString()
    });
    // -------------------------------------------------

    console.log("[contracts.js] stakeWithInviter Parameters:", {
      _amount: amountInWei.toString(),
      amountOutMin: amountOutMin.toString(),
      _stakeIndex: stakeIndex,
      parent: parentAddress
    });
    
    const tx = await stakingContract.stakeWithInviter(
      amountInWei,
      amountOutMin,
      stakeIndex,
      parentAddress
    );
    await tx.wait();
    console.log("Staking successful, transaction hash:", tx.hash);
    return true;
  } catch (error) {
    if (error.code === 'ACTION_REJECTED') {
        console.log('[质押操作] 用户在钱包中拒绝了交易。');
        // No toast notification for user rejection
    } else {
        console.error("Error during stakeWithInviter call:", error);
        showToast(`质押失败: ${error.reason || '未知错误'}`);
    }
    return false;
  }
};

/**
 * Reads the current maximum stake amount from the contract.
 * @returns {Promise<string>} The max stake amount, formatted as a string.
 */
export const getMaxStakeAmount = async () => {
  if (!stakingContract) {
    console.warn("Staking contract not initialized.");
    return "0";
  }
  try {
    const maxStake = await stakingContract.maxStakeAmount();
    return ethers.formatUnits(maxStake, getUsdtDecimals());
  } catch (error) {
    console.error("Error fetching max stake amount:", error);
    return "0";
  }
};

/**
 * Fetches the reward for a single stake record by its index.
 * Note: This is now a standalone function as it's called from HowToUseSection.vue
 * @param {number} id The permanent ID of the stake record.
 * @returns {Promise<BigInt>} The total reward value as a BigInt.
 */
export const rewardOfSlot = async (id) => {
    if (!stakingContract) {
        console.warn("Staking contract not initialized for rewardOfSlot call.");
        return 0n;
    }
    try {
        // The contract function signature has changed from index to id.
        return await stakingContract.rewardOfSlot(walletState.address, id);
    } catch (error) {
        console.error(`Error fetching reward for slot with ID ${id}:`, error);
        return 0n;
    }
};

// --- Exported Functions to get contract instances (optional, but good practice) ---
// This allows other parts of the app to get a read-only instance if needed,
// but for now, we will keep them internal and expose specific function calls later.

// Example of how we will export specific functions later:
/*
export const getUserBalance = async () => {
  if (!athContract) throw new Error("ATH contract not initialized.");
  return await athContract.balanceOf(walletState.address);
};
*/
