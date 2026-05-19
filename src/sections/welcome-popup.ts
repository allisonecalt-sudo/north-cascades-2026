/**
 * welcome-popup.ts — first-visit intro for Erin.
 *
 * Voice: Claude (the AI Allison directs) speaking transparently to Erin in
 * third person about Allison. Rewritten 2026-05-17 PM per Allison's directive:
 *   *"talk as claude not as allison"*
 *
 * Why this matters: previously the popup spoke first-person AS Allison
 * ("I'm 10 hours ahead, leave a note before bed"). That blurred who built
 * the site. The honest framing is — Allison is the director, Claude is the
 * builder + the iterator between Erin's notes and the next site update.
 * Erin should know who she's talking to.
 *
 * Mechanic unchanged:
 *   - One-time show — persisted via localStorage 'ncades2026.welcomeSeen'.
 *   - Dismissible by clicking anywhere OR the explicit CTA / X.
 *   - Allison can re-trigger with window.resetWelcome() or ?welcome=1.
 */

// Key bumped to v2 on 2026-05-19 after Path B + A fallback decision: copy
// changed substantively and we want Erin to see the new "what's decided"
// framing on her next visit, not the stale "pick a path" popup.
const WELCOME_KEY = 'ncades2026.welcomeSeen.v2';

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
      <h2 class="welcome-popup__title" id="welcome-popup-title">You picked Path B + A fallback ✓ — now locking flights + lodging.</h2>
      <p class="welcome-popup__body">
        Quick recap of where we landed in the May 18 thread — Path B (both sides)
        if WA-20 reopens, Path A (Marblemount-only) if it doesn't. Site has been
        re-shaped around that: the "What's decided" strip on the home page is
        the live state, and the deeper picker below is the deep dive for when
        you want to peek at the alternates.
      </p>

      <div class="welcome-popup__steps">
        <div class="welcome-popup__step">
          <span class="welcome-popup__step-num">1</span>
          <div class="welcome-popup__step-body">
            <strong>What's decided strip</strong> sits right at the top of the
            home page. Path · road gate · flights · lodging · Mt Baker — each
            row shows current state + who's holding the ball. That's your
            30-second status check.
          </div>
        </div>
        <div class="welcome-popup__step">
          <span class="welcome-popup__step-num">2</span>
          <div class="welcome-popup__step-body">
            <strong>What's new since you last looked:</strong>
            <ul style="margin: 0.4rem 0 0 1rem; padding: 0; list-style: disc;">
              <li><strong>Flights:</strong> United → SEA is now the leading option (your May 18 note — cheaper, Allison has the travel credit, refundable preferred)</li>
              <li><strong>Lodging:</strong> Marblemount cluster (Marblemount / Concrete / Rockport) is the default. Refundable-only filter is ON by default. 2-nights-west + 2-nights-east split for Path B is flagged on the lodging page.</li>
              <li><strong>Mt Baker:</strong> added a Park Butte card per your Google Doc — ~1 hr west of Marblemount, swap-in for Path A or side trip for Path B.</li>
            </ul>
          </div>
        </div>
        <div class="welcome-popup__step">
          <span class="welcome-popup__step-num">3</span>
          <div class="welcome-popup__step-body">
            <strong>However you want to react is fine:</strong> text Allison
            (she's 10 hrs ahead, will get it on her morning), edit the
            <strong>Google Doc</strong>, or tap
            <span class="welcome-popup__chip">💬&nbsp;Note</span> on any section.
            All three reach the next session.
          </div>
        </div>
      </div>

      <p class="welcome-popup__body welcome-popup__body--small">
        Still open: WSDOT WA-20 reopen confirmation (gates Path B vs Path A),
        exact United fares (you're researching), exact Marblemount lodging picks
        (Allison's researching today).
      </p>

      <div class="welcome-popup__actions">
        <button class="welcome-popup__cta" type="button" data-action="dismiss">
          Got it — start exploring
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
