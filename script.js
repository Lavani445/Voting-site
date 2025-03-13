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
        endTime = Date.now() + duration * 1000; // 5 minutes in milliseconds
        localStorage.setItem('endTime', endTime);
    }

    const countdown = setInterval(() => {
        const timeLeft = endTime - Date.now();
        if (timeLeft <= 0) {
            clearInterval(countdown);
            showWinner();
            return;
        }

        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        timerElement.textContent = `Voting ends in: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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

// Start Timer (300 seconds = 5 minutes)
startTimer(300);

// ========== Anonymous Comments with IP Tracking ==========

// Function to get user's IP address
function getUserIP(callback) {
    fetch('https://api64.ipify.org?format=json')
        .then(response => response.json())
        .then(data => callback(data.ip))
        .catch(error => console.error('Error fetching IP:', error));
}

// Handle Comment Submission
document.getElementById('submitComment').addEventListener('click', () => {
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();

    if (!commentText) {
        alert('Please enter a comment before submitting.');
        return;
    }

    // Get User IP and Store Comment
    getUserIP((userIP) => {
        const comment = {
            text: commentText,
            timestamp: new Date().toLocaleString(),
            ip: userIP
        };

        // Save to Local Storage (for persistence)
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.push(comment);
        localStorage.setItem('comments', JSON.stringify(comments));

        // Display the new comment
        displayComments();

        // Clear the input box
        commentInput.value = '';
    });
});

// Display Comments (Admin sees IPs)
 // Get User IP Address (for admin view only)
function getUserIP(callback) {
    fetch('https://api64.ipify.org?format=json')
        .then(response => response.json())
        .then(data => callback(data.ip))
        .catch(error => console.error('Error fetching IP:', error));
}

// Check if user is Admin
function isAdmin() {
    return localStorage.getItem('isAdmin') === 'true';
}

// Handle Comment Submission
document.getElementById('submitComment').addEventListener('click', () => {
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();

    if (!commentText) {
        alert('Please enter a comment before submitting.');
        return;
    }

    // Get User IP and Store Comment
    getUserIP((userIP) => {
        const comment = {
            text: commentText,
            timestamp: new Date().toLocaleString(),
            ip: userIP
        };

        // Save comment to Local Storage
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.push(comment);
        localStorage.setItem('comments', JSON.stringify(comments));

        // Display comments and clear input
        displayComments();
        commentInput.value = '';
    });
});

// Display Comments (IP is only visible to admin)
function displayComments() {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';

    const comments = JSON.parse(localStorage.getItem('comments')) || [];

    comments.forEach(comment => {
        const li = document.createElement('li');
        li.innerHTML = `
            <p>${comment.text}</p>
            <small>${comment.timestamp}</small>
            ${isAdmin() ? `<em>(IP: ${comment.ip})</em>` : ''}
        `;
        commentsList.appendChild(li);
    });
}

// Set Admin Access (Open DevTools and run this ONCE to become admin)
localStorage.setItem('isAdmin', 'true');

// Load comments on page load
window.addEventListener('load', displayComments);
