import User from "../models/user.model.js";
import bcrypt from "bcrypt";

/**
 * Ottieni profilo utente corrente
 */
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'role', 'createdAt', 'isActive']
    });

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.json(user);
  } catch (error) {
    console.error("Errore getMyProfile:", error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

/**
 * Modifica profilo utente corrente
 */
export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    // Verifica se il nuovo nome è già usato da un altro utente
    if (name && name.trim() !== user.name) {
      const existingName = await User.findOne({ 
        where: { name: name.trim() } 
      });
      if (existingName && existingName.id !== userId) {
        return res.status(400).json({ 
          message: "Nome utente già esistente. Scegli un nome diverso." 
        });
      }
      user.name = name.trim();
    }

    // Verifica se la nuova email è già usata da un altro utente
    if (email && email.trim().toLowerCase() !== user.email) {
      const existingEmail = await User.findOne({ 
        where: { email: email.trim().toLowerCase() } 
      });
      if (existingEmail && existingEmail.id !== userId) {
        return res.status(400).json({ 
          message: "Email già registrata. Usa un'altra email." 
        });
      }
      user.email = email.trim().toLowerCase();
    }

    await user.save();

    // Restituisci solo i dati necessari
    const updatedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      isActive: user.isActive
    };

    res.json({ 
      message: "Profilo aggiornato con successo", 
      user: updatedUser 
    });
  } catch (error) {
    console.error("Errore updateMyProfile:", error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

/**
 * Cambia password (utente autenticato)
 */
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ 
        message: "Vecchia password e nuova password sono obbligatorie" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "La nuova password deve essere almeno 6 caratteri" 
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    // Verifica che la vecchia password sia corretta
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Vecchia password non corretta" });
    }

    // Hash della nuova password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password aggiornata con successo" });
  } catch (error) {
    console.error("Errore changePassword:", error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

/**
 * Elimina account (utente autenticato)
 */
export const deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ 
        message: "Password richiesta per eliminare l'account" 
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    // Verifica password per sicurezza
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password non corretta" });
    }

    await user.destroy();

    res.json({ message: "Account eliminato con successo" });
  } catch (error) {
    console.error("Errore deleteMyAccount:", error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

/**
 * Profilo pubblico di un utente (solo dati pubblici)
 */
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.json(user);
  } catch (error) {
    console.error("Errore getUserProfile:", error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

export const promoteToAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    user.role = 'admin';
    await user.save();

    res.json({ 
      message: `Utente ${user.name} promosso ad admin con successo`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Errore promoteToAdmin:", error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};
