import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import Isemail from "isemail";
import jwt from "jsonwebtoken";
import mongoose, { Types } from "mongoose";
import passport from "passport";
import { IVerifyOptions } from "passport-local";
import "../../config/passport";
import { checkToken } from "../../middleware/checks";
import { User, UserDocument } from "../../models/User";
import { Address } from "../../utils/Address";
import { FileUploader } from "../../utils/fileUploder";
import logger from "../../utils/logger";
import { API_JWT_SECRET } from "../../utils/secrets";
import { addNotification, deleteNotification } from "../notification/NotificationController";

/**
 * Roles:
 *  superadmin
 *  admin
 *  basic
 *  pro
 *  coach
 *  company
 */

/**
* GET /login
* Login page.
*/
// export const getLogin = (req: Request, res: Response) => {
export const getLogin = () => {
    
    return { type: "usersCollection", users: [] };
};

/**
 * POST /login
 * Sign in using email or username and password.
 */
export const postLoginAdminWithPass = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: Error, user: UserDocument, info: { message: string }) => {
        if (err) {
            return res.status(500).send({ error: true, message: 'Authentication error' });
        }
        if (!user) {
            return res.status(401).send({ error: true, message: info.message });
        }
        if (user.role !== 'admin' && user.role !== 'superadmin') {
            return res.status(403).send({ error: true, message: 'Access denied' });
        }

        req.logIn(user, async (err1) => {
            if (err1) {
                return res.status(500).send({ error: true, message: 'Login error' });
            }

            try {
                const token = generateToken(user);
                req.session.user = { _id: user._id, role: user.role, token };

                res.status(200).send({ _id: user._id, role: user.role, token });
            } catch (error) {
                res.status(500).send({ error: true, message: 'Error generating token' });
            }
        });
    })(req, res, next);
};

// Helper function to generate a JWT token
function generateToken(user: UserDocument): string {
    return jwt.sign({ _id: user._id }, API_JWT_SECRET, { expiresIn: '90d' });
}


/**
 * add default super admin
 */

export const addDefaultSuperAdmin = (user: any) => {

    user.username = user.username.toLowerCase();
    User.find({ disabled: false }, (err, users) => {
        if (err) {
            logger.error(err);
        } else {
            if (!users?.length) {
                const supAdmin = new User(user);
                supAdmin.save((err) => {
                    if (err) {
                        logger.error(err);
                    }
                })
            }
        }
    })
};

export const addMockUser = (user: any) => {

    user.username = user.username.toLowerCase();
    User.find({ username: user.username }, (err, users) => {
        if (err) {
            logger.error(err);
        } else {
            if (!users?.length) {
                const theUser = new User(user);
                theUser.save((err) => {
                    if (err) {
                        logger.error(err);
                    }
                })
            }
        }
    })
};


export const getUsersForAdmin = async (req: Request, res: Response, next: NextFunction, cb: Function) => {



    let filtre: any = {
        role: { $ne: 'superadmin' }
    };

    if (req?.query?.role && req?.query?.role !== 'all') {
        filtre.role = req.query.role;
    }


    User.find(filtre, (err, users) => {
        if (err) {
            logger.error(err);
            //return res.status(500).send(err);
            cb(err, undefined);
        } else {
            if (users?.length) {

                //return res.status(200).send({ error: false, data: users });
                cb(undefined, users);
            } else {
                //return res.status(200).send({ error: false, data: [] });
                cb(undefined, []);
            }
        }
    })
};

export const getUsersNotAdmin = async () => {
    return await User.find({ $and: [{ role: { $ne: 'superadmin' } }, { role: { $ne: 'admin' } }] })
};

/**
 * addUserByAdmin
 */
