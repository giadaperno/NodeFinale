const token = localStorage.getItem("token");
if (!token) window.location.href = "/login.html";

// Redirect admin users to admin.html
const payload = JSON.parse(atob(token.split('.')[1]));
if (payload.role === 'admin') {
  window.location.href = "/admin.html";
}

const headers = { 
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}` 
};

// Debug info
console.log('Token presente:', !!token);
console.log('Token decodificato:', JSON.parse(atob(token.split('.')[1])));

// Inizializzazione Socket.IO
const socket = io({ 
  auth: { token },
  transports: ['websocket'],
  timeout: 5000
});

socket.on('connect', () => {
  console.log('Socket connesso:', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('Errore connessione socket:', err.message);
  console.error('Dettagli errore:', err);
});

socket.on('new-message', (message) => {
  if (message.EventId === currentEventId) {
    appendMessage(message);
  }
});

socket.on('user-registered', (payload) => {
  console.log('user-registered', payload);
  showNotification(`Nuova iscrizione evento ${payload.eventId}: ${payload.user?.name || 'Utente'}`);
});

socket.on('user-unregistered', (payload) => {
  console.log('user-unregistered', payload);
  showNotification(`Iscrizione annullata evento ${payload.eventId}: ${payload.user?.name || 'Utente'}`);
});

socket.on('event-reported', (payload) => {
  console.log('event-reported', payload);
  showNotification(`Segnalazione evento: ${payload.event?.title || payload.event?.id} da ${payload.reporter?.name || 'Utente'}`);
});

// 🔹 Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  if (socket) {
    socket.disconnect();
  }
  localStorage.removeItem("token");
  window.location.href = "/login.html";
});

// 🔹 Carica eventi pubblici
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
        <button onclick="openEventChat(${event.id}, '${event.title}')">Chat</button>
      `;
      container.appendChild(box);
    });
  } catch (err) {
    console.error("Errore nel caricamento degli eventi pubblici:", err);
  }
}

// 🔹 Carica eventi creati dall’utente
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

// 🔹 Carica eventi a cui l'utente è iscritto
async function loadMyRegisteredEvents() {
  try {
    const res = await fetch("/api/registrations/user-events", { headers });
    const events = await res.json();
    const container = document.getElementById("myRegisteredEvents");
    container.innerHTML = events.length
      ? events.map(e => `
          <div class="event-box">
            <h4>${e.title}</h4>
            <p>${e.description}</p>
            <p><strong>Luogo:</strong> ${e.location}</p>
            <p><strong>Data:</strong> ${new Date(e.date).toLocaleDateString()}</p>
            <button onclick="cancelRegistration(${e.id})">Annulla iscrizione</button>
          </div>
        `).join("")
      : "<p>Nessuna iscrizione trovata.</p>";
  } catch (err) {
    console.error("Errore nel caricamento iscrizioni:", err);
  }
}

// 🔹 Azioni eventi
function editEvent(id) {
  window.location.href = `/edit-event.html?id=${id}`;
}

async function deleteEvent(id) {
  if (confirm("Vuoi davvero eliminare questo evento?")) {
    await fetch(`/api/events/${id}`, { method: "DELETE", headers });
    loadMyCreatedEvents(); // aggiorna lista dopo eliminazione
  }
}

// 🔹 Iscrizione a un evento
async function registerEvent(eventId, eventTitle) {
  try {
    const res = await fetch("/api/registrations", {
      method: "POST",
      headers,
      body: JSON.stringify({ eventId })
    });

    const data = await res.json();
    if (res.ok) {
      alert(`✅ Ti sei iscritto a "${eventTitle}"`);
      loadMyRegisteredEvents(); // aggiorna dashboard
    } else {
      alert(`⚠️ Errore iscrizione: ${data.message}`);
    }
  } catch (err) {
    console.error("Errore iscrizione evento:", err);
  }
}

// 🔹 Annulla iscrizione a un evento
async function cancelRegistration(eventId) {
  try {
    const res = await fetch(`/api/registrations/${eventId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    alert(`✅ Iscrizione annullata`);
    loadMyRegisteredEvents(); // aggiorna dashboard
  } catch (err) {
    alert(`⚠️ Errore: ${err.message}`);
  }
}

// 🔹 Chat functions
let currentEventId;

async function openEventChat(eventId, eventTitle) {
  currentEventId = eventId;
  
  // Join the event's chat room
  socket.emit('join-event', eventId);
  
  // Create chat modal if it doesn't exist
  let chatModal = document.getElementById('chatModal');
  if (!chatModal) {
    chatModal = document.createElement('div');
    chatModal.id = 'chatModal';
    chatModal.className = 'chat-modal';
    chatModal.innerHTML = `
      <div class="chat-content">
        <div class="chat-header">
          <h3>Chat: <span id="chatEventTitle"></span></h3>
          <button onclick="closeChatModal()">✖</button>
        </div>
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input">
          <input type="text" id="messageInput" placeholder="Scrivi un messaggio...">
          <button onclick="sendChatMessage()">Invia</button>
        </div>
      </div>
    `;
    document.body.appendChild(chatModal);
  }
  
  document.getElementById('chatEventTitle').textContent = eventTitle;
  chatModal.style.display = 'block';
  
  // Load existing messages
  await loadChatMessages(eventId);
}

function closeChatModal() {
  const chatModal = document.getElementById('chatModal');
  if (chatModal) {
    chatModal.style.display = 'none';
  }
  if (socket && currentEventId) socket.emit('leave-event', currentEventId);
  currentEventId = null;
}

async function loadChatMessages(eventId) {
  try {
    const res = await fetch(`/api/chat/${eventId}`, { headers });
    const messages = await res.json();
    
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    messages.forEach(message => appendMessage(message));
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (err) {
    console.error('Errore nel caricamento dei messaggi:', err);
  }
}

// Toast notification semplice
function showNotification(text, timeout = 4000) {
  let container = document.getElementById('notificationContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notificationContainer';
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = 2000;
    document.body.appendChild(container);
  }

  const el = document.createElement('div');
  el.className = 'toast-notification';
  el.style.background = '#333';
  el.style.color = 'white';
  el.style.padding = '8px 12px';
  el.style.marginTop = '8px';
  el.style.borderRadius = '6px';
  el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  el.textContent = text;
  container.appendChild(el);

  setTimeout(() => {
    el.style.transition = 'opacity 0.3s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, timeout);
}

function appendMessage(message) {
  const chatMessages = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'chat-message';
  messageDiv.innerHTML = `
    <strong>${message.User.name}</strong>: ${message.message}
    <small>${new Date(message.timestamp).toLocaleTimeString()}</small>
  `;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendChatMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        eventId: currentEventId,
        message
      })
    });
    
    if (!res.ok) throw new Error('Errore nell\'invio del messaggio');
    input.value = '';
  } catch (err) {
    console.error('Errore nell\'invio del messaggio:', err);
    alert('Errore nell\'invio del messaggio');
  }
}

// Add event listener for message input
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('keypress', (e) => {
    if (e.target.id === 'messageInput' && e.key === 'Enter') {
      sendChatMessage();
    }
  });
});

// 🔹 Inizializza dashboard
loadPublicEvents();
loadMyCreatedEvents();
loadMyRegisteredEvents();
