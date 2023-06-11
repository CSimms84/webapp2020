import bluebird from "bluebird";
import bodyParser from "body-parser";
import compression from "compression"; // compresses requests
import mongo from "connect-mongo";
import express from "express";
import flash from "express-flash";
import session from "express-session";
import http from "http";
import lusca from "lusca";
import mongoose from "mongoose";
import passport from "passport";
import socketIO from 'socket.io';
import { MockUsers } from "./config/users";
import middleware from "./middleware";
import errorHandlers from "./middleware/errorHandlers";
import routes from "./services";
import { addDefaultSuperAdmin } from "./services/user/UserController";
import { applyMiddleware, applyRoutes } from "./utils";
import { FileUploader } from "./utils/fileUploder";
import logger from "./utils/logger";
import { ENVIRONMENT, MONGODB_URI, SESSION_SECRET, UPLOADFOLDER } from "./utils/secrets";
// API keys and Passport configuration import * as passportConfig from
// "./config/passport";
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

const MongoStore = mongo(session);
const mongoUrl: any = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        logger.info("connected to prod db");
    })
    .catch((err: any) => {
        logger.error("MongoDB connection error. Please make sure MongoDB is running. " + err);
        process.exit();
    });

    mongoose.set('useUnifiedTopology', true);

process.on("uncaughtException", e => {
    console.log(e);
    process.exit(1);
});

process.on("unhandledRejection", e => {
    console.log(e);
    process.exit(1);
});
const router = express();

router.set('view engine', 'ejs');
router.set('views', './src/views');



router.use('/assets', express.static(__dirname + '/assets'));
router.use('/public', express.static(__dirname + '/public'));


router.use(compression());
router.use(bodyParser.json({ limit: '500mb' }));
router.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
router.use(flash());
const sessionSecret: any = SESSION_SECRET || '';

const sessionOptions = {
    resave: true,
    saveUninitialized: true,
    secret: sessionSecret,
    cookie: {
        //  secure: true
    },
    store: new MongoStore({ url: mongoUrl, autoReconnect: true })
}
router.use(session(sessionOptions));

router.use(passport.initialize());
router.use(passport.session());
router.use(lusca.xframe("SAMEORIGIN"));
router.use(lusca.xssProtection(true));
applyMiddleware(middleware, router);
applyRoutes(routes, router);
applyMiddleware(errorHandlers, router);


const {
    PORT = 3001
} = process.env;
const server = http.createServer(router);

export const ioSocket: socketIO.Server = socketIO(server);
// prod socket
//ioSocket.adapter(pm2Adapter());

ioSocket.on('connection', socket => {
    socket.on('disconnecting', () => {
        console.log(socket.rooms); 
    });

    socket.on('notifications', function (userId) {
        
        console.log('====================================');
        console.log('userId---', userId);
        console.log('====================================');
        
        socket.join(userId);
    });

    socket.on('disconnect', () => {
        // socket.rooms.size === 0
    });
});

server.listen(PORT, () => {

    addDefaultSuperAdmin({
        email: 'charlessimms84@gmail.com',
        username: 'sadminEllipsis',
        password: 'xxxxxxxx123',
        role: 'superadmin'
    });
    FileUploader.createFirstFolder(UPLOADFOLDER);

    if (!prod) {
        MockUsers();
    }

});

/* If they don't pay by the 15th, remove all access to repo and change
copyrights to Charles Simms.
 */

export default router;