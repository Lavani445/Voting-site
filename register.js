// Function to handle registration
function registerName(event) {
    event.preventDefault();

    // Get the name from the input field
    const girlName = document.getElementById('girlName').value.trim();

    if (!girlName) {
        alert("❌ Please enter a valid name!");
        return;
    }

    // Save the name to localStorage (simulating JSON storage)
    const registeredGirls = JSON.parse(localStorage.getItem('registeredGirls')) || [];
    registeredGirls.push(girlName);
    localStorage.setItem('registeredGirls', JSON.stringify(registeredGirls));

    // Show confirmation message
    document.getElementById('confirmationMessage').style.display = 'block';

    // Clear the form
    document.getElementById('registrationForm').reset();

    alert(`✅ You have successfully registered as: ${girlName}`);
}
