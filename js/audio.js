// export const memeClickSound = [
//     new Audio("../audios/audio1.mp3"),
//     new Audio("../audios/audio2.mp3"),
//     new Audio("../audios/audio3.mp3"),
//     new Audio("../audios/audio4.mp3"),
//     new Audio("../audios/audio5.mp3"),
//     new Audio("../audios/audio6.mp3"),
//     new Audio("../audios/audio7.mp3"),
//     new Audio("../audios/audio8.mp3"),
//     new Audio("../audios/audio9.mp3"),
//     new Audio("../audios/audio10.mp3"),
//     new Audio("../audios/audio11.mp3"),
//     new Audio("../audios/audio12.mp3"),
//     new Audio("../audios/audio13.mp3"),
//     new Audio("../audios/audio14.mp3"),
//     new Audio("../audios/audio15.mp3"),
//     new Audio("../audios/audio16.mp3"),
// ]

export const clickAudio = new Audio(
  new URL("../assets/clickAudio.wav", import.meta.url),
);
export const clickAudio1 = new Audio(
  new URL("../assets/clickAudio1.mp3", import.meta.url),
);
export const purchaseSoundEffect = new Audio(
  new URL("../assets/upgradeSound.mp3", import.meta.url),
);
export const redeemAudio = new Audio(
  new URL("../assets/redeemAudio.mp3", import.meta.url),
);

export function playsound(sound) {
  sound.currentTime = 0;
  sound.play();
}
