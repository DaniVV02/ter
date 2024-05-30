const { Op, literal, where } = require("sequelize");
const { Sequelize } = require("sequelize");
const sequelize = require("../config/db");
const initModels = require("../model/tables/init-models").initModels;
const models = initModels(sequelize);

// Fonction pour obtenir le nom du mois
function getMonthName(monthNumber) {
  const monthNames = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  return monthNames[monthNumber - 1];
}

// Fonction pour obtenir la date du premier jour de la semaine à partir de l'année et du numéro de la semaine
function getFirstDayOfWeek(year, week) {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4)
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}

module.exports = {
  // recuperer tout les produits
  getAllProducts: async (req, res) => {
    try {
      const products = await db.PRODUIT.findAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({
        message:
          "Erreur lors de la récupération des produits: " + error.message,
      });
    }
  },
  getProductPagination: async (req, res) => {
    try {
      const start = parseInt(req.query.start);
      const limit = parseInt(req.query.limit);

      if (isNaN(start) || isNaN(limit)) {
        throw new Error("start and limit must be enter as a positive number !");
      }
      console.log(`Product pagination => start : ${start}, limit : ${limit}`);

      models.produit
        .findAll({
          include: [
            {
              model: models.inventaire_produit,
              as: "inventaire_produits",
              required: true,
            },
          ],
          order: [["PRODUIT_ID", "ASC"]],
          offset: start,
          limit: limit,
        })
        .then((result) => {
          const formattedResult = result.map((produit) => {
            return produit.dataValues;
          });
          console.table(formattedResult);
          console.table(
            formattedResult.map((produit) => {
              return produit.inventaire_produits[0].dataValues;
            })
          );
          res.status(200).json(result);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    } catch (error) {
      res.status(500).json({
        message:
          "Erreur lors de la récupération des produits: " + error.message,
      });
    }
  },

  // recuperer un seul produit specifique
  getProductById: async (req, res) => {
    try {
      const productId = parseInt(req.query.id);
      console.log(`Product fecthing... => id : ${productId}`);

      const product = await models.produit.findByPk(productId, {
        include: [
          {
            model: models.inventaire_produit,
            as: "inventaire_produits",
            required: true,
          },
        ],
      });

      if (!product) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      console.table(product.dataValues);

      res.json(product);
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération du produit: " + error.message,
      });
    }
  },

  ///// requetes de overview details

  overviewProduct : async(req,res) => {
    try{
      const prodId = req.query.id;

      const productInformation = await models.produit.findOne({
        attributes: ['NOM', 'SKU', 'CLASSE', 'PRIX_UNIT'],
        include: [{
          model: models.categorie,
          attributes: ['NOM_CATEGORIE'],
          as: 'CATEGORIE'
        }],
        where: {
          PRODUIT_ID : prodId
        } 
      });

      console.table(productInformation.dataValues);

      const resultat = {
        NOM: productInformation.NOM,
        SKU: productInformation.SKU,
        CLASSE: productInformation.CLASSE,
        PRIX_UNIT:productInformation.PRIX_UNIT,
        CATEGORIE: productInformation.CATEGORIE ? productInformation.CATEGORIE.NOM_CATEGORIE : null,
      }

      return res.json(resultat);

    }catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération du produit: " + error.message,
      });
    }
  },
  //// requetes des supplier details

  getSupplierDetails : async (req, res) => {
    try{
      const prodId = req.query.id;

      const supplierInformation = await models.produit.findOne({
        where: {
          PRODUIT_ID: prodId
        }
      });

      const fournis = await models.fournisseur.findOne({
        attributes: ['NOM_FOURNISSEUR', 'TELEPHONE'],
        where: {
          FOURNISSEUR_ID : supplierInformation.FOURNISSEUR_ID
        }
      })
      /*if (!supplierInformation || !supplierInformation.FOURNISSEUR) {
        return res.status(404).json({
          message: "Fournisseur non trouvé pour ce produit"
        });
      }*/
  
      console.table(fournis.dataValues);
  
      const resultat = {
        NOM_FOURNISSEUR: fournis.NOM_FOURNISSEUR,
        NUM_TELEPHONE: fournis.TELEPHONE
      };
  
      return res.json(resultat);
  
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération du fournisseur: " + error.message,
      });
    }

  },

  getStockLocations : async(req,res) => {
    try {
      const prodId = req.query.prodId;
      const product = await models.produit.findOne({
        attributes:['QUANTITE', 'EMPLACEMENT_ID'],
        where :{
          PRODUIT_ID : prodId
        } 
      });

      const empl = await models.emplacement.findOne({
        attributes: ['NOM_EMPLACEMENT', 'DESC_EMPLACEMENT'],
        where :{
          EMPLACEMENT_ID : product.EMPLACEMENT_ID 
        }
      });
      const response = {
        NomEmplacement: empl.NOM_EMPLACEMENT,
        DescriptionEmplacement: empl.DESC_EMPLACEMENT,
        QuantiteStock: product.QUANTITE,
      };
      res.status(200).json(response);

    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération de l'emplacement: " + error.message,
      });
    }

  },

  getImage : async (req, res) => {
    try {
      const produit = await models.produit.findByPk(req.query.id);
  
      if (!produit || !produit.PRODUIT_IMAGE) {
        return res.status(404).json({ error: 'Produit ou image non trouvée' });
      }
  
      //res.set('Content-Type', 'image/jpeg'); // Ou le type MIME approprié
      res.send(produit.PRODUIT_IMAGE);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


  getQuantityDetails : async (req,res) => {
    try {
      const prodId = req.query.productId;
      const quantiteProd = await models.produit.findOne({
        attributes : [
          'QUANTITE', 'SEUIL'
        ],
        where: {
          PRODUIT_ID: prodId
        }
      });

      const commandeClient = await models.commande_client.findAll({
        attributes: ['COMM_CLIENT_ID'],
        where : {
          TYPE_COMMANDE : 'commande'
        }
      });

      const commandeIds = commandeClient.map(order => order.COMM_CLIENT_ID);
      
      const atPreparation = await models.ligne_commande.count({
        include: [
          {
              model: models.commande,
              as: "COMMANDE",
              attributes: [],
              where: {
                  DATE_DEPART : null,
                  COMMANDE_ID : {
                    [Op.in] : commandeIds
                  }
              }
          }
        ],

        where: {
          PRODUIT_ID : prodId,
        }
      });

      const onTheWay = await models.ligne_commande.count({
        include: [
          {
              model: models.commande,
              as: "COMMANDE",
              attributes: [],
              where: {
                DATE_DEPART : {
                  [Op.not] : null
                },
                COMMANDE_ID : {
                  [Op.in] : commandeIds
                }
                 
              }
          }
        ],

        where: {
          PRODUIT_ID : prodId,
        }
      });

    const response = {
      Quantity: quantiteProd.QUANTITE,
      atPreparation: atPreparation,
      onTheWay: onTheWay,
      TressHoldValue: quantiteProd.SEUIL
    };

    res.status(200).json(response);
    }catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  productMovement : async(req,res) => {
    try {
      const period = req.query.period || 'month'; // 'day', 'week', 'month'
      const productId = req.query.productId;
      
      // Calculer la date de début en fonction de la période
      const startDate = new Date();
      if (period === 'day') {
          startDate.setDate(startDate.getDate() - 12);
      } else if (period === 'week') {
          startDate.setDate(startDate.getDate() - 7 * 12);
      } else { // 'month'
          startDate.setMonth(startDate.getMonth() - 12);
      }

      let dateColumn, groupByColumns, groupByColumnsComm;

      if (period === 'day') {
          dateColumn = 'DATE_VENTE';
          groupByColumns = [
              sequelize.literal('YEAR(`VENTE`.`DATE_VENTE`)'),
              sequelize.literal('MONTH(`VENTE`.`DATE_VENTE`)'),
              sequelize.literal('DAY(`VENTE`.`DATE_VENTE`)')
          ];
          groupByColumnsComm = [
              sequelize.literal('YEAR(`COMMANDE`.`DATE_COMMANDE`)'),
              sequelize.literal('MONTH(`COMMANDE`.`DATE_COMMANDE`)'),
              sequelize.literal('DAY(`COMMANDE`.`DATE_COMMANDE`)')
          ];
      } else if (period === 'week') {
          dateColumn = 'DATE_VENTE';
          groupByColumns = [
              sequelize.literal('YEAR(`VENTE`.`DATE_VENTE`)'),
              sequelize.literal('WEEK(`VENTE`.`DATE_VENTE`, 3)') // MySQL specific syntax for ISO week number
          ];
          groupByColumnsComm = [
              sequelize.literal('YEAR(`COMMANDE`.`DATE_COMMANDE`)'),
              sequelize.literal('WEEK(`COMMANDE`.`DATE_COMMANDE`, 3)')
          ];
      } else { // 'month'
          dateColumn = 'DATE_VENTE';
          groupByColumns = [
              sequelize.literal('YEAR(`VENTE`.`DATE_VENTE`)'),
              sequelize.literal('MONTH(`VENTE`.`DATE_VENTE`)')
          ];
          groupByColumnsComm = [
              sequelize.literal('YEAR(`COMMANDE`.`DATE_COMMANDE`)'),
              sequelize.literal('MONTH(`COMMANDE`.`DATE_COMMANDE`)')
          ];
      }

      // Requête pour les ventes
      const sales2 = await models.produit_vendu.findAll({
          attributes: [
              [sequelize.literal('YEAR(`VENTE`.`DATE_VENTE`)'), 'Année'],
              [sequelize.literal(`MONTH(\`VENTE\`.\`${dateColumn}\`)`), 'Mois'],
              ...(period === 'day' ? [[sequelize.literal('DAY(`VENTE`.`DATE_VENTE`)'), 'Jour']] : []),
              ...(period === 'week' ? [[sequelize.literal('WEEK(`VENTE`.`DATE_VENTE`, 3)'), 'Semaine']] : []),
              [sequelize.fn('SUM', sequelize.col('QUANTITE')), 'sales2']
          ],
          include: [
              {
                  model: models.vente,
                  as: "VENTE",
                  attributes: [],
                  where: {
                      [dateColumn]: {
                          [Op.between]: [startDate, new Date()]
                      }
                  }
              }
          ],
          where: {
            produit_id: productId // Filtrer par produit
          },
          group: groupByColumns,
          order: [
              [sequelize.literal('YEAR(`VENTE`.`DATE_VENTE`)'), 'DESC'],
              ...groupByColumns.slice(1).map(col => [col, 'DESC'])
          ]
      });
      const salesData = sales2.map(record => record.get());

      // Requête pour récupérer les commandes aux fournisseurs 
      const purchaseOrders = await models.commande_fournisseur.findAll({
          attributes: ['COMM_FOURN_ID'],
          where: {
              TYPE_COMMANDE: 'commande'
          }
      });

      const commandeIds = purchaseOrders.map(order => order.COMM_FOURN_ID);

      // Requête pour la somme de la quantité achetée par mois
      const purchases = await models.ligne_commande.findAll({
          attributes: [
              [sequelize.literal('YEAR(`COMMANDE`.`DATE_COMMANDE`)'), 'Année'],
              [sequelize.literal('MONTH(`COMMANDE`.`DATE_COMMANDE`)'), 'Mois'],
              ...(period === 'day' ? [[sequelize.literal('DAY(`COMMANDE`.`DATE_COMMANDE`)'), 'Jour']] : []),
              ...(period === 'week' ? [[sequelize.literal('WEEK(`COMMANDE`.`DATE_COMMANDE`, 3)'), 'Semaine']] : []),
              [sequelize.fn('SUM', sequelize.col('QUANTITE')), 'Purchases']
          ],
          where: {
              commande_id: {
                  [Op.in]: commandeIds
              },
              produit_id: productId 
          },
          include: [
              {
                  model: models.commande,
                  as: "COMMANDE",
                  attributes: [],
                  where: {
                      DATE_COMMANDE: {
                          [Op.between]: [startDate, new Date()]
                      }
                  }
              }
          ],
          group: groupByColumnsComm,
          order: [
              [sequelize.literal('YEAR(`COMMANDE`.`DATE_COMMANDE`)'), 'DESC'],
              ...groupByColumnsComm.slice(1).map(col => [col, 'DESC'])
          ]
      });

      const purchaseData = purchases.map(record => record.get());

      // Fusionner les résultats des ventes et des achats par période
      const mergedData = {};

      salesData.forEach(sale => {
          let key, displayName;
          if (period === 'day') {
              key = `${sale['Année']}-${sale['Mois']}-${sale['Jour']}`;
              displayName = `${sale['Jour']} ${getMonthName(sale['Mois'])} ${sale['Année']}`;
          } else if (period === 'week') {
              key = `${sale['Année']}-W${sale['Semaine']}`;
              const firstDayOfWeek = getFirstDayOfWeek(sale['Année'], sale['Semaine']);
              displayName = `Semaine du ${firstDayOfWeek.toLocaleDateString()} - Semaine ${sale['Semaine']} de l'année ${sale['Année']}`;
              //displayName = `Semaine ${sale['Semaine']} ${sale['Année']}`;
          } else {
              key = `${sale['Année']}-${sale['Mois']}`;
              displayName = `${getMonthName(sale['Mois'])} ${sale['Année']}`;
          }

          if (!mergedData[key]) {
              mergedData[key] = { Période: displayName, Sales: 0, Purchases: 0 };
          }
          mergedData[key].Sales = sale.sales2;
      });

      purchaseData.forEach(purchase => {
          let key, displayName;
          if (period === 'day') {
              key = `${purchase['Année']}-${purchase['Mois']}-${purchase['Jour']}`;
              displayName = `${purchase['Jour']} ${getMonthName(purchase['Mois'])} ${purchase['Année']}`;
          } else if (period === 'week') {
              key = `${purchase['Année']}-W${purchase['Semaine']}`;
              const firstDayOfWeek = getFirstDayOfWeek(purchase['Année'], purchase['Semaine']);
              displayName = `Semaine du ${firstDayOfWeek.toLocaleDateString()} - Semaine ${purchase['Semaine']} de l'année ${purchase['Année']}`;
              //displayName = `Semaine ${purchase['Semaine']} ${purchase['Année']}`;
          } else {
              key = `${purchase['Année']}-${purchase['Mois']}`;
              displayName = `${getMonthName(purchase['Mois'])} ${purchase['Année']}`;
          }

          if (!mergedData[key]) {
              mergedData[key] = { Période: displayName, Sales: 0, Purchases: 0 };
          }
          mergedData[key].Purchases = purchase.Purchases;
      });

      const result = Object.values(mergedData);
      console.log(result);
      res.status(200).json(result);

  } catch (error) {
      console.error('Erreur lors de la récupération des ventes et des achats par période :', error);
      res.status(500).json({
          message: 'Erreur lors de la récupération des ventes et des achats par période.'
      });
  }
  },


  // Requete graphe pour recup le total de revenus que ce produit a généré par mois/semaine/jour
  productFinance : async (req,res) => {

    try {
      const period = req.query.period || 'month'; // 'day', 'week', 'month'
      const productId = req.query.productId;
      
      // Calculer la date de début en fonction de la période
      const startDate = new Date();
      if (period === 'day') {
          startDate.setDate(startDate.getDate() - 12);
      } else if (period === 'week') {
          startDate.setDate(startDate.getDate() - 7 * 12);
      } else { // 'month'
          startDate.setMonth(startDate.getMonth() - 12);
      }

      let dateColumn, groupByColumns, groupByColumnsComm, selectColumns, selectColumns2;

      if (period === 'day') {
          dateColumn = 'DATE_VENTE';
          groupByColumns = [
              sequelize.literal('YEAR(`VENTE`.`DATE_VENTE`)'),
              sequelize.literal('MONTH(`VENTE`.`DATE_VENTE`)'),
              sequelize.literal('DAY(`VENTE`.`DATE_VENTE`)')
          ];
          groupByColumnsComm = [
              sequelize.literal('YEAR(`COMMANDE`.`DATE_COMMANDE`)'),
              sequelize.literal('MONTH(`COMMANDE`.`DATE_COMMANDE`)'),
              sequelize.literal('DAY(`COMMANDE`.`DATE_COMMANDE`)')
          ];
          selectColumns = [
            [sequelize.literal('YEAR(`VENTE`.`DATE_VENTE`)'), 'Année'],
            [sequelize.literal('MONTH(`VENTE`.`DATE_VENTE`)'), 'Mois'],
            [sequelize.literal('DAY(`VENTE`.`DATE_VENTE`)'), 'Jour'],
          ];
          selectColumns2 = [
            [sequelize.literal('YEAR(`COMMANDE`.`DATE_COMMANDE`)'), 'Année'],
            [sequelize.literal('MONTH(`COMMANDE`.`DATE_COMMANDE`)'), 'Mois'],
            [sequelize.literal('DAY(`COMMANDE`.`DATE_COMMANDE`)'), 'Jour'],
          ];
      } else if (period === 'week') {
          dateColumn = 'DATE_VENTE';
          groupByColumns = [
              sequelize.literal('YEAR(`VENTE`.`DATE_VENTE`)'),
              sequelize.literal('WEEK(`VENTE`.`DATE_VENTE`, 3)') // MySQL specific syntax for ISO week number
          ];
          groupByColumnsComm = [
              sequelize.literal('YEAR(`COMMANDE`.`DATE_COMMANDE`)'),
              sequelize.literal('WEEK(`COMMANDE`.`DATE_COMMANDE`, 3)')
          ];
          selectColumns = [
            [sequelize.literal('YEAR(`VENTE`.`DATE_VENTE`)'), 'Année'],
            [sequelize.literal('WEEK(`VENTE`.`DATE_VENTE`, 3)'), 'Semaine'],
          ];
          selectColumns2 = [
            [sequelize.literal('YEAR(`COMMANDE`.`DATE_COMMANDE`)'), 'Année'],
            [sequelize.literal('WEEK(`COMMANDE`.`DATE_COMMANDE`, 3)'), 'Semaine'],
          ];
      } else { // 'month'
          dateColumn = 'DATE_VENTE';
          groupByColumns = [
              sequelize.literal('YEAR(`VENTE`.`DATE_VENTE`)'),
              sequelize.literal('MONTH(`VENTE`.`DATE_VENTE`)')
          ];
          groupByColumnsComm = [
              sequelize.literal('YEAR(`COMMANDE`.`DATE_COMMANDE`)'),
              sequelize.literal('MONTH(`COMMANDE`.`DATE_COMMANDE`)')
          ];
          selectColumns = [
            [sequelize.literal('YEAR(`VENTE`.`DATE_VENTE`)'), 'Année'],
            [sequelize.literal('MONTH(`VENTE`.`DATE_VENTE`)'), 'Mois'],
          ];
          selectColumns2 = [
            [sequelize.literal('YEAR(`COMMANDE`.`DATE_COMMANDE`)'), 'Année'],
            [sequelize.literal('MONTH(`COMMANDE`.`DATE_COMMANDE`)'), 'Mois'],
          ];
        
      }

      // Requête pour les ventes
      const revenus = await models.produit_vendu.findAll({
          attributes: [
            ...selectColumns,
            [sequelize.fn('SUM', sequelize.col('QUANTITE')), 'totalSales']
          ],
          include: [
              {
                  model: models.vente,
                  as: "VENTE",
                  attributes: [],
                  where: {
                      [dateColumn]: {
                          [Op.between]: [startDate, new Date()]
                      }
                  },/*
                  model: models.produit,
                  as: "PRODUIT",
                  attributes: [],
                  where: {
                    produit_id: productId
                  }*/
              }
          ],
          where: {
            produit_id: productId // Filtrer par produit
          },
          group: groupByColumns, selectColumns,
          order: [
              [sequelize.literal('YEAR(`VENTE`.`DATE_VENTE`)'), 'DESC'],
              ...groupByColumns.slice(1).map(col => [col, 'DESC'])
          ]
      });
      const revenusData = revenus.map(record => record.get());

      // Requête pour récupérer les commandes aux fournisseurs 
      const purchaseOrders = await models.commande_client.findAll({
          attributes: ['COMM_CLIENT_ID'],
          where: {
              TYPE_COMMANDE: 'commande'
          }
      });

      const commandeIds = purchaseOrders.map(order => order.COMM_CLIENT_ID);

      // Requête pour la somme de la quantité achetée par mois
      const purchases = await models.ligne_commande.findAll({
          attributes: [
            ...selectColumns2,
              [sequelize.fn('SUM', sequelize.col('QUANTITE')), 'Purchases']
          ],
          where: {
              commande_id: {
                  [Op.in]: commandeIds
              },
              produit_id: productId 
          },
          include: [
              {
                  model: models.commande,
                  as: "COMMANDE",
                  attributes: [],
                  where: {
                      DATE_COMMANDE: {
                          [Op.between]: [startDate, new Date()]
                      }
                  }
              }
          ],
          group: groupByColumnsComm, selectColumns2,
          order: [
              [sequelize.literal('YEAR(`COMMANDE`.`DATE_COMMANDE`)'), 'DESC'],
              ...groupByColumnsComm.slice(1).map(col => [col, 'DESC'])
          ]
      });

      const purchaseData = purchases.map(record => record.get());


      // Récupérer le prix unitaire du produit
      const product = await models.produit.findOne({
        where: { PRODUIT_ID: productId },
        attributes: ['PRIX_UNIT']
      });

      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      const prixUnit = product.PRIX_UNIT;


      // Fusionner les résultats des ventes et des achats par période
      const mergedData = {};

      revenusData.forEach(sale => {
          let key, displayName;
          if (period === 'day') {
              key = `${sale['Année']}-${sale['Mois']}-${sale['Jour']}`;
              displayName = `${sale['Jour']} ${getMonthName(sale['Mois'])} ${sale['Année']}`;
          } else if (period === 'week') {
              key = `${sale['Année']}-W${sale['Semaine']}`;
              const firstDayOfWeek = getFirstDayOfWeek(sale['Année'], sale['Semaine']);
              displayName = `Semaine du ${firstDayOfWeek.toLocaleDateString()} - Semaine ${sale['Semaine']} de l'année ${sale['Année']}`;
              //displayName = `Semaine ${sale['Semaine']} ${sale['Année']}`;
          } else {
              key = `${sale['Année']}-${sale['Mois']}`;
              displayName = `${getMonthName(sale['Mois'])} ${sale['Année']}`;
          }

          if (!mergedData[key]) {
            mergedData[key] = { Période: displayName, VentesMagasin: 0 };
        }
        mergedData[key].VentesMagasin += sale.totalSales * prixUnit;
      });

      purchaseData.forEach(purchase => {
          let key, displayName;
          if (period === 'day') {
              key = `${purchase['Année']}-${purchase['Mois']}-${purchase['Jour']}`;
              displayName = `${purchase['Jour']} ${getMonthName(purchase['Mois'])} ${purchase['Année']}`;
          } else if (period === 'week') {
              key = `${purchase['Année']}-W${purchase['Semaine']}`;
              const firstDayOfWeek = getFirstDayOfWeek(purchase['Année'], purchase['Semaine']);
              displayName = `Semaine du ${firstDayOfWeek.toLocaleDateString()} - Semaine ${purchase['Semaine']} de l'année ${purchase['Année']}`;          } else {
              key = `${purchase['Année']}-${purchase['Mois']}`;
              displayName = `${getMonthName(purchase['Mois'])} ${purchase['Année']}`;
          }

          if (!mergedData[key]) {
              mergedData[key] = { Période: displayName, CommandesClient: 0 };
          }
          mergedData[key].CommandesClient = purchase.Purchases *prixUnit;
      });

      for(const obj in mergedData){
        if(mergedData[obj].CommandesClient && mergedData[obj].VentesMagasin)
        mergedData[obj].TotalRevenus = mergedData[obj].CommandesClient + mergedData[obj].VentesMagasin;
      }

      const result = Object.values(mergedData);
      console.log(result);
      res.status(200).json(result);

    } catch (error) {
        console.error('Erreur lors de la récupération des ventes et des achats par période :', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des ventes et des achats par période.'
        });
    }

  },

  productQuantityHistory : async (req,res) => {
    try {
      const period = req.query.period;// || 'month'; // 'day', 'week', 'month'
      const productId = req.query.productId;
      
      // Calculer la date de début en fonction de la période
      const startDate = new Date();
      if (period === 'day') {
          startDate.setDate(startDate.getDate() - 12);
      } else if (period === 'week') {
          startDate.setDate(startDate.getDate() - 7 * 12);
      } else { // 'month'
          startDate.setMonth(startDate.getMonth() - 12);
      }

      let groupByColumns, selectColumns;

      if (period === 'day') {
          groupByColumns = [
              sequelize.literal('YEAR(`STOCK`.`DATE_STOCK`)'),
              sequelize.literal('MONTH(`STOCK`.`DATE_STOCK`)'),
              sequelize.literal('DAY(`STOCK`.`DATE_STOCK`)')
          ];
          selectColumns = [
            [sequelize.literal('YEAR(`STOCK`.`DATE_STOCK`)'), 'Année'],
            [sequelize.literal('MONTH(`STOCK`.`DATE_STOCK`)'), 'Mois'],
            [sequelize.literal('DAY(`STOCK`.`DATE_STOCK`)'), 'Jour'],
          ];
      } else if (period === 'week') {
          groupByColumns = [
              sequelize.literal('YEAR(`STOCK`.`DATE_STOCK`)'),
              sequelize.literal('WEEK(`STOCK`.`DATE_STOCK`, 3)') // MySQL specific syntax for ISO week number
          ];
          selectColumns = [
            [sequelize.literal('YEAR(`STOCK`.`DATE_STOCK`)'), 'Année'],
            [sequelize.literal('WEEK(`STOCK`.`DATE_STOCK`, 3)'), 'Semaine'],
          ];
      } else { // 'month'
          groupByColumns = [
              sequelize.literal('YEAR(`STOCK`.`DATE_STOCK`)'),
              sequelize.literal('MONTH(`STOCK`.`DATE_STOCK`)')
          ];
          selectColumns = [
            [sequelize.literal('YEAR(`STOCK`.`DATE_STOCK`)'), 'Année'],
            [sequelize.literal('MONTH(`STOCK`.`DATE_STOCK`)'), 'Mois'],
          ];
        
      }

      // Requête pour la quantité moyenne
      const revenus = await models.stock.findAll({
          attributes: [
            ...selectColumns,
            [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('QUANTITE_STOCK'))), 'averageQuantity']
          ],          
          where: {
            produit_id: productId, 
            ['DATE_STOCK']: {
              [Op.between]: [startDate, new Date()]
          }
          },
          group: groupByColumns,
          order: [
              [sequelize.literal('YEAR(`STOCK`.`DATE_STOCK`)'), 'DESC'],
              ...groupByColumns.slice(1).map(col => [col, 'DESC'])
          ]
      });
      const revenusData = revenus.map(record => record.get());

      // Récupérer le prix unitaire du produit
      const product = await models.produit.findOne({
        where: { PRODUIT_ID: productId },
        attributes: ['PRIX_UNIT']
      });

      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      const prixUnit = product.PRIX_UNIT;


      // Fusionner les résultats des ventes et des achats par période
      const mergedData = {};

      revenusData.forEach(sale => {
          let key, displayName;
          if (period === 'day') {
              key = `${sale['Année']}-${sale['Mois']}-${sale['Jour']}`;
              displayName = `${sale['Jour']} ${getMonthName(sale['Mois'])} ${sale['Année']}`;
          } else if (period === 'week') {
              key = `${sale['Année']}-W${sale['Semaine']}`;
              const firstDayOfWeek = getFirstDayOfWeek(sale['Année'], sale['Semaine']);
              displayName = `Semaine du ${firstDayOfWeek.toLocaleDateString()} - Semaine ${sale['Semaine']} de l'année ${sale['Année']}`;
              //displayName = `Semaine ${sale['Semaine']} ${sale['Année']}`;
          } else {
              key = `${sale['Année']}-${sale['Mois']}`;
              displayName = `${getMonthName(sale['Mois'])} ${sale['Année']}`;
          }

          if (!mergedData[key]) {
            mergedData[key] = { Période: displayName, AverageQuantity: 0 , Income: 0};
        }
        mergedData[key].AverageQuantity = sale.averageQuantity;
        mergedData[key].Income += sale.averageQuantity *prixUnit;
      });

      const result = Object.values(mergedData);
      console.log(result);
      res.status(200).json(result);

    } catch (error) {
        console.error('Erreur lors de la récupération des quantités et de revenus par période :', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des quantités et des revenus par période.'
        });
    }
  },

  addOrSustractProduit : async (req,res) => {
    //const addSustract = req.query.modif;
    const quantity = req.query.quantity;
    const prodId = req.query.idProd;

    const pad = (number) => number.toString().padStart(2, '0');

    const now = new Date();
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1); // Les mois sont de 0 à 11
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    console.log(formattedDate);
    try{
      const product = await models.produit.findOne({
        where: {
          PRODUIT_ID : prodId
        }
      });

        const incrementResult = await product.increment('QUANTITE', { by: quantity });
        const updateStock = await models.stock.create({
          QUANTITE_STOCK : incrementResult.QUANTITE,
          PRODUIT_ID : product.PRODUIT_ID,
          DATE_STOCK : formattedDate
        });
        res.status(200).json(updateStock);
 
  
    }catch (error) {
      console.error('Erreur lors de l incrémentation ou décrementation de la quantité :', error);
      res.status(500).json({
          message: 'Erreur lors de l incrémentation ou décrementation de la quantité'
      });
  }

  },









