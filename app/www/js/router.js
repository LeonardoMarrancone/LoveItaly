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
  var MyCart = require("views/pages/MyCart");

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
      "cart": "cart",
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

    cart: function(){
      // create the view
      var page = new MyCart();
      // show the view
      this.changePage(page);
    },

    home: function() {
      // create the view
      var page = new MyHome();
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