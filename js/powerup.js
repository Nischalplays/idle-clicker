import { mechanicMap } from "./stats.js";

const powerups = {
    doubleClick: {
        chance: 25,
    },
    halfClickSpeed: {
        chance: 25,
    },
    higherCrit: {
        chance: 25,
    },
    betterCritMultiplier: {
        chance: 25,
    }
}

export function togglePowerUp(){
    const spawnInterval = setInterval(() => {
        spawnPowerUp();
        if(mechanicMap.powerup.spawnDelay === -1){
            clearInterval(spawnInterval);
        }
    }, mechanicMap.powerup.spawnDelay);
}

export function spawnPowerUp(){
    console.log("spawning powerup");
}