import EventRegistration from "../models/eventRegistration.model.js"; 
import Event from "../models/event.model.js";
import User from "../models/user.model.js"; // Importa il modello User
import { getIO } from "../utils/io.js"; // Importa getIO

// Crea evento
export const createEvent = async (req, res) => {
  const { title, description, category, location, date, capacity, image } = req.body;
  const userId = req.user.id;

  try {
    const event = await Event.create({
      title,
      description,
      category,
      location,
      date,
      capacity,
      image,
      UserId: userId, // collegamento al creatore
      isApproved: false,
    });

    console.log("Creatore evento:", userId, "UserId nell'evento:", event.UserId);

    res.status(201).json({ message: "Evento creato con successo", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

// Lista eventi pubblici, con filtri per data, categoria e luogo (con ricerca parziale)
export const listEvents = async (req, res) => {
  try {
    const { date, category, location } = req.query;

    const filters = { isApproved: true };

    if (date) filters.date = date;
    if (category) filters.category = { [Op.like]: `%${category}%` };
    if (location) filters.location = { [Op.like]: `%${location}%` };

    const events = await Event.findAll({ where: filters });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

// Dettaglio evento
export const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ message: "Evento non trovato" });
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, location, date, capacity, image } = req.body;

  console.log("Utente che modifica:", req.user.id, "Ruolo:", req.user.role);

  try {
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ message: "Evento non trovato" });

    if (event.UserId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorizzato" });
    }

    event.title = title ?? event.title;
    event.description = description ?? event.description;
    event.category = category ?? event.category;
    event.location = location ?? event.location;
    event.date = date ?? event.date;
    event.capacity = capacity ?? event.capacity;
    event.image = image ?? event.image;

    await event.save();
    res.json({ message: "Evento aggiornato con successo", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  console.log("Utente che cancella:", req.user.id, "Ruolo:", req.user.role);

  try {
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ message: "Evento non trovato" });

    if (event.UserId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorizzato" });
    }

    await event.destroy();
    res.json({ message: "Evento cancellato con successo" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

// Eventi creati dall'utente autenticato
export const getUserCreatedEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await Event.findAll({
      where: { UserId: userId },
      order: [["date", "DESC"]],
    });
    res.json(events);
  } catch (error) {
    console.error("Errore getUserCreatedEvents:", error);
    res.status(500).json({ message: "Errore nel recupero eventi creati" });
  }
};

// Eventi a cui l'utente autenticato si è registrato
export const getUserRegisteredEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const registrations = await EventRegistration.findAll({
      where: { UserId: userId },
      include: [{ model: Event, as: "event" }], // usa l'alias corretto
    });

    // Estrai l'evento dall'alias
    const events = registrations.map(r => r.event);
    res.json(events);
    
  } catch (error) {
    console.error("Errore getUserRegisteredEvents:", error);
    res.status(500).json({ message: "Errore nel recupero eventi iscritti" });
  }
};

// Segnala un evento
export const reportEvent = async (req, res) => {
  const { id } = req.params;
  const reporterId = req.user.id;

  try {
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ message: "Evento non trovato" });

    const reporter = await User.findByPk(reporterId, { attributes: ['id', 'name'] });

    // Emetti notifica live agli admin
    const io = getIO();
    if (io) {
      io.emit('event-reported', { 
        event: event.toJSON(), 
        reporter: reporter?.toJSON() 
      });
    }

    console.log(`Evento ${id} segnalato dall'utente ${reporterId}`);
    res.status(200).json({ message: `Evento ${id} segnalato con successo.` });
  } catch (error) {
    console.error("Errore durante la segnalazione dell'evento:", error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};