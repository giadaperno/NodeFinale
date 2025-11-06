# EventHub - Documentazione API RESTful

## 📌 Base URL
```
http://localhost:5000/api
https://nodefinale-ffso.onrender.com/api
```

---

## 🔐 Autenticazione

Tutte le route protette richiedono un token JWT nell'header:
```
Authorization: Bearer <token>
```

---

## 1️⃣ Auth (`/api/auth`)

### Registrazione
```http
POST /api/auth/register
```
**Body:**
```json
{
  "name": "Mario Rossi",
  "email": "mario@example.com",
  "password": "password123",
  "role": "user"
}
```
**Response:** `201 Created`
```json
{
  "message": "Utente registrato con successo",
  "userId": 1
}
```

---

### Login
```http
POST /api/auth/login
```
**Body:**
```json
{
  "email": "mario@example.com",
  "password": "password123"
}
```
**Response:** `200 OK`
```json
{
  "message": "Login effettuato",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Mario Rossi",
    "email": "mario@example.com",
    "role": "user"
  }
}
```

---

### Logout
```http
POST /api/auth/logout
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
{
  "message": "Logout effettuato con successo"
}
```

---

### Richiesta Reset Password
```http
POST /api/auth/forgot-password
```
**Body:**
```json
{
  "email": "mario@example.com"
}
```
**Response:** `200 OK`
```json
{
  "message": "Se l'email è registrata, riceverai un link per il reset della password."
}
```

---

### Reset Password
```http
POST /api/auth/reset-password/:token
```
**Body:**
```json
{
  "newPassword": "newpassword123"
}
```
**Response:** `200 OK`
```json
{
  "message": "Password aggiornata con successo"
}
```

---

## 2️⃣ Users (`/api/users`) 🆕

### Ottieni Profilo Corrente
```http
GET /api/users/me
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Mario Rossi",
  "email": "mario@example.com",
  "role": "user",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "isActive": true
}
```

---

### Modifica Profilo
```http
PUT /api/users/me
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "name": "Mario Verdi",
  "email": "marioverdi@example.com"
}
```
**Response:** `200 OK`
```json
{
  "message": "Profilo aggiornato con successo",
  "user": {
    "id": 1,
    "name": "Mario Verdi",
    "email": "marioverdi@example.com",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "isActive": true
  }
}
```

---

### Cambia Password
```http
PUT /api/users/me/password
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "oldPassword": "password123",
  "newPassword": "newpassword456"
}
```
**Response:** `200 OK`
```json
{
  "message": "Password aggiornata con successo"
}
```

---

### Elimina Account
```http
DELETE /api/users/me
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "password": "password123"
}
```
**Response:** `200 OK`
```json
{
  "message": "Account eliminato con successo"
}
```

---

### Profilo Pubblico Utente
```http
GET /api/users/:id
```
**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Mario Rossi",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

## 3️⃣ Events (`/api/events`)

### Lista Eventi Pubblici
```http
GET /api/events?date=2025-01-15&category=Musica&location=Milano
```
**Query Parameters:**
- `date` (opzionale): Filtra per data (formato: YYYY-MM-DD)
- `category` (opzionale): Filtra per categoria (ricerca parziale)
- `location` (opzionale): Filtra per luogo (ricerca parziale)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Concerto Rock",
    "description": "Un grande concerto",
    "category": "Musica",
    "location": "Milano",
    "date": "2025-01-15T20:00:00.000Z",
    "capacity": 100,
    "image": "/assets/images/events/concerto.jpg",
    "isApproved": true,
    "participantCount": "45"
  }
]
```

---

### Dettaglio Evento
```http
GET /api/events/:id
```
**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Concerto Rock",
  "description": "Un grande concerto",
  "category": "Musica",
  "location": "Milano",
  "date": "2025-01-15T20:00:00.000Z",
  "capacity": 100,
  "image": "/assets/images/events/concerto.jpg",
  "isApproved": true,
  "UserId": 2,
  "participantCount": "45"
}
```

---

### Crea Evento
```http
POST /api/events
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "title": "Concerto Jazz",
  "description": "Serata jazz nel cuore di Roma",
  "category": "Musica",
  "location": "Roma",
  "date": "2025-02-20T21:00:00.000Z",
  "capacity": 80,
  "image": "https://example.com/jazz.jpg"
}
```
**Response:** `201 Created`
```json
{
  "message": "Evento creato con successo",
  "event": {
    "id": 5,
    "title": "Concerto Jazz",
    "description": "Serata jazz nel cuore di Roma",
    "category": "Musica",
    "location": "Roma",
    "date": "2025-02-20T21:00:00.000Z",
    "capacity": 80,
    "image": "https://example.com/jazz.jpg",
    "UserId": 1,
    "isApproved": false
  }
}
```

