const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('COMMANDE', {
    COMMANDE_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    DATE_COMMANDE: {
      type: DataTypes.DATE,
      allowNull: true
    },
    EMPLOYE_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'EMPLOYE',
        key: 'EMPLOYE_ID'
      }
    },
    DATE_REEL_RECU: {
      type: DataTypes.DATE,
      allowNull: true
    },
    PRIX_TOTAL: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    LOCATION_TYPE: {
      type : DataTypes.ENUM('entrepot','magasin'),
      allowNull: true
    },
    DATE_DEPART: {
      type : DataTypes.DATE,
      allowNull : true
    }
  }, {
    sequelize,
    tableName: 'COMMANDE',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "COMMANDE_ID" },
        ]
      },
      {
        name: "FK_CF_EMPLOYE",
        using: "BTREE",
        fields: [
          { name: "EMPLOYE_ID" },
        ]
      },
    ]
  });
};
