const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PRODUIT_VENDU', {
    PRODUIT_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'PRODUIT',
        key: 'PRODUIT_ID'
      }
    },
    VENTE_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'VENTE',
        key: 'VENTE_ID'
      }
    },
    QUANTITE: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'PRODUIT_VENDU',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PRODUIT_ID" },
          { name: "VENTE_ID" },
        ]
      },
      {
        name: "FK_VENPR",
        using: "BTREE",
        fields: [
          { name: "VENTE_ID" },
        ]
      },
    ]
  });
};
