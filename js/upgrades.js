import { playsound, purchaseSoundEffect } from "./audio.js";
import { saveUpgradesData } from "./data.js";
import { resetUpgrade } from "./main.js";
import { togglePowerUp } from "./powerup.js";
import {
  currencies,
  playerStats,
  getRequirementValue,
  mechanicMap,
} from "./stats.js";
import { unlockSuperClicks } from "./superClick.js";

import {
  addClassList,
  clickUpgradeCont,
  createUpgradeBox,
  disableMaxBtn,
  resetClassList,
  updateUi,
  updateUpgradeBox,
  updateUpgradeBoxState,
} from "./ui.js";

export const upgrades = {
  clicks: {
    clicksPower: {
      requirement: "clicks",
      label: "Click Power",
      description: "Increase the click gain.",
      level: 1,
      defaultLevel: 1,
      default: 1,
      current: 1,
      step: 1,
      unit: "",
      unlockRequirement: 0,
      resetable: true,
      displaying: false,
      max: 10,
    },
    fasterClick: {
      requirement: "clicks",
      label: "Faster Click",
      description: "Reduce button click delay.",
      level: 0,
      defaultLevel: 0,
      default: 2000,
      current: 2000,
      step: -200,
      unit: "sec",
      unlockRequirement: 50,
      resetable: true,
      displaying: false,
      max: 5,
    },
    criticalClick: {
      requirement: "clicks",
      label: "Unlock Critical Click Chance",
      description: "Allow to trigger critical click.",
      level: 0,
      defaultLevel: 0,
      default: 0,
      current: 0,
      step: 5,
      unit: "%",
      unlockRequirement: 500,
      resetable: true,
      displaying: false,
      max: 1,
    },
    criticalMultiplier: {
      requirement: "clicks",
      label: "Critical Click Multiplier",
      description: "Increase the Critical Click multiplier.",
      level: 0,
      defaultLevel: 0,
      default: 1.5,
      current: 1.5,
      step: 0.25,
      unit: "x",
      unlockRequirement: 2_000,
      resetable: true,
      displaying: false,
      max: 3,
    },
    improvedCriticalChance: {
      requirement: "clicks",
      label: "Improved Critical Chance",
      description: "Increase the chance to trigger critical click.",
      level: 0,
      defaultLevel: 0,
      default: 5,
      current: 5,
      step: 2,
      unit: "%",
      unlockRequirement: 2000,
      resetable: true,
      displaying: false,
      max: 5,
    },
    powerup: {
      requirement: "clicks",
      label: "Power Up",
      description: "unlocks random temporary buff spawn.",
      level: 0,
      defaultLevel: 0,
      default: "locked",
      current: "locked",
      step: "unlocked",
      unit: "oneTime",
      unlockRequirement: 10_000,
      resetable: true,
      displaying: false,
      max: 1,
    },
    unlockSuperClick: {
      requirement: "clicks",
      label: "Unlock Super Click.",
      description: "Unlocks new currency Super CLick and its upgrades.",
      level: 0,
      defaultLevel: 0,
      default: "locked",
      current: "locked",
      step: "unlocked",
      unlockRequirement: 40_000,
      resetable: true,
      displaying: false,
      max: 1,
    },
    unlockReset: {
      requirement: "clicks",
      label: "Unlock Reset",
      description: "Unlocks Reset Mechanism which provides permanent boosts.",
      cost: 5_000_000,
      level: 0,
      default: 0,
      current: 0,
      unlockRequirement: 500_000,
      resetable: false,
      displaying: false,
      max: 1,
    },
    unlockAutoClick: {
      requirement: "resetLevel",
      label: "Unlock Auto Clicker.",
      description: "No more manual clicks. Its time for automation.",
      cost: 500_000_000_000_000,
      level: 0,
      default: 0,
      current: 0,
      unlockRequirement: 4,
      resetable: false,
      displaying: false,
      max: 1,
    },
    betterAutoClicker: {
      requirement: "resetLevel",
      label: "Better Auto Clicker Speed.",
      description: "Decrease the auto clicker speed.",
      cost: 1_000_000_000_000_000,
      level: 1,
      default: 1000,
      current: 1000,
      step: -100,
      unit: "sec",
      unlockRequirement: 4,
      resetable: false,
      displaying: false,
      max: 5,
    },
  },
  superClick: {
    betterClickPower: {
      requirement: "superClick",
      label: "Better Click Power",
      description: "Increase Click gain by +5",
      level: 0,
      defaultLevel: 0,
      default: 10,
      current: 10,
      step: 5,
      unit: "",
      unlockRequirement: 0,
      resetable: true,
      displaying: false,
      max: 10,
    },
    unlockOfflineGain: {
      requirement: "superClick",
      label: "Unlock Offline Gain",
      description: "Finally start earning when not online. Debuff -75% of total gain.",
      cost: 50,
      level: 0,
      defaultLevel: 0,
      default: "locked",
      current: "locked",
      step: "unlocked",
      unlockRequirement: 40,
      resetable: true,
      displaying: false,
      max: 1,
    },
    offlineGainTime: {
      requirement: "superClick",
      label: "More offline Time",
      description: "Increase offlien gain time by 30 min",
      cost: 60,
      level: 1,
      defaultLevel: 1,
      current: 30,
      default: 30,
      step: 30,
      unlockRequirement: 40,
      resetable: true,
      displaying: false,
      max: 5
    },
    bonusRoll: {
      requirement: "superClick",
      label: "RNG Bonus Roll",
      description: "Have 50% chance for x2 SC Gain",
      cost: 100,
      level: 0,
      defaultLevel: 0,
      current: 0,
      default: 0,
      step: 1,
      unlockRequirement: 99,
      resetable: true,
      displaying: false,
      max: 3
    },
    moreSc: {
      requirement: "superClick",
      label: "Increase super Click gain by 1",
      cost: 150,
      level: 1,
      defaultLevel: 1,
      current: 1,
      default: 1,
      step: 1,
      unlockRequirement: 110,
      resetable: true,
      displaying: false,
      max: 10
    }
  }
};

