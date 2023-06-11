import { NextFunction, Request, Response } from "express";
import moment from "moment";
import "../../config/passport";
import { Discount } from "../../models/Discount";
import logger from "../../utils/logger";
import { getSubscriptionForAdmin } from "../subscription/SubscriptionController";
import { getUserById } from "../user/UserController";
import { log } from 'winston';

export const getDiscountsForAdmin = async (req: Request, res: Response, next: NextFunction, cb: Function) => {
    let filtre: any = {};
    Discount.find(filtre, (err, discounts) => {
        if (err) {
            logger.error(err);
            //return res.status(500).send(err);
            cb(err, undefined);
        } else {
            if (discounts?.length) {

                //return res.status(200).send({ error: false, data: discounts });
                cb(undefined, discounts);
            } else {
                //return res.status(200).send({ error: false, data: [] });
                cb(undefined, []);
            }
        }
    })
};

export const getDiscountForAdmin = async (discountId: string) => {
    return await Discount.findOne({ _id: discountId });
};

export const getDiscountByCodeForAdmin = async (code: string) => {
    return await Discount.findOne({ code: code });
};

export const getDiscountStatusForAdmin = async (code: string, userId: string, subscriptionId: string) => {

    const coupon = await Discount.findOne({ code: code });
    const now = new Date();
    const startTime = coupon?.startTime;
    const deadline = coupon?.deadline;
    const isafterStart = moment(now).isAfter(startTime);
    const isbeforeEnd = moment(now).isBefore(deadline);
    const maxUse = coupon?.maxUse? Number(coupon?.maxUse):0;
    const nbrUse = coupon?.nbrUse? Number(coupon?.nbrUse):0;
    const left = maxUse - nbrUse;
    const user = coupon?.user;
    const sub = coupon?.product;

    
    

    if (!coupon) {
        return false;
    }

    if (startTime) {
        if (!isafterStart) {
            return false;
        }
    }

    if (deadline) {
        if (!isbeforeEnd) {
            return false;
        }
    }
    if (maxUse && !left) {
        return false;
    }

    if (user && user != userId) {
        return false;
    }

    if (sub && sub != subscriptionId) {
        return false;
    }

    return true;
};

/**
 * addCouponByAdmin
 */
export const addCouponByAdmin = async (couponInfo: any, req: Request, res: Response, next: NextFunction) => {

    if (!couponInfo.code) {
        return res.status(500).send({ error: true, message: "Coupon code is required." });

    }

    if (!couponInfo.type) {
        return res
            .status(500)
            .send({ error: true, message: "Coupon type is required." });
    }

    if (!couponInfo.price) {
        return res
            .status(500)
            .send({ error: true, message: "Coupon price is required." });
    }

    if (!couponInfo.maxUse) {
        return res
            .status(500)
            .send({ error: true, message: "Coupon Max. of use is required." });
    }

    if (couponInfo.user) {
        const user  = await getUserById(couponInfo.user);
        if (user) {
            
            couponInfo.userName = user.profile.name && user.profile ? user.profile.name : user.username;
        }
    }

    if (couponInfo.product) {
        const sub = await getSubscriptionForAdmin(couponInfo.product);
        couponInfo.productName = sub?.name;
    }

    if (couponInfo.startTime) {
        couponInfo.startTime = new Date(couponInfo.startTime);
    }

    if (couponInfo.deadline) {
        couponInfo.deadline =  new Date(couponInfo.deadline);
    }
    couponInfo.nbrUse = 0;

    const theCoupon =  await Discount.findOne({ code: couponInfo.code });
    if (theCoupon) {
        return res
            .status(500)
            .send({ error: true, message: "Coupon code exist with the same parametres" });
    }

    const coupon = new Discount(couponInfo);
    coupon.save((e) => {
        if (e) {
            return res
                .status(500)
                .send(e);
        }

        return res
            .status(200)
            .send({ error: false, data: coupon._id });
    })


};

export const deletCouponForAdmin = async (req: Request, res: Response, next: NextFunction) => {
    
    return Discount.deleteOne({ _id: req.body.discountId }, function (err) {
        if (err) console.error('err', err) 
        
    });
};



export const editCouponByAdmin = async (couponInfo: any, req: Request, res: Response, next: NextFunction) => {

    if (!couponInfo.code) {
        return res.status(500).send({ error: true, message: "Coupon code is required." });

    }

    if (!couponInfo.type) {
        return res
            .status(500)
            .send({ error: true, message: "Coupon type is required." });
    }

    if (!couponInfo.price) {
        return res
            .status(500)
            .send({ error: true, message: "Coupon price is required." });
    }

    if (!couponInfo.maxUse) {
        return res
            .status(500)
            .send({ error: true, message: "Coupon Max. of use is required." });
    }

    if (couponInfo.user) {
        const user  = await getUserById(couponInfo.user);
        if (user) {
            
            couponInfo.userName = user.profile.name && user.profile ? user.profile.name : user.username;
        }
    }

    if (couponInfo.product) {
        const sub = await getSubscriptionForAdmin(couponInfo.product);
        couponInfo.productName = sub?.name;
    }

    if (couponInfo.startTime) {
        couponInfo.startTime = new Date(couponInfo.startTime);
    }

    if (couponInfo.deadline) {
        couponInfo.deadline =  new Date(couponInfo.deadline);
    }

    const theCoupon =  await Discount.findOne({ code: couponInfo.code });
    couponInfo.nbrUse = theCoupon && theCoupon.nbrUse ? theCoupon.nbrUse : 0;
    

    
    
    
    
    if (theCoupon && (theCoupon._id != req.body.discountId)) {
        return res
            .status(500)
            .send({ error: true, message: "Coupon code exist with the same parametres" });
    }


    const subscriptionUpdated = await Discount.updateOne({ _id: req.body.discountId }, { $set: couponInfo });
    


    return res.status(200).send({ error: false, data: req.body.discountId });
};


export const useCouponByAdmin = async (couponId: string, used: number) => {

    const subscriptionUpdated = await Discount.updateOne({ _id: couponId }, { $set: {nbrUse: used} });
};

