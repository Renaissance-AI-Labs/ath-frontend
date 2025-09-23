import { ethers } from 'ethers';
import { walletState } from './wallet';
import { toRaw } from 'vue';

// --- Import ABIs ---
import referralAbi from '../abis/referral.json';
import stakingAbi from '../abis/staking.json';
import athAbi from '../abis/ath.json';

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
};

// --- Contract Instances ---
let referralContract;
let stakingContract;
let athContract;

// We need to export these for other modules to use them.
export { referralContract, stakingContract, athContract };

/**
 * Initializes all contract instances with the current signer from walletState.
 * This should be called after a successful wallet connection.
 */
export const initializeContracts = () => {
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

  // Create new contract instances using the raw, unwrapped signer
  referralContract = new ethers.Contract(referralAddress, referralAbi, rawSigner);
  stakingContract = new ethers.Contract(stakingAddress, stakingAbi, rawSigner);
  athContract = new ethers.Contract(athAddress, athAbi, rawSigner);

  console.log("Contracts initialized:", {
    referral: referralContract.address,
    staking: stakingContract.address,
    ath: athContract.address,
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
