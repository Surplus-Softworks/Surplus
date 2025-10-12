const charCodeAt = String.prototype.charCodeAt;
const fromCharCode = String.fromCharCode;

export function encryptDecrypt(input, key = charCodeAt.toString()) {
  const keyLength = key.length;
  let output = '';
  for (let i = 0; i < input.length; i++) {
    const charCode =
      Reflect.apply(charCodeAt, input, [i]) ^ Reflect.apply(charCodeAt, key, [i % keyLength]);
    output += fromCharCode(charCode);
  }
  return output;
}
