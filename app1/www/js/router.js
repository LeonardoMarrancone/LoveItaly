define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  var StructureView = require("views/StructureView");
  var MyHome = require("views/pages/MyHome");
  var MyProduct = require("views/pages/MyProduct");

  var AppRouter = Backbone.Router.extend({

    constructorName: "AppRouter",

    routes: {
      // the default is the structure view
      "": "showStructure",
      "home": "home",
      "product/:id": "product",
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