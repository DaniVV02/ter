const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('COMMANDE_FOURNISSEUR', {
    COMM_FOURN_ID: {
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
    FOURNISSEUR_ID: {
      type: DataTypes.DECIMAL(15,0),
      allowNull: true,
      references: {
        model: 'FOURNISSEUR',
        key: 'FOURNISSEUR_ID'
      }
    }
  }, {
    sequelize,
    tableName: 'COMMANDE_FOURNISSEUR',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "COMM_FOURN_ID" },
        ]
      },
      {
        name: "FL_CF_FOURNISSEUR",
        using: "BTREE",
        fields: [
          { name: "FOURNISSEUR_ID" },
        ]
      },
    ]
  });
};