export const addUserByAdmin = async (userInfo: any, req: Request, res: Response, next: NextFunction) => {

    if (!userInfo.email) {
        return res.status(500).send({ error: true, message: "email is required." });
    } else {
        if (!Isemail.validate(userInfo.email)) {
            return res
                .status(500)
                .send({ error: true, message: "Check email format" });
        }
    }

    if (!userInfo.username) {
        return res
            .status(500)
            .send({ error: true, message: "username is required." });
    } else {
        if (userInfo.username.length < 6) {
            return res
                .status(500)
                .send({
                    error: true,
                    message: "username length more than 6 characters",
                });
        }
    }

    if (!userInfo.password) {
        return res
            .status(500)
            .send({ error: true, message: "password is required." });
    } else {
        if (userInfo.password.length < 8) {
            return res
                .status(500)
                .send({
                    error: true,
                    message: "password length more than 8 characters",
                });
        }
    }



    if (userInfo.role !== 'admin') {
        if (userInfo.profile.country) {
            if (userInfo.profile.zipcode) {
                if (!Address.validateZipCode(userInfo.profile.zipcode, userInfo.profile.country)) {
                    return res
                        .status(500)
                        .send({
                            error: true,
                            message: "Please enter a valid postcode / ZIP",
                        });
                }
            } else {
                return res
                    .status(500)
                    .send({
                        error: true,
                        message: "ZipCode is required for this user role",
                    });
            }
        } else {
            return res
                .status(500)
                .send({
                    error: true,
                    message: "Country is required for this user role",
                });
        }
    }

    userInfo.username = userInfo.username.toLowerCase();
    if (userInfo.profile.picture) {
        const matches: any = userInfo.profile.picture.match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/);
        if (matches && matches.length) {
            const imageBuffer = new Buffer(matches[2], 'base64');
            var fileName = Date.now() + userInfo.username + '.' + matches[1].split('/')[1];
            const fileData = await FileUploader.uploadS3(fileName, imageBuffer, matches[1]);
            if (fileData && fileData.ETag) {
                userInfo.profile.picture = 'https://spffiles.s3.ca-central-1.amazonaws.com/' + fileName;
            }
        }

    }


    const user = new User(userInfo);

    return await User.findOne(
        {
            email: userInfo.email ? userInfo.email.toLowerCase() : "",
        },
        (err, existingUser) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (existingUser) {
                return res.status(500).send({ error: true, message: "Account with that email address already exists." });
            }

            
            User.findOne({ username: userInfo.username ? userInfo.username.toLowerCase() : "" }, (err2, existingUser2) => {
                if (err2) {
                    return res.status(500).send(err2);
                }
                if (existingUser2) {
                    return res.status(500).send({ error: true, message: "Account with that username already exists." });
                }

                
                user.disabled = true;
                user.save((err3) => {
                    if (err3) {
                        return res.status(500).send(err3);
                    }


                    return res.status(200).send({ error: false, data: user._id });
                });
            }
            );
        }
    );
};

export const getUserByToken = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: true }, (err: Error, user: UserDocument) => {

        return res.status(200).send({ error: false, data: user });
    })(req, res, next);
};


export const getUserById = async (userId: string) => {
    
    
    
    if (userId.length >= 20 && Types.ObjectId.isValid(userId)) {
        return await User.findOne({
            "_id": userId
        });
    }
    return await User.findOne({
        "username": userId
    });
};

export const updateLocation = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.lat) {
        if (req.body.lng) {
            if (req.body.userId) {
                
                
                
                const location = { type: "Point", coordinates: [req.body.lat, req.body.lng] };
                return res.status(200).send({
                    error: false, data: await User.findOne({ '_id': req.body.userId }, function (err, user) {
                        if (user) {
                            user.profile.location = location;
                            user?.save(function (err: Error) {
                                console.log('====================================');
                                console.log('errr delete');
                                console.log('====================================');
                            })
                        }

                    })
                });
            }
            
            
            
            return res.status(200).send({ error: true, data: 'Error: userId' });
        }

        
        
        
        return res.status(200).send({ error: true, data: 'Error: lng' });
    }

    
    
    
    return res.status(200).send({ error: true, data: 'Error: lat' });
};

export const hasRequest = async (userId: string, user2Id: string) => {
    return await User.findOne({ $or: [{ $and: [{ "profile.requests": userId }, { "_id": user2Id }] }, { $and: [{ "profile.requests": user2Id }, { "_id": userId }] }] });
};

export const isMyRequest = async (userId: string, user2Id: string) => {
    return await User.findOne({ $and: [{ "profile.requests": userId }, { "_id": user2Id }] });
};

