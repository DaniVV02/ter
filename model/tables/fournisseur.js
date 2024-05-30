const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FOURNISSEUR', {
    FOURNISSEUR_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NOM_FOURNISSEUR: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    TELEPHONE: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ADRESSE_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ADRESSE',
        key: 'ADRESSE_ID'
      }
    }
  }, {
    sequelize,
    tableName: 'FOURNISSEUR',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "FOURNISSEUR_ID" },
        ]
      },
      {
        name: "FK_ADR_FOURN",
        using: "BTREE",
        fields: [
          { name: "ADRESSE_ID" },
        ]
      },
    ]
  });
};
