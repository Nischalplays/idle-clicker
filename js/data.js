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
