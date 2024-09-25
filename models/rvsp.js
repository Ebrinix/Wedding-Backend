'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rvsp = sequelize.define('Rvsp', {
    groupName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    numberOfInvites: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    accessCodes: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    accessCodes: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    approvedAccessCodes: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    isAttending: {
        type: DataTypes.ENUM('TRUE', 'FALSE'),
        allowNull: true,
        defaultValue: null
    },
    approve: {
        type: DataTypes.ENUM('TRUE', 'FALSE','REVOKE'),
        allowNull: true,
        defaultValue: null
    }
  }, {});
  Rvsp.associate = function(models) {
    // associations can be defined here
  };
  return Rvsp;
};