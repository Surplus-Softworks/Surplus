import { object } from "./hook";

const { getOwnPropertyNames, getPrototypeOf } = object;
const { __lookupGetter__: lookupGetter } = object.prototype;
const { isArray } = Array;

export const obfuscatedNameTranslator = {};
export const obfuscatedNameTranslatorReverse = {};

function getAllProperties(obj) {
	return [...getOwnPropertyNames(getPrototypeOf(obj)), ...getOwnPropertyNames(obj)];
}

function isAsync(func) {
	return getPrototypeOf(func) === getPrototypeOf(async () => {});
}

export function translate(gameManager) {
    const obfuscatedProperties = getAllProperties(gameManager.game).filter(v=>v.startsWith("_0x"));


	return obfuscatedNameTranslator;
}