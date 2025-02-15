import html from "./ui.html"

export default function initUI() {
    const popup = document.createElement('div');

    const shadow = popup.attachShadow({ mode: 'closed' });

    shadow.innerHTML = html;

    if (document.body) {
        document.body.appendChild(popup);
    } else {
        addEventListener("load", () => {
            document.body.appendChild(popup);
        })
    }


    // Get initial position using getBoundingClientRect()
    const rect = popup.getBoundingClientRect();

    Object.assign(popup.style, {
        position: 'fixed',
        zIndex: '9999',
        left: `${window.innerWidth / 2 - rect.width / 2}px`,
        top: `${window.innerHeight / 2 - rect.height / 2}px`
    });

    const header = shadow.querySelector('.header');
    const closeBtn = shadow.querySelector('.close-btn');
    const popupContent = shadow.querySelector('.popup');

    closeBtn.addEventListener('click', () => {
        document.body.removeChild(popup);
    });

    let isDragging = false;
    let startX, startY, initialX, initialY;

    header.addEventListener('mousedown', startDrag);

    function startDrag(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        // Get current position from computed style
        initialX = parseFloat(popup.style.left);
        initialY = parseFloat(popup.style.top);

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }

    function drag(e) {
        if (!isDragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        popup.style.transform = 'none'; // Remove centering transform
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
}