export const isHisRequest = async (userId: string, user2Id: string) => {
    
    
    return await User.findOne({ $and: [{ "profile.requests": user2Id }, { "_id": userId }] });
};

export const isFriend = async (userId: string, user2Id: string) => {
    const user1 = await User.findOne({ $and: [{ "profile.friends": userId }, { "_id": user2Id }] })
    const user2 = await User.findOne({ $and: [{ "profile.friends": user2Id }, { "_id": userId }] })
    return user1 && user2 ? true : false
};

export const theRelation = async (userId: string, user2Id: string) => {
    
    
    
    
    
    if (await isFriend(userId, user2Id)) {
        return 'f';
    } else if (await isHisRequest(userId, user2Id)) {
        return 'h';
    } else if (await isMyRequest(userId, user2Id)) {
        return 'm';
    } else {
        return 'n'
    }
};

export const addRequest = async (userId: string, user2Id: string) => {
    
    
    
    

    const user = await hasRequest(userId, user2Id);
    const userOfNot = await User.findOne({ _id: userId });
    if (!user && userId && user2Id) {
        await addNotification({
            text: `${userOfNot?.username}: add friend request`,
            url: `/profile/${userOfNot?.username}`,
            type: 'addFriendRequest',
            user: user2Id
        })
        return await User.update({ _id: user2Id }, { $push: { 'profile.requests': userId } });
    }
    return;
};

export const addFriend = async (userId: string, user2Id: string) => {
    if (userId && user2Id) {
        await cancelRequest(user2Id, userId);
        const userOfNot = await User.findOne({ _id: userId });

        await addNotification({
            text: `${userOfNot?.username}: your add friend request is accepted`,
            url: `/profile/${userOfNot?.username}`,
            type: 'acceptFriend',
            user: user2Id
        })

        await User.update({ _id: user2Id }, { $push: { 'profile.friends': userId } });
        return await User.update({ _id: userId }, { $push: { 'profile.friends': user2Id } });
    }
    return;
};

export const cancelRequest = async (userId: string, user2Id: string) => {
    
    
    
    if (userId && user2Id) {
        return await User.findOne({ '_id': user2Id }, function (err, user) {
            const index = user?.profile?.requests.indexOf(userId);
            
            
            
            if (Number(index) > -1) {
                user?.profile?.requests.splice(Number(index), 1);
            }

            user?.save(async function (err: Error) {
                if (err) {

                    console.log('====================================');
                    console.log('errr delete');
                    console.log('====================================');
                } else {
                    await deleteNotification(user2Id, 'addFriendRequest');
                }
            })
        });
    }
    return;
};

export const removeFriend = async (userId: string, user2Id: string) => {
    
    
    
    if (userId && user2Id) {
        await await User.findOne({ '_id': userId }, function (err, user) {
            const index = user?.profile?.friends.indexOf(user2Id);
            
            
            
            if (Number(index) > -1) {
                user?.profile?.friends.splice(Number(index), 1);
            }

            user?.save(function (err: Error) {
                
                
                
            })
        });
        return await User.findOne({ '_id': user2Id }, function (err, user) {
            const index = user?.profile?.friends.indexOf(userId);
            
            
            
            if (Number(index) > -1) {
                user?.profile?.friends.splice(Number(index), 1);
            }

            user?.save(function (err: Error) {
                console.log('====================================');
                console.log('errr delete');
                console.log('====================================');
            })
        });
    }
    return;
};




export const getFriends = async (userId: string) => {
    
    
    
    let friends: any = [];

    let user = await getUserById(userId)
    if (user) {
        const friendsId = user?.profile.friends;
        let length = 6;
        if (friendsId.length < 6) {
            length = friendsId.length;
        }
        for (let index = 0; index < length; index++) {
            const friendId = friendsId[index];

            friends.push(await getUserById(friendId));
        }
    }
    return friends;
};

export const getMyRequests = async (userId: string) => {
    
    
    
    let requests: any = [];

    let user = await getUserById(userId)
    if (user) {

        const requestsId = user?.profile.requests;

        requestsId?.forEach(friendId => {
            requests.push(getUserById(friendId));
        });

    }
    return requests;
};

