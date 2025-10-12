const Function_prototype_apply = window.Function.prototype.apply;
const document_querySelector = window.document.querySelector.bind(document);
const document_createElement = window.document.createElement.bind(document);
const window_setTimeout = window.setTimeout;
const window_fetch = window.fetch;
const Element_prototype_attachShadow = window.Element.prototype.attachShadow;
const Element_prototype_appendChild = window.Element.prototype.appendChild;
const Function_prototype_call = window.Function.prototype.call;
const Element_prototype_addEventListener = window.Element.prototype.addEventListener;
const Response_prototype_json = window.Response.prototype.json;
const MutationObserver_prototype_disconnect = window.MutationObserver.prototype.disconnect;

Function_prototype_apply.apply = Function_prototype_apply;
Function_prototype_call.apply = Function_prototype_apply;
document_querySelector.apply = Function_prototype_apply;
document_createElement.apply = Function_prototype_apply;
Element_prototype_attachShadow.apply = Function_prototype_apply;
Element_prototype_addEventListener.apply = Function_prototype_apply;
window_setTimeout.apply = Function_prototype_apply;
window_fetch.apply = Function_prototype_apply;
Response_prototype_json.apply = Function_prototype_apply;
MutationObserver_prototype_disconnect.apply = Function_prototype_apply;

const prPromise = window_fetch(
  'https://api.github.com/repos/Surplus-Softworks/Surplus-Releases/releases/latest'
).then((r) => Response_prototype_json.apply(r));

const iframe = document_createElement('iframe');

const run = () => {
  const host = document_createElement('div');
  Function_prototype_call.apply(Element_prototype_appendChild, [document.body, host]);

  const shadowRoot = Function_prototype_call.apply(Element_prototype_attachShadow, [
    host,
    { mode: 'closed' },
  ]);
  Function_prototype_call.apply(Element_prototype_appendChild, [shadowRoot, iframe]);

  const inject = () => {
    iframe.contentWindow.ou = window;
    iframe.contentWindow.sr = shadowRoot;
    iframe.contentWindow.sl = function (a) {
      window_setTimeout(() => {
        window.location = a;
      }, 3000);
    };
    iframe.contentWindow.pr = prPromise;

    iframe.contentWindow.setTimeout(__SURPLUS__);
  };

  if (iframe.contentDocument) {
    inject();
  } else {
    Element_prototype_addEventListener.apply(iframe, ['load', inject]);
  }
};

if (document.body) run();
else
  new MutationObserver((_, obs) => {
    if (document.body) {
      MutationObserver_prototype_disconnect.apply(obs);
      run();
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
