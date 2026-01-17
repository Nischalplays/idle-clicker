import { stats } from "./stats.js"; 
import { generateCurrencyUI, addCurrency } from "./ui.js";

document.addEventListener("DOMContentLoaded", () =>{

    const mainBtn = document.getElementById("mainBtn");
    generateCurrencyUI();
    
    mainBtn.addEventListener("click", ()=>{
        const clickValue = document.getElementById("clickValue");
        onClickMainButton();
        // stats.clicks.value += stats.clicks.multiplier
        // clickValue.textContent = stats.clicks.value;
    })

})

function onClickMainButton(){
    addCurrency("clicks");
}