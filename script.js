// Home Page Logic
const boyBtn = document.getElementById('boy-btn');
const girlBtn = document.getElementById('girl-btn');
const homeContainer = document.getElementById('home-container');
const voteContainer = document.getElementById('vote-container');

// Track Gender Votes (for Admin Analytics)
let genderVotes = JSON.parse(localStorage.getItem('genderVotes')) || { boys: 0, girls: 0 };

boyBtn.addEventListener('click', () => {
    genderVotes.boys++;
    localStorage.setItem('genderVotes', JSON.stringify(genderVotes));
    showVotingPage();
});

girlBtn.addEventListener('click', () => {
    genderVotes.girls++;
    localStorage.setItem('genderVotes', JSON.stringify(genderVotes));
    showVotingPage();
});

function showVotingPage() {
    homeContainer.classList.add('hidden');
    voteContainer.classList.remove('hidden');
    startTimer(5 * 60);
    loadCandidates();
}

// Voting Logic
let candidates = [];
let totalVotes = 0;
const candidateList = document.getElementById('candidate-list');
const totalVotesDisplay = document.getElementById('total-votes');

// Load candidates from external JSON
function loadCandidates() {
    fetch('candidates.json')
        .then(response => response.json())
        .then(data => {
            candidates = data.map(name => ({ name, votes: 0 }));
            updateCandidates();
        });
}

// Display candidates and vote system
function updateCandidates() {
    candidates.sort((a, b) => b.votes - a.votes);
    candidateList.innerHTML = '';

    candidates.forEach((candidate, index) => {
        const div = document.createElement('div');
        div.className = 'candidate';
        div.innerHTML = `
            <span>${index + 1}. ${candidate.name}</span>
            <button class="vote-btn" onclick="vote('${candidate.name}')">⬆️</button>
        `;
        candidateList.appendChild(
