// Unity Ads Integration Utility
// Note: Unity Ads web support is limited. For production, consider Unity LevelPlay or web ad networks.

const UNITY_GAME_ID = import.meta.env.VITE_UNITY_GAME_ID || '5986980';
const UNITY_PLACEMENT_ID = import.meta.env.VITE_UNITY_PLACEMENT_ID || 'earn_CMX';

let unityAdsReady = false;
let unityAdsInitialized = false;

// Check if Unity Ads SDK is available
function isUnityAdsAvailable() {
  return typeof window !== 'undefined' && window.UnityAds !== undefined;
}

// Initialize Unity Ads
export function initializeUnityAds() {
  if (unityAdsInitialized || !isUnityAdsAvailable()) {
    return Promise.resolve(unityAdsReady);
  }

  return new Promise((resolve) => {
    try {
      window.UnityAds.initialize(UNITY_GAME_ID, false, false);
      unityAdsInitialized = true;
      
      // Wait for initialization
      const checkReady = setInterval(() => {
        if (window.UnityAds.isReady && window.UnityAds.isReady(UNITY_PLACEMENT_ID)) {
          unityAdsReady = true;
          clearInterval(checkReady);
          resolve(true);
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkReady);
        if (!unityAdsReady) {
          console.warn('Unity Ads initialization timeout');
          resolve(false);
        }
      }, 5000);
    } catch (error) {
      console.error('Unity Ads initialization error:', error);
      resolve(false);
    }
  });
}

// Load a rewarded ad
export function loadRewardedAd() {
  if (!isUnityAdsAvailable() || !unityAdsInitialized) {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    try {
      if (window.UnityAds.isReady && window.UnityAds.isReady(UNITY_PLACEMENT_ID)) {
        resolve(true);
      } else {
        // Try to load the ad
        window.UnityAds.load(UNITY_PLACEMENT_ID);
        const checkReady = setInterval(() => {
          if (window.UnityAds.isReady && window.UnityAds.isReady(UNITY_PLACEMENT_ID)) {
            clearInterval(checkReady);
            resolve(true);
          }
        }, 500);

        setTimeout(() => {
          clearInterval(checkReady);
          resolve(false);
        }, 10000);
      }
    } catch (error) {
      console.error('Unity Ads load error:', error);
      resolve(false);
    }
  });
}

// Show a rewarded ad
export function showRewardedAd() {
  return new Promise((resolve, reject) => {
    if (!isUnityAdsAvailable() || !unityAdsInitialized) {
      reject(new Error('Unity Ads not available'));
      return;
    }

    try {
      // Set up callbacks
      window.UnityAds.onFinish = (placementId, result) => {
        if (placementId === UNITY_PLACEMENT_ID) {
          if (result === window.UnityAds.FinishState.COMPLETED) {
            resolve(true);
          } else {
            reject(new Error('Ad not completed'));
          }
        }
      };

      window.UnityAds.onError = (error) => {
        reject(new Error(error));
      };

      // Show the ad
      if (window.UnityAds.show && window.UnityAds.isReady(UNITY_PLACEMENT_ID)) {
        window.UnityAds.show(UNITY_PLACEMENT_ID);
      } else {
        reject(new Error('Ad not ready'));
      }
    } catch (error) {
      reject(error);
    }
  });
}

// Check if ads are available
export function isAdAvailable() {
  return isUnityAdsAvailable() && unityAdsReady;
}

