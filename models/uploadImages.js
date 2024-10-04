'use strict';
module.exports = (sequelize, DataTypes) => {
  const UploadImage = sequelize.define('UploadImage', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('APPROVE', 'DECLINE'),
        allowNull: false
      },
  }, {});
  UploadImage.associate = function(models) {
    // associations can be defined here
  };
  return UploadImage;
};