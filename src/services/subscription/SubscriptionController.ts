import { NextFunction, Request, Response } from "express";
import "../../config/passport";
import { Subscription } from "../../models/Subcription";
import logger from "../../utils/logger";

export const getSubscriptionsForAdmin = async (req: Request, res: Response, next: NextFunction, cb: Function) => {
    
    
    
    let filtre: any = {};
    Subscription.find(filtre, (err: any, subscriptions: any) => {
        if (err) {
            logger.error(err);
            //return res.status(500).send(err);
            cb(err, undefined);
        } else {
            if (subscriptions?.length) {

                //return res.status(200).send({ error: false, data: subscriptions });
                cb(undefined, subscriptions);
            } else {
                //return res.status(200).send({ error: false, data: [] });
                cb(undefined, []);
            }
        }
    })
};

export const getSubscriptionsByRoleForAdmin = async (role: string) => {
    
    
    
    if (role) {
        return await Subscription.find({ role: role })
    }
    return;
};

export const getSubscriptionForAdmin = async (subscriptionId: string) => {
    
    
    
    if (subscriptionId && subscriptionId != 'undefined') {
        
        return await Subscription.findOne({ _id: subscriptionId });
    }
    return;
};

/**
 * addSubscriptionByAdmin
 */
export const addSubscriptionByAdmin = async (subscriptionInfo: any, req: Request, res: Response, next: NextFunction) => {

    if (!subscriptionInfo.name) {
        return res.status(500).send({ error: true, message: "Subscription name is required." });

    }

    if (!subscriptionInfo.role) {
        return res
            .status(500)
            .send({ error: true, message: "Subscription role is required." });
    }

    if (!subscriptionInfo.price) {
        return res
            .status(500)
            .send({ error: true, message: "Subscription price is required." });
    }

    if (!subscriptionInfo.recursion) {
        subscriptionInfo.recursion = 'ot'
    }

    const subscription = new Subscription(subscriptionInfo);
    subscription.save((e: any) => {
        if (e) {
            return res
                .status(500)
                .send(e);
        }

        return res
            .status(200)
            .send({ error: false, data: subscription._id });
    })


};

export const deletSubcriptionForAdmin = async (req: Request, res: Response, next: NextFunction) => {
    
    return Subscription.deleteOne({ _id: req.body.subscriptionId }, function (err: any) {
        if (err) console.log(err);
        console.log("Successful deletion " + req.body.subscriptionId);
    });
};

export const editSubscriptionByAdmin = async (subscriptionInfo: any, req: Request, res: Response, next: NextFunction) => {

    if (!subscriptionInfo.name) {
        return res.status(500).send({ error: true, message: "Subscription name is required." });

    }

    if (!subscriptionInfo.role) {
        return res
            .status(500)
            .send({ error: true, message: "Subscription role is required." });
    }

    if (!subscriptionInfo.price) {
        return res
            .status(500)
            .send({ error: true, message: "Subscription price is required." });
    }

    if (!subscriptionInfo.recursion) {
        subscriptionInfo.recursion = 'ot'
    }
    

    const subscriptionUpdated = await Subscription.updateOne({ _id: req.body.subscriptionId }, { $set: subscriptionInfo });
    console.log('subscriptionUpdated', subscriptionUpdated);


    return res.status(200).send({ error: false, data: req.body.subscriptionId });
};
