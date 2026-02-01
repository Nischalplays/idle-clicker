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
  upgrades,
} from "./upgrades.js";
import { currencies, mechanicMap, resetCurrency } from "./stats.js";
import {toggleUpgradePanel } from "./ui.js";
import {
  loadCurrencyData,
  loadUpgradeData,
  saveCurrency,
  saveData,
  startSaveInterval,
} from "./data.js";
import { getCtx, intiEffectCanvas, createBezelCurve, resizeCanvas, spawnGainText } from "./effects.js";
import { spawnPowerUp } from "./powerup.js";
import { memeClickSound } from "./audio.js";

let canClickMainBtn = true;

const upgradeContainer = document.getElementById("upgradeContainer");
const toggleBtn = document.getElementById("toogleBtn");
const mainBtn = document.getElementById("mainBtn");
const resetBtn = document.getElementById("resetButton");

resetBtn.addEventListener("click", ()=> {
  Object.keys(currencies).forEach((currency) => {
    resetCurrency(currency);
  })
  Object.keys(upgrades).forEach((upgradeCurrency) => {
    Object.keys(upgrades[upgradeCurrency]).forEach((upgradeType) => {
      resetUpgrade(upgradeCurrency, upgradeType);
    })
  })
  location.reload();
})

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

document.addEventListener("DOMContentLoaded", () => {
  startSaveInterval();
  loadCurrencyData(currencies);
  loadUpgradeData();

  //event listening Dom Elements
  generateCurrencyUI();
  generateUpgradesContainer();
  // checkUnlockedUpgrade("clicks");

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
// clickAudio.currentTime = 0;
// clickAudio.play();
// clikcaudo1.currentTime = 0;
// clikcaudo1.play();

// const randomIndex = Math.floor(Math.random() * memeClickSound.length);
// const sound = memeClickSound[randomIndex];
// sound.currentTime = 0;
// sound.play();

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
  if (amount > 15000) amount = 15000;
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
  
    if(purchasedUpgrade[upgradeCurrency]?.[upgradeName]){
      purchasedUpgrade[upgradeCurrency][upgradeName].level =
        upgrades[upgradeCurrency][upgradeName].defaultLevel;
      purchasedUpgrade[upgradeCurrency][upgradeName].current =
        upgrades[upgradeCurrency][upgradeName].default;
      console.log(upgrades[upgradeCurrency]);
    }
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
