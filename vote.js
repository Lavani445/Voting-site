// Load candidates from external JSON
fetch('candidates.json')
    .then(response => response.json())
    .then(candidates => {
        displayCandidates(candidates);
    })
    .catch(error => console.error('Error loading candidates:', error));

// Check if the user already voted
const hasVoted = localStorage.getItem('hasVoted');

// Display candidates dynamically
function displayCandidates(candidates) {
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

    // Confirm vote
    if (confirm(`Are you sure you want to vote for ${candidateName}?`)) {
        // Save the vote to LocalStorage
        localStorage.setItem('hasVoted', candidateName);

        // Update the button text and disable further voting
        const voteButton = document.getElementById(`vote-${index}`);
        voteButton.textContent = 'Voted ✔️';
        voteButton.disabled = true;

        alert(`✅ You successfully voted for ${candidateName}!`);
    }
}
// Timer
function countdown() {
    const endTime = Date.now() + 2 * 24 * 60 * 60 * 1000;
    function update() {
        const timeLeft = endTime - Date.now();
        if (timeLeft <= 0) {
            document.getElementById("timer").innerText = "Voting has ended!";
        } else {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById("timer").innerText = `Ends in: ${hours}h ${minutes}m`;
            setTimeout(update, 1000);
        }
    }
    update();
}
countdown();