const upgradeContainer = document.getElementById("upgrades");

export const upgradeMethods = {
  // todo - move every upgrade cost and apply to here
  clicks: {
    clicksPower: {
      cost: (currentLevel) => {
        return Math.round(10 * 1.3 ** (currentLevel - 1));
      },
      apply: (currentLvl, maxLvl) => {
        if (currentLvl <= maxLvl) {
          const effectiveLevel = Math.max(0, currentLvl - 1);
            mechanicMap.clicks.baseAdditiveBonus = effectiveLevel;
        }
        if (currentLvl > maxLvl) {
          resetUpgrade("clicks", "clicksPower");
        }
        if (currentLvl === maxLvl) return "last";
      },
    },
    fasterClick: {
      cost: (currentLevel) => {
        return Math.floor(100 + 50 * currentLevel * currentLevel ** 0.5); //base + step * (level - 1) * level ^ 0.5;
      },
      apply: (currentLvl, maxLvl) => {
        if (currentLvl <= maxLvl) {
          const effectiveLevel = Math.max(0, currentLvl);
          mechanicMap.clicks.clickDelay =
            mechanicMap.clicks.defaultClickDealy - effectiveLevel * 200;
          console.log(
            mechanicMap.clicks.defaultClickDealy - effectiveLevel * 200,
          );
        }
        if (currentLvl > maxLvl) {
          resetUpgrade("clicks", "fasterClick");
        }
        if (currentLvl === maxLvl) return "last";
      },
    },
    criticalClick: {
      cost: () => {
        return 1_000;
      },
      apply: (currentLevel, maxLvl) => {
        console.log(currentLevel, maxLvl);
        if (currentLevel <= maxLvl) {
          mechanicMap.clicks.critChance = 5;
        }
        if (currentLevel > maxLvl) {
          resetUpgrade("clicks", "criticalClick");
        }
        if (currentLevel === maxLvl) return "last";
      },
    },
    criticalMultiplier: {
      cost: (currentLevel) => {
        return Math.round(
          2_500 + 250 * (currentLevel - 1) * currentLevel ** 0.25,
        );
      },
      apply: (currentLevel, maxLevel) => {
        if (currentLevel <= maxLevel) {
          const effectiveLevel = Math.max(0, currentLevel);
          mechanicMap.clicks.critMultiplier += effectiveLevel * 0.25;
        }
        if (currentLevel > maxLevel) {
          resetUpgrade("clicks", "criticalMultiplier");
        }
        if (currentLevel === maxLevel) return "last";
      },
    },
    improvedCriticalChance: {
      cost: (currentLevel) => {
        return Math.round(3_000 * 1.25 ** (currentLevel - 1));
      },
      apply: (currentLevel, maxLevel) => {
        if (currentLevel <= maxLevel) {
          const effectiveLevel = Math.max(0, currentLevel - 1);
          mechanicMap.clicks.critChance += effectiveLevel * 2;
        }
        if (currentLevel > maxLevel) {
          resetUpgrade("clicks", "improvedCriticalChance");
        }
        if (currentLevel === maxLevel) return "last";
      },
    },
    powerup: {
      cost: () => {
        return 15_000;
      },
      apply: (currentLevel, maxLevel) => {
        if (currentLevel <= maxLevel) {
          const effectiveLevel = Math.max(0, currentLevel);
          mechanicMap.powerup.spawnDelay = effectiveLevel * 60000;
          togglePowerUp();
        }
        if (currentLevel > maxLevel) {
          resetUpgrade("clicks", "powerup");
        }
        if (currentLevel === maxLevel) return "last";
      },
    },
    unlockSuperClick: {
      cost: () => {
        return 40000
      },
      apply: (currentLevel, maxLevel) => {
        if (currentLevel <= maxLevel) {
          // console.log("hello");
          unlockSuperClicks();
        }
        if (currentLevel > maxLevel) {
          resetUpgrade("clicks", "powerup");
        }
        if (currentLevel === maxLevel) return "last";
      }
    }
  },
  superClick: {
    betterClickPower: {
      cost: (currentLevel) => {
        return Math.round(10 * 1.3 ** currentLevel)
      },
      apply: (currentLevel, maxLevel) => {
        if(currentLevel <= maxLevel){
          const effectiveLevel = Math.max(0, currentLevel);
          mechanicMap.clicks.superClickBonus = 5 * effectiveLevel;
        }
      }
    },
    unlockOfflineGain: {
      cost: () => {
        return 50;
      },
      apply: (currentLevel, maxLevel) => {
        if(currentLevel <= maxLevel){
          const effectiveLevel = Math.max(0, currentLevel);
          mechanicMap.clicks.superClickBonus = 5 * effectiveLevel;
        }
      }
    }
  }
};

