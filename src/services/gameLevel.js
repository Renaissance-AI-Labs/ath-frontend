import { ethers } from 'ethers';
import { gameLevelContract } from './contracts';
import { walletState } from './wallet';
import { showToast } from './notification';
import { t } from '../i18n';

/**
 * Fetches the user's current level.
 * @returns {Promise<number>} User level (0-6).
 */
export const getUserLevel = async () => {
  if (!gameLevelContract || !walletState.address) {
    return 0;
  }
  try {
    const level = await gameLevelContract.getUserLevel(walletState.address);
    return Number(level);
  } catch (error) {
    console.error("Error fetching user level:", error);
    return 0;
  }
};

/**
 * Fetches the user's team accumulated total winnings.
 * @returns {Promise<string>} Formatted total winnings.
 */
export const getUserTotalWin = async () => {
  if (!gameLevelContract || !walletState.address) {
    return "0";
  }
  try {
    const totalWin = await gameLevelContract.getTeamTotalWin(walletState.address);
    // Assuming ATH token has 18 decimals, same as others in this project
    return ethers.formatUnits(totalWin, 18);
  } catch (error) {
    console.error("Error fetching team total win:", error);
    return "0";
  }
};

/**
 * Fetches all level configurations.
 * @returns {Promise<Array>} Array of level config objects.
 */
export const getLevelConfigs = async () => {
  if (!gameLevelContract) {
    return [];
  }
  try {
    const maxLevelBig = await gameLevelContract.maxLevel();
    const maxLevel = Number(maxLevelBig);
    const configs = [];

    // Fetch in parallel for better performance
    const promises = [];
    for (let i = 1; i <= maxLevel; i++) {
      promises.push(gameLevelContract.levelConfigs(i).then(config => ({
        level: i,
        minWinAmount: ethers.formatUnits(config.minWinAmount, 18),
        rewardRate: Number(config.rewardRate) / 100 // Convert basis points to percentage (e.g., 50 -> 0.5)
      })));
    }

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error("Error fetching level configs:", error);
    return [];
  }
};

/**
 * Fetches all user data for the personal center.
 * @returns {Promise<Object>} Object containing level, totalWin, and configs.
 */
export const getPersonalCenterData = async () => {
  if (!gameLevelContract || !walletState.address) {
    return {
      level: 0,
      totalWin: "0",
      configs: []
    };
  }
  try {
    const [level, totalWin, configs] = await Promise.all([
      getUserLevel(),
      getUserTotalWin(),
      getLevelConfigs()
    ]);
    return { level, totalWin, configs };
  } catch (error) {
    console.error("Error fetching personal center data:", error);
    return {
      level: 0,
      totalWin: "0",
      configs: []
    };
  }
};

