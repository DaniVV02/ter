const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LIVRAISON', {
    LIVRAISON_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    DATE_LIVRAISON: {
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
    }
  }, {
    sequelize,
    tableName: 'LIVRAISON',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "LIVRAISON_ID" },
        ]
      },
      {
        name: "FK_EMPL",
        using: "BTREE",
        fields: [
          { name: "EMPLOYE_ID" },
        ]
      },
    ]
  });
};
