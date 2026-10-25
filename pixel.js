/* Pixel di Meta col consenso (25 ott 2026, Davide: «mettiamo pixel»).
   Pixel «DENNIS AVR PIXEL» del portfolio Dennis Avarello Consulting: lo stesso dei funnel del personal brand.
   Si carica SOLO dopo «Accetta» (regole del Garante sui cookie); la scelta resta salvata sul telefono.
   Eventi: PageView all'apertura, «QuestionarioAperto» quando parte il questionario, Lead all'invio, «SimulazioneCompletata» nella simulazione.
   Dalla pagina: window.markTraccia('Lead') oppure window.markTraccia('QuestionarioAperto', {}, true) per gli eventi personalizzati.
   Per spegnerlo: togliere la riga <script src="/pixel.js"> dalle pagine. */
(function () {
  var PIXEL = '757132037363782', CHIAVE = 'mark-cookie';
  var coda = [], acceso = false;

  function scelta() { try { return localStorage.getItem(CHIAVE); } catch (e) { return null; } }
  function salva(v) { try { localStorage.setItem(CHIAVE, v); } catch (e) {} }

  function accendi() {
    if (acceso) return; acceso = true;
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL);
    fbq('track', 'PageView');
    coda.forEach(function (a) { manda.apply(null, a); }); coda = [];
  }
  function manda(evento, dati, personalizzato) { fbq(personalizzato ? 'trackCustom' : 'track', evento, dati || {}); }

  /* gli eventi prima del consenso aspettano: partono solo se poi accetta */
  window.markTraccia = function (evento, dati, personalizzato) {
    if (acceso) manda(evento, dati, personalizzato); else if (scelta() !== 'no') coda.push([evento, dati, personalizzato]);
  };

  function banner() {
    var s = document.createElement('style');
    s.textContent = '.mk-cookie{box-sizing:border-box;position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:2147483000;max-width:520px;margin:0 auto;background:#0F0F10;color:#F2F0EB;border:1px solid #2a2a2c;border-radius:4px;padding:14px 16px;font:500 14px/20px Switzer,system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.5);opacity:0;transform:translateY(12px);transition:opacity .4s,transform .4s}' +
      '.mk-cookie.su{opacity:1;transform:none}.mk-cookie p{margin:0 0 12px;color:#bdbab3}.mk-cookie a{color:#E39B3A}' +
      '.mk-cookie div{display:flex;gap:10px}.mk-cookie button{box-sizing:border-box;min-width:0;flex:1;padding:11px 12px;border-radius:2px;font:600 15px/20px Switzer,system-ui,sans-serif;cursor:pointer;border:1px solid #E39B3A}' +
      '.mk-cookie .si{background:#E39B3A;color:#050505}.mk-cookie .no{background:transparent;color:#F2F0EB;border-color:#3a3a3c}';
    document.head.appendChild(s);
    var b = document.createElement('div');
    b.className = 'mk-cookie'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Cookie');
    b.innerHTML = '<p>Usiamo i cookie di Meta per capire da dove arrivi e mostrarti contenuti su Mark. <a href="/privacy.html#cookie" target="_blank" rel="noopener">Dettagli</a></p><div><button class="no" type="button">Rifiuta</button><button class="si" type="button">Accetta</button></div>';
    document.body.appendChild(b);
    requestAnimationFrame(function () { requestAnimationFrame(function () { b.classList.add('su'); }); });
    function chiudi(v) { salva(v); b.classList.remove('su'); setTimeout(function () { b.remove(); }, 400); if (v === 'si') accendi(); else coda = []; }
    b.querySelector('.si').onclick = function () { chiudi('si'); };
    b.querySelector('.no').onclick = function () { chiudi('no'); };
  }

  var v = scelta();
  if (v === 'si') accendi();
  else if (v !== 'no') {
    /* dopo l'accensione della pagina, così non copre l'apertura */
    var parti = function () { setTimeout(banner, 2500); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', parti); else parti();
  }
})();
