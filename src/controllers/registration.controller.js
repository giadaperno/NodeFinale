import Registration from "../models/registration.model.js";
import Event from "../models/event.model.js";

// Iscrizione a un evento
export const registerToEvent = async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.body;

  try {
    // Controlla che l'evento esista e sia approvato
    const event = await Event.findOne({ where: { id: eventId, isApproved: true } });
    if (!event) return res.status(404).json({ message: "Evento non trovato o non approvato" });

    // Controlla se l'utente è già iscritto
    const alreadyRegistered = await Registration.findOne({ where: { UserId: userId, EventId: eventId } });
    if (alreadyRegistered) return res.status(400).json({ message: "Già iscritto" });

    // Crea la registrazione
    const registration = await Registration.create({ UserId: userId, EventId: eventId });
    res.json({ message: "Iscrizione avvenuta con successo", registration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

// Annulla iscrizione a un evento
export const cancelRegistration = async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.body;

  try {
    // Cerca la registrazione
    const registration = await Registration.findOne({ where: { UserId: userId, EventId: eventId } });
    if (!registration) return res.status(404).json({ message: "Registrazione non trovata" });

    // Elimina la registrazione
    await registration.destroy();
    res.json({ message: "Iscrizione annullata con successo" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};
