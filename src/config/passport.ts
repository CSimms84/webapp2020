
import _ from "lodash";
import passport from "passport";
import passportFacebook from "passport-facebook";
import passportJWT, { ExtractJwt, Strategy } from 'passport-jwt';
import passportLocal from "passport-local";
import {API_JWT_SECRET} from "../utils/secrets";
import {Request, Response, NextFunction} from "express";
import {User, UserDocument} from "../models/User";

/* try {
    console.log('ioSocket.use', ioSocket.use);
} catch (error) {
    console.log('error', error);
} */

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;

passport.serializeUser < any,
any > ((user, done) => {
    done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({
    usernameField: "username"
}, (username, password, done) => {
    User.findOne({
        $or:[ {'email':username.toLowerCase()}, {'username':username.toLowerCase()} ]
    }, (err, user : any) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(undefined, false, {message: `Email or Username ${username} not found.`});
        }
        user.comparePassword(password, (err : Error, isMatch : boolean) => {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(undefined, user);
            }
            return done(undefined, false, {message: "Invalid email or password."});
        });
    });
}));




/*  */ 



const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:API_JWT_SECRET
};

passport.use('jwt',new Strategy(opts, async (jwtPayload:any, done:any) => {
	console.log('jwtPayload',jwtPayload);
	try {
		/* const user = await models.user.findOne({
			where: {
				email: jwtPayload.email,
			},
		});

		if (user) {
			return done(null, user);
        } */
        
        const user = await User.findOne({
            _id: jwtPayload._id
        }, (err, user : any) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(undefined, false, {message: `Email ${jwtPayload._id} not found.`});
            }
            console.log(`Email ${jwtPayload._id} .`);
            
            return done(null, user);
        });
if (!user) {
		return done(null, false);
}
	} catch (e) {
		done(e);
	}
}));

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
 passport.serializeUser((user, cb) => {
	cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
	models.user.findOne(id, (err, user) => {
		cb(err, user);
	});
});

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with Facebook.
 */
/* passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: [
        "name", "email", "link", "locale", "timezone"
    ],
    passReqToCallback: true
}, (req : any, accessToken, refreshToken, profile, done) => {
    if (req.user) {
        User.findOne({
            facebook: profile.id
        }, (err, existingUser) => {
            if (err) {
                return done(err);
            }
            if (existingUser) {
                req.flash("errors", {
                    message: "There is already a Facebook account that belongs to you. Sign in with that accou" +
                            "nt or delete it, then link it with your current account."
                });
                done(err);
            } else {
                User.findById(req.user.id, (err, user : any) => {
                    if (err) {
                        return done(err);
                    }
                    user.facebook = profile.id;
                    user
                        .tokens
                        .push({kind: "facebook", accessToken});
                    user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
                    user.profile.gender = user.profile.gender || profile._json.gender;
                    user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
                    user.save((err : Error) => {
                        req.flash("info", {message: "Facebook account has been linked."});
                        done(err, user);
                    });
                });
            }
        });
    } else {
        User.findOne({
            facebook: profile.id
        }, (err, existingUser) => {
            if (err) {
                return done(err);
            }
            if (existingUser) {
                return done(undefined, existingUser);
            }
            User.findOne({
                email: profile._json.email
            }, (err, existingEmailUser) => {
                if (err) {
                    return done(err);
                }
                if (existingEmailUser) {
                    req.flash("errors", {
                        message: "There is already an account using this email address. Sign in to that account an" +
                                "d link it with Facebook manually from Account Settings."
                    });
                    done(err);
                } else {
                    const user : any = new User();
                    user.email = profile._json.email;
                    user.facebook = profile.id;
                    user
                        .tokens
                        .push({kind: "facebook", accessToken});
                    user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
                    user.profile.gender = profile._json.gender;
                    user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
                    user.profile.location = (profile._json.location)
                        ? profile._json.location.name
                        : "";
                    user.save((err : Error) => {
                        done(err, user);
                    });
                }
            });
        });
    }
}));
 */
/**
 * Login Required middleware.
 */
export const isAuthenticated = (req : Request, res : Response, next : NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

/**
 * Authorization Required middleware.
 */
export const isAuthorized = (req : Request, res : Response, next : NextFunction) => {
    const provider = req
        .path
        .split("/")
        .slice(-1)[0];

    const user = req.user as UserDocument;
    if (_.find(user.tokens, {kind: provider})) {
        next();
    } else {
        res.redirect(`/auth/${provider}`);
    }
};