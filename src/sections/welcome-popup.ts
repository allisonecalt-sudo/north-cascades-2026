/**
 * welcome-popup.ts — first-visit tutorial popup for Erin.
 *
 * Why this file: Allison May 17, 2026 — *"erin doesnt know how to use site
 * so there needs to be a pop expalianatoin on how to do notes so i can
 * fix up site how she wants."* Erin needs a one-time, dismissible intro
 * that explains the 💬 notes mechanic.
 *
 * What's decided:
 *   - One-time show — persisted via localStorage key 'ncades2026.welcomeSeen'.
 *   - Dismissible by clicking anywhere OR the explicit "Got it" button.
 *   - Friendly tone, brief, points at the 💬 buttons.
 *   - Allison can re-trigger by clearing localStorage in DevTools.
 *
 * Mounted on every page after the shell — but only the FIRST page Erin lands
 * on shows it. After that the key is set and the popup stays dormant.
 */

const WELCOME_KEY = 'ncades2026.welcomeSeen';

function hasSeenWelcome(): boolean {
  try {
    return localStorage.getItem(WELCOME_KEY) === '1';
  } catch {
    return true; // If storage is blocked, don't pester. Treat as "seen."
  }
}

function markWelcomeSeen(): void {
  try {
    localStorage.setItem(WELCOME_KEY, '1');
  } catch {
    /* ignore */
  }
}

function buildPopup(): HTMLDivElement {
  const wrap = document.createElement('div');
  wrap.className = 'welcome-popup-backdrop';
  wrap.setAttribute('role', 'dialog');
  wrap.setAttribute('aria-modal', 'true');
  wrap.setAttribute('aria-labelledby', 'welcome-popup-title');
  wrap.innerHTML = `
    <div class="welcome-popup">
      <button class="welcome-popup__close" type="button" aria-label="Close welcome">×</button>
      <div class="welcome-popup__eyebrow">Hey Erin —</div>
      <h2 class="welcome-popup__title" id="welcome-popup-title">This is a draft of our trip. React to it.</h2>
      <p class="welcome-popup__body">
        Your Google Doc is still the plan. This site is just so you can
        <em>see</em> the options laid out — lodging, hikes, drive times — and tell
        me what to change. Nothing here is locked.
      </p>

      <div class="welcome-popup__steps">
        <div class="welcome-popup__step">
          <span class="welcome-popup__step-num">1</span>
          <div class="welcome-popup__step-body">
            <strong>Tap the
              <span class="welcome-popup__chip">💬&nbsp;Note</span> button</strong>
            in the bottom-right of any page (it's there on every page).
            Or tap a <span class="welcome-popup__chip">💬</span> next to a section
            title to scope your note to that thing.
          </div>
        </div>
        <div class="welcome-popup__step">
          <span class="welcome-popup__step-num">2</span>
          <div class="welcome-popup__step-body">
            <strong>Type it like you'd text me.</strong>
            "Cascade River House looks great." "Swap Maple Pass for something easier."
            "Too much driving on day 3." "I want to spend a night in Winthrop."
            No filter.
          </div>
        </div>
        <div class="welcome-popup__step">
          <span class="welcome-popup__step-num">3</span>
          <div class="welcome-popup__step-body">
            <strong>I'm 10 hours ahead</strong> — leave a note before bed,
            by the time you wake up the site will already reflect it.
            Refresh and see.
          </div>
        </div>
      </div>

      <p class="welcome-popup__body welcome-popup__body--small">
        Three paths up top (A / B / C) for how to spend the 4 nights — pick one to filter
        the site, or leave it on "compare all" to see every option side-by-side.
      </p>

      <div class="welcome-popup__actions">
        <button class="welcome-popup__cta" type="button" data-action="dismiss">
          Got it — show me the trip
        </button>
      </div>
      <p class="welcome-popup__tip">Click anywhere outside this box to close.</p>
    </div>
  `;
  return wrap;
}

/**
 * Show the welcome popup if Erin hasn't seen it.
 * Call this once per page after mountPageShell.
 *
 * If `force` is true, ignore the localStorage flag (used by a re-show hook).
 */
export function showWelcomePopup(force = false): void {
  // Query-string override: ?welcome=1 re-shows for testing / Allison previews.
  const wantsForce =
    force ||
    (typeof window !== 'undefined' &&
      typeof window.location !== 'undefined' &&
      window.location.search.includes('welcome=1'));
  if (!wantsForce && hasSeenWelcome()) return;

  const popup = buildPopup();
  document.body.appendChild(popup);

  const close = (): void => {
    popup.classList.remove('open');
    markWelcomeSeen();
    setTimeout(() => popup.remove(), 280);
  };

  // Click anywhere on the backdrop = dismiss. Click inside the box = stay open
  // (unless it's the X or the CTA).
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      close();
      return;
    }
    if (!(e.target instanceof HTMLElement)) return;
    if (
      e.target.classList.contains('welcome-popup__close') ||
      e.target.dataset['action'] === 'dismiss'
    ) {
      close();
    }
  });

  // Escape closes too.
  const escHandler = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  // Animate in.
  requestAnimationFrame(() => popup.classList.add('open'));
}

/** Allison-side helper: window.resetWelcome() to clear the flag for testing. */
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>)['resetWelcome'] = (): void => {
    try {
      localStorage.removeItem(WELCOME_KEY);
      console.log('Welcome popup will show on next reload.');
    } catch {
      /* ignore */
    }
  };
}