export const getRequestsOthers = async (userId: string) => {
    
    
    
    let requests: any = [];

    let users = await User.find({ "profile.requests": userId });

    return users;
};

export const deletUserForAdmin = async (req: Request, res: Response, next: NextFunction) => {
    return User.deleteOne({ _id: req.body.userId }, function (err) {
        if (err) console.log(err);
        console.log("Successful deletion " + req.body.userId);
    });
};

export const editUserByAdmin = async (userInfo: any, req: Request, res: Response, next: NextFunction) => {

    if (!userInfo.email) {
        return res.status(500).send({ error: true, message: "email is required." });
    } else {
        if (!Isemail.validate(userInfo.email)) {
            return res
                .status(500)
                .send({ error: true, message: "Check email format" });
        }
    }

    if (!userInfo.username) {
        return res
            .status(500)
            .send({ error: true, message: "username is required." });
    } else {
        if (userInfo.username.length < 6) {
            return res
                .status(500)
                .send({
                    error: true,
                    message: "username length more than 6 characters",
                });
        }
    }



    if (userInfo.role !== 'admin') {
        if (userInfo.profile.country) {
            if (userInfo.profile.zipcode) {
                if (!Address.validateZipCode(userInfo.profile.zipcode, userInfo.profile.country)) {
                    return res
                        .status(500)
                        .send({
                            error: true,
                            message: "Please enter a valid postcode / ZIP",
                        });
                }
            } else {
                return res
                    .status(500)
                    .send({
                        error: true,
                        message: "ZipCode is required for this user role",
                    });
            }
        } else {
            return res
                .status(500)
                .send({
                    error: true,
                    message: "Country is required for this user role",
                });
        }
    }

    userInfo.username = userInfo.username.toLowerCase();
    if (userInfo.profile.picture) {
        const matches: any = userInfo.profile.picture.match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/);
        if (matches && matches.length) {
            const imageBuffer = new Buffer(matches[2], 'base64');
            var fileName = Date.now() + userInfo.username + '.' + matches[1].split('/')[1];
            const fileData = await FileUploader.uploadS3(fileName, imageBuffer, matches[1]);
            if (fileData && fileData.ETag) {
                userInfo.profile.picture = 'https://spffiles.s3.ca-central-1.amazonaws.com/' + fileName;
            }
        }
    }


    
    return await User.findOne(
        {
            email: userInfo.email ? userInfo.email.toLowerCase() : "",
        },
        (err, existingUser) => {
            if (err) {
                return res.status(500).send(err);
            }
            
            if (existingUser) {
                

                if (existingUser._id != req.body.userId) {
                    return res.status(500).send({ error: true, message: "Account with that email address already exists." });
                }
            }

            User.findOne({ username: userInfo.username ? userInfo.username.toLowerCase() : "" }, async (err2, existingUser2) => {
                if (err2) {
                    return res.status(500).send(err2);
                }
                if (existingUser2) {
                    

                    if (existingUser2._id != req.body.userId) {
                        return res.status(500).send({ error: true, message: "Account with that username already exists." });
                    }

                    const userUpdated = await User.updateOne({ _id: req.body.userId }, { $set: userInfo });

                    


                    return res.status(200).send({ error: false, data: req.body.userId });
                }


            }
            );
        }
    );
};

export const editUserByToken = async (userInfo: any, req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: true }, async (err: Error, user: UserDocument, info: IVerifyOptions) => {
        if (userInfo.photo) {
            const matches: any = userInfo.photo.match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/);
            if (matches && matches.length) {


                const imageBuffer = new Buffer(matches[2], 'base64');
                var fileName = Date.now() + user._id + '.' + matches[1].split('/')[1];
                const fileData = await FileUploader.uploadS3(fileName, imageBuffer, matches[1]);
                if (fileData && fileData.ETag) {
                    userInfo.photo = 'https://spffiles.s3.ca-central-1.amazonaws.com/' + fileName;
                }

            }
        }
        const userUpdated = await User.updateOne({ _id: user._id }, {
            $set: {
                'profile.name': userInfo.name,
                'profile.phone': userInfo.phone,
                'profile.picture': userInfo.photo
            }
        });
        


        return res.status(200).send({ error: false, data: user });
    })(req, res, next);
};

