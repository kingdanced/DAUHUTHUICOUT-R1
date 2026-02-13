// 1. Hàm lọc món ăn
function filterMenu(category, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// 2. Xử lý hiện bảng số điện thoại (Modal)
const modal = document.getElementById("orderModal");
const closeBtn = document.getElementById("closeModal");
const callButtons = document.querySelectorAll(".btn-call-modal");

callButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault(); 
        modal.style.display = "block";
    });
});

closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}