const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ADRESSE', {
    ADRESSE_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NUM_RUE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    NOM_RUE: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    VILLE: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CODE_POSTAL: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ADRESSE',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ADRESSE_ID" },
        ]
      },
    ]
  });
};
