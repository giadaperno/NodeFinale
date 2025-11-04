import Notification from "../models/notification.model.js";
import { getIO } from "../utils/io.js";

// Crea una nuova notifica
export const createNotification = async (type, title, message, eventId = null, userId = null) => {
  try {
    const notification = await Notification.create({
      type,
      title,
      message,
      eventId,
      userId,
      isRead: false
    });

    // Emetti notifica live agli admin
    const io = getIO();
    if (io) {
      io.emit('new-admin-notification', notification.toJSON());
    }

    return notification;
  } catch (error) {
    console.error("Errore creazione notifica:", error);
    throw error;
  }
};

// Ottieni tutte le notifiche (per admin)
export const getAllNotifications = async (req, res) => {
  try {
    const { limit = 50, onlyUnread = false } = req.query;
    
    const where = onlyUnread === 'true' ? { isRead: false } : {};
    
    const notifications = await Notification.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    const unreadCount = await Notification.count({ where: { isRead: false } });

    res.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error("Errore nel recupero notifiche:", error);
    res.status(500).json({ message: "Errore nel recupero notifiche" });
  }
};

// Segna una notifica come letta
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: "Notifica non trovata" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Notifica segnata come letta", notification });
  } catch (error) {
    console.error("Errore nell'aggiornamento notifica:", error);
    res.status(500).json({ message: "Errore nell'aggiornamento notifica" });
  }
};

// Segna tutte le notifiche come lette
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { isRead: false } }
    );

    res.json({ message: "Tutte le notifiche sono state segnate come lette" });
  } catch (error) {
    console.error("Errore nell'aggiornamento notifiche:", error);
    res.status(500).json({ message: "Errore nell'aggiornamento notifiche" });
  }
};

// Elimina una notifica
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: "Notifica non trovata" });
    }

    await notification.destroy();
    res.json({ message: "Notifica eliminata" });
  } catch (error) {
    console.error("Errore nell'eliminazione notifica:", error);
    res.status(500).json({ message: "Errore nell'eliminazione notifica" });
  }
};

// Elimina tutte le notifiche lette
export const deleteReadNotifications = async (req, res) => {
  try {
    const deleted = await Notification.destroy({
      where: { isRead: true }
    });

    res.json({ message: `${deleted} notifiche eliminate` });
  } catch (error) {
    console.error("Errore nell'eliminazione notifiche:", error);
    res.status(500).json({ message: "Errore nell'eliminazione notifiche" });
  }
};
