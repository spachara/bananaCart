'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Uiexample Schema
 */
var UiexampleSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Uiexample name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Uiexample', UiexampleSchema);