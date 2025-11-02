import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import Registration from "../models/registration.model.js";
import { getIO } from "../utils/io.js";

// Invia un messaggio nella chat dell'evento
export const sendMessage = async (req, res) => {
  const userId = req.user.id;
  const { eventId, message } = req.body;

  try {
    // Verifica che l'utente sia registrato all'evento
    const registration = await Registration.findOne({
      where: { UserId: userId, EventId: eventId }
    });

    if (!registration) {
      return res.status(403).json({ message: "Devi essere registrato all'evento per partecipare alla chat" });
    }

    const chat = await Chat.create({
      message,
      UserId: userId,
      EventId: eventId
    });

    // Recupera il messaggio creato con i dati utente inclusi
    const created = await Chat.findByPk(chat.id, {
      include: [{ model: User, attributes: ["id", "name"] }]
    });

    // Emetti l'evento socket.io per aggiornamento real-time
    const io = getIO();
    console.log('sendMessage: io instance present?', !!io);
    if (io) {
      io.to(`event-${eventId}`).emit('new-message', created.toJSON());
    } else {
      console.warn('Socket.io non inizializzato, evento non emesso');
    }

    res.json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

// Ottieni i messaggi della chat di un evento
export const getEventMessages = async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.params;

  try {
    // Verifica che l'utente sia registrato all'evento
    const registration = await Registration.findOne({
      where: { UserId: userId, EventId: eventId }
    });

    if (!registration) {
      return res.status(403).json({ message: "Devi essere registrato all'evento per vedere la chat" });
    }

    const messages = await Chat.findAll({
      where: { EventId: eventId },
      include: [{
        model: User,
        attributes: ['id', 'name']
      }],
      order: [['timestamp', 'ASC']]
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};