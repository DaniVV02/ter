const { Sequelize } = require("sequelize");
const sequelize = require("../config/db");
const KEY = process.env.DEV_KEY;
var jwt = require("jsonwebtoken");
const initModels = require("../model/tables/init-models").initModels;
const models = initModels(sequelize);

sharedData = {
    orderList: [],
    totalOrderPrice: 0,
    locationType: null
};

module.exports = {
    addOrder: async function (req, res) {
        try {
            const { productName, quantity, locationType ,supplierName} = req.body;  // WAREHOUSE OU MAGASIN
            
            // Recherche du fournisseur par nom
            const fournisseur = await models.fournisseur.findOne({
                where: { NOM_FOURNISSEUR: supplierName },
                attributes: ['FOURNISSEUR_ID']
            });

            if (!fournisseur) {
                return res.status(404).json({ success: false, message: "Fournisseur non trouvé." });
            }
            // verifie les locationtype
        
            if (!sharedData.locationType) {
                sharedData.locationType = locationType;
            } else if (sharedData.locationType !== locationType) {
                return res.status(400).json({ success: false, message: "Le type d'emplacement de la commande ne peut pas être modifié." });
            }
            //Recherche le produit par nom aussi
        
            const produit = await models.produit.findOne({
                where: { NOM: productName },
                attributes: ['PRODUIT_ID', 'PRIX_UNIT']
            });
        
            if (!produit) {
                return res.status(404).json({ success: false, message: "Produit non trouvé." });
            }
    
            const productPrice = produit.PRIX_UNIT;
            const totalPrice = productPrice * quantity;
        
            sharedData.orderList.push({
                productName,
                quantity,
                totalPrice
            });
        
            sharedData.totalOrderPrice += totalPrice;
            
            // Créez la commande dans la base de données
            const nouvelleCommande = await models.commande.create({
                DATE_COMMANDE: new Date(),
                LOCATION_TYPE: sharedData.locationType,
                PRIX_TOTAL: sharedData.totalOrderPrice
            });

            // Ajoutez chaque produit de la commande comme une ligne de commande
            for (const item of sharedData.orderList) {
                const produit = await models.produit.findOne({ where: { NOM: item.productName } });

                if (produit) {
                    await models.ligne_commande.create({
                        PRODUIT_ID: produit.PRODUIT_ID,
                        COMMANDE_ID: nouvelleCommande.COMMANDE_ID,
                        QUANTITE: item.quantity
                    });
                }
            }
            // Ajouter la commande fournisseur
            await models.commande_fournisseur.create({
                COMM_FOURN_ID: nouvelleCommande.COMMANDE_ID,
                FOURNISSEUR_ID: fournisseur.FOURNISSEUR_ID,
                TYPE_COMMANDE: 'commande' // ou tout autre type de commande approprié
            });
    
            // Réinitialisez les données partagées après avoir sauvegardé la commande
            sharedData.orderList = [];
            sharedData.totalOrderPrice = 0;
            sharedData.locationType = null;

            res.status(201).json({
                success: true,
                message: "Commande ajoutée avec succès",
                commandeId: nouvelleCommande.COMMANDE_ID
            });
        } catch (error) {
            console.error('Erreur lors de l\'ajout à la commande :', error);
            res.status(500).json({ success: false, message: "Une erreur s'est produite lors de l'ajout à la commande." });
        }
    }
};
