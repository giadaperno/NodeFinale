import sequelize from "./src/config/db.js";
import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connessione a MySQL riuscita!");


    // Sincronizza i modelli: crea le tabelle se non esistono
    await sequelize.sync({ alter: true }); // alter: aggiorna le tabelle senza cancellare i dati
    console.log("Modelli sincronizzati con il database");

    app.listen(PORT, () =>
      console.log(`Server avviato su http://localhost:${PORT}`)
    );

  } catch (error) {
    console.error("Errore avvio server:", error);
  }
};

startServer();

