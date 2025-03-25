fetch('http://localhost:3000/characters')
    .then(function(response) {
        return response.json();
    })
    .then(function(characters) {
        var characterBar = document.getElementById('character-bar');
        for (var i = 0; i < characters.length; i++) {
            var character = characters[i];
            var span = document.createElement('span');
            span.textContent = character.name;
            span.className = 'character-name';
            span.setAttribute('data-id', character.id);
            span.onclick = function() {
                displayCharacterDetails(this.getAttribute('data-id'));
            };
            characterBar.appendChild(span);
        }
    });

function displayCharacterDetails(id) {
    fetch('http://localhost:3000/characters/' + id)
        .then(function(response) {
            return response.json();
        })
        .then(function(character) {
            var nameElement = document.getElementById('name');
            nameElement.textContent = character.name;
            var imageElement = document.getElementById('image');
            imageElement.src = character.image;
            imageElement.alt = character.name;
            var voteCountElement = document.getElementById('vote-count');
            voteCountElement.textContent = character.votes;
            imageElement.parentElement.setAttribute('data-current-id', character.id);
        });
}

var voteForm = document.getElementById('votes-form');
voteForm.onsubmit = function(event) {
    event.preventDefault();
    var voteInput = document.getElementById('votes');
    var votesToAdd = parseInt(voteInput.value);
    var detailedInfo = document.getElementById('detailed-info');
    var currentId = detailedInfo.getAttribute('data-current-id');

    if (!currentId || isNaN(votesToAdd)) {
        alert('Please select a character and enter a valid number of votes!');
        return;
    }

    fetch('http://localhost:3000/characters/' + currentId, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            votes: votesToAdd + parseInt(document.getElementById('vote-count').textContent)
        })
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(updatedCharacter) {
            document.getElementById('vote-count').textContent = updatedCharacter.votes;
            voteInput.value = '';
        });
};

var resetButton = document.getElementById('reset-btn');
resetButton.onclick = function() {
    var detailedInfo = document.getElementById('detailed-info');
    var currentId = detailedInfo.getAttribute('data-current-id');

    if (!currentId) {
        alert('Please select a character to reset votes!');
        return;
    }

    fetch('http://localhost:3000/characters/' + currentId, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ votes: 0 })
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(updatedCharacter) {
            document.getElementById('vote-count').textContent = updatedCharacter.votes;
        });
};

var characterForm = document.getElementById('character-form');
characterForm.onsubmit = function(event) {
    event.preventDefault();
    var name = document.getElementById('name').value;
    var image = document.getElementById('image-url').value;

    fetch('http://localhost:3000/characters', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            image: image,
            votes: 0
        })
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(newCharacter) {
            var characterBar = document.getElementById('character-bar');
            var span = document.createElement('span');
            span.textContent = newCharacter.name;
            span.className = 'character-name';
            span.setAttribute('data-id', newCharacter.id);
            span.onclick = function() {
                displayCharacterDetails(newCharacter.id);
            };
            characterBar.appendChild(span);
            document.getElementById('character-form').reset();
            displayCharacterDetails(newCharacter.id);
        });
};