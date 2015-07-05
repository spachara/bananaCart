'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var uiexamples = require('../../app/controllers/uiexamples.server.controller');
	var path = require('path');
	var multiparty = require('connect-multiparty');
    var multipartyMiddleware = multiparty({ uploadDir: path.resolve('./uploads/') });


	// Uiexamples Routes
	app.route('/uiexamples')
		.get(uiexamples.list)
		.post(users.requiresLogin, uiexamples.create);

	app.route('/uiexamples/:uiexampleId')
		.get(uiexamples.read)
		.put(users.requiresLogin, uiexamples.hasAuthorization, uiexamples.update)
		.delete(users.requiresLogin, uiexamples.hasAuthorization, uiexamples.delete);

	// Finish by binding the Uiexample middleware
	app.param('uiexampleId', uiexamples.uiexampleByID);

		app.route('/fileupload')
            .post(users.requiresLogin, multipartyMiddleware, uiexamples.createWithUpload);
};
