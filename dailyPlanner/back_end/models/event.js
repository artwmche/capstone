'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    event_title: DataTypes.STRING,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    address: DataTypes.TEXT,
    description: DataTypes.TEXT
  }, {
    underscored: true,
  });
  Event.associate = function(models) {
    // associations can be defined here
  };
  return Event;
};