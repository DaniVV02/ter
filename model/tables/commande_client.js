const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('COMMANDE_CLIENT', {
    COMM_CLIENT_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'COMMANDE',
        key: 'COMMANDE_ID'
      }
    },
    TYPE_COMMANDE: {
      type: DataTypes.ENUM('commande','retour'),
      allowNull: false
    },
    CLIENT_ID: {
      type: DataTypes.DECIMAL(15,0),
      allowNull: true,
      references: {
        model: 'CLIENT',
        key: 'CLIENT_ID'
      }
    }
  }, {
    sequelize,
    tableName: 'COMMANDE_CLIENT',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "COMM_CLIENT_ID" },
        ]
      },
      {
        name: "FL_CC_CLIENT",
        using: "BTREE",
        fields: [
          { name: "CLIENT_ID" },
        ]
      },
    ]
  });
};
