/* Google Analytics, only with the visitor's consent (POPIA).
 * Nothing is loaded and no cookie is set until "Accept" is clicked. The choice is remembered in this browser;
 * "Cookie settings" in the footer lets the visitor change it.
 * Set your Google Analytics 4 measurement ID below (Admin → Data streams → your website → Measurement ID). */
(function () {
  var GA_ID = 'G-MJEBWV0FL0';
  var KEY = 'mda_analytics_consent';           // 'granted' | 'denied'
  var configured = /^G-[A-Z0-9]{6,}$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX';

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* storage blocked: ask again next visit */ } }

  var loaded = false;
  function loadAnalytics() {
    if (loaded || !configured) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
  }

  function removeCookies() {
    // clear Google Analytics cookies after a change of mind
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (/^_ga/.test(name)) {
        var host = location.hostname.replace(/^www\./, '');
        ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  var css = '.mda-cc{position:fixed;left:16px;right:16px;bottom:16px;z-index:1000;max-width:560px;margin:0 auto;background:#041428;color:#E8EEF6;'
    + 'border-radius:14px;box-shadow:0 18px 50px rgba(4,20,40,.35);padding:18px 20px;font:14px/1.55 Inter,system-ui,sans-serif}'
    + '.mda-cc p{margin:0 0 12px;color:#C9D4E3}.mda-cc a{color:#E2B46B}'
    + '.mda-cc .b{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}'
    + '.mda-cc button{font:600 14px Inter,system-ui,sans-serif;border-radius:10px;padding:9px 16px;cursor:pointer;border:1.5px solid #A57939}'
    + '.mda-cc .y{background:#A57939;color:#fff}.mda-cc .n{background:transparent;color:#E8EEF6;border-color:#4A5D78}'
    + '.mda-cc button:focus-visible{outline:2px solid #fff;outline-offset:2px}';

  function banner() {
    if (document.querySelector('.mda-cc')) return;
    if (!document.getElementById('mda-cc-css')) { var st = document.createElement('style'); st.id = 'mda-cc-css'; st.textContent = css; document.head.appendChild(st); }
    var d = document.createElement('div');
    d.className = 'mda-cc'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Cookies on this website');
    d.innerHTML = '<p>May we use Google Analytics cookies to see how visitors use this website? It helps us improve it. '
      + 'We never use them for advertising. <a href="privacy.html#website">Privacy Notice</a></p>'
      + '<div class="b"><button type="button" class="n">No, thanks</button><button type="button" class="y">Accept</button></div>';
    d.querySelector('.y').onclick = function () { save('granted'); d.remove(); loadAnalytics(); };
    d.querySelector('.n').onclick = function () {
      var was = read(); save('denied'); d.remove(); removeCookies();
      if (was === 'granted') location.reload();                 // analytics already running on this page: stop it
    };
    document.body.appendChild(d);
    d.querySelector('.y').focus({ preventScroll: true });
  }

  // footer link: <a href="#" data-cookie-settings>Cookie settings</a>
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-cookie-settings]');
    if (!t) return;
    e.preventDefault();
    banner();
  });

  function start() {
    if (!configured) return;                  // no measurement ID yet: no banner, nothing loaded
    var c = read();
    if (c === 'granted') loadAnalytics();
    else if (c !== 'denied') banner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
