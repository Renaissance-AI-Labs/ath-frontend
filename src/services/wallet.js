import { reactive, markRaw } from 'vue';
import { ethers } from 'ethers';
import { APP_ENV } from './environment'; // Import from the new centralized file
import {
  initializeContracts,
  resetContracts,
  checkIfUserHasReferrer
} from './contracts';
import { showToast } from './notification';
import { t } from '../i18n';

// --- Network Configurations ---
const networks = {
  juchain: {
    chainId: '0x33450', // 210000
    chainName: 'JuChain',
    nativeCurrency: { name: 'JUC', symbol: 'JUC', decimals: 18 },
    rpcUrls: ['https://rpc.juchain.org'],
    blockExplorerUrls: [] // Add explorer URL if available
  },
  bnbMainnet: {
    chainId: '0x38', // 56
    chainName: 'BNB Smart Chain Mainnet',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-mainnet.public.blastapi.io'],
    blockExplorerUrls: ['https://bscscan.com']
  },
  bnbTestnet: {
    chainId: '0x61', // 97
    chainName: 'BNB Smart Chain Testnet',
    nativeCurrency: { name: 'tBNB', symbol: 'tBNB', decimals: 18 },
    rpcUrls: ['https://bsc-testnet.public.blastapi.io'],
    blockExplorerUrls: ['https://testnet.bscscan.com']
  }
};
// --- End of Network Configurations ---


// Reactive state for wallet information
export const walletState = reactive({
  isConnected: false,
  isAuthenticated: false,
  address: null,
  network: null, // To store the network name
  chainId: null, // To store the chain ID
  signer: null,
  walletType: null, // To store the type of the connected wallet
  isNewUser: null, // null: unknown, true: new, false: old
  contractsInitialized: false, // <-- Add this new state
  hasClaimableRewards: false, // New state for the red dot indicator
});

// Utility function to format wallet address
export const formatAddress = (address) => {
  if (!address || address.length < 11) {
    return 'Invalid Address';
  }
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// New authentication function
const authenticateWallet = async (address, signer) => {
  const authTokenKey = `ath_authToken_${address.toLowerCase()}`;
  const storedToken = localStorage.getItem(authTokenKey);

  if (storedToken) {
    try {
      // Since there's no expiration, just parsing it successfully is enough.
      const token = JSON.parse(storedToken);
      if (token.signature) { // A simple check to see if the token is in the expected format.
        console.log("Found valid auth token in storage.");
        walletState.isAuthenticated = true;
        return true;
      }
    } catch (e) {
      console.error("Error parsing auth token, removing it.", e);
      localStorage.removeItem(authTokenKey);
    }
  }

  try {
    const message = "Welcome to the ATH platform. Please sign this message to verify your wallet.";
    const signature = await signer.signMessage(message);

    // Optional: You could verify the signature on a backend, but for client-side only verification is implicit.
    // For this example, we'll assume a successful signature means verification.
    console.log("Signature successful.");
    // No expiration needed. Store the signature directly.
    const token = { signature };
    localStorage.setItem(authTokenKey, JSON.stringify(token));
    walletState.isAuthenticated = true;
    return true;
  } catch (error) {
    if (error.code === 'ACTION_REJECTED') {
      console.log('User rejected the signature request.');
    } else {
      console.error('Failed to sign message:', error);
    }
    walletState.isAuthenticated = false;
    return false;
  }
};

// --- New Network Management Function ---
const switchNetwork = async (rawProvider) => {
  // Use the new APP_ENV to determine the target network
  const targetNetwork = APP_ENV === 'PROD' ? networks.bnbMainnet : networks.bnbTestnet;

  console.log(`Application Environment: '${APP_ENV}'. Targeting BNB ${APP_ENV === 'PROD' ? 'Mainnet' : 'Testnet'}.`);

  try {
    await rawProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetNetwork.chainId }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to the wallet.
    if (switchError.code === 4902) {
      try {
        await rawProvider.request({
          method: 'wallet_addEthereumChain',
          params: [targetNetwork],
        });
      } catch (addError) {
        if (addError.code === 4001 || addError.code === 'ACTION_REJECTED') {
          console.log("User rejected the add network request.");
        } else {
          console.error("Failed to add the network:", addError);
          alert("Failed to add the network. Please do it manually.");
        }
        return false; // Fail if add network fails for any reason
      }
    } else if (switchError.code === 4001 || switchError.code === 'ACTION_REJECTED') {
        console.log("User rejected the network switch request.");
        return false;
    } else {
        console.error("Failed to switch network:", switchError);
        // We keep the alert here for other unexpected errors.
        alert("Failed to switch network.");
        return false;
    }
  }
  return true;
};
// --- End of Network Management Function ---

