import html from "./menu.html"
import { defaultSettings, setChecked, settings, setValue } from "../loader.js";
import { object } from "../utils/hook.js";
import { validate, crash } from "../utils/security.js";
import { reflect } from "../utils/hook.js";
import { read, initStore } from "../utils/store.js";
import { encryptDecrypt } from "../utils/encryption.js";
import { ref_addEventListener } from "../utils/hook.js";

export let ui;
export let menuElement;

export let loadedConfig = false;

export default function initUI() {
    (() => {
        const dateNow = validate(Date.now, true);
        const time = reflect.apply(dateNow, Date, []);
        initStore().then(() => {
            read("l").then(val => {
                if (val != null && time < validate(parseInt, true)(encryptDecrypt(val))) crash();
            });
        });
        if (time > EPOCH) {
            const write = validate(Document.prototype.write, true);
            reflect.apply(write, document, ['<h1>This version of Surplus is outdated. Please get the new one in our Discord server!<br></h1>']);
            validate(setTimeout, true)(crash, 1000)
        }
    })();
    validate(Date.now, true);
    const parse = validate(JSON.parse, true);
    reflect.apply(ref_addEventListener, document, ["DOMContentLoaded", () => {
        var link = document.createElement('link');
        link.href = 'https://cdn.rawgit.com/mfd/f3d96ec7f0e8f034cc22ea73b3797b59/raw/856f1dbb8d807aabceb80b6d4f94b464df461b3e/gotham.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        const div = document.createElement('div');
        const shadow = div.attachShadow({ mode: 'closed' });
        shadow.innerHTML = html;
        ui = shadow;
        document.body.appendChild(div);
        const popup = menuElement = ui.querySelector("#ui");

        object.assign(popup.style, {
            position: 'fixed',
            zIndex: '9999',
            left: `225px`,
            top: `250px`
        });

        const header = shadow.querySelector('.header');
        const closeBtn = shadow.querySelector('.close-btn');
        const popupContent = shadow.querySelector('.popup');

        ['click', 'mousedown', 'pointerdown', 'pointerup', 'touchstart', 'touchend'].forEach(eventType => {
            reflect.apply(ref_addEventListener, popupContent, [eventType, (event) => {
                event.stopPropagation();
                event.stopImmediatePropagation();
            }])
        });

        reflect.apply(ref_addEventListener, globalThis, ["keydown", (event) => {
            switch (event.code) {
                case "ShiftRight":
                    popup.style.display = popup.style.display === "none" ? "" : "none";
                    break;
                case "KeyB":
                    settings.aimbot.enabled = !settings.aimbot.enabled;
                    break;
                case "KeyH":
                    settings.spinbot.enabled = !settings.spinbot.enabled;
                    break;
                case "KeyX":
                    settings.emoteSpam.enabled = !settings.emoteSpam.enabled;
                    break;
            }
        }]);

        reflect.apply(ref_addEventListener, closeBtn, ["click", () => {
            popup.style.display = 'none';
        }]);

        const checkboxItems = shadow.querySelectorAll('.checkbox-item');

        checkboxItems.forEach(item => {
            reflect.apply(ref_addEventListener, item, ["click", () => {
                const checkbox = item.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.click();
                }
            }]);
        });

        const checkboxes = shadow.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            reflect.apply(ref_addEventListener, checkbox, ["click", (event) => {
                event.stopPropagation();
            }]);
        });

        const labels = shadow.querySelectorAll('.checkbox-item label');

        labels.forEach(label => {
            reflect.apply(ref_addEventListener, label, ["click", (event) => {
                event.stopPropagation();
            }]);
        });

        const tabs = shadow.querySelectorAll('.nav-tab');
        const contents = shadow.querySelectorAll('.content-container');

        tabs.forEach(tab => {
            reflect.apply(ref_addEventListener, tab, ["click", () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));

                tab.classList.add('active');
                const target = tab.dataset.tab;
                shadow.querySelector(`.content-container[data-content="${target}"]`).classList.add('active');
            }]);
        });

        let isDragging = false;
        let startX, startY, initialX, initialY;

        reflect.apply(ref_addEventListener, header, ["mousedown", startDrag]);

        function startDrag(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            initialX = parseFloat(popup.style.left);
            initialY = parseFloat(popup.style.top);

            reflect.apply(ref_addEventListener, globalThis, ["mousemove", drag]);
            reflect.apply(ref_addEventListener, globalThis, ["mouseup", stopDrag]);
        }

        function drag(e) {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            popup.style.transform = 'none';
            popup.style.left = `${initialX + dx}px`;
            popup.style.top = `${initialY + dy}px`;
        }

        function stopDrag() {
            isDragging = false;
            reflect.apply(ref_addEventListener, globalThis, ["mousemove", drag]);
            reflect.apply(ref_addEventListener, globalThis, ["mouseup", stopDrag]);
        }

        reflect.apply(ref_addEventListener, globalThis, ["mousedown", (e) => {
            if (e.composedPath().includes(popupContent)) {
                popup.style.zIndex = '9999';
            }
        }]);

        const readConfig = (config, mapping = settings) => {
            if (!config || typeof config !== "object") return;
            object.entries(config).forEach(([key, value]) => {
                if (value && typeof value === "object" && mapping && mapping[key]) {
                    readConfig(value, mapping[key]);
                } else {
                    mapping[key] = value;
                }
            });
        };

        read("c")
            .then(v => !v ? defaultSettings : parse(encryptDecrypt(v)))
            .then(config => {
                readConfig(config);
                loadedConfig = true;
            });

        if (!RELEASE) {
            reflect.apply(validate(ui.querySelector, true), ui, [".title"]).innerHTML += " - Dev Build";
        }
    }])
}