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

// Inizializzazione Socket.IO
const socket = io({ 
  auth: { token },
  transports: ['websocket'],
  timeout: 5000
});

socket.on('connect', () => {
  // Socket connesso
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
  showNotification(`Nuova iscrizione evento ${payload.eventId}: ${payload.user?.name || 'Utente'}`, 4000, 'success');
  updateParticipantCount(payload.eventId, payload.participantCount);
});

socket.on('user-unregistered', (payload) => {
  showNotification(`Iscrizione annullata evento ${payload.eventId}: ${payload.user?.name || 'Utente'}`, 4000, 'info');
  updateParticipantCount(payload.eventId, payload.participantCount);
});

socket.on('participant-count-updated', (payload) => {
  updateParticipantCount(payload.eventId, payload.participantCount);
});

socket.on('event-reported', (payload) => {
  showNotification(`Segnalazione evento: ${payload.event?.title || payload.event?.id} da ${payload.reporter?.name || 'Utente'}`, 4000, 'info');
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  if (socket) {
    socket.disconnect();
  }
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

    // Recupera gli ID degli eventi a cui l'utente è iscritto
    const registeredEventsRes = await fetch("/api/registrations/user-events", { headers });
    const registeredEvents = await registeredEventsRes.json();
    const registeredEventIds = new Set(registeredEvents.map(event => event.id));

    events.forEach(event => {
      const eventDate = new Date(event.date);
      const isUpcoming = eventDate > new Date();
      const registeredCount = event.participantCount || 0;
      const capacityPercentage = (registeredCount / event.capacity) * 100;
      const isRegistered = registeredEventIds.has(event.id);
      const isFull = registeredCount >= event.capacity;
      
      // Determina il badge di stato
      let statusBadge = '';
      if (!isUpcoming) {
        statusBadge = '<span class="status-badge past"><i class="fas fa-history"></i> Passato</span>';
      } else if (isFull) {
        statusBadge = '<span class="status-badge full"><i class="fas fa-lock"></i> Al completo</span>';
      } else {
        statusBadge = '<span class="status-badge upcoming"><i class="fas fa-calendar-check"></i> Prossimo</span>';
      }

      const box = document.createElement("div");
      box.className = "event-box";
      box.setAttribute("data-event-id", event.id);
      box.innerHTML = `
        <img src="${event.image || '/assets/images/defaults/event-default.jpg'}" alt="${event.title}" class="event-image">
        <div class="event-content">
          <div>
            <span class="category-badge">${event.category || 'Generale'}</span>
            ${statusBadge}
          </div>
          <h3 class="event-title">${event.title}</h3>
          
          <div class="event-meta">
            <span><i class="fas fa-user"></i> Creato da: <span class="creator-name">${event.creatorName || 'Sconosciuto'}</span></span>
            <span><i class="fas fa-calendar"></i> Quando: ${eventDate.toLocaleDateString('it-IT', { 
              weekday: 'long',
              year: 'numeric', 
              month: 'long', 
              day: 'numeric'
            })}</span>
            <span><i class="fas fa-map-marker-alt"></i> Dove: ${event.location}</span>
          </div>

          <p class="event-description">${event.description || 'Nessuna descrizione disponibile'}</p>

          <div class="capacity-indicator">
            <span><i class="fas fa-users"></i> ${registeredCount}/${event.capacity} partecipanti</span>
            <div class="capacity-bar">
              <div class="capacity-fill" style="width: ${capacityPercentage}%"></div>
            </div>
          </div>

          <div class="event-actions">
            ${isUpcoming ? `
              ${!isRegistered ? `
                <button onclick="registerEvent(${event.id}, '${event.title.replace(/'/g, "\\'")}')" class="primary">
                  <i class="fas fa-check"></i> Iscriviti
                </button>
              ` : `
                <button onclick="cancelRegistration(${event.id})" class="secondary">
                  <i class="fas fa-times"></i> Annulla
                </button>
                <button onclick="openEventChat(${event.id}, '${event.title.replace(/'/g, "\\'")}')" class="primary">
                  <i class="fas fa-comments"></i> Chat
                </button>
              `}
              <button onclick="reportEvent(${event.id}, '${event.title.replace(/'/g, "\\'")}')" class="tertiary report-button">
                <i class="fas fa-flag"></i> Segnala
              </button>
            ` : '<span class="badge">Evento passato</span>'}
          </div>
        </div>
      `;
      container.appendChild(box);
    });
  } catch (err) {
    console.error("Errore nel caricamento degli eventi pubblici:", err);
  }
}

