const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CLIENT', {
    CLIENT_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NOM_CLI: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PRENOM_CLI: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    FIDELITE: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'CLIENT',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "CLIENT_ID" },
        ]
      },
      {
        name: "FK_ADR_CLI",
        using: "BTREE",
        fields: [
          { name: "ADRESSE_ID" },
        ]
      },
    ]
  });
};
