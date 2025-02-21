import { getnative, reflect } from "./hook"
const { split, trim, includes } = String.prototype;
const toString = getnative(Function.prototype.toString);

export function crash() {
    return [...Array(2 ** 32 - 1)];
}

export function validate(func, native = false) {
    try {
        func in 0;
    } catch (e) {
        if (!reflect.apply(includes, e.stack, [reflect.apply(toString, func, [])])) crash();
        if (
            native &&
            !reflect.apply(includes, e.stack, ["[native code]"])
        ) crash();
    }
    try {
        reflect.apply(() => ""(), func, []);
    } catch (e) {
        const lines = reflect.apply(split, e.stack, ["\n"]);
        const trimmed = reflect.apply(trim, lines[1], []);
        if (reflect.apply(includes, trimmed, ["Proxy"])) crash();
    }

    return func;
}

validate(split, true);
validate(trim, true);
validate(includes, true);
validate(toString, true);