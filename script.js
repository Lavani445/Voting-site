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
        } else {
            updateRanking(); // Ensure rankings stay updated
        }
    });

// Vote function (One person, one vote)
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

// Update candidate ranking dynamically
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

// Countdown Timer (Persistent across refresh)
function startTimer(duration) {
    const timerElement = document.getElementById('timer');
    let endTime = parseInt(localStorage.getItem('endTime'));

    // If no timer is set, create a new one
    if (!endTime || isNaN(endTime)) {
        endTime = Date.now() + duration * 1000;
        localStorage.setItem('endTime', endTime);
    }

    const countdown = setInterval(() => {
        const timeLeft = endTime - Date.now();
        if (timeLeft <= 0) {
            clearInterval(countdown);
            showWinner();
            return;
        }

        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        timerElement.textContent = `Voting ends in: ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
}

// Display Winner after timer ends
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

    // Clear timer to prevent restart
    localStorage.removeItem('endTime');
}

// Start Timer (2 Days = 172800 seconds)
startTimer(172800);

// Handle Comment Submission
document.getElementById('submitComment').addEventListener('click', () => {
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();

    if (!commentText) {
        alert('❌ Please enter a comment.');
        return;
    }

    // Create a new comment object
    const newComment = {
        text: commentText,
        timestamp: new Date().toLocaleString(),
    };

    // Save the comment to Local Storage
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.push(newComment);
    localStorage.setItem('comments', JSON.stringify(comments));

    // Display updated comments
    displayComments();
    commentInput.value = '';
    alert('✅ Comment posted successfully!');
});

// Display Comments
function displayComments() {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';

    const comments = JSON.parse(localStorage.getItem('comments')) || [];

    comments.forEach(comment => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${comment.timestamp}</strong>: ${comment.text}
        `;
        commentsList.appendChild(li);
    });
}

// Load Comments on Page Load
window.addEventListener('load', displayComments);
