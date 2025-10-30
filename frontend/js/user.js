const token = localStorage.getItem('token');
if (!token) window.location.href = '/login.html';

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/login.html';
});

// Carica eventi pubblici
async function loadPublicEvents() {
  const res = await fetch('/api/events');
  const events = await res.json();
  const container = document.getElementById('eventsContainer');
  container.innerHTML = '';
  events.forEach(event => {
    const box = document.createElement('div');
    box.className = 'event-box';
    box.innerHTML = `
      <h4>${event.title}</h4>
      <p>${event.description}</p>
      <p><strong>Luogo:</strong> ${event.location}</p>
      <p><strong>Data:</strong> ${new Date(event.date).toLocaleDateString()}</p>
      <button onclick="registerEvent(${event.id}, '${event.title}')">Iscriviti</button>
      <button onclick="cancelEvent(${event.id}, '${event.title}')">Annulla iscrizione</button>
    `;
    container.appendChild(box);
  });
}

// Carica eventi creati dall'utente
async function loadMyCreatedEvents() {
  const res = await fetch('/api/events/my-events', { headers: { Authorization: `Bearer ${token}` } });
  const events = await res.json();
  const container = document.getElementById('myCreatedEvents');
  container.innerHTML = events.map(e => `<div>${e.title} <button onclick="window.location.href='/edit-event.html?id=${e.id}'">Modifica</button></div>`).join('');
}

// Carica eventi a cui l'utente è iscritto
async function loadMyRegisteredEvents() {
  const res = await fetch('/api/registrations/my-registrations', { headers: { Authorization: `Bearer ${token}` } });
  const events = await res.json();
  const container = document.getElementById('myRegisteredEvents');
  container.innerHTML = events.map(e => `<div>${e.Event.title}</div>`).join('');
}

// Inizializza
loadPublicEvents();
loadMyCreatedEvents();
loadMyRegisteredEvents();
