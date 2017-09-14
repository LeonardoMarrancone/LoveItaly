define(function(require) {

    var Backbone = require("backbone");

    var CategoryModel = Backbone.Model.extend({

        constructorName: "CategoryModel",
        
    });

    return CategoryModel;
});