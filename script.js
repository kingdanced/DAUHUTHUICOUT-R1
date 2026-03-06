const SUPABASE_URL = 'https://qqcmgrqjfvacajlhdbhb.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxY21ncnFqZnZhY2FqbGhkYmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MTcxMzcsImV4cCI6MjA4NzQ5MzEzN30.InyPceZ1_6wUv7FKCHWSZ7biMEfBQhehldEKlAc6ewM';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentRotation = 0;
let isSpinning = false;

document.addEventListener("DOMContentLoaded", () => {
   
   // Gọi hàm render Header & Trang trí mới
    renderHeader();
    // 1. CHÈN MENU TỰ ĐỘNG
    renderNavbar();
    renderFooter(); // Hiện thông tin liên hệ & modal (MỚI)
    // 2. CÁC HÀM HỆ THỐNG
    loadSpinCount();   
    initModal();       
    loadInitialStats();
    
    // Giả lập số người online
    const onlineEl = document.getElementById('online-count');
    if (onlineEl) onlineEl.innerText = Math.floor(Math.random() * 10) + 1;
});

function renderHeader() {
    const headerContainer = document.getElementById('header-dynamic-container');
    if (!headerContainer) return;

    headerContainer.innerHTML = `
        <div id="tet-blossoms"></div>

        <div class="lantern-container left">
            <div class="lantern">🏮<span>An Khang </span></div>
        </div>
        <div class="lantern-container right">
            <div class="lantern">🏮<span> Thịnh Vượng </span></div>
        </div>

        <div class="header">
            <div class="tet-badge">🧧 Chúc Mừng Năm Mới 🧧</div>
            <h1 class="logo">ĐẬU HỦ THÚI CÔ ÚT</h1>
            <p class="sub-logo">Món ăn đường phố - Hương vị khó quên</p>
        </div>
    `;
}


// Hàm tạo Menu tự động - Cập nhật danh sách tại đây
function renderNavbar() {
    const navElement = document.querySelector('.navbar');
    if (!navElement) return;

    // Danh sách 4 trang sản phẩm + Trang chủ + Tải xuống
    const menuItems = [
        { name: "TRANG CHỦ", link: "index.html" },
        { name: "ĐẬU HỦ THÚI", link: "dau-hu-thui.html" },
        { name: "ĐẬU HỦ LÔNG", link: "dau-hu-long.html" },
        { name: "ĐẬU HỦ TRƯỜNG SA", link: "dau-hu-truong-sa.html" },
        { name: "TẢI XUỐNG", link: "download.html" },
        { name: "LIÊN HỆ", link: "lien-he.html" } // Đổi từ số điện thoại sang trang liên hệ để tránh lỗi khi click vào nút menu
    ];

    const path = window.location.pathname;
    const currentPage = path.split("/").pop() || "index.html";

    let html = '<ul>';
    menuItems.forEach(item => {
        // Tự động kiểm tra trang hiện tại để tô sáng nút menu
        const isActive = (item.link === currentPage) ? 'class="active"' : '';
        html += `<li ${isActive}><a href="${item.link}">${item.name}</a></li>`;
    });
    html += '</ul>';

    navElement.innerHTML = html;
}

// --- CÁC HÀM XỬ LÝ KHÁC (GIỮ NGUYÊN) ---
function initModal() {
    const modal = document.getElementById("orderModal");
    const closeBtn = document.getElementById("closeModal");
    if (closeBtn) closeBtn.onclick = () => modal.classList.remove("show");
    window.onclick = (event) => { if (event.target == modal) modal.classList.remove("show"); }
}

function handleCallRequest() {
    const modal = document.getElementById("orderModal");
    if (modal) modal.classList.add("show");
}

async function loadInitialStats() {
    try {
        const grid = document.querySelector('.grid');
        if (!grid) return;
        const observer = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting) {
                const { data: cur } = await supabaseClient.from('stats').select('views').eq('id', 1).single();
                const newViews = (cur?.views || 0) + 1;
                await supabaseClient.from('stats').update({ views: newViews }).eq('id', 1);
                document.getElementById('view-count').innerText = newViews;
                observer.disconnect();
            }
        });
        observer.observe(grid);
    } catch (e) { console.error(e); }
}

