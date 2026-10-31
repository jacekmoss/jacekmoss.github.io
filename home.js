'use strict';
/* Przycisk domku – powrót z gry do ekranu wyboru gier (https://jacekmoss.github.io/).
   Dołączany w każdej grze jedną linijką:
     <script src="/home.js" data-corner="tl" defer></script>
   data-corner: tl (lewy górny, domyślnie), tr, bl, br, tc (góra środek).
   Żeby maluch nie wychodził przypadkiem, domek trzeba chwilę przytrzymać – kółko się wtedy wypełnia.
   Gra może pokazywać domek tylko na swoim ekranie startowym (żeby nie zasłaniał niczego w trakcie gry):
     <script>window.gryHomeVisible = () => stanGry === 'menu';</script>
   Bez tej funkcji domek jest widoczny cały czas. */
(function () {
  if (window.top !== window) return;                    // gra otwarta w ramce – nie dokładaj
  if (!location.protocol.startsWith('http')) return;    // plik otwarty dwuklikiem – nie ma dokąd wracać

  const script = document.currentScript;
  const corner = (script && script.dataset.corner) || 'tl';
  const HOLD_MS = 600;
  const HOME = '/';

  const css = `
    #gry-home {
      position: fixed; z-index: 2147483000; width: 56px; height: 56px; padding: 0; margin: 0;
      border: 0; border-radius: 50%; background: rgba(255,255,255,.82); color: #3A2E5C;
      box-shadow: 0 4px 12px rgba(0,0,0,.25); cursor: pointer;
      display: grid; place-items: center; touch-action: none;
      -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none;
      transition: transform .12s ease, background .12s ease;
    }
    #gry-home[data-c="tl"] { top: max(10px, env(safe-area-inset-top)); left: max(10px, env(safe-area-inset-left)); }
    #gry-home[data-c="tr"] { top: max(10px, env(safe-area-inset-top)); right: max(10px, env(safe-area-inset-right)); }
    #gry-home[data-c="bl"] { bottom: max(10px, env(safe-area-inset-bottom)); left: max(10px, env(safe-area-inset-left)); }
    #gry-home[data-c="br"] { bottom: max(10px, env(safe-area-inset-bottom)); right: max(10px, env(safe-area-inset-right)); }
    #gry-home[data-c="tc"] { top: max(8px, env(safe-area-inset-top)); left: 50%; margin-left: -28px; }
    #gry-home.down { transform: scale(1.12); background: #fff; }
    #gry-home.nudge { animation: gry-home-nudge .4s ease; }
    #gry-home svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
    #gry-home .ring { fill: none; stroke: #FFB703; stroke-width: 5; stroke-linecap: round;
      stroke-dasharray: 151; stroke-dashoffset: 151; transform: rotate(-90deg); transform-origin: 50% 50%; }
    #gry-home.down .ring { transition: stroke-dashoffset ${HOLD_MS}ms linear; stroke-dashoffset: 0; }
    @keyframes gry-home-nudge { 0%,100% { transform: rotate(0); } 25% { transform: rotate(-12deg); } 75% { transform: rotate(12deg); } }
    @media (prefers-reduced-motion: reduce) { #gry-home.nudge { animation: none; } }
  `;

  const btn = document.createElement('button');
  btn.id = 'gry-home';
  btn.type = 'button';
  btn.tabIndex = -1;                   // bez fokusu – spacja/Enter w grze nie mogą „nacisnąć” domku
  btn.dataset.c = corner;
  btn.setAttribute('aria-label', 'Wróć do wyboru gier (przytrzymaj)');
  btn.innerHTML = `
    <svg viewBox="0 0 56 56" aria-hidden="true">
      <circle class="ring" cx="28" cy="28" r="24"/>
      <path d="M28 15 L14 27 h4 v13 h7.5 v-8 h5 v8 H38 V27 h4Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>`;

  let timer = 0;
  const cancel = () => { clearTimeout(timer); timer = 0; btn.classList.remove('down'); };
  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault(); e.stopPropagation();
    try { btn.setPointerCapture(e.pointerId); } catch (_) { /* stara przeglądarka */ }
    btn.classList.add('down');
    timer = setTimeout(() => {
      timer = 0;
      try { speechSynthesis.cancel(); } catch (_) { /* brak lektora */ }
      location.href = HOME;
    }, HOLD_MS);
  });
  btn.addEventListener('pointerup', (e) => {
    e.stopPropagation();
    if (timer) {                       // puszczone za wcześnie – mrugnij, że trzeba przytrzymać
      cancel();
      btn.classList.remove('nudge'); void btn.offsetWidth; btn.classList.add('nudge');
    }
  });
  btn.addEventListener('pointercancel', cancel);
  btn.addEventListener('lostpointercapture', () => { if (timer) cancel(); });
  btn.addEventListener('click', (e) => e.stopPropagation());
  btn.addEventListener('contextmenu', (e) => e.preventDefault());

  const mount = () => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    document.body.appendChild(btn);
    // czy gra chce teraz pokazać domek (sprawdzane kilka razy na sekundę)
    const sync = () => {
      let show = true;
      try { if (typeof window.gryHomeVisible === 'function') show = !!window.gryHomeVisible(); } catch (_) { show = true; }
      if (!show && timer) cancel();
      btn.style.display = show ? '' : 'none';
    };
    sync();
    setInterval(sync, 250);
  };
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
