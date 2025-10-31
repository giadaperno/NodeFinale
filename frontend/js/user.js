const token = localStorage.getItem("token");
if (!token) window.location.href = "/login.html";

const headers = { 
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}` 
};

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
});

// Carica eventi pubblici
async function loadPublicEvents() {
  try {
    const res = await fetch("/api/events");
    const events = await res.json();
    const container = document.getElementById("eventsContainer");
    container.innerHTML = "";

    events.forEach(event => {
      const box = document.createElement("div");
      box.className = "event-box";
      box.innerHTML = `
        <h4>${event.title}</h4>
        <p>${event.description}</p>
        <p><strong>Luogo:</strong> ${event.location}</p>
        <p><strong>Data:</strong> ${new Date(event.date).toLocaleDateString()}</p>
        <button onclick="registerEvent(${event.id}, '${event.title}')">Iscriviti</button>
        <button onclick="cancelRegistration(${event.id}, '${event.title}')">Annulla iscrizione</button>
      `;
      container.appendChild(box);
    });
  } catch (err) {
    console.error("Errore nel caricamento degli eventi pubblici:", err);
  }
}

// Carica eventi creati dall’utente
async function loadMyCreatedEvents() {
  try {
    const res = await fetch("/api/events/my-created", { headers });
    const events = await res.json();
    const container = document.getElementById("myCreatedEvents");
    container.innerHTML = events.length
      ? events.map(e => `
          <div class="event-box">
            <h4>${e.title}</h4>
            <p>${new Date(e.date).toLocaleDateString()}</p>
            <button onclick="editEvent(${e.id})">Modifica</button>
            <button onclick="deleteEvent(${e.id})">Elimina</button>
          </div>
        `).join("")
      : "<p>Nessun evento creato.</p>";
  } catch (err) {
    console.error("Errore nel caricamento dei tuoi eventi:", err);
  }
}

// Carica eventi a cui l’utente è iscritto
async function loadMyRegisteredEvents() {
  try {
    const res = await fetch("/api/events/my-registered", { headers });
    const events = await res.json();
    const container = document.getElementById("myRegisteredEvents");
    container.innerHTML = events.length
      ? events.map(e => `
          <div class="event-box">
            <h4>${e.title}</h4>
            <p>${new Date(e.date).toLocaleDateString()}</p>
          </div>
        `).join("")
      : "<p>Nessuna iscrizione trovata.</p>";
  } catch (err) {
    console.error("Errore nel caricamento iscrizioni:", err);
  }
}

// Azioni eventi
function editEvent(id) {
  window.location.href = `/edit-event.html?id=${id}`;
}

async function deleteEvent(id) {
  if (confirm("Vuoi davvero eliminare questo evento?")) {
    await fetch(`/api/events/${id}`, { method: "DELETE", headers });
    loadMyCreatedEvents(); // aggiorna lista dopo eliminazione
  }
}

// Iscrizione a un evento
async function registerEvent(eventId, eventTitle) {
  try {
    const res = await fetch("/api/registrations", {
      method: "POST",
      headers,
      body: JSON.stringify({ eventId })
    });

    const data = await res.json();
    if (res.ok) {
      alert(`Ti sei iscritto a "${eventTitle}"`);
      loadMyRegisteredEvents();
    } else {
      alert(`Errore iscrizione: ${data.message}`);
    }
  } catch (err) {
    console.error("Errore iscrizione evento:", err);
  }
}

// Annulla iscrizione
async function cancelRegistration(eventId) {
  try {
    const res = await fetch(`/api/registrations/${eventId}`, { method: "DELETE", headers });
    const data = await res.json();

    if (res.ok) {
      alert(`${data.message}`);
      loadMyRegisteredEvents(); // aggiorna dashboard iscrizioni
      loadPublicEvents();       // aggiorna lista eventi pubblici
    } else {
      alert(`Errore annullamento: ${data.message}`);
    }
  } catch (err) {
    console.error(err);
    alert("Errore di connessione");
  }
}

// Inizializza dashboard
loadPublicEvents();
loadMyCreatedEvents();
loadMyRegisteredEvents();
