const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2410-FTB-ET-WEB-PT/events';
const partiesContainer = document.querySelector('#parties');

const state = {
    parties: [],
}

const getParties = async() => {
    try {
        const response = await fetch(`${API_URL}`);
        const parties = await response.json();

        return parties.data;
    } catch (e) {
        console.error(`Failed to fetch parties.`, e);

        return[];
    }
}

const createPartyItem = (party) => {
    const partyContainer = document.createElement('div');
    partyContainer.classList.add('party_item');

    const partyName = document.createElement('h3');
    partyName.textContent = party.name;
    const partyDate = document.createElement('h4');
    partyDate.textContent = party.date;
    const partyLocation = document.createElement('h4');
    partyLocation.textContent = party.location;
    const partyDetails = document.createElement('p');
    partyDetails.textContent = party.description;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Party';
    deleteButton.addEventListener('click', () => {
        deleteParty(party.id);
    });

    partyContainer.append(partyName, partyDate, partyLocation, partyDetails, deleteButton);

    return partyContainer;
}

const deleteParty = async (id) => {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        await renderPage();
    } catch (e) {
        console.error(`Failed to delete the party with the ID: ${id}`, e);
    }
}

const renderPage = async () => {
    while (partiesContainer.children.length) {
        const child = partiesContainer.firstChild;
        partiesContainer.removeChild(child);
    }

    const parties = await getParties();
    state.parties = parties;

    state.parties.forEach((party) => {
        const partyContainer = createPartyItem(party);
        partiesContainer.appendChild(partyContainer);
    });
}

const addParty = async (party) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(party),
        });
        const json = await response.json();

        if (json.error) {
            throw new Error(json.error.message);
          }
    } catch (e) {
        console.error(`Failed to add the party.`, e);
    }
}

async function render() {
    await getParties();
    renderPage();
  }

const form = document.querySelector("form");
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const party = {
        name: form.partyName.value,
        date: form.date.value,
        location: form.location.value,
        description: form.description.value,
    };

    await addParty(party);
    render();
});

renderPage();