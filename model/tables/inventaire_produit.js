const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('INVENTAIRE_PRODUIT', {
    INVENTAIRE_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    EMPLOYE_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'EMPLOYE',
        key: 'EMPLOYE_ID'
      }
    },
    PRODUIT_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'PRODUIT',
        key: 'PRODUIT_ID'
      }
    },
    QUANTITE_OBSERVEE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DATE_INV: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'INVENTAIRE_PRODUIT',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "INVENTAIRE_ID" },
        ]
      },
      {
        name: "FK_EMP_INV",
        using: "BTREE",
        fields: [
          { name: "EMPLOYE_ID" },
        ]
      },
      {
        name: "FK_PROD_INV",
        using: "BTREE",
        fields: [
          { name: "PRODUIT_ID" },
        ]
      },
    ]
  });
};
