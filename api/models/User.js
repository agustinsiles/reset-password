/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt-nodejs');

function hashPassword(values, next) {
	bcrypt.genSalt(10, (err, salt) => {
		if (err) return next(err);
		
		bcrypt.hash(values.PASSWORD, salt, null, (err, hash) => {
			if (err) return next(err);
			
			values.PASSWORD = hash;
			next();
		});
	});
}

module.exports = {
	primaryKey: 'ID',
	tableName: "USER",
	attributes: {
		ID: {
			type: 'number',
			required: true,
			unique: true
		},
		NAME: {
			type: 'string',
			required: true
		},
		EMAIL: {
			type: 'string',
			required: true,
			unique: true
		},
		PASSWORD:  {
			type: 'string'
	 	},
		ACTIVE: {
			type: 'boolean',
			defaultsTo: false
		}
	},
	beforeCreate: (values, next) => hashPassword(values, next),
	beforeUpdate: (values, next) => hashPassword(values, next),
	validatePassword: (password, client, cb) => {
		bcrypt.compare(password, client.PASSWORD, (err, match) => {
			if (err || !match) cb(err);
			else cb(null, true);
		});
	}
};
