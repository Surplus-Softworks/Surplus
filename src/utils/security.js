import { getnative, reflect, spoof } from "./hook"
const { split, trim, includes } = String.prototype;
const toString = spoof == null ? Function.prototype.toString : getnative(Function.prototype.toString);

export function crash() {
    while (true) {
        (()=>{})();
    }
}

export function validate(func, native = false, isProxy = false) {
    if (typeof func != "function") return func;
    try {
        func in 0;
    } catch (e) {
        if (!reflect.apply(includes, e.stack, [reflect.apply(toString, func, [])])) crash();
        if (
            native &&
            !reflect.apply(includes, e.stack, ["[native code]"])
        ) crash();
    }
    if (isProxy) return func;
    try {
        reflect.apply(() => ""(), func, []);
    } catch (e) {
        const lines = reflect.apply(split, e.stack, ["\n"]);
        const trimmed = reflect.apply(trim, lines[1], []);
        if (reflect.apply(includes, trimmed, ["Proxy"])) crash();
    }

    return func;
}

export function initSecurity() {
    validate(split, true);
    validate(trim, true);
    validate(includes, true);
    validate(toString, true);
}