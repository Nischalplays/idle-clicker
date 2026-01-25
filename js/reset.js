import { currencies, playerStats, mechanicMap, defaultStats } from "./stats.js";
import { updateUi } from "./ui.js";

const nextResetLevel = playerStats.resetLevel + 1;
// 10_000_000
const Resets = {
  1: {
    label: "First Reset",
    discription: "x2 click gain, x1.5 SC gain.",
    currencyRequired: { clicks: 10_000_000 },
    applyBoost: () => {
      currencies.clicks.resetMultiplier = 2;
      currencies.superClick.resetMultiplier = 1.5;
    },
  },
  2: {
    label: "Second Reset",
    discription: "x5 click gain, x3 SC gain and +10% SC gain chance.",
    currencyRequired: { clicks: 1_000_000_000, superClick: 1_000 },
    applyBoost: () => {
      currencies.clicks.resetMultiplier = 5;
      currencies.superClick.resetMultiplier = 3;
      currencies.superClick.gainChance += 10;
    },
  },
  3: {
    label: "Third Reset",
    discription:
      "Offline gain earn 90% of total earning, increase SC gain chance for offline only by 10%.",
    currencyRequired: { clicks: 500_000_000_000, superClick: 15_000 },
    applyBoost: () => {
      playerStats.offlineEarningPercentage = 90;
      currencies.superClick.offlineEarningChange = 10;
    },
  },
  4: {
    label: "Third Reset",
    discription: "Unlock 2 new Click upgrade and 1 SC upgrade",
    currencyRequired: { clicks: 1_000_000_000_000, superClick: 40_000 },
    applyBoost: () => {
      // need to implement later
    },
  },
};

export function doReset() {
  const nextReset = Resets[nextResetLevel];
  if (!nextReset) return alert("No more reset available");

  const canReset = Object.entries(nextRest.currencyRequired).every(
    ([key, cost]) => (currencies[key].resetable.current || 0) >= cost,
  );

  if (!canReset) return alert("Failed to reset no enough resources.");

  alert("reset successfull");
  Resets[nextResetLevel].applyBoost();
  playerStats.resetLevel += 1;
  resetStats();
}

function resetStats() {
  Object.keys(mechanicMap).forEach((key) => {
    Object.keys(mechanicMap[key]).forEach((key2) => {
      mechanicMap[key][key2] = defaultStats[key][key2];
    });
  });

  Object.values(currencies).forEach(resetCurrency);
  updateUi("clicks");
  console.log(currencies);
}

function resetCurrency(currency) {
  console.log(currency);
  Object.keys(currency.resetable).forEach(
    (key) => (currency.resetable[key] = 0),
  );
}
