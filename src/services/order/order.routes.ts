import { NextFunction, Request, Response } from "express";
import moment from "moment";
import { checkLoginAdmin, checkLoginAdminPost } from "../../middleware/checksAdmin";
import { getTimeZone } from "../../models/Timezone";
import { getUsersNotAdmin } from "../user/UserController";
import { addOrderByAdmin, deletOrderForAdmin, editOrderByAdmin, getOrderForAdmin, getOrdersForAdmin } from "./OrderController";

export default [
    {
        path: "/admin/orders",
        method: "get",
        handler: [
            async (req: Request, res: Response, next: NextFunction) => {
                try {


                    const isLoggedInAdmin = checkLoginAdmin(req, res, next);
                    if (!isLoggedInAdmin) {
                        return res.redirect('/admin/login');
                    }
                    const timeZone = (await getTimeZone(req.session?.user._id))?.timezone;



                    let data: any = { data: {} };

                    if (req?.query?.action) {
                        data.data.action = req.query.action;
                    }

                    if (data.data.action == "addOrder" || data.data.action == "editOrder") {
                        data.data.users = await getUsersNotAdmin();
                    }


                    if (req?.query?.orderId) {
                        data.data.orderId = req.query.orderId;

                        if (data.data.action == "showOrder") {
                            data.data.order = await getOrderForAdmin(data.data.orderId);
                            if (data.data.order) {
                                data.data.order.sCreatedAt = data.data.order.createdAt ? moment(data.data.order.createdAt).utcOffset(timeZone ? timeZone : '').format("MM-DD-YYYY") : '';
                            }
                        }
                    }


                    getOrdersForAdmin(req, res, next, (err: any, orders: any) => {


                        data.data.orders = [...orders];

                        data.data.orders.forEach((order: any) => {
                            order.sCreatedAt = order.createdAt ? moment(order.createdAt).utcOffset(timeZone ? timeZone : '').format("MM-DD-YYYY") : '';



                        });



                        if (err) {
                            res.render('500');
                        } else {
                            return res.render('admin/subscriptions/orders', { ...data });
                        }
                    });
                } catch (error) {
                    console.error('========================= Begin Error get /admin/orders =============================')
                    console.error(error)
                    console.error('========================= END Error get /admin/orders =============================')
                }
            }
        ]
    },
    {
        path: "/admin/orders/add",
        method: "post",
        handler: [
            async (req: Request, res: Response, next: NextFunction) => {
                try {

                    checkLoginAdminPost(req, res, next, async (check: any) => {
                        if (!check) {
                            return;
                        }
                        let resp: any = { ...req.body };



                        addOrderByAdmin(resp, req, res, next);
                    });
                } catch (error) {
                    console.error('========================= Begin Error post /admin/orders/add =============================')
                    console.error(error)
                    console.error('========================= END Error post /admin/orders/add =============================')
                }
            }
        ]
    },
    {
        path: "/admin/orders/get",
        method: "post",
        handler: [
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    checkLoginAdminPost(req, res, next, async (check: any) => {
                        if (!check) {
                            return;
                        }

                        if (req?.body?.orderId) {


                            return res.status(200).send({ error: false, data: await getOrderForAdmin(req?.body?.orderId) });

                        } else {
                            return res
                                .status(500)
                                .send({ error: true, message: "No orderId" });
                        }
                    });
                } catch (err) {
                    console.error('========================= Begin Error post /admin/orders/get =============================')
                    console.error(err)
                    console.error('========================= END Error post /admin/orders/get =============================')
                }
            }
        ]
    },
    {
        path: "/admin/orders/delete",
        method: "post",
        handler: [
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    checkLoginAdminPost(req, res, next, async (check: any) => {
                        if (!check) {
                            return;
                        }
                        const result = await deletOrderForAdmin(req, res, next);


                        res.status(200).send({ error: false, data: result ? 'deleted' : 'error' });
                    });
                } catch (err) {
                    console.error('========================= Begin Error post /admin/orders/delete =============================')
                    console.error(err)
                    console.error('========================= END Error post /admin/orders/delete =============================')
                }
            }
        ]
    },
    {
        path: "/admin/orders/edit",
        method: "post",
        handler: [
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    checkLoginAdminPost(req, res, next, async (check: any) => {
                        if (!check) {
                            return;
                        }
                        let resp: any = { ...req.body }

                        const order = {
                            user: resp.user,
                            product: resp.product,
                            coupon: resp.coupon
                        };


                        editOrderByAdmin(order, req, res, next);
                    });
                } catch (err) {
                    console.error('========================= Begin Error post /admin/orders/edit =============================')
                    console.error(err)
                    console.error('========================= END Error post /admin/orders/edit =============================')
                }
            }
        ]
    },
];

