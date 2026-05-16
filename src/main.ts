import './styles/main.css';

import { renderHero } from './sections/hero';
import { renderOverview } from './sections/overview';
import { renderPaths } from './sections/paths';
import { renderMap } from './sections/map';
import { renderFlights } from './sections/flights';
import { renderRental } from './sections/rental';
import { renderLodging } from './sections/lodging';
import { renderFood } from './sections/food';
import { renderItinerary } from './sections/itinerary';
import { renderHikes } from './sections/hikes';
import { renderViewpoints } from './sections/viewpoints';
import { renderActivities } from './sections/activities';
import { renderRestaurants } from './sections/restaurants';
import { renderSky } from './sections/sky';
import { renderBring } from './sections/bring';
import { renderSeattle } from './sections/seattle';
import { renderLogistics } from './sections/logistics';
import { renderForErin } from './sections/for-erin';
import { renderDecisions } from './sections/decisions';
import { renderFooter } from './sections/footer';
import { attachNotesButton, initNotesModal, refreshBadges } from './sections/notes-button';

function mount(): void {
  const app = document.getElementById('app');
  if (!app) {
    throw new Error('Missing #app root');
  }
  app.replaceChildren(renderHero(), document.createElement('main'));
  const main = app.querySelector('main');
  if (!main) return;
  main.className = 'main';
  const sections = [
    renderPaths(),
    renderMap(),
    renderOverview(),
    renderFlights(),
    renderRental(),
    renderLodging(),
    renderFood(),
    renderItinerary(),
    renderHikes(),
    renderViewpoints(),
    renderActivities(),
    renderRestaurants(),
    renderSky(),
    renderBring(),
    renderSeattle(),
    renderLogistics(),
    renderForErin(),
    renderDecisions(),
  ];
  main.append(...sections);
  app.append(renderFooter());

  // Notes UI — modal mounts once, button attached per section, badges refreshed.
  initNotesModal();
  for (const sec of sections) {
    attachNotesButton(sec);
  }
  void refreshBadges();
}

mount();
