// Timer: Check if end time is already saved in LocalStorage
let endTime = localStorage.getItem("endTime");

if (!endTime) {
    // Set the end time to 2 days from now if not set
    endTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000);
    localStorage.setItem("endTime", endTime);
} else {
    endTime = parseInt(endTime);
}

let candidates = []; // Global array to store candidate data

// Fetch candidates from JSON and display them
fetch('candidates.json')
    .then(response => response.json())
    .then(data => {
        candidates = data; // Store JSON data globally
        displayCandidates(); // Populate candidates
    })
    .catch(error => console.error('❌ Error loading candidates:', error));

// Countdown Timer: Displays real-time countdown
function countdown() {
    const now = new Date().getTime();
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
        document.getElementById("timer").innerHTML = "⏳ Voting has ended!";
        localStorage.removeItem("endTime"); // Clear timer after expiration
        lockVoting();
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("timer").innerHTML = `🕒 Voting ends in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    setTimeout(countdown, 1000); // Update every second
}

// Displays candidate list dynamically
function displayCandidates() {
    const candidateList = document.getElementById('candidateList');
    candidateList.innerHTML = ""; // Clear previous entries

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
    localStorage.setItem("voted", "true"); // Prevent multiple votes

    // Store the vote
    const votes = JSON.parse(localStorage.getItem("votes")) || {};
    votes[candidateName] = (votes[candidateName] || 0) + 1;
    localStorage.setItem("votes", JSON.stringify(votes));

    console.log(`✅ Vote registered for: ${candidateName}`);
}

// Locks voting after time expires
function lockVoting() {
    const buttons = document.querySelectorAll(".vote-btn");
    buttons.forEach(button => button.disabled = true);
    alert("🚫 Voting is now closed!");
}

// Start the countdown and check if voting is still open
countdown();
