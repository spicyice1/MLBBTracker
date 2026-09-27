const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQMSyYdaTIHc7N-z-ZNqyZpdTbREku5KuvBN2z5fMtrECK1nYEcqm5x7ta5Omo9yHnXh4jyt1wd5LTA/pubhtml?gid=1260431574&single=true';

async function fetchStats() {
    Papa.parse(CSV_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            updateUI(results.data);
        }
    });
}

function updateUI(data) {
    // The aggregate stats are in the first row
    const stats = data[0];

    // Update Text Elements
    document.getElementById('rank').innerText = stats.CurrRankStars;
    document.getElementById('season-wl').innerText = stats.SeasonWL;
    document.getElementById('daily-wl').innerText = stats.DailyWL;
    document.getElementById('mvps').innerText = stats.MVPS;
    
    // Format Win Rate (e.g., 0.5 to 50%)
    const wrPercent = (parseFloat(stats.WinRate) * 100).toFixed(0) + "%";
    document.getElementById('win-rate').innerText = wrPercent;

    // Update Match History Icons
    const historyContainer = document.getElementById('match-history');
    historyContainer.innerHTML = ''; // Clear old icons

    data.forEach(row => {
        // Only create a slot if there is a Hero Icon URL
        if (row.Last10Icon && row.Last10Icon.startsWith('http')) {
            const slot = document.createElement('div');
            
            // Add class 'win' or 'loss'
            const resultClass = row.Last10Result.toLowerCase() === 'win' ? 'win' : 'loss';
            slot.className = `match-slot ${resultClass}`;

            const img = document.createElement('img');
            img.src = row.Last10Icon;

            slot.appendChild(img);
            historyContainer.appendChild(slot);
        }
    });
}

// Update every 60 seconds
setInterval(fetchStats, 60000);

// Initial load
fetchStats();
