// --- STATE ---
let isPlaying = false;
const songs = ['music.mp3', 'another-song.mp3', 'a-third-song.mp3'];
let songIndex = 0;
// Add theme state
const themes = ['', 'theme-dark', 'theme-pop']; // Start with default (no class)
let currentThemeIndex = 0;

// --- SELECTORS ---
const player = document.getElementById('player'); // Select the player itself
const themeBtn = document.getElementById('theme-btn'); // Select the new button
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

// --- NEW THEME FUNCTION ---
function changeTheme() {
    // Remove the current theme class from the player
    if (themes[currentThemeIndex]) {
        player.classList.remove(themes[currentThemeIndex]);
    }

    // Move to the next theme
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;

    // Add the new theme class
    if (themes[currentThemeIndex]) {
        player.classList.add(themes[currentThemeIndex]);
    }
}

// --- ALL OTHER FUNCTIONS (UNCHANGED) ---
function populatePlaylist() { /* ... unchanged ... */ }
function loadSong(song) { /* ... unchanged ... */ }
function playSong() { /* ... unchanged ... */ }
function pauseSong() { /* ... unchanged ... */ }
function prevSong() { /* ... unchanged ... */ }
function nextSong() { /* ... unchanged ... */ }
function updateProgress(e) { /* ... unchanged ... */ }
function setProgress(e) { /* ... unchanged ... */ }
function setVolume() { /* ... unchanged ... */ }

// --- EVENT LISTENERS ---
themeBtn.addEventListener('click', changeTheme); // Add listener for the new button
playPauseBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('ended', nextSong);
volumeSlider.addEventListener('input', setVolume);

// --- INITIAL LOAD ---
populatePlaylist();
loadSong(songs[songIndex]);
setVolume();

// (Helper functions for copy-pasting the full logic)
function populatePlaylist() { songs.forEach((song, index) => { const songItem = document.createElement('div'); songItem.classList.add('song-item'); songItem.innerText = song.replace('.mp3', '').replaceAll('-', ' '); songItem.addEventListener('click', () => { songIndex = index; loadSong(songs[songIndex]); playSong(); }); playlist.appendChild(songItem); }); }
function loadSong(song) { title.innerText = song.replace('.mp3', '').replaceAll('-', ' '); audio.src = `audio/${song}`; const songItems = document.querySelectorAll('.song-item'); songItems.forEach((item, index) => { if (index === songIndex) { item.classList.add('playing'); } else { item.classList.remove('playing'); } }); }
function playSong() { isPlaying = true; playPauseBtn.querySelector('i.fas').classList.remove('fa-play'); playPauseBtn.querySelector('i.fas').classList.add('fa-pause'); reels.forEach(reel => reel.classList.add('playing')); audio.play(); }
function pauseSong() { isPlaying = false; playPauseBtn.querySelector('i.fas').classList.remove('fa-pause'); playPauseBtn.querySelector('i.fas').classList.add('fa-play'); reels.forEach(reel => reel.classList.remove('playing')); audio.pause(); }
function prevSong() { songIndex--; if (songIndex < 0) { songIndex = songs.length - 1; } loadSong(songs[songIndex]); playSong(); }
function nextSong() { songIndex++; if (songIndex > songs.length - 1) { songIndex = 0; } loadSong(songs[songIndex]); playSong(); }
function updateProgress(e) { const { duration, currentTime } = e.srcElement; if (duration) { const progressPercent = (currentTime / duration) * 100; progress.style.width = `${progressPercent}%`; } }
function setProgress(e) { const width = this.clientWidth; const clickX = e.offsetX; const duration = audio.duration; if (duration) { audio.currentTime = (clickX / width) * duration; } }
function setVolume() { audio.volume = volumeSlider.value / 100; }

