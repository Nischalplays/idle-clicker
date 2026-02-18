import { redeemAudio } from "./audio.js";
import {
  clearPendingOfflineGain,
  getPendingOfflineGain,
  loadOfflineTime,
  savePendingOfflineGain,
} from "./data.js";
import { playerStats, mechanicMap, currencies } from "./stats.js";
import {
  createOfflineEarningWindow,
  showOfflineEarning,
  addCurrency,
  updateCurrencyText,
} from "./ui.js";

export function getOfflineGain() {
  if (!playerStats.offlineEarning) return;

  if(document.getElementById("offlineEarningCont")) return;
  const claimBtn = createOfflineEarningWindow();
  const oldTime = loadOfflineTime();

  if(!oldTime) return;

  const pendingGain = getPendingOfflineGain();
  const timeDiff = Math.min(
    Date.now() - oldTime,
    playerStats.offlineEarningDuration,
  );
  const noOfClicks = Math.floor(timeDiff / mechanicMap.clicks.clickDelay);
  const offlineMult = playerStats.offlineEarningPercentage / 100;

  //calculating click and sc gain;
  let clickGain = calculateClickGain(noOfClicks, offlineMult);
  let scGain = calculateSCGain(noOfClicks, offlineMult);

  if (pendingGain) {
    clickGain += Number(pendingGain[0]);
    scGain += Number(pendingGain[1]);
  }

  if (clickGain < 1) {
    document.getElementById("offlineEarningCont")?.remove();
  }

  showOfflineEarning("Clicks", clickGain);
  if (currencies.superClick.unlocked)
    showOfflineEarning("Super Clicks", scGain);

  savePendingOfflineGain([clickGain, scGain]);

  claimBtn.addEventListener("click", () => {
    clearPendingOfflineGain();
    console.log(clickGain);
    currencies.clicks.resetable.current += clickGain;
    if (currencies.superClick.unlocked)
      currencies.superClick.resetable.current += scGain;
    updateCurrencyText();
    redeemAudio.play();
    clickGain = 0;
    scGain = 0;
    const offlineWindow = document.getElementById("offlineEarningCont");
    offlineWindow.style.opacity = "0";
    setTimeout(() => {
      offlineWindow.remove();
    }, 500);
  });
}

function calculateClickGain(noOfClicks, offlineMult) {
  const click = mechanicMap.clicks;
  const clickPerPress =
    (click.baseClick + click.baseAdditiveBonus + click.superClickBonus) *
    click.clickMultiplier *
    click.resetMultiplier;

  const offlineClickGain = Math.floor(clickPerPress * noOfClicks * offlineMult);

  return offlineClickGain;
}

function calculateSCGain(noOfClicks, offlineMult) {
  const sc = mechanicMap.superClick;
  const scChance = (sc.gainChance ?? 0) / 100;

  const expectedGain = Math.floor(
    noOfClicks * scChance * (sc.scGainPerProc ?? 1) * offlineMult,
  );
  return expectedGain;
}