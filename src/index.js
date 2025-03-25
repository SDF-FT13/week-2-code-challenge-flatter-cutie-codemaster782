document.addEventListener("DOMContentLoaded", () => {
    fetchCharacters();
    });
    
    let currentCharacter = null; // Store the currently displayed character
    
    function fetchCharacters() {
    fetch("https://json-server-vercel-nine-omega.vercel.app/characters") // Change URL if needed
    .then(response => response.json())
    .then(characters => {
    const characterBar = document.getElementById("character-bar");
    
    characters.forEach(character => {
    const span = document.createElement("span");
    span.textContent = character.name;
    span.style.cursor = "pointer";
    
    // Attach event listener using stored character data
    span.addEventListener("click", () => displayCharacterDetails(character));
    
    characterBar.appendChild(span);
    });
    })
    .catch(error => console.error("Error fetching characters:", error));
    }
    
    function displayCharacterDetails(character) {
    // Update the currentCharacter variable
    currentCharacter = character;
    
    // Select existing elements inside #detailed-info
    document.getElementById("name").textContent = character.name;
    document.getElementById("image").src = character.image;
    document.getElementById("image").alt = character.name;
    document.getElementById("vote-count").textContent = character.votes;
    
    // Attach event listener to the form
    const form = document.getElementById("votes-form");
    form.onsubmit = (event) => {
    event.preventDefault();
    addVotes();
    };
    
    // Attach event listener to reset button
    document.getElementById("reset-btn").onclick = resetVotes;
    }
    
    function addVotes() {
    if (!currentCharacter) return;
    
    const voteInput = document.getElementById("votes");
    const voteCountSpan = document.getElementById("vote-count");
    
    let newVotes = parseInt(voteInput.value);
    if (!isNaN(newVotes) && newVotes > 0) {
    currentCharacter.votes += newVotes; // Update local character data
    voteCountSpan.textContent = currentCharacter.votes; // Update UI
    voteInput.value = ""; // Clear input field
    } else {
    alert("Please enter a valid number!");
    }
    }
    
    function resetVotes() {
    if (!currentCharacter) return;
    
    currentCharacter.votes = 0; // Reset votes in local data
    document.getElementById("vote-count").textContent = 0; // Update UI
    }
    
