const reels = document.querySelectorAll('.reel');

//audio element and the control buttons
const audio = document.getElementById('audio');
const playBtn = document.querySelector('.fa-play').parentElement;
const pauseBtn = document.querySelector('.fa-pause').parentElement;

// Function to play the song
function playSong() {
  reels.forEach(reel => reel.classList.add('playing'));
  audio.play();
}

// Function to pause the song
function pauseSong() {
  reels.forEach(reel => reel.classList.remove('playing'));
  audio.pause();
}
playBtn.addEventListener('click', playSong);
pauseBtn.addEventListener('click', pauseSong);