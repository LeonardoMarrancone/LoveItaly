define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require("backbone");
  var md5 = require("md5");

  var UserModel = Backbone.Model.extend({

      constructorName: "UserModel",

      initialize: function(options) {
          this.email = options.email;
          this.passwd = (options.passwd) ? md5('7j3EQiXxwscCNaOIORd8YqmvkjfEmDVxs4EcihNJNVNyCG4bHA3ThTnk' + options.passwd) : '';
      },

      url: function() {
          let url = 'http://192.168.56.101/loveitaly/api/customers/?display=full&io_format=JSON&filter[email]=[' + this.email + ']' + ( (this.passwd) ? '&filter[passwd]=[' + this.passwd + ']' : '' ) + '&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H';
          return url;
      },

      parse: function(data) {

        if (!(Array.isArray(data))) {
          let user = data.customers[0];
          
          user.address_delivery = {}
          user.address_invoice = {}

          $.ajax({
            url: 'http://192.168.56.101/loveitaly/api/addresses/?display=full&io_format=JSON&filter[id_customer]=['+user.id+']&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',
            async: false,
            type: "GET",
            dataType: 'json',
            success: (data, textStatus, jqXHR) => {
              
              if(!Array.isArray(data)) {
                if (data.addresses[0].alias == 'Indirizzo di Consegna') {
                  user.address_delivery = {
                    id: data.addresses[0].id,
                    address: data.addresses[0].address1,
                    city: data.addresses[0].city
                  }

                  user.address_invoice = {
                    id: data.addresses[1].id,
                    address: data.addresses[1].address1,
                    city: data.addresses[1].city
                  }
                }
                else {
                  user.address_delivery = {
                    id: data.addresses[1].id,
                    address: data.addresses[1].address1,
                    city: data.addresses[1].city
                  }

                  user.address_invoice = {
                    id: data.addresses[0].id,
                    address: data.addresses[0].address1,
                    city: data.addresses[0].city
                  }
                }
              }
              
            },
            error: function(jqXHR, textStatus, errorThrown){
              console.log('Errore chiamata ajax!' +
                '\nReponseText: ' + jqXHR.responseText +
                '\nStatus: ' + textStatus +
                '\nError: ' + errorThrown);
            },
          })

          return user;
        }
        
        return null;

      },

      sync: function(method, collection, options) {
          options = options || {};
          return Backbone.Model.prototype.sync.apply(this, arguments);
      },

      updateAddresses: function(user, address_delivery, address_invoice, successCallback, errorCallback) {

        let address_delivery_saved = false;
        let address_invoice_saved = false;

        $.ajax({
          url: 'http://192.168.56.101/loveitaly/api/addresses/',
          async: false,
          type: (user.address_delivery.id) ? "PUT" : "POST",
          dataType: 'xml',
          contentType: "text/xml",
          headers: {
              "Authorization": 'Basic SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'
          },
          data: '<?xml version="1.0" encoding="UTF-8"?>'
                +'<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">'
                    +'<address>'
                        + ((user.address_delivery.id) ? '<id>'+user.address_delivery.id+'</id>' : '')
                        +'<id_country>10</id_country>'
                        +'<id_customer>'+user.id+'</id_customer>'
                        +'<lastname>'+user.lastname+'</lastname>'
                        +'<firstname>'+user.firstname+'</firstname>'
                        +'<alias>Indirizzo di Consegna</alias>'
                        +'<address1>'+address_delivery.address+'</address1>'
                        +'<city>'+address_delivery.city+'</city>'
                    +'</address>'
                +'</prestashop>',
          success: (data, textStatus, jqXHR) => {
            
            address_delivery_saved = true;
            
          },
          error: function(jqXHR, textStatus, errorThrown){
            console.log('Errore chiamata ajax!' +
              '\nReponseText: ' + jqXHR.responseText +
              '\nStatus: ' + textStatus +
              '\nError: ' + errorThrown);
          },
        })

        $.ajax({
          url: 'http://192.168.56.101/loveitaly/api/addresses/',
          async: false,
          type: (user.address_invoice.id) ? "PUT" : "POST",
          dataType: 'xml',
          contentType: "text/xml",
          headers: {
              "Authorization": 'Basic SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'
          },
          data: '<?xml version="1.0" encoding="UTF-8"?>'
                +'<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">'
                    +'<address>'
                        + ((user.address_invoice.id) ? '<id>'+user.address_invoice.id+'</id>' : '')
                        +'<id_country>10</id_country>'
                        +'<id_customer>'+user.id+'</id_customer>'
                        +'<lastname>'+user.lastname+'</lastname>'
                        +'<firstname>'+user.firstname+'</firstname>'
                        +'<alias>Indirizzo di Fatturazione</alias>'
                        +'<address1>'+address_invoice.address+'</address1>'
                        +'<city>'+address_invoice.city+'</city>'
                    +'</address>'
                +'</prestashop>',
          success: (data, textStatus, jqXHR) => {
            
            address_invoice_saved = true;
            
          },
          error: function(jqXHR, textStatus, errorThrown){
            console.log('Errore chiamata ajax!' +
              '\nReponseText: ' + jqXHR.responseText +
              '\nStatus: ' + textStatus +
              '\nError: ' + errorThrown);
          },
        })

        if (address_delivery_saved && address_invoice_saved) {
          successCallback()
        }
        else {
          errorCallback({}, {}, {})
        }

      },

      updateProfile: function(user, profile, address_delivery, address_invoice, successCallback, errorCallback){

        // $.ajax({
        //   url: 'http://192.168.56.101/loveitaly/api/customers/',
        //   async: true,
        //   type: "PUT",
        //   dataType: 'xml',
        //   contentType: "text/xml",
        //   headers: {
        //       "Authorization": 'Basic SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'
        //   },
        //   data: '<?xml version="1.0" encoding="UTF-8"?>'
        //         +'<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">'
        //             +'<customer>'
        //                 +'<id>'+user.id+'</id>'
        //                 +'<lastname>'+profile.lastname+'</lastname>'
        //                 +'<firstname>'+profile.firstname+'</firstname>'
        //                 +'<email>'+profile.email+'</email>'
        //                 +'<passwd>'+profile.passwd+'</passwd>'
        //             +'</customer>'
        //         +'</prestashop>',
        //   success: (data, textStatus, jqXHR) => {
            
            this.updateAddresses(user, address_delivery, address_invoice, successCallback, errorCallback)
            
        //   },
        //   error: errorCallback,
        // })
      },
  });

  return UserModel;
});
