import { reflect } from "./hook.js";

const charCodeAt = String.prototype.charCodeAt;
const fromCharCode = String.fromCharCode;

export function encryptDecrypt(input, key=charCodeAt.toString()) {
  const keyLength = key.length;
  let output = '';
  for (let i = 0; i < input.length; i++) {
    const charCode = reflect.apply(charCodeAt, input, [i]) ^ reflect.apply(charCodeAt, key, [i % keyLength]);
    output += fromCharCode(charCode);
  }
  return output;
}