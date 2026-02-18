import { mechanicMap, currencies } from "./stats.js";
import {
  addUpgradeEventListener,
  checkUnlockedUpgrade,
  upgradeMethods,
} from "./upgrades.js";
import { spawnGainText } from "./effects.js";
import { clickAudio, clickAudio1, playsound } from "./audio.js";

const currencyValueElement = {};
const currencyContainer = document.getElementById("currencyContainer");

export const clickUpgradeCont = document.getElementById("clicksUpgrades");
export let emptyBox = "";

export function generateCurrencyUI() {
  Object.keys(currencies).forEach((key) => {
    const isAdded = document.getElementById(`${key}Value`);
    if (currencies[key].unlocked === true && !isAdded) {
      addCurrencyText(key);
    }
  });
}

export function generateUpgradesContainer() {
  const upgradePanel = document.getElementById("upgradePanels");
  const upgradesHolder = document.getElementById("upgradesHolder");

  Object.keys(currencies).forEach((currency) => {
    // adding upgrade Panel Buttons
    if (document.getElementById(`${currency}Upgrade`))
      return console.log("already unlocked");
    if (currencies[currency].unlocked) {
      const panelButtion = document.createElement("div");
      panelButtion.id = `${currency}Upgrade`;
      panelButtion.classList.add("pannelBtn");

      addUpgradePanelEventListener(
        "click",
        panelButtion,
        `${panelButtion.id}s`,
      );
      upgradePanel.appendChild(panelButtion);

      //adding upgradesBox in relative container
      const panel = document.createElement("div");
      panel.id = `${currency}Upgrades`;
      if (currency === "clicks") {
        panel.classList.add("upgrades");
        panel.classList.add("active");
      } else {
        panel.classList.add("upgrades");
        panel.classList.add("inActive");
      }

      upgradesHolder.appendChild(panel);
      checkUnlockedUpgrade(currency);
    }
  });
}

function addUpgradePanelEventListener(eventType, element, upgradesElementId) {
  element.addEventListener(eventType, () => {
    const currentUpgradePanel = document.getElementById(upgradesElementId);
    if (currentUpgradePanel.classList.contains("active")) return;
    document.querySelectorAll(".upgrades").forEach((upgrade) => {
      upgrade.classList.contains("active") ? upgrade.classList.replace("active", "inActive") : upgrade.classList.replace("inActive", "active")
    });
    // currentUpgradePanel.classList.add("active");
  });
}

export function addCurrencyText(currencyType) {
  const cont = document.createElement("div");
  const label = document.createElement("p");
  const value = document.createElement("p");

  cont.classList.add("stat");
  label.textContent = currencies[currencyType].label;
  value.textContent = currencies[currencyType].resetable.current;
  value.id = `${currencyType}Value`;

  cont.appendChild(label);
  cont.appendChild(value);
  currencyValueElement[currencyType] = value;
  currencyContainer.appendChild(cont);
}

export function updateCurrencyText(){
  Object.keys(currencies).forEach(currency => {
    if(currencies[currency].unlocked){
      const ValueUi = document.querySelector(`#${currency}Value`);
      ValueUi.textContent = currencies[currency].resetable.current;
    }
  })
}

export function addCurrency(currencyType) {
  const mechanic = mechanicMap[currencyType];
  const currency = currencies[currencyType];

  let isCrit = false;

  let gain =
    (mechanic.baseClick + mechanic.baseAdditiveBonus + (mechanic.superClickBonus || 0)) *
    mechanic.resetMultiplier *
    mechanic.clickMultiplier;
    console.log(gain);
  let size = 18;
  let color = "black";
  if (mechanic.critChance > 0) {
    if (Math.random() * 100 < mechanic.critChance) {
      playsound(clickAudio);
      gain *= mechanic.critMultiplier;
      size = 22;
      color = "red";
      isCrit = true;
    }
  }

  if (!isCrit) playsound(clickAudio1);

  spawnGainText(`+${gain} ${currencyType}`, size, color);
  updateClickTimer(mechanic.clickDelay);
  setTimeout(() => {
    currency.resetable.current += gain;
    updateUi(currencyType);
    checkUnlockedUpgrade("clicks");
    updateUpgradeBoxState(currencies.clicks.resetable.current);
  }, 1400);
}

