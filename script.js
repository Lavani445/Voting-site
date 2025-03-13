// Timer: Check if end time is already saved in LocalStorage
let endTime = localStorage.getItem("endTime");

if (!endTime) {
    endTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000);
    localStorage.setItem("endTime", endTime);
} else {
    endTime = parseInt(endTime);
}

let candidates = [];

// Fetch and display candidates from the new simple JSON format
fetch('candidates.json')
    .then(response => response.json())
    .then(data => {
        candidates = data.map(name => ({ name })); // Convert to object format
        displayCandidates();
    })
    .catch(error => console.error('❌ Error loading candidates:', error));

// Countdown Timer: Displays real-time countdown
function countdown() {
    const now = new Date().getTime();
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
        document.getElementById("timer").innerHTML = "⏳ Voting has ended!";
        localStorage.removeItem("endTime");
        lockVoting();
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("timer").innerHTML = `🕒 Voting ends in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    setTimeout(countdown, 1000);
}

// Display candidates as buttons
function displayCandidates() {
    const candidateList = document.getElementById('candidateList');
    candidateList.innerHTML = "";

    candidates.forEach(candidate => {
        const candidateDiv = document.createElement('div');
        candidateDiv.className = 'candidate';
        candidateDiv.innerHTML = `
            <span class="candidate-name">${candidate.name}</span>
            <button class="vote-btn" onclick="vote('${candidate.name}')">🗳️ Vote</button>
        `;
        candidateList.appendChild(candidateDiv);
    });
}

// Handles the voting process
function vote(candidateName) {
    if (localStorage.getItem("voted")) {
        alert("❌ You have already voted!");
        return;
    }

    alert(`✅ Your vote for ${candidateName} has been recorded!`);
    localStorage.setItem("voted", "true");

    const votes = JSON.parse(localStorage.getItem("votes")) || {};
    votes[candidateName] = (votes[candidateName] || 0) + 1;
    localStorage.setItem("votes", JSON.stringify(votes));

    console.log(`✅ Vote registered for: ${candidateName}`);
}

// Lock voting after the timer ends
function lockVoting() {
    const buttons = document.querySelectorAll(".vote-btn");
    buttons.forEach(button => button.disabled = true);
    alert("🚫 Voting is now closed!");
}

countdown();
