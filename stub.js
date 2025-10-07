const querySelector = document.querySelector.bind(document);
const createElement = document.createElement.bind(document);
const attachShadow = Element.prototype.attachShadow;
const appendChild = Element.prototype.appendChild;
const call = Function.prototype.call;
const addEventListener = Element.prototype.addEventListener;

const iframe = document.createElement('iframe');

const run = () => {
  const host = createElement('div');
  call.apply(appendChild, [document.body, host]);

  const shadowRoot = call.apply(attachShadow, [host, { mode: 'closed' }]);
  call.apply(appendChild, [shadowRoot, iframe]);

  const inject = () => {
    iframe.contentWindow.ou = window;
    iframe.contentWindow.sr = shadowRoot;

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
