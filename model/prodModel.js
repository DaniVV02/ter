const { Op } = require('sequelize');
module.exports = {

    //REQUETES PAR RAPPORT AU FIGMA

    selectProdIDAndName: function(Produit, prod_id, prod_name){
        return Produit.findOne({
            where: {
                PRODUIT_ID: prod_id,
                NOM : prod_name 
            }
        })
        .catch(error => {
            console.error('Erreur lors de la recherche du produit par ID :', error);
            throw new Error('Erreur lors de la recherche du produit par ID');
        });

    },



}