// --- New JuChain Network Switch Function ---
// This function is no longer needed as the logic is now integrated into connectWallet
// --- End of JuChain Network Switch Function ---

const _performNetworkSwitch = async (provider, targetNetwork) => {
  if (!provider) {
    console.log("No active wallet provider to perform network switch.");
    return false;
  }

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetNetwork.chainId }],
    });
    showToast(t('toast.networkSwitched', { networkName: targetNetwork.chainName }));
    return true;
  } catch (switchError) {
    if (switchError.code === 4902) { // Chain not added
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [targetNetwork],
        });
        showToast(t('toast.networkSwitched', { networkName: targetNetwork.chainName }));
        return true;
      } catch (addError) {
        console.error(`Failed to add the network ${targetNetwork.chainName}:`, addError);
        return false;
      }
    } else {
      console.error(`Failed to switch to the network ${targetNetwork.chainName}:`, switchError);
      return false;
    }
  }
};

export const ensureCorrectNetwork = async () => {
  if (!walletState.isConnected) return;

  const isEventPage = window.location.pathname.includes('/xbrokers-event');
  const targetNetwork = isEventPage 
    ? networks.juchain 
    : (APP_ENV === 'PROD' ? networks.bnbMainnet : networks.bnbTestnet);

  if (Number(walletState.chainId) !== Number(targetNetwork.chainId)) {
    console.log(`Incorrect network detected. Current: ${walletState.chainId}, Target: ${targetNetwork.chainId}. Prompting switch...`);
    await _performNetworkSwitch(activeProvider, targetNetwork);
  }
};


// Main function to connect to a wallet
export const connectWallet = async (walletType) => {
  let rawProvider;
  let provider; // This will be the ethers provider
  let accounts;

  try {
    // --- Step 1: Get the raw provider based on walletType ---
    if (walletType === 'tokenpocket') {
        if (!window.tokenpocket?.ethereum) {
            alert('TokenPocket wallet not detected!');
            return false;
        }
        rawProvider = window.tokenpocket.ethereum;
    } else if (walletType === 'okx') {
        if (!window.okexchain) {
            alert('OKX wallet not detected!');
            return false;
        }
        rawProvider = window.okexchain;
    } else if (walletType === 'binance') {
        if (!window.binancew3w?.ethereum) {
            alert('Binance Web3 Wallet not detected!');
            return false;
        }
        rawProvider = window.binancew3w.ethereum;
    } else {
        // No valid wallet type provided
        alert('Please select a valid wallet (OKX, TokenPocket or Binance)!');
        return false;
    }

    // --- Step 2: Use the raw provider for network management ---
    const currentChainIdHex = await rawProvider.request({ method: 'eth_chainId' });
    const currentChainId = Number(currentChainIdHex);

    const isEventPage = window.location.pathname.includes('/xbrokers-event');
    const targetNetwork = isEventPage 
      ? networks.juchain 
      : (APP_ENV === 'PROD' ? networks.bnbMainnet : networks.bnbTestnet);

    // Only switch if the network is actually different.
    if (currentChainId !== Number(targetNetwork.chainId)) {
      console.log(`Network mismatch. Current: ${currentChainId}, Target: ${targetNetwork.chainId}. Switching...`);
      const switchSuccess = await _performNetworkSwitch(rawProvider, targetNetwork);
      if (!switchSuccess) {
        // If the user cancels the initial network switch, we stop the connection process.
        return false;
      }
    } else {
      console.log(`Already on correct network (${currentChainId}). No switch needed.`);
    }

    // --- Step 3: Wrap the raw provider with Ethers and get accounts if not already fetched ---
    provider = new ethers.BrowserProvider(rawProvider);

    if (!accounts) { // For non-SDK paths, get accounts now
        accounts = await provider.send('eth_requestAccounts', []);
    }
    
    if (!accounts || accounts.length === 0) {
      console.log('No accounts found');
      return false;
    }

    const address = accounts[0];
    
    // 2. Get the signer
    const signer = await provider.getSigner();

    // 3. Get Network Info
    const network = await provider.getNetwork();

    // 4. Authenticate wallet with signature (once a month)
    const isAuthenticated = await authenticateWallet(address, signer);

    if (!isAuthenticated) {
      // If authentication fails (e.g., user rejects signature), we stop the connection process.
      return false;
    }

    // 5. Update the global state
    walletState.isConnected = true;
    walletState.address = address;
    walletState.chainId = Number(network.chainId);
    if (Number(network.chainId) === 210000) {
      walletState.network = 'JuChain';
    } else {
      walletState.network = network.name; // Store network name (e.g., 'sepolia', 'mainnet')
    }
    walletState.signer = markRaw(signer);
    walletState.walletType = walletType; // Save the wallet type

    // Save address to localStorage for auto-reconnect
    localStorage.setItem('ath_walletAddress', address);
    localStorage.setItem('ath_walletType', walletType); // Save wallet type

    // --- Initialize Contracts ---
    if (window.location.pathname.includes('/xbrokers-event')) {
      console.log("On xBrokers event page, skipping BSC contract initialization.");
      walletState.contractsInitialized = false; 
      setupWalletListeners(rawProvider);
      return true;
    }

    await initializeContracts();
    // --------------------------

    // FINAL STEP: Setup listeners only after a fully successful connection.
    setupWalletListeners(rawProvider);

    // After successful connection and authentication, check if the user is new.
    const hasReferrer = await checkIfUserHasReferrer();
    walletState.isNewUser = !hasReferrer; // isBindReferral returns true if they have a referrer (old user)

    console.log(`Successfully connected to ${walletType} with address:`, walletState.address);

    return true; // Connection successful

  } catch (error) {
    // Check for user rejection (Ethers v6 uses 'ACTION_REJECTED', 4001 is the standard JSON-RPC error)
    if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
      console.log('User rejected the connection/signature request.');
    } else {
      console.error('Failed to connect wallet:', error);
      alert(`Connection failed: ${error.message || 'An unexpected error occurred.'}`);
    }
    return false;
  }
};

