define(function(require) {

    var Backbone = require("backbone");
    var ReviewModel = require("models/ReviewModel");

    var ReviewsCollection = Backbone.Collection.extend({
        constructorName: "ReviewsCollection",
        model: ReviewModel,
        fetch: function(id_product, options){
            let reviews = JSON.parse(localStorage.getItem('reviews'));
            reviews = (!reviews) ? {} : reviews;

            if (!reviews[id_product]) {
                reviews[id_product] = [];
            }

            options.success(reviews[id_product])
            //options.error({}, {}, {})
        },
        addReview: function(id_product, review, options) {
            let reviews = JSON.parse(localStorage.getItem('reviews'));
            reviews = (!reviews) ? {} : reviews;

            if (!reviews[id_product]) {
                reviews[id_product] = [];
            }

            reviews[id_product].unshift(review);
            localStorage.setItem('reviews', JSON.stringify(reviews));
            options.success(reviews[id_product])
        },
    });

    return ReviewsCollection;
});