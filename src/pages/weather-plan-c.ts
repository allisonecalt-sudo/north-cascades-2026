/**
 * weather-plan-c.ts — smoke + bad-air Plan C page entrypoint.
 *
 * Pre-built per `nc-improvement-plan-2026-05-17.md` "Pages NC needs":
 *   *"PNW rain-swap for any day. Mid-August NC weather is mostly dry but
 *   smoke-from-wildfires is the real Plan C. Pre-build it now, populate later
 *   as research lands."*
 *
 * Asymmetry vs Austria's weather-plan-c:
 *   - Austria worries about afternoon thunderstorms (~12 rain days/month).
 *   - NC worries about wildfire smoke (mid-August is mostly dry).
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { renderWeatherPlanC } from '../sections/weather-plan-c';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'weather-plan-c',
    title: 'Weather Plan C — smoke + bad-air swaps',
    verifiedOn: '2026-05-17',
    lede:
      'August NC is mostly dry — rain is a non-event. Wildfire smoke is the real ' +
      'Plan C trigger: when the AQI climbs, swap down a tier.',
    imageHero: {
      // Direct corridor match: Gorge Lake (on WA-20, west of Diablo) under
      // wildfire smoke from the 2023 Sourdough Fire — the exact scenario this
      // page exists for. HEAD-verified 200 OK May 17 2026.
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gorge_Lake_and_smoke_from_Sourdough_Fire.jpg?width=1280',
      alt: 'Gorge Lake on WA-20 under heavy wildfire smoke from the 2023 Sourdough Fire — visibility reduced, hills hazed.',
      credit: 'Photo: NPS · Sourdough Fire 2023 (Wikimedia)',
      ctaLabel: 'Skip to the swaps',
      ctaHref: '#weather-plan-c',
    },
  });

  main.append(renderWeatherPlanC(), renderPageCtas('weather-plan-c'));
}

mount();
