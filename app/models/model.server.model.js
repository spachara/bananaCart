'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Model Schema
 */
var ModelSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please select Model name',
		trim: true
	},
	type: {
        type: String,
        default: 'letter',
        required: 'Please select Model Type',
        trim: true
	},
    values: [
        name : {
                 type: String,
                 default: '',
                 required: 'Please fill name',
                 trim: true
        },
         value : {
                 type: String,
                 default: '',
                 required: 'Please fill value',
                 trim: true
        }
    ],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

ModelSchema.methods.print = function (i) {
  var temp = '';
    if(this.type == 'color')
    {
    temp =  'style="background-color:'+this.values[i].value+';color:'+this.values[0].value+'"';
    }
    else if(this.type == 'html')
    {
    temp = this.values[i].value;
    }
     else if(this.type == 'string')
    {
        temp = this.values[i].value;
    }
     else if(this.type == 'image')
    {
        temp = this.values[i].value;
    }
 return temp;
}

mongoose.model('Model', ModelSchema);