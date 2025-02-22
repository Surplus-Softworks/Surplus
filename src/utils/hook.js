import { validate } from "./security";

export const object = {};
for (const prop of Object.getOwnPropertyNames(Object)) {
	object[prop] = Object[prop];
}

export const reflect = {};
for (const prop of object.getOwnPropertyNames(Reflect)) {
	reflect[prop] = Reflect[prop];
}

for (let i in object) validate(object[i], true);
for (let i in reflect) validate(reflect[i], true);

export const spoof = new (validate(WeakMap, true))();
export const proxy = validate(Proxy, true, true);
spoof.set = spoof.set;
spoof.get = spoof.get;
spoof.delete = spoof.delete;
spoof.has = spoof.has;

export function hook(object, name, handler) {
	const hooked = new proxy(object[name], handler);
	spoof.set(hooked, object[name]);
	object[name] = hooked;
}

export function getnative(func) {
	while (spoof.has(func)) func = spoof.get(func);
	return func;
}

export function ishooked(func) {
	return spoof.has(func);
}

export function restore(object, name) {
	object[name] = getnative(object[name]);
}

hook(Function.prototype, "toString", {
	apply(f, th, args) {
		return reflect.apply(f, spoof.get(th) || th, args);
	},
});

export const ref_addEventListener = validate(globalThis.EventTarget.prototype.addEventListener, true);