export function updateUi(currencyType) {
  const currency = currencies[currencyType].resetable;
  const currencyElement = currencyValueElement[currencyType];
  currencyElement.textContent = currency.current;
}

function updateClickTimer(duration) {
  const clickTimerUi = document.getElementById("clickTimer");
  const startTime = Date.now();
  let interval = setInterval(() => {
    let elapsed = Date.now() - startTime;
    const percent = Math.min((elapsed / duration) * 100, 100);
    clickTimerUi.style.width = percent + "%";

    if (elapsed > duration) {
      clearInterval(interval);
      clickTimerUi.style.width = "0%";
    }
  }, 10);
}

export function toggleUpgradePanel(container) {
  container.classList.toggle("hidden");
}

export function createUpgradeBox(
  upgradeDetails,
  currency,
  upgradeKey,
  panelToAppend,
) {
  const upgradeBox = document.createElement("div");
  const label = document.createElement("div");
  const upgradeDetail = document.createElement("div");
  const textContainer = document.createElement("div");
  const description = document.createElement("div");
  const upgradeOverView = document.createElement("div");
  const price = document.createElement("div");
  const buttonContainer = document.createElement("div");
  const levelDescription = document.createElement("div");
  const levelTxt = document.createElement("span");
  const currentLvl = document.createElement("span");
  const upgradeBtn = document.createElement("button");

  upgradeBox.classList.add("upgradeBox");
  label.classList.add("label");
  upgradeDetail.classList.add("upgradeDetail");
  textContainer.classList.add("textContainer");
  description.classList.add("description");
  upgradeOverView.classList.add("upgradeOverview");
  price.classList.add("price");
  buttonContainer.classList.add("buttonContainer");
  levelDescription.classList.add("levelDescription");
  levelTxt.classList.add("levelTxt");
  currentLvl.classList.add("currentLvl");
  upgradeBtn.classList.add("upgradeBtn");

  if (upgradeDetails.level === upgradeDetails.max) {
    upgradeBox.classList.add("max");
    upgradeBox.dataset.max = true;
  } else if (
    upgradeDetails.level < upgradeDetails.max &&
    upgradeMethods[currency][upgradeKey].cost(upgradeDetails.level) <=
      currencies[currency].resetable.current
  ) {
    upgradeBox.dataset.max = false;
    upgradeBox.classList.add("canAfford");
  } else {
    upgradeBox.dataset.max = false;
    upgradeBox.classList.add("cantAfford");
  }

  label.textContent = upgradeDetails.label;
  description.textContent = upgradeDetails.description;

  if (upgradeDetails.unit === "sec") {
    upgradeOverView.textContent = `${upgradeDetails.current / 1000}${upgradeDetails.unit} => 
        ${(upgradeDetails.current + upgradeDetails.step) / 1000}${upgradeDetails.unit}`;
  } else if (upgradeDetails.unit === "oneTime") {
    upgradeOverView.textContent = `${upgradeDetails.current} => 
        ${upgradeDetails.step}`;
  } else {
    upgradeOverView.textContent = `${upgradeDetails.current}${upgradeDetails.unit} => 
        ${upgradeDetails.current + upgradeDetails.step}${upgradeDetails.unit}`;
  }

  price.textContent = `${upgradeMethods[currency][upgradeKey].cost(upgradeDetails.level)} ${currency[0].toUpperCase() + currency.slice(1)}`;
  levelTxt.textContent = "Level: ";
  currentLvl.textContent = `${upgradeDetails.level}/${upgradeDetails.max}`;
  upgradeBtn.textContent = "Buy";

  upgradeBox.dataset.upgradeType = currency;
  upgradeBtn.dataset.upgrade = upgradeKey;

  addUpgradeEventListener(upgradeBox, upgradeBtn);

  upgradeBox.appendChild(label);
  upgradeBox.appendChild(upgradeDetail);

  upgradeDetail.appendChild(textContainer);
  upgradeDetail.appendChild(buttonContainer);

  textContainer.appendChild(description);
  textContainer.appendChild(upgradeOverView);
  textContainer.appendChild(price);

  buttonContainer.appendChild(levelDescription);
  buttonContainer.appendChild(upgradeBtn);

  levelDescription.appendChild(levelTxt);
  levelDescription.appendChild(currentLvl);

  panelToAppend.appendChild(upgradeBox);

  const oldEmptyBox = document.querySelector(".upgradePlaceholder");
  deleteOldEmptyBox(oldEmptyBox);
  displayEmptyUpgradeBox(panelToAppend);
}

