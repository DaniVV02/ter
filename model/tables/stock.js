const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('STOCK', {
    STOCK_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    QUANTITE_STOCK: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DATE_STOCK: {
      type: DataTypes.DATE,
      allowNull: true
    },
    PRODUIT_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'PRODUIT',
        key: 'PRODUIT_ID'
      }
    }
  }, {
    sequelize,
    tableName: 'STOCK',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "STOCK_ID" },
        ]
      },
      {
        name: "FK_STOCK",
        using: "BTREE",
        fields: [
          { name: "PRODUIT_ID" },
        ]
      },
    ]
  });
};