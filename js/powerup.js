import { mechanicMap } from "./stats.js";

const powerups = {
  doubleClick: {
    chance: 25,
    isActive: false,
    apply: () => {
      mechanicMap.clicks.clickMultiplier *= 2;
    },
    remove: ()=>{
      mechanicMap.clicks.clickMultiplier /= 2;
    }
  },
  halfClickSpeed: {
    chance: 25,
    isActive: false,
    apply: () => {
      mechanicMap.clicks.clickDelay /= 2;
    },
    remove: ()=> {
      mechanicMap.clicks.clickDelay *= 2;
    }
  },
  higherCrit: {
    chance: 25,
    isActive: false,
    apply: () => {
      mechanicMap.clicks.critChance += 15;
    },
    remove: ()=>{
      mechanicMap.clicks.critChance -= 15;
    }
  },
  betterCritMultiplier: {
    chance: 25,
    isActive: false,
    apply: () => {
      mechanicMap.clicks.critMultiplier += 2;
    },
    remove: ()=>{
      mechanicMap.clicks.critMultiplier -= 2;
    }
  },
};

const activePowerups = [];
const powerupTimer = {};

let nextId = 1;

export function togglePowerUp() {
  const isUnlocekd = mechanicMap.powerup.spawnDelay;
  const spawnInterval = setInterval(() => {
    if (isUnlocekd === 0) {
      clearInterval(spawnInterval);
      return;
    }
    spawnPowerUp();
  }, mechanicMap.powerup.spawnDelay);
}

export function disablePowerup() {
  mechanicMap.powerup.spawnDelay = 0;
}

export function spawnPowerUp() {

  const id = nextId++;
  
  const powerUpBtn = document.createElement("div");
  let spawnx = Math.floor(Math.random() * window.innerWidth);
  let spawny = Math.floor(Math.random() * window.innerHeight);
  powerUpBtn.classList.add("powerupBtn");

  const img = document.createElement("img");
  img.classList.add("powerupImg");
  img.src = "../assets/powerup.png";

  powerUpBtn.appendChild(img);
  powerUpBtn.dataset.powerupId = String(id);

  // const svg = document.createElement("svg");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  // svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");

  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  circle.classList.add("despawnTimer");
  circle.setAttribute("cx", "50%");
  circle.setAttribute("cy", "50%");
  circle.setAttribute("r", "30");
  circle.setAttribute("fill", "none");
  circle.setAttribute("stroke", "aqua");
  circle.setAttribute("stroke-width", "5");
  circle.setAttribute("pathLength", "100");

  svg.appendChild(circle);
  powerUpBtn.appendChild(svg);

  if (spawnx > window.innerWidth - 60) {
    spawnx -= 60;
  } else if (spawnx < 60) {
    spawnx = 60;
  }
  if (spawny > window.innerHeight - 60) {
    spawny -= 60;
  } else if (spawny < 60) {
    spawny = 60;
  }

  powerUpBtn.style.top = `${spawny}px`;
  powerUpBtn.style.left = `${spawnx}px`;

  powerUpBtn.addEventListener("click", () => {

    const id = Number(powerUpBtn.dataset.powerupId);

    powerUpBtn.remove();
    applyPowerup(id);
  });

  document.body.appendChild(powerUpBtn);

  activePowerups.push({
    id,
    el: powerUpBtn,
    circle,
    time: 0,
    duration: mechanicMap.powerup.despawnTimer,
    powerupType: getRandomPowerup(),
  });
}

export function updatePowerupsTimer(deltaTime) {
  for (let i = 0; i < activePowerups.length; i++) {
    const p = activePowerups[i];
    p.time += deltaTime * 1000;
    
    const percent = Math.min((p.time / p.duration) * 100, 100);
    p.circle.style.strokeDashoffset = -percent;
    
    if (p.time >= p.duration && !p.clicked) {
      p.el.remove();
      activePowerups.splice(i, 1);
    }
  }
}

function getRandomPowerup() {
  const roll = Math.random() * 100;
  let acc = 0;

  for (const key in powerups) {
    acc += powerups[key].chance;
    if (roll <= acc) return key;
  }
}

function applyPowerup(id) {

  const p = activePowerups.find(x => x.id === id);
  if(!p) return;

  const type = p.powerupType;
  console.log(type);

  if(powerups[type].isActive){
    console.log("already activated" + type);
  }
  else{
    powerups[type].apply();
    powerups[type].isActive = true;
  }

  clearInterval(powerupTimer[id]);
  powerupTimer[id] = setTimeout(() => {
    powerups[type].remove();
    removePowerupById(id);
    p.el.remove();
    console.log("removed");
  }, mechanicMap.powerup.duration);
}

function removePowerupById(id){
  const idx = activePowerups.findIndex(powerup => powerup.id === id);
  if(idx !== -1) activePowerups.splice(idx, 1);
  delete powerupTimer[id];
}