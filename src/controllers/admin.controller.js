import Event from "../models/event.model.js";
import User from "../models/user.model.js";


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