export const purchasedUpgrade = {};

export function resetPurchasedUpgrades(){
  Object.keys(purchasedUpgrade).forEach(upgradeType => {
    delete purchasedUpgrade[upgradeType];
  });
  saveUpgradesData();
}

export function checkUnlockedUpgrade(upgradeCurrency) {
  const upgradeGroup = upgrades[upgradeCurrency];
  
  const currentPanel = document.getElementById(`${upgradeCurrency}Upgrades`);

  Object.keys(upgradeGroup).forEach((upgrade) => {
    const currentUpgrade = upgradeGroup[upgrade];
    if (
      currentUpgrade.unlockRequirement <=
        getRequirementValue(currentUpgrade.requirement) &&
      !currentUpgrade.displaying
    ) {
      currentUpgrade.displaying = true;
      createUpgradeBox(currentUpgrade, upgradeCurrency, upgrade, currentPanel);
    } else if (currentUpgrade.displaying) {
      const alreadyAdded = currentPanel.querySelector(
        `.upgradeBtn[data-upgrade="${upgrade.trim()}"]`,
      );
      if (alreadyAdded) return;
      createUpgradeBox(currentUpgrade, upgradeCurrency, upgrade, currentPanel);
    }
  });
}

function purchaseUpgrade(upgradeType, upgrade, upgradeBox, button) {
  const currentUpgrade = upgrades[upgradeType][upgrade];
  console.log(upgrade, upgradeType);
  const currenctUpgradePrice = upgradeMethods[upgradeType][upgrade].cost(
    currentUpgrade.level,
  );
  let currentCurrency = currencies[upgradeType].resetable.current;
  if (currentCurrency >= currenctUpgradePrice) {
    playsound(purchaseSoundEffect);
    currencies[upgradeType].resetable.current -= currenctUpgradePrice;
    currentUpgrade.current += currentUpgrade.step;
    currentUpgrade.level += 1;
    const currentUpgradeApply = upgradeMethods[upgradeType][upgrade].apply(
      currentUpgrade.level,
      currentUpgrade.max,
    );
    const isMax = currentUpgradeApply;

    purchasedUpgrade[upgradeType] = purchasedUpgrade[upgradeType] || {};

    purchasedUpgrade[upgradeType][upgrade] = {
      level: currentUpgrade.level,
      current: currentUpgrade.current,
      displaying: currentUpgrade.displaying,
    };

    console.log(purchasedUpgrade);

    updateUi(upgradeType);
    updateUpgradeBox(upgradeBox, currentUpgrade, upgradeType, upgrade);
    updateUpgradeBoxState(currencies[upgradeType].resetable.current);
    if (isMax === "last") {
      resetClassList(upgradeBox, "upgradeBox");
      addClassList(upgradeBox, "max");
      disableMaxBtn(button);
      return;
    }
  }
  console.log(upgrades);
}

export function addUpgradeEventListener(upgradeBox, element) {
  element.addEventListener("click", () => {
    purchaseUpgrade(
      upgradeBox.dataset.upgradeType,
      element.dataset.upgrade,
      upgradeBox,
      element,
    );
    
  });
}

export function getNextUpgrade(currencyType) {
  const upgradeData = upgrades[currencyType];
  let found = false;
  let nextUpgarde = {};
  Object.values(upgradeData).forEach((data) => {
    if (data.displaying === false && !found) {
      found = true;
      nextUpgarde = data;
    }
  });
  if (!found) return false;
  return nextUpgarde;
}

export function reApplyUpgradeBuffs() {
  Object.keys(purchasedUpgrade).forEach((upgradeCurrency) => {
    Object.keys(purchasedUpgrade[upgradeCurrency]).forEach((upgradeDetail) => {
      const currentUpgrade = purchasedUpgrade[upgradeCurrency][upgradeDetail];
      const applyMethod = upgradeMethods[upgradeCurrency][upgradeDetail];
      const upgradeMax = upgrades[upgradeCurrency][upgradeDetail].max;
      applyMethod.apply(currentUpgrade.level, upgradeMax);
    });
  });
}
