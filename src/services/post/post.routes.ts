import { NextFunction, Request, Response } from "express";
import { checkLoginPost } from "../../middleware/checks";
import { getUserById } from "../user/UserController";
import { addComment, addLike, addLikeComment, addPost, allComments, deleteComment, deletePost, disLike, disLikeComment, getPost, getPosts, getUserAndFriendsPosts } from "./PostController";

export default [
  {
    path: "/add/post",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          checkLoginPost(req, res, next, async (check: any) => {
            if (!check) {
              return res.status(500).send({ error: true, message: 'not authenticated' });
            }

            addPost(req, res, next);
          });
        } catch (error) {
          console.error('========================= Begin Error post /add/post =============================')
          console.error(error)
          console.error('========================= END Error post /add/post =============================')
        }
      }
    ]
  },
  {
    path: "/get/posts",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {

          checkLoginPost(req, res, next, async (check: any) => {
            if (!check) {
              return res.status(500).send({ error: true, message: 'not authenticated' });
            }
            getPosts(req, res, next);
          });
        } catch (error) {
          console.error('========================= Begin Error post /get/posts =============================')
          console.error(error)
          console.error('========================= END Error post /get/posts =============================')
        }
      }
    ]
  },
  {
    path: "/get/user/posts",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {

          checkLoginPost(req, res, next, async (check: any) => {
            if (!check) {
              return res.status(500).send({ error: true, message: 'not authenticated' });
            }



            let data: any = {}
            let posts: any = [...(await getUserAndFriendsPosts(req.session?.user._id))];
            let newPosts: any = [];

            for (let index = 0; index < posts.length; index++) {
              const post = posts[index];

              newPosts.push({
                _id: post._id,
                content: post.content,
                createdAt: post.createdAt,
                likes: post.likes,
                locations: post.locations,
                contentType: post.contentType,
                text: post.text,
                type: post.type,
                updatedAt: post.updatedAt,
                userId: post.userId,
                liked: post.likes.indexOf(req.session?.user._id) > -1,
                postOwner: post.userId == req.session?.user._id,
                theOwner: await getUserById(post.userId)
              })

            }
            data.posts = newPosts;
            data.user = await getUserById(req.session?.user._id);

            return res.status(200).send({ error: false, data: { ...data } });
          });
        } catch (error) {
          console.error('========================= Begin Error post /get/user/posts =============================')
          console.error(error)
          console.error('========================= END Error post /get/user/posts =============================')
        }
      }
    ]
  },
  {
    path: "/get/post",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {

          checkLoginPost(req, res, next, async (check: any) => {
            if (!check) {
              return res.status(500).send({ error: true, message: 'not authenticated' });
            }



            let data: any = {}
            const post: any = await getPost(req.body.postId);
            if (post) {
              data.post = {
                _id: post._id,
                content: post.content,
                createdAt: post.createdAt,
                likes: post.likes,
                locations: post.locations,
                text: post.text,
                type: post.type,
                updatedAt: post.updatedAt,
                contentType: post.contentType,
                userId: post.userId,
                liked: post.likes.indexOf(req.session?.user._id) > -1,
                postOwner: post.userId == req.session?.user._id,
                theOwner: await getUserById(post.userId)
              };
              data.user = await getUserById(req.session?.user._id);

              return res.status(200).send({ error: false, data: data });
            }

          });
        } catch (error) {
          console.error('========================= Begin Error post /get/post =============================')
          console.error(error)
          console.error('========================= END Error post /get/post =============================')
        }
      }
    ]
  },
  {
    path: "/delete/post",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {

          checkLoginPost(req, res, next, async (check: any) => {
            if (!check) {
              return res.status(500).send({ error: true, message: 'not authenticated' });
            }



            return await deletePost(req, res, next)
          });
        } catch (error) {
          console.error('========================= Begin Error post /delete/post =============================')
          console.error(error)
          console.error('========================= END Error post /delete/post =============================')
        }
      }
    ]
  },
  {
    path: "/add/comment",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {

          checkLoginPost(req, res, next, async (check: any) => {
            if (!check) {
              return res.status(500).send({ error: true, message: 'not authenticated' });
            }



            addComment(req, res, next);
          });
        } catch (error) {
          console.error('========================= Begin Error post /add/comment =============================')
          console.error(error)
          console.error('========================= END Error post /add/comment =============================')
        }
      }
    ]
  },
  {
    path: "/delete/comment",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {

          checkLoginPost(req, res, next, async (check: any) => {
            if (!check) {
              return res.status(500).send({ error: true, message: 'not authenticated' });
            }



            deleteComment(req, res, next);
          });
        } catch (error) {
          console.error('========================= Begin Error post /delete/comment =============================')
          console.error(error)
          console.error('========================= END Error post /delete/comment =============================')
        }
      }
    ]
  },
  {
    path: "/add/like",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {

          checkLoginPost(req, res, next, async (check: any) => {
            if (!check) {
              return res.status(500).send({ error: true, message: 'not authenticated' });
            }



            addLike(req, res, next);
          });
        } catch (error) {
          console.error('========================= Begin Error post /add/like =============================')
          console.error(error)
          console.error('========================= END Error post /add/like =============================')
        }
      }
    ]
  },
  {
    path: "/delete/like",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {

          checkLoginPost(req, res, next, async (check: any) => {
            if (!check) {
              return res.status(500).send({ error: true, message: 'not authenticated' });
            }



            disLike(req, res, next);
          });
        } catch (error) {
          console.error('========================= Begin Error post /delete/like =============================')
          console.error(error)
          console.error('========================= END Error post /delete/like =============================')
        }
      }
    ]
  },
  {
    path: "/add/like/comment",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
            
        checkLoginPost(req, res, next, async (check: any) => {
          if (!check) {
            return res.status(500).send({ error: true, message: 'not authenticated' });
          }



          addLikeComment(req, res, next);
        });
      } catch (error) {
          console.error('========================= Begin Error post /add/like/comment =============================')
          console.error(error)
          console.error('========================= END Error post /add/like/comment =============================')
      }
      }
    ]
  },
  {
    path: "/delete/like/comment",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
            
        checkLoginPost(req, res, next, async (check: any) => {
          if (!check) {
            return res.status(500).send({ error: true, message: 'not authenticated' });
          }



          disLikeComment(req, res, next);
        });
      } catch (error) {
          console.error('========================= Begin Error post /delete/like/comment =============================')
          console.error(error)
          console.error('========================= END Error post /delete/like/comment =============================')
      }
      }
    ]
  },
  {
    path: "/all/comments",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
        checkLoginPost(req, res, next, async (check: any) => {
          if (!check) {
            return res.status(500).send({ error: true, message: 'not authenticated' });
          }



          allComments(req, res, next);
        });
      } catch (error) {
          console.error('========================= Begin Error post /all/comments =============================')
          console.error(error)
          console.error('========================= END Error post /all/comments =============================')
      }
      }
    ]
  },
];

