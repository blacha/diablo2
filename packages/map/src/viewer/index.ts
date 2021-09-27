import { D2MapViewer } from './map.js';

document.addEventListener('DOMContentLoaded', async () => {
  const map = new D2MapViewer('main-map');
  map.update();
});
