const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();
const cron = require("node-cron");

// Configuration de la connexion à la base de données local’
/*const sequelizeLocal = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

// Ici on teste la connexion à la base de données locale
async function testConnectionLocale() {
  try {
    await sequelizeLocal.authenticate();
    console.log("Connexion à la base de données Locale établie avec succès.");
  } catch (error) {
    console.error("Impossible de se connecter à la base de données:", error);
  }
}
testConnectionLocale();*/

const sequelizeHeroku = new Sequelize(
  process.env.DB_NAMEH,
  process.env.DB_USERH,
  process.env.DB_PASSH,
  {
    host: process.env.DB_HOSTH,
    dialect: "mysql",
    logging: false,
  }
);

async function testConnectionHeroku() {
  try {
    await sequelizeHeroku.authenticate();
    console.log("Connexion à la base de données Heroku établie avec succès.");
  } catch (error) {
    console.error(
      "Impossible de se connecter à la base de données Heroku:",
      error
    );
  }
}
testConnectionHeroku();

// Connexion à la base de données cloud
const sequelizeCloud = new Sequelize(
  process.env.DB_NAMEC,
  process.env.DB_USERC,
  process.env.DB_PASSC,
  {
    host: process.env.DB_HOSTC,
    dialect: "mysql",
    logging: false,
  }
);

// Ici on teste la connexion à la base de données cloud
async function testConnectionCloud() {
  try {
    await sequelizeCloud.authenticate();
    console.log("Connexion à la base de données Cloud établie avec succès.");
  } catch (error) {
    console.error(
      "Impossible de se connecter à la base de données Cloud:",
      error
    );
  }
}
testConnectionCloud();

const initModels = require("../model/tables/init-models").initModels;
//const modelsLocale = initModels(sequelizeLocal, DataTypes);
const modelsCloud = initModels(sequelizeCloud, DataTypes);

// Fonction de synchronisation des données pour chaque modèle
async function synchronizeTables() {
  try {
    for (const model in modelsCloud) {
      const tableLocale = modelsLocale[model];
      const tableCloud = modelsCloud[model];
      const localModels = await tableLocale.findAll();
      for (const local of localModels) {
        const localModel = local.dataValues;
        await tableCloud.upsert(localModel);
      }
    }
    console.log("Toutes les données ont été synchronisées avec succès.");
  } catch (error) {
    console.error("Erreur lors de la synchronisation des données :", error);
  }
}

async function synchronizeTablesInverse() {
  try {
    for (const model in modelsLocale) {
      const tableCloud = modelsCloud[model];
      const tableLocale = modelsLocale[model];
      const cloudModels = await tableCloud.findAll();
      for (const cloud of cloudModels) {
        const cloudModel = cloud.dataValues;
        await tableLocale.upsert(cloudModel);
      }
    }
    console.log("Toutes les données ont été synchronisées avec succès.");
  } catch (error) {
    console.error("Erreur lors de la synchronisation des données :", error);
  }
}

cron.schedule("0 0 1 * *", () => {
  console.log("Début de la synchronisation mensuelle.");
  synchronizeTables();
});


module.exports = sequelizeCloud;
