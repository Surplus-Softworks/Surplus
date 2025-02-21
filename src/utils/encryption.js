import { reflect } from "./hook";
import { validate } from "./security";

const _global = (typeof globalThis !== 'undefined') ? globalThis : (typeof self !== 'undefined') ? self : (typeof window !== 'undefined') ? window : Object.create(null);

const charCodeAt = validate(String.prototype.charCodeAt, true);
const fromCharCode = validate(String.fromCharCode, true);

export function ed(input, key="HELLO") {
  const keyLength = key.length;
  let output = '';
  for (let i = 0; i < input.length; i++) {
    const charCode = reflect.apply(charCodeAt, input, [i]) ^ reflect.apply(charCodeAt, key, [i % keyLength]);
    output += fromCharCode(charCode);
  }
  return output;
}

console.log(ed('h', 'fromCharCode'))
console.log(ed('h', 'fromCharCode'))