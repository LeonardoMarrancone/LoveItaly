define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  var StructureView = require("views/StructureView");
  var MyHome = require("views/pages/MyHome");
  var MyProduct = require("views/pages/MyProduct");
  var MyManufacturer = require("views/pages/MyManufacturer");
  var MyManufacturerProducts = require("views/pages/MyManufacturerProducts");
  var MyRegistration = require("views/pages/MyRegistration");
  var MyLogin = require("views/pages/MyLogin");
  var MyProfile = require("views/pages/MyProfile");
  var MyOrders = require("views/pages/MyOrders");
  var MyOrder = require("views/pages/MyOrder");
  var MyCart = require("views/pages/MyCart");
  var MyCartCarriers = require("views/pages/MyCartCarriers");
  var MyCartPayments = require("views/pages/MyCartPayments");
  var MySearch = require("views/pages/MySearch");
  var MyWishlist = require("views/pages/MyWishlist");
  var MyInfo = require("views/pages/MyInfo");
  var MyAbout = require("views/pages/MyAbout");
  var MyContacts = require("views/pages/MyContacts");
  var MyFaq = require("views/pages/MyFaq");

  var AppRouter = Backbone.Router.extend({

    constructorName: "AppRouter",

    routes: {
      // the default is the structure view
      "": "showStructure",
      "home": "home",
      "product/:id": "product",
      "manufacturer/:id": "manufacturer",
      "manufacturer-products/:id": "manufacturer_products",
      "registration": "registration",
      "login": "login",
      "profile": "profile",
      "orders": "orders",
      "order/:id": "order",
      "cart": "cart",
      "cart-carriers": "cart_carriers",
      "cart-payments": "cart_payments",
      "search/:product_name": "search",
      "search/:product_name/:id_category": "search",
      "wishlist": "wishlist",
      "info": "info",
      "about": "about",
      "contacts": "contacts",
      "faq": "faq",
    },

    firstView: "home",

    initialize: function(options) {
      this.currentView = undefined;
    },

    product: function(id) {
      var page = new MyProduct({
          id: id
      });
      this.changePage(page);
    },

    manufacturer: function(id) {
      var page = new MyManufacturer({
          id: id
      });
      this.changePage(page);
    },

    manufacturer_products: function(id) {
      var page = new MyManufacturerProducts({
          id: id
      });
      this.changePage(page);
    },

    registration: function(){
      // create the view
      var page = new MyRegistration();
      // show the view
      this.changePage(page);
    },

    login: function(){
      // create the view
      var page = new MyLogin();
      // show the view
      this.changePage(page);
    },

    profile: function(){
      // create the view
      var page = new MyProfile();
      // show the view
      this.changePage(page);
    },

    orders: function(){
      // create the view
      var page = new MyOrders();
      // show the view
      this.changePage(page);
    },

    order: function(id){
      // create the view
      var page = new MyOrder({
        id: id
      });
      // show the view
      this.changePage(page);
    },

    cart: function(){
      // create the view
      var page = new MyCart();
      // show the view
      this.changePage(page);
    },

    cart_carriers: function(){
      // create the view
      var page = new MyCartCarriers();
      // show the view
      this.changePage(page);
    },

    cart_payments: function(){
      // create the view
      var page = new MyCartPayments();
      // show the view
      this.changePage(page);
    },

    search: function(product_name, id_category){
      // create the view
      var page = new MySearch({
        product_name: product_name,
        id_category: id_category,
      });
      // show the view
      this.changePage(page);
    },

    wishlist: function(){
      // create the view
      var page = new MyWishlist();
      // show the view
      this.changePage(page);
    },

    home: function() {
      // create the view
      var page = new MyHome();
      // show the view
      this.changePage(page);
    },

    info: function() {
      // create the view
      var page = new MyInfo();
      // show the view
      this.changePage(page);
    },

    about: function(){
      // create the view
      var page = new MyAbout();
      // show the view
      this.changePage(page);
    },

    contacts: function(){
      // create the view
      var page = new MyContacts();
      // show the view
      this.changePage(page);
    },

    faq: function(){
      // create the view
      var page = new MyFaq();
      // show the view
      this.changePage(page);
    },

    // load the structure view
    showStructure: function() {
      if (!this.structureView) {
        this.structureView = new StructureView();
        // put the el element of the structure view into the DOM
        document.body.appendChild(this.structureView.render().el);
        this.structureView.trigger("inTheDOM");
      }
      // go to first view
      this.navigate(this.firstView, {trigger: true});
    },

  });

  return AppRouter;

});