// Function to disconnect the wallet
export const disconnectWallet = () => {
  // --- Reset Contracts ---
  resetContracts();
  // -----------------------

  const address = walletState.address; // Get address before clearing it.

  walletState.isConnected = false;
  walletState.isAuthenticated = false;
  walletState.contractsInitialized = false; // <-- Reset on disconnect
  walletState.address = null;
  walletState.network = null;
  walletState.chainId = null;
  walletState.signer = null;
  walletState.walletType = null;
  walletState.isNewUser = null; // Reset user status on disconnect
  walletState.hasClaimableRewards = false; // Reset on disconnect
  localStorage.removeItem('ath_walletAddress');
  localStorage.removeItem('ath_walletType'); // Also remove wallet type
  
  if (address) {
    const authTokenKey = `ath_authToken_${address.toLowerCase()}`;
    localStorage.removeItem(authTokenKey); // Clear the signature cache on disconnect.
  }

  // Clean up listeners on disconnect
  if (activeProvider && typeof activeProvider.removeListener === 'function') {
    activeProvider.removeListener('accountsChanged', handleAccountsChanged);
    activeProvider.removeListener('chainChanged', handleChainChanged);
    activeProvider = null;
    console.log('Wallet event listeners removed.');
  }

  // Do not remove the authToken for other accounts, so we only clear the current connected address.
  console.log('Wallet disconnected.');
};

// Function to automatically connect if previously connected
export const autoConnectWallet = async () => {
  // Add a delay to allow wallet providers to inject their scripts without conflict.
  setTimeout(async () => {
    const savedAddress = localStorage.getItem('ath_walletAddress');
    const savedWalletType = localStorage.getItem('ath_walletType');
    if (savedAddress && savedWalletType) {
      // Check for provider existence *inside* the timeout to ensure it has loaded.
      // Only support OKX and TokenPocket
      if (window.tokenpocket || window.okexchain || window.binancew3w) {
          console.log(`Attempting to auto-connect with ${savedWalletType}...`);
          // Use the saved wallet type for reconnection
          await connectWallet(savedWalletType);
      } else {
          console.log("Auto-connect cancelled: No wallet provider found after delay.");
      }
    }
  }, 500); // 500ms delay
};