---

### Modifica Evento
```http
PUT /api/events/:id
Headers: Authorization: Bearer <token>
```
**Body:** (tutti i campi opzionali)
```json
{
  "title": "Concerto Jazz Modificato",
  "capacity": 100
}
```
**Response:** `200 OK`
```json
{
  "message": "Evento aggiornato con successo",
  "event": { ... }
}
```

---

### Elimina Evento
```http
DELETE /api/events/:id
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
{
  "message": "Evento cancellato con successo"
}
```

---

### Eventi Creati dall'Utente
```http
GET /api/events/my-created
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
[
  {
    "id": 5,
    "title": "Concerto Jazz",
    "isApproved": false,
    "participantCount": "0",
    ...
  }
]
```

---

### Eventi Più Popolari
```http
GET /api/events/popular?limit=10
```
**Query Parameters:**
- `limit` (opzionale, default: 10): Numero massimo di eventi da restituire

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Concerto Rock",
    "description": "Un grande concerto",
    "category": "Musica",
    "location": "Milano",
    "date": "2025-01-15T20:00:00.000Z",
    "capacity": 100,
    "image": "/assets/images/events/concerto.jpg",
    "isApproved": true,
    "participantCount": "150"
  }
]
```

---

### Eventi Futuri
```http
GET /api/events/upcoming?limit=20
```
**Query Parameters:**
- `limit` (opzionale, default: 20): Numero massimo di eventi da restituire

**Response:** `200 OK`
```json
[
  {
    "id": 3,
    "title": "Workshop Fotografia",
    "description": "Corso base di fotografia",
    "category": "Formazione",
    "location": "Torino",
    "date": "2025-01-20T10:00:00.000Z",
    "capacity": 30,
    "image": "/assets/images/events/workshop.jpg",
    "isApproved": true,
    "participantCount": "12"
  }
]
```
**Note:** Restituisce solo eventi con data >= oggi, ordinati dal più vicino al più lontano

---

### Lista Partecipanti Evento
```http
GET /api/events/:id/participants
```
**Response:** `200 OK`
```json
{
  "eventId": 1,
  "eventTitle": "Concerto Rock",
  "totalParticipants": 3,
  "participants": [
    {
      "id": 1,
      "name": "Mario Rossi",
      "email": "mario@example.com",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "EventRegistration": {
        "createdAt": "2025-01-10T12:00:00.000Z"
      }
    },
    {
      "id": 2,
      "name": "Luigi Bianchi",
      "email": "luigi@example.com",
      "createdAt": "2025-01-02T00:00:00.000Z",
      "EventRegistration": {
        "createdAt": "2025-01-11T14:30:00.000Z"
      }
    }
  ]
}
```

---

### Segnala Evento
```http
POST /api/events/:id/report
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
{
  "message": "Evento 1 segnalato con successo."
}
```

---

## 4️⃣ Registrations (`/api/registrations`)

### Iscrizione a un Evento
```http
POST /api/registrations
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "eventId": 1
}
```
**Response:** `200 OK`
```json
{
  "message": "Iscrizione avvenuta con successo",
  "registration": {
    "id": 10,
    "UserId": 1,
    "EventId": 1
  }
}
```

---

### Annulla Iscrizione
```http
DELETE /api/registrations/:eventId
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
{
  "message": "Iscrizione annullata con successo"
}
```

---

### Eventi a cui sono Iscritto
```http
GET /api/registrations/user-events
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Concerto Rock",
    "description": "Un grande concerto",
    "date": "2025-01-15T20:00:00.000Z",
    "location": "Milano",
    "category": "Musica",
    "image": "/assets/images/events/concerto.jpg",
    "capacity": 100,
    "participantCount": 45
  }
]
```

---

## 5️⃣ Chat (`/api/chat`)

### Messaggi di un Evento
```http
GET /api/chat/:eventId
Headers: Authorization: Bearer <token>
```
**Requisito:** Utente deve essere iscritto all'evento

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "message": "Ciao a tutti!",
    "timestamp": "2025-01-10T15:30:00.000Z",
    "UserId": 2,
    "EventId": 1,
    "User": {
      "id": 2,
      "name": "Luigi Bianchi"
    }
  }
]
```

---

### Invia Messaggio
```http
POST /api/chat
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "eventId": 1,
  "message": "Non vedo l'ora!"
}
```
**Response:** `200 OK`
```json
{
  "id": 15,
  "message": "Non vedo l'ora!",
  "timestamp": "2025-01-10T16:00:00.000Z",
  "UserId": 1,
  "EventId": 1,
  "User": {
    "id": 1,
    "name": "Mario Rossi"
  }
}
```

