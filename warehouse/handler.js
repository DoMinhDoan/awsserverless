'use strict';

var AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

const addProduct = require('./handlers/create');
const listProduct = require('./handlers/list');
const viewProduct = require('./handlers/view');
const removeProduct = require('./handlers/remove');

const create = (event, context, callback) => {
	const data = JSON.parse(event.body);
	addProduct(data)
		.then(result => {
			const response = { body: JSON.stringify(result) };
			callback(null, response);
		})
		.catch(callback);
};

const list = (event, context, callback) => {	
	listProduct()
		.then(result => {
			const response = { body: JSON.stringify(result) };
			callback(null, response);
		})
		.catch(callback);
};

const view = (event, context, callback) => {
	const id = event.pathParameters.id;
	viewProduct(id)
		.then(result => {
			const response = { body: JSON.stringify(result) };
			callback(null, response);
		})
		.catch(callback);
};

const remove = (event, context, callback) => {
	const id = event.pathParameters.id;
	removeProduct(id)
		.then(result => {
			let params = {
				FunctionName: 'warehouse-dev-list',
				InvocationType: 'RequestResponse',
				Payload: ""
			};
			return lambda.invoke(params).promise();
		})
		.then(result => {
			const response = { body: JSON.stringify(JSON.parse(result.Payload)) };
			callback(null, response);
		})
		.catch(callback);
};


module.exports = {
	create,
	list,
	view,
	remove,
};