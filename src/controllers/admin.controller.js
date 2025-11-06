import Event from "../models/event.model.js";
import User from "../models/user.model.js";
import Registration from "../models/registration.model.js";
import Chat from "../models/chat.model.js";
import Notification from "../models/notification.model.js";


/**
 * Approva evento
 */

export const approveEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ message: "Evento non trovato" });

    event.isApproved = true;
    await event.save();
    res.json({ message: "Evento approvato con successo", event });
  } catch (error) {
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

/**
 * Rifiuta evento
 */

export const rejectEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ message: "Evento non trovato" });

    await event.destroy(); // oppure aggiungere flag "isRejected"
    res.json({ message: "Evento rifiutato ed eliminato" });
  } catch (error) {
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

/**
 * Blocca utente
 */

export const blockUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Utente non trovato" });

    user.isActive = false;
    await user.save();

    res.json({ message: `Utente ${user.name} bloccato con successo`, user });
  } catch (error) {
    res.status(500).json({ message: "Errore durante il blocco utente", error: error.message });
  }
};

/**
 * Sblocca utente
 */
export const unblockUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Utente non trovato" });

    user.isActive = true;
    await user.save();

    res.json({ message: `Utente ${user.name} sbloccato con successo`, user });
  } catch (error) {
    res.status(500).json({ message: "Errore durante lo sblocco utente", error: error.message });
  }
};

// Mostra tutti gli utenti
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "isActive", "createdAt"]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero utenti", error: error.message });
  }
};

/**
 * Eventi in attesa di approvazione
 */
export const getPendingEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ where: { isApproved: false } });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

/**
 * Tutti gli eventi (admin può modificare o cancellare)
 */
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

/**
 * Statistiche generali (Dashboard Admin)
 */
export const getStats = async (req, res) => {
  try {
    // Conta totale utenti
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    const blockedUsers = await User.count({ where: { isActive: false } });

    // Conta totale eventi
    const totalEvents = await Event.count();
    const approvedEvents = await Event.count({ where: { isApproved: true } });
    const pendingEvents = await Event.count({ where: { isApproved: false } });

    // Conta registrazioni
    const totalRegistrations = await Registration.count();

    // Conta messaggi chat
    const totalMessages = await Chat.count();

    // Conta notifiche
    const totalNotifications = await Notification.count();
    const unreadNotifications = await Notification.count({ where: { isRead: false } });

    // Categoria eventi più popolare
    const eventsByCategory = await Event.findAll({
      where: { isApproved: true },
      attributes: [
        'category',
        [Event.sequelize.fn('COUNT', Event.sequelize.col('id')), 'count']
      ],
      group: ['category'],
      order: [[Event.sequelize.literal('count'), 'DESC']],
      limit: 5
    });

    // Eventi con più partecipanti
    const topEventsRaw = await Event.findAll({
      where: { isApproved: true },
      include: [{
        model: User,
        as: "participants",
        attributes: ['id'],
        through: { attributes: [] }
      }]
    });

    // Conta partecipanti e ordina
    const topEvents = topEventsRaw.map(event => {
      const eventData = event.toJSON();
      eventData.participantCount = eventData.participants ? eventData.participants.length : 0;
      delete eventData.participants;
      return eventData;
    })
    .sort((a, b) => b.participantCount - a.participantCount)
    .slice(0, 5);

    // Utenti più attivi (più iscrizioni)
    const topUsersRaw = await User.findAll({
      include: [{
        model: Event,
        as: "registeredEvents",
        attributes: ['id'],
        through: { attributes: [] }
      }],
      attributes: ['id', 'name', 'email']
    });

    // Conta eventi e ordina
    const topUsers = topUsersRaw.map(user => {
      const userData = user.toJSON();
      userData.eventCount = userData.registeredEvents ? userData.registeredEvents.length : 0;
      delete userData.registeredEvents;
      return userData;
    })
    .sort((a, b) => b.eventCount - a.eventCount)
    .slice(0, 5);

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        blocked: blockedUsers
      },
      events: {
        total: totalEvents,
        approved: approvedEvents,
        pending: pendingEvents
      },
      registrations: {
        total: totalRegistrations
      },
      messages: {
        total: totalMessages
      },
      notifications: {
        total: totalNotifications,
        unread: unreadNotifications
      },
      topEventsByCategory: eventsByCategory,
      topEventsByParticipants: topEvents,
      topActiveUsers: topUsers
    });
  } catch (error) {
    console.error("Errore getStats:", error);
    res.status(500).json({ message: "Errore nel recupero statistiche", error: error.message });
  }
};