// --- Wallet Event Listeners ---

const handleAccountsChanged = async (accounts) => {
  console.log('Wallet accounts changed:', accounts);
  if (accounts.length === 0) {
    console.log('Wallet disconnected.');
    disconnectWallet();
  } else {
    const newAddress = accounts[0];
    // --- Smart Check to Prevent Unnecessary Re-signing ---
    // Only proceed if the new address is different from the current one.
    if (newAddress.toLowerCase() === walletState.address.toLowerCase()) {
      console.log('accountsChanged event fired, but address is the same. Ignoring.');
      return;
    }

    console.log(`Switched to new address: ${newAddress}`);

    // Critical Step 1: Immediately de-authenticate the old session.
    // This will cause UI components to revert to a "please connect" state.
    walletState.isAuthenticated = false;
    walletState.contractsInitialized = false; // Also reset contracts
    localStorage.removeItem(`ath_authToken_${walletState.address.toLowerCase()}`); // Clean up old token
    walletState.address = newAddress;

    // Critical Step 2: Attempt to re-authenticate with the new address.
    // We need a provider and signer for the new account.
    const provider = new ethers.BrowserProvider(activeProvider);
    const signer = await provider.getSigner();

    // The UI is now waiting for this re-authentication to complete.
    const reauthSuccess = await authenticateWallet(newAddress, signer);

    if (reauthSuccess) {
      console.log(`Successfully re-authenticated new address: ${newAddress}`);
      // Update the rest of the state only after successful re-authentication
      walletState.signer = markRaw(signer);
      await initializeContracts(); // Re-initialize contracts for the new user context
      const hasReferrer = await checkIfUserHasReferrer();
      walletState.isNewUser = !hasReferrer;
      // isAuthenticated is already set to true inside authenticateWallet
    } else {
      console.log(`Failed to re-authenticate new address: ${newAddress}. Wallet remains connected but unauthenticated.`);
      // If re-authentication fails, we effectively disconnect the authenticated session
      // but keep the basic connection info.
      disconnectWallet(); // A full disconnect might be cleaner here.
    }
  }
};

const handleChainChanged = (chainId) => {
  console.log('Wallet chain changed to:', chainId);
  const newChainId = Number(chainId);

  // Only reload if the chain ID has actually changed from the one we have in state.
  if (newChainId !== walletState.chainId) {
    console.log(`Chain ID changed from ${walletState.chainId} to ${newChainId}. Reloading page.`);
    window.location.reload();
  } else {
    console.log('chainChanged event fired, but the chain ID is the same. Ignoring reload.');
  }
};

let activeProvider = null; // To keep track of the provider we've attached listeners to

export const setupWalletListeners = (provider) => {
  if (typeof provider?.on !== 'function') {
    return; // Do nothing if provider doesn't support events
  }

  // Clean up old listeners before attaching new ones
  if (activeProvider && typeof activeProvider.removeListener === 'function') {
    activeProvider.removeListener('accountsChanged', handleAccountsChanged);
    activeProvider.removeListener('chainChanged', handleChainChanged);
    console.log('Removed old wallet event listeners.');
  }
  
  provider.on('accountsChanged', handleAccountsChanged);
  provider.on('chainChanged', handleChainChanged);
  
  activeProvider = provider; // Store the new provider
  console.log('Wallet event listeners initialized on the correct provider.');
};

// --- Wallet Detection Function (OKX and TokenPocket only) ---
export const detectWallets = () => {
  const wallets = [];
  
  // Check for TokenPocket
  // TokenPocket injects window.tokenpocket and may set window.ethereum.isTokenPocket
  if (window.tokenpocket || window.ethereum?.isTokenPocket) {
      wallets.push({ id: 'tokenpocket', name: 'TokenPocket' });
  }
  
  // Check for OKX Wallet
  // OKX injects both window.okexchain and sets window.ethereum.isOkxWallet
  if (window.okexchain || window.ethereum?.isOkxWallet) {
      wallets.push({ id: 'okx', name: 'OKX Wallet' });
  }

  // Check for Binance Web3 Wallet
  if (window.binancew3w) {
    wallets.push({ id: 'binance', name: 'Binance Wallet' });
  }
  
  return wallets;
};
