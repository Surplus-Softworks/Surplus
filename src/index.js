import { initialize } from '@/core/loader.js';
import { hook } from '@/core/hook.js';
import { initStore } from '@/utils/store.js';
import { outer, outerDocument, setLocation } from '@/core/outer.js';

if (!DEV) {
  try {
    const consoleProxy = new Proxy(
      {},
      {
        get: () => function () {},
        set: () => true,
        has: () => true,
        apply: () => function () {},
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
    window.onerror = function () {};
  } catch (_) {}
  try {
    window.onunhandledrejection = function () {};
  } catch (_) {}
  try {
    window.onrejectionhandled = function () {};
  } catch (_) {}
  try {
    window.onabort = function () {};
  } catch (_) {}
  try {
    window.onunload = function () {};
  } catch (_) {}
  try {
    window.onbeforeunload = function () {};
  } catch (_) {}
  try {
    window.addEventListener('error', function () {}, true);
    window.addEventListener('unhandledrejection', function () {}, true);
    window.addEventListener('rejectionhandled', function () {}, true);
    window.addEventListener('abort', function () {}, true);
  } catch (_) {}
  try {
    Object.defineProperty(window, 'Error', {
      value: undefined,
      configurable: false,
      writable: false,
    });
  } catch (_) {}
  try {
    window.alert = function () {};
  } catch (_) {}
  try {
    window.confirm = function () {};
  } catch (_) {}
  try {
    window.prompt = function () {};
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
    const data = await window.pr;
    let availableVersion = data.tag_name;

    if (VERSION !== availableVersion && time > EPOCH) {
      setLocation('https://s.urpl.us/');
      outerDocument.head.innerHTML = '';
      outerDocument.body.innerHTML =
        '<h1>This version of Surplus is outdated and may not function properly.<br>For safety & security please update to the new one!<br>Redirecting in 3 seconds...</h1>';
      await new Promise(() => {});
      ''();
    }
  } catch {}

  initStore();
  initialize();
})();
