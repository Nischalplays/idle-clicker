export const currencies = {
  clicks: {
    label: "Clicks",
    resetable: {
      current: 0,
      spent: 0,
    },
    totalGained: 0,
    totalSpent: 0,
    unlocked: true,
  },
  superClick: {
    label: "Super Click",
    resetable: {
      current: 0,
      spent: 0,
    },
    totalGained: 0,
    totalSpent: 0,
    unlocked: true ,
  },
};

export const playerStats = {
  resetLevel: 0,
  offlineEarning: false,
  offlineEarningDuration: 0,
  offlineEarningPercentage: 25,
};

const clickStats = {
  baseClick: 1,
  additiveBonus: 0, // from click power + SC upgrades
  critChance: 0, // %
  clickMultiplier: 1,
  critMultiplier: 1.5,
  resetMultiplier: 1, // from reset
  clickDelay: 2000, // ms
  defaultClickDealy: 2000,
};

const superClickStats = {
  baseClick: 1,
  additiveBonus: 0,
  critChance: 0,
  clickMultiplier: 1,
  critMultiplier: 1,
  resetMultiplier: 1, // from reset
  gainChance: 5,
  offlineEarningChange: 5,
};

const powerupStats = {
  spawnDelay: -1,
  despawnTimer: 5_000,
  duration: 15000,
};

const defaultClickStats = {
  baseClick: 1,
  additiveBonus: 0, // from click power + SC upgrades
  critChance: 0, // %
  critMultiplier: 1.5,
  clickDelay: 2000, // ms
};

export const mechanicMap = {
  clicks: clickStats,
  superClick: superClickStats,
  powerup: powerupStats,
};

export const defaultStats = {
  clicks: defaultClickStats,
};

export function getRequirementValue(requirement) {
  if (currencies[requirement]) {
    return currencies[requirement].resetable.current;
  }

  if (playerStats[requirement] !== undefined) {
    return playerStats[requirement];
  }

  return 0;
}

function updateStats(statType, type) {
  let updateType = "";
  if (type === "increment") updateType = "additiveBonus";
  if (type === "multiply") up;
  mechanicMap[statType];
}

export function resetCurrency(currencyType) {
  if (currencyType !== "clicks") currencies[currencyType].unlocked = false;

  currencies[currencyType].resetable.current = 0;
  currencies[currencyType].resetable.spent = 0;
  currencies[currencyType].totalGained = 0;
  currencies[currencyType].totalSpent = 0;
}
