let isPlaying = false;
const playPauseBtn = document.getElementById('play-pause-btn');
const reels = document.querySelectorAll('.reel');
const progress = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-container');
//audio element and the control buttons
const audio = document.getElementById('audio');
audio.addEventListener('timeupdate', updateProgress);
// Function to play the song
function playSong() {
  isPlaying = true;
  playPauseBtn.querySelector('i.fas').classList.remove('fa-play');
  playPauseBtn.querySelector('i.fas').classList.add('fa-pause');
  
  reels.forEach(reel => reel.classList.add('playing')); // Add this line back
  audio.play();
}

// Function to pause the song
function pauseSong() {
  isPlaying = false;
  playPauseBtn.querySelector('i.fas').classList.remove('fa-pause');
  playPauseBtn.querySelector('i.fas').classList.add('fa-play');

  reels.forEach(reel => reel.classList.remove('playing')); // And add this line back
  audio.pause();
}
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}

playPauseBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));

// Function to set progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

// Event listener for the progress container
progressContainer.addEventListener('click', setProgress);