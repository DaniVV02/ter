const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LOT_PRODUITS', {
    LOT_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'PRODUIT',
        key: 'PRODUIT_ID'
      }
    },
    QUANTITE: {
      type: DataTypes.DECIMAL(3,0),
      allowNull: true
    },
    PRIX_LOT: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    CB_LOT: {
      type: DataTypes.DECIMAL(15,0),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'LOT_PRODUITS',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "LOT_ID" },
        ]
      },
    ]
  });
};
