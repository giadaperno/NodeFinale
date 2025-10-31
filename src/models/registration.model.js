import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";
import Event from "./event.model.js";

const Registration = sequelize.define("Registration", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Relazioni molti-a-molti
User.belongsToMany(Event, { through: Registration, as: "registeredEvents" });
Event.belongsToMany(User, { through: Registration, as: "participants" });

// Relazione esplicita per l'inclusione diretta di Event nel modello Registration
Registration.belongsTo(Event, { foreignKey: "EventId" });

export default Registration;
