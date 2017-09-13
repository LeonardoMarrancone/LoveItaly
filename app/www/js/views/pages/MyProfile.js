define(function(require) {

    var $ = require('jquery');
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");
    var UserModel = require("models/UserModel");

    var MyProfile = Utils.Page.extend({

        constructorName: "MyProfile",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.profile;

        },

        id: "profile",

        render: function() {

            let page = this;

            if (localStorage.getItem('logged') == "true") {
                let user = new UserModel({
                    email: localStorage.getItem('email')
                })
                user.fetch({
                    success: function(model){
                        let user_model = model.toJSON();
                        let profile_html = page.template(user_model);
                        profile_html = Handlebars.compile(profile_html)();
                        $('#content').html(profile_html);
                        $('.main-content').scrollTop(0, 0);
                        if (user_model.address_delivery.id) {
                            $('.city-delivery').val(user_model.address_delivery.city)
                        }
                        if (user_model.address_invoice.id) {
                            $('.city-invoice').val(user_model.address_invoice.city)
                        }
                        $('#profile-form').on('submit', page.updateProfile)

                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('Errore chiamata ajax!' +
                            '\nReponseText: ' + jqXHR.responseText +
                            '\nStatus: ' + textStatus +
                            '\nError: ' + errorThrown);
                    }
                })
                        
            }
            else {
                navigator.notification.alert(
                    'Per modificare il profilo devi aver effettuato login.',  // message
                    function(){
                        Backbone.history.navigate('login', {trigger: true})
                    },         // callback
                    'Errore',            // title
                    'OK'                  // buttonName
                );
                
            }
        },

        updateProfile: function(e){
            e.preventDefault();

            let email = $(".email").val().trim();
            let firstname = $(".firstname").val().trim();
            let lastname = $(".lastname").val().trim();
            let city_delivery = $(".city-delivery").val().trim();
            let address_delivery = $(".address-delivery").val().trim();
            let city_invoice = $(".city-invoice").val().trim();
            let address_invoice = $(".address-invoice").val().trim();

            if(!email || !firstname || !lastname || !city_delivery || !address_delivery || !city_invoice || !address_invoice) {
                navigator.notification.alert(
                    'Tutti i campi sono obbligatori. Rincontrollare i campi.',  // message
                    null,         // callback
                    'Impossibile aggiornare il profilo',            // title
                    'OK'                  // buttonName
                );
                return false;
            }

            let user = new UserModel({
                email: localStorage.getItem('email')
            })
            user.fetch({
                success: function(model){

                    user.updateProfile(model.toJSON(), {
                        email: email,
                        firstname: firstname,
                        lastname: lastname
                    }, {
                        address: address_delivery,
                        city: city_delivery
                    }, {
                        address: address_invoice,
                        city: city_invoice
                    }, function(){
                        
                        navigator.notification.alert(
                            '',  // message
                            function(){},         // callback
                            'Profilo aggiornato con successo',            // title
                            'OK'                  // buttonName
                        );

                    }, function(jqXHR, textStatus, errorThrown) {
                        console.log('Errore chiamata ajax!' +
                            '\nReponseText: ' + jqXHR.responseText +
                            '\nStatus: ' + textStatus +
                            '\nError: ' + errorThrown);
                    })

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('Errore chiamata ajax!' +
                        '\nReponseText: ' + jqXHR.responseText +
                        '\nStatus: ' + textStatus +
                        '\nError: ' + errorThrown);
                }
            })

                    
            return false;
        }
    });

    return MyProfile;

});