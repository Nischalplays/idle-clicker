import { togglePowerUp } from "./powerup.js";
import {
  currencies,
  playerStats,
  getRequirementValue,
  mechanicMap,
} from "./stats.js";

import {
  addClassList,
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
      unlockRequirement: 2,
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
      cost: 150_0000,
      level: 0,
      default: 0,
      current: 0,
      unlockRequirement: 100_000,
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
      unlockRequirement: 1_000_000,
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
          const effectiveLevel = Math.max(0, currentLvl-1);
          mechanicMap.clicks.additiveBonus = effectiveLevel;
          console.log(effectiveLevel);
          console.log(mechanicMap.clicks);
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
          mechanicMap.clicks.clickDelay = (mechanicMap.clicks.defaultClickDealy - (effectiveLevel * 200));
          console.log(mechanicMap.clicks.defaultClickDealy - (effectiveLevel * 200));
        }
        if (currentLvl === maxLvl) return "last";
      },
    },
    criticalClick: {
      cost: () => {
        return 1_000;
      },
      apply: (currentLevel, maxLvl) => {
        if (currentLevel < maxLvl) {
          mechanicMap.clicks.critChance = 5;
        }
        if (currentLevel + 1 === maxLvl) return "last";
      },
    },
    criticalMultiplier: {
      cost: (currentLevel) => {
        return Math.round(
          2_500 + 250 * (currentLevel - 1) * currentLevel ** 0.25,
        );
      },
      apply: (currentLevel, maxLevel) => {
        if (currentLevel < maxLevel) {
          const effectiveLevel = Math.max(0, currentLevel - 1);
          mechanicMap.clicks.critMultiplier += (effectiveLevel * 0.25);
        }
        if (currentLevel + 1 === maxLevel) return "last";
      },
    },
    improvedCriticalChance: {
      cost: (currentLevel) => {
        return Math.round(3_000 * 1.25 ** (currentLevel - 1));
      },
      apply: (currentLevel, maxLevel)  => {
        const effectiveLevel = Math.max(0, currentLevel - 1);
        mechanicMap.clicks.critChance += (effectiveLevel * 2);
      }
    },
    powerup: {
      cost: ()=> {
        return 15_000;
      },
      apply: (currentLevel, maxLevel)=>{
        if (currentLevel < maxLevel) {
          mechanicMap.powerup.spawnDelay = 60_000;
          togglePowerUp();
        }
        if (currentLevel + 1 === maxLevel) return "last";
      }
    }
  },
};

export const purchasedUpgrade = {};

export function checkUnlockedUpgrade(upgradeCurrency) {
  const upgradeGroup = upgrades[upgradeCurrency];
  Object.keys(upgradeGroup).forEach((upgrade) => {
    const currentUpgrade = upgradeGroup[upgrade];
    if (
      currentUpgrade.unlockRequirement <=
        getRequirementValue(currentUpgrade.requirement) &&
      !currentUpgrade.displaying
    ) {
      currentUpgrade.displaying = true;
      createUpgradeBox(currentUpgrade, upgradeCurrency, upgrade);
    } else if (currentUpgrade.displaying) {
      const alreadyAdded = upgradeContainer.querySelector(
        `.upgradeBtn[data-upgrade="${upgrade.trim()}"]`,
      );
      if (alreadyAdded) return;
      createUpgradeBox(currentUpgrade, upgradeCurrency, upgrade);
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
    currencies[upgradeType].resetable.current -= currenctUpgradePrice;
    currentUpgrade.current += currentUpgrade.step;
    currentUpgrade.level += 1;
    const currentUpgradeApply = upgradeMethods[upgradeType][upgrade].apply(
    currentUpgrade.level,
    currentUpgrade.max,
  );;
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
  Object.keys(purchasedUpgrade).forEach((upgradeCurrency) =>{
    Object.keys(purchasedUpgrade[upgradeCurrency]).forEach((upgradeDetail) => {
      const currentUpgrade = purchasedUpgrade[upgradeCurrency][upgradeDetail];
      const applyMethod = upgradeMethods[upgradeCurrency][upgradeDetail];
      const upgradeMax = upgrades[upgradeCurrency][upgradeDetail].max;
      applyMethod.apply(currentUpgrade.level, upgradeMax);
    })
  })
  console.log(mechanicMap);
}
