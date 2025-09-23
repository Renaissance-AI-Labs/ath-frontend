import { ethers } from 'ethers';
import { walletState } from './wallet';
import { toRaw } from 'vue';
import { showToast } from '../services/notification';

// --- Helper to get USDT decimals based on environment ---
const getUsdtDecimals = () => {
  const isProduction = import.meta.env.PROD;
  // Production (Mainnet) USDT uses 6 decimals, Development (Testnet) test USDT uses 18
  return isProduction ? 6 : 18;
};

// --- Import ABIs ---
import referralAbi from '../abis/referral.json';
import stakingAbi from '../abis/staking.json';
import athAbi from '../abis/ath.json';
// No need for a separate USDT ABI if it follows ERC20 standard like `ath.json`
// import usdtAbi from '../abis/usdt.json';

const uniswapV2RouterAbi = [
  "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)"
];

// --- Contract Addresses ---
const contractAddresses = {
  referral: {
    production: '', // To be deployed
    development: '0x20B0850f3B888B4C2494E7C7fbcF9808C6e82F77',
  },
  staking: {
    production: '', // To be deployed
    development: '0xE8bF70FCcdA199A1CC2F90412e6Ab13779F95B3F',
  },
  ath: {
    production: '', // To be deployed
    development: '0x705c99F6C25056cC73B299dFe209d80455FA7D63',
  },
  usdt: {
    production: '0x55d398326f99059fF775485246999027B3197955', // BNB Mainnet USDT
    development: '0xaE36d423c5B05f80926AaEAE0Fca978A74C0aA01', // BNB Testnet USDT
  },
  router: {
    production: '0x10ED43C718714eb63d5aA57B78B54704E256024E', // PancakeSwap Router V2 on BNB Mainnet
    development: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1', // PancakeSwap Router V2 on BNB Testnet
  }
};

// --- Contract Instances ---
let referralContract;
let stakingContract;
let athContract;
let usdtContract;
let routerContract;

// We need to export these for other modules to use them.
export { referralContract, stakingContract, athContract, usdtContract };

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

  // Create new contract instances using the raw, unwrapped signer
  referralContract = new ethers.Contract(referralAddress, referralAbi, rawSigner);
  stakingContract = new ethers.Contract(stakingAddress, stakingAbi, rawSigner);
  athContract = new ethers.Contract(athAddress, athAbi, rawSigner);
  usdtContract = new ethers.Contract(usdtAddress, athAbi, rawSigner);
  routerContract = new ethers.Contract(routerAddress, uniswapV2RouterAbi, rawSigner);

  console.log("Contracts initialized:", {
    referral: await referralContract.getAddress(),
    staking: await stakingContract.getAddress(),
    ath: await athContract.getAddress(),
    usdt: await usdtContract.getAddress(),
    router: await routerContract.getAddress(),
  });
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
  console.log("Contract instances have been reset.");
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
    console.log(`获取到用户质押总价值: ${formattedValue}`);
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
    console.log(`获取到好友助力值 (团队KPI): ${formattedKpi}`);
    return formattedKpi;
  } catch (error) {
    console.error("Error fetching friends boost (team KPI):", error);
    return "0";
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
    // USDT on BNB Chain typically has 18 decimals, but can be 6.
    // We will handle decimals dynamically in each function.
    const decimals = getUsdtDecimals();
    const formattedBalance = ethers.formatUnits(balance, decimals);
    console.log(`获取到用户 USDT 余额 (使用 ${decimals} 位小数): ${formattedBalance}`);
    return formattedBalance;
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
    console.error("Staking contract not initialized.");
    return false;
  }
  try {
    // Dynamically get decimals for the current environment
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
    console.error("Error during stakeWithInviter call:", error);
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
    const maxAmountWei = await stakingContract.maxStakeAmount();
    // The amount is compared with USDT amount, so decimals should match USDT's.
    const decimals = getUsdtDecimals();
    return ethers.formatUnits(maxAmountWei, decimals);
  } catch (error) {
    console.error("Error fetching max stake amount:", error);
    return "0";
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
