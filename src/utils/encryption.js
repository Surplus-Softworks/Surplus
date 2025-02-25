import { reflect } from "./hook.js";
import { validate } from "./security.js";

const charCodeAt = validate(String.prototype.charCodeAt, true);
const fromCharCode = validate(String.fromCharCode, true);

export function encryptDecrypt(input, key=charCodeAt.toString()) {
  const keyLength = key.length;
  let output = '';
  for (let i = 0; i < input.length; i++) {
    const charCode = reflect.apply(charCodeAt, input, [i]) ^ reflect.apply(charCodeAt, key, [i % keyLength]);
    output += fromCharCode(charCode);
  }
  return output;
}