define(function(require) {

    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");

    var ProductModel = require("models/ProductModel");
    var MyProduct = Utils.Page.extend({

        constructorName: "MyProduct",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.product;
            this.id = options.id;
        },

        id: "product",
        className: "i-g page",
        model: ProductModel,

        render: function() {
            var prodModel = new ProductModel({
                id: this.id
            });
            page = this;
            prodModel.fetch({
                success: function(model, response, options) {
                    let prodotto = model.toJSON();

                    let product_html = page.template(prodotto);
                    product_html = Handlebars.compile(product_html)();
                    $('#content').html(product_html);
                    
                    return page;
                },
                error: function(collection, response, options) {
                    console.log('Errore chiamata ajax!' +
                        '\nReponseText: ' + XMLHttpRequest.responseText +
                        '\nStatus: ' + textStatus +
                        '\nError: ' + errorThrown);
                }
            });
        },



    });

    return MyProduct;

});