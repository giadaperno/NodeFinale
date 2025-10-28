import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,     
  process.env.DB_USER,     
  process.env.DB_PASS,     
  {
    host: process.env.DB_HOST,  
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,             
    dialectOptions: {
      ssl: {
        require: true,          
        rejectUnauthorized: false,
      },
    },
  }
);

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connessione a MySQL riuscita!");
  } catch (error) {
    console.error("Connessione fallita:", error);
  }
};

export default sequelize;
