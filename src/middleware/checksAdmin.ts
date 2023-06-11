import { Request, Response, NextFunction } from "express";
import { HTTP400Error } from "../utils/httpErrors";
import passport = require("passport");
import { UserDocument, User } from "../models/User";
import { IVerifyOptions } from "passport-local";
import jwt from "jsonwebtoken";
import { API_JWT_SECRET } from "../utils/secrets";

export const checkLoginAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  console.log('user checkLoginAdmin', req.session?.user);
  if (req.session?.user) {
    let user = req.session?.user;

    if (user.role != 'admin' && user.role != 'superadmin') {
      return false;
    }
    return true;
  } else {
    return false;
  }
};


export const checkLoginAdminPost = (
  req: Request,
  res: Response,
  next: NextFunction,
  cb: Function
) => {
  try {
    checkToken(req.headers['authorization']);
    console.log('login post', req.headers['authorization']);
    passport.authenticate("jwt", { session: true }, (err: Error, user: UserDocument, info: IVerifyOptions) => {

      if (err) {
        console.log('error checkAdmin', err);
        //res.status(500).send(err);
        return cb(false);
      }

      if (!user) {
        
        console.log('error checkAdmin1');
        console.log('tag35 checkAdmin1', 'tong', { error: true, message: info.message })
       // res.status(200).send({ error: true, message: info.message });
    return cb(false);
      }
      else {
        console.log('login post');


        if (user.role != 'admin' && user.role != 'superadmin') {
          console.log('tag34', 'tong', { error: true, message: 'not admin' })
         // res.status(200).send({ error: true, message: 'not admin' });
          return cb(false);
        }

        console.log('tag', 'tong')
        // next();
        return cb(true);
      }

    })(req, res, next);
  } catch (error) {
    console.log('tag4', 'ss', { error: true, message: 'Token expired' })
    //res.status(500).send({ error: true, message: 'Token expired' });
    return cb(false);
  }
};

export const checkToken = (
  token: string = ''
) => {
  console.log('verifToken authorization', token);
  let bearerToken: string = token;
  if (bearerToken.toLocaleLowerCase().includes("bearer")) {
    bearerToken = bearerToken.split(' ')[1];
  }

  console.log('bearerToken', bearerToken);
  let verifToken = jwt.verify(bearerToken, API_JWT_SECRET, { ignoreExpiration: false });
  console.log('verifToken', verifToken);
  return verifToken;
};