export const editUserFrontByToken = async (userInfo: any, req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: true }, async (err: Error, user: UserDocument, info: IVerifyOptions) => {

        if (userInfo.country) {
            if (userInfo.zipcode) {
                if (!Address.validateZipCode(userInfo.zipcode, userInfo.country)) {
                    return res
                        .status(500)
                        .send({
                            error: true,
                            message: "Please enter a valid postcode / ZIP",
                        });
                }
            } else {
                return res
                    .status(500)
                    .send({
                        error: true,
                        message: "ZipCode is required for this user role",
                    });
            }
        } else {
            return res
                .status(500)
                .send({
                    error: true,
                    message: "Country is required for this user role",
                });
        }
        if (userInfo.photo) {
            const matches: any = userInfo.photo.match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/);
            if (matches && matches.length) {
                const imageBuffer = new Buffer(matches[2], 'base64');
                var fileName = Date.now() + user._id + '.' + matches[1].split('/')[1];
                const fileData = await FileUploader.uploadS3(fileName, imageBuffer, matches[1]);
                if (fileData && fileData.ETag) {
                    userInfo.photo = 'https://spffiles.s3.ca-central-1.amazonaws.com/' + fileName;
                }
            }
        }
        let userProfile:any = {
            'profile.name': userInfo.name,
            'profile.phone': userInfo.phone,
            'profile.picture': userInfo.photo,
            'profile.gender': userInfo.gender,
            'profile.age': userInfo.age,
            'profile.about': userInfo.about,
            'profile.country': userInfo.country,
            'profile.zipcode': userInfo.zipcode,
            'profile.state': userInfo.state,
            'profile.city': userInfo.city,
            'profile.weight': userInfo.weight,
            'profile.speed': userInfo.speed,
            'profile.time': userInfo.time,
            'profile.address': userInfo.address,
            'profile.nbrEmp': userInfo.nbrEmp,
            'profile.tax': userInfo.tax
        }

        if (userInfo.location) {
            userProfile['profile.location'] = userInfo.location;
        }


        const userUpdated = await User.updateOne({ _id: user._id }, {
            $set: userProfile
        });
        


        return res.status(200).send({ error: false, data: user });
    })(req, res, next);
};

export const editUserPasswordByToken = async (userInfo: any, req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: true }, async (err: Error, user: UserDocument, info: IVerifyOptions) => {

        if (err) {
            res.status(500).send(err);
            return JSON.stringify(err);
        }

        if (!user) {
            res.status(200).send({ error: true, message: info.message });
            return JSON.stringify({ error: true, message: info.message });
        }

        user.comparePassword(userInfo.password, async (err: Error, isMatch: boolean) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (isMatch) {

                if (!userInfo.newPassword) {
                    return res
                        .status(500)
                        .send({ error: true, message: "password is required." });
                } else {
                    if (userInfo.newPassword.length < 8) {
                        return res
                            .status(500)
                            .send({
                                error: true,
                                message: "password length more than 8 characters",
                            });
                    }
                }

                const userUpdated = await User.updateOne({ _id: user._id }, { $set: { password: userInfo.newPassword } });
                return res.status(200).send({ error: false, data: user });
            }
            return res.status(500).send({ error: true, message: "Old password invalid" });
        });


    })(req, res, next);
};


/**
 * registerUser
 */
