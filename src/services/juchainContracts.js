import { ethers } from 'ethers';
import { walletState } from './wallet';
import usdtJuAbi from '../abis/ath.json';

const USDT_JU_ADDRESS = '0xc8e19C19479a866142B42fB390F2ea1Ff082E0D2';

let usdtJuContract;

export const initializeJuChainContracts = () => {
  if (walletState.signer && walletState.chainId === 210000) {
    usdtJuContract = new ethers.Contract(USDT_JU_ADDRESS, usdtJuAbi, walletState.signer);
    console.log("JuChain USDT-JU contract initialized.");
    return true;
  }
  return false;
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
