import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";
import Event from "./event.model.js";

const EventRegistration = sequelize.define("EventRegistration", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  EventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Relazioni
User.hasMany(EventRegistration, { foreignKey: "UserId" });
EventRegistration.belongsTo(User, { foreignKey: "UserId" });

Event.hasMany(EventRegistration, { foreignKey: "EventId" });
EventRegistration.belongsTo(Event, { as: "event", foreignKey: "EventId" });

export default EventRegistration;
