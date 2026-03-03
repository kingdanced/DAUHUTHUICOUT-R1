const SUPABASE_URL = 'https://qqcmgrqjfvacajlhdbhb.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxY21ncnFqZnZhY2FqbGhkYmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MTcxMzcsImV4cCI6MjA4NzQ5MzEzN30.InyPceZ1_6wUv7FKCHWSZ7biMEfBQhehldEKlAc6ewM';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentRotation = 0;
let isSpinning = false;

document.addEventListener("DOMContentLoaded", () => {
    // 1. CHÈN MENU TỰ ĐỘNG
    renderNavbar();
    // 2. CÁC HÀM HỆ THỐNG
    loadSpinCount();   
    initModal();       
    loadInitialStats();
    
    // Giả lập số người online
    const onlineEl = document.getElementById('online-count');
    if (onlineEl) onlineEl.innerText = Math.floor(Math.random() * 10) + 1;
});

// Hàm tạo Menu - Sửa tên món ở đây là tất cả các trang tự đổi theo
function renderNavbar() {
    const navElement = document.querySelector('.navbar');
    if (!navElement) return;

    const menuItems = [
        { name: "TRANG CHỦ", link: "index.html" },
        { name: "ĐẬU HỦ THÚI", link: "dau-hu-thui.html" },
        { name: "ĐẬU HỦ LONG", link: "dau-hu-long.html" },
        { name: "ĐẬU HỦ TRƯỜNG SA", link: "dau-hu-truong-sa.html" }
    ];

    // Lấy tên file hiện tại
    const path = window.location.pathname;
    const currentPage = path.split("/").pop() || "index.html";

    let html = '<ul>';
    menuItems.forEach(item => {
        // Kiểm tra nếu link khớp với trang hiện tại thì thêm class active
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