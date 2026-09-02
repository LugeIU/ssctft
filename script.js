// 1. QUAN TRỌNG: Hãy xóa link mẫu dưới đây và dán link Worker của bạn vào
// Ví dụ: "https://tft-proxy.ten-cua-ban.workers.dev"
const CLOUDFLARE_WORKER_URL = "https://tft-proxy.nghiepdt2911.workers.dev"; 

async function loadRiotData() {
    const tbody = document.getElementById('leaderboard-body');
    
    try {
        const response = await fetch(CLOUDFLARE_WORKER_URL);
        
        // Nếu HTTP Status không phải 200 (Thành công)
        if (!response.ok) {
            throw new Error(`Máy chủ trả về mã lỗi: ${response.status}. Có thể do Riot API Key đã hết hạn hoặc Worker cấu hình sai.`);
        }

        const data = await response.json();

        // Kiểm tra xem dữ liệu trả về có đúng cấu trúc của Riot không (Riot trả về danh sách trong biến 'entries')
        if (!data || !data.entries) {
            throw new Error("Không tìm thấy dữ liệu người chơi. API Key của bạn có thể đã hết hạn (chỉ sống 24h).");
        }

        // Dữ liệu Riot trả về không sắp xếp sẵn, nên ta phải tự xếp hạng theo LP (điểm) giảm dần
        let players = data.entries.sort((a, b) => b.leaguePoints - a.leaguePoints);

        // Lấy 15 người đứng đầu để web không quá dài
        players = players.slice(0, 15);

        tbody.innerHTML = ''; // Xóa dòng chữ "Đang tải..."

        players.forEach((player, index) => {
            // Tính toán tỷ lệ thắng
            const totalGames = player.wins + player.losses;
            const winRate = ((player.wins / totalGames) * 100).toFixed(1) + "%";

            // Tạo thẻ html cho từng hàng
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="rank">#${index + 1}</td>
                <td><strong>${player.summonerName}</strong></td>
                <td class="tier">Thách Đấu</td>
                <td>${player.leaguePoints} LP</td>
                <td>${winRate} (${player.wins}W - ${player.losses}L)</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        // In ra màn hình cho người xem và in vào Console (F12) cho bạn dễ sửa lỗi
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="error">
                    <strong>LỖI TẢI DỮ LIỆU:</strong><br>
                    ${error.message}<br><br>
                    <em>Vui lòng kiểm tra lại 1. Link Worker đã thay đúng chưa? 2. API Key trên Cloudflare đã hết hạn chưa?</em>
                </td>
            </tr>
        `;
        console.error("Lỗi chi tiết:", error);
    }
}

// Chạy hàm khi trang web tải xong
loadRiotData();