// Funzione per segnalare un evento
async function reportEvent(eventId, eventTitle) {
  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  if (!confirm(`Sei sicuro di voler segnalare l'evento "${eventTitle}"?`)) {
    return;
  }

  try {
    const res = await fetch(`/api/events/${eventId}/report`, {
      method: "POST",
      headers
    });

    const data = await res.json();
    if (res.ok) {
      showNotification(`Evento "${eventTitle}" segnalato con successo`, 4000, 'success');
    } else {
      showNotification(`Errore durante la segnalazione: ${data.message}`, 4000, 'error');
    }
  } catch (err) {
    console.error("Errore durante la segnalazione dell'evento:", err);
    showNotification("Errore durante la segnalazione dell'evento", 4000, 'error');
  }
}

// Carica eventi creati dall’utente
async function loadMyCreatedEvents() {
  try {
    const res = await fetch("/api/events/my-created", { headers });
    const events = await res.json();
    const container = document.getElementById("myCreatedEvents");
    container.innerHTML = events.length
      ? events.map(e => {
          const eventDate = new Date(e.date);
          const registeredCount = e.participantCount || 0;
          const capacityPercentage = (registeredCount / e.capacity) * 100;
          const isUpcoming = eventDate > new Date();
          const isFull = registeredCount >= e.capacity;
          
          // Determina il badge di stato
          let statusBadge = '';
          if (!isUpcoming) {
            statusBadge = '<span class="status-badge past"><i class="fas fa-history"></i> Passato</span>';
          } else if (isFull) {
            statusBadge = '<span class="status-badge full"><i class="fas fa-lock"></i> Al completo</span>';
          } else if (registeredCount > 0) {
            statusBadge = '<span class="status-badge available"><i class="fas fa-check"></i> Disponibile</span>';
          } else {
            statusBadge = '<span class="status-badge upcoming"><i class="fas fa-calendar-check"></i> Prossimo</span>';
          }
          
          return `
            <div class="event-box" data-event-id="${e.id}">
              <img src="${e.image || '/assets/images/defaults/event-default.jpg'}" alt="${e.title}" class="event-image">
              <div class="event-content">
                <div>
                  <span class="category-badge">${e.category || 'Generale'}</span>
                  ${statusBadge}
                </div>
                <h3 class="event-title">${e.title}</h3>
                
                <div class="event-meta">
                  <span><i class="fas fa-user"></i> Creato da: <span class="creator-name">${e.creatorName || 'Sconosciuto'}</span></span>
                  <span><i class="fas fa-calendar"></i> Quando: ${eventDate.toLocaleDateString('it-IT', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}</span>
                  <span><i class="fas fa-map-marker-alt"></i> Dove: ${e.location}</span>
                </div>

                <div class="capacity-indicator">
                  <span><i class="fas fa-users"></i> ${registeredCount}/${e.capacity} partecipanti</span>
                  <div class="capacity-bar">
                    <div class="capacity-fill" style="width: ${capacityPercentage}%"></div>
                  </div>
                </div>

                <div class="event-actions">
                  <button onclick="editEvent(${e.id})" class="primary">
                    <i class="fas fa-edit"></i> Modifica
                  </button>
                  <button onclick="deleteEvent(${e.id})" class="secondary">
                    <i class="fas fa-trash"></i> Elimina
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join("")
      : "<p>Nessun evento creato.</p>";
  } catch (err) {
    console.error("Errore nel caricamento dei tuoi eventi:", err);
  }
}

// Carica eventi a cui l'utente è iscritto
async function loadMyRegisteredEvents() {
  try {
    const res = await fetch("/api/registrations/user-events", { headers });
    const events = await res.json();
    const container = document.getElementById("myRegisteredEvents");
    container.innerHTML = events.length
      ? events.map(e => {
          const eventDate = new Date(e.date);
          const isUpcoming = eventDate > new Date();
          const registeredCount = e.participantCount || 0;
          const capacityPercentage = (registeredCount / e.capacity) * 100;
          const isFull = registeredCount >= e.capacity;
          
          // Determina il badge di stato
          let statusBadge = '';
          if (!isUpcoming) {
            statusBadge = '<span class="status-badge past"><i class="fas fa-history"></i> Passato</span>';
          } else if (isFull) {
            statusBadge = '<span class="status-badge full"><i class="fas fa-users"></i> Al completo</span>';
          } else {
            statusBadge = '<span class="status-badge upcoming"><i class="fas fa-calendar-check"></i> Prossimo</span>';
          }
          
          return `
            <div class="event-box" data-event-id="${e.id}">
              <img src="${e.image || '/assets/images/defaults/event-default.jpg'}" alt="${e.title}" class="event-image">
              <div class="event-content">
                <div>
                  <span class="category-badge">${e.category || 'Generale'}</span>
                  ${statusBadge}
                </div>
                <h3 class="event-title">${e.title}</h3>
                
                <div class="event-meta">
                  <span><i class="fas fa-user"></i> Creato da: <span class="creator-name">${e.creatorName || 'Sconosciuto'}</span></span>
                  <span><i class="fas fa-calendar"></i> Quando: ${eventDate.toLocaleDateString('it-IT', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}</span>
                  <span><i class="fas fa-map-marker-alt"></i> Dove: ${e.location}</span>
                </div>

                <p class="event-description">${e.description || 'Nessuna descrizione disponibile'}</p>

                <div class="capacity-indicator">
                  <span><i class="fas fa-users"></i> ${registeredCount}/${e.capacity} partecipanti</span>
                  <div class="capacity-bar">
                    <div class="capacity-fill" style="width: ${capacityPercentage}%"></div>
                  </div>
                </div>

                <div class="event-actions">
                  ${isUpcoming ? `
                    <button onclick="openEventChat(${e.id}, '${e.title.replace(/'/g, "\\'")}')" class="primary">
                      <i class="fas fa-comments"></i> Chat
                    </button>
                    <button onclick="cancelRegistration(${e.id})" class="secondary">
                      <i class="fas fa-times"></i> Annulla iscrizione
                    </button>
                  ` : '<span class="badge">Evento passato</span>'}
                </div>
              </div>
            </div>
          `;
        }).join("")
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
  if (!token) {
    window.location.href = "/login.html";
    return;
  }
  
  try {
    const res = await fetch("/api/registrations", {
      method: "POST",
      headers,
      body: JSON.stringify({ eventId })
    });

    const data = await res.json();
    if (res.ok) {
      showNotification(`Ti sei iscritto a "${eventTitle}"`, 4000, 'success');
      // Ricarica tutte le sezioni per aggiornare i pulsanti
      loadPublicEvents();
      loadMyRegisteredEvents();
    } else {
      showNotification(`Errore iscrizione: ${data.message}`, 4000, 'error');
    }
  } catch (err) {
    console.error("Errore iscrizione evento:", err);
    showNotification("Errore durante l'iscrizione", 4000, 'error');
  }
}

// Annulla iscrizione a un evento
async function cancelRegistration(eventId) {
  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  try {
    const res = await fetch(`/api/registrations/${eventId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    showNotification("Iscrizione annullata con successo", 4000, 'success');
    // Ricarica tutte le sezioni per aggiornare i pulsanti
    loadPublicEvents();
    loadMyRegisteredEvents();
  } catch (err) {
    showNotification(`Errore: ${err.message}`, 4000, 'error');
  }
}

// Chat functions
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

// Toast notification con progress bar automatica
function showNotification(text, timeout = 4000, type = 'info') {
  let container = document.getElementById('notificationContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notificationContainer';
    document.body.appendChild(container);
  }

  const el = document.createElement('div');
  el.className = `toast-notification ${type}`;
  
  // Icone diverse per tipo
  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-check-circle';
  if (type === 'error') icon = 'fa-exclamation-circle';
  
  el.innerHTML = `
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    <div class="toast-content">
      <i class="fas ${icon}"></i>
      <span>${text}</span>
    </div>
  `;
  
  container.appendChild(el);

  // Rimuovi automaticamente dopo il timeout
  setTimeout(() => {
    el.classList.add('hide');
    setTimeout(() => el.remove(), 300);
  }, timeout);
}

// Funzione per aggiornare il contatore dei partecipanti in tempo reale
function updateParticipantCount(eventId, participantCount) {
  // Trova tutti gli elementi che mostrano l'evento (può apparire in più sezioni)
  const eventBoxes = document.querySelectorAll(`[data-event-id="${eventId}"]`);
  
  eventBoxes.forEach(box => {
    const capacityIndicator = box.querySelector('.capacity-indicator span');
    const capacityFill = box.querySelector('.capacity-fill');
    
    if (capacityIndicator && capacityFill) {
      // Estrai la capacità massima dall'elemento
      const capacityMatch = capacityIndicator.textContent.match(/\/(\d+)/);
      const capacity = capacityMatch ? parseInt(capacityMatch[1]) : 0;
      
      // Aggiorna il testo
      capacityIndicator.innerHTML = `<i class="fas fa-users"></i> ${participantCount}/${capacity} partecipanti`;
      
      // Aggiorna la barra di progresso
      const percentage = capacity > 0 ? (participantCount / capacity) * 100 : 0;
      capacityFill.style.width = `${percentage}%`;
      
      // Animazione visiva per evidenziare il cambiamento
      box.style.transition = 'transform 0.3s ease';
      box.style.transform = 'scale(1.02)';
      setTimeout(() => {
        box.style.transform = 'scale(1)';
      }, 300);
    }
  });
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
    showNotification('Errore nell\'invio del messaggio', 4000, 'error');
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

// Inizializza dashboard
loadPublicEvents();
loadMyCreatedEvents();
loadMyRegisteredEvents();
