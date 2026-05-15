import './styles/main.css';

import { renderHero } from './sections/hero';
import { renderOverview } from './sections/overview';
import { renderFlights } from './sections/flights';
import { renderRental } from './sections/rental';
import { renderLodging } from './sections/lodging';
import { renderFood } from './sections/food';
import { renderItinerary } from './sections/itinerary';
import { renderHikes } from './sections/hikes';
import { renderViewpoints } from './sections/viewpoints';
import { renderRestaurants } from './sections/restaurants';
import { renderSeattle } from './sections/seattle';
import { renderLogistics } from './sections/logistics';
import { renderDecisions } from './sections/decisions';
import { renderFooter } from './sections/footer';

function mount(): void {
  const app = document.getElementById('app');
  if (!app) {
    throw new Error('Missing #app root');
  }
  app.replaceChildren(
    renderHero(),
    document.createElement('main'),
  );
  const main = app.querySelector('main');
  if (!main) return;
  main.className = 'main';
  main.append(
    renderOverview(),
    renderFlights(),
    renderRental(),
    renderLodging(),
    renderFood(),
    renderItinerary(),
    renderHikes(),
    renderViewpoints(),
    renderRestaurants(),
    renderSeattle(),
    renderLogistics(),
    renderDecisions()
  );
  app.append(renderFooter());
}

mount();
