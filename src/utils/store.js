import { outerDocument } from '@/core/outer.js';

const COOKIE_KEY = '__cf_ray';
const COOKIE_PATH = '/';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 72; // 3 days

export let initialized = false;

export function initStore() {
  initialized = true;
  return true;
}

function buildCookieString(value) {
  return `${COOKIE_KEY}=${value}; path=${COOKIE_PATH}; max-age=${COOKIE_MAX_AGE_SECONDS}`;
}

const encodeToHex = (value) => {
  let hex = '';
  for (let i = 0; i < value.length; i++) {
    hex += value.charCodeAt(i).toString(16).padStart(4, '0');
  }
  return hex;
};

const decodeFromHex = (value) => {
  if (typeof value !== 'string' || value.length % 4 !== 0) {
    return null;
  }

  let decoded = '';
  for (let i = 0; i < value.length; i += 4) {
    const chunk = value.slice(i, i + 4);
    const code = Number.parseInt(chunk, 16);
    if (Number.isNaN(code)) {
      return null;
    }
    decoded += String.fromCharCode(code);
  }

  return decoded;
};

const readCookieValue = () => {
  const cookieSource = outerDocument.cookie;
  if (!cookieSource) return null;

  const prefix = `${COOKIE_KEY}=`;
  const cookies = cookieSource.split(';');
  for (const raw of cookies) {
    const entry = raw.trim();
    if (entry.startsWith(prefix)) {
      return entry.slice(prefix.length);
    }
  }
  return null;
};

export function write(value) {
  initStore();

  const source = typeof value === 'string' ? value : String(value ?? '');
  const storedValue = encodeToHex(source);
  outerDocument.cookie = buildCookieString(storedValue);
  return true;
}

export function read() {
  initStore();
  const encoded = readCookieValue();
  return encoded ? decodeFromHex(encoded) : null;
}