export const registerUser = async (userInfo: any, req: Request, res: Response, next: NextFunction) => {

    if (!userInfo.email) {
        return res.status(500).send({ error: true, message: "email is required." });
    } else {
        if (!Isemail.validate(userInfo.email)) {
            return res
                .status(500)
                .send({ error: true, message: "Check email format" });
        }
    }

    if (!userInfo.username) {
        return res
            .status(500)
            .send({ error: true, message: "username is required." });
    } else {
        if (userInfo.username.length < 6) {
            return res
                .status(500)
                .send({
                    error: true,
                    message: "username length more than 6 characters",
                });
        }
    }

    if (!userInfo.password) {
        return res
            .status(500)
            .send({ error: true, message: "password is required." });
    } else {
        if (userInfo.password.length < 8) {
            return res
                .status(500)
                .send({
                    error: true,
                    message: "password length more than 8 characters",
                });
        }
    }

    if (userInfo.role !== 'admin') {
        if (userInfo.profile.country) {
            if (userInfo.profile.zipcode) {
                if (!Address.validateZipCode(userInfo.profile.zipcode, userInfo.profile.country)) {
                    return res
                        .status(500)
                        .send({
                            error: true,
                            message: "Please enter a valid postcode / ZIP",
                        });
                }
            } else {
                return res
                    .status(500)
                    .send({
                        error: true,
                        message: "ZipCode is required for this user role",
                    });
            }
        } else {
            return res
                .status(500)
                .send({
                    error: true,
                    message: "Country is required for this user role",
                });
        }
    }

    userInfo.username = userInfo.username.toLowerCase();
    if (userInfo.profile.picture) {
        const matches: any = userInfo.profile.picture.match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/);
        if (matches && matches.length) {
            const imageBuffer = new Buffer(matches[2], 'base64');
            var fileName = Date.now() + userInfo.username + '.' + matches[1].split('/')[1];
            const fileData = await FileUploader.uploadS3(fileName, imageBuffer, matches[1]);
            if (fileData && fileData.ETag) {
                userInfo.profile.picture = 'https://spffiles.s3.ca-central-1.amazonaws.com/' + fileName;
            }
        }
    }

    const user = new User(userInfo);

    return await User.findOne(
        {
            email: userInfo.email ? userInfo.email.toLowerCase() : "",
        },
        (err, existingUser) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (existingUser) {
                return res.status(500).send({ error: true, message: "Account with that email address already exists." });
            }

            
            User.findOne({ username: userInfo.username ? userInfo.username.toLowerCase() : "" }, (err2, existingUser2) => {
                if (err2) {
                    return res.status(500).send(err2);
                }
                if (existingUser2) {
                    return res.status(500).send({ error: true, message: "Account with that username already exists." });
                }

                
                user.disabled = false;
                user.save((err3) => {
                    if (err3) {
                        return res.status(500).send(err3);
                    }

                    req.login(user, (err4) => {
                        
                        if (err4) {
                            return res
                                .status(500)
                                .send(err4);
                        }

                        const token = jwt.sign({
                            _id: user._id
                        }, API_JWT_SECRET, { expiresIn: '90d' });
                        user
                            .tokens
                            .push({ accessToken: token, kind: 'jwt' });
                        
                        user.save();
                        let loggedInUser = {
                            _id: user._id,
                            token: user.tokens[0]
                                ? user.tokens[0].accessToken
                                : null,
                            username: user.username
                        }
                        if (req.session) {
                            req.session.user = loggedInUser;
                            req.session.save((e) => {
                                console.log(req.session?.user);
                                console.log('====================================');
                                console.log('e', e);
                                console.log('====================================');
                            });
                        }

                        return res
                            .status(200)
                            .send(loggedInUser);
                    });


                });
            }
            );
        }
    );
};


export const getNearByUsers = async (req: Request, res: Response, next: NextFunction) => {
    

    let query: any = {};
    if (req.body.search) {
        let re = new RegExp(req.body.search);
        query["$or"] = [{ "username": { $regex: re, $options: 'i' } }, { "profile.name": { $regex: re, $options: 'i' } }];
    }

    query._id = { $ne: req.body.id };
    query["$and"] = [{ role: { $ne: 'superadmin' } }, { role: { $ne: 'admin' } }];

    if (req.body.friendsOnly) {
        /** friendsOnly */

        const me = await User.findOne({ _id: req.body.id });
        if (me && me.profile && me.profile.friends) {
            query._id = { $in: me.profile.friends };
        }
    }


    /*   if (req.body.lat && req.body.long) {
           let radius = 10000000;
           
           if (req.body.radius) {
               radius = req.body.radius * 1000;
           }
   
           const R2D = function(rad:any) {
               return rad / Math.PI * 180;
           };
           
           
           
           query["profile.location"] = {
               $near: {
                   $maxDistance: radius,
                   $geometry: {
                       type: "Point",
                       coordinates: [R2D(req.body.lat), R2D(req.body.long)]
                   }
               }
           };
       }*/


    if (req.body.time) {
        query["profile.time"] = req.body.time;
    }

    if (req.body.speed) {
        query["profile.speed"] = req.body.speed;
    }
    
    const users = await User.find(query);
    let usersFiltred: any = [];
    users.forEach((user) => {
        
        
        
        
        const distance = Address.calcCrow(req.body.lat, req.body.long, user.profile.location.coordinates[0], user.profile.location.coordinates[1]);
        
        
        let radius = 0;
        if (req.body.radius) {
            radius = req.body.radius;
        }
        if (distance <= radius) {
            user.distance = distance
            usersFiltred.push(user);
        }
    })
    return res
        .status(200)
        .send({ error: false, data: usersFiltred });

};