export function updateUpgradeBox(
  upgradeBox,
  newDetails,
  upgardeCurrency,
  upgradeKey,
) {
  const upgradeOverView = upgradeBox.querySelector(".upgradeOverview");
  const currentLvl = upgradeBox.querySelector(".currentLvl");
  const price = upgradeBox.querySelector(".price");
  const upgradeBtn = upgradeBox.querySelector(".upgradeBtn");

  const newCost = upgradeMethods[upgardeCurrency][upgradeKey].cost(
    newDetails.level,
    newDetails.max,
  );

  if (newDetails.unit === "sec") {
    upgradeOverView.textContent = `${newDetails.current / 1000}${newDetails.unit} => ${(newDetails.current + newDetails.step) / 1000}${newDetails.unit}`;
  } else {
    upgradeOverView.textContent = `${newDetails.current} => ${newDetails.current + newDetails.step}`;
  }
  price.textContent = `${newCost} ${upgradeBox.dataset.upgradeType[0].toUpperCase() + upgradeBox.dataset.upgradeType.slice(1)}`;
  currentLvl.textContent = `${newDetails.level}/${newDetails.max}`;
}

export function updateUpgradeBoxState(currencyValue, cost) {
  document.querySelectorAll(".upgrades").forEach((upgradePanel) => {
    upgradePanel.querySelectorAll(".upgradeBox").forEach((box) => {
      if (box.classList.contains("max")) return;
      const cost = Number(
        box.querySelector(".price").textContent.split(" ")[0],
      );
      if (currencyValue >= cost) {
        box.classList.add("canAfford");
        box.classList.remove("cantAfford");
      } else {
        box.classList.add("cantAfford");
        box.classList.remove("canAfford");
      }
    });
  });
}

export function disableMaxBtn(btn, element) {
  btn.textContent = "Maxed";
  btn.disabled = true;
  console.log(element);
  element.dataset.max = true;
}

function displayEmptyUpgradeBox(boxToAppend) {
  const box = document.createElement("div");
  box.classList.add("upgradePlaceholder");

  const image = document.createElement("img");
  image.src = "../assets/lock.png";
  image.classList.add("emptyBoxStatus");

  const progressBar = document.createElement("div");
  progressBar.classList.add("upgradeUnlockProgress");

  box.appendChild(progressBar);
  box.appendChild(image);
  boxToAppend.appendChild(box);
  emptyBox = progressBar;
}

export function updateEmptyUpgradeBox(currentValue, requiredValue) {
  console.l;
  const percent = Math.min(currentValue / requiredValue, 100) * 100;

  emptyBox.style.width = `${percent}%`;
}

export function deleteOldEmptyBox(oldBox) {
  if (oldBox) oldBox.remove();
}

export function unlockEmptyBoxLockState() {
  const statusImage = emptyBox.querySelector(".emptyBoxStatus");
  statusImage.src = "../assets/unlock.png";
}

export function resetClassList(element, defaultClass) {
  element.classList.forEach((className) => {
    if (className !== defaultClass) {
      element.classList.remove(className);
    }
  });
}

export function addClassList(element, className) {
  element.classList.add(className);
}

export function createOfflineEarningWindow(){
  const container = document.createElement("div");
  container.id = "offlineEarningCont";

  const title = document.createElement("span");
  title.id = "offlineTitle";
  title.textContent = "Offline Earning";

  const earningDisplay = document.createElement("div");
  earningDisplay.id = "earningDisplay";

  const claimBtn = document.createElement("button");
  claimBtn.id = "offlineBtn";
  claimBtn.textContent = "Claim";

  container.appendChild(title);
  container.appendChild(earningDisplay);
  container.appendChild(claimBtn);

  document.body.append(container);
  return claimBtn;
}

export function showOfflineEarning(currency, earning){
  const earningDisplay = document.getElementById("earningDisplay");

  const earningCont = document.createElement("div");
  earningCont.classList.add("stat");

  const currencyText = document.createElement("span");
  currencyText.textContent = currency;

  const currencyValue = document.createElement("span");
  currencyValue.textContent = earning;

  earningCont.appendChild(currencyText);
  earningCont.appendChild(currencyValue);

  earningDisplay.appendChild(earningCont);
}