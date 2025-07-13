const directoryContainer = document.getElementById('directory');
const gridViewBtn = document.getElementById('gridViewBtn');
const listViewBtn = document.getElementById('listViewBtn');

async function loadMembers() {
  try {
    const response = await fetch('data/members.json');
    const members = await response.json();
    displayMembers(members);
  } catch (error) {
    console.error('Error fetching member data:', error);
  }
}

function displayMembers(members) {
  directoryContainer.innerHTML = '';

  members.forEach(member => {
    const card = document.createElement('div');
    card.classList.add('business-card');

    card.innerHTML = `
      <div class="business-image">🏢</div>
      <div class="business-info">
        <div class="business-name">${member.name}</div>
        <div class="business-tagline">Membership: ${["Member","Silver","Gold"][member.membership-1]}</div>
        <div class="business-details">
          <div><strong>ADDRESS:</strong> ${member.address}</div>
          <div><strong>PHONE:</strong> ${member.phone}</div>
          <div><strong>URL:</strong> <a href="${member.website}" target="_blank">${member.website}</a></div>
        </div>
      </div>
    `;

    directoryContainer.appendChild(card);
  });
}

function setGridView() {
  directoryContainer.classList.remove('list-view');
}

function setListView() {
  directoryContainer.classList.add('list-view');
}

gridViewBtn.addEventListener('click', setGridView);
listViewBtn.addEventListener('click', setListView);

document.getElementById('currentYear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

loadMembers();

document.getElementById("currentYear").textContent = new Date().getFullYear();
