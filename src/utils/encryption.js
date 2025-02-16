const _global = (1, eval)('this');  
const _ref_TextEncoder = _global.TextEncoder;
const _ref_TextDecoder = _global.TextDecoder;
const _ref_Uint8Array  = _global.Uint8Array;
const _ref_ArrayBuffer = _global.ArrayBuffer;
const _ref_DataView    = _global.DataView;
const _ref_String      = _global.String;

const object = {};
for (const prop of Object.getOwnPropertyNames(Object)) {
  object[prop] = Object[prop];
}

const ref_TextEncoder = {};
for (const prop of object.getOwnPropertyNames(ref_TextEncoder)) {
  _ref_TextEncoder[prop] = ref_TextEncoder[prop];
}

const ref_TextDecoder = {};
for (const prop of object.getOwnPropertyNames(ref_TextDecoder)) {
  _ref_TextDecoder[prop] = ref_TextDecoder[prop];
}

const ref_Uint8Array = {};
for (const prop of object.getOwnPropertyNames(ref_Uint8Array)) {
  _ref_Uint8Array[prop] = ref_Uint8Array[prop];
}

const ref_ArrayBuffer = {};
for (const prop of object.getOwnPropertyNames(ref_ArrayBuffer)) {
  _ref_ArrayBuffer[prop] = ref_ArrayBuffer[prop];
}

const ref_DataView = {};
for (const prop of object.getOwnPropertyNames(ref_DataView)) {
  _ref_DataView[prop] = ref_DataView[prop];
}

const ref_String = {};
for (const prop of object.getOwnPropertyNames(ref_String)) {
  _ref_String[prop] = ref_String[prop];
}

const ref_CharCodeAt  = Function.prototype.call.bind(_ref_String.charCodeAt);
const ref_Length      = "getPrototypeOf".length;

function encode(inputString) {
  const encoder = new ref_TextEncoder();
  const data = encoder.encode(inputString);
  const len = data.length;
  let k = 0;
  for (let i = 0; i < len; i++) {
    data[i] ^= ref_CharCodeAt("getPrototypeOf", k);
    k = (k + 1) % ref_Length;
  }
  const b = new ref_ArrayBuffer(len * 2);
  const v = new ref_DataView(b);
  let s = 128;
  for (let i = 0; i < len; i++) {
    let val = data[i];
    val = (val << 2) | (val >> 6);
    val = ~val & 0xff;
    val = (val + s) % 256;
    s = (s * 7 + 13) % 31;
    v.setUint8(i * 2, val);
    v.setUint8(i * 2 + 1, (val ^ 0x5a) & 0xff);
  }
  return b;
}

function decode(inputBuffer) {
  const v = new ref_DataView(inputBuffer);
  const bl = inputBuffer.byteLength;
  const dl = bl / 2;
  const d = new ref_Uint8Array(dl);
  let s = 128;
  for (let i = 0; i < dl; i++) {
    let val = v.getUint8(i * 2);
    val = (val - s + 256) % 256;
    s = (s * 7 + 13) % 31;
    val = ~val & 0xff;
    val = (val >> 2) | (val << 6);
    d[i] = val;
  }
  let k = 0;
  for (let i = 0; i < dl; i++) {
    d[i] ^= ref_CharCodeAt("getPrototypeOf", k);
    k = (k + 1) % ref_Length;
  }
  const decoder = new ref_TextDecoder();
  return decoder.decode(d);
}

const originalString = "This is a secret message!";
const encodedBuffer = encode(originalString);
const decodedString = decode(encodedBuffer);
console.log("Original:", originalString);
console.log("Encoded:", encodedBuffer);
console.log("Decoded:", decodedString);
console.assert(
  originalString === decodedString,
  "Encoding and decoding failed!"
);