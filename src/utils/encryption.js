import { reflect } from "./hook";
import { validate } from "./security";

const charCodeAt = validate(String.prototype.charCodeAt, true);
const fromCharCode = validate(String.fromCharCode, true);

export function ed(input, key=charCodeAt.toString()) {
  const keyLength = key.length;
  let output = '';
  for (let i = 0; i < input.length; i++) {
    const charCode = reflect.apply(charCodeAt, input, [i]) ^ reflect.apply(charCodeAt, key, [i % keyLength]);
    output += fromCharCode(charCode);
  }
  return output;
}