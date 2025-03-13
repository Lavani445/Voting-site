// Load candidates from external JSON
let candidates = [];

fetch('candidates.json')
    .then(response => response.json())
    .then(data => {
        candidates = data;
        checkTimer();
    })
    .catch(error => console.error('Error loading candidates:', error));

// Check if the user already voted
const hasVoted = localStorage.getItem('hasVoted');

// Set the timer (2 days in milliseconds)
const voteDuration = 2 * 24 * 60 * 60 * 1000; // 2 days
let endTime = localStorage.getItem('endTime');

if (!endTime) {
    endTime = Date.now() + voteDuration;
    localStorage.setItem('endTime', endTime);
} else {
    endTime = parseInt(endTime);
}

// Check timer and display either candidates or the winner
function checkTimer() {
    const now = Date.now();
    if (now >= endTime) {
        displayWinner();
    } else {
        displayCandidates();
        startCountdown();
    }
}

// Display candidates dynamically
function displayCandidates() {
    const candidateList = document.getElementById('candidateList');
    candidateList.innerHTML = '';

    candidates.sort((a, b) => b.votes - a.votes); // Sort by highest votes

    candidates.forEach((candidate, index) => {
        const candidateDiv = document.createElement('div');
        candidateDiv.className = 'candidate';
        candidateDiv.innerHTML = `
            <span class="candidate-name">${candidate.name}</span>
            <button class="vote-btn" id="vote-${index}" onclick="vote('${candidate.name}', ${index})" ${hasVoted ? 'disabled' : ''}>
                ${hasVoted === candidate.name ? 'Voted ✔️' : '⬆️ Vote'}
            </button>
        `;
        candidateList.appendChild(candidateDiv);
    });
}

// Handle voting action
function vote(candidateName, index) {
    if (hasVoted) {
        alert('You have already voted!');
        return;
    }

    if (confirm(`Are you sure you want to vote for ${candidateName}?`)) {
        localStorage.setItem('hasVoted', candidateName);

        const voteButton = document.getElementById(`vote-${index}`);
        voteButton.textContent = 'Voted ✔️';
        voteButton.disabled = true;

        alert(`✅ You successfully voted for ${candidateName}!`);
    }
}

// Display winner when the timer ends
function displayWinner() {
    const candidateList = document.getElementById('candidateList');
    candidateList.innerHTML = '';

    // Sort candidates to find the winner
    candidates.sort((a, b) => b.votes - a.votes);
    const winner = candidates[0];

    const winnerMessage = document.createElement('div');
    winnerMessage.className = 'winner';
    winnerMessage.innerHTML = `
        🎉 <strong>The Most Handsome Boy Chosen is:</strong> <br>
        <span class="winner-name">${winner.name}</span> 🎊
    `;

    candidateList.appendChild(winnerMessage);
}

// Countdown Timer Display
function startCountdown() {
    const timerDisplay = document.createElement('div');
    timerDisplay.id = 'timer';
    document.body.prepend(timerDisplay);

    function updateTimer() {
        const now = Date.now();
        const timeLeft = endTime - now;

        if (timeLeft <= 0) {
            displayWinner();
            clearInterval(timerInterval);
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        timerDisplay.textContent = `Voting ends in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
}
