const { Sequelize } = require("sequelize");
const sequelize = require("../config/db");
const KEY = process.env.DEV_KEY;
var jwt = require("jsonwebtoken");
const initModels = require("../model/tables/init-models").initModels;
const models = initModels(sequelize);


//////totale produit////
module.exports = {
    // récupérer le nombre total de produits
    getTotalProductsCount: async (req, res) => {
      try {
        const totalProductsCount = await models.produit.count();
        res.status(200).json({ totalProductsCount });
      } catch (error) {
        res.status(500).json({
          message: "Erreur lors de la récupération du nombre total de produits: " + error.message,
        });
      }
    },
  ////// totale categorie/////
  getTotalCategories: async (req, res) => {
    try{
        const TotalCategoriesCount = await models.categorie.count();
        res.status(200).json({ TotalCategoriesCount});
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération du nombre total de categorie: " + error.message,
          });
    } 
  },
   
getTopSellingProduct: async (req, res) => {
  try {
    console.log(`Top Selling Product =>`);
    await models.produit
      .findAll({
        include: [
          {
            model: models.produit_vendu,
            as: "produit_vendus",
            attributes: [],
            required: true,
          },
        ],
        attributes: ['NOM'],
        order: [[sequelize.col('produit_vendus.QUANTITE'), "DESC"]],
      })
      .then((result) => {
        if (result.length > 0) {
          const topProduct = result[0].dataValues;
          console.table([topProduct]); 
          res.status(200).json(topProduct);
        } else {
          res.status(404).json({ message: "No products found" });
        }
      })
      .catch((error) => {
        console.error("Error fetching top selling product:", error);
        res.status(500).json({
          message: "Error fetching top selling product: " + error.message,
        });
      });
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la récupération du top selling product: " + error.message,
    });
  }
},
    // récupérer le nombre de produits en faible stock
    getLowStockProductsCount: async (req, res) => {
        try {
          models.produit.count({
            where: {
              QUANTITE: { [Sequelize.Op.lt]: 10 }
            }
          }).then( (result) => {
              res.status(200).json({ result });

          })
        } catch (error) {
          res.status(500).json({
            message: "Erreur lors de la récupération du nombre de produits en faible stock: " + error.message,
          });
        }
      },
      //cette fonction a ete dans inventoryController 
      getProduitPlusVendu : async function(req, res){

        try {
            const produitPlusVendu = await models.produit.findAll({
                include: [{
                    model: models.produit_vendu,
                    as: 'produit_vendus', // Spécifiez l'alias correct ici
                    attributes: [
                        [sequelize.fn('SUM', sequelize.col('QUANTITE')), 'totalVentes']
                    ],
                    group: ['produit_vendus.PRODUIT_ID'],
                    order: [[sequelize.literal('totalVentes'), 'DESC']],
                    limit: 1
                }]
            });

            res.json(produitPlusVendu);
        } catch (error) {
            console.error("Error retrieving most sold product:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },
      
}
