let candidates = []; // Empty list (names will be loaded from JSON)

// Fetch names from names.json
fetch('names.json')
    .then(response => response.json())
    .then(data => {
        candidates = data.map(name => ({ name: name, votes: 0 }));
        displayCandidates();
    });

// Function to display candidates in a table
function displayCandidates() {
    const candidateList = document.getElementById("candidates");
    candidateList.innerHTML = "";  // Clear previous list

    candidates.forEach((candidate, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${candidate.name}</td>
            <td><button class="vote-btn" onclick="vote(${index})">⬆️ Vote</button></td>
        `;
        candidateList.appendChild(row);
    });
}

// Prevent multiple votes using LocalStorage
function vote(index) {
    if (localStorage.getItem("voted")) {
        alert("You have already voted!");
        return;
    }
    candidates[index].votes += 1;
    localStorage.setItem("voted", "true");
    updateRanking();
}

// Update ranking without showing exact votes
function updateRanking() {
    candidates.sort((a, b) => b.votes - a.votes);
    displayCandidates();
}

// Countdown Timer (2 days)
const endTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000);
function countdown() {
    const now = new Date().getTime();
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
        document.getElementById("timer").innerHTML = "Voting has ended!";
    } else {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById("timer").innerHTML = `Voting ends in: ${days}d ${hours}h ${minutes}m`;
        setTimeout(countdown, 1000);
    }
}
countdown();
