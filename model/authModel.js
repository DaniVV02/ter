const { Op } = require('sequelize');
const crypto = require('crypto');
module.exports={
    selectLogInUserID: function(User, user_id){
        return User.findOne({
            where: {
                USER_ID: user_id 
            }
        })
        .catch(error => {
            console.error('Erreur lors de la recherche de l\'utilisateur par ID :', error);
            throw new Error('Erreur lors de la recherche de l\'utilisateur par ID');
        });

    },
/*
    Post.findAll({
        where: {
          authorId: {
            [Op.eq]: 2,
          },
        },
      });

      Post.findAll({
        where: {
          [Op.or]: [{ authorId: 12 }, { authorId: 13 }],
        },
      });
*/
    selectLogInUserNameAndEmail: function(User, username, email){
        return  User.findOne({
            where: { 
                [Op.or]: [
                    { USERNAME: username },
                    { USER_MAIL: email }
                ],
            }
        })
    },

    selectLogInUserNameAndPassword: function(User, username, password){
        var cryptPassword = crypto.createHash('sha256').update(password).digest('hex');
        return  User.findOne({
            where: { 
                [Op.and]: [
                    { USERNAME: username },
                    { USER_PASS: cryptPassword }
                ],
            }
        })
    },

    selectSignUpData: function(User, username, email){
        return User.findOne({
            where: { 
                [Op.or]: [
                { USERNAME: username },
                { USER_MAIL: email }
                //{ USER_TEL: telephone}
            ]
        }})
        .catch(error => {
            console.error('Erreur lors de la recherche de l\'utilisateur par ces données :', error);
            throw new Error('Erreur lors de la recherche de l\'utilisateur par ces données');
        });
    },
    
    insert: function(User, username, nameuser, firstname, usermail, userpass){
        var cryptPassword = crypto.createHash('sha256').update(userpass).digest('hex');
        return User.create({
            USERNAME : username,
            FIRSTNAME : nameuser,
            LASTNAME : firstname,
            USER_MAIL : usermail,
            USER_PASS : cryptPassword,
            //USER_TEL : usertel,
            //USER_DATE_NAISS : userdate
        })
        .catch(error => {
            console.error('Erreur lors de l\'insertion de l\'utilisateur :', error);
            throw new Error('Erreur lors de l\'insertion de l\'utilisateur');
        });
    }
};
