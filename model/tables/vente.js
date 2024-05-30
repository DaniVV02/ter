const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('VENTE', {
    VENTE_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    DATE_VENTE: {
      type: DataTypes.DATEONLY,
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
    FACTURE_ID: {
      type: DataTypes.DECIMAL(15,0),
      allowNull: true,
      references: {
        model: 'FACTURE',
        key: 'FACTURE_ID'
      }
    }
  }, {
    sequelize,
    tableName: 'VENTE',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "VENTE_ID" },
        ]
      },
      {
        name: "FK_EMPV",
        using: "BTREE",
        fields: [
          { name: "EMPLOYE_ID" },
        ]
      },
      {
        name: "FK_FAC",
        using: "BTREE",
        fields: [
          { name: "FACTURE_ID" },
        ]
      },
    ]
  });
};
