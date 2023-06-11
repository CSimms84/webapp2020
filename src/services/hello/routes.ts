import { Request, Response } from "express";
import { setTimeZone } from "../../models/Timezone";

export default [
  {
    path: "/",
    method: "get",
    handler: [
       (req: Request, res: Response) => {
         res.redirect('newsfeed');
      //  res.render('index');
      }
    ]
  },
  {
    path: "/500",
    method: "get",
    handler: [
       (req: Request, res: Response) => {
      res.render('500');
      }
    ]
  },
  {
    path: "/setTimezone",
    method: "post",
    handler: [
       (req: Request, res: Response) => {
        setTimeZone(req,res);
      }
    ]
  }
];

