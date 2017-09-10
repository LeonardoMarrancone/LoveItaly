define(function(require) {

    var $ = require('jquery');
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");

    var ProductModel = require("models/ProductModel");
    var MyProduct = Utils.Page.extend({

        constructorName: "MyProduct",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.product;
            this.product_id = options.id;
            this.model = new ProductModel({
                id: this.product_id
            });

            this.model.on('change', () => {
                this.renderFeatures();
            })
        },

        id: "product",

        switchContentTab: function(e){
            $('.single-product .tabs .tab-item').removeClass('active');
            $(e.currentTarget).addClass('active');
            let tabContentId = $(e.currentTarget).attr('data-tab');
            $('.container-content-tabs .tab-content.active').removeClass('active');
            $(tabContentId).addClass('active');
        },

        render: function() {

            let page = this;
            
            this.model.fetch({
                success: function(model, response, options) {
                    let product = model.toJSON();

                    let product_html = page.template(product);
                    product_html = Handlebars.compile(product_html)();
                    $('#content').html(product_html);

                    $('.single-product .tabs .tab-item').on('tap', function(e) {
                        page.switchContentTab(e);
                    })
                    
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

        renderFeatures: function() {
            let product = this.model.toJSON();
            let product_html = this.template(product);
            product_html = Handlebars.compile(product_html)();
            $('#features-tab').html($(product_html).find('#features-tab').html());
        }


    });

    return MyProduct;

});