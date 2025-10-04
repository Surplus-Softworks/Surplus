const isInIframe = typeof window !== 'undefined' && window.parent !== window && window.outer;
export const outer = isInIframe ? window.outer : (typeof window !== 'undefined' ? window : globalThis);
export const outerDocument = isInIframe ? window.outerDocument : (typeof document !== 'undefined' ? document : outer.document);
export const outerInnerWidth = () => outer.innerWidth;
export const outerInnerHeight = () => outer.innerHeight;
export const outerRequestAnimationFrame = outer.requestAnimationFrame?.bind(outer);