---

## 6️⃣ Admin - Eventi (`/api/admin`)

**Tutte le route richiedono autenticazione + ruolo admin**

### Approva Evento
```http
PUT /api/admin/events/:id/approve
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
{
  "message": "Evento approvato con successo",
  "event": { ... }
}
```

---

### Rifiuta Evento
```http
PUT /api/admin/events/:id/reject
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
{
  "message": "Evento rifiutato ed eliminato"
}
```

---

### Eventi in Attesa di Approvazione
```http
GET /api/admin/events/pending
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
[
  {
    "id": 5,
    "title": "Concerto Jazz",
    "isApproved": false,
    ...
  }
]
```

---

### Tutti gli Eventi (Approvati e Non)
```http
GET /api/admin/events/all
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
[
  { "id": 1, "title": "Concerto Rock", "isApproved": true, ... },
  { "id": 5, "title": "Concerto Jazz", "isApproved": false, ... }
]
```

---

## 7️⃣ Admin - Utenti (`/api/admin`)

### Lista Tutti gli Utenti
```http
GET /api/admin/users
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Mario Rossi",
    "email": "mario@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### Blocca Utente
```http
PUT /api/admin/users/:id/block
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
{
  "message": "Utente Mario Rossi bloccato con successo",
  "user": { ... }
}
```

---

### Sblocca Utente
```http
PUT /api/admin/users/:id/unblock
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
{
  "message": "Utente Mario Rossi sbloccato con successo",
  "user": { ... }
}
```

---

## 8️⃣ Admin - Statistiche (`/api/admin`)

### Statistiche Piattaforma
```http
GET /api/admin/stats
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
{
  "users": {
    "total": 150,
    "active": 145,
    "blocked": 5
  },
  "events": {
    "total": 75,
    "approved": 60,
    "pending": 15
  },
  "registrations": {
    "total": 450
  },
  "messages": {
    "total": 1250
  },
  "notifications": {
    "total": 30,
    "unread": 8
  },
  "topEventsByCategory": [
    {
      "category": "Musica",
      "count": 25
    },
    {
      "category": "Sport",
      "count": 20
    }
  ],
  "topEventsByParticipants": [
    {
      "id": 1,
      "title": "Concerto Rock",
      "participantCount": "150",
      ...
    }
  ],
  "topActiveUsers": [
    {
      "id": 5,
      "name": "Giulia Verdi",
      "email": "giulia@example.com",
      "eventCount": "12"
    }
  ]
}
```

---

## 9️⃣ Notifiche (`/api/notifications`) - Solo Admin
  {
    "id": 1,
    "name": "Mario Rossi",
    "email": "mario@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### Blocca Utente
```http
PUT /api/admin/users/:id/block
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
{
  "message": "Utente Mario Rossi bloccato con successo",
  "user": { ... }
}
```

---

### Sblocca Utente
```http
PUT /api/admin/users/:id/unblock
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
{
  "message": "Utente Mario Rossi sbloccato con successo",
  "user": { ... }
}
```

---

## 8️⃣ Notifiche (`/api/notifications`) - Solo Admin

### Tutte le Notifiche
```http
GET /api/notifications?limit=50&onlyUnread=true
Headers: Authorization: Bearer <token>
```
**Query Parameters:**
- `limit` (opzionale, default: 50): Numero massimo di notifiche
- `onlyUnread` (opzionale): "true" per solo non lette

**Response:** `200 OK`
```json
{
  "notifications": [
    {
      "id": 1,
      "type": "event-reported",
      "title": "Evento Segnalato",
      "message": "L'evento \"Concerto Rock\" è stato segnalato da Mario Rossi",
      "eventId": 1,
      "userId": 3,
      "isRead": false,
      "createdAt": "2025-01-10T12:00:00.000Z"
    }
  ],
  "unreadCount": 5
}
```

---

### Segna come Letta
```http
PUT /api/notifications/:id/read
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
{
  "message": "Notifica segnata come letta",
  "notification": { ... }
}
```

---

### Segna Tutte come Lette
```http
PUT /api/notifications/read-all
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
{
  "message": "Tutte le notifiche sono state segnate come lette"
}
```

---

### Elimina Notifica
```http
DELETE /api/notifications/:id
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
{
  "message": "Notifica eliminata"
}
```

---

### Elimina Tutte le Notifiche Lette
```http
DELETE /api/notifications/read/all
Headers: Authorization: Bearer <token>
```
**Response:** `200 OK`
```json
{
  "message": "15 notifiche eliminate"
}
```

---

## 🔴 Codici di Errore

- `400 Bad Request` - Dati non validi o mancanti
- `401 Unauthorized` - Token mancante o non valido
- `403 Forbidden` - Non autorizzato (es. non admin, non creatore)
- `404 Not Found` - Risorsa non trovata
- `500 Internal Server Error` - Errore server

**Formato errore:**
```json
{
  "message": "Descrizione errore"
}
```

---

## 🚀 WebSocket (Socket.IO)

L'applicazione usa Socket.IO per notifiche real-time:

**Eventi emessi dal server:**
- `new-message` - Nuovo messaggio in chat evento
- `user-registered` - Utente iscritto a evento
- `user-unregistered` - Utente disiscritto da evento
- `participant-count-updated` - Conteggio partecipanti aggiornato
- `event-reported` - Evento segnalato
- `new-admin-notification` - Nuova notifica per admin

**Connessione:**
```javascript
const socket = io('http://localhost:5000', {
  auth: { token: 'JWT_TOKEN' }
});

