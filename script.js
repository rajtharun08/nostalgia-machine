// --- STATE ---
let isPlaying = false;
const songs = [
    { name: 'music.mp3', image: 'music.jpg' },
    { name: 'another-song.mp3', image: 'another-song.jpg' },
    { name: 'a-third-song.mp3', image: 'a-third-song.jpg' }
];
let songIndex = 0;
const themes = ['', 'theme-dark', 'theme-pop'];
let currentThemeIndex = 0;
let audioContext, audioSource, analyser;

// --- SELECTORS ---
const player = document.getElementById('player');
const themeBtn = document.getElementById('theme-btn');
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
const sfxClick = document.getElementById('sfx-click');
const loadingIndicator = document.getElementById('loading-indicator');

// --- FUNCTIONS ---
function changeTheme() {
    if (themes[currentThemeIndex]) player.classList.remove(themes[currentThemeIndex]);
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    if (themes[currentThemeIndex]) player.classList.add(themes[currentThemeIndex]);
}

function playSfx() {
    sfxClick.currentTime = 0;
    sfxClick.play();
}

function populatePlaylist() {
  songs.forEach((song, index) => {
    const songItem = document.createElement('div');
    songItem.classList.add('song-item');
    songItem.innerText = song.name.replace('.mp3', '').replaceAll('-', ' ');
    playlist.appendChild(songItem);
  });
}

function loadSong(song) {
  title.innerText = song.name.replace('.mp3', '').replaceAll('-', ' ');
  audio.src = `audio/${song.name}`;
  bgImage.style.backgroundImage = `url(img/${song.image})`;
  bgImage.onerror = () => { bgImage.style.backgroundImage = ''; };
  const songItems = document.querySelectorAll('.song-item');
  songItems.forEach((item, index) => item.classList.toggle('playing', index === songIndex));
}

function playSong() {
  if (!audioContext) setupAudioVisualizer();
  isPlaying = true;
  playPauseBtn.querySelector('i.fas').classList.replace('fa-play', 'fa-pause');
  reels.forEach(reel => reel.classList.add('playing'));
  audio.play().catch(handlePlayError);
}

function pauseSong() {
  isPlaying = false;
  playPauseBtn.querySelector('i.fas').classList.replace('fa-pause', 'fa-play');
  reels.forEach(reel => reel.classList.remove('playing'));
  audio.pause();
}

function prevSong() {
  playSfx();
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

function nextSong() {
  playSfx();
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

function showLoading(show) {
    loadingIndicator.classList.toggle('show', show);
}

function handlePlayError(error) {
    console.error("Playback failed:", error);
    title.textContent = "Error: Could not play audio.";
    showLoading(false);
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  if (duration) progress.style.width = `${(currentTime / duration) * 100}%`;
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = audio;
  if (duration) audio.currentTime = (clickX / width) * duration;
}

function setVolume() {
  audio.volume = volumeSlider.value / 100;
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
    const barWidth = (visualizerCanvas.width / bufferLength) * 2.5;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        const color = getComputedStyle(player).getPropertyValue('--highlight-color').trim() || '#f5c518';
        canvasCtx.fillStyle = color;
        canvasCtx.fillRect(x, visualizerCanvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
    }
}

// --- EVENT LISTENERS ---
themeBtn.addEventListener('click', changeTheme);
playPauseBtn.addEventListener('click', () => { playSfx(); isPlaying ? pauseSong() : playSong(); });
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);
progressContainer.addEventListener('click', setProgress);
volumeSlider.addEventListener('input', setVolume);
audio.addEventListener('waiting', () => showLoading(true));
audio.addEventListener('canplay', () => showLoading(false));
audio.addEventListener('error', () => { title.textContent = "Error: Could not load song."; showLoading(false); });
playlist.addEventListener('click', (e) => {
    const clickedItem = e.target.closest('.song-item');
    if (clickedItem) {
        const allItems = [...playlist.children];
        const newIndex = allItems.indexOf(clickedItem);
        if (newIndex !== songIndex) {
            playSfx();
            songIndex = newIndex;
            loadSong(songs[songIndex]);
            playSong();
        }
    }
});

// --- INITIAL LOAD ---
populatePlaylist();
loadSong(songs[songIndex]);
setVolume();

