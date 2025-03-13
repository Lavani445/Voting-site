// Check if end time is already saved in LocalStorage
let endTime = localStorage.getItem("endTime");

if (!endTime) {
    // If no end time exists, set it for 2 days from now and store it
    endTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000);
    localStorage.setItem("endTime", endTime);
} else {
    // Convert stored endTime from string to number
    endTime = parseInt(endTime);
}

let candidates = []; // Empty list (names will be loaded from JSON)

// Fetch candidates from a JSON file and display them
fetch('candidates.json')
    .then(response => response.json())
    .then(candidates => {
        const candidateList = document.getElementById('candidateList');

        // Clear existing candidates (if any)
        candidateList.innerHTML = '';

        // Create a card for each candidate
        candidates.forEach(candidate => {
            const candidateDiv = document.createElement('div');
            candidateDiv.className = 'candidate';
            candidateDiv.innerHTML = `
                <span class="candidate-name">${candidate.name}</span>
                <button class="vote-btn" onclick="vote('${candidate.name}')">Vote</button>
            `;
            candidateList.appendChild(candidateDiv);
        });
    })
    .catch(error => console.error('Error loading candidates:', error));

// Function to register a vote
function vote(candidateName) {
    alert(`✅ You voted for ${candidateName}!`);

    // Optional: Send vote to a database or local storage
    console.log(`Vote registered for: ${candidateName}`);

    // Example: Save vote to localStorage (optional)
    const votes = JSON.parse(localStorage.getItem('votes')) || [];
    votes.push(candidateName);
    localStorage.setItem('votes', JSON.stringify(votes));
}


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

function updateRanking() {
    candidates.sort((a, b) => b.votes - a.votes);
    displayCandidates();

    // 🔹 Debug: Check if the function is running
    console.log("✅ updateRanking() function is running!");

    // 🔹 Show votes in the console (Admin Only)
    console.clear(); // Clears old logs for a clean output
    console.log("🔹 Vote Counts (Admin View):");
    candidates.forEach(candidate => {
        console.log(`${candidate.name}: ${candidate.votes} votes`);
    });
}



// Countdown Timer Function (Includes Seconds & Remembers Time)
function countdown() {
    const now = new Date().getTime();
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
        document.getElementById("timer").innerHTML = "Voting has ended!";
        localStorage.removeItem("endTime"); // Remove timer after it expires
    } else {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000); // Get seconds

        document.getElementById("timer").innerHTML = `Voting ends in: ${days}d ${hours}h ${minutes}m ${seconds}s`;

        setTimeout(countdown, 1000);
    }
}

countdown();
