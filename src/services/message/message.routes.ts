import { NextFunction, Request, Response } from "express";
import { checkLoginPost } from "../../middleware/checks";
import { ioSocket } from "../../server";
import { addNotification } from "../notification/NotificationController";
import { getUserById } from "../user/UserController";
import { addMessage, addRoom, checkRoom, ckeckMessageWasSeen, getIsLastSeenMessage, getLastMessage, getLastSeenMessage, getMessages, getRoom, getRooms, getUnSeenMessages, seeMessage, seeMessageRoom } from "./MessagesController";

export default [
	{
		path: "/add/message",
		method: "post",
		handler: [
			async (req: Request, res: Response, next: NextFunction) => {

				try {
					checkLoginPost(req, res, next, async (check: any) => {
						if (!check) {
							return res.status(500).send({ error: true, message: 'not authenticated' });
						}

						const resp: any = { ...req.body };
						let roomId: any;

						if (resp.roomId) {
							const roomCheck = await getRoom(resp.roomId);
							if (roomCheck) {
								roomId = roomCheck._id;
							}
						}



						if (!roomId) {



							const theRoom = await checkRoom(resp.users.length, resp.users);




							if (theRoom) {
								roomId = theRoom._id;
							} else {



								const roomInfo = {
									roomName: resp.roomName,
									roomType: resp?.users?.length > 2 ? 'g' : 'd',
									users: resp.users
								};

								const room = await addRoom(roomInfo);



								roomId = room._id;
							}

						}



						const seen: any = [];
						seen.push(req.session?.user._id);

						const messageInfo = {
							text: resp.text,
							userId: req.session?.user._id,
							roomId: roomId,
							seen: seen
						}

						const message = await addMessage(messageInfo);





						setTimeout(async () => {
							const room: any = await getRoom(roomId);




							room.users.forEach(async (user: any) => {




								if (req.session?.user._id != user) {
									const userInfo = await getUserById(user);
									const userInfo2 = await getUserById(req.session?.user._id);



									if (userInfo) {



										ioSocket.emit(user + 'message' + roomId);
										ioSocket.emit(user + 'newmessage', JSON.stringify({
											text: `New message from ${userInfo2?.profile.name}`,
											url: `/messages/${roomId}`,
											type: 'newMessage',
											user: user
										}));
									}


								}
							});
						}, 50);

						return res.status(200).send({ error: false, data: roomId });


					});
				} catch (err) {
					console.error('========================= Begin Error post /add/message =============================')
					console.error(err)
					console.error('========================= END Error post /add/message =============================')
				}
			}
		]
	},
	{
		path: "/see/message",
		method: "post",
		handler: [
			async (req: Request, res: Response, next: NextFunction) => {

				try {
					checkLoginPost(req, res, next, async (check: any) => {
						if (!check) {
							return res.status(500).send({ error: true, message: 'not authenticated' });
						}
						const resp: any = { ...req.body };
						return res.status(200).send({ error: false, data: await seeMessage(resp.messageId, req.session?.user._id) });
					});
				} catch (err) {
					console.error('========================= Begin Error post /see/message =============================')
					console.error(err)
					console.error('========================= END Error post /see/message =============================')
				}
			}
		]
	},
	{
		path: "/see/message/room",
		method: "post",
		handler: [
			async (req: Request, res: Response, next: NextFunction) => {

				try {
					checkLoginPost(req, res, next, async (check: any) => {
						if (!check) {
							return res.status(500).send({ error: true, message: 'not authenticated' });
						}
						const resp: any = { ...req.body };

						const seenMessages = await seeMessageRoom(resp.roomId, req.session?.user._id);



						const room: any = await getRoom(resp.roomId);
						if (seenMessages.length) {

							room.users.forEach(async (user: any) => {
								//if (req.session?.user._id != user) {
								const userInfo = await getUserById(user);

								if (userInfo) {
									ioSocket.emit(user + 'messageseen' + room._id);
									ioSocket.emit(user + 'messageseen');
								}


								//}
							});
						}

						return res.status(200).send({ error: false, data: seenMessages });
					});
				} catch (err) {
					console.error('========================= Begin Error post /see/message/room =============================')
					console.error(err)
					console.error('========================= END Error post /see/message/room =============================')
				}
			}
		]
	},
	{
		path: "/delete/message",
		method: "post",
		handler: [
			async (req: Request, res: Response, next: NextFunction) => {

				try {
					checkLoginPost(req, res, next, async (check: any) => {
						if (!check) {
							return res.status(500).send({ error: true, message: 'not authenticated' });
						}
						const resp: any = { ...req.body };

					});
				} catch (err) {
					console.error('========================= Begin Error post /delete/message =============================')
					console.error(err)
					console.error('========================= END Error post /delete/message =============================')
				}
			}
		]
	},
	{
		path: "/get/messages/room",
		method: "post",
		handler: [
			async (req: Request, res: Response, next: NextFunction) => {

				try {
					checkLoginPost(req, res, next, async (check: any) => {
						if (!check) {
							return res.status(500).send({ error: true, message: 'not authenticated' });
						}
						const resp: any = { ...req.body };
						let data: any = {}
						const messages = await getMessages(resp.roomId);

						const room: any = await getRoom(resp.roomId);
						if (room) {


							let usersInfo: any = [];



							for (let index = 0; index < room.users.length; index++) {
								const user = await getUserById(room.users[index]);
								usersInfo.push(user)
							}

							data.room = {
								roomName: room.roomName,
								roomType: room.roomType,
								usersInfo: usersInfo,
							}
							data.messages = [];

							for (let index = 0; index < messages.length; index++) {
								let message = messages[index];


								data.messages.push({
									message,
									messageUser: await getUserById(message.userId),
									isSeen: await ckeckMessageWasSeen(message._id),
								});

							}
							data.lastMessage = await getLastSeenMessage(resp.roomId, req.session?.user._id);

							return res.status(200).send({ error: false, data: data });
						}

					});
				} catch (err) {
					console.error('========================= Begin Error post /get/messages/room =============================')
					console.error(err)
					console.error('========================= END Error post /get/messages/room =============================')
				}
			}
		]
	},
	{
		path: "/get/rooms",
		method: "post",
		handler: [
			async (req: Request, res: Response, next: NextFunction) => {
				try {
					checkLoginPost(req, res, next, async (check: any) => {
						if (!check) {
							return res.status(500).send({ error: true, message: 'not authenticated' });
						}





						const resp: any = { ...req.body };
						let rooms: any = await getRooms(req.session?.user._id);

						for (let index = 0; index < rooms.length; index++) {
							const room = rooms[index];
							let usersInfo: any = [];

							for (let index = 0; index < room.users.length; index++) {
								const user = await getUserById(room.users[index]);
								usersInfo.push(user)
							}

							const lastMessage = await getLastMessage(room._id);

							let theRoom = {
								_id: room._id,
								roomName: room.roomName,
								users: room.users,
								roomType: room.roomType,
								lastMessageDate: room.lastMessageDate,
								usersInfo: usersInfo,
								lastMessage: lastMessage,
								isLastMessageSeenByUser: await getIsLastSeenMessage(lastMessage._id, req.session?.user._id),
								lastMessageUser: await getUserById(lastMessage.userId)
							}

							rooms[index] = theRoom;
						}

						let roomsFilter: any = []
						if (resp.text) {



							for (let index = 0; index < rooms.length; index++) {
								let room: any = rooms[index];



								if (room.roomName) {
									const nameExist = room.roomName.indexOf(resp.text);



									if (nameExist == -1) {

										//rooms[index]=null;
									} else {
										roomsFilter.push(room)
										rooms[index] = null;

									}
								} else {
									const usersOfRoom = [...room.usersInfo];

									for (let index1 = 0; index1 < usersOfRoom.length; index1++) {
										const user = usersOfRoom[index1];
										if (user._id == req.session?.user._id) {
											usersOfRoom[index1] = null
										}
									}

									for (let index1 = 0; index1 < usersOfRoom.length; index1++) {
										const user = usersOfRoom[index1];
										if (user) {


											const nameExist = user.username.indexOf(resp.text);
											const nameExist2 = user.profile.name.indexOf(resp.text);



											//	if (user._id != req.session?.user._id) {







											if (nameExist == -1 && nameExist2 == -1) {
												//rooms.splice(index,1)

												//rooms[index]=null;

											} else {
												roomsFilter.push(room)
												rooms[index] = null;

											}
										}
										//	}else{
										//			room.usersInfo[index1] = null;
										//		}

									}
								}

							}

						} else {
							roomsFilter = rooms
						}






						return res.status(200).send({ error: false, data: roomsFilter });


					});
				} catch (err) {
					console.error('========================= Begin Error post /get/rooms =============================')
					console.error(err)
					console.error('========================= END Error post /get/rooms =============================')
				}
			}
		]
	},
	{
		path: "/get/messages/unread",
		method: "post",
		handler: [
			async (req: Request, res: Response, next: NextFunction) => {

				try {
					checkLoginPost(req, res, next, async (check: any) => {
						if (!check) {
							return res.status(500).send({ error: true, message: 'not authenticated' });
						}
						let numberOfMessages = 0;
						if (req.session?.user?._id) {


							const rooms: any = await getRooms(req.session?.user?._id);
							for (let index = 0; index < rooms.length; index++) {
								const room = rooms[index];
								if (room) {
									const messages = await getUnSeenMessages(room._id, req.session?.user._id);
									if (messages) {
										numberOfMessages++;
									}
								}
							}
						}
						return res.status(200).send({ error: false, data: numberOfMessages });
					});
				} catch (err) {
					console.error('========================= Begin Error post /get/messages/unread =============================')
					console.error(err)
					console.error('========================= END Error post /get/messages/unread =============================')
				}
			}
		]
	},
];

