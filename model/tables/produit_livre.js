const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PRODUIT_LIVRE', {
    PRODUIT_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'PRODUIT',
        key: 'PRODUIT_ID'
      }
    },
    LIVRAISON_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'LIVRAISON',
        key: 'LIVRAISON_ID'
      }
    }
  }, {
    sequelize,
    tableName: 'PRODUIT_LIVRE',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PRODUIT_ID" },
          { name: "LIVRAISON_ID" },
        ]
      },
      {
        name: "FK_LIVPR",
        using: "BTREE",
        fields: [
          { name: "LIVRAISON_ID" },
        ]
      },
    ]
  });
};
