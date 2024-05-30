const DataTypes = require('sequelize');
const sequelize = require('../config/db');
//const router = express.Router();
const Produit = require('../model/tables/produit')(sequelize, DataTypes);
const Categorie = require('../model/tables/categorie')(sequelize, DataTypes);


module.exports = {
    addProduit: async function(req, res) {
      try {
        const nom = req.body.nom;
        const productCategorie = req.body.productCategorie;
        const productDimensions = req.body.productDimensions;
        const productWeight = req.body.productPoids;
        const productPrix = req.body.productPrix; 
        const imageProduit = req.body.img;

        let categorie = await Categorie.findOne({
          where: {
            NOM_CATEGORIE: productCategorie
          },
          attributes: ['CATEGORIE_ID']
        });
        
        if (!categorie) {
          categorie = await Categorie.create({
            NOM_CATEGORIE: productCategorie
          });
        }
        
        const categorieId = categorie.CATEGORIE_ID;
      
          /* Créez le produit dans la base de données */
          const nouveauProduit = await Produit.create({
            NOM: nom,
            CATEGORIE_ID: categorieId,
            POIDS : productWeight,
            DIMENSIONS: productDimensions,
            PRIX_UNIT: productPrix,
            PRODUIT_IMAGE : imageProduit
          });
          res.status(201).json({ success: true, produit: nouveauProduit.dataValues });
          
      } catch (error) {
        console.error('Erreur lors de l\'ajout du produit :', error);
        res.status(500).json({ success: false, message: "Une erreur s'est produite lors de l'ajout du produit." });
      }
    },

    /* Contrôleur pour télécharger une image
    uploadImage : async (req, res) => {
      try {
        const { nomProduit } = req.body;
        const imageProduit = req.file.buffer;

        const produit = await Produit.create({ nomProduit, imageProduit });

        res.status(201).json(produit);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }*/
    
  };