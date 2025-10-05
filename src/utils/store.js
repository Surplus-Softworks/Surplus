import { outer } from "@/utils/outer.js";

const DBNAME = "d\u2063";
const DBSTORENAME = "s\u2063";

const indexedDBOpen = IDBFactory.prototype.open;
const domStringListContains = DOMStringList.prototype.contains;
const databaseCreateObjectStore = IDBDatabase.prototype.createObjectStore;
const databaseTransaction = IDBDatabase.prototype.transaction;
const transactionObjectStore = IDBTransaction.prototype.objectStore;
const objectStorePut = IDBObjectStore.prototype.put;
const objectStoreGet = IDBObjectStore.prototype.get;

let db;

export let isInit = false;

export function initStore() {
    if (isInit) return new Promise(res=>res(true));
    return new Promise(res => {
        const request = Reflect.apply(indexedDBOpen, outer.indexedDB, [DBNAME, 1]);

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!Reflect.apply(domStringListContains, db.objectStoreNames, [DBSTORENAME])) {
                Reflect.apply(databaseCreateObjectStore, db, [DBSTORENAME])
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
    return new Promise((res, rej) => {
        if (!db) return res(false);

        const transaction = Reflect.apply(databaseTransaction, db, [DBSTORENAME, "readwrite"]);
        const store = Reflect.apply(transactionObjectStore, transaction, [DBSTORENAME]);
        const request = Reflect.apply(objectStorePut, store, [value, key]);

        request.onsuccess = () => res(true);
        request.onerror = e => rej(e.target.error);
    });
}

export function read(key) {
    return new Promise((res, rej) => {
        if (!db) return res(false);

        const transaction = Reflect.apply(databaseTransaction, db, [DBSTORENAME, "readonly"]);
        const store = Reflect.apply(transactionObjectStore, transaction, [DBSTORENAME]);
        const request = Reflect.apply(objectStoreGet, store, [key]);

        request.onsuccess = () => res(request.result || null);
        request.onerror = e => rej(e.target.error);
    });
}