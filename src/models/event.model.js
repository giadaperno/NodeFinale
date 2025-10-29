import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";

const Event = sequelize.define("Event", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Associazioni
Event.belongsTo(User, { foreignKey: "UserId" }); // ogni evento appartiene a un utente
User.hasMany(Event, { foreignKey: "UserId" });   // un utente può avere molti eventi

export default Event;
