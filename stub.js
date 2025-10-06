(function () {
  const querySelector = document.querySelector.bind(document);
  const createElement = document.createElement.bind(document);
  const attachShadow = Element.prototype.attachShadow;
  const appendChild = Element.prototype.appendChild;
  const call = Function.prototype.call;
  const addEventListener = Element.prototype.addEventListener;

  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;border:0;opacity:0;pointer-events:none;display:none';
  const script = __SURPLUS__;

  const run = () => {
    const host = createElement('div');
    call.apply(appendChild, [document.body, host])
    
    const shadowRoot = call.apply(attachShadow, [host, { mode: 'closed'}])
    call.apply(appendChild, [shadowRoot, iframe])

    const inject = () => {
      iframe.contentWindow.outer = window;
      iframe.contentWindow.outerDocument = document;
      iframe.contentWindow.shadowRoot = shadowRoot;
      iframe.contentWindow.shadowRootHost = host;
      
      iframe.contentWindow.setTimeout(script)
    };

    if (iframe.contentDocument) {
      inject()
    } else {
      addEventListener.apply(iframe, ['load', inject])
    }
  };

  if (document.body) run();
  else new MutationObserver((_, obs) => {
    if (document.body) {
      obs.disconnect();
      run();
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
