// Load Candidates
document.addEventListener("DOMContentLoaded", () => {
    fetch("candidates.json")
        .then(response => response.json())
        .then(data => displayCandidates(data))
        .catch(err => console.error("Error loading candidates:", err));
});

// Display Candidates
function displayCandidates(candidates) {
    const list = document.getElementById("candidateList");
    candidates.forEach(name => {
        const div = document.createElement("div");
        div.className = "candidate";
        div.innerHTML = `
            <span>${name}</span>
            <button onclick="vote('${name}')">⬆️ Vote</button>
        `;
        list.appendChild(div);
    });
}

// Handle Votes
function vote(name) {
    alert(`✅ You voted for ${name}!`);
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

// Handle Girl Registration
document.addEventListener("submit", (e) => {
    if (e.target.id === "registerForm") {
        e.preventDefault();
        const name = document.getElementById("girlName").value;
        alert(`✅ Registered: ${name}`);
    }
});
