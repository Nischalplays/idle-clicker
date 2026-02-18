import { currencies } from "./stats.js";
import { purchasedUpgrade, reApplyUpgradeBuffs, upgrades } from "./upgrades.js";

let startInterval = null;

export function saveCurrency(currencyObject) {
  localStorage.setItem("currencies", JSON.stringify(currencyObject));
}

export function loadCurrencyData(currencies) {
  const data = JSON.parse(localStorage.getItem("currencies"));
  if (!data) return;

  Object.keys(data).forEach((key) => {
    currencies[key] = data[key];
  });
}

export function saveUpgradesData() {
  localStorage.setItem("purchasedUpgrades", JSON.stringify(purchasedUpgrade));
}

export function loadUpgradeData() {
  const data = JSON.parse(localStorage.getItem("purchasedUpgrades"));
  if (!data) return;

  Object.keys(data).forEach((upgradeCurrency) => {
    Object.keys(data[upgradeCurrency]).forEach((upgradeType) => {
      purchasedUpgrade[upgradeCurrency] =
        purchasedUpgrade[upgradeCurrency] || {};
      purchasedUpgrade[upgradeCurrency][upgradeType] =
        data[upgradeCurrency][upgradeType];
    });
  });

  Object.keys(purchasedUpgrade).forEach((upgradeCurrency) => {
    Object.keys(purchasedUpgrade[upgradeCurrency]).forEach((upgradeType) => {
      const upgardeData = upgrades[upgradeCurrency]?.[upgradeType];
      if (!upgardeData) return;
      const purchasedData = purchasedUpgrade[upgradeCurrency][upgradeType];
      upgardeData.level = purchasedData.level;
      upgardeData.current = purchasedData.current;
      upgardeData.displaying = purchasedData.displaying;
    });
  });
  reApplyUpgradeBuffs();
}

export function saveOfflineTime(){
  localStorage.setItem("lastOffline", Date.now());
}

export function loadOfflineTime(){
  const data = localStorage.getItem("lastOffline");
  if(!data) return null;

  const t = Number(data);
  return Number.isFinite(t)? t : null;; 
}

export function savePendingOfflineGain(arr){
  localStorage.setItem("PendingOfflineEarned", JSON.stringify(arr));
}

export function getPendingOfflineGain(){
  const data = localStorage.getItem("PendingOfflineEarned");

  if(!data) return null;
  try{
    const arr = JSON.parse(data);
    return Array.isArray(arr) ? arr : null;
  }
  catch{
    return null;
  }
}

export function clearPendingOfflineGain(){
  localStorage.removeItem("PendingOfflineEarned");
}

export function startSaveInterval() {
  if (startInterval) return;
  startInterval = setInterval(() => {
    saveCurrency(currencies);
    saveUpgradesData();
  }, 2000);
}

export function saveData() {
  saveCurrency(currencies);
  saveUpgradesData();
}

export function resetData(){
  clearInterval(startInterval);
  console.log(purchasedUpgrade);
  localStorage.removeItem("currencies");
  localStorage.removeItem("purchasedUpgrades");
}