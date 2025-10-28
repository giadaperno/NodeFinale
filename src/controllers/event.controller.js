import Event from "../models/event.model.js";

// Crea un evento
export const createEvent = async (req, res) => {
  const { title, description, category, location, date } = req.body;
  const userId = req.user.id;

  try {
    const event = await Event.create({
      title,
      description,
      category,
      location,
      date,
      UserId: userId, // opzionale se vuoi collegare l'evento al creatore
    });

    res.status(201).json({ message: "Evento creato", event });
  } catch (error) {
    res.status(500).json({ message: "Errore server", error });
  }
};

// Lista eventi approvati
export const listEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ where: { isApproved: true } });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Errore server", error });
  }
};
