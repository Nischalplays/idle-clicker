import { mechanicMap, currencies } from "./stats.js";
import {
  addUpgradeEventListener,
  checkUnlockedUpgrade,
  upgradeMethods,
} from "./upgrades.js";
import { spawnGainText } from "./effects.js";

const currencyValueElement = {};

const upgradesCont = document.getElementById("upgrades");
export let emptyBox = "";

export function generateCurrencyUI() {
  const currencyContainer = document.getElementById("currencyContainer");
  Object.keys(currencies).forEach((key) => {
    if (currencies[key].unlocked === true) {
      const cont = document.createElement("div");
      const label = document.createElement("p");
      const value = document.createElement("p");

      cont.classList.add("stat");
      label.textContent = currencies[key].label;
      value.textContent = currencies[key].resetable.current;
      value.id = `${key}Value`;

      cont.appendChild(label);
      cont.appendChild(value);
      currencyContainer.appendChild(cont);

      currencyValueElement[key] = value;
    }
  });
}

export function addCurrency(currencyType) {
  const mechanic = mechanicMap[currencyType];
  const currency = currencies[currencyType];

  let gain =
    (mechanic.baseClick + mechanic.additiveBonus) * mechanic.resetMultiplier;
  let size = 18;
  let color = "black"
  if (mechanic.critChance > 0) {
    if (Math.random() * 100 < mechanic.critChance) {
      console.log("critical click");
      gain *= mechanic.critMultiplier;
      size = 22;
      color = "red";
    }
  }
  spawnGainText(`+${gain} ${currencyType}`, size, color);
  updateClickTimer(mechanic.clickDelay);
  setTimeout(() => {
    currency.resetable.current += gain;
  
    updateUi(currencyType);
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

export function createUpgradeBox(upgradeDetails, currency, upgradeKey) {
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
  }
  else{
    upgradeBox.dataset.max = false;
    upgradeBox.classList.add("cantAfford");
  }

  label.textContent = upgradeDetails.label;
  description.textContent = upgradeDetails.description;

  if (upgradeDetails.unit === "sec") {
    upgradeOverView.textContent = `${upgradeDetails.current / 1000}${upgradeDetails.unit} => 
        ${(upgradeDetails.current + upgradeDetails.step) / 1000}${upgradeDetails.unit}`;
  } else if(upgradeDetails.unit === "oneTime"){
    console.log("hello");
    upgradeOverView.textContent = `${upgradeDetails.current} => 
        ${upgradeDetails.step}`;
  } 
  else {
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

  upgradesCont.appendChild(upgradeBox);

  const oldEmptyBox = document.querySelector(".upgradePlaceholder");
  deleteOldEmptyBox(oldEmptyBox);
  displayEmptyUpgradeBox();
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
  upgradesCont.querySelectorAll(".upgradeBox").forEach((box) => {
    if (box.classList.contains("max")) return;
    const cost = Number(box.querySelector(".price").textContent.split(" ")[0]);
    if (currencyValue >= cost) {
      box.classList.add("canAfford");
      box.classList.remove("cantAfford");
    } else {
      box.classList.add("cantAfford");
      box.classList.remove("canAfford");
    }
  });
}

export function disableMaxBtn(btn, element) {
  btn.textContent = "Maxed";
  btn.disabled = true;
  element.dataset.max = true;
}

function displayEmptyUpgradeBox() {
  const box = document.createElement("div");
  box.classList.add("upgradePlaceholder");

  const image = document.createElement("img");
  image.src = "../assets/lock.png";
  image.classList.add("emptyBoxStatus");

  const progressBar = document.createElement("div");
  progressBar.classList.add("upgradeUnlockProgress");

  box.appendChild(progressBar);
  box.appendChild(image);
  upgradesCont.appendChild(box);
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
