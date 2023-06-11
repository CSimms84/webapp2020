import { NextFunction, Request, Response } from "express";
import { checkLoginAdmin, checkLoginAdminPost } from "../../middleware/checksAdmin";
import { getUsersNotAdmin } from "../user/UserController";
import { addCouponByAdmin, deletCouponForAdmin, editCouponByAdmin, getDiscountForAdmin, getDiscountsForAdmin } from "./DiscountController";
import moment from "moment";
import { getTimeZone } from "../../models/Timezone";

export default [
  {
    path: "/admin/coupons",
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

          if (data.data.action == "addCoupon" || data.data.action == "editCoupon") {
            data.data.users = await getUsersNotAdmin();
          }


          if (req?.query?.discountId) {
            data.data.discountId = req.query.discountId;

            if (data.data.action == "showCoupon") {
              data.data.discount = await getDiscountForAdmin(data.data.discountId);
              if (data.data.discount) {
                data.data.discount.sstartTime = data.data.discount.startTime ? moment(data.data.discount.startTime).utcOffset(timeZone ? timeZone : '').format("MM-DD-YYYY") : '';
                data.data.discount.sdeadline = data.data.discount.deadline ? moment(data.data.discount.deadline).utcOffset(timeZone ? timeZone : '').format("MM-DD-YYYY") : '';
              }

            }
          }


          getDiscountsForAdmin(req, res, next, (err: any, discounts: any) => {


            data.data.discounts = [...discounts];



            data.data.discounts.forEach((coupon: any) => {
              coupon.sstartTime = coupon.startTime ? moment(coupon.startTime).utcOffset(timeZone ? timeZone : '').format("MM-DD-YYYY") : '';
              coupon.sdeadline = coupon.deadline ? moment(coupon.deadline).utcOffset(timeZone ? timeZone : '').format("MM-DD-YYYY") : '';




            });

            if (err) {
              res.render('500');
            } else {
              return res.render('admin/subscriptions/discounts', { ...data });
            }
          });
        } catch (err) {
          console.error('========================= Begin Error get /admin/coupons =============================')
          console.error(err)
          console.error('========================= END Error get /admin/coupons =============================')
        }
      }
    ]
  },
  {
    path: "/admin/coupons/add",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          checkLoginAdminPost(req, res, next, async (check: any) => {
            if (!check) {
              return;
            }
            let resp: any = { ...req.body };

            addCouponByAdmin(resp, req, res, next);
          });
        } catch (err) {
          console.error('========================= Begin Error post /admin/coupons/add =============================')
          console.error(err)
          console.error('========================= END Error post /admin/coupons/add =============================')
        }
      }
    ]
  },
  {
    path: "/admin/coupons/get",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          checkLoginAdminPost(req, res, next, async (check: any) => {
            if (!check) {
              return;
            }

            if (req?.body?.discountId) {


              return res.status(200).send({ error: false, data: await getDiscountForAdmin(req?.body?.discountId) });

            } else {
              return res
                .status(500)
                .send({ error: true, message: "No discountId" });
            }
          });
        } catch (err) {
          console.error('========================= Begin Error post /admin/coupons/get =============================')
          console.error(err)
          console.error('========================= END Error post /admin/coupons/get =============================')
        }
      }
    ]
  },
  {
    path: "/admin/coupons/delete",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          checkLoginAdminPost(req, res, next, async (check: any) => {
            if (!check) {
              return;
            }
            const result = await deletCouponForAdmin(req, res, next);


            res.status(200).send({ error: false, data: result ? 'deleted' : 'error' });
          });
        } catch (err) {
          console.error('========================= Begin Error post /admin/coupons/delete =============================')
          console.error(err)
          console.error('========================= END Error post /admin/coupons/delete =============================')
        }
      }
    ]
  },
  {
    path: "/admin/coupons/edit",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {

        try {
          checkLoginAdminPost(req, res, next, async (check: any) => {
            if (!check) {
              return;
            }
            let resp: any = { ...req.body }

            const coupon = {
              code: resp.code,
              type: resp.type,
              price: resp.price,
              user: resp.user,
              product: resp.product,
              maxUse: resp.maxUse,
              startTime: resp.startTime ? new Date(resp.startTime) : undefined,
              deadline: resp.deadline ? new Date(resp.deadline) : undefined,
            }


            editCouponByAdmin(coupon, req, res, next);
          });
        } catch (err) {
          console.error('========================= Begin Error post /admin/coupons/edit =============================')
          console.error(err)
          console.error('========================= END Error post /admin/coupons/edit =============================')
        }
      }
    ]
  },
];

