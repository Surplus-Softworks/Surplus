import html from "./menu.html"
import { defaultSettings, setChecked } from "../loader.js";
import { object } from "../utils/hook";

export let ui;
export let menuElement;

export default function initUI() {
    document.addEventListener('DOMContentLoaded', ()=>{
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
            popupContent.addEventListener(eventType, (event) => {
                event.stopPropagation();
                event.stopImmediatePropagation();
            });
        });

        window.addEventListener("keydown", (event) => {
            if (event.key === "Shift" && event.code === "ShiftRight") {
                popup.style.display = popup.style.display === "none" ? "" : "none";
            }
        });              

        closeBtn.addEventListener('click', () => {
          popup.style.display = 'none';
        });
      
        const checkboxItems = shadow.querySelectorAll('.checkbox-item');
      
        checkboxItems.forEach(item => {
            item.addEventListener('click', () => {
                const checkbox = item.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.click();
                }
            });
        });
        
        const checkboxes = shadow.querySelectorAll('input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('click', (event) => {
                event.stopPropagation(); 
            });
        });
        
        const labels = shadow.querySelectorAll('.checkbox-item label');
        
        labels.forEach(label => {
            label.addEventListener('click', (event) => {
                event.stopPropagation(); 
            });
        });
      
        const tabs = shadow.querySelectorAll('.nav-tab');
        const contents = shadow.querySelectorAll('.content-container');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
      
                tab.classList.add('active');
                const target = tab.dataset.tab;
                shadow.querySelector(`.content-container[data-content="${target}"]`).classList.add('active');
            });
        });
        
        let isDragging = false;
        let startX, startY, initialX, initialY;
      
        header.addEventListener('mousedown', startDrag);
        
        function startDrag(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            initialX = parseFloat(popup.style.left);
            initialY = parseFloat(popup.style.top);
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
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
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
        }
      
        document.addEventListener('mousedown', (e) => {
            if (e.composedPath().includes(popupContent)) {
                popup.style.zIndex = '9999';
            }
        });

        object.entries(defaultSettings).forEach(([key, value]) => setChecked(key, value));        
    })
}