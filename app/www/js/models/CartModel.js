define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require("backbone");
  var xml2json = require("xml2json");
  xml2json = new xml2json();

  var ProductModel = require("models/ProductModel");

  var CartModel = Backbone.Model.extend({

      constructorName: "CartModel",

      initialize: function(options) {
          this.user_id = (options && options.user_id) ? options.user_id : '';
      },

      url: function() {
        let url = '';
        if (this.user_id) {
          url = 'http://192.168.56.101/loveitaly/api/carts/?display=full&io_format=JSON&filter[id_customer]=['+this.user_id+']&limit=1&sort=[id_DESC]&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H';
        }
        return url;
      },

      parse: function(data) {

        if (!(Array.isArray(data))) {

          let cart = data.carts[0];
          cart.products = []
          cart.total_price = 0;

          if (cart.associations && cart.associations.cart_rows && cart.associations.cart_rows.length > 0) {

            for(let i = 0, length1 = cart.associations.cart_rows.length; i < length1; i++){

              let product = cart.associations.cart_rows[i];

              if (product.id_product == 0) {
                continue;
              }

              let product_model = new ProductModel({
                id: product.id_product
              })

              product_model.fetch({
                async: false,
                success: function(model){
                  let p = model.toJSON()
                  p.quantity = product.quantity;
                  cart.products.push(p);
                  cart.total_price =  parseFloat(cart.total_price) + (parseFloat(p.price) * parseInt(p.quantity));
                },
                error: function(jqXHR, textStatus, errorThrown) {
                  console.log('Errore chiamata ajax!' +
                    '\nReponseText: ' + jqXHR.responseText +
                    '\nStatus: ' + textStatus +
                    '\nError: ' + errorThrown);
                }
              })

              cart.total_price = parseFloat(cart.total_price).toFixed(2)

              if (parseInt(cart.id_address_delivery) > 0) {
                $.ajax({
                  url: 'http://192.168.56.101/loveitaly/api/addresses/'+cart.id_address_delivery+'&io_format=JSON&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',
                  async: false,
                  type: "GET",
                  dataType: 'json',
                  success: (data, textStatus, jqXHR) => {
                    
                    if(data.id) {
                      cart.address_delivery = {
                        id: data.id,
                        address: data.address1,
                        city: data.city
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
              }

              if (parseInt(cart.id_address_invoice) > 0) {
                $.ajax({
                  url: 'http://192.168.56.101/loveitaly/api/addresses/'+cart.id_address_invoice+'&io_format=JSON&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',
                  async: false,
                  type: "GET",
                  dataType: 'json',
                  success: (data, textStatus, jqXHR) => {
                    
                    if(data.id) {
                      cart.address_invoice = {
                        id: data.id,
                        address: data.address1,
                        city: data.city
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
              }
                
            }
          }

          return cart;
        }
        
        return null;
      },

      sync: function(method, collection, options) {
          options = options || {};
          return Backbone.Model.prototype.sync.apply(this, arguments);
      },

      fetchLocalStorage: function(){
        let cart = JSON.parse(localStorage.getItem('cart'));
        if (!cart) {
          cart = {
            products: [],
            total_price: 0,
          }
        }
        return cart;
      },

      addProductLocalStorage: function(product, quantity, options) {
          let cart = this.fetchLocalStorage();

          let product_model = new ProductModel({
            id: product.id
          })

          product_model.fetch({
            wait: true,
            success: function(model){
              let p = model.toJSON()
              p.quantity = quantity;
              let product_found = false;
              for(let i = 0, length1 = cart.products.length; i < length1; i++){
                if ( cart.products[i].id == product.id ) {
                  product_found = true;
                  cart.products[i].quantity = quantity;
                  break;
                }
              }
              if (!product_found) {
                cart.products.push(p);
              }
              cart.total_price = parseFloat(cart.total_price) + (parseFloat(p.price) * parseInt(p.quantity));
              cart.total_price = parseFloat(cart.total_price).toFixed(2)
              options.success(cart)
              localStorage.setItem('cart', JSON.stringify(cart));
            },
            error: options.error
          })
      },

      removeProductLocalStorage: function(product) {
          let cart = this.fetchLocalStorage();
          cart.total_price = 0;
          let index = -1;
          for(let i = 0, length1 = cart.products.length; i < length1; i++){
            if (cart.products[i].id == product.id ) {
              index = i;
              break;
            }
          }
          if (index >= 0) {
            cart.products.splice(index, 1);
            for(let i = 0, length1 = cart.products.length; i < length1; i++){
              cart.total_price = parseFloat(cart.total_price) + (parseFloat(cart.products[i].price) * parseInt(cart.products[i].quantity));
            }
          }
          cart.total_price = parseFloat(cart.total_price).toFixed(2)
          localStorage.setItem('cart', JSON.stringify(cart));
      },

      updateProductLocalStorage: function(product, quantity) {
          let cart = this.fetchLocalStorage()
          cart.total_price = 0;
          for(let i = 0, length1 = cart.products.length; i < length1; i++){
            if (cart.products[i].id == product.id ) {
              cart.products[i].quantity = quantity;
            }
            cart.total_price = parseFloat(cart.total_price) + (parseFloat(cart.products[i].price) * parseInt(cart.products[i].quantity));
          }
          cart.total_price = parseFloat(cart.total_price).toFixed(2)
          localStorage.setItem('cart', JSON.stringify(cart));
      },

      syncLocalStorageToServer: function(options) {
        let localCart = this.fetchLocalStorage();

        if (localCart.products.length > 0) {

          this.create((model) => {
            for(let i = 0, length1 = localCart.products.length; i < length1; i++){
              let product = localCart.products[i];
              this.updateCartMultipleProducts(localCart.products, model, true, options.success, options.error)
            }
          }, options.error)

        }
        
        localStorage.removeItem('cart');
      },

      create: function(successCallback, errorCallback){

        $.ajax({
          url: 'http://192.168.56.101/loveitaly/api/carts/',
          async: true,
          type: "POST",
          dataType: 'xml',
          contentType: "text/xml",
          headers: {
              "Authorization": 'Basic SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'
          },
          data: '<?xml version="1.0" encoding="UTF-8"?>'
                +'<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">'
                    +'<cart>'
                        +'<id_currency>1</id_currency>'
                        +'<id_customer>'+this.user_id+'</id_customer>'
                        +'<id_lang>1</id_lang>'
                    +'</cart>'
                +'</prestashop>',
          success: (data) => {
            
            this.fetch({
              success: successCallback,
              error: errorCallback,
            })

          },
          error: errorCallback,
        })

      },

      updateCart: function(product, quantity, model, override, successCallback, errorCallback, async) {

        async = (!async) ? true : false;

        let cart_model = model.toJSON();

        if (!cart_model.associations) {
          cart_model.associations = {
            cart_rows: []
          }
        }

        let products = cart_model.associations.cart_rows;

        let product_found = false
        let index_product_id_0 = -1;
        let index_product_deleted = -1;

        for(let i = 0, length1 = products.length; i < length1; i++){

          if (parseInt(products[i].id_product) == product.id && !product_found) {

              product_found = true;

              if (quantity > 0) {
                // aggiorna la quantità del prodotto
                let curr_quantity = parseInt(products[i].quantity);
                products[i].quantity = (!override) ? parseInt(products[i].quantity) + quantity : quantity;
              }
              else {
                // cancella il prodotto
                index_product_deleted = i;
              }
          }

          if (parseInt(products[i].id_product) == 0) {
            index_product_id_0 = i;
          }

        }

        if (index_product_id_0 >= 0) {
          // cancella il prodotto che ha id 0
          cart_model.associations.cart_rows.splice(index_product_id_0, 1)
        }

        if (index_product_deleted >= 0) {
          // cancella il prodotto
          cart_model.associations.cart_rows.splice(index_product_deleted, 1)
        }

        if (!product_found && quantity > 0) {
            cart_model.associations.cart_rows.push({
                id_product: product.id,
                id_product_attribute: 0,
                id_address_delivery: 0,
                quantity: quantity
            });
        }

        let cart_model_clone = _.clone(cart_model)
        delete cart_model_clone.products
        delete cart_model_clone.user_id
        delete cart_model_clone.total_price;
        delete cart_model_clone.address_delivery;
        delete cart_model_clone.address_invoice;

        let xml = xml2json.json2xml_str(cart_model_clone)
        let div = $('<div />');
        $(div).html(xml);

        if(cart_model_clone.associations.cart_rows.length > 0){
          $(div).find('cart_rows').wrapAll('<cart_rows />');
        }

        xml = '<?xml version="1.0" encoding="UTF-8"?><prestashop xmlns:xlink="http://www.w3.org/1999/xlink"><cart>' + $(div).html() + '</cart></prestashop>';

        $.ajax({
            url: 'http://192.168.56.101/loveitaly/api/carts/',
            async: async,
            type: "PUT",
            dataType: 'xml',
            contentType: "text/xml",
            headers: {
                "Authorization": 'Basic SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'
            },
            data: xml,
            success: successCallback,
            error: errorCallback,
        })
      },

      updateCartMultipleProducts: function(products, model, successCallback, errorCallback, async) {

        async = (!async) ? true : false;

        let cart_model = model.toJSON();

        if (!cart_model.associations) {
          cart_model.associations = {
            cart_rows: []
          }
        }

        for(let j = 0, length2 = products.length; j < length2; j++){
          let product = products[j];
          let product_rows = cart_model.associations.cart_rows;

          let product_found = false
          let index_product_id_0 = -1;
          let index_product_deleted = -1;

          for(let i = 0, length1 = product_rows.length; i < length1; i++){

            if (parseInt(product_rows[i].id_product) == product.id && !product_found) {

                product_found = true;

                if (product.quantity > 0) {
                  // aggiorna la quantità del prodotto
                  let curr_quantity = parseInt(product_rows[i].quantity);
                  product_rows[i].quantity = (!product.override) ? parseInt(product_rows[i].quantity) + product.quantity : product.quantity;
                }
                else {
                  // cancella il prodotto
                  index_product_deleted = i;
                }
            }

            if (parseInt(product_rows[i].id_product) == 0) {
              index_product_id_0 = i;
            }

          }

          if (index_product_id_0 >= 0) {
            // cancella il prodotto che ha id 0
            cart_model.associations.cart_rows.splice(index_product_id_0, 1)
          }

          if (index_product_deleted >= 0) {
            // cancella il prodotto
            cart_model.associations.cart_rows.splice(index_product_deleted, 1)
          }

          if (!product_found && product.quantity > 0) {
              cart_model.associations.cart_rows.push({
                  id_product: product.id,
                  id_product_attribute: 0,
                  id_address_delivery: 0,
                  quantity: product.quantity
              });
          }
        }

        let cart_model_clone = _.clone(cart_model)
        delete cart_model_clone.products
        delete cart_model_clone.user_id
        delete cart_model_clone.total_price;
        delete cart_model_clone.address_delivery;
        delete cart_model_clone.address_invoice;

        let xml = xml2json.json2xml_str(cart_model_clone)
        let div = $('<div />');
        $(div).html(xml);

        if(cart_model_clone.associations.cart_rows.length > 0){
          $(div).find('cart_rows').wrapAll('<cart_rows />');
        }

        xml = '<?xml version="1.0" encoding="UTF-8"?><prestashop xmlns:xlink="http://www.w3.org/1999/xlink"><cart>' + $(div).html() + '</cart></prestashop>';

        $.ajax({
            url: 'http://192.168.56.101/loveitaly/api/carts/',
            async: async,
            type: "PUT",
            dataType: 'xml',
            contentType: "text/xml",
            headers: {
                "Authorization": 'Basic SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'
            },
            data: xml,
            success: successCallback,
            error: errorCallback,
        })
      },

      setAddresses: function(model, address_delivery, address_invoice, successCallback, errorCallback){

        let cart_model = model.toJSON();

        cart_model.id_address_delivery = address_delivery.id;
        cart_model.id_address_invoice = address_invoice.id;

        let cart_model_clone = _.clone(cart_model);
        delete cart_model_clone.products;
        delete cart_model_clone.user_id;
        delete cart_model_clone.total_price;
        delete cart_model_clone.address_delivery;
        delete cart_model_clone.address_invoice;

        let xml = xml2json.json2xml_str(cart_model_clone);
        let div = $('<div />');
        $(div).html(xml);
        $(div).find('cart_rows').wrapAll('<cart_rows />');

        xml = '<?xml version="1.0" encoding="UTF-8"?><prestashop xmlns:xlink="http://www.w3.org/1999/xlink"><cart>' + $(div).html() + '</cart></prestashop>';

        $.ajax({
            url: 'http://192.168.56.101/loveitaly/api/carts',
            async: true,
            type: "PUT",
            dataType: 'xml',
            contentType: "text/xml",
            headers: {
                "Authorization": 'Basic SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'
            },
            data: xml,
            success: successCallback,
            error: errorCallback,
        })
      },

      setCarrier: function(model, carrier, successCallback, errorCallback){
        let cart_model = model.toJSON();

        cart_model.id_carrier = carrier.id

        let cart_model_clone = _.clone(cart_model)
        delete cart_model_clone.products
        delete cart_model_clone.user_id
        delete cart_model_clone.total_price
        delete cart_model_clone.address_delivery
        delete cart_model_clone.address_invoice

        let xml = xml2json.json2xml_str(cart_model_clone)
        let div = $('<div />');
        $(div).html(xml);
        $(div).find('cart_rows').wrapAll('<cart_rows />');

        xml = '<?xml version="1.0" encoding="UTF-8"?><prestashop xmlns:xlink="http://www.w3.org/1999/xlink"><cart>' + $(div).html() + '</cart></prestashop>';

        $.ajax({
            url: 'http://192.168.56.101/loveitaly/api/carts/',
            async: true,
            type: "PUT",
            dataType: 'xml',
            contentType: "text/xml",
            headers: {
                "Authorization": 'Basic SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'
            },
            data: xml,
            success: successCallback,
            error: errorCallback,
        })
      },
  });

  return CartModel;
});
