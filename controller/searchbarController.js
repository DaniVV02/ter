const Sequelize = require("sequelize");
const sequelize = require("../config/db");
const initModels = require("../model/tables/init-models").initModels;
const models = initModels(sequelize);

module.exports = {
    findAlikeObject: async (req, res) => {
        try {
            const offset = parseInt(req.query.offset);
            const limit = parseInt(req.query.limit);
            const value = req.query.value;

            if (isNaN(offset) || isNaN(limit)) {
                throw new Error("start and limit must be enter as a positive number !");
            }
            // if (isNaN(value) || value.length < 1) {
            //     throw new Error("value need to be superior to 4 !");
            //   }
            console.log(` pagination de la recherche => start : ${offset}, limit : ${limit} value : ${value}`);


            const product = models.produit.findAll({
                where: {
                    NOM: {
                        [Sequelize.Op.like]: `%${value}%`
                    }
                },
                order: [
                    ['PRODUIT_ID', 'ASC']
                ],
                limit: limit,
                offset: offset
            }).then((result) =>{

                res.status(200).json(result);
            })


            // const order = await models.produit.findAll({
            //     include: [
            //         {
            //             model: models.ligne_commande,
            //             as: "ligne_commandes",
            //             required: true,
                        // where: {
                        //     COMMANDE_ID: {
                        //         [Sequelize.Op.eq]: Sequelize.col(models.commande_fournisseur.COMMANDE_ID)
                        //     }
                        // }
            //         }
            //     ],
            //     where: {
            //         NOM: {
            //             [Sequelize.Op.like]: `%${value}%`
            //         }
            //     },
            //     order: [
            //         ['PRODUIT_ID', 'ASC']
            //     ],
            //     limit: limit,
            //     offset: offset
            // });


            // // res.status(200).json(product);


        } catch (error) {
            res.status(500).json({
                message:
                    "Erreur lors de la récupération des produits: " + error.message,
            });
        }
    }
};