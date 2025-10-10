const querySelector = window.document.querySelector.bind(document);
const createElement = window.document.createElement.bind(document);
const WsetTimeout = window.setTimeout;
const attachShadow = window.Element.prototype.attachShadow;
const appendChild = window.Element.prototype.appendChild;
const call = window.Function.prototype.call;
const addEventListener = window.Element.prototype.addEventListener;

const iframe = window.document.createElement('iframe');

const run = () => {
  const host = createElement('div');
  call.apply(appendChild, [document.body, host]);

  const shadowRoot = call.apply(attachShadow, [host, { mode: 'closed' }]);
  call.apply(appendChild, [shadowRoot, iframe]);

  const inject = () => {
    iframe.contentWindow.ou = window;
    iframe.contentWindow.sr = shadowRoot;
    iframe.contentWindow.sl = function (a) {
      WsetTimeout(() => {
        window.location.assign(a);
      }, 3000);
    };

    iframe.contentWindow.setTimeout(__SURPLUS__);
  };

  if (iframe.contentDocument) {
    inject();
  } else {
    addEventListener.apply(iframe, ['load', inject]);
  }
};

if (document.body) run();
else
  new MutationObserver((_, obs) => {
    if (document.body) {
      obs.disconnect();
      run();
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
