import html from "./popup.html"

export default function initUI() {
    document.addEventListener('DOMContentLoaded', ()=>{
        const popup = document.createElement('div');
        const shadow = popup.attachShadow({ mode: 'closed' });
      
        shadow.innerHTML = html
        document.body.appendChild(popup);
      
        const rect = popup.getBoundingClientRect();
        
        Object.assign(popup.style, {
            position: 'fixed',
            zIndex: '9999',
            left: `2750px`,
            top: `250px`
        });
      
        const header = shadow.querySelector('.header');
        const closeBtn = shadow.querySelector('.close-btn');
        const popupContent = shadow.querySelector('.popup');
      
        closeBtn.addEventListener('click', () => {
          shadow.host.style.display = 'none';
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
        
      
        const tabs = shadow.querySelectorAll('.tab');
        const contents = shadow.querySelectorAll('.content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
      
                tab.classList.add('active');
                const target = tab.dataset.tab;
                shadow.querySelector(`.content[data-content="${target}"]`).classList.add('active');
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
    })
}