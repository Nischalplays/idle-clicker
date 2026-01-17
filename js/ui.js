import {stats} from "./stats.js";

// const currencyContainer = document.getElementById("currencyContainer");

const currencyValueElement = {};

export function generateCurrencyUI( ){
    const currencyContainer = document.getElementById("currencyContainer");
    Object.keys(stats).forEach((key) =>{
        if(stats[key].unlocked === true){
            const cont = document.createElement("div");
            const label = document.createElement("p");
            const value = document.createElement("p");

            cont.classList.add("stat");
            label.textContent = stats[key].label;
            value.textContent = stats[key].currentValue;
            value.id = `${key}Value`;

            cont.appendChild(label);
            cont.appendChild(value);
            currencyContainer.appendChild(cont);

            currencyValueElement[key] = value;
        }
    })
}

export function addCurrency(currencyType){
    console.log(stats[currencyType]);
    stats[currencyType].currentValue += stats[currencyType].multiplier; 
    
    currencyValueElement[currencyType].textContent = stats[currencyType].currentValue;;
}