const sequelize = require('../config/db.js');
const DataTypes = require('sequelize');
const User = require('../model/tables/users.js')(sequelize,DataTypes);
// const Vente = require('./model').VENTE;
// const Employe = require('./model').EMPLOYE;
// const Facture = require('./model').FACTURE;


module.exports = {
  //----------------------utilisateur----------------------------
  // app.post : /users
  create: async (req, res) => {
    try {
      const { USER_ID, USERNAME, USER_MAIL, USER_TEL, USER_DATE_NAISS } = req.body;
      const newUser = await User.create({ USER_ID, USERNAME, USER_MAIL, USER_TEL, USER_DATE_NAISS });
      res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  //app.get : /users/:id
  getById: async (req, res) => {
    const id = req.params.id;
    try {
      const user = await User.findByPk(id);
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ message: "Utilisateur non trouvé" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  //app.patch : /users/:id
  updateById: async (req, res) => {
    const id = req.params.id;
    try {
      const [updatedRows] = await User.update(req.body, { where: { USER_ID: id } });
      if (updatedRows > 0) {
        res.status(200).json({ message: "Utilisateur mis à jour avec succès" });
      } else {
        res.status(404).json({ message: "Utilisateur non trouvé" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  //app.delete : /users/:id
  deleteById: async (req, res) => {
    const id = req.params.id;
    try {
      const deletedRows = await User.destroy({ where: { USER_ID: id } });
      if (deletedRows > 0) {
        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
      } else {
        res.status(404).json({ message: "Utilisateur non trouvé" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  //----------------Client-------------------------------
  // Créer un nouveau client
  createClient : async (req, res) => {
    try {
        const clientData = req.body;
        const newClient = await Client.create(clientData);
        res.status(201).json(newClient);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du client: ' + error.message });
    }
  },
  // Récupérer un client par son ID
  getClientById : async (req, res) => {
    try {
        const clientId = req.params.id;
        const client = await Client.findByPk(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du client: ' + error.message });
    }
  },
  // Mettre à jour un client par son ID
  updateClientById : async (req, res) => {
    try {
        const clientId = req.params.id;
        const newData = req.body;
        const client = await Client.findByPk(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }
        await client.update(newData);
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du client: ' + error.message });
    }
  },
  // Supprimer un client par son ID
  deleteClientById : async (req, res) => {
    try {
        const clientId = req.params.id;
        const client = await Client.findByPk(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }
        await client.destroy();
        res.json({ message: 'Client supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du client: ' + error.message });
    }
  },


//------------------------------- Employe -------------------------------
  // CREATE
  createEmploye : async (req, res) => {
    try {
        const employeData = req.body;
        const newEmploye = await Employe.create(employeData);
        res.status(201).json(newEmploye);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'employé: ' + error.message });
    }
  },
  // GET
  getEmployeById : async (req, res) => {
    try {
        const employeId = req.params.id;
        const employe = await Employe.findByPk(employeId);
        if (!employe) {
            return res.status(404).json({ message: 'Employee Non Trouvé' });
        }
        res.json(employe);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'employé: ' + error.message });
    }
  },


  // UPDATE
  updateEmployeById : async (req, res) => {
    try {
        const employeId = req.params.id;
        const newData = req.body;
        const employe = await Employe.findByPk(employeId);
        if (!employe) {
            return res.status(404).json({ message: 'Employé Non Trouvé' });
        }
        await employe.update(newData);
        res.json(employe);
    } catch (error) {employe
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\employé: ' + error.message });
    }
  },
  // DELETE
  deleteEmployeById : async (req, res) => {
    try {
        const employeId = req.params.id;
        const employe = await Employe.findByPk(employeId);
        if (!employe) {
            return res.status(404).json({ message: 'Employé Non Trouvé' });
        }
        await employe.destroy();
        res.json({ message: 'Employé Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'employé : ' + error.message });
    }
  },


//------------------------------- Vente -------------------------------

// CREATE
 createVente : async (req, res) => {
    try {
        const venteData = req.body;
        const newVente = await Vente.create(venteData);
        res.status(201).json(newVente);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la vente: ' + error.message });
    }
},

// GET
getVenteById : async (req, res) => {
    try {
        const venteId = req.params.id;
        const vente = await Vente.findByPk(venteId);
        if (!vente) {
            return res.status(404).json({ message: 'Vente non trouvée' });
        }
        res.json(vente);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la vente: ' + error.message });
    }
},

// UPDATE
 updateVenteById : async (req, res) => {
    try {
        const venteId = req.params.id;
        const newData = req.body;
        const vente = await Vente.findByPk(venteId);
        if (!vente) {
            return res.status(404).json({ message: 'Vente non trouvée' });
        }
        await vente.update(newData);
        res.json(vente);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la vente: ' + error.message });
    }
},

// DELETE
 deleteVenteById : async (req, res) => {
    try {
        const venteId = req.params.id;
        const vente = await Vente.findByPk(venteId);
        if (!vente) {
            return res.status(404).json({ message: 'Vente non trouvée' });
        }
        await vente.destroy();
        res.json({ message: 'Vente supprimée' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la vente: ' + error.message });
    }
},


//------------------------------- Facture -------------------------------


// CREATE
 createFacture : async (req, res) => {
    try {
        const factureData = req.body;
        const newFacture = await Facture.create(factureData);
        res.status(201).json(newFacture);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la facture: ' + error.message });
    }
},

// GET
 getFactureById : async (req, res) => {
    try {
        const factureId = req.params.id;
        const facture = await Facture.findByPk(factureId);
        if (!facture) {
            return res.status(404).json({ message: 'Facture non trouvée' });
        }
        res.json(facture);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la facture: ' + error.message });
    }
},

// UPDATE
 updateFactureById : async (req, res) => {
    try {
        const factureId = req.params.id;
        const newData = req.body;
        const facture = await Facture.findByPk(factureId);
        if (!facture) {
            return res.status(404).json({ message: 'Facture non trouvée' });
        }
        await facture.update(newData);
        res.json(facture);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la facture: ' + error.message });
    }
},

// DELETE
 deleteFactureById : async (req, res) => {
    try {
        const factureId = req.params.id;
        const facture = await Facture.findByPk(factureId);
        if (!facture) {
            return res.status(404).json({ message: 'Facture non trouvée' });
        }
        await facture.destroy();
        res.json({ message: 'Facture supprimée' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la facture: ' + error.message });
    }
},

  //---------------------- Produit ------------------------------
  // Créer un nouveau produit
  createProduct: async (req, res) => {
    try {
      const productData = req.body;
      const newProduct = await Produit.create(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création du produit : ' + error.message });
    }
  },

  // Récupérer tous les produits
  getAllProducts: async (req, res) => {
    try {
      const produits = await Produit.findAll();
      res.json(produits);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des produits : ' + error.message });
    }
  },

  // Récupérer un produit par son ID
  getProductById: async (req, res) => {
    try {
      const productId = req.params.id;
      const produit = await Produit.findByPk(productId);
      if (!produit) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }
      res.json(produit);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du produit : ' + error.message });
    }
  },

  // Mettre à jour un produit par son ID
  updateProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const newData = req.body;
      const produit = await Produit.findByPk(productId);
      if (!produit) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }
      await produit.update(newData);
      res.json(produit);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour du produit : ' + error.message });
    }
  },

  // Supprimer un produit par son ID
  deleteProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const produit = await Produit.findByPk(productId);
      if (!produit) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }
      await produit.destroy();
      res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression du produit : ' + error.message });
    }
  }
};

