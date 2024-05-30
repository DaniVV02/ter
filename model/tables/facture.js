const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FACTURE', {
    FACTURE_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    MONTANT: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    DATE_FACTURE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    NOM_MAGASIN: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CLIENT_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'CLIENT',
        key: 'CLIENT_ID'
      }
    }
  }, {
    sequelize,
    tableName: 'FACTURE',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "FACTURE_ID" },
        ]
      },
      {
        name: "FK_CLI",
        using: "BTREE",
        fields: [
          { name: "CLIENT_ID" },
        ]
      },
    ]
  });
};
