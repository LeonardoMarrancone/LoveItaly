define(function(require) {

    var $ = require('jquery');
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");

    var ManufacturerModel = require("models/ManufacturerModel");
    var MyManufacturer = Utils.Page.extend({

        constructorName: "MyManufacturer",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.manufacturer;
            this.manufacturer_id = options.id;
            this.model = new ManufacturerModel({
                id: this.manufacturer_id
            });

            this.model.on('change:address', () => {
                this.renderAddress();
            })
        },

        id: "manufacturer",

        render: function() {

            let page = this;
            
            this.model.fetch({
                success: function(model, response, options) {
                    let manufacturer = model.toJSON();
                    let manufacturer_html = page.template(manufacturer);
                    manufacturer_html = Handlebars.compile(manufacturer_html)();
                    $('#content').html(manufacturer_html);
                    $('#content .manufacturer-description *').removeAttr('style');
                    $('#content .manufacturer-description table').removeAttr('width');
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

        renderAddress: function() {
            let manufacturer = this.model.toJSON();
            let manufacturer_html = this.template(manufacturer);
            manufacturer_html = Handlebars.compile(manufacturer_html)();
            $('address').html($(manufacturer_html).find('address').html());
        }


    });

    return MyManufacturer;

});