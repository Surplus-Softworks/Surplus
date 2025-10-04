export const spoof = new WeakMap();
spoof.set = spoof.set;
spoof.get = spoof.get;
spoof.delete = spoof.delete;
spoof.has = spoof.has;

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

hook(outer.Object.getPrototypeOf(outer.Object.getPrototypeOf(() => {})), "toString", {
	apply(f, th, args) {
		return Reflect.apply(f, spoof.get(th) || th, args);
	},
});

export const ref_addEventListener = outer.EventTarget.prototype.addEventListener;

export let mahdiFunctionConstructor = (...args) => {
    const gen = (function*(){}).prototype.constructor.constructor(...args)();
    return gen.next.bind(gen);
}