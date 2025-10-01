import { reflect } from "@/utils/hook.js";

const DBNAME = "d\u2063";
const DBSTORENAME = "s\u2063";

// METHODS //
const promise = Promise;
const indexedDBOpen = IDBFactory.prototype.open;
const domStringListContains = DOMStringList.prototype.contains;
const databaseCreateObjectStore = IDBDatabase.prototype.createObjectStore;
const databaseTransaction = IDBDatabase.prototype.transaction;
const transactionObjectStore = IDBTransaction.prototype.objectStore;
const objectStorePut = IDBObjectStore.prototype.put;
const objectStoreGet = IDBObjectStore.prototype.get;
// ####### //

let db;

export let isInit = false;

export function initStore() {
    if (isInit) return new promise(res=>res(true));
    return new promise(res => {
        const request = reflect.apply(indexedDBOpen, indexedDB, [DBNAME, 1]);

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!reflect.apply(domStringListContains, db.objectStoreNames, [DBSTORENAME])) {
                reflect.apply(databaseCreateObjectStore, db, [DBSTORENAME])
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            isInit = true;
            res(true);
        };
    });
}

export function write(key, value) {
    return new promise((res, rej) => {
        if (!db) return res(false);

        const transaction = reflect.apply(databaseTransaction, db, [DBSTORENAME, "readwrite"]);
        const store = reflect.apply(transactionObjectStore, transaction, [DBSTORENAME]);
        const request = reflect.apply(objectStorePut, store, [value, key]);

        request.onsuccess = () => res(true);
        request.onerror = e => rej(e.target.error);
    });
}

export function read(key) {
    return new promise((res, rej) => {
        if (!db) return res(false);

        const transaction = reflect.apply(databaseTransaction, db, [DBSTORENAME, "readonly"]);
        const store = reflect.apply(transactionObjectStore, transaction, [DBSTORENAME]);
        const request = reflect.apply(objectStoreGet, store, [key]);

        request.onsuccess = () => res(request.result || null);
        request.onerror = e => rej(e.target.error);
    });
}