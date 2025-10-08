import { initialize } from '@/loader.js';
import { hook } from '@/utils/hook.js';
import { initStore } from '@/utils/store.js';
import { outer, outerDocument } from '@/utils/outer.js';

if (!DEV) {
  try {
    const noop = function () {};
    const consoleProxy = new Proxy(
      {},
      {
        get: () => noop,
        set: () => true,
        has: () => true,
        apply: () => noop,
        construct: () => ({}),
      }
    );
    Object.defineProperty(window, 'console', {
      value: consoleProxy,
      configurable: false,
      writable: false,
    });
  } catch (_) {}
  try {
    window.onerror = noop;
  } catch (_) {}
  try {
    window.onunhandledrejection = noop;
  } catch (_) {}
  try {
    window.onrejectionhandled = noop;
  } catch (_) {}
  try {
    window.onabort = noop;
  } catch (_) {}
  try {
    window.onunload = noop;
  } catch (_) {}
  try {
    window.onbeforeunload = noop;
  } catch (_) {}
  try {
    window.addEventListener('error', noop, true);
    window.addEventListener('unhandledrejection', noop, true);
    window.addEventListener('rejectionhandled', noop, true);
    window.addEventListener('abort', noop, true);
  } catch (_) {}
  try {
    const origAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      if (type === 'error' || type === 'unhandledrejection' || type === 'rejectionhandled') return;
      return origAdd.call(this, type, listener, options);
    };
  } catch (_) {}
  try {
    const origRemove = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.removeEventListener = function (type, listener, options) {
      if (type === 'error' || type === 'unhandledrejection' || type === 'rejectionhandled') return;
      return origRemove.call(this, type, listener, options);
    };
  } catch (_) {}
  try {
    Object.defineProperty(window, 'Error', {
      value: undefined,
      configurable: false,
      writable: false,
    });
  } catch (_) {}
  try {
    window.alert = noop;
  } catch (_) {}
  try {
    window.confirm = noop;
  } catch (_) {}
  try {
    window.prompt = noop;
  } catch (_) {}
  try {
    window.print = noop;
  } catch (_) {}
  try {
    Object.getOwnPropertyNames(window).forEach((key) => {
      try {
        if (/^on(error|unhandledrejection|abort|rejectionhandled|loaderror)/i.test(key))
          window[key] = noop;
      } catch (_) {}
    });
  } catch (_) {}
  try {
    Object.freeze(window.console);
  } catch (_) {}
  try {
    Object.freeze(window);
  } catch (_) {}
}

(async () => {
  if (DEV) {
    console.warn('CHEAT IS OVER HERE');
  }

  const time = Date.now();
  try {
    const response = await fetch(
      'https://api.github.com/repos/Surplus-Softworks/Surplus-Releases/releases/latest'
    );
    const data = await response.json();
    let availableVersion = data.tag_name;

    if (VERSION !== availableVersion && time > EPOCH) {
      outerDocument.head.innerHTML = '';
      outerDocument.body.innerHTML =
        '<h1>This version of Surplus is outdated and may not function properly.<br>For safety & security please update to the new one!<br>Redirecting in 3 seconds...</h1>';
      setTimeout(() => {
        outer.location.assign('https://s.urpl.us/');
      }, 3000);
      await new Promise(() => {});
      ''();
    }
  } catch {}

  initStore();
  initialize();
})();
