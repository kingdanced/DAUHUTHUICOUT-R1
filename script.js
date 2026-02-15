/**
 * 1. Hàm lọc món ăn
 */
function filterMenu(category, btn) {
    // Đổi trạng thái nút
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Lọc card
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (card.classList.contains(category)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

/**
 * 2. Xử lý Modal liên hệ
 */
const modal = document.getElementById("orderModal");
const closeBtn = document.getElementById("closeModal");
const callButtons = document.querySelectorAll(".btn-call-modal");

callButtons.forEach(btn => {
    btn.onclick = function(e) {
        e.preventDefault(); 
        modal.style.display = "block";
        setTimeout(() => {
            modal.classList.add("show");
        }, 10);
    };
});

function hideModal() {
    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}

if (closeBtn) closeBtn.onclick = hideModal;

window.onclick = function(event) {
    if (event.target == modal) {
        hideModal();
    }
}

/**
 * 3. Hiệu ứng hoa mai rơi (Tết)
 */
function createBlossom() {
    const container = document.getElementById('tet-blossoms');
    if (!container) return;

    const blossom = document.createElement('div');
    blossom.className = 'blossom';
    
    // Chọn ngẫu nhiên hoa mai hoặc hoa đào (emoji)
    const types = ['🌼', '🌸', '🧧'];
    blossom.innerText = types[Math.floor(Math.random() * types.length)];
    
    // Vị trí ngẫu nhiên
    const startPos = Math.random() * window.innerWidth;
    const duration = 5 + Math.random() * 5; // 5-10 giây
    const size = 15 + Math.random() * 20; // 15-35px
    
    blossom.style.left = startPos + 'px';
    blossom.style.fontSize = size + 'px';
    blossom.style.animationDuration = duration + 's';
    blossom.style.opacity = 0.6 + Math.random() * 0.4;

    container.appendChild(blossom);

    // Xóa hoa sau khi rơi xong để tránh nặng web
    setTimeout(() => {
        blossom.remove();
    }, duration * 1000);
}

/**
 * Khởi tạo trang
 */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Lọc mặc định phần Đậu hủ
    const activeBtn = document.querySelector('.filter-btn.active');
    if (activeBtn) filterMenu('dau-hu', activeBtn);

    // 2. Bắt đầu hiệu ứng hoa rơi
    setInterval(createBlossom, 500); // Cứ 0.5 giây tạo 1 cánh hoa
});