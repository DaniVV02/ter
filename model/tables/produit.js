const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PRODUIT', {
    PRODUIT_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NOM: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DESCR: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PRIX_UNIT: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: true
    },
    POIDS: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DIMENSIONS: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    MAGASIN_ENTREPOT: {
      type: DataTypes.ENUM('magasin','entrepot'),
      allowNull: true
    },
    CODE_BARRE_PRODUIT: {
      type: DataTypes.DECIMAL(20,0),
      allowNull: true
    },
    CATEGORIE_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'CATEGORIE',
        key: 'CATEGORIE_ID'
      }
    },
    EMPLACEMENT_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'EMPLACEMENT',
        key: 'EMPLACEMENT_ID'
      }
    },
    FOURNISSEUR_ID: {
      type : DataTypes.INTEGER,
      allowNull: true,
      references :{
        model: 'FOURNISSEUR',
        key: 'FOURNISSEUR_ID'
      }
    },
    SEUIL: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 7
    },
    QUANTITE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PRODUIT_IMAGE: {
      type: DataTypes.TEXT, //on met blobl pour stocker des données binaires , sinon STRING
      allowNull: true
    },
    SKU: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CLASSE: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'PRODUIT',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PRODUIT_ID" },
        ]
      },
      {
        name: "FK_CAT",
        using: "BTREE",
        fields: [
          { name: "CATEGORIE_ID" },
        ]
      },
      {
        name: "FK_EMP",
        using: "BTREE",
        fields: [
          { name: "EMPLACEMENT_ID" },
        ]
      },
      {
        name : "FK_FOURN",
        using: "BTREE",
        fields: [
          {name : "FOURNISSEUR_ID"},
        ]
      },
    ]
  });
};