socket.emit('join-event', eventId);
```

---

## 📝 Note Importanti

1. **Autenticazione**: Le route protette richiedono header `Authorization: Bearer <token>`
2. **Admin**: Le route admin richiedono `role: "admin"`
3. **Date**: Usare formato ISO 8601: `2025-01-15T20:00:00.000Z`
4. **Filtri**: I filtri su `category` e `location` usano ricerca parziale (LIKE %keyword%)
5. **Validazione**: Email e nomi utente devono essere unici
6. **Password**: Minimo 6 caratteri
7. **Eventi**: Dopo creazione, richiedono approvazione admin (`isApproved: false`)

---

## ✅ Testing

### Esempio con curl:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mario@example.com","password":"password123"}'

# Get profilo (usa il token dal login)
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Lista eventi
curl -X GET "http://localhost:5000/api/events?category=Musica"
```

### Esempio con Postman/Insomnia:

1. Importa la collezione API
2. Crea una variabile `{{token}}` per il JWT
3. Imposta `Authorization: Bearer {{token}}` nelle headers

---

## 🎯 Riepilogo Endpoints

| Metodo | Endpoint | Autenticazione | Ruolo |
|--------|----------|----------------|-------|
| POST | `/api/auth/register` | ❌ | - |
| POST | `/api/auth/login` | ❌ | - |
| POST | `/api/auth/logout` | ✅ | user |
| POST | `/api/auth/forgot-password` | ❌ | - |
| POST | `/api/auth/reset-password/:token` | ❌ | - |
| GET | `/api/users/me` | ✅ | user |
| PUT | `/api/users/me` | ✅ | user |
| PUT | `/api/users/me/password` | ✅ | user |
| DELETE | `/api/users/me` | ✅ | user |
| GET | `/api/users/:id` | ❌ | - |
| GET | `/api/events` | ❌ | - |
| GET | `/api/events/popular` | ❌ | - |
| GET | `/api/events/upcoming` | ❌ | - |
| GET | `/api/events/:id` | ❌ | - |
| GET | `/api/events/:id/participants` | ❌ | - |
| POST | `/api/events` | ✅ | user |
| PUT | `/api/events/:id` | ✅ | owner/admin |
| DELETE | `/api/events/:id` | ✅ | owner/admin |
| GET | `/api/events/my-created` | ✅ | user |
| POST | `/api/events/:id/report` | ✅ | user |
| POST | `/api/registrations` | ✅ | user |
| DELETE | `/api/registrations/:eventId` | ✅ | user |
| GET | `/api/registrations/user-events` | ✅ | user |
| GET | `/api/chat/:eventId` | ✅ | registered |
| POST | `/api/chat` | ✅ | registered |
| PUT | `/api/admin/events/:id/approve` | ✅ | admin |
| PUT | `/api/admin/events/:id/reject` | ✅ | admin |
| GET | `/api/admin/events/pending` | ✅ | admin |
| GET | `/api/admin/events/all` | ✅ | admin |
| GET | `/api/admin/users` | ✅ | admin |
| PUT | `/api/admin/users/:id/block` | ✅ | admin |
| PUT | `/api/admin/users/:id/unblock` | ✅ | admin |
| GET | `/api/admin/stats` | ✅ | admin |
| GET | `/api/notifications` | ✅ | admin |
| PUT | `/api/notifications/:id/read` | ✅ | admin |
| PUT | `/api/notifications/read-all` | ✅ | admin |
| DELETE | `/api/notifications/:id` | ✅ | admin |
| DELETE | `/api/notifications/read/all` | ✅ | admin |

**Totale: 45 endpoints RESTful** ✅
