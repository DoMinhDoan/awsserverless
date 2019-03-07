'use strict';

let uuid = require("uuid");
// const Cat = require('../models/catmodel');

let Joi = require("joi");
let dynamo = require("dynamodb");

class Cat {
	constructor() {
		this.tableName = "cat";
		this.tableSchema = dynamo.define(this.tableName, {
			hashKey: "id",
			timestamps: false,
			schema: {
				id: Joi.string(),
				name: Joi.string(),
				kind: Joi.string(),
				createAt: Joi.number().default(new Date().getTime()),
			}
		});
	}
	
	create(item, callback) {
		return this.tableSchema.create(item, callback);
	}
	
	getById(id, callback) {
		return this.tableSchema.get(id, callback);
	}
	
	update(newItem, callback) {
		return this.tableSchema.update(newItem, callback);
	}
	
	deleteById(id, callback) {
		return this.tableSchema.destroy(id, callback);
	}
	
	
	// getAll(callback) {
		// return this.tableSchema
			// .scan()
			// .loadAll()
			// .exec(callback);
	// }
	
	// getAll(callback) {
		// return this.tableSchema.scan().exec(callback);
	// }
}

let m_cat = new Cat();

module.exports = {
	createCat: (event, context, callback) => {
		
		if (event.body) {
			event = JSON.parse(event.body);
		}		
		
		if(typeof event.name !== "string" || typeof event.kind !== "string") {
			return callback(null, {
				statusCode: 500,
				body: JSON.stringify("The name and kind of cat must be string character.")
			});
		}
		let catItem = {
			id: uuid.v1(),
			name: event.name,
			kind: event.kind,
		};
		
		m_cat.create(catItem, (err, catResult) => {
			if(err) {
				return callback(null, {
					statusCode: 500,
					body: JSON.stringify(err)
				});
			}
			return callback(null, {
				statusCode: 200,
				body: JSON.stringify(catResult.get())
			});
			
		}); 
		
		
	},
	
	getCatById: (event, context, callback) => {
		
		let catId = event.pathParameters.id;
			
		m_cat.getById(catId, (err, catResult) => {
			if(err) {
				return callback(null, {
					statusCode: 500,
					body: JSON.stringify(err)
				});
			}
			if(!catResult) {
				return callback(null, {
					statusCode: 404,
					body: JSON.stringify("Cat not found!")
				});
			}
			return callback(null, {
				statusCode: 200,
				body: JSON.stringify(catResult.get())
			});
			
		}); 
	},
	
	// updateCatById: (event, context, callback) => {
		
		// let catId = event.pathParameters.id;
		
		// if (event.body) {
			// event = JSON.parse(event.body);
		// }
		
		
		// let catItem = {
			// id: catId,
			// name: event.name,
			// kind: event.kind,
		// };
		
		// m_cat.update(catItem, (err, catResult) => {
			// if(err) {
				// return callback(null, {
					// statusCode: 500,
					// body: JSON.stringify(err)
				// });
			// }
			// return callback(null, {
				// statusCode: 200,
				// body: JSON.stringify("Update cat successfully.")
			// });
			
		// }); 
	// },
	
	// deleteCatById: (event, context, callback) => {
		
		// let catId = event.pathParameters.id;		
			
		// m_cat.deleteById(catId, (err) => {
			// if(err) {
				// return callback(null, {
					// statusCode: 500,
					// body: JSON.stringify(err)
				// });
			// }
			// return callback(null, {
				// statusCode: 200,
				// body: JSON.stringify("Delete cat successfully.")
			// });
			
		// }); 
	// }
};
