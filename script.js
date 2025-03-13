// Load candidates from JSON
fetch('candidates.json')
    .then(response => response.json())
    .then(candidates => {
        let voteContainer = document.getElementById('vote-container');
        let totalVotes = localStorage.getItem('totalVotes') || 0;

        // Display candidates
        candidates = candidates.map(name => ({ name, votes: 0 }));
        voteContainer.innerHTML = candidates.map((candidate, index) =>
            `<div class="candidate">
                <span>${candidate.name}</span>
                <button onclick="vote(${index})">⬆️</button>
            </div>`
        ).join('');

        document.getElementById('totalVotes').innerText = `Total Votes: ${totalVotes}`;

        // Store candidates in localStorage if not already there
        if (!localStorage.getItem('candidates')) {
            localStorage.setItem('candidates', JSON.stringify(candidates));
        }
    });

function vote(index) {
    if (localStorage.getItem('hasVoted')) {
        alert("❌ You have already voted!");
        return;
    }

    let candidates = JSON.parse(localStorage.getItem('candidates'));
    candidates[index].votes++;
    localStorage.setItem('candidates', JSON.stringify(candidates));

    // Update total votes
    let totalVotes = parseInt(localStorage.getItem('totalVotes')) || 0;
    localStorage.setItem('totalVotes', ++totalVotes);
    document.getElementById('totalVotes').innerText = `Total Votes: ${totalVotes}`;

    // Prevent multiple votes
    localStorage.setItem('hasVoted', true);

    alert(`✅ You voted for ${candidates[index].name}`);
    updateRanking();
}

// Update candidate ranking
function updateRanking() {
    let candidates = JSON.parse(localStorage.getItem('candidates'));
    candidates.sort((a, b) => b.votes - a.votes);

    const voteContainer = document.getElementById('vote-container');
    voteContainer.innerHTML = candidates.map((candidate, index) =>
        `<div class="candidate">
            <span>${candidate.name}</span>
            <button onclick="vote(${index})">⬆️</button>
        </div>`
    ).join('');
}

// Countdown Timer (5 minutes)
function startTimer(duration) {
    let timer = duration;
    const timerElement = document.getElementById('timer');

    const countdown = setInterval(() => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;

        timerElement.textContent = `Voting ends in: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        timer--;

        if (timer < 0) {
            clearInterval(countdown);
            showWinner();
        }
    }, 1000);
}

// Display Winner
function showWinner() {
    let candidates = JSON.parse(localStorage.getItem('candidates'));
    candidates.sort((a, b) => b.votes - a.votes);

    document.body.innerHTML = `
        <div class="container">
            <h1>The Most Handsome Boy is:</h1>
            <h2>${candidates[0].name} 🎉</h2>
            <p>Total Votes: ${localStorage.getItem('totalVotes')}</p>
        </div>
    `;
}

// Start the timer
startTimer(300);
// Set timer for 5 minutes (300 seconds)
const duration = 1 * 60 * 1000;

// Check if timer already exists in localStorage
let endTime = localStorage.getItem("endTime");

if (!endTime) {
    // If no timer, set a new one
    endTime = Date.now() + duration;
    localStorage.setItem("endTime", endTime);
} else {
    endTime = parseInt(endTime);
}

// Check if an end time is already stored
let endTime = localStorage.getItem("endTime");

if (!endTime) {
    // If no end time exists, set it for 5 minutes from now and store it
    endTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes timer
    localStorage.setItem("endTime", endTime);
} else {
    // Convert stored endTime to a number
    endTime = parseInt(endTime, 10);
}

// Countdown Timer Function
function countdown() {
    const now = new Date().getTime();
    const timeLeft = endTime - now;

    const timerDisplay = document.getElementById("timer");

    if (timeLeft <= 0) {
        timerDisplay.innerHTML = "Voting has ended!";

        // Stop the timer and prevent new votes (optional)
        localStorage.removeItem("endTime"); // Remove timer permanently
    } else {
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        timerDisplay.innerHTML = `Voting ends in: ${minutes}m ${seconds}s`;
        
        setTimeout(countdown, 1000);
    }
}

countdown();
