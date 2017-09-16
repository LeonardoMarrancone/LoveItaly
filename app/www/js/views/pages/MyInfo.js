define(function(require) {

    var $ = require('jquery');
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");

    var MyInfo = Utils.Page.extend({

        constructorName: "MyInfo",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.info;

        },

        id: "info",

        render: function() {

            let info_html = this.template();
            info_html = Handlebars.compile(info_html)();
            $('#content').html(info_html);

            $('.main-content').scrollTop(0, 0);

            $('.info-list .item .item-info-title').on('tap', function(e){
                $(this).parent().toggleClass('active');
                if ($(this).parent().hasClass('active')) {
                    $(this).find('.icon').removeClass('ion-android-add');
                    $(this).find('.icon').addClass('ion-android-remove');
                }
                else {
                    $(this).find('.icon').addClass('ion-android-add');
                    $(this).find('.icon').removeClass('ion-android-remove');
                }
            })
        },

    });

    return MyInfo;

});