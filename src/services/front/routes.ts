import { NextFunction, Request, Response } from "express";
import { checkLogin } from "../../middleware/checks";
import countries from "../../utils/countries";
import { getPost, getUserAndFriendsPosts, getUserPosts } from "../post/PostController";
import { getFriends, getUserById, isFriend, isHisRequest, isMyRequest, theRelation } from "../user/UserController";
import { getPlaces } from "./places";
import moment from "moment";
import { getTimeZone } from "../../models/Timezone";
import { checkRoom, getRoom, getRooms } from "../message/MessagesController";

/* Copyright Charlie Simms 2023 */
export default [
  {
    path: "/newsfeed",
    method: "get",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const isLoggedIn = checkLogin(req, res, next);
        if (!isLoggedIn) {
          return res.redirect('/login');
        }

        let data: any = {};
        if (req.session && req.session.user) {
          const timeZone = (await getTimeZone(req.session?.user._id))?.timezone;
          
          
          
          data.posts = (await getUserAndFriendsPosts(req.session.user._id)).map( (post: any) => {
            let thePost = post;
            thePost.sdate = moment(thePost.createdAt).utcOffset(timeZone ? timeZone : '').format('llll');
            thePost.liked = thePost.likes.indexOf(req.session?.user._id) > -1;
            thePost.postOwner = thePost.userId == req.session?.user._id;
            /* thePost.comments?.map(async (comment:any)=>{
              const commentUser = await getUserById(comment.userId);
              comment.user = commentUser;
              comment.liked = comment.likes.indexOf(req.session?.user._id)>-1;
              comment.sdate = moment(comment.createdAt).utcOffset(timeZone?timeZone:'').format('llll');
              comment.commentOwner = comment.userId == req.session?.user._id;

              return comment;
            });*/
            // thePost.comments.splice(2);
            return thePost;
          });
          for (let index = 0; index < data.posts.length; index++) {
            
            data.posts[index].theOwner = await getUserById(data.posts[index].userId);
            
          }
          data.user = await getUserById(req.session.user._id);
        }


        res.render('front/newsfeed',{data});
      }
    ]
  },
  {
    path: "/settings",
    method: "get",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const isLoggedIn = checkLogin(req, res, next);
        if (!isLoggedIn) {
          return res.redirect('/login');
        }
        const countriees = countries.countries;
        res.render('front/settings',{countriees});
      }
    ]
  },
  {
    path: "/login",
    method: "get",
    handler: [
      (req: Request, res: Response, next: NextFunction) => {
        const isLoggedIn = checkLogin(req, res, next);
        if (isLoggedIn) {
          return res.redirect('/newsfeed');
        }

        res.render('front/login');
      }
    ]
  },
  {
    path: "/register",
    method: "get",
    handler: [
      (req: Request, res: Response, next: NextFunction) => {
        const isLoggedIn = checkLogin(req, res, next);
        if (isLoggedIn) {
          return res.redirect('/newsfeed');
        }

        let countriesList: any = countries.countries;

        res.render('front/register', { countries: countriesList });
      }
    ]
  },
  {
    path: "/find-friends",
    method: "get",
    handler: [
      (req: Request, res: Response, next: NextFunction) => {
        const isLoggedIn = checkLogin(req, res, next);
        
        
        
        if (!isLoggedIn) {
          return res.redirect('/login');
        }

        res.render('front/findfriends');
      }
    ]
  },
  {
    path: "/profile",
    method: "get",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const isLoggedIn = checkLogin(req, res, next);
        
        
        
        if (!isLoggedIn) {
          return res.redirect('/login');
        }
        let data: any = {};
        if (req.session && req.session.user) {
          const timeZone = (await getTimeZone(req.session?.user._id))?.timezone;
          
          
          
          data.posts = (await getUserPosts(req.session.user._id)).map((post: any) => {
            let thePost = post;
            thePost.sdate = moment(thePost.createdAt).utcOffset(timeZone ? timeZone : '').format('llll');
            thePost.liked = thePost.likes.indexOf(req.session?.user._id) > -1;
            thePost.postOwner = thePost.userId == req.session?.user._id;
            /*thePost.comments?.map(async (comment:any)=>{
              const commentUser = await getUserById(comment.userId);
              comment.user = commentUser;
              comment.liked = comment.likes.indexOf(req.session?.user._id)>-1;
              comment.sdate = moment(comment.createdAt).utcOffset(timeZone?timeZone:'').format('llll');
              comment.commentOwner = comment.userId == req.session?.user._id;

              return comment;
            });*/
            // thePost.comments.splice(2);
            return thePost;
          });
          data.currentUser = await getUserById(req.session.user._id);
          data.user = await getUserById(req.session.user._id);
          data.isMine = true;
          data.friends = await getFriends(req.session.user._id);
          
          
          
        }
        res.render('front/profile', { data });
      }
    ]
  },
  {
    path: "/profile/:id",
    method: "get",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const isLoggedIn = checkLogin(req, res, next);

        let respP: any = { ...req.params }
        
        
        
        if (!isLoggedIn) {
          return res.redirect('/login');
        }
        let data: any = {};

        const theUserById = await getUserById(respP.id);
        const theCurrentUser = await getUserById(req?.session?.user._id);

        if (theCurrentUser?._id.toString() == theUserById?._id.toString()) {
          return res.redirect('/profile');
        }

        
        
        

        
        
        

        if (!theCurrentUser || !theUserById) {
          return res.render('404');
        }

        const timeZone = (await getTimeZone(req.session?.user._id))?.timezone;
        
        
        
        data.posts = (await getUserPosts(theUserById?._id.toString())).map((post: any) => {
          let thePost = post;
          thePost.sdate = moment(thePost.createdAt).utcOffset(timeZone ? timeZone : '').format('llll');
          thePost.liked = thePost.likes.indexOf(req.session?.user._id) > -1;
          thePost.postOwner = thePost.userId == req.session?.user._id;
          /*thePost.comments?.map(async (comment:any)=>{
            const commentUser = await getUserById(comment.userId);
            comment.user = commentUser;
            comment.liked = comment.likes.indexOf(req.session?.user._id)>-1;
            comment.sdate = moment(comment.createdAt).utcOffset(timeZone?timeZone:'').format('llll');
            comment.commentOwner = comment.userId == req.session?.user._id;

            return comment;
          });*/
          // thePost.comments.splice(2);
          return thePost;
        });

        data.isMine = false;

        data.rel = await theRelation(req.session?.user._id.toString(),theUserById._id.toString());

        let room = await checkRoom(2, [theUserById._id.toString(), req.session?.user._id.toString()]);


        data.chatRoom = room;
        
        
        


        data.currentUser = theCurrentUser;
        data.user = theUserById;


        res.render('front/profile', { data });
      }
    ]
  },
  {
    path: "/friends",
    method: "get",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const isLoggedIn = checkLogin(req, res, next);

        let respP: any = { ...req.params }
        
        
        
        if (!isLoggedIn) {
          return res.redirect('/login');
        }
        let data: any = {};

        const theCurrentUser = await getUserById(req?.session?.user._id);

     

        data.user = theCurrentUser;
        data.friends = await getFriends(req?.session?.user._id);
        
        res.render('front/friends', { data });
      }
    ]
  },
  {
    path: "/getPlaces",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        let resp: any = { ...req.body }
        let respP: any = { ...req.params }
        
        
        
        res.status(200).send(await getPlaces(resp.query));
      }
    ]
  },
  {
    path: "/messages",
    method: "get",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const isLoggedIn = checkLogin(req, res, next);
        
        
        
        if (!isLoggedIn) {
          return res.redirect('/login');
        }
        let rooms:any = await getRooms(req.session?.user._id);
        const friends = await getFriends(req.session?.user._id);
        
        
        
        if (rooms.length) {
          return res.redirect('/messages/'+rooms[0]._id);
        }else{
          res.render('front/messages',{data: {friends}});
        }
      }
    ]
  },
  {
    path: "/messages/:id",
    method: "get",
    handler: [
     async (req: Request, res: Response, next: NextFunction) => {
        const isLoggedIn = checkLogin(req, res, next);
        
        
        
        if (!isLoggedIn) {
          return res.redirect('/login');
        }
        let respP: any = { ...req.params }
        const roomCheck = await getRoom(respP.id);
        if (!roomCheck) {
          return res.redirect('/404');
        }
        const friends = await getFriends(req.session?.user._id);

        res.render('front/messages',{data: {friends}});
      }
    ]
  },
  {
    path: "/post/:id",
    method: "get",
    handler: [
     async (req: Request, res: Response, next: NextFunction) => {
        const isLoggedIn = checkLogin(req, res, next);
        
        
        
        if (!isLoggedIn) {
          return res.redirect('/login');
        }
        let respP: any = { ...req.params }
        const post = await getPost(respP.id);
        if (!post) {
          return res.redirect('/404');
        }else{
          const postOwner = await getUserById(post.userId);
          if (postOwner) {
            const userIndex = postOwner.profile.friends.indexOf(req.session?.user._id) == -1;
            if (userIndex && (req.session?.user._id != post.userId)) {
              return res.redirect('/500');
            }
          }
        }

        res.render('front/post');
      }
    ]
  },
  {
    path: "/calculator",
    method: "get",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const isLoggedIn = checkLogin(req, res, next);
        
        
        
        if (!isLoggedIn) {
          return res.redirect('/login');
        }
        
        res.render('front/calculator');
      }
    ]
  }
];

