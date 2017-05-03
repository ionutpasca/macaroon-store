'use strict';

const Treeize = require('treeize');
const _ = require('lodash');

class ChatUtils {
	constructor() { };

	growTreeFromData(data) {
		if (!data.length) {
			data = [].concat(data);
		}
		const tree = new Treeize();
		tree.grow(data);
		return tree.getData();
	};

	getMessagesFromResultData(resultData) {
		if(!resultData[0].sender) {
			return [];
		}
		return _.map(resultData, (data) => {
			return {
				sender: data.sender,
				message: data.message,
				date: data.date
			};
		});
	};
};

module.exports = ChatUtils;