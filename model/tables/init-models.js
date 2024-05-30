var DataTypes = require("sequelize").DataTypes;
var _adresse = require("./adresse");
var _categorie = require("./categorie");
var _client = require("./client");
var _commande = require("./commande");
var _commande_client = require("./commande_client");
var _commande_fournisseur = require("./commande_fournisseur");
var _emplacement = require("./emplacement");
var _employe = require("./employe");
var _facture = require("./facture");
var _fournisseur = require("./fournisseur");
var _inventaire_produit = require("./inventaire_produit");
var _ligne_commande = require("./ligne_commande");
var _livraison = require("./livraison");
var _lot_produits = require("./lot_produits");
var _lot_vendu = require("./lot_vendu");
var _produit = require("./produit");
var _produit_livre = require("./produit_livre");
var _produit_vendu = require("./produit_vendu");
var _stock = require("./stock");
var _users = require("./users");
var _vente = require("./vente");
var _ventes_realises = require("./ventes_realises");

function initModels(sequelize) {
  var users = _users(sequelize, DataTypes);
  var categorie = _categorie(sequelize, DataTypes);
  var emplacement = _emplacement(sequelize, DataTypes);
  var adresse = _adresse(sequelize, DataTypes);
  var employe = _employe(sequelize, DataTypes);
  var client = _client(sequelize, DataTypes);
  var facture = _facture(sequelize, DataTypes);
  var fournisseur = _fournisseur(sequelize, DataTypes);
  var produit = _produit(sequelize, DataTypes);
  var stock = _stock(sequelize, DataTypes);
  var lot_produits = _lot_produits(sequelize, DataTypes);
  var commande = _commande(sequelize, DataTypes);
  var commande_fournisseur = _commande_fournisseur(sequelize, DataTypes);
  var commande_client = _commande_client(sequelize, DataTypes);
  var vente = _vente(sequelize, DataTypes);
  var livraison = _livraison(sequelize, DataTypes);
  var inventaire_produit = _inventaire_produit(sequelize, DataTypes);
  var ligne_commande = _ligne_commande(sequelize, DataTypes);
  var produit_vendu = _produit_vendu(sequelize, DataTypes);
  var lot_vendu = _lot_vendu(sequelize, DataTypes);
  var produit_livre = _produit_livre(sequelize, DataTypes);
  var ventes_realises = _ventes_realises(sequelize, DataTypes);

  commande.belongsToMany(produit, {
    as: "PRODUIT_ID_produits",
    through: ligne_commande,
    foreignKey: "COMMANDE_ID",
    otherKey: "PRODUIT_ID",
  });
  employe.belongsToMany(vente, {
    as: "VENTE_ID_vente_ventes_realises",
    through: ventes_realises,
    foreignKey: "EMPLOYE_ID",
    otherKey: "VENTE_ID",
  });
  livraison.belongsToMany(produit, {
    as: "PRODUIT_ID_produit_produit_livres",
    through: produit_livre,
    foreignKey: "LIVRAISON_ID",
    otherKey: "PRODUIT_ID",
  });
  lot_produits.belongsToMany(vente, {
    as: "VENTE_ID_ventes",
    through: lot_vendu,
    foreignKey: "LOT_ID",
    otherKey: "VENTE_ID",
  });
  produit.belongsToMany(commande, {
    as: "COMMANDE_ID_commandes",
    through: ligne_commande,
    foreignKey: "PRODUIT_ID",
    otherKey: "COMMANDE_ID",
  });
  produit.belongsToMany(livraison, {
    as: "LIVRAISON_ID_livraisons",
    through: produit_livre,
    foreignKey: "PRODUIT_ID",
    otherKey: "LIVRAISON_ID",
  });
  produit.belongsToMany(vente, {
    as: "VENTE_ID_vente_produit_vendus",
    through: produit_vendu,
    foreignKey: "PRODUIT_ID",
    otherKey: "VENTE_ID",
  });
  vente.belongsToMany(employe, {
    as: "EMPLOYE_ID_employes",
    through: ventes_realises,
    foreignKey: "VENTE_ID",
    otherKey: "EMPLOYE_ID",
  });
  vente.belongsToMany(lot_produits, {
    as: "LOT_ID_lot_produits",
    through: lot_vendu,
    foreignKey: "VENTE_ID",
    otherKey: "LOT_ID",
  });
  vente.belongsToMany(produit, {
    as: "PRODUIT_ID_produit_produit_vendus",
    through: produit_vendu,
    foreignKey: "VENTE_ID",
    otherKey: "PRODUIT_ID",
  });
  produit.belongsTo(fournisseur, {as: "FOURNISSEUR_PROD", foreignKey: "FOURNISSEUR_ID"});
  client.belongsTo(adresse, { as: "ADRESSE", foreignKey: "ADRESSE_ID" });
  adresse.hasMany(client, { as: "clients", foreignKey: "ADRESSE_ID" });
  employe.belongsTo(adresse, { as: "ADRESSE", foreignKey: "ADRESSE_ID" });
  adresse.hasMany(employe, { as: "employes", foreignKey: "ADRESSE_ID" });
  fournisseur.belongsTo(adresse, { as: "ADRESSE", foreignKey: "ADRESSE_ID" });
  adresse.hasMany(fournisseur, {
    as: "fournisseurs",
    foreignKey: "ADRESSE_ID",
  });
  produit.belongsTo(categorie, { as: "CATEGORIE", foreignKey: "CATEGORIE_ID" });
  categorie.hasMany(produit, { as: "produits", foreignKey: "CATEGORIE_ID" });
  commande_client.belongsTo(client, { as: "CLIENT", foreignKey: "CLIENT_ID" });
  client.hasMany(commande_client, {
    as: "commande_clients",
    foreignKey: "CLIENT_ID",
  });
  facture.belongsTo(client, { as: "CLIENT", foreignKey: "CLIENT_ID" });
  client.hasMany(facture, { as: "factures", foreignKey: "CLIENT_ID" });
  commande_client.belongsTo(commande, {
    as: "COMM_CLIENT",
    foreignKey: "COMM_CLIENT_ID",
  });
  commande.hasOne(commande_client, {
    as: "commande_client",
    foreignKey: "COMM_CLIENT_ID",
  });
  commande_fournisseur.belongsTo(commande, {
    as: "COMM_FOURN",
    foreignKey: "COMM_FOURN_ID",
  });
  commande.hasOne(commande_fournisseur, {
    as: "commande_fournisseur",
    foreignKey: "COMM_FOURN_ID",
  });
  ligne_commande.belongsTo(commande, {
    as: "COMMANDE",
    foreignKey: "COMMANDE_ID",
  });
  commande.hasMany(ligne_commande, {
    as: "ligne_commandes",
    foreignKey: "COMMANDE_ID",
  });
  produit.belongsTo(emplacement, {
    as: "EMPLACEMENT",
    foreignKey: "EMPLACEMENT_ID",
  });
  emplacement.hasMany(produit, {
    as: "produits",
    foreignKey: "EMPLACEMENT_ID",
  });
  stock.belongsTo(produit, { as: "PRODUIT", foreignKey: "PRODUIT_ID" });
  produit.hasMany(stock, {
    as: "stocks",
    foreignKey: "PRODUIT_ID",
  });
  commande.belongsTo(employe, { as: "EMPLOYE", foreignKey: "EMPLOYE_ID" });
  employe.hasMany(commande, { as: "commandes", foreignKey: "EMPLOYE_ID" });
  inventaire_produit.belongsTo(employe, {
    as: "EMPLOYE",
    foreignKey: "EMPLOYE_ID",
  });
  employe.hasMany(inventaire_produit, {
    as: "inventaire_produits",
    foreignKey: "EMPLOYE_ID",
  });
  livraison.belongsTo(employe, { as: "EMPLOYE", foreignKey: "EMPLOYE_ID" });
  employe.hasMany(livraison, { as: "livraisons", foreignKey: "EMPLOYE_ID" });
  vente.belongsTo(employe, { as: "EMPLOYE", foreignKey: "EMPLOYE_ID" });
  employe.hasMany(vente, { as: "ventes", foreignKey: "EMPLOYE_ID" });
  ventes_realises.belongsTo(employe, {
    as: "EMPLOYE",
    foreignKey: "EMPLOYE_ID",
  });
  employe.hasMany(ventes_realises, {
    as: "ventes_realises",
    foreignKey: "EMPLOYE_ID",
  });
  vente.belongsTo(facture, { as: "FACTURE", foreignKey: "FACTURE_ID" });
  facture.hasMany(vente, { as: "ventes", foreignKey: "FACTURE_ID" });
  commande_fournisseur.belongsTo(fournisseur, {
    as: "FOURNISSEUR",
    foreignKey: "FOURNISSEUR_ID",
  });
  fournisseur.hasMany(commande_fournisseur, {
    as: "commande_fournisseurs",
    foreignKey: "FOURNISSEUR_ID",
  });
  produit_livre.belongsTo(livraison, {
    as: "LIVRAISON",
    foreignKey: "LIVRAISON_ID",
  });
  livraison.hasMany(produit_livre, {
    as: "produit_livres",
    foreignKey: "LIVRAISON_ID",
  });
  lot_vendu.belongsTo(lot_produits, { as: "LOT", foreignKey: "LOT_ID" });
  lot_produits.hasMany(lot_vendu, { as: "lot_vendus", foreignKey: "LOT_ID" });
  inventaire_produit.belongsTo(produit, {
    as: "PRODUIT",
    foreignKey: "PRODUIT_ID",
  });
  produit.hasMany(inventaire_produit, {
    as: "inventaire_produits",
    foreignKey: "PRODUIT_ID",
  });
  ligne_commande.belongsTo(produit, {
    as: "PRODUIT",
    foreignKey: "PRODUIT_ID",
  });
  produit.hasMany(ligne_commande, {
    as: "ligne_commandes",
    foreignKey: "PRODUIT_ID",
  });
  lot_produits.belongsTo(produit, { as: "LOT", foreignKey: "LOT_ID" });
  produit.hasOne(lot_produits, { as: "lot_produit", foreignKey: "LOT_ID" });
  produit_livre.belongsTo(produit, { as: "PRODUIT", foreignKey: "PRODUIT_ID" });
  produit.hasMany(produit_livre, {
    as: "produit_livres",
    foreignKey: "PRODUIT_ID",
  });
  produit_vendu.belongsTo(produit, { as: "PRODUIT", foreignKey: "PRODUIT_ID" });
  produit.hasMany(produit_vendu, {
    as: "produit_vendus",
    foreignKey: "PRODUIT_ID",
  });
  employe.belongsTo(users, { as: "EMPLOYE", foreignKey: "EMPLOYE_ID" });
  users.hasOne(employe, { as: "employe", foreignKey: "EMPLOYE_ID" });
  lot_vendu.belongsTo(vente, { as: "VENTE", foreignKey: "VENTE_ID" });
  vente.hasMany(lot_vendu, { as: "lot_vendus", foreignKey: "VENTE_ID" });
  produit_vendu.belongsTo(vente, { as: "VENTE", foreignKey: "VENTE_ID" });
  vente.hasMany(produit_vendu, {
    as: "produit_vendus",
    foreignKey: "VENTE_ID",
  });
  ventes_realises.belongsTo(vente, { as: "VENTE", foreignKey: "VENTE_ID" });
  vente.hasMany(ventes_realises, {
    as: "ventes_realises",
    foreignKey: "VENTE_ID",
  });

  return {
    users,
    categorie,
    emplacement,
    adresse,
    employe,
    client,
    facture,
    fournisseur,
    produit,
    stock,
    lot_produits,
    commande,
    commande_fournisseur,
    commande_client,
    vente,
    livraison,
    inventaire_produit,
    ligne_commande,
    produit_vendu,
    lot_vendu,
    produit_livre, 
    ventes_realises,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
