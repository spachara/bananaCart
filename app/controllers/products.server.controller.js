'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Product = mongoose.model('Product'),
	fs = require('fs'),
	path = require('path'),
	_ = require('lodash');

/**
 * Create a Product
 */
exports.create = function(req, res) {
	var product = new Product(req.body);
	product.user = req.user;

	product.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(product);
		}
	});
};

/**
 * Show the current Product
 */
exports.read = function(req, res) {
	res.jsonp(req.product);
};

/**
 * Update a Product
 */
exports.update = function(req, res) {
	var product = req.product ;

	product = _.extend(product , req.body);

	product.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(product);
		}
	});
};

/**
 * Delete an Product
 */
exports.delete = function(req, res) {
	var product = req.product ;

	product.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(product);
		}
	});
};

/**
 * List of Products
 */
exports.list = function(req, res) {
	Product.find().sort('-created').populate('user', 'displayName').exec(function(err, products) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(products);
		}
	});
};

/**
 * Product middleware
 */
exports.productByID = function(req, res, next, id) {
	Product.findById(id).populate('user', 'displayName').exec(function(err, product) {
		if (err) return next(err);
		if (! product) return next(new Error('Failed to load Product ' + id));
		req.product = product ;
		next();
	});
};

/**
 * Product authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.product.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.createWithUpload = function(req, res) {
 var file = req.files.file,
     targetPath = path.resolve('./uploads/', file.name);
// console.log(file.name);
// console.log(file.type);
 console.log(file.path);
// console.log(req.body.username);
console.log(targetPath);
 //console.log(req);

//var art = JSON.parse(req.body.article);
//var article = new Article(art);
//article.user = req.user;
fs.rename(file.path, targetPath, function(err) {
            if (err) throw err;
            console.log('Upload completed!');
        });
//fs.readFile(file.path, function (err,original_data) {
// if (err) {
//      return res.status(400).send({
//            message: errorHandler.getErrorMessage(err)
//        });
//  }
//   console.log('Upload completed!');
//    // save image in db as base64 encoded - this limits the image size
//    // to there should be size checks here and in client
//  var base64Image = original_data.toString('base64');
//  fs.unlink(file.path, function (err) {
//      if (err)
//      {
//          console.log('failed to delete ' + file.path);
//      }
//      else{
//        console.log('successfully deleted ' + file.path);
//      }
//  });
//  article.image = base64Image;
//
//  article.save(function(err) {
//    if (err) {
//        return res.status(400).send({
//            message: errorHandler.getErrorMessage(err)
//        });
//    } else {
//        res.json(article);
//    }
//  });
//});
};
