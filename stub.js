(function() {
  const whitelist = [
    'surviv',
    'survev',
    'resurviv',
    'expandedwater',
    '66.179.254.36',
    'eu-comp',
    '50v50',
    'surv',
    'zurv',
  ];

  if (!whitelist.some(domain => globalThis.location.hostname.includes(domain))) {
    return;
  }

  function whenBodyReady(fn) {
    if (document.body) {
      try { fn(); } catch (e) { console.error(e); }
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      if (document.body) {
        obs.disconnect();
        try { fn(); } catch (e) { console.error(e); }
      }
    });

    observer.observe(document.documentElement, { childList: true });

    const onDOMContent = () => {
      if (document.body) {
        try { fn(); } catch (e) { console.error(e); }
      }
      document.removeEventListener('DOMContentLoaded', onDOMContent);
    };
    document.addEventListener('DOMContentLoaded', onDOMContent);

    setTimeout(() => {
      if (document.body) {
        try { fn(); } catch (e) { console.error(e); }
      }
      observer.disconnect();
      document.removeEventListener('DOMContentLoaded', onDOMContent);
    }, 2500);
  }

  let injected = false;

  whenBodyReady(() => {
    try {
      if (injected) {
        return;
      }

      injected = true;

      const container = document.createElement('div');

      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '0';
      container.style.height = '0';
      container.style.overflow = 'hidden';
      container.style.pointerEvents = 'none';
      container.style.opacity = '0';

      const shadow = container.attachShadow({ mode: 'closed' });

      document.body.appendChild(container);

      const iframe = document.createElement('iframe');

      iframe.style.display = 'none';
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';

      shadow.appendChild(iframe);

      const iframeWin = iframe.contentWindow;
      const iframeDoc = iframe.contentDocument || (iframeWin && iframeWin.document);

      if (!iframeWin || !iframeDoc) {
        setTimeout(() => {
          const iw = iframe.contentWindow;
          const id = iframe.contentDocument || (iw && iw.document);
          if (id) {
            injectIntoIframe(iw, id);
          }
        }, 50);
      } else {
        injectIntoIframe(iframeWin, iframeDoc);
      }

      function injectIntoIframe(ifWin, ifDoc) {
        try {
          ifWin.outer = window;
          ifWin.outerDocument = document;

          const script = ifDoc.createElement('script');
          script.type = 'text/javascript';
          script.textContent = __GENERATED_CODE__;
          const parent = ifDoc.head || ifDoc.documentElement || ifDoc.body || ifDoc;
          parent.appendChild(script);
        } catch (err) {
          console.error(err);
        }
      }
    } catch (err) {
      console.error(err);
    }
  });
})();
