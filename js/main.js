import {
  generateCurrencyUI,
  addCurrency,
  updateEmptyUpgradeBox,
  updateUpgradeBoxState,
  updateUi,
} from "./ui.js";
import { doReset } from "./reset.js";
import { isSuperClick } from "./superClick.js";
import {
  checkUnlockedUpgrade,
  getNextUpgrade,
  purchasedUpgrade,
  upgrades,
} from "./upgrades.js";
import { currencies, mechanicMap } from "./stats.js";
import { createUpgradeBox, toggleUpgradePanel } from "./ui.js";
import {
  loadCurrencyData,
  loadUpgradeData,
  saveCurrency,
  saveData,
  startSaveInterval,
} from "./data.js";
import { getCtx, intiEffectCanvas, createBezelCurve, resizeCanvas, spawnGainText } from "./effects.js";

let canClickMainBtn = true;

const upgradeContainer = document.getElementById("upgradeContainer");
const toggleBtn = document.getElementById("toogleBtn");
const mainBtn = document.getElementById("mainBtn");

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

document.addEventListener("DOMContentLoaded", () => {
  startSaveInterval();
  loadCurrencyData(currencies);
  loadUpgradeData();

  //event listening Dom Elements
  generateCurrencyUI();
  checkUnlockedUpgrade("clicks");

  mainBtn.addEventListener("click", () => {
    if (!canClickMainBtn) return;
    canClickMainBtn = false;
    onClickMainButton();
    isSuperClick();
    // doReset();
    setTimeout(() => {
      canClickMainBtn = true;
    }, mechanicMap.clicks.clickDelay);
  });

  toggleBtn.addEventListener("click", (e) => {
    toggleUpgradePanel(upgradeContainer);
    e.stopPropagation();
  });
});

document.addEventListener("click", (e) => {
  if (
    !upgradeContainer.classList.contains("hidden") &&
    !upgradeContainer.contains(e.target) &&
    !toggleBtn.contains(e.target) &&
    !mainBtn.contains(e.target)
  ) {
    toggleUpgradePanel(upgradeContainer);
  }
});

document.addEventListener("touchstart", (e) => {
  if (
    !upgradeContainer.classList.contains("hidden") &&
    !upgradeContainer.contains(e.target) &&
    !toggleBtn.contains(e.target) &&
    !mainBtn.contains(e.target)
  ) {
    toggleUpgradePanel(upgradeContainer);
  }
});

window.addEventListener("offline", () => {
  saveData();
});
window.addEventListener("beforeunload", () => {
  console.log("page reloading.");
  saveData();
});
window.addEventListener("resize", resizeCanvas);


function onClickMainButton() {
  addCurrency("clicks");
  checkUnlockedUpgrade("clicks");
  updateUpgradeBoxState(currencies.clicks.resetable.current);
  const nextUpgrade = getNextUpgrade("clicks");
  if (nextUpgrade)
    updateEmptyUpgradeBox(
      currencies.clicks.resetable.current,
      nextUpgrade.unlockRequirement,
    );
}

intiEffectCanvas();
getCtx();
createBezelCurve();

//=============== inspect window helper functions =================//

export function giveCurency(currencyType, amount) {
  if (amount > 14500) amount = 14500;
  currencies[currencyType].resetable.current = amount;
  updateUi("clicks");
}

export function resetUpgrade(upgradeCurrency, upgradeName) {
  //level
  upgrades[upgradeCurrency][upgradeName].level =
    upgrades[upgradeCurrency][upgradeName].defaultLevel;
  upgrades[upgradeCurrency][upgradeName].current =
    upgrades[upgradeCurrency][upgradeName].defaultLevel;
  //boost
  purchasedUpgrade[upgradeCurrency][upgradeName].level =
    upgrades[upgradeCurrency][upgradeName].defaultLevel;
  purchasedUpgrade[upgradeCurrency][upgradeName].current =
    upgrades[upgradeCurrency][upgradeName].default;
  console.log(upgrades[upgradeCurrency]);
}

export function showCurrencies(){
  console.log(currencies);
}
export function showMechanicMap(){
  console.log(mechanicMap);
}
export function showUpgrade(upgradeCurrency){
  console.log(upgrades[upgradeCurrency]);
}

window.giveCurency = giveCurency;
window.resetUpgrade = resetUpgrade;
window.showCurrencies = showCurrencies;
window.showMechanicMap = showMechanicMap;
window.showUpgrade = showUpgrade;
