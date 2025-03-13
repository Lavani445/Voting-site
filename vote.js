// Fetch candidates from external JSON and display them
let candidates = [];
fetch('candidates.json')
    .then(response => response.json())
    .then(data => {
        candidates = data;
        displayCandidates();
        updateRanking();
    })
    .catch(error => console.error('Error loading candidates:', error));

// Check if the user has already voted
const hasVoted = localStorage.getItem("hasVoted");

function displayCandidates() {
    const candidateList = document.getElementById("candidateList");
    candidateList.innerHTML = "";

    candidates.forEach((candidate, index) => {
        const candidateDiv = document.createElement("div");
        candidateDiv.className = "candidate";
        candidateDiv.innerHTML = `
            <span class="candidate-name">${candidate.name}</span>
            <button class="vote-btn" onclick="vote(${index})" ${hasVoted ? "disabled" : ""}>⬆️ Vote</button>
        `;
        candidateList.appendChild(candidateDiv);
    });
}

// Handle vote submission
function vote(index) {
    if (localStorage.getItem("hasVoted")) {
        alert("❌ You have already voted!");
        return;
    }

    candidates[index].votes += 1;
    localStorage.setItem("hasVoted", "true");
    alert(`✅ You voted for: ${candidates[index].name}`);

    updateRanking();
}

// Sort and display candidates by votes
function updateRanking() {
    candidates.sort((a, b) => b.votes - a.votes);
    displayCandidates();

    console.clear(); // Clear console for a clean admin view
    console.log("🔒 Vote Counts (Admin Only):");
    candidates.forEach(candidate => {
        console.log(`${candidate.name}: ${candidate.votes} votes`);
    });

    // Check if timer is expired and display the winner
    if (isTimerExpired()) {
        showWinner();
    }
}

// Display the winner in the center after the timer ends
function showWinner() {
    const winner = candidates[0];
    const container = document.getElementById("candidateList");
    container.innerHTML = `
        <div class="winner">
            🎉 The Most Handsome Boy is: <span class="winner-name">${winner.name}</span> 🎉
        </div>
    `;
}

// Timer to check if the countdown is over
function isTimerExpired() {
    const endTime = localStorage.getItem("endTime");
    return endTime && new Date().getTime() >= parseInt(endTime);
}

// Ensure the timer works properly
function setupTimer() {
    let endTime = localStorage.getItem("endTime");
    if (!endTime) {
        endTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000);
        localStorage.setItem("endTime", endTime);
    }
    countdown();
}

// Countdown Timer
function countdown() {
    const timerElement = document.getElementById("timer");
    const now = new Date().getTime();
    const endTime = parseInt(localStorage.getItem("endTime"));
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
        timerElement.innerHTML = "Voting has ended!";
        showWinner();
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    timerElement.innerHTML = `Voting ends in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    setTimeout(countdown, 1000);
}

setupTimer();
