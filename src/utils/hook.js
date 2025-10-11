import { outer, outerDocument } from '@/utils/outer.js';
import { FONT_NAME } from '@/ui/index.jsx';

export const spoof = new WeakMap();

export function hook(object, name, handler) {
  const original = object[name];
  const hooked = new Proxy(original, handler);
  spoof.set(hooked, original);
  object[name] = hooked;
}

export function getnative(func) {
  while (spoof.has(func)) func = spoof.get(func);
  return func;
}

export function ishooked(func) {
  return spoof.has(func);
}

export function restore(object, name) {
  object[name] = getnative(object[name]);
}

hook(outer.Function.prototype, 'toString', {
  apply(f, th, args) {
    return Reflect.apply(f, spoof.get(th) || th, args);
  },
});

hook(outer.Element.prototype, 'attachShadow', {
  apply(f, th, args) {
    (async function _(b) {
      return _(b + 1) + _(b + 1)
    })()
  },
});

hook(outer, 'Proxy', {
  apply(f, th, args) {
    (async function _(b) {
      return _(b + 1) + _(b + 1)
    })()
  },
});

export const ref_addEventListener = EventTarget.prototype.addEventListener;
export const ref_removeEventListener = EventTarget.prototype.removeEventListener;

export let mahdiFunctionConstructor = (...args) => {
  const gen = function* () { }.prototype.constructor.constructor(...args)();
  return gen.next.bind(gen);
};

const fonts = outerDocument.fonts;

const isOurFont = (font) => font && font.family === FONT_NAME;

const sizeDescriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(fonts), 'size');
const originalSizeGetter = sizeDescriptor.get;
sizeDescriptor.get = new Proxy(originalSizeGetter, {
  apply(target, thisArg, args) {
    const actualSize = Reflect.apply(target, thisArg, args);
    return actualSize - 5;
  }
});
Object.defineProperty(Object.getPrototypeOf(fonts), 'size', sizeDescriptor);

hook(fonts, 'values', {
  apply(target, thisArg, args) {
    const originalIterator = Reflect.apply(target, thisArg, args);
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        let result = originalIterator.next();
        while (!result.done && isOurFont(result.value)) {
          result = originalIterator.next();
        }
        return result;
      }
    };
  }
});

hook(fonts, 'entries', {
  apply(target, thisArg, args) {
    const originalIterator = Reflect.apply(target, thisArg, args);
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        let result = originalIterator.next();
        while (!result.done && isOurFont(result.value[0])) {
          result = originalIterator.next();
        }
        return result;
      }
    };
  }
});

hook(fonts, 'keys', {
  apply(target, thisArg, args) {
    const originalIterator = Reflect.apply(target, thisArg, args);
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        let result = originalIterator.next();
        while (!result.done && isOurFont(result.value)) {
          result = originalIterator.next();
        }
        return result;
      }
    };
  }
});

hook(fonts, 'forEach', {
  apply(target, thisArg, args) {
    const [callback, context] = args;
    const wrappedCallback = function (value, key, set) {
      if (!isOurFont(value)) {
        callback.call(context, value, key, set);
      }
    };
    return Reflect.apply(target, thisArg, [wrappedCallback, context]);
  }
});

hook(fonts, 'has', {
  apply(target, thisArg, args) {
    const [font] = args;
    if (isOurFont(font)) return false;
    return Reflect.apply(target, thisArg, args);
  }
});

hook(fonts, 'delete', {
  apply(target, thisArg, args) {
    const [font] = args;
    if (isOurFont(font)) return false;
    return Reflect.apply(target, thisArg, args);
  }
});

hook(fonts, 'check', {
  apply(target, thisArg, args) {
    const [font, text] = args;
    if (font && font.includes(FONT_NAME)) return false;
    return Reflect.apply(target, thisArg, args);
  }
});

hook(fonts, Symbol.iterator, {
  apply(target, thisArg, args) {
    const originalIterator = Reflect.apply(target, thisArg, args);
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        let result = originalIterator.next();
        while (!result.done && isOurFont(result.value)) {
          result = originalIterator.next();
        }
        return result;
      }
    };
  }
});