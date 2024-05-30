const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LIGNE_COMMANDE', {
    PRODUIT_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'PRODUIT',
        key: 'PRODUIT_ID'
      }
    },
    COMMANDE_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'COMMANDE',
        key: 'COMMANDE_ID'
      }
    },
    QUANTITE: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'LIGNE_COMMANDE',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PRODUIT_ID" },
          { name: "COMMANDE_ID" },
        ]
      },
      {
        name: "FK_LIGN_COMM",
        using: "BTREE",
        fields: [
          { name: "COMMANDE_ID" },
        ]
      },
    ]
  });
};
