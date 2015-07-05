'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Uiexample = mongoose.model('Uiexample'),
	fs = require('fs'),
	path = require('path'),
	_ = require('lodash');

/**
 * Create a Uiexample
 */
exports.create = function(req, res) {
	var uiexample = new Uiexample(req.body);
	uiexample.user = req.user;

	uiexample.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(uiexample);
		}
	});
};

/**
 * Show the current Uiexample
 */
exports.read = function(req, res) {
	res.jsonp(req.uiexample);
};

/**
 * Update a Uiexample
 */
exports.update = function(req, res) {
	var uiexample = req.uiexample ;

	uiexample = _.extend(uiexample , req.body);

	uiexample.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(uiexample);
		}
	});
};

/**
 * Delete an Uiexample
 */
exports.delete = function(req, res) {
	var uiexample = req.uiexample ;

	uiexample.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(uiexample);
		}
	});
};

/**
 * List of Uiexamples
 */
exports.list = function(req, res) {
	Uiexample.find().sort('-created').populate('user', 'displayName').exec(function(err, uiexamples) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(uiexamples);
		}
	});
};

/**
 * Uiexample middleware
 */
exports.uiexampleByID = function(req, res, next, id) {
	Uiexample.findById(id).populate('user', 'displayName').exec(function(err, uiexample) {
		if (err) return next(err);
		if (! uiexample) return next(new Error('Failed to load Uiexample ' + id));
		req.uiexample = uiexample ;
		next();
	});
};

/**
 * Uiexample authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.uiexample.user.id !== req.user.id) {
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
