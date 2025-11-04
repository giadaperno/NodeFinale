import sequelize from "./src/config/db.js";
import app from "./src/app.js";
import { createServer } from "http";
import { setupSocketIO } from "./src/utils/socket.js";

import "./src/models/user.model.js";
import "./src/models/event.model.js";
import "./src/models/eventRegistration.model.js";
import "./src/models/chat.model.js";
import "./src/models/notification.model.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connessione a MySQL riuscita!");

    // Sincronizza i modelli con force: false per evitare problemi con gli indici
    await sequelize.sync({ force: false }); 
    console.log("Modelli sincronizzati con il database");

    const httpServer = createServer(app);
    const io = setupSocketIO(httpServer);
    
    // Salva l'istanza io nel modulo condiviso in modo che i controller possano usarla
    import("./src/utils/io.js").then(({ setIO }) => setIO(io)).catch(err => console.error('Impossibile impostare IO:', err));

    httpServer.listen(PORT, () =>
      console.log(`Server avviato su http://localhost:${PORT}`)
    );

  } catch (error) {
    console.error("Errore avvio server:", error);
  }
};

startServer();

