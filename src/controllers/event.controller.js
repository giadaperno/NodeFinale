import Event from "../models/event.model.js";
import User from "../models/user.model.js";
import { getIO } from "../utils/io.js";
import { createNotification } from "./notification.controller.js";
import { Op } from "sequelize";
import sequelize from "../config/db.js";

// Crea evento
export const createEvent = async (req, res) => {
  const { title, description, category, location, date, capacity, image } = req.body;
  const userId = req.user.id;

  try {
    // Verifica se esiste già un evento con lo stesso titolo (globalmente)
    const existingEvent = await Event.findOne({
      where: {
        title: title.trim()
      }
    });

    if (existingEvent) {
      // Se l'evento esiste ed è in attesa di approvazione
      if (!existingEvent.isApproved) {
        return res.status(400).json({ 
          message: "Esiste già una richiesta di approvazione in attesa per un evento con questo titolo. Scegli un titolo diverso." 
        });
      }
      // Se l'evento esiste ed è già approvato
      return res.status(400).json({ 
        message: "Esiste già un evento con questo titolo. Scegli un titolo diverso per il tuo evento." 
      });
    }

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

    if (date) {
      const day = new Date(date);
      const startOfDay = new Date(day);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(day);
      endOfDay.setHours(23, 59, 59, 999);
      filters.date = { [Op.between]: [startOfDay, endOfDay] };
    }
    if (category) filters.category = { [Op.like]: `%${category}%` };
    if (location) filters.location = { [Op.like]: `%${location}%` };

    const events = await Event.findAll({
      where: filters,
      include: [
        {
          model: User,
          as: "participants",
          attributes: ['id'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: "creator",
          attributes: ['id', 'name']
        }
      ]
    });

    // Aggiungi il conteggio partecipanti e il nome del creatore
    const eventsWithCount = events.map(event => {
      const eventData = event.toJSON();
      eventData.participantCount = eventData.participants ? eventData.participants.length : 0;
      eventData.creatorName = eventData.creator ? eventData.creator.name : 'Sconosciuto';
      delete eventData.participants;
      delete eventData.creator;
      return eventData;
    });

    res.json(eventsWithCount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

// Dettaglio evento
export const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "participants",
          attributes: ['id'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: "creator",
          attributes: ['id', 'name']
        }
      ]
    });

    if (!event) return res.status(404).json({ message: "Evento non trovato" });
    
    // Aggiungi il conteggio partecipanti e il nome del creatore
    const eventData = event.toJSON();
    eventData.participantCount = eventData.participants ? eventData.participants.length : 0;
    eventData.creatorName = eventData.creator ? eventData.creator.name : 'Sconosciuto';
    delete eventData.participants;
    delete eventData.creator;
    
    res.json(eventData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
}
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, location, date, capacity, image } = req.body;

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
      include: [
        {
          model: User,
          as: "participants",
          attributes: ['id'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: "creator",
          attributes: ['id', 'name']
        }
      ],
      order: [["date", "DESC"]],
    });
    
    // Aggiungi il conteggio partecipanti e il nome del creatore
    const eventsWithCount = events.map(event => {
      const eventData = event.toJSON();
      eventData.participantCount = eventData.participants ? eventData.participants.length : 0;
      eventData.creatorName = eventData.creator ? eventData.creator.name : 'Sconosciuto';
      delete eventData.participants;
      delete eventData.creator;
      return eventData;
    });
    
    res.json(eventsWithCount);
  } catch (error) {
    console.error("Errore getUserCreatedEvents:", error);
    res.status(500).json({ message: "Errore nel recupero eventi creati" });
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

    // Crea notifica persistente
    await createNotification(
      'event-reported',
      'Evento Segnalato',
      `L'evento "${event.title}" è stato segnalato da ${reporter?.name || 'Utente'}`,
      event.id,
      reporterId
    );

    // Emetti notifica live agli admin (mantenuta)
    const io = getIO();
    if (io) {
      io.emit('event-reported', { 
        event: event.toJSON(), 
        reporter: reporter?.toJSON() 
      });
    }

    res.status(200).json({ message: `Evento ${id} segnalato con successo.` });
  } catch (error) {
    console.error("Errore durante la segnalazione dell'evento:", error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

// Lista partecipanti di un evento
export const getEventParticipants = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findByPk(id, {
      include: [{
        model: User,
        as: "participants",
        attributes: ['id', 'name', 'email', 'createdAt'],
        through: { attributes: ['createdAt'] } // Include la data di iscrizione
      }]
    });

    if (!event) {
      return res.status(404).json({ message: "Evento non trovato" });
    }

    res.json({
      eventId: event.id,
      eventTitle: event.title,
      totalParticipants: event.participants.length,
      participants: event.participants
    });
  } catch (error) {
    console.error("Errore getEventParticipants:", error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

// Eventi più popolari (ordinati per numero di partecipanti)
export const getPopularEvents = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const events = await Event.findAll({
      where: { isApproved: true },
      include: [
        {
          model: User,
          as: "participants",
          attributes: ['id'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: "creator",
          attributes: ['id', 'name']
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    // Ordina per numero di partecipanti in JavaScript
    const eventsWithCount = events.map(event => {
      const eventData = event.toJSON();
      eventData.participantCount = eventData.participants ? eventData.participants.length : 0;
      eventData.creatorName = eventData.creator ? eventData.creator.name : 'Sconosciuto';
      delete eventData.participants; // Rimuovi l'array completo
      delete eventData.creator;
      return eventData;
    });

    // Ordina per participantCount decrescente
    eventsWithCount.sort((a, b) => b.participantCount - a.participantCount);

    // Limita i risultati
    const limitedEvents = eventsWithCount.slice(0, parseInt(limit));

    res.json(limitedEvents);
  } catch (error) {
    console.error("Errore getPopularEvents:", error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

// Eventi futuri (ordinati per data)
export const getUpcomingEvents = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const now = new Date();

    const events = await Event.findAll({
      where: { 
        isApproved: true,
        date: { [Op.gte]: now } // Eventi con data >= oggi
      },
      include: [
        {
          model: User,
          as: "participants",
          attributes: ['id'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: "creator",
          attributes: ['id', 'name']
        }
      ],
      order: [["date", "ASC"]], // Dal più vicino al più lontano
      limit: parseInt(limit)
    });

    // Aggiungi il conteggio partecipanti e il nome del creatore
    const eventsWithCount = events.map(event => {
      const eventData = event.toJSON();
      eventData.participantCount = eventData.participants ? eventData.participants.length : 0;
      eventData.creatorName = eventData.creator ? eventData.creator.name : 'Sconosciuto';
      delete eventData.participants; // Rimuovi l'array completo
      delete eventData.creator;
      return eventData;
    });

    res.json(eventsWithCount);
  } catch (error) {
    console.error("Errore getUpcomingEvents:", error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};