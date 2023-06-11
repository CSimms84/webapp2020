import { Request, Response, NextFunction } from "express";
import { HTTP400Error } from "../utils/httpErrors";
import passport = require("passport");
import { UserDocument, User } from "../models/User";
import { IVerifyOptions } from "passport-local";
import jwt from "jsonwebtoken";
import { API_JWT_SECRET } from "../utils/secrets";

export const checkLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  // console.log('user', req.session?.user);
  if (req.session?.user) {
    let user = req.session?.user;

    if (user.role == 'admin' || user.role == 'superadmin') {
      return false;
    }
    return true;
  } else {
    return false;
  }
};

export const checkLoginPost = (
  req: Request,
  res: Response,
  next: NextFunction,
  cb:Function
) => {
  console.log('====================================');
  console.log("req.headers['authorization']", req.headers['authorization']);
  console.log('====================================');
  try {
    checkToken(req.headers['authorization']);
    return passport.authenticate("jwt", { session: true }, (err: Error, user: UserDocument, info: IVerifyOptions) => {
      console.log('tag1', 'tong')
      if (err) {
        console.log('error check', err);
        //res.status(500).send(err);
        return cb(false);
      }
      console.log('tag2', 'tong')
      console.log('user', user)
      if (!user) {
        console.log('error check1');
        console.log('tag35', 'tong', { error: true, message: info.message })
       // res.status(200).send({ error: true, message: info.message });
    return cb(false);
      } else {
        if (user.role == 'admin' || user.role == 'superadmin') {
          console.log('tag34', 'tong', { error: true, message: 'the user is admin' })
         //  res.status(200).send({ error: true, message: 'the user is admin' });
          return cb(false);
        }

        console.log('tag3', 'tong')
        //next();
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
  //console.log('verifToken authorization', token);
  let bearerToken: string = token;
  if (bearerToken.toLocaleLowerCase().includes("bearer")) {
    console.log('bearerToken', bearerToken);
    bearerToken = bearerToken.split(' ')[1];
  }

      // console.log('bearerToken', bearerToken);
  let verifToken = jwt.verify(bearerToken, API_JWT_SECRET, { ignoreExpiration: false });
  console.log('verifToken', verifToken);
  return verifToken;
};
