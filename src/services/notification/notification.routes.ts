import { NextFunction, Request, Response } from "express";
import { checkLoginPost } from "../../middleware/checks";
import { getNotifications, getNotificationsNumber } from "./NotificationController";

export default [
  {
    path: "/getNotifications",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {

       try {
          checkLoginPost(req, res, next, async (check: any) => {
            if (!check) {
              return res.status(500).send({ error: true, message:'not authenticated'});
            }
  
            return res.status(200).send({ error: false, data: await getNotifications(req,res,next)}); 
          });
       } catch (err) {
        console.error('========================= Begin Error post /getNotifications =============================')
        console.error(err)
        console.error('========================= END Error post /getNotifications =============================')
       }
      }
    ]
  },
  {
    path: "/getNotificationsNumber",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {

       try {
          checkLoginPost(req, res, next, async (check: any) => {
            if (!check) {
              return res.status(500).send({ error: true, message:'not authenticated'});
            }
  
            return res.status(200).send({ error: false, data: await getNotificationsNumber(req,res,next)}); 
          });
       } catch (err) {
        console.error('========================= Begin Error post /getNotificationsNumber =============================')
        console.error(err)
        console.error('========================= END Error post /getNotificationsNumber =============================')
       }
      }
    ]
  }
];