async function loadSpinCount() {
    try {
        const { data } = await supabaseClient.from('stats').select('spins').eq('id', 1).single();
        if (data && document.getElementById('spin-count')) document.getElementById('spin-count').innerText = data.spins;
    } catch (e) {}
}

async function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    const wheel = document.getElementById('wheel');
    const randomDegree = Math.floor(Math.random() * 360) + 1440; 
    currentRotation += randomDegree;
    if (wheel) wheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(async () => {
        isSpinning = false;
        alert("🧧 Chúc mừng bạn đã nhận được một bao lì xì may mắn!");
        try {
            const { data: cur } = await supabaseClient.from('stats').select('spins').eq('id', 1).single();
            const newSpins = (cur?.spins || 0) + 1;
            await supabaseClient.from('stats').update({ spins: newSpins }).eq('id', 1);
            if (document.getElementById('spin-count')) document.getElementById('spin-count').innerText = newSpins;
        } catch(e) {}
    }, 4000);
}

// 2. Hàm tạo Liên hệ & Modal (Giải quyết vấn đề dư khung)
function renderFooter() {
    const container = document.getElementById('footer-contact-container');
    if (!container) return;

    container.innerHTML = `
        <div class="footer-info">
            <h3>THÔNG TIN LIÊN HỆ</h3>
            <p>📍 <strong>Địa chỉ:</strong> 438/42 Lê Hồng Phong, P.1, Q.10, TP.HCM</p>
            <p style="margin-bottom: 15px;">📞 <strong>Số điện thoại:</strong></p>
            <div style="display: flex; flex-direction: column; gap: 15px; max-width: 280px; margin: 0 auto 20px auto;">
                <a href="tel:0903266772" class="btn-quick phone" style="text-decoration: none; height: 45px; font-size: 1.2rem; padding: 10px 60px;">📞 0903 266 772</a>
                <a href="tel:0707021719" class="btn-quick phone" style="text-decoration: none; height: 45px; font-size: 1.2rem; padding: 10px 60px; background: #f6d518;">📞 070 702 1719</a>
            </div>
            <p>⏰ <strong>Giờ mở cửa:</strong> 15h30 - 21h00 (Thứ 2 - CN)</p>
            <p style="margin-top: 15px; font-size: 0.9rem; opacity: 0.8;">🏮 Chúc quý khách năm mới Vạn Sự Như Ý! 🏮</p>
            <p style="font-size: 0.8rem; color: var(--text-brown); margin-top: 5px;">🟢 <span id="online-count">1</span> khách đang xem menu</p>
            <p style="margin-top: 10px; font-size: 0.8rem; color: var(--text-brown);">👀 Đã có <span id="view-count">0</span> lượt ghé thăm tiệm</p>
        </div>

        <div id="orderModal" class="modal">
            <div class="modal-content">
                <h2 style="color: #d0021b;">🧧 Liên hệ đặt hàng</h2>
                <div style="margin: 20px 0; display: flex; flex-direction: column; gap: 12px;">
                    <a href="tel:0903266772" class="btn-delivery" style="background: #d0021b; color:white; text-decoration:none; display:flex; align-items:center; justify-content:center; height:50px; border-radius:10px;">0903 266 772</a>
                    <a href="tel:0707021719" class="btn-delivery" style="background: #f59e0b; color:white; text-decoration:none; display:flex; align-items:center; justify-content:center; height:50px; border-radius:10px;">070 702 1719</a>
                </div>
                <button class="close-btn" id="closeModal">Để sau</button>
            </div>
        </div>
    `;
    
    // Khởi tạo lại sự kiện đóng/mở Modal sau khi đã render
    initModalEvents();
}

function initModalEvents() {
    const modal = document.getElementById("orderModal");
    const closeBtn = document.getElementById("closeModal");
    
    // Tìm tất cả các nút có class 'phone' (nút Gọi ngay)
    // Những nút này sẽ mở Modal thay vì gọi điện trực tiếp ngay lập tức
    document.querySelectorAll('.btn-quick.phone').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault(); // chặn hành động mặc định nếu có
            modal.classList.add('show');
        };
    });

    // Nút đóng modal
    if (closeBtn) {
        closeBtn.onclick = () => modal.classList.remove('show');
    }

    // Đóng khi click ra ngoài vùng content của modal
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.classList.remove("show");
        }
    };
}