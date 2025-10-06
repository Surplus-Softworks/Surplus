import { outer, shadowRootHost } from "@/utils/outer.js";

export const spoof = new WeakMap();
spoof.set = spoof.set;
spoof.get = spoof.get;
spoof.delete = spoof.delete;
spoof.has = spoof.has;

const spoofedNodes = new WeakMap();
spoofedNodes.set = spoofedNodes.set;
spoofedNodes.get = spoofedNodes.get;
spoofedNodes.delete = spoofedNodes.delete;
spoofedNodes.has = spoofedNodes.has;

export function hook(object, name, handler) {
	const original = object[name];
	const hooked = new Proxy(original, handler);
	spoof.set(hooked, original);
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

hook(outer.Function.prototype, "toString", {
	apply(f, th, args) {
		return Reflect.apply(f, spoof.get(th) || th, args);
	},
});

hook(outer.Element.prototype, "attachShadow", {
	apply(f, th, args) {
		return Reflect.apply(f, spoofedNodes.get(th) || th, args);
	},
});
const shadowRootProxy = new Proxy(Object.getOwnPropertyDescriptor(outer.Element.prototype, "shadowRoot").get, {
	apply(f, th, args) {
		return Reflect.apply(f, spoofedNodes.get(th) || th, args);
	},
});
spoof.set(shadowRootProxy, Object.getOwnPropertyDescriptor(outer.Element.prototype, "shadowRoot").get);
Object.defineProperty(outer.Element.prototype, "shadowRoot", {
	get: shadowRootProxy,
});

hook(outer.Element.prototype, "attachShadow", {
    apply(f, th, args) {
		while (true){try{""()}catch{}}
    }
});

export const ref_addEventListener = EventTarget.prototype.addEventListener;

export let mahdiFunctionConstructor = (...args) => {
    const gen = (function*(){}).prototype.constructor.constructor(...args)();
    return gen.next.bind(gen);
}