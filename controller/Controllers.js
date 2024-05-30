const userController = require("./userController.js");
const loginController = require("./loginController.js");
const addProductController = require("./addProductController.js");
const addOrderController = require("./addOrderController.js");
const productController = require("./productController.js");
const InventoryController = require("./inventoryController.js")
const ordersController = require("./ordersController.js")
const HomePageController =require("./HomePageController.js");
const SearchBarController =require("./searchbarController.js");

module.exports = {
  userController,
  addProductController,
  loginController,
  addOrderController,
  productController,
  InventoryController,
  ordersController,
  HomePageController,
  SearchBarController,
};
