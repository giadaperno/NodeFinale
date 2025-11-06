# EventHub - Piattaforma di Gestione Eventi

EventHub è una piattaforma web completa per la creazione, gestione e partecipazione a eventi. Gli utenti possono creare eventi, iscriversi, chattare con altri partecipanti e ricevere notifiche in tempo reale.

---

## Caratteristiche Principali

- **Gestione Eventi**: Crea, modifica ed elimina eventi con informazioni dettagliate (titolo, descrizione, data, luogo, categoria, capacità)
- **Sistema di Approvazione**: Gli eventi creati dagli utenti richiedono l'approvazione di un amministratore
- **Registrazione Eventi**: Gli utenti possono iscriversi e annullare l'iscrizione agli eventi
- **Chat in Tempo Reale**: Ogni evento ha una chat dedicata per i partecipanti registrati
- **Notifiche Live**: Sistema di notifiche in tempo reale tramite WebSocket (Socket.IO)
- **Pannello Admin**: Dashboard completa per gestire eventi, utenti e notifiche
- **Autenticazione Sicura**: Registrazione, login, logout e reset password via email
- **Profilo Utente**: Gestione completa del profilo personale
- **API RESTful**: Tutte le funzionalità sono accessibili tramite API REST documentate

---

## Tecnologie Utilizzate

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM per database
- **MySQL** - Database relazionale (hosting su Aiven)
- **JWT** - Autenticazione tramite token
- **bcrypt** - Hashing password
- **Socket.IO** - Comunicazione real-time
- **Nodemailer** - Invio email

### Frontend
- **HTML5** - Struttura
- **CSS3** - Stile e layout
- **JavaScript** (Vanilla) - Logica client-side
- **Socket.IO Client** - WebSocket per notifiche real-time
- **Font Awesome** - Icone

---

## Prerequisiti

Prima di iniziare, assicurati di avere installato:

1. **Node.js** (versione 14 o superiore)
   - Scarica da: https://nodejs.org/
   - Verifica installazione: apri il terminale e digita `node --version`

2. **npm** (incluso con Node.js)
   - Verifica installazione: digita `npm --version` nel terminale

3. **MySQL** (opzionale, il database è già configurato su cloud)

4. **Git** (opzionale, per clonare il repository)
   - Scarica da: https://git-scm.com/

---

## Installazione - Guida Passo Passo

### 1. Scarica il Progetto

**Opzione A - Con Git (consigliato):**
```bash
git clone https://github.com/giadaperno/NodeFinale.git
cd NodeFinale/EventHub
```

**Opzione B - Download Manuale:**
1. Vai su https://github.com/giadaperno/NodeFinale
2. Clicca sul pulsante verde "Code"
3. Seleziona "Download ZIP"
4. Estrai il file ZIP
5. Apri la cartella "EventHub" estratta

---

### 2. Installa le Dipendenze

Apri il terminale nella cartella del progetto (`EventHub`) e digita:

```bash
npm install
```

Questo comando installerà automaticamente tutte le librerie necessarie (potrebbe richiedere qualche minuto).

---

### 3. Configura le Variabili d'Ambiente

Crea un file chiamato `.env` nella cartella principale del progetto (`EventHub`) e inserisci le seguenti configurazioni:

```env
# Database Configuration
DB_HOST=letturaplatform-database2025.d.aivencloud.com
DB_PORT=19066
DB_NAME=esamefinale
DB_USER=avnadmin
DB_PASS=AVNS_DFVsOXnbh36sqsURNRA

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=tua-email@example.com
EMAIL_PASS=tua-password-app

# JWT Secret
JWT_SECRET=mysupersecretkey13579

# Frontend URL
FRONTEND_URL=http://localhost:5000
```

**IMPORTANTE**: 
- Sostituisci `EMAIL_USER` con il tuo indirizzo Gmail
- Sostituisci `EMAIL_PASS` con una "Password per le app" di Google (non la password normale)
  - Per creare una password per le app: vai su Google Account > Sicurezza > Verifica in due passaggi > Password per le app

