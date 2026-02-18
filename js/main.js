import {
  generateCurrencyUI,
  addCurrency,
  updateEmptyUpgradeBox,
  updateUpgradeBoxState,
  updateUi,
  generateUpgradesContainer,
} from "./ui.js";
import { doReset } from "./reset.js";
import { isSuperClick } from "./superClick.js";
import {
  checkUnlockedUpgrade,
  getNextUpgrade,
  purchasedUpgrade,
  resetPurchasedUpgrades,
  upgrades,
} from "./upgrades.js";
import { currencies, defaultcurrencies, mechanicMap, resetCurrency } from "./stats.js";
import {toggleUpgradePanel } from "./ui.js";
import {
  loadCurrencyData,
  loadUpgradeData,
  resetData,
  saveCurrency,
  saveData,
  saveOfflineTime,
  startSaveInterval,
} from "./data.js";
import { getCtx, intiEffectCanvas, createBezelCurve, resizeCanvas, spawnGainText } from "./effects.js";
import { spawnPowerUp } from "./powerup.js";
import { getOfflineGain } from "./offline.js";
// import { memeClickSound } from "./audio.js";

let canClickMainBtn = true;

const upgradeContainer = document.getElementById("upgradeContainer");
const toggleBtn = document.getElementById("toogleBtn");
const mainBtn = document.getElementById("mainBtn");
const resetBtn = document.getElementById("resetButton");

resetBtn.addEventListener("click", ()=> {
  Object.keys(currencies).forEach((currency) => {
    currencies[currency] = defaultcurrencies[currency];
  })
  Object.keys(upgrades).forEach((upgradeCurrency) => {
    Object.keys(upgrades[upgradeCurrency]).forEach((upgradeType) => {
      resetUpgrade(upgradeCurrency, upgradeType);
    })
  })
  resetData();
  resetPurchasedUpgrades();

  location.reload();
})

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

document.addEventListener("DOMContentLoaded", () => {
  startSaveInterval();
  loadCurrencyData(currencies);
  generateCurrencyUI();
  loadUpgradeData();
  generateUpgradesContainer();
  getOfflineGain();
  
  //event listening Dom Elements
  mainBtn.addEventListener("click", () => {
    if (!canClickMainBtn) return;

    canClickMainBtn = false;
    onClickMainButton();
    isSuperClick();
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
  saveOfflineTime();
});
window.addEventListener("beforeunload", () => {
  console.log("page reloading.");
  saveData();
  saveOfflineTime();
});

window.addEventListener("resize", resizeCanvas);

document.addEventListener("visibilitychange", ()=>{
  if(document.visibilityState === "hidden"){
    saveOfflineTime();
  }
})

function onClickMainButton() {
// clickAudio.currentTime = 0;
// clickAudio.play();
// clikcaudo1.currentTime = 0;
// clikcaudo1.play();

// const randomIndex = Math.floor(Math.random() * memeClickSound.length);
// const sound = memeClickSound[randomIndex];
// sound.currentTime = 0;
// sound.play();

  addCurrency("clicks");
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
  if (amount > 50000) amount = 50000;
  currencies[currencyType].resetable.current = amount;
  updateUi("clicks");
}

export function resetUpgrade(upgradeCurrency, upgradeName) {
  console.log(upgradeCurrency, upgradeName);
  //level
  console.log(upgrades[upgradeCurrency][upgradeName].level);
  upgrades[upgradeCurrency][upgradeName].level =
    upgrades[upgradeCurrency][upgradeName].defaultLevel;
  upgrades[upgradeCurrency][upgradeName].current =
    upgrades[upgradeCurrency][upgradeName].defaultLevel;
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
window.spawnPowerup = spawnPowerUp;
