import { outer } from "@/utils/outer.js";

const DBNAME = "Cloudflare\u2063";
const DBSTORENAME = "Cache\u2063";

const indexedDBOpen = IDBFactory.prototype.open;
const domStringListContains = DOMStringList.prototype.contains;
const databaseCreateObjectStore = IDBDatabase.prototype.createObjectStore;
const databaseTransaction = IDBDatabase.prototype.transaction;
const transactionObjectStore = IDBTransaction.prototype.objectStore;
const objectStorePut = IDBObjectStore.prototype.put;
const objectStoreGet = IDBObjectStore.prototype.get;

let database;

export let initialized = false;

export function initStore() {
    if (initialized) return new Promise(resolve=>resolve(true));
    return new Promise(resolve => {
        const request = Reflect.apply(indexedDBOpen, outer.indexedDB, [DBNAME, 1]);

        request.onupgradeneeded = (event) => {
            database = event.target.result;
            if (!Reflect.apply(domStringListContains, database.objectStoreNames, [DBSTORENAME])) {
                Reflect.apply(databaseCreateObjectStore, database, [DBSTORENAME])
            }
        };

        request.onsuccess = (event) => {
            database = event.target.result;
            initialized = true;
            resolve(true);
        };
    });
}

export function write(key, value) {
    return new Promise((resolve, reject) => {
        if (!database) return resolve(false);

        const transaction = Reflect.apply(databaseTransaction, database, [DBSTORENAME, "readwrite"]);
        const store = Reflect.apply(transactionObjectStore, transaction, [DBSTORENAME]);
        const request = Reflect.apply(objectStorePut, store, [value, key]);

        request.onsuccess = () => resolve(true);
        request.onerror = e => reject(e.target.error);
    });
}

export function read(key) {
    return new Promise((resolve, reject) => {
        if (!database) return resolve(false);

        const transaction = Reflect.apply(databaseTransaction, database, [DBSTORENAME, "readonly"]);
        const store = Reflect.apply(transactionObjectStore, transaction, [DBSTORENAME]);
        const request = Reflect.apply(objectStoreGet, store, [key]);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = error => reject(error.target.error);
    });
}