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
      <div class="welcome-popup__eyebrow">Hi Erin —</div>
      <h2 class="welcome-popup__title" id="welcome-popup-title">Allison built this for our trip.</h2>
      <p class="welcome-popup__body">
        You'll see a small <span class="welcome-popup__chip">💬</span> button next to every
        section title — <strong>tap it to leave a note.</strong> Whatever you're thinking
        about that section: "I like this lodging," "this drive looks too long," "swap
        this hike for that one," "this part isn't for me." Anything.
      </p>
      <p class="welcome-popup__body">
        Allison's AI assistant reads the notes and she updates the site to match.
        Think of it as a shared whiteboard — your edits land in her hands.
      </p>
      <p class="welcome-popup__body welcome-popup__body--small">
        Three paths up top (A / B / C) — pick one to filter the site, or
        compare all three. Nothing's locked. This is a draft.
      </p>
      <div class="welcome-popup__actions">
        <button class="welcome-popup__cta" type="button" data-action="dismiss">
          Got it — show me the trip
        </button>
      </div>
      <p class="welcome-popup__tip">Or click anywhere to dismiss.</p>
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
  if (!force && hasSeenWelcome()) return;

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
