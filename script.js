// State
let isPlaying = false;
const songs = ['music.mp3', 'another-song.mp3', 'a-third-song.mp3']; // Replace with your filenames
let songIndex = 0;

// Selectors
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const playPauseBtn = document.getElementById('play-pause-btn');
const reels = document.querySelectorAll('.reel');
const progress = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-container');
const audio = document.getElementById('audio');
const title = document.getElementById('title');

// Functions
function loadSong(song) {
  title.innerText = song.replace('.mp3', '').replaceAll('-', ' ');
  audio.src = `audio/${song}`;
}

function playSong() {
  isPlaying = true;
  playPauseBtn.querySelector('i.fas').classList.remove('fa-play');
  playPauseBtn.querySelector('i.fas').classList.add('fa-pause');
  reels.forEach(reel => reel.classList.add('playing'));
  audio.play();
}

function pauseSong() {
  isPlaying = false;
  playPauseBtn.querySelector('i.fas').classList.remove('fa-pause');
  playPauseBtn.querySelector('i.fas').classList.add('fa-play');
  reels.forEach(reel => reel.classList.remove('playing'));
  audio.pause();
}

function prevSong() {
  songIndex--;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playSong();
}

function nextSong() {
  songIndex++;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playSong();
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  if (duration) {
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
  }
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  if (duration) {
    audio.currentTime = (clickX / width) * duration;
  }
}

// Event Listeners
playPauseBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('ended', nextSong);

// Initial Load
loadSong(songs[songIndex]);