const { Op, literal } = require("sequelize");
const { Sequelize } = require("sequelize");
const sequelize = require("../config/db");
const KEY = process.env.DEV_KEY;
var jwt = require("jsonwebtoken");
const initModels = require("../model/tables/init-models").initModels;
const models = initModels(sequelize);

// Trouver tous les produits

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


module.exports={
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
     // récupérer le nombre total de commande
    getTotalOrders: async (req, res) => {
        try {
          const totalOrdersCount = await models.commande.count();
          res.status(200).json({ totalOrdersCount });
        } catch (error) {
          res.status(500).json({
            message: "Erreur lors de la récupération du nombre total de commande: " + error.message,
          });
        }
      },
    
      ///nombre de fournisseur
      getNumberSupplier: async (req, res) =>{
        try {
            const totalSupplier = await models.fournisseur.count();
            res.status(200).json({ totalSupplier });
          } catch (error) {
            res.status(500).json({
              message: "Erreur lors de la récupération du nombre total de fournisseur: " + error.message,
            });
          }

      },
      /// le seuil de nos produits
      getReplenishmentLevel :async (req, res) =>{
        try{
            const product = await models.produit.findOne();
            const level = product.SEUIL;
            res.status(200).json({ level });
        }catch (error) {
            res.status(500).json({
              message: "Erreur lors de la récupération du seuil: " + error.message,
            });
        }
    },

    //Le graphe avec les stats générales de tous les produits 

    getSalesAndPurchasesByPeriod: async (req, res) => {
        try {
            const period = req.query.period || 'month'; // 'day', 'week', 'month'
            
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
                    }
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
    /// stock value = la somme des prix de tout les commandes 
    getTotalOrdersPrice : async (req, res) => {
        try {
            const totalOrdersPrice = await models.commande.sum('PRIX_TOTAL');
    
            res.status(200).json({ totalOrdersPrice });
        } catch (error) {
            console.error("Erreur lors de la récupération de la somme des prix des commandes:", error);
            res.status(500).json({
                message: "Erreur lors de la récupération de la somme des prix des commandes: " + error.message
            });
        }
    },
    ///stock alert

    calculateStockAlert: async (req, res) => {
        try {
            const commandeclient = await models.commande_client.findAll({
                attributes: ['COMM_CLIENT_ID'],
                where:{
                    TYPE_COMMANDE:'commande'
                }
            });

           
            const commandeIds = commandeclient.map(order =>order.COMM_CLIENT_ID);
            

            // Récupérer toutes les lignes de commande avec le type de commande 'commande'
            const orderLines = await models.ligne_commande.findAll({
                include: [{
                    model: models.commande ,
                    as: "COMMANDE",
                    where:{
                        commande_id: {
                            [Sequelize.Op.in]: commandeIds
                        }
                    },
                }]
            });

            
    
            // Initialiser un objet pour stocker la somme des quantités commandées pour chaque produit
            const quantitiesByProduct = {};
    
            // Calculer la somme des quantités commandées pour chaque produit
            orderLines.forEach(orderLine => {
                const productId = orderLine.PRODUIT_ID;
                const quantity = orderLine.QUANTITE;
                quantitiesByProduct[productId] = (quantitiesByProduct[productId] || 0) + quantity;
            });

            const productIds = Object.keys(quantitiesByProduct);
    
            // Récupérer les informations sur les produits depuis la table produit
            const products = await models.produit.findAll({
                attributes: ['PRODUIT_ID','NOM', 'QUANTITE'], // Ne pas oublier d'ajouter PRODUIT_IMAGE
                where: {
                    PRODUIT_ID : {
                        [Sequelize.Op.in] : productIds
                    }
                }
            });

            console.log(products);
    
            // Vérifier les produits en stock alert
            const stockAlertProducts = [];
            products.forEach(product => {
                const productId = product.PRODUIT_ID;
                const availableQuantity = product.QUANTITE || 0;
                const orderedQuantity = quantitiesByProduct[productId] || 0;
    
                if (orderedQuantity >= availableQuantity) {
                    stockAlertProducts.push({
                        productName: product.NOM,
                        status: "Critical"
                    });
                } else {
                    stockAlertProducts.push({
                        productName: product.NOM,
                        status: "OK"
                    });
                }
            });
    
            res.status(200).json({ success: true, stockAlertProducts });
        } catch (error) {
            console.error('Erreur lors du calcul des produits en stock alert :', error);
            res.status(500).json({ success: false, message: "Une erreur s'est produite lors du calcul des produits en stock alert." });
        }
    },
    
    
    
    
    
    ///low quantity stock
    getLowStockProducts: async (req, res) => {
        try {
            const lowStockProducts = await models.produit.findAll({
                where: {
                    QUANTITE: { [Sequelize.Op.lt]: Sequelize.col('SEUIL')  } // ou tout autre seuil de faible stock que vous souhaitez utiliser
                }
            });
    
            res.status(200).json({ success: true, lowStockProducts });
        } catch (error) {
            res.status(500).json({ success: false, message: "Erreur lors de la récupération des produits en faible stock: " + error.message });
        }
    },
    
    getTopStockPagination: async (req,res) => {
        try {
        const start = parseInt(req.query.start);
        const limit = parseInt(req.query.limit);

        if (isNaN(start) || isNaN(limit)) {
            throw new Error("start and limit must be enter as a positive number !");
        }
        console.log(`Top Selling Stock Pagination => start : ${start}, limit : ${limit}`);
        models.produit.findAll({
            include: [
            {
                model: models.produit_vendu,
                as: "produit_vendus",
                attributes: ['QUANTITE'],
                required: true,
            },
            {
                model: models.inventaire_produit,
                as: "inventaire_produits",
                attributes:['QUANTITE_OBSERVEE'],
                requuired:true
            }
            ],
            attributes:['NOM','PRIX_UNIT'],
            order: [[sequelize.col('produit_vendus.QUANTITE'), "DESC"]],
            // offset: start
            // limit: limit
        }).then((result) => {
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
            console.error("Error fetching top selling stock:", error);
        });
    } catch (error) {
        res.status(500).json({
        message:
            "Erreur lors de la récupération des produits: " + error.message,
        });
    }
    }
    
    
}

