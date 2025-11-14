
---

## Struttura del Progetto

# EventHub — Piattaforma per la gestione di eventi

EventHub è un'applicazione web per creare, gestire e partecipare a eventi. Questo README riassume come installare, eseguire e testare l'app in ambiente di sviluppo.

## Contenuti rapidi

- Installazione in 3 comandi
- Avvio locale
- Account di test per sviluppo
- Link utili e troubleshooting
 - Live demo: https://nodefinale-ffso.onrender.com

---

## Installazione rapida

1. Clona il repository e vai nella cartella `EventHub`:

```bash
git clone https://github.com/giadaperno/NodeFinale.git
cd NodeFinale/EventHub
```

2. Installa le dipendenze:

```bash
npm install
```

3. Crea un file `.env` (vedi sezione esempio più sotto) e poi avvia il server:

```bash
npm run dev   # sviluppo (nodemon)
# oppure
npm start     # produzione
```

Apri `http://localhost:5000` nel browser.

---

## Account di test (sviluppo)

Gli account di test sono presenti in un file txt che si chiama `credenzialibase.txt`, il quale è presente nella cartella precedente di Eventhub, ovvero nodefinale.

## Uso di base

- Registrazione: `Registrati` → inserisci nome, email, password
- Login: `Accedi` → ottieni JWT e accedi alle pagine protette
- Creazione evento: dopo login clicca `Crea Evento`; gli eventi verranno approvati da un admin
- Pannello admin: `http://localhost:5000/admin.html` (accessibile solo agli admin)

---

## Struttura del progetto (breve)

```
EventHub/
├─ frontend/   # HTML, CSS, JS statici
├─ src/        # backend (Express, controllers, routes, models)
├─ server.js
├─ package.json
└─ README.md
```

Per dettagli vedi la sezione completa più in basso.

---

## API principali

- `POST /api/auth/register`  → registrazione
- `POST /api/auth/login`     → login
- `POST /api/auth/forgot-password` → invio email reset
- `/api/events/*`            → gestione eventi
- `/api/users/*`             → gestione utenti

Per la documentazione completa degli endpoint, gli endpoint principali sono elencati sopra.

---

## Suggerimenti per il deploy e la sicurezza

- Usa `helmet` e `express-rate-limit` in produzione.
- Limita CORS alle origini fidate.
- Non permettere il set del campo `role` da client (solo server/ops).
- Proteggi qualsiasi endpoint di creazione/promozione admin.
- Usa HTTPS e mantieni i segreti in ambiente sicuro.

---

## Troubleshooting rapido

- Errore DB: controlla `.env` e la connessione al DB.
- Porta occupata: cambia `PORT` o interrompi il processo che la usa.
- Email non inviate: verifica credenziali SMTP e controlla lo spam.

---

## Script utili

- `npm start` — avvia in produzione
- `npm run dev` — avvia in sviluppo (nodemon)

Esempio script per creare/promuovere un admin in sviluppo: `scripts/createAdmin.js` (non distribuire in produzione).

---

## Autore

Giada Perno

---

Per qualsiasi domanda apri una issue su GitHub.
