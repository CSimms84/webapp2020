import { NextFunction, Request, Response } from "express";
import { Notification } from "../../models/Notifications";
import { ioSocket } from "../../server";

/**
 * addNotification
 */
export const addNotification = async (notificationInfo: any) => {

    const notification = new Notification(notificationInfo);
    
    
    
    return await notification.save((e) => {
        if (e) {
            
            
            
        }else{
            
    ioSocket.emit(notification.user+'notifs',JSON.stringify(notification));
        }

    })


};

export const deleteNotification = async (userId:string,type:string) => {
    
    return await Notification.deleteMany({ user: userId, type: type}, function (err) {
        if (err) {
            ioSocket.emit(userId+'notifs','removeNotif');
        }
        
    });
};

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    
    
    const notifications = await Notification.find({ user: req.body.userId }).sort({'createdAt': 'desc'});
    const userUpdated = await Notification.updateMany({ user: req.body.userId }, { $set: {seen:true} });
    return notifications;
};



export const getNotificationsNumber = async (req: Request, res: Response, next: NextFunction) => {
    
    
    return (await Notification.find({ user: req.body.userId,seen:false })).length;
};