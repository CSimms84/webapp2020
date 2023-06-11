import { NextFunction, Request, Response } from "express";
import moment from "moment";
import "../../config/passport";
import { Order } from "../../models/Order";
import logger from "../../utils/logger";
import { getDiscountByCodeForAdmin, getDiscountStatusForAdmin, useCouponByAdmin } from "../discount/DiscountController";
import { getSubscriptionForAdmin } from "../subscription/SubscriptionController";
import { getUserById } from "../user/UserController";

export const getOrdersForAdmin = async (req: Request, res: Response, next: NextFunction, cb: Function) => {
    let filtre: any = {};
    Order.find(filtre, (err: any, orders: any) => {
        if (err) {
            logger.error(err);
            //return res.status(500).send(err);
            cb(err, undefined);
        } else {
            if (orders?.length) {

                //return res.status(200).send({ error: false, data: orders });
                cb(undefined, orders);
            } else {
                //return res.status(200).send({ error: false, data: [] });
                cb(undefined, []);
            }
        }
    })
};

export const getOrderForAdmin = async (orderId: string) => {
    return await Order.findOne({ _id: orderId });
};

/**
 * addOrderByAdmin
 */
export const addOrderByAdmin = async (orderInfo: any, req: Request, res: Response, next: NextFunction) => {

    if (!orderInfo.user) {
        return res.status(500).send({ error: true, message: "User is required." });

    }

    if (!orderInfo.product) {
        return res
            .status(500)
            .send({ error: true, message: "Product is required." });
    }

    let discount;
    if (orderInfo.coupon) {
        discount = await getDiscountStatusForAdmin(orderInfo.coupon, orderInfo.user, orderInfo.product);
        

        if (!discount) {
            return res
                .status(500)
                .send({ error: true, message: "Invalid coupon code" });
        }
    }

    const user = await getUserById(orderInfo.user);

    if (user) {
        orderInfo.user = user._id;
        orderInfo.userInfo = user.profile.name ? user.profile.name : user.username;
    }

    const product = await getSubscriptionForAdmin(orderInfo.product);

    if (product) {
        orderInfo.product = product._id;
        orderInfo.productInfo = product.name;
        orderInfo.subtotal = product.price;
        if (product.promo) {

            const now = new Date();
            const starts = product?.starts;
            const ends = product?.ends;
            const isafterStart = moment(now).isAfter(starts);
            const isbeforeEnd = moment(now).isBefore(ends);

            if (isafterStart && isbeforeEnd) {
                orderInfo.subtotal = product.pricePromo;
            }


        }
    }

    const coupon = await getDiscountByCodeForAdmin(orderInfo.coupon);

    if (coupon) {
        orderInfo.coupon = coupon.code;
        orderInfo.couponInfo = coupon.price + (coupon.type == 'fixed' ? '$' : '%');
        orderInfo.discount = coupon.type == 'fixed' ? coupon.price + '$' : (orderInfo.subtotal * coupon.price / 100) + '$';
        

        orderInfo.total = orderInfo.subtotal - Number(coupon.type == 'fixed' ? coupon.price : (orderInfo.subtotal * coupon.price / 100));

        await useCouponByAdmin(coupon._id, Number(coupon.nbrUse ? coupon.nbrUse : 0) + 1);
    } else {
        orderInfo.total = orderInfo.subtotal;
    }

    if (orderInfo.total < 0) {
        orderInfo.total = 0;
    }



    const order = new Order(orderInfo);
    order.save((e) => {
        if (e) {
            return res
                .status(500)
                .send(e);
        }

        return res
            .status(200)
            .send({ error: false, data: order._id });
    })


};

export const deletOrderForAdmin = async (req: Request, res: Response, next: NextFunction) => {
    
    return Order.deleteOne({ _id: req.body.orderId }, function (err) {
        if (err) console.error('err', err) 
        
    });
};



export const editOrderByAdmin = async (orderInfo: any, req: Request, res: Response, next: NextFunction) => {

    if (!orderInfo.user) {
        return res.status(500).send({ error: true, message: "User is required." });

    }

    if (!orderInfo.product) {
        return res
            .status(500)
            .send({ error: true, message: "Product is required." });
    }

    const order = await Order.findOne({ _id: req.body.orderId });
    let discount;
    if (orderInfo.coupon) {
        
        if (order?.coupon != orderInfo.coupon) {
            

            discount = await getDiscountStatusForAdmin(orderInfo.coupon, orderInfo.user, orderInfo.product);
            

            if (!discount) {
                return res
                    .status(500)
                    .send({ error: true, message: "Invalid coupon code" });
            }

        }
    }

    const user = await getUserById(orderInfo.user);

    if (user) {
        orderInfo.user = user._id;
        orderInfo.userInfo = user.profile.name ? user.profile.name : user.username;
    }

    const product = await getSubscriptionForAdmin(orderInfo.product);

    if (product) {

        orderInfo.product = product._id;
        orderInfo.productInfo = product.name;
        orderInfo.subtotal = product.price;
        if (product.promo) {

            const now = new Date();
            const starts = product?.starts;
            const ends = product?.ends;
            const isafterStart = moment(now).isAfter(starts);
            const isbeforeEnd = moment(now).isBefore(ends);

            if (isafterStart && isbeforeEnd) {
                orderInfo.subtotal = product.pricePromo;
            }


        }
    }

    const coupon = await getDiscountByCodeForAdmin(orderInfo.coupon);

    if (coupon) {
        orderInfo.coupon = coupon.code;
        orderInfo.couponInfo = coupon.price + (coupon.type == 'fixed' ? '$' : '%');
        orderInfo.discount = coupon.type == 'fixed' ? coupon.price + '$' : (orderInfo.subtotal * coupon.price / 100) + '$';
        

        orderInfo.total = orderInfo.subtotal - Number(coupon.type == 'fixed' ? coupon.price : (orderInfo.subtotal * coupon.price / 100));
        if (order?.coupon != orderInfo.coupon) {
            
            await useCouponByAdmin(coupon._id, Number(coupon.nbrUse ? coupon.nbrUse : 0) + 1);
            
            if (order) {
                const coupon2 = await getDiscountByCodeForAdmin(order.coupon);
                await useCouponByAdmin(coupon2?._id, Number(coupon2?.nbrUse ? coupon2.nbrUse : 0) - 1);
            }
        }
    } else {
        orderInfo.total = orderInfo.subtotal;
    }

    if (orderInfo.total < 0) {
        orderInfo.total = 0;
    }



    const subscriptionUpdated = await Order.updateOne({ _id: req.body.orderId }, { $set: orderInfo });
    


    return res.status(200).send({ error: false, data: req.body.orderId });
};
