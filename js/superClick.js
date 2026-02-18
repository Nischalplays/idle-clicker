import { currencies, mechanicMap } from "./stats.js";
import { addCurrency, addCurrencyText, generateCurrencyUI, generateUpgradesContainer } from "./ui.js";

export function isSuperClick() {
  if (!currencies.superClick.unlocked) return;

  // const superClickTriggered = Math.min(Math.random() * 100, 100) < currencies.superClick.gainChance;
  const superClickTriggered = Math.min(Math.random() * 100, 100);
  console.log(superClickTriggered);

  if (superClickTriggered > mechanicMap.superClick.gainChance) return;
  setTimeout(() => {
    addCurrency("superClick");
  }, 100);
}


export function unlockSuperClicks(){
  currencies.superClick.unlocked = true;
  generateCurrencyUI();
  generateUpgradesContainer();
}
