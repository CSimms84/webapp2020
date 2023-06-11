import { NextFunction, Request, Response } from "express";
import moment from "moment";
import { checkLoginAdmin, checkLoginAdminPost } from "../../middleware/checksAdmin";
import { getTimeZone } from "../../models/Timezone";
import { getSubscriptionForAdmin, getSubscriptionsByRoleForAdmin } from "../subscription/SubscriptionController";
import { getUserById } from "../user/UserController";
import { addSubscriptionByAdmin, deletSubcriptionForAdmin, editSubscriptionByAdmin, getSubscriptionsForAdmin } from "./SubscriptionController";

export default [
	{
		path: "/admin/subscriptions",
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

					if (req?.query?.subscriptionId) {
						data.data.subscriptionId = req.query.subscriptionId;

						if (data.data.action == "showSubscription") {

							data.data.subscription = await getSubscriptionForAdmin(data.data.subscriptionId);
							if (data.data.subscription) {

								data.data.subscription.sstarts = data.data.subscription.starts ? moment(data.data.subscription.starts).utcOffset(timeZone ? timeZone : '').format("MM-DD-YYYY") : '';
								data.data.subscription.sends = data.data.subscription.ends ? moment(data.data.subscription.ends).utcOffset(timeZone ? timeZone : '').format("MM-DD-YYYY") : '';
							}

						}
					}



					getSubscriptionsForAdmin(req, res, next, (err: any, subscriptions: any) => {


						data.data.subscriptions = [...subscriptions];

						data.data.subscriptions.forEach(async (subscription: any) => {

							subscription.sstarts = subscription.starts ? moment(subscription.starts).utcOffset(timeZone ? timeZone : '').format("MM-DD-YYYY") : '';
							subscription.sends = subscription.ends ? moment(subscription.ends).utcOffset(timeZone ? timeZone : '').format("MM-DD-YYYY") : '';




						});





						if (err) {
							res.render('500');
						} else {
							return res.render('admin/subscriptions/subscriptions', { ...data });
						}
					});
				} catch (error) {
					console.error('========================= Begin Error get /admin/subscriptions =============================')
					console.error(error)
					console.error('========================= END Error get /admin/subscriptions =============================')
				}
			}
		]
	},
	{
		path: "/admin/subscriptions/get",
		method: "post",
		handler: [
			async (req: Request, res: Response, next: NextFunction) => {
				try {

					checkLoginAdminPost(req, res, next, async (check: any) => {
						if (!check) {
							return;
						}

						if (req?.body?.subscriptionId) {


							return res.status(200).send({ error: false, data: await getSubscriptionForAdmin(req?.body?.subscriptionId) });
						} else {
							return res
								.status(500)
								.send({ error: true, message: "No subscriptionId" });
						}
					});
				} catch (error) {
					console.error('========================= Begin Error post /admin/subscriptions/get =============================')
					console.error(error)
					console.error('========================= END Error post /admin/subscriptions/get =============================')
				}
			}
		]
	},
	{
		path: "/admin/subscriptions/add",
		method: "post",
		handler: [
			async (req: Request, res: Response, next: NextFunction) => {
				try {
					checkLoginAdminPost(req, res, next, async (check: any) => {
						if (!check) {
							return;
						}
						let resp: any = { ...req.body };
						const subscription = {
							name: resp.name,
							role: resp.role,
							price: resp.price,
							pricePromo: resp.pricePromo,
							recursion: resp.recursion,
							description: resp.description,
							public: resp.public,
							promo: resp.promo,
							starts: resp.promo && resp.starts ? new Date(resp.starts) : undefined,
							ends: resp.promo && resp.ends ? new Date(resp.ends) : undefined,
						}

						addSubscriptionByAdmin(subscription, req, res, next);
					});
				} catch (error) {
					console.error('========================= Begin Error post /admin/subscriptions/add =============================')
					console.error(error)
					console.error('========================= END Error post /admin/subscriptions/add =============================')
				}
			}
		]
	},
	{
		path: "/admin/subscriptions/delete",
		method: "post",
		handler: [
			async (req: Request, res: Response, next: NextFunction) => {
				try {

					checkLoginAdminPost(req, res, next, async (check: any) => {
						if (!check) {
							return;
						}
						const result = await deletSubcriptionForAdmin(req, res, next);


						res.status(200).send({ error: false, data: result ? 'deleted' : 'error' });
					});
				} catch (error) {
					console.error('========================= Begin Error post /admin/subscriptions/delete =============================')
					console.error(error)
					console.error('========================= END Error post /admin/subscriptions/delete =============================')
				}
			}
		]
	},
	{
		path: "/admin/subscriptions/edit",
		method: "post",
		handler: [
			async (req: Request, res: Response, next: NextFunction) => {
				try {
						
				checkLoginAdminPost(req, res, next, async (check: any) => {
					if (!check) {
						return;
					}
					let resp: any = { ...req.body }

					const subscription = {
						name: resp.name,
						role: resp.role,
						price: resp.price,
						pricePromo: resp.pricePromo,
						recursion: resp.recursion,
						description: resp.description,
						public: resp.public,
						promo: resp.promo,
						starts: resp.promo && resp.starts ? new Date(resp.starts) : undefined,
						ends: resp.promo && resp.ends ? new Date(resp.ends) : undefined,
					}


					editSubscriptionByAdmin(subscription, req, res, next);
				});
			} catch (error) {
					console.error('========================= Begin Error post /admin/subscriptions/edit =============================')
					console.error(error)
					console.error('========================= END Error post /admin/subscriptions/edit =============================')
			}
			}
		]
	},
	{
		path: "/admin/subscriptions/role",
		method: "post",
		handler: [
			async (req: Request, res: Response, next: NextFunction) => {
				try {
						
				checkLoginAdminPost(req, res, next, async (check: any) => {
					if (!check) {
						return;
					}
					let resp: any = { ...req.body }

					let user = await getUserById(resp.userId)
					if (user?.role) {

						res.status(200).send({ error: false, data: await getSubscriptionsByRoleForAdmin(user?.role) });

					}
				});
			} catch (error) {
					console.error('========================= Begin Error post /admin/subscriptions/role =============================')
					console.error(error)
					console.error('========================= END Error post /admin/subscriptions/role =============================')
			}
			}
		]
	}
];

