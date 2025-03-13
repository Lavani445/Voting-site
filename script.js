// Fetch candidates from external JSON (simplified format)
fetch('candidates.json')
    .then(response => response.json())
    .then(names => {
        // Convert names into candidate objects with votes
        const candidates = names.map(name => ({ name, votes: 0 }));
        displayCandidates(candidates);
    })
    .catch(error => console.error('Error loading candidates:', error));

// Display candidates with vote buttons
function displayCandidates(candidates) {
    const candidateList = document.getElementById('candidateList');
    candidateList.innerHTML = '';

    candidates.sort((a, b) => b.votes - a.votes); // Sort by votes

    candidates.forEach(candidate => {
        const candidateDiv = document.createElement('div');
        candidateDiv.className = 'candidate';
        candidateDiv.innerHTML = `
            <span>${candidate.name}</span>
            <button class="vote-btn" onclick="vote('${candidate.name}')">⬆️ Vote</button>
        `;
        candidateList.appendChild(candidateDiv);
    });
}

// Vote function (stores in localStorage)
function vote(candidateName) {
    if (localStorage.getItem("voted")) {
        alert("❌ You have already voted!");
        return;
    }

    // Record vote
    alert(`✅ You voted for ${candidateName}!`);
    localStorage.setItem("voted", "true");

    // Update votes in localStorage
    let votes = JSON.parse(localStorage.getItem("votes")) || {};
    votes[candidateName] = (votes[candidateName] || 0) + 1;
    localStorage.setItem("votes", JSON.stringify(votes));
    location.reload();
}


// Store Votes in Local Storage
if (!localStorage.getItem("votes")) {
    const initialVotes = candidates.map(name => ({ name, votes: 0 }));
    localStorage.setItem("votes", JSON.stringify(initialVotes));
}

// Load Candidates and Display
function loadCandidates() {
    const candidatesContainer = document.getElementById("candidatesContainer");
    let storedVotes = JSON.parse(localStorage.getItem("votes"));

    // Sort by votes (Highest at the top)
    storedVotes.sort((a, b) => b.votes - a.votes);

    candidatesContainer.innerHTML = "";

    storedVotes.forEach((candidate, index) => {
        const candidateDiv = document.createElement("div");
        candidateDiv.className = "candidate";
        candidateDiv.innerHTML = `
            <span>${candidate.name}</span>
            <button class="vote-btn" onclick="vote('${candidate.name}')">⬆️ Vote</button>
        `;
        candidatesContainer.appendChild(candidateDiv);
    });
}

// Vote Function
function vote(name) {
    let storedVotes = JSON.parse(localStorage.getItem("votes"));

    if (localStorage.getItem("hasVoted")) {
        alert("❌ You have already voted!");
        return;
    }

    storedVotes = storedVotes.map(candidate =>
        candidate.name === name ? { ...candidate, votes: candidate.votes + 1 } : candidate
    );

    localStorage.setItem("votes", JSON.stringify(storedVotes));
    localStorage.setItem("hasVoted", "true");
    alert(`✅ You voted for ${name}!`);
    loadCandidates();
}

// Register for Best Girl Contest
function registerName(event) {
    event.preventDefault();
    const girlName = document.getElementById("girlName").value.trim();
    if (!girlName) return alert("❌ Please enter a valid name.");

    const registeredGirls = JSON.parse(localStorage.getItem("registeredGirls")) || [];
    registeredGirls.push(girlName);
    localStorage.setItem("registeredGirls", JSON.stringify(registeredGirls));

    document.getElementById("confirmationMessage").style.display = "block";
    document.getElementById("registerForm").reset();
    alert(`✅ You are registered as ${girlName}`);
}

// Load candidates when page is loaded
if (window.location.pathname.includes("vote.html")) loadCandidates();
