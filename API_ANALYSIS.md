# Analisi API RESTful - EventHub

## 📋 Riepilogo API Esistenti

### ✅ API Autenticazione (`/api/auth`)
- ✅ `POST /api/auth/register` - Registrazione utente
- ✅ `POST /api/auth/login` - Login utente
- ✅ `POST /api/auth/logout` - Logout (richiede token)
- ✅ `POST /api/auth/forgot-password` - Richiesta reset password
- ✅ `POST /api/auth/reset-password/:token` - Reset password

### ✅ API Eventi (`/api/events`)
- ✅ `POST /api/events` - Crea evento (autenticato)
- ✅ `GET /api/events` - Lista eventi pubblici approvati (con filtri: date, category, location)
- ✅ `GET /api/events/:id` - Dettaglio evento
- ✅ `PUT /api/events/:id` - Modifica evento (autenticato, solo creatore/admin)
- ✅ `DELETE /api/events/:id` - Elimina evento (autenticato, solo creatore/admin)
- ✅ `GET /api/events/my-created` - Eventi creati dall'utente autenticato
- ✅ `POST /api/events/:id/report` - Segnala evento (autenticato)

### ✅ API Registrazioni (`/api/registrations`)
- ✅ `GET /api/registrations/user-events` - Eventi a cui l'utente è iscritto
- ✅ `POST /api/registrations` - Iscrizione a un evento
- ✅ `DELETE /api/registrations/:eventId` - Annulla iscrizione

### ✅ API Admin (`/api/admin`)
**Eventi:**
- ✅ `PUT /api/admin/events/:id/approve` - Approva evento
- ✅ `PUT /api/admin/events/:id/reject` - Rifiuta evento
- ✅ `GET /api/admin/events/pending` - Eventi in attesa di approvazione
- ✅ `GET /api/admin/events/all` - Tutti gli eventi (approvati e non)

**Utenti:**
- ✅ `PUT /api/admin/users/:id/block` - Blocca utente
- ✅ `PUT /api/admin/users/:id/unblock` - Sblocca utente
- ✅ `GET /api/admin/users` - Lista tutti gli utenti

### ✅ API Chat (`/api/chat`)
- ✅ `GET /api/chat/:eventId` - Messaggi di un evento (autenticato, solo iscritti)
- ✅ `POST /api/chat` - Invia messaggio (autenticato, solo iscritti)

### ✅ API Notifiche (`/api/notifications`) - Solo Admin
- ✅ `GET /api/notifications` - Tutte le notifiche (query: limit, onlyUnread)
- ✅ `PUT /api/notifications/:id/read` - Segna come letta
- ✅ `PUT /api/notifications/read-all` - Segna tutte come lette
- ✅ `DELETE /api/notifications/:id` - Elimina notifica
- ✅ `DELETE /api/notifications/read/all` - Elimina tutte le lette

---

## ❌ API MANCANTI - Da Implementare

### 🔴 CRITICO: API Profilo Utente (`/api/users`)

**Problema**: Non esiste alcuna API per gestire il profilo utente!

#### API da creare:
1. **`GET /api/users/me`** - Ottieni profilo utente corrente
   - Input: Token JWT
   - Output: `{ id, name, email, role, createdAt, isActive }`

2. **`PUT /api/users/me`** - Modifica profilo utente
   - Input: `{ name?, email? }`
   - Output: Profilo aggiornato

3. **`PUT /api/users/me/password`** - Cambia password (utente loggato)
   - Input: `{ oldPassword, newPassword }`
   - Output: `{ message: "Password aggiornata" }`

4. **`DELETE /api/users/me`** - Elimina account (opzionale)
   - Input: Token JWT
   - Output: `{ message: "Account eliminato" }`

5. **`GET /api/users/:id`** - Profilo pubblico di un utente (opzionale)
   - Input: User ID
   - Output: `{ id, name, createdAt }` (solo dati pubblici)

---

## API COMPLETATE

### API Profilo Utente (`/api/users`)

Tutte le API critiche per la gestione del profilo utente sono state implementate:

1. ✅ **`GET /api/users/me`** - Ottieni profilo utente corrente
2. ✅ **`PUT /api/users/me`** - Modifica profilo utente
3. ✅ **`PUT /api/users/me/password`** - Cambia password (utente loggato)
4. ✅ **`DELETE /api/users/me`** - Elimina account
5. ✅ **`GET /api/users/:id`** - Profilo pubblico di un utente

### API Eventi Avanzate

Tutte le API opzionali per gli eventi sono state implementate:

1. ✅ **`GET /api/events/:id/participants`** - Lista partecipanti di un evento
2. ✅ **`GET /api/events/popular`** - Eventi più popolari (ordinati per partecipanti)
3. ✅ **`GET /api/events/upcoming`** - Eventi futuri (ordinati per data)

### API Statistiche Admin

1. ✅ **`GET /api/admin/stats`** - Statistiche complete della piattaforma

---

## Riepilogo Finale

### Totale Endpoints Implementati: 45

**Autenticazione (5)**
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/forgot-password
- POST /api/auth/reset-password/:token

**Utenti (5)**
- GET /api/users/me
- PUT /api/users/me
- PUT /api/users/me/password
- DELETE /api/users/me
- GET /api/users/:id

**Eventi (11)**
- GET /api/events
- GET /api/events/popular
- GET /api/events/upcoming
- GET /api/events/:id
- GET /api/events/:id/participants
- POST /api/events
- PUT /api/events/:id
- DELETE /api/events/:id
- GET /api/events/my-created
- POST /api/events/:id/report

**Registrazioni (3)**
- GET /api/registrations/user-events
- POST /api/registrations
- DELETE /api/registrations/:eventId

**Chat (2)**
- GET /api/chat/:eventId
- POST /api/chat

**Admin Eventi (4)**
- PUT /api/admin/events/:id/approve
- PUT /api/admin/events/:id/reject
- GET /api/admin/events/pending
- GET /api/admin/events/all

**Admin Utenti (3)**
- GET /api/admin/users
- PUT /api/admin/users/:id/block
- PUT /api/admin/users/:id/unblock

**Admin Statistiche (1)**
- GET /api/admin/stats

**Notifiche (5)**
- GET /api/notifications
- PUT /api/notifications/:id/read
- PUT /api/notifications/read-all
- DELETE /api/notifications/:id
- DELETE /api/notifications/read/all

---

## 🔴 API MANCANTI - Da Implementare

### 🟡 OPZIONALE: Miglioramenti Consigliati

### API Eventi
- `GET /api/events/:id/participants` - Lista partecipanti di un evento
- `GET /api/events/popular` - Eventi più popolari (ordinati per partecipanti)
- `GET /api/events/upcoming` - Eventi futuri (ordinati per data)

### API Statistiche (Admin)
- `GET /api/admin/stats` - Statistiche generali (totale utenti, eventi, registrazioni)

---

## Prossimi Step

1. ✅ Analisi completata
2. ✅ Implementare `user.routes.js` e `user.controller.js`
3. ✅ Registrare `/api/users` in `app.js`
4. ✅ Implementare API eventi avanzate
5. ✅ Implementare API statistiche admin
6. ⏳ Testare tutte le nuove API
7. ⏳ Aggiornare la documentazione API completa

---

## Note Tecniche

### Nuove Funzionalità Implementate

**1. API Profilo Utente (`user.controller.js`)**
- `getMyProfile`: Restituisce profilo completo utente autenticato
- `updateMyProfile`: Modifica nome e/o email con validazione unicità
- `changePassword`: Cambio password con verifica vecchia password
- `deleteMyAccount`: Eliminazione account con conferma password
- `getUserProfile`: Profilo pubblico di qualsiasi utente (solo id, name, createdAt)

**2. API Eventi Avanzate (`event.controller.js`)**
- `getEventParticipants`: Lista dettagliata partecipanti con data iscrizione
- `getPopularEvents`: Top eventi per numero partecipanti (query param: limit)
- `getUpcomingEvents`: Eventi futuri ordinati per data (query param: limit)

**3. API Statistiche Admin (`admin.controller.js`)**
- `getStats`: Dashboard completa con:
  - Contatori: utenti (totali/attivi/bloccati), eventi (totali/approvati/pending)
  - Metriche: registrazioni totali, messaggi chat, notifiche (totali/non lette)
  - Top 5: categorie più popolari, eventi con più partecipanti, utenti più attivi

### Considerazioni Tecniche

- Tutte le API usano Sequelize per query ottimizzate
- Le statistiche usano aggregazioni SQL (COUNT, GROUP BY)
- Validazione unicità su email e username
- Password hashate con bcrypt prima del salvataggio
- Tutti gli errori loggati con `console.error`
- Response HTTP appropriati (200, 201, 400, 403, 404, 500)

---

## 📝 Note Importanti

- Tutte le route protette usano middleware `verifyToken` o `verifyAdmin`
- Le route admin richiedono sia `verifyToken` che `verifyAdmin`
- Socket.IO è usato per notifiche real-time (non è REST ma complementare)
- Il file `user.routes.js` esiste ma è **vuoto**
- Il file `user.controller.js` esiste ma è **vuoto**
