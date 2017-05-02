'use strict';

const moment = require('moment');

class ChatQueryExecuter {
	constructor(knex) {
		this.knex = knex;
		this.userFieldsAllowToSelect = ['users.id as user:id',
			'users.name as user:name',
			'users.points as user:points', 'users.rank as user:rank',
			'users.profile_image_path as user:profileImagePath',
			'users.profile_image_url as user:profileImageUrl'];
		this.messagesFieldsToSelect = ['chat_messages.sender as sender',
			'chat_messages.message as message',
			'chat_messages.sending_date as date'
		];
		this.CHAT_ROOM_TABLE = 'chat_rooms';
		this.USERS_TABLE = 'users';
		this.MESSAGES_TABLE = 'chat_messages';
	};

	async getChatRoom(firstUserId, secondUserId) {
		firstUserId = parseInt(firstUserId);
		secondUserId = parseInt(secondUserId);
		if (firstUserId > secondUserId) {
			secondUserId = [firstUserId, firstUserId = secondUserId][0];
		}

		const condition = {
			'first_user': firstUserId,
			'second_user': secondUserId
		};
		const fieldsToSelect = ['chat_rooms.id'].concat(this.messagesFieldsToSelect);
		const roomWithMessages = await this.knex(this.CHAT_ROOM_TABLE)
			.where(condition)
			.innerJoin(this.MESSAGES_TABLE, 'chat_rooms.id', '=', 'chat_messages.chat_room_id')
			.select(fieldsToSelect);
		if(roomWithMessages.length) {
			return roomWithMessages;
		}

		const chatRoom = await this.knex(this.CHAT_ROOM_TABLE).where(condition).select(['chat_rooms.id']);
		return chatRoom;
	};

	async getChatRoomsForUser(userId) {
		const fieldsToSelect = ['chat_rooms.id'].concat(this.userFieldsAllowToSelect);
		const chatRoomsAsFirstUser = await this.knex(this.CHAT_ROOM_TABLE)
			.where({ 'first_user': userId })
			.innerJoin(this.USERS_TABLE, 'users.id', '=', 'chat_rooms.second_user')
			.select(fieldsToSelect);

		const chatRoomsAsSecondUser = await this.knex(this.CHAT_ROOM_TABLE)
			.where({ 'second_user': userId })
			.innerJoin(this.USERS_TABLE, 'users.id', '=', 'chat_rooms.first_user')
			.select(fieldsToSelect);
		return chatRoomsAsFirstUser.concat(chatRoomsAsSecondUser);
	};

	async createChatRoom(firstUserId, secondUserId, currentUser) {
		if (firstUserId > secondUserId) {
			secondUserId = [firstUserId, firstUserId = secondUserId][0];
		}
		const chatRoom = {
			first_user: parseInt(firstUserId),
			second_user: parseInt(secondUserId),
			created_at: new Date(),
			initializer_id: parseInt(currentUser) || null
		};

		const fieldsToSelect = ['chat_rooms.id'].concat(this.messagesFieldsToSelect);
		const insertedChatRoomId = await this.knex.insert(chatRoom).into(this.CHAT_ROOM_TABLE);
		return this.knex(this.CHAT_ROOM_TABLE)
			.where({ 'id': insertedChatRoomId })
			.innerJoin('chat_messages', 'chat_rooms.id', '=', 'chat_messages.chat_room_id')
			.select(fieldsToSelect);
	};

	saveMessage(senderId, roomId, messageInfo) {
		const messageToInsert = {
			chat_room_id: parseInt(roomId),
			sender: parseInt(senderId),
			message: messageInfo.message,
			sending_date: moment(messageInfo.date).format('YYYY-MM-DD HH:mm:ss')
		};
		return this.knex(this.MESSAGES_TABLE).insert(messageToInsert);
	};
};

module.exports = ChatQueryExecuter;