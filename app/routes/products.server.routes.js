'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var products = require('../../app/controllers/products.server.controller');
	var path = require('path');
	var multiparty = require('connect-multiparty');
    var multipartyMiddleware = multiparty({ uploadDir: path.resolve('./uploads/') });

	// Products Routes
	app.route('/products')
		.get(products.list)
		.post(users.requiresLogin, products.create);

	app.route('/products/:productId')
		.get(products.read)
		.put(users.requiresLogin, products.hasAuthorization, products.update)
		.delete(users.requiresLogin, products.hasAuthorization, products.delete);

	// Finish by binding the Product middleware
	app.param('productId', products.productByID);

	app.route('/productupload')
                .post(users.requiresLogin, multipartyMiddleware, products.createWithUpload);
};