---

### 4. Avvia il Server

Nel terminale, digita:

```bash
npm start
```

Oppure, per la modalità sviluppo (riavvio automatico):

```bash
npm run dev
```

Vedrai questo messaggio se tutto è andato a buon fine:

```
Connessione a MySQL riuscita!
Modelli sincronizzati con il database
Server avviato su http://localhost:5000
```

---

### 5. Apri l'Applicazione

Apri il tuo browser preferito e vai su:

```
http://localhost:5000
```

---

## Utilizzo

### Per Utenti Normali

1. **Registrazione**:
   - Clicca su "Registrati"
   - Compila il form con nome, email e password
   - Effettua il login con le credenziali create

2. **Visualizza Eventi**:
   - La homepage mostra tutti gli eventi approvati
   - Usa i filtri per cercare per data, categoria o luogo

3. **Crea un Evento**:
   - Dopo il login, clicca su "Crea Evento"
   - Compila il form con tutti i dettagli
   - L'evento sarà visibile dopo l'approvazione dell'admin

4. **Iscriviti a un Evento**:
   - Clicca su "Iscriviti" nella card dell'evento
   - Potrai vedere l'evento nella sezione "I Miei Eventi"

5. **Chat dell'Evento**:
   - Entra in un evento a cui sei iscritto
   - Usa la chat per comunicare con gli altri partecipanti

6. **Gestisci il Profilo**:
   - Accedi alla pagina utente
   - Modifica nome, email o password
   - Visualizza i tuoi eventi creati e quelli a cui sei iscritto

### Per Amministratori

1. **Accedi al Pannello Admin**:
   - Effettua il login con un account admin
   - Vai su `http://localhost:5000/admin.html`

2. **Approva/Rifiuta Eventi**:
   - Visualizza gli eventi in attesa di approvazione
   - Clicca su "Approva" o "Rifiuta"

3. **Gestisci Utenti**:
   - Visualizza tutti gli utenti registrati
   - Blocca o sblocca utenti se necessario

4. **Notifiche**:
   - Ricevi notifiche in tempo reale per eventi segnalati
   - Gestisci e segna come lette le notifiche

---

## Struttura del Progetto

```
EventHub/
│
├── frontend/                 # File frontend (HTML, CSS, JS)
│   ├── index.html           # Homepage pubblica
│   ├── login.html           # Pagina di login
│   ├── register.html        # Pagina di registrazione
│   ├── user.html            # Dashboard utente
│   ├── admin.html           # Dashboard amministratore
│   ├── create-event.html    # Form creazione evento
│   ├── edit-event.html      # Form modifica evento
│   ├── reset-password.html  # Reset password
│   ├── css/                 # Fogli di stile
│   └── js/                  # Script JavaScript
│
├── src/                     # Codice backend
│   ├── app.js              # Configurazione Express
│   ├── config/             # Configurazioni (DB, Email)
│   ├── controllers/        # Logica business
│   ├── middleware/         # Middleware (autenticazione, errori)
│   ├── models/             # Modelli Sequelize (DB)
│   ├── routes/             # Route API
│   └── utils/              # Utilità (JWT, Socket.IO, Email)
│
├── server.js               # Entry point applicazione
├── package.json            # Dipendenze e script
├── .env                    # Variabili d'ambiente (NON committare!)
├── .gitignore             # File ignorati da Git
├── API_DOCUMENTATION.md   # Documentazione API REST
└── README.md              # Questo file
```

---

## API REST

L'applicazione espone una API RESTful completa. Consulta il file `API_DOCUMENTATION.md` per la documentazione dettagliata di tutti gli endpoint disponibili.

**Endpoints principali:**

- `/api/auth/*` - Autenticazione (register, login, logout, reset password)
- `/api/users/*` - Gestione profilo utente
- `/api/events/*` - CRUD eventi
- `/api/registrations/*` - Iscrizioni eventi
- `/api/chat/*` - Messaggi chat
- `/api/admin/*` - Funzioni amministrative
- `/api/notifications/*` - Gestione notifiche

