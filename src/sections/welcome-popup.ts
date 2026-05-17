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
      <h2 class="welcome-popup__title" id="welcome-popup-title">Your Google Doc is still the plan. This is Allison's research dump on top of it.</h2>
      <p class="welcome-popup__body">
        Quick context — you've been leading this trip (proposed it, narrowed the
        parks, pushed booking discipline). Allison did a deep research pass on
        North Cascades and asked Claude (the AI she's been using) to lay it all
        out visually so you'd have something concrete to react to. Lodging,
        hikes, drive times, costs — pick what looks right, push back on what
        doesn't.
      </p>

      <div class="welcome-popup__steps">
        <div class="welcome-popup__step">
          <span class="welcome-popup__step-num">1</span>
          <div class="welcome-popup__step-body">
            <strong>Five things Allison really needs from you</strong> are at the
            top of the <a href="for-erin.html#must" style="color: inherit; text-decoration: underline;">For Erin</a> page.
            Path A vs B vs C, your hike ceiling, hard yes/hard no, etc. Tap any
            one to start.
          </div>
        </div>
        <div class="welcome-popup__step">
          <span class="welcome-popup__step-num">2</span>
          <div class="welcome-popup__step-body">
            <strong>However you want to react is fine:</strong>
            <ul style="margin: 0.4rem 0 0 1rem; padding: 0; list-style: disc;">
              <li><strong>Text or email Allison</strong> — totally fine, she'll relay it</li>
              <li>Edit the <strong>Google Doc</strong> — Allison reads it between sessions</li>
              <li>Or tap <span class="welcome-popup__chip">💬&nbsp;Note</span> on any section or question (the inline button is scoped to that exact spot) — Claude reads these in the next session and updates the site</li>
            </ul>
          </div>
        </div>
        <div class="welcome-popup__step">
          <span class="welcome-popup__step-num">3</span>
          <div class="welcome-popup__step-body">
            <strong>Allison is 10 hours ahead.</strong> Leave a note / text / doc
            edit before bed — by the time you wake up the site will reflect what
            you sent. Refresh and see.
          </div>
        </div>
      </div>

      <p class="welcome-popup__body welcome-popup__body--small">
        Three paths up top (A / B / C) for shaping the 4 nights — nothing's
        picked yet. Have an instinct? Send it whichever way is easiest.
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
