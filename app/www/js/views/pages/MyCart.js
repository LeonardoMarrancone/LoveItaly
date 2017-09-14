define(function(require) {

    var $ = require('jquery');
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");
    var CartModel = require("models/CartModel");

    var MyCart = Utils.Page.extend({

        constructorName: "MyCart",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.cart;

            if (localStorage.getItem('logged') == "true") {
                this.user_id = localStorage.getItem('user_id');
                this.model = new CartModel({
                    user_id: this.user_id
                });
            }
                
        },

        id: "cart",

        render: function() {

            let page = this;

            if (localStorage.getItem('logged') == "true") {

                this.model.fetch({
                    success: function(model, response, options) {

                        let cart = model.toJSON();
                        
                        if (cart.associations && cart.associations.cart_rows && cart.associations.cart_rows.length > 0) {

                            let cart_html = page.template(cart);
                            cart_html = Handlebars.compile(cart_html)();
                            $('#content').html(cart_html);
                            
                            $('.total-price').html(cart.total_price);

                            $('.empty-cart').css('display', 'none');
                            $('.footer-cart').css('display', 'block');

                            $('.quantity').on('change', function(){

                                let product_id = $(this).attr('data-product-id');
                                let quantity = parseInt($(this).val());

                                page.model.updateCart({
                                        id: product_id
                                    }, quantity, model, true, function(){
                                        page.render();
                                    }, function(jqXHR, textStatus, errorThrown) {
                                        console.log('Errore chiamata ajax!' +
                                            '\nReponseText: ' + jqXHR.responseText +
                                            '\nStatus: ' + textStatus +
                                            '\nError: ' + errorThrown);
                                    })
                            })

                            $('.button-delete-from-cart').on('tap', function(){
                                
                                let product_id = $(this).attr('data-product-id');
                                let quantity = 0;

                                navigator.notification.confirm(
                                    '',  // message
                                    function(buttonIndex){

                                        if (buttonIndex > 1) return;

                                        page.model.updateCart({
                                                id: product_id
                                            }, quantity, model, true, function(data){
                                                page.render();
                                            }, function(jqXHR, textStatus, errorThrown) {
                                                console.log('Errore chiamata ajax!' +
                                                    '\nReponseText: ' + jqXHR.responseText +
                                                    '\nStatus: ' + textStatus +
                                                    '\nError: ' + errorThrown);
                                            })
                                    },         // callback
                                    'Sicuro di voler cancellare questo prodotto?',            // title
                                    ['Si','Annulla']                  // buttonName
                                );

                                        
                            })
                        }
                        else {
                            let cart_html = page.template(cart);
                            cart_html = Handlebars.compile(cart_html)();
                            $('#content').html(cart_html);
                            $('.footer-cart').css('display', 'none');
                            $('.empty-cart').css('display', 'block');
                        }

                            
                        $('.main-content').scrollTop(0, 0);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {

                        console.log('Errore chiamata ajax!' +
                            '\nReponseText: ' + XMLHttpRequest.responseText +
                            '\nStatus: ' + textStatus +
                            '\nError: ' + errorThrown);
                    }
                })
                        
            }
            else {
                navigator.notification.alert(
                    'Per usare il carrello devi aver effettuato login.',  // message
                    function(){
                        Backbone.history.navigate('login', {trigger: true})
                    },         // callback
                    'Errore',            // title
                    'OK'                  // buttonName
                );
                
            }
                

        },

        cart: function(e){
            e.preventDefault();

            let email = $(".email").val().trim();
            let passwd = $(".password").val().trim();
            let repeat_passwd = $(".repeat-password").val().trim();
            let firstname = $(".firstname").val().trim();
            let lastname = $(".surname").val().trim();

            if(!email || !passwd || !repeat_passwd || !firstname || !lastname || (passwd != repeat_passwd)) {
                navigator.notification.alert(
                    'Tutti i campi sono obbligatori. Rincontrollare i campi.',  // message
                    null,         // callback
                    'Impossibile registrarsi',            // title
                    'OK'                  // buttonName
                );
                return false;
            }

            $.ajax({
                url: 'http://192.168.56.101/loveitaly/api/customers/?io_format=JSON&schema=blank&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',
                async: true,
                type: 'GET',
                dataType: 'json',
                success: function(data, textStatus, jqXHR) {
                    
                    let xml = $(jqXHR.responseText.replace('<?xml version="1.0" encoding="UTF-8"?>', ''));
                    xml.find('email').html(email);
                    xml.find('passwd').html(passwd);
                    xml.find('firstname').html(firstname);
                    xml.find('lastname').html(lastname);
                    var contact = '<?xml version="1.0" encoding="UTF-8"?><prestashop xmlns:xlink="http://www.w3.org/1999/xlink">' + xml.html() + '</prestashop>';
                    
                    $.ajax({
                        url: 'http://192.168.56.101/loveitaly/api/customers/',
                        async: true,
                        type: "POST",
                        dataType: 'xml',
                        contentType: "text/xml",
                        headers: {
                            "Authorization": 'Basic SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'
                        },
                        data: contact,
                        success: function(result, textStatus, jqXHR) {
                            localStorage.setItem('email', email)
                            localStorage.setItem('logged', false)
                            navigator.notification.alert(
                                'Verrai mandato automaticamente nella sezione di login.',  // message
                                function(){
                                    Backbone.history.navigate("login", {
                                        trigger: true
                                    });
                                },         // callback
                                'Registrazione avvenuta con successo',            // title
                                'OK'                  // buttonName
                            );
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            navigator.notification.alert(
                                'Controllare se i campi sono corretti.',  // message
                                null,         // callback
                                'Errore durante la registrazione',            // title
                                'OK'                  // buttonName
                            );
                            console.log('Errore chiamata ajax!' +
                                '\nReponseText: ' + jqXHR.responseText +
                                '\nStatus: ' + textStatus +
                                '\nError: ' + errorThrown);
                        }
                    });
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

    return MyCart;

});