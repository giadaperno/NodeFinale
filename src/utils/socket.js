import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { jwtSecret } from "./jwt.js";

export function setupSocketIO(server) {
  const io = new Server(server);

  // Middleware per l'autenticazione
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    // Log utile per debug: non stampiamo il token intero per sicurezza
    console.log(`Socket auth token present: ${token ? 'yes' : 'no'}`);

    if (!token) {
      console.warn('Socket connection rejected: token mancante nel handshake');
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      socket.user = decoded;
      next();
    } catch (err) {
      // Log dettagliato lato server per capire il motivo (es. token scaduto)
      console.warn('Socket connection rejected: token non valido -', err.message);
      return next(new Error('Authentication error: ' + err.message));
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Se l'utente è admin, aggiungilo alla stanza 'admins' per notifiche globali
    try {
      if (socket.user && socket.user.role === 'admin') {
        socket.join('admins');
        console.log(`Admin ${socket.user.id} joined admins room`);
      }
    } catch (err) {
      console.warn('Errore nel join degli admin:', err.message);
    }

    socket.on("join-event", (eventId) => {
      socket.join(`event-${eventId}`);
      console.log(`User ${socket.user.id} joined event ${eventId}`);
    });

    socket.on("leave-event", (eventId) => {
      socket.leave(`event-${eventId}`);
      console.log(`User ${socket.user.id} left event ${eventId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}