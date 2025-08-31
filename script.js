// --- STATE ---
let isPlaying = false;
// Note: Create an 'img' folder and add corresponding images for each song.
const songs = [
    { name: 'music.mp3', image: 'music.jpg' },
    { name: 'another-song.mp3', image: 'another-song.jpg' },
    { name: 'a-third-song.mp3', image: 'a-third-song.jpg' }
];
let songIndex = 0;
let audioContext, audioSource, analyser;

// --- SELECTORS ---
const bgImage = document.getElementById('bg-image');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const playPauseBtn = document.getElementById('play-pause-btn');
const reels = document.querySelectorAll('.reel');
const progress = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-container');
const audio = document.getElementById('audio');
const title = document.getElementById('title');
const volumeSlider = document.getElementById('volume-slider');
const playlist = document.getElementById('playlist');
const visualizerCanvas = document.getElementById('visualizer');
const canvasCtx = visualizerCanvas.getContext('2d');

// --- FUNCTIONS ---
function populatePlaylist() {
  songs.forEach((song, index) => {
    const songItem = document.createElement('div');
    songItem.classList.add('song-item');
    songItem.innerText = song.name.replace('.mp3', '').replaceAll('-', ' ');
    songItem.addEventListener('click', () => {
        songIndex = index;
        loadSong(songs[songIndex]);
        playSong();
    });
    playlist.appendChild(songItem);
  });
}

function loadSong(song) {
  title.innerText = song.name.replace('.mp3', '').replaceAll('-', ' ');
  audio.src = `audio/${song.name}`;
  bgImage.style.backgroundImage = `url(img/${song.image})`;

  const songItems = document.querySelectorAll('.song-item');
  songItems.forEach((item, index) => {
    item.classList.toggle('playing', index === songIndex);
  });
}

function playSong() {
  if (!audioContext) {
    setupAudioVisualizer();
  }
  isPlaying = true;
  playPauseBtn.querySelector('i.fas').classList.replace('fa-play', 'fa-pause');
  reels.forEach(reel => reel.classList.add('playing'));
  audio.play();
  localStorage.setItem('nostalgia-player-isPlaying', 'true');
}

function pauseSong() {
  isPlaying = false;
  playPauseBtn.querySelector('i.fas').classList.replace('fa-pause', 'fa-play');
  reels.forEach(reel => reel.classList.remove('playing'));
  audio.pause();
  localStorage.setItem('nostalgia-player-isPlaying', 'false');
}

function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  if (duration) {
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    localStorage.setItem('nostalgia-player-currentTime', currentTime);
  }
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = audio;
  if (duration) {
    audio.currentTime = (clickX / width) * duration;
  }
}

function setVolume() {
  const volume = volumeSlider.value / 100;
  audio.volume = volume;
  localStorage.setItem('nostalgia-player-volume', volume);
}

function handleKeyPress(e) {
    if (e.code === 'Space') {
        e.preventDefault(); // Prevent page from scrolling
        isPlaying ? pauseSong() : playSong();
    } else if (e.code === 'ArrowRight') {
        nextSong();
    } else if (e.code === 'ArrowLeft') {
        prevSong();
    }
}

function setupAudioVisualizer() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioSource = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    renderVisualizerFrame(dataArray, bufferLength);
}

function renderVisualizerFrame(dataArray, bufferLength) {
    requestAnimationFrame(() => renderVisualizerFrame(dataArray, bufferLength));
    analyser.getByteFrequencyData(dataArray);

    canvasCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    const barWidth = (visualizerCanvas.width / bufferLength) * 2;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        canvasCtx.fillStyle = `rgba(245, 197, 24, 0.8)`;
        canvasCtx.fillRect(x, visualizerCanvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
    }
}

function loadFromLocalStorage() {
    const savedSongIndex = localStorage.getItem('nostalgia-player-songIndex');
    const savedVolume = localStorage.getItem('nostalgia-player-volume');
    const savedCurrentTime = localStorage.getItem('nostalgia-player-currentTime');

    if (savedSongIndex !== null) {
        songIndex = parseInt(savedSongIndex, 10);
    }
    loadSong(songs[songIndex]);

    if (savedVolume !== null) {
        audio.volume = parseFloat(savedVolume);
        volumeSlider.value = audio.volume * 100;
    }

    if (savedCurrentTime !== null) {
        audio.currentTime = parseFloat(savedCurrentTime);
    }
}

// --- EVENT LISTENERS ---
playPauseBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);
audio.addEventListener('loadeddata', () => {
    localStorage.setItem('nostalgia-player-songIndex', songIndex);
});
progressContainer.addEventListener('click', setProgress);
volumeSlider.addEventListener('input', setVolume);
window.addEventListener('keydown', handleKeyPress);

// --- INITIAL LOAD ---
populatePlaylist();
loadFromLocalStorage();
