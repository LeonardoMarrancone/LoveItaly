define(function(require) {

    var $ = require("jquery");
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");

    var ProductsModel = require("models/ProductsModel");
    var ManufacturerProductsCollection = require("collections/ManufacturerProductsCollection");

    var MyManufacturerProducts = Utils.Page.extend({

        constructorName: "MyManufacturerProductsCollection",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.manufacturer_products;
            this.id_manufacturer = options.id
        },

        id: "MyManufacturerProductsCollection",
        className: "",
        model: ProductsModel,
        collection: ManufacturerProductsCollection,

        render: function() {
            var MyCollection = new ManufacturerProductsCollection({
                id: this.id_manufacturer
            });

            var page = this;
            MyCollection.fetch({
                success: function(collection, response, options) {
                    let products = collection.toJSON();

                    let products_html = page.template(products);
                    products_html = Handlebars.compile(products_html)();
                    $('#content').html(products_html);
                    $('.manufacturer-name').html(products[0].manufacturer_name)
                    $('.main-content').scrollTop(0, 0);
                    return page;
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Errore chiamata ajax!' +
                        '\nReponseText: ' + XMLHttpRequest.responseText +
                        '\nStatus: ' + textStatus +
                        '\nError: ' + errorThrown);
                }
            });     

        },
    });

    return MyManufacturerProducts;

});