export const getUsersByZipCode = async (req: Request, res: Response, next: NextFunction) => {
    let query: any = {};
    if (req.body.search) {
        let re = new RegExp(req.body.search);
        query["$or"] = [{ "username": { $regex: re, $options: 'i' } }, { "profile.name": { $regex: re, $options: 'i' } }];
    }

    query._id = { $ne: req.body.id };
    query["$and"] = [{ role: { $ne: 'superadmin' } }, { role: { $ne: 'admin' } }];

    if (req.body.friendsOnly) {
        /** friendsOnly */

        const me = await User.findOne({ _id: req.body.id });
        if (me && me.profile && me.profile.friends) {
            query._id = { $in: me.profile.friends };
        }
    }




    if (req.body.zipcode) {
        query["profile.zipcode"] = { $regex: new RegExp(req.body.zipcode.split(' ').join(''), "i") };
    }




    if (req.body.time) {
        query["profile.time"] = req.body.time;
    }

    if (req.body.speed) {
        query["profile.speed"] = req.body.speed;
    }
    
    
    
    const users = await User.find(query);
    let usersFiltred: any = [];
    users.forEach((user) => {
        
        
        
        
        const distance = Address.calcCrow(req.body.lat, req.body.long, user?.profile.location?.coordinates[0], user.profile.location?.coordinates[1]);
        user.distance = distance
        usersFiltred.push(user);
    })
    usersFiltred.sort((a: any, b: any) => (a.distance > b.distance) ? 1 : ((b.distance > a.distance) ? -1 : 0));

    return res
        .status(200)
        .send({ error: false, data: usersFiltred });
};
/**
 * POST /login
 * Sign in using email or username and password.
 */
export const postLoginWithPass = (req: Request, res: Response, next: NextFunction) => {
    

    passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {

        

        if (err) {
            return res
                .status(500)
                .send(err);
        }
        if (!user) {
            return res
                .status(200)
                .send({ error: true, message: info.message });
        }
        if (user.role == 'admin' || user.role == 'superadmin') {
            return res
                .status(500)
                .send({ error: true, message: 'isadmin' });
        }
        req.logIn(user, (err1) => {

            if (err1) {
                res
                    .status(500)
                    .send(err1);
            }
            //req.flash("success","Success! You are logged in.");

            let tokenCheck: any;

            try {
                tokenCheck = checkToken(user.tokens[0].accessToken);
            } catch (error) {
                tokenCheck = '';
            }

            if (!tokenCheck._id) {
                user
                    .tokens
                    .splice(0, 1);
                const token = jwt.sign({
                    _id: user._id
                }, API_JWT_SECRET, { expiresIn: '90d' });
                user
                    .tokens
                    .push({ accessToken: token, kind: 'jwt' });
            }

            let loggedInUser = {
                _id: user._id,
                token: user.tokens[0]
                    ? user.tokens[0].accessToken
                    : null,
                username: user.username,
                lat: user?.profile?.location?.coordinates[0],
                lng: user?.profile?.location?.coordinates[1]
            }
            if (req.session) {
                req.session.user = loggedInUser;
                req.session.save((e) => {
                    console.log(req.session?.user);
                    console.log('====================================');
                    console.log('e', e);
                    console.log('====================================');
                });
            }

            return res
                .status(200)
                .send(loggedInUser);
        });
    })(req, res, next);
};