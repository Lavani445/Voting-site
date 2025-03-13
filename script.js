// List of candidates
const candidates = [
    { name: "Alice", votes: 0 },
    { name: "Bob", votes: 0 },
    { name: "Charlie", votes: 0 }
];

// Load candidates into the page
const candidateList = document.getElementById("candidates");
candidates.forEach((candidate, index) => {
    let li = document.createElement("li");
    li.innerHTML = `${candidate.name} <button onclick="vote(${index})">⬆️ Vote</button>`;
    candidateList.appendChild(li);
});

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

// Update ranking without showing exact votes
function updateRanking() {
    candidates.sort((a, b) => b.votes - a.votes);
    candidateList.innerHTML = "";
    candidates.forEach((candidate) => {
        let li = document.createElement("li");
        li.innerHTML = `${candidate.name}`;
        candidateList.appendChild(li);
    });
}

// Countdown Timer (2 days)
const endTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000);
function countdown() {
    const now = new Date().getTime();
    const timeLeft = endTime - now;
    if (timeLeft <= 0) {
        document.getElementById("timer").innerHTML = "Voting has ended!";
    } else {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById("timer").innerHTML = `Voting ends in: ${days}d ${hours}h ${minutes}m`;
        setTimeout(countdown, 1000);
    }
}
countdown();
