const _global = (typeof globalThis !== 'undefined') ? globalThis : (typeof self !== 'undefined') ? self : (typeof window !== 'undefined') ? window : Object.create(null);
const ref_TextEncoder = _global.TextEncoder;
const ref_TextDecoder = _global.TextDecoder;
const ref_Uint8Array = _global.Uint8Array;
const ref_ArrayBuffer = _global.ArrayBuffer;
const ref_DataView = _global.DataView;
const ref_Number = _global.Number;
const ref_Object = _global.Object;

const key = Object.freeze([
  128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 2147483647, 42,
  1337, 9001, 314159, 271828, 161803, 123456, 789012, 345678, 987654, 111111,
  222222, 333333, 444444, 555555, 666666, 777777, 888888, 999999
]);

const ref_Length = key.length;

function encode(inputString) {
  return (function() {
    return (function() {
      const data = (function(){return new ref_TextEncoder()})().encode(inputString);
      return (function() {
        const len = data.length;
        let k = 0;
        for (let i = 0; i < len; i++) {
          (function() {
            if (!ref_Object.prototype.hasOwnProperty.call(key, k) || typeof key[k] !== 'number' || !ref_Number.isInteger(key[k])) return;
            data[i] ^= key[k];
            k = (k + 1) % ref_Length;
          })();
        }
        return (function() {
          const b = new (function(){return new ref_ArrayBuffer(len * 2)})();
          return (function() {
            const v = new (function(){return new ref_DataView(b)})();
            return (function() {
              let s = 128;
              for (let i = 0; i < len; i++) {
                (function() {
                  let val = data[i];
                  val = (val << 2) | (val >> 6);
                  val = ~val & 0xff;
                  val = (val + s) % 256;
                  s = (s * 7 + 13) % 31;
                  v.setUint8(i * 2, val);
                  v.setUint8(i * 2 + 1, (val ^ 0x5a) & 0xff);
                })();
              }
              return b;
            })();
          })();
        })();
      })();
    })();
  })();
}

function decode(inputBuffer) {
  return (function() {
    const v = (function(){return new ref_DataView(inputBuffer)})();
    return (function() {
      const bl = inputBuffer.byteLength;
      return (function() {
        const dl = bl / 2;
        return (function() {
          const d = new (function(){return new ref_Uint8Array(dl)})();
          return (function() {
            let s = 128;
            for (let i = 0; i < dl; i++) {
              (function() {
                let val = v.getUint8(i * 2);
                val = (val - s + 256) % 256;
                s = (s * 7 + 13) % 31;
                val = ~val & 0xff;
                val = (val >> 2) | (val << 6);
                d[i] = val;
              })();
            }
            return (function() {
              let k = 0;
              for (let i = 0; i < dl; i++) {
                (function() {
                  if (!ref_Object.prototype.hasOwnProperty.call(key, k) || typeof key[k] !== 'number' || !ref_Number.isInteger(key[k])) return;
                  d[i] ^= key[k];
                  k = (k + 1) % ref_Length;
                })();
              }
              return (function() {
                const decoder = (function(){return new ref_TextDecoder()})();
                return decoder.decode(d);
              })();
            })();
          })();
        })();
      })();
    })();
  })();
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
