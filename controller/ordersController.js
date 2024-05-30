const { Sequelize } = require("sequelize");
const sequelize = require("../config/db");
const initModels = require("../model/tables/init-models").initModels;
const models = initModels(sequelize);

/////totale orders////
module.exports = {
  // ces 2 fonctions etais dans orderController
  showOrders: async function (req, res) {
    try {
      // Récupérer le nombre total de commandes
      const totalOrders = await CommFourn.count();

      // Récupérer la liste des commandes
      const orders = await CommFourn.findAll();

      // Envoyer les données au client
      res.status(200).json({
        success: true,
        totalOrders: totalOrders,
        orders: orders,
      });
    } catch (error) {
      console.error("Erreur lors de l'affichage des commandes :", error);
      res.status(500).json({
        success: false,
        message: "Une erreur s'est produite lors de l'affichage des commandes.",
      });
    }
  },
  getOrderPagination: async (req, res) => {
    try {
      const start = parseInt(req.query.start);
      const limit = parseInt(req.query.limit);
      const type = req.query.type;

      if (isNaN(start) || isNaN(limit)) {
        throw new Error("start and limit must be enter as a positive number !");
      }

      const allowedTypes = ["all", "exit", "entry"];

      // Check if the parameter matches one of the allowed values
      if (!allowedTypes.includes(type)) {
        return res.status(400).json({
          message: "Invalid type parameter. Valid types : all - exit - entry",
        });
      }
      console.log(`Order pagination => start : ${start}, limit : ${limit}`);
      switch (type) {
        case "all":
          models.commande
            .findAll({
              include: [
                {
                  model: models.produit,
                  as: "PRODUIT_ID_produits",
                  required: true,
                  attributes: ["NOM"],
                },
                {
                  model: models.commande_client,
                  as: "commande_client",
                  attributes: ["CLIENT_ID"],
                  required: false,
                },
                {
                  model: models.commande_fournisseur,
                  as: "commande_fournisseur",
                  attributes: ["FOURNISSEUR_ID"],
                  required: false,
                },
              ],
              order: [["COMMANDE_ID", "ASC"]],
              offset: start,
              limit: limit,
            })
            .then((result) => {
              const formattedResult = result.map((commande) => {
                return commande.dataValues;
              });
              console.table(formattedResult);
              console.table(
                formattedResult.map((commande) => {
                  return commande.dataValues;
                })
              );
              res.status(200).json(result);
            })
            .catch((error) => {
              console.error("Error fetching orders:", error);
            });
          break;

        case "entry":
          models.commande
            .findAll({
              include: [
                {
                  model: models.produit,
                  as: "PRODUIT_ID_produits",
                  required: true,
                  attributes: ["NOM"],
                },

                {
                  model: models.commande_fournisseur,
                  as: "commande_fournisseur",
                  required: true,
                },
              ],
              order: [["COMMANDE_ID", "ASC"]],
              offset: start,
              limit: limit,
            })
            .then((result) => {
              const formattedResult = result.map((commande) => {
                return commande.dataValues;
              });
              console.table(formattedResult);
              console.table(
                formattedResult.map((commande) => {
                  return commande.dataValues;
                })
              );
              res.status(200).json(result);
            })
            .catch((error) => {
              console.error("Error fetching orders:", error);
            });
          break;

        case "exit":
          models.commande
            .findAll({
              include: [
                {
                  model: models.produit,
                  as: "PRODUIT_ID_produits",
                  required: true,
                  attributes: ["NOM"],
                },

                {
                  model: models.commande_client,
                  as: "commande_client",
                  required: true,
                },
              ],
              order: [["COMMANDE_ID", "ASC"]],
              offset: start,
              limit: limit,
            })
            .then((result) => {
              const formattedResult = result.map((commande) => {
                return commande.dataValues;
              });
              console.table(formattedResult);
              console.table(
                formattedResult.map((commande) => {
                  return commande.dataValues;
                })
              );
              res.status(200).json(result);
            })
            .catch((error) => {
              console.error("Error fetching orders:", error);
            });
          break;
      }
    } catch (error) {
      res.status(500).json({
        message:
          "Erreur lors de la récupération des commandes: " + error.message,
      });
    }
  },
  // récupérer le nombre total de commande
  getTotalOrdersCount: async (req, res) => {
    try {
      const totalOrdersCount = await models.commande.count();
      res.status(200).json( totalOrdersCount );
    } catch (error) {
      res.status(500).json({
        message:
          "Erreur lors de la récupération du nombre total de commande: " +
          error.message,
      });
    }
  },

  ///total commande recu
  getTotalOrdersReceived: async (req, res) => {
    try {
      const getTotalOrdersReceived = await models.commande.count({
        where: {
          Date_Reel_Recu: {
            [Sequelize.Op.ne]: null,
          },
        },
      });
      res.status(200).json({ getTotalOrdersReceived });
    } catch (error) {
      res.status(500).json({
        message:
          "Erreur lors de la récupération du nombre total de commandes recu: " +
          error.message,
      });
    }
  },
  ///totale commande retourner
  getReturnOrdersCount: async (req, res) => {
    try {
      const returnOrdersCount = await models.commande_fournisseur.count({
        where: {
          type_commande: "retour",
        },
      });
      res.status(200).json({ returnOrdersCount });
    } catch (error) {
      res.status(500).json({
        message:
          "Erreur lors de la récupération du nombre de commandes de type retour : " +
          error.message,
      });
    }
  },
  //// total commande en route
  getOrdersInTransitFournisseur: async (req, res) => {
    try {
      const ordersInTransitFournisseur =
        await models.commande_fournisseur.findAll({
          where: {
            DATE_REEL_RECU: null,
            TYPE_COMMANDE: "commande",
          },
        });
      res.status(200).json({ ordersInTransitFournisseur });
    } catch (error) {
      res.status(500).json({
        message:
          "Erreur lors de la récupération des commandes des fournisseurs en route : " +
          error.message,
      });
    }
  },

  getOrdersInTransitClient: async (req, res) => {
    try {
      const ordersInTransitClient = await models.commande_client.findAll({
        where: {
          DATE_REEL_RECU: null,
          TYPE_COMMANDE: "commande",
        },
      });
      res.status(200).json({ ordersInTransitClient });
    } catch (error) {
      res.status(500).json({
        message:
          "Erreur lors de la récupération des commandes des clients en route : " +
          error.message,
      });
    }
  },
  ////filtres
  /// fitre de date :
  getOrderByDate: async (req, res) => {
    try {
      const { date, type } = req.query;
      if (!date) {
        return res.status(400).json({
          message: "La date est requise",
        });
      }

      const specificDate = new Date(date);

      // Vérifier que la date est valide
      if (isNaN(specificDate.getTime())) {
        return res.status(400).json({
          message: "La date fournie est invalide",
        });
      }

      // Obtenir le début et la fin de la journée spécifique
      const startOfDay = new Date(specificDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(specificDate.setHours(23, 59, 59, 999));

      let result;
      switch (type) {
        case "all":
          result = await models.commande.findAll({
            where: {
              DATE_COMMANDE: {
                [Sequelize.Op.between]: [startOfDay, endOfDay],
              },
            },
            order: [["COMMANDE_ID", "ASC"]],
          });
          break;

        case "entry":
          result = await models.commande_fournisseur.findAll({
            where: {
              DATE_COMMANDE: {
                [Sequelize.Op.between]: [startOfDay, endOfDay],
              },
            },
            order: [["COMM_FOURN_ID", "ASC"]],
          });
          break;

        case "exit":
          result = await models.commande_client.findAll({
            where: {
              DATE_COMMANDE: {
                [Sequelize.Op.between]: [startOfDay, endOfDay],
              },
            },
            order: [["COMM_CLIENT_ID", "ASC"]],
          });
          break;

        default:
          return res.status(400).json({
            message: "Type invalide! Utilisez 'all', 'entry', ou 'exit'.",
          });
      }

      const formattedResult = result.map((commande) => commande.dataValues);
      console.table(formattedResult);
      res.status(200).json(formattedResult);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      res.status(500).json({
        message:
          "Erreur lors de la récupération des commandes: " + error.message,
      });
    }
  },
  // fitre par rapport au prix total de la commande
  getOrdersWithTotalPriceLessThan: async (req, res) => {
    try {
      const { totalPrice } = req.query;
      if (!totalPrice || isNaN(parseFloat(totalPrice))) {
        return res.status(400).json({
          message: "Le montant total est requis et doit être un nombre valide",
        });
      }

      const orders = await models.commande.findAll({
        where: {
          PRIX_TOTAL: {
            [Sequelize.Op.lt]: totalPrice,
          },
        },
      });

      const formattedOrders = orders.map((order) => order.dataValues);
      console.table(formattedOrders);
      res.status(200).json(formattedOrders);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      res.status(500).json({
        message:
          "Erreur lors de la récupération des commandes: " + error.message,
      });
    }
  },
  /// out of delevery
  getOrdersInDelivery: async (req, res) => {
    try {
      const ordersInDelivery = await models.commande.findAll({
        where: {
          DATE_REEL_RECU: null,
        },
      });

      const formattedOrders = ordersInDelivery.map((order) => order.dataValues);
      console.table(formattedOrders);
      res.status(200).json(formattedOrders);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des commandes en cours de livraison:",
        error
      );
      res.status(500).json({
        message:
          "Erreur lors de la récupération des commandes en cours de livraison: " +
          error.message,
      });
    }
  },
  getOrderById: async (req, res) => {
    try {
      const id = parseInt(req.query.id);

      if (isNaN(id)) {
        throw new Error("id must be enter as a positive number !");
      }

      console.log(`Order => id ${id}`);

      models.commande
        .findOne({
          include: [
            {
              model: models.produit,
              as: "PRODUIT_ID_produits",
              required: true,
              attributes: ["NOM"],
            },
            {
              model: models.commande_client,
              as: "commande_client",
              attributes: ["CLIENT_ID"],
              required: false,
            },
            {
              model: models.commande_fournisseur,
              as: "commande_fournisseur",
              attributes: ["FOURNISSEUR_ID"],
              required: false,
            },
          ],
          order: [["COMMANDE_ID", "ASC"]],
          where: { COMMANDE_ID: id },
        })
        .then((result) => {
          console.table(result.dataValues);
          res.status(200).json(result);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        });
    } catch (error) {
      res.status(500).json({
        message:
          "Erreur lors de la récupération des commandes: " + error.message,
      });
    }
  },
};