/************  CRUD PRODUIT ***************/

  // Creer un nouveau produit
  createProduct: async (req, res) => {
    try {
      const productData = req.body;
      const newProduct = await db.PRODUIT.create(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la création du produit: " + error.message,
      });
    }
  },
  // Update un produit en lui passant en parametre un id
  updateProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const newData = req.body;
      const product = await db.PRODUIT.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      await product.update(newData);
      res.json(product);
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la mise à jour du produit: " + error.message,
      });
    }
  },
  // Delete un produit en lui passant en parametre un id
  deleteProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await db.PRODUIT.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      await product.destroy();
      res.json({ message: "Produit supprimé avec succès" });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la suppression du produit: " + error.message,
      });
    }
  },


  // getProductsOverview: async (req,res) => {
  //   try {
  //     consolelog("Products Overview =>");
  //     await models.produit.findAll({
  //       attributes: [
  //         'NOM',
  //         'SKU',
  //         'CLASSE',
  //         'PRIX_UNIT',
  //         [col('Categorie.NOM_CATEGORIE'), 'NOM_CATEGORIE'],
  //         'QUANTITE',
  //         [fn('COALESCE', literal('otw.OTW'), 0), 'OTW']
  //       ],
  //       include: [
  //         {
  //           model: categorie,
  //           attributes: [],
  //           required: true
  //         },
  //         {
  //           model: ligne_commande,
  //           attributes: [],
  //           include: [
  //             {
  //               model: commande,
  //               attributes: [],
  //               where: {
  //                 DATE_REEL_RECU: {
  //                   [Op.is]: null
  //                 }
  //               },
  //               include: [
  //                 {
  //                   model: commande_fournisseur,
  //                   attributes: []
  //                 }
  //               ]
  //             }
  //           ],
  //           required: false
  //         }
  //       ],
  //       subQuery: false,
  //       group: [
  //         'Produit.PRODUIT_ID',
  //         'Produit.NOM',
  //         'Produit.SKU',
  //         'Produit.CLASSE',
  //         'Produit.PRIX_UNIT',
  //         'Categorie.NOM_CATEGORIE',
  //         'Produit.QUANTITE',
  //         'otw.OTW'
  //       ],
  //       raw: true,
  //       having: literal(`
  //         EXISTS (
  //           SELECT 
  //             COUNT(*) as OTW
  //           FROM 
  //             COMMANDE c
  //             JOIN LIGNE_COMMANDE l ON c.COMMANDE_ID = l.COMMANDE_ID
  //             JOIN COMMANDE_FOURNISSEUR cf ON cf.COMM_FOURN_ID = l.COMMANDE_ID
  //           WHERE 
  //             DATE_REEL_RECU IS NULL
  //             AND l.PRODUIT_ID = Produit.PRODUIT_ID
  //           GROUP BY 
  //             l.PRODUIT_ID
  //         )
  //       `)
  //     });
  //   } catch (error){
  //       res.status(500).json({
  //       message:
  //         "Erreur lors de la récupération des produits overview: " + error.message,
  //     });
  //   }
  // }
};
