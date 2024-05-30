const express = require("express");
const multer = require("multer");
const router = express.Router();
const controllers = require("../controller/Controllers");
const auth = require("../utils/middleware").auth;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/login", controllers.loginController.login);
router.post("/register", controllers.loginController.signup);
router.get("/homePage", auth, controllers.loginController.home);
router.get("/homePage/getUser", auth, controllers.loginController.getUser);

/* ------ SI ON A LE TEMPS D'INCLURE OTP ---- 

router.post('/login', controllers.authController.login);
router.post('/register',authController.signup);
router.post('/otp',authController.verifOTP);
router.get('/homePage', controllers.authController.home);
 ---------- */

//Searchbar
router.get("/Search", auth, controllers.SearchBarController.findAlikeObject);

//=========================PAGE====================================

//HOME PAGE
router.get(
  "/homePage/totalProducts",
  auth,
  controllers.HomePageController.getTotalProductsCount
);
router.get(
  "/homePage/totalOrders",
  auth,
  controllers.HomePageController.getTotalOrders
);
router.get(
  "/homePage/totalfournisseur",
  auth,
  controllers.HomePageController.getNumberSupplier
);
router.get(
  "/homePage/seuilProducts",
  auth,
  controllers.HomePageController.getReplenishmentLevel
);

router.get(
  "/homePage/totalPrice",
  auth,
  controllers.HomePageController.getTotalOrdersPrice
);

router.get(
  "/homePage/stockAlert",
  auth,
  controllers.HomePageController.calculateStockAlert
);
router.get(
  "/homePage/lowStocksProducts",
  auth,
  controllers.HomePageController.getLowStockProducts
);

router.get(
  "/homePage/salesAndPurchasesPeriod",
  auth,
  controllers.HomePageController.getSalesAndPurchasesByPeriod
);

router.get(
  "/homePage/topSellingStock",
  auth,
  controllers.HomePageController.getTopStockPagination
);

//PRODUIT
router.get("/Products", auth, controllers.productController.getProductById);
router.post(
  "/Products",
  auth,
  /*upload.single('image'),*/ controllers.addProductController.addProduit
);

router.get(
  "/Product/Overview/imageProduit",
  auth,
  controllers.productController.getImage
);
router.get(
  "/Product/Overview",
  auth,
  controllers.productController.overviewProduct
);
router.get(
  "/Product/Overview/supplierDetails",
  auth,
  controllers.productController.getSupplierDetails
);
router.get(
  "/Product/Overview/stockLocations",
  auth,
  controllers.productController.getStockLocations
);

router.get(
  "/Product/Movement",
  auth,
  controllers.productController.productMovement
);
router.get(
  "/Product/Movement/getQuantityDetails",
  controllers.productController.getQuantityDetails
);
router.get(
  "/Product/Finance",
  auth,
  controllers.productController.productFinance
);
router.get(
  "/Product/QuantityHistory",
  auth,
  controllers.productController.productQuantityHistory
);

//INVENTORY
router.get(
  "/Inventory/TotalProductsCount",
  auth,
  controllers.InventoryController.getTotalProductsCount
);
router.get(
  "/Inventory/TotalCategories",
  auth,
  controllers.InventoryController.getTotalCategories
);
router.get(
  "/Inventory/topSelling",
  auth,
  controllers.InventoryController.getTopSellingProduct
);
router.get(
  "/Inventory/LowStockProductsCount",
  auth,
  controllers.InventoryController.getLowStockProductsCount
);
//router.get("/Inventory/TopSellingProduct",auth,controllers.InventoryController.getTopSellingProduct2);

router.get(
  "/Inventory/fetchPagination",
  auth,
  controllers.productController.getProductPagination
);

//ORDERS
// router.get("/Order", auth, controllers.ordersController.showOrders);
router.get("/Order", auth, controllers.ordersController.getOrderById);
router.post("/Order/newOrder", auth, controllers.addOrderController.addOrder);

router.get(
  "/Order/TotalOrdersCount",
  auth,
  controllers.ordersController.getTotalOrdersCount
);
router.get(
  "/Order/TotalOrdersreceived",
  auth,
  controllers.ordersController.getTotalOrdersReceived
);
router.get(
  "/Order/TotalOrdersreturned",
  auth,
  controllers.ordersController.getReturnOrdersCount
);
router.get(
  "/Order/TotalOrdersInTransitClient",
  auth,
  controllers.ordersController.getOrdersInTransitClient
);
router.get(
  "/Order/TotalOrdersInTransitFournisseur",
  auth,
  controllers.ordersController.getOrdersInTransitFournisseur
);

router.get(
  "/Order/orderPagination",
  auth,
  controllers.ordersController.getOrderPagination
);

router.get(
  "/Order/OrderByDate",
  auth,
  controllers.ordersController.getOrderByDate
);
router.get(
  "/Order/OrderByPrice",
  auth,
  controllers.ordersController.getOrdersWithTotalPriceLessThan
);
router.get(
  "/Order/OrderInDelevery",
  auth,
  controllers.ordersController.getOrdersInDelivery
);

router.get("/Track", controllers.productController.addOrSustractProduit);

/*=============================CRUD===================================

// CRUD utilisateur:
router.post('/create', controllers.userController.create);
router.get('/:id', controllers.userController.getById);
router.put('/:id', controllers.userController.updateById);
router.delete('/:id', controllers.userController.deleteById);

// CRUD produit:
router.get('/products', controllers.userController.getAllProducts);
router.get('/products/:id', controllers.userController.getProductById);
router.post('/products', controllers.userController.createProduct);
router.put('/products/:id', controllers.userController.updateProduct);
router.delete('/products/:id', controllers.userController.deleteProduct);

//CRUD client:
router.post('/clients', controllers.userController.createClient);
router.get('/clients/:id', controllers.userController.getClientById);
router.put('/clients/:id', controllers.userController.updateClientById);
router.delete('/clients/:id', controllers.userController.deleteClientById);
*/

// // CRUD Employé :
// router.post('/employes', userController.createEmploye);
// router.get('/employes/:id', userController.getEmployeById);
// router.put('/employes/:id', userController.updateEmployeById);
// router.delete('/employes/:id', userController.deleteEmployeById);

// // CRUD Vente :
// router.post('/ventes', userController.createVente);
// router.get('/ventes/:id', userController.getVenteById);
// router.put('/ventes/:id', userController.updateVenteById);
// router.delete('/ventes/:id', userController.deleteVenteById);

// // CRUD Facture :
// router.post('/factures', userController.createVente);
// router.get('/factures/:id', userController.getVenteById);
// router.put('/factures/:id', userController.updateVenteById);
// router.delete('/factures/:id', userController.deleteVenteById);

module.exports = router;