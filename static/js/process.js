import { LINES } from './constants.js';
import { AudioVisualizer } from './utils/visualizer.js';

const backgroundAudio = new Audio('/static/media/scan.wav');
backgroundAudio.loop = true;
backgroundAudio.play();

const carousel = document.querySelector('.carousel-container');

document.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem('userName');
  if (!userName) {
    console.error('No user name found');
  }
  window.captions.show(LINES[4]);
  window.captions.show(LINES[5]);
  window.captions.show(LINES[6]);
  window.captions.show(LINES[7].replace('[name]', userName));
  window.captions.show('');
  window.captions.show(LINES[8]);
  setTimeout(() => {
    carousel.style.transition = 'opacity 1s ease';
    carousel.style.opacity = '0';
  }, 20000);
  setTimeout(() => {
    carousel.style.display = 'none';
    loadCall();
  }, 21000);
});

const loadCall = () => {
  backgroundAudio.volume = 0.5;
  const call = new Audio('/static/media/call.wav');
  call.play();
  const visualizer = new AudioVisualizer();
  visualizer.start();
  setTimeout(() => {
    window.captions.show('Please return in 180 days for the next step.');
    window.captions.show('Meanwhile we will begin calibrating your next body.');
    // Fade out the visualizer
    visualizer.stop();
    // redirect to the landing page
    setTimeout(() => {
      window.location.href = '/';
    }, 10000);
  }, 10000);
};
