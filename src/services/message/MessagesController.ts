import { NextFunction, Request, Response } from "express";
import { Room, Message } from "../../models/messages";
import { ioSocket } from "../../server";
import _ from "lodash";


export const addRoom = async (roomInfo: any) => {

    const room = new Room(roomInfo);

     await room.save((e) => {
        if (e) {
            
            
            
        }else{
            

        }
    })

    return room;
};

export const checkRoom = async (size:any, users: any) => {
    
    
    
    return await Room.findOne( { users: {$size : size, $all: users } } );
};


export const getRoom = async (roomId: any) => {
    
    
    
    return await Room.findOne( { _id: roomId.toString() } );
};

export const getRooms = async (userId: any) => {
    return await Room.find( { users: userId } ).sort({'lastMessageDate': 'desc'});;
};

export const addMessage = async (messageInfo: any) => {
    const message = new Message(messageInfo);
    
    
    
     await message.save(async (e) => {
        if (e) {
            
            
            
        }else{
            await Room.updateOne({ _id: messageInfo.roomId }, { $set: {lastMessageDate:new Date()} });

        }
    })

    return message;
};

export const seeMessage = async (messageId: any, userId: any) => {
    return await Message.updateOne({ _id: messageId }, { $push: {seen:userId} });
};



export const seeMessageRoom = async (roomId: any, userId: any) => {
    
    
    
    return await Message.find({ roomId: roomId , userId: { $ne: userId }, seen: { $ne: userId }},(err,messages)=>{

      
        if (messages) {
            messages.forEach(async (message:any) => {
                //
                //
                //
                // if (message.seen.indexOf(userId) == -1 && message.userId != userId) {
                    await Message.updateOne({ _id: message._id }, { $push: {seen:userId} });
               // }
            });
        }

    })
    
    
   // Message.update({ roomId: roomId, userId: { $ne: userId } }, { $push: {seen:userId} });
};

export const getLastSeenMessage = async (roomId: any, userId: any) => {
    const messages = await Message.find({ roomId: roomId, seen:{$eq: userId}});
    return messages[messages.length-1];
};

export const getUnSeenMessages = async (roomId: any, userId: any) => {
    const messages = await Message.find({ roomId: roomId, seen:{$ne: userId}});
    return messages.length;
};

export const getIsLastSeenMessage = async (messageId: any, userId: any) => {
    const message = await Message.findOne({ _id: messageId, seen:{$eq: userId}});
    return message?true:false;
};

export const getLastMessage = async (roomId: any) => {
    const messages = await Message.find({ roomId: roomId});
    return messages[messages.length-1];
};

export const getMessages = async (roomId: any) => {
    return await Message.find({ roomId: roomId})
};

export const ckeckMessageWasSeen = async (messageId: any) => {
    const messages = await Message.findOne({ _id: messageId});
    const room = await Room.findOne( { _id: messages?.roomId } );

    
    
    
    
    const seenMessages = await Message.findOne( { "_id": messageId } );
    
    
    
    return  _.isEqual(_.sortBy(seenMessages?.seen), _.sortBy(room?.users)) ?true:false;
};


