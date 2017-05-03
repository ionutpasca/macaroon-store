'use strict';

const ChatQueryExecuter = require('./chatQueryExecuter');

const ChatUtils = require('./chatUtils');
const chatUtils = new ChatUtils();

const quark = require('quark')();
const _ = require('lodash');

module.exports.name = 'chat';

function initialize(knex) {
	const queryExecuter = new ChatQueryExecuter(knex);

	quark.define({
		entity: 'chat',
		action: 'get_create_chat_room'
	}, async (args, callback) => {
		if (!args.first_user_id || !args.second_user_id) {
			return callback('no data');
		}
		if (args.first_user_id === args.second_user_id) {
			return callback('Invalid data');
		}
		try {
			let chatRoomData = await queryExecuter.getChatRoom(args.first_user_id, args.second_user_id);
			if (!chatRoomData.length) {
				chatRoomData = await queryExecuter.createChatRoom(args.first_user_id, args.second_user_id, args.initializer_id);
			}
			const messages = chatUtils.getMessagesFromResultData(chatRoomData);
			const result = {
				id: chatRoomData[0].id,
				messages: messages
			};
			if (messages.length) {
				Object.assign(result, { messages: messages });
			}
			callback(null, result);
		} catch (error) {
			console.log("ERR", error);
			callback(error);
		}
	});

	quark.define({
		entity: 'chat',
		action: 'get_chat_rooms_for_user'
	}, async (args, callback) => {
		if (!args.user_id) {
			callback('no id');
		}
		try {
			const chatRooms = await queryExecuter.getChatRoomsForUser(args.user_id);
			const result = chatUtils.growTreeFromData(chatRooms);
			callback(null, result);
		} catch (error) {
			callback(error);
		}
	});

	quark.define({
		entity: 'chat',
		action: 'save_message'
	}, async (args, callback) => {
		if (!args.chatRoomId || !args.senderId) {
			callback('no id');
		}
		try {
			const msgInsertedId = await queryExecuter.saveMessage(args.senderId, args.chatRoomId, args.messageInfo);
			callback(null, msgInsertedId);
		} catch (error) {
			callback(error);
		}
	});

	return quark;
};

module.exports.initialize = initialize;