const CLOUDFLARE_WORKER_URL = "https://tft-proxy.nghiepdt2911.workers.dev"; 

async function loadRiotData() {
    const tbody = document.getElementById('leaderboard-body');
    
    try {
        const response = await fetch(CLOUDFLARE_WORKER_URL);
        
        if (!response.ok) {
            throw new Error(`Mã lỗi: ${response.status}. Hãy kiểm tra lại API Key.`);
        }

        const players = await response.json();
        
        tbody.innerHTML = ''; 

        players.forEach((player, index) => {
            const totalGames = player.wins + player.losses;
            const winRate = ((player.wins / totalGames) * 100).toFixed(1) + "%";

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="rank">#${index + 1}</td>
                <td><strong>${player.name}</strong></td>
                <td class="tier">Thách Đấu</td>
                <td>${player.leaguePoints} LP</td>
                <td>${winRate} (${player.wins}W - ${player.losses}L)</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="5" class="error">Lỗi: ${error.message}</td></tr>`;
    }
}

loadRiotData();
