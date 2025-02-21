import { reflect } from "./hook";
import { validate } from "./security";

// METHODS //
const promise = validate(Promise, true);
const indexedDBOpen = validate(IDBFactory.prototype.open, true);
const domStringListContains = validate(DOMStringList.prototype.contains, true);
const databaseCreateObjectStore = validate(IDBDatabase.prototype.createObjectStore, true);
const databaseTransaction = validate(IDBDatabase.prototype.transaction, true);
const transactionObjectStore = validate(IDBTransaction.prototype.objectStore, true);
const objectStorePut = validate(IDBObjectStore.prototype.put, true);
const objectStoreGet = validate(IDBObjectStore.prototype.get, true);
// ####### //
let db;

export default function initStore() {
    return new promise(res => {
        const request = reflect.apply(indexedDBOpen, indexedDB, ["SurplusSettings\u2063", 1]);

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!reflect.apply(domStringListContains, db.objectStoreNames, ["Data"])) {
                reflect.apply(databaseCreateObjectStore, db, ["Data"])
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            res(true);
        };
    });
}

export function write(key, value) {
    return new promise((res, rej) => {
        if (!db) return res(false);

        const transaction = reflect.apply(databaseTransaction, db, ["Data", "readwrite"]);
        const store = reflect.apply(transactionObjectStore, transaction, ["Data"]);
        const request = reflect.apply(objectStorePut, store, [value, key]);

        request.onsuccess = () => res(true);
        request.onerror = e => rej(e.target.error);
    });
}

export function read(key) {
    return new promise((res, rej) => {
        if (!db) return res(false);

        const transaction = reflect.apply(databaseTransaction, db, ["Data", "readonly"]);
        const store = reflect.apply(transactionObjectStore, transaction, ["Data"]);
        const request = reflect.apply(objectStoreGet, store, [key]);

        request.onsuccess = () => res(request.result || null);
        request.onerror = e => rej(e.target.error);
    });
}