---

## Database

Il database MySQL è ospitato su **Aiven Cloud** e contiene le seguenti tabelle:

- **Users** - Utenti registrati
- **Events** - Eventi creati
- **EventRegistrations** - Iscrizioni agli eventi (relazione many-to-many)
- **Chats** - Messaggi delle chat
- **Notifications** - Notifiche per gli amministratori

Le relazioni tra le tabelle sono gestite tramite Sequelize ORM.

---

## Sicurezza

- **Password**: Hashate con bcrypt (10 round)
- **Autenticazione**: JWT con scadenza 7 giorni
- **Token Reset Password**: Scadenza 1 ora
- **CORS**: Abilitato per permettere richieste cross-origin
- **Protezione Route**: Middleware di autenticazione per route protette
- **Validazione Input**: Controlli su email, password e dati utente
- **Variabili Sensibili**: Configurate tramite file `.env` (non tracciato da Git)

---

## Deployment

### Hosting Consigliati

**Backend:**
- Render (gratuito) - https://render.com/
- Railway
- Heroku

**Database:**
- Aiven MySQL (attualmente in uso)
- PlanetScale
- AWS RDS

**Frontend:**
- Servito direttamente dal backend Express
- Opzionale: Netlify o Vercel per hosting statico separato

### Configurazione Render (esempio)

1. Crea un nuovo Web Service su Render
2. Collega il repository GitHub
3. Imposta le variabili d'ambiente nel pannello "Environment"
4. Build Command: `npm install`
5. Start Command: `npm start`
6. L'applicazione sarà disponibile su `https://nome-app.onrender.com`

**IMPORTANTE**: Ricordati di aggiornare `FRONTEND_URL` con l'URL di produzione!

---

## Troubleshooting

### Il server non si avvia

- Verifica che Node.js sia installato: `node --version`
- Controlla che le dipendenze siano installate: `npm install`
- Verifica che la porta 5000 non sia già occupata

### Errore "Connessione database fallita"

- Controlla che le credenziali nel file `.env` siano corrette
- Verifica la connessione internet (il DB è su cloud)

### Email non arrivano

- Verifica che `EMAIL_USER` e `EMAIL_PASS` siano corretti
- Assicurati di usare una "Password per le app" di Google, non la password normale
- Controlla lo spam/posta indesiderata

### Errore "Token non valido"

- Il token JWT potrebbe essere scaduto (7 giorni)
- Effettua nuovamente il login

---

## Script Disponibili

```bash
npm start        # Avvia il server in modalità produzione
npm run dev      # Avvia il server in modalità sviluppo (con nodemon)
npm test         # Esegue i test (attualmente non implementato)
```

---

## Funzionalità Future (TODO)

- Upload immagini eventi (attualmente solo URL)
- Sistema di recensioni/feedback eventi
- Calendario eventi integrato
- Notifiche email per nuovi eventi
- Esportazione lista partecipanti (CSV/PDF)
- Sistema di tag per eventi
- Ricerca avanzata eventi
- Dashboard statistiche admin
- App mobile (React Native)

---

## Contribuire

Se vuoi contribuire al progetto:

1. Fai un fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/nuova-funzionalita`)
3. Committa le modifiche (`git commit -m 'Aggiunta nuova funzionalità'`)
4. Pusha il branch (`git push origin feature/nuova-funzionalita`)
5. Apri una Pull Request

---

## Licenza

Questo progetto è stato creato per scopi didattici.

---

## Autore

Giada Perno

---

## Supporto

Per domande o problemi, apri una issue su GitHub o contatta l'autore.

---

## Link Utili

- Repository GitHub: https://github.com/giadaperno/NodeFinale
- Documentazione API: Vedi `API_DOCUMENTATION.md`
- Node.js: https://nodejs.org/
- Express.js: https://expressjs.com/
- Sequelize: https://sequelize.org/
- Socket.IO: https://socket.io/