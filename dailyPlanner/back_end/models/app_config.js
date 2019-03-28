'use strict';
module.exports = (sequelize, DataTypes) => {
  const app_config = sequelize.define('app_config', {
    name: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    underscored: true,
  });
  app_config.associate = function(models) {
    // associations can be defined here
  };
  return app_config;
};