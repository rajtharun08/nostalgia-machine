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
// At the top with your other selectors
const volumeSlider = document.getElementById('volume-slider');

// Function to set volume
function setVolume() {
  // The slider's value is 0-100, audio.volume is 0.0-1.0
  audio.volume = volumeSlider.value / 100;
}

// Event Listener for volume
volumeSlider.addEventListener('input', setVolume);

// Set initial volume when the page loads
setVolume();
// At the top of your script
const playlist = document.getElementById('playlist');

// New Function to build the playlist display
function populatePlaylist() {
  songs.forEach((song, index) => {
    const songItem = document.createElement('div');
    songItem.classList.add('song-item');
    songItem.innerText = song.replace('.mp3', '').replaceAll('-', ' ');

    // Add click event to play the song
    songItem.addEventListener('click', () => {
        songIndex = index;
        loadSong(songs[songIndex]);
        playSong();
    });

    playlist.appendChild(songItem);
  });
}

// Modify the loadSong function to highlight the active song
function loadSong(song) {
  title.innerText = song.replace('.mp3', '').replaceAll('-', ' ');
  audio.src = `audio/${song}`;

  // Highlight the correct song in the playlist
  const songItems = document.querySelectorAll('.song-item');
  songItems.forEach((item, index) => {
    if (index === songIndex) {
      item.classList.add('playing');
    } else {
      item.classList.remove('playing');
    }
  });
}

// Call the populatePlaylist function once at the start
populatePlaylist();