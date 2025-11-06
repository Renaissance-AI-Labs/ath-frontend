import { ethers } from 'ethers';
import { walletState } from './wallet';
import usdtJuAbi from '../abis/ath.json';
import xbrokersAbi from '../abis/xbrokers.json';

const USDT_JU_ADDRESS = '0xc8e19C19479a866142B42fB390F2ea1Ff082E0D2';
const XBROKERS_ADDRESS = '0xd4cee460Ceb47D1A30E1672EE2a13ecdf362Cf5a';

let usdtJuContract;
let xbrokersContract;

export const initializeJuChainContracts = () => {
  if (walletState.signer && walletState.chainId === 210000) {
    usdtJuContract = new ethers.Contract(USDT_JU_ADDRESS, usdtJuAbi, walletState.signer);
    xbrokersContract = new ethers.Contract(XBROKERS_ADDRESS, xbrokersAbi, walletState.signer);
    console.log("JuChain contracts initialized.");
    return true;
  }
  return false;
};

export const getBoundUid = async () => {
  if (!xbrokersContract) {
    if (!initializeJuChainContracts()) {
      throw new Error("Cannot initialize JuChain contracts.");
    }
  }
  try {
    const uid = await xbrokersContract.uidOf(walletState.address);
    return uid.toString();
  } catch (error) {
    console.error("Error fetching bound UID:", error);
    return "0";
  }
};

export const bindUid = async (uid) => {
  if (!xbrokersContract) {
    if (!initializeJuChainContracts()) {
      throw new Error("Cannot initialize JuChain contracts.");
    }
  }
  try {
    const tx = await xbrokersContract.bindUid(uid);
    return tx;
  } catch (error) {
    console.error("Error binding UID:", error);
    throw error;
  }
};

export const getUsdtJuBalance = async () => {
  if (!usdtJuContract) {
    console.log("JuChain contract not initialized.");
    if (!initializeJuChainContracts()) {
      return '0';
    }
  }

  try {
    const balance = await usdtJuContract.balanceOf(walletState.address);
    // Assuming USDT-JU also has 18 decimals like standard USDT
    return ethers.formatUnits(balance, 18); 
  } catch (error) {
    console.error("Error fetching USDT-JU balance:", error);
    return '0';
  }
};
