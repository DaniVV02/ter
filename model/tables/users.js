const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "USERS",
    {
      USER_ID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      USERNAME: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      FIRSTNAME: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      LASTNAME: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      USER_MAIL: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      USER_PASS: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      USER_TEL: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      USER_DATE_NAISS: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      USER_PHOTO: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "USERS",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "USER_ID" }],
        },
      ],
    }
  );
};
