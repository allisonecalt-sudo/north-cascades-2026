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

// Key bumped to v3 on 2026-05-19 PM (site rework). Copy was rewritten around
// the post-NYC-correction + Marblemount-default + United-primary state. We
// want Erin to see the new "what's locked / what's open" framing on her next
// visit, not the earlier "Path B + A fallback" announcement.
const WELCOME_KEY = 'ncades2026.welcomeSeen.v3';

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
      <h2 class="welcome-popup__title" id="welcome-popup-title">Status update: both leaving from EWR (United primary) · Path B + A fallback locked · picking flights tonight + lodging today.</h2>
      <p class="welcome-popup__body">
        Site has been reshaped around the May 18-19 decisions. Home page now
        leads with <strong>what's locked</strong> (quoted from your messages)
        and <strong>what's still open</strong> (with who's holding each loop).
        The three-paths picker is still here but it's a deep dive now, not
        the front-door question.
      </p>

      <div class="welcome-popup__steps">
        <div class="welcome-popup__step">
          <span class="welcome-popup__step-num">1</span>
          <div class="welcome-popup__step-body">
            <strong>What's locked since last visit:</strong>
            <ul style="margin: 0.4rem 0 0 1rem; padding: 0; list-style: disc;">
              <li>Both depart NYC area — EWR primary, JFK/LGA flex</li>
              <li>United is the main carrier (your "much cheaper" call + Allison's travel credit)</li>
              <li>Marblemount cluster as the default base (your VN — "within an hour driving range")</li>
              <li>Refundable preferred ("if we find something refundable we can book it as a backup")</li>
              <li>Mt Baker / Park Butte added as Day-2 alternative to Cascade Pass</li>
            </ul>
          </div>
        </div>
        <div class="welcome-popup__step">
          <span class="welcome-popup__step-num">2</span>
          <div class="welcome-popup__step-body">
            <strong>What's still open:</strong>
            <ul style="margin: 0.4rem 0 0 1rem; padding: 0; list-style: disc;">
              <li>Exact United fare + refundable upgrade cost — you tonight</li>
              <li>Marblemount-cluster lodging picks (3-4 refundable shortlist) — Allison today</li>
              <li>WSDOT WA-20 reopen confirmation — gates Path B vs Path A</li>
            </ul>
          </div>
        </div>
        <div class="welcome-popup__step">
          <span class="welcome-popup__step-num">3</span>
          <div class="welcome-popup__step-body">
            <strong>However you want to react is fine:</strong> text Allison
            (she's 10 hrs ahead, will get it in her morning), edit the
            <strong>Google Doc</strong>, or tap
            <span class="welcome-popup__chip">💬&nbsp;Note</span> on any section.
            All three reach the next session.
          </div>
        </div>
      </div>

      <div class="welcome-popup__actions">
        <button class="welcome-popup__cta" type="button" data-action="dismiss">
          Got it — scroll for the live state
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
