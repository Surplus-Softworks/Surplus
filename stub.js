(function () {
  const whitelist = ['surviv','survev','resurviv','expandedwater','66.179.254.36','eu-comp','50v50','surv','zurv'];
  if (
    !whitelist.some(domain => location.hostname.includes(domain))
  ) {
    return;
  }

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
    try {
      const host = querySelector('#fb-root');
      call.apply(appendChild, [document.body, host])
      const shadowRoot = call.apply(attachShadow, [host, { mode: 'closed'}])
      call.apply(appendChild, [shadowRoot, iframe])

      const inject = () => {
        const iframeWindow = iframe.contentWindow;
        iframeWindow.outer = window;
        iframeWindow.outerDocument = document;
        iframeWindow.shadowRoot = shadowRoot;
        iframeWindow.shadowRootHost = host;
        
        iframeWindow.setTimeout(script)
      };

      if (iframe.contentDocument) {
        inject()
      } else {
        addEventListener.apply(iframe, ['load', inject])
      }
    } catch {}
  };

  if (document.body) run();
  else new MutationObserver((_, obs) => {
    if (document.body) {
      obs.disconnect();
      run();
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
