import Registration from "../models/registration.model.js";
import Event from "../models/event.model.js";

// Iscrizione a un evento
export const registerToEvent = async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.body;

  try {
    const event = await Event.findOne({ where: { id: eventId, isApproved: true } });
    if (!event) return res.status(404).json({ message: "Evento non trovato o non approvato" });

    const alreadyRegistered = await Registration.findOne({ where: { UserId: userId, EventId: eventId } });
    if (alreadyRegistered) return res.status(400).json({ message: "Già iscritto" });

    const registration = await Registration.create({ UserId: userId, EventId: eventId });

    res.json({ message: "Iscrizione avvenuta con successo", registration });
  } catch (error) {
    res.status(500).json({ message: "Errore server", error });
  }
};
