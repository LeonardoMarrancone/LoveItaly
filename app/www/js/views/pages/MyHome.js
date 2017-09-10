define(function(require) {

    var $ = require("jquery");
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");

    var ProductsModel = require("models/ProductsModel");
    var ProductsCollection = require("collections/ProductsCollection");
    var RandomProductsModel = require("models/RandomProductsModel");
    var RandomProductsCollection = require("collections/RandomProductsCollection");

    var MyHome = Utils.Page.extend({

        constructorName: "MyHome",

        initialize: function(options) {
            // load the precompiled template
            this.home_template = Utils.templates.home;
            this.products_home_template = Utils.templates.products_home;

        },

        id: "Myhome",
        className: "",
        model: ProductsModel,
        collection: ProductsCollection,

        render: function() {
            var MyHomeCollection = new ProductsCollection();

            $('#content').html($(this.el).html(this.home_template()));

            var page = this;
            MyHomeCollection.fetch({
                success: function(collection, response, options) {
                    let prodotti = collection.toJSON();

                    let products_html = page.products_home_template( [prodotti.slice(0, 7), prodotti.slice(7)] );
                    products_html = Handlebars.compile(products_html)();
                    $('#new-products').html(products_html);

                    return page;
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Errore chiamata ajax!' +
                        '\nReponseText: ' + XMLHttpRequest.responseText +
                        '\nStatus: ' + textStatus +
                        '\nError: ' + errorThrown);
                }
            });

            $.ajax({
                url: 'http://loveitaly.altervista.org/api/categories/?display=[id]&io_format=JSON&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',
                async: true,
                type: "GET",
                dataType: 'json',
                success: function(data) {
                    let id_categories = data.categories.map(function(item, index) {
                        return item.id;
                    })

                    var MyRandomHomeCollection = new RandomProductsCollection(id_categories);

                    MyRandomHomeCollection.fetch({
                        success: function(collection, response, options) {
                            let prodotti = collection.toJSON();

                            let products_html = page.products_home_template( [prodotti.slice(0, 7), prodotti.slice(7, 14), prodotti.slice(14)] );
                            products_html = Handlebars.compile(products_html)();
                            $('#showcase-products').html(products_html);

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
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Errore chiamata ajax!' +
                        '\nReponseText: ' + XMLHttpRequest.responseText +
                        '\nStatus: ' + textStatus +
                        '\nError: ' + errorThrown);
                }
            })

                    

        },



    });

    return MyHome;

});