define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");

  var StructureView = Backbone.View.extend({

    constructorName: "StructureView",

    id: "main",

    initialize: function(options) {
      // load the precompiled template
      this.template = Utils.templates.structure;
      this.on("inTheDOM", () => {
        $("#back").on("tap", this.goBack);
        $("#back").on("back", this.goBack);
      });
      // bind the back event to the goBack function
      
    },

    render: function() {
      // load the template
      this.el.innerHTML = this.template({});
      // cache a reference to the content element
      this.contentElement = this.$el.find('#content')[0];

      return this;
    },

    // rendered: function(e) {
    // },

    // generic go-back function
    goBack: function() {
      window.history.back();
    },

    // product: function(event) {
    //   Backbone.history.navigate("product/4", {
    //     trigger: true
    //   });
    // },

  });

  return StructureView;

});