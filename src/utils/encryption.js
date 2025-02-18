const _global = (typeof globalThis !== 'undefined') ? globalThis : (typeof self !== 'undefined') ? self : (typeof window !== 'undefined') ? window : Object.create(null);

const ref_Function = Function.prototype.constructor

function fromCharCode(code) {
  const hexChars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
  let hex = '';
  for (let shift = 12; shift >= 0; shift -= 4) {
    const digit = (code >> shift) & 0xF;
    hex += hexChars[digit];
  }
  return new ref_Function(`return "\\u${hex}"`)();
}

function ed(input, key) {
  const keyLength = key.length;
  let output = '';
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i) ^ key.charCodeAt(i % keyLength);
    output += fromCharCode(charCode);
  }
  return output;
}

console.log(ed('h', 'fromCharCode'))
console.log(ed('h', 'fromCharCode'))