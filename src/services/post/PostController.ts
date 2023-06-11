import { NextFunction, Request, Response } from "express";
import moment from "moment";
import "../../config/passport";
import { Post, Comment } from "../../models/Posts";
import { getTimeZone } from "../../models/Timezone";
import { getUserById } from "../user/UserController";
import { ioSocket } from "../../server";
import { addNotification } from "../notification/NotificationController";
import { FileUploader } from "../../utils/fileUploder";

export const addPost = async (req: Request, res: Response, next: NextFunction) => {
    const postContent: any = {
        locations: req.body.locations,
        text: req.body.text,
        type: req.body.type,
        userId: req.body.userId,
        contentType: req.body.contentType,
    }


    if (req.body.type != 't') {



        const matches: any = req.body.content.match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/);
        if (matches && matches.length) {
            const imageBuffer = new Buffer(matches[2], 'base64');
            const fileData = await FileUploader.uploadS3(req.body.contentName, imageBuffer, req.body.contentType);
            if (fileData && fileData.ETag) {
                postContent.content = 'https://spffiles.s3.ca-central-1.amazonaws.com/' + req.body.contentName;
            }





        }

    }


    const post = new Post(postContent);

    post.save(async (e) => {
        if (e) {
            return res.status(500).send(e);
        }


        const user = await getUserById(req.body.userId);
        if (user && user.profile && user.profile.friends && user.profile.friends.length) {
            user.profile.friends.forEach(friend => {
                ioSocket.emit(friend + 'refresh');
            });
        }
        return res.status(200).send({ error: false, data: 'success' });
    })
};

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    const posts = await Post.find({ userId: req.session?.user._id }).sort({ createdAt: -1 })
    return res.status(200).send({ error: false, data: posts });
};

export const getUserPosts = async (userId: string) => {
    const posts = await Post.find({ userId: userId }).sort({ createdAt: -1 })
    return posts;
};

export const getUserAndFriendsPosts = async (userId: string) => {
    const user = await getUserById(userId);
    let friendsId: any = user?.profile?.friends;
    if (!friendsId || !friendsId.length) {
        friendsId = [];
    }
    const usersId = [...friendsId, userId];


    const posts = await Post.find({ userId: { $in: usersId } }).sort({ createdAt: -1 })
    return posts;
};

export const getPost = async (postId: string) => {
    return await Post.findOne({ _id: postId });
};

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {

    return await Post.deleteOne({ _id: req.body.postId }, function (err: any) {
        if (err) {
            console.log('====================================');
            console.log('err', err);
            console.log('====================================');
            return res.status(500).send(err);
        }



        return res.status(200).send({ error: false, data: { res: 'success', postId: req.body.postId } });
    });
};

export const getPostComments = async (postId: string) => {
    return await Comment.find({ postId: postId });
};

export const allComments = async (req: Request, res: Response, next: NextFunction) => {
    const postId: string = req.body.postId;



    const post1 = await Post.findOne({ _id: postId });
    const comments: any = await Comment.find({ postId: postId });
    let commentsHtml = '';


    const postOwner = post1?.userId == req.session?.user._id;

    for (let index = 0; index < comments.length; index++) {
        const comment = comments[index];
        const commentUser = await getUserById(comment.userId);
        comment.liked = comment.likes.indexOf(req.session?.user._id) > -1;
        const timeZone = (await getTimeZone(req.session?.user._id))?.timezone;
        const sdate = moment(comment.createdAt).utcOffset(timeZone ? timeZone : '').utcOffset(timeZone ? timeZone : '').format('llll');
        const commentOwner = comment.userId == req.session?.user._id;

        commentsHtml = commentsHtml + `<div class="social-comment">
    <a href="/profile/${commentUser?.username}" class="float-left">
        <img alt="image" src="${commentUser?.profile.picture}">
    </a>
    <div class="media-body">
        <a href="/profile/${commentUser?.username}">
            ${commentUser?.profile.name}
        </a>
        ${comment.text}
            <br/>`;


        if (commentOwner || postOwner) {
            commentsHtml = commentsHtml + ` <a href="" class="small deleteComment" data-post="${post1?._id}" data-comment="${comment._id}"><i class="fa fa-trash" data-post="${post1?._id}" data-comment="${comment._id}"></i> Delete</a> - 
                   `;
        }


        commentsHtml = commentsHtml + `<span id="likes_${post1?._id}_${comment._id}" data-post="${post1?._id}" data-comment="${comment._id}">`;
        if (!comment.liked) {
            commentsHtml = commentsHtml + `<a href="" class="small likePostComment" data-post="${post1?._id}" data-comment="${comment._id}"><i class="fa fa-thumbs-up" data-post="${post1?._id}" data-comment="${comment._id}"></i> Like`;
        } else {
            commentsHtml = commentsHtml + `<a href="" class="small dislikePostComment" data-post="${post1?._id}" data-comment="${comment._id}"><i class="fa fa-thumbs-down" data-post="${post1?._id}" data-comment="${comment._id}"></i> Dislike`;
        }
        if (comment.likes && comment.likes.length) {
            commentsHtml = commentsHtml + ` ${comment.likes.length} Like this! -`;
        }
        commentsHtml = commentsHtml + `</a>`;
        commentsHtml = commentsHtml + `</span>`;


        commentsHtml = commentsHtml + `   <small class="text-muted">${sdate}</small>`;
        commentsHtml = commentsHtml + ` </div>
        </div>`;
    }

    return res.status(200).send({
        error: false, data: {
            postId: postId,
            commentsHtml: commentsHtml
        }
    });

};

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
    const postId: string = req.body.postId;
    const commentText: string = req.body.comment;
    const userId: string = req.body.userId;




    const theComment = {
        text: commentText,
        type: 't',
        userId: userId,
        postId: postId
    }

    const commentInstance = new Comment(theComment);
    commentInstance.save();
    //comments.push(theComment)
    //  const updateComment = await Post.update({_id: postId}, {$push: {'comments': theComment}});
    //const updateComment = await Post.updateOne({ _id: postId }, { $set: { comments: comments } });
    const post1 = await Post.findOne({ _id: postId });
    const comments = await Comment.find({ postId: postId });



    let commentsHtml = ''

    const postOwner = post1?.userId == req.session?.user._id;

    for (let index = 0; index < comments.length; index++) {
        const comment: any = comments[index];
        const commentUser = await getUserById(comment.userId);
        comment.liked = comment.likes.indexOf(req.session?.user._id) > -1;
        const timeZone = (await getTimeZone(req.session?.user._id))?.timezone;
        const sdate = moment(comment.createdAt).utcOffset(timeZone ? timeZone : '').utcOffset(timeZone ? timeZone : '').format('llll');
        const commentOwner = comment.userId == req.session?.user._id;

        commentsHtml = commentsHtml + `<div class="social-comment">
    <a href="/profile/${commentUser?.username}" class="float-left">
        <img alt="image" src="${commentUser?.profile.picture}">
    </a>
    <div class="media-body">
        <a href="/profile/${commentUser?.username}">
            ${commentUser?.profile.name}
        </a>
        ${comment.text}
            <br/>`;


        if (commentOwner || postOwner) {
            commentsHtml = commentsHtml + ` <a href="" class="small deleteComment" data-post="${post1?._id}" data-comment="${comment._id}"><i class="fa fa-trash" data-post="${post1?._id}" data-comment="${comment._id}"></i> Delete</a> - 
                `;
        }

        commentsHtml = commentsHtml + `<span id="likes_${post1?._id}_${comment._id}" data-post="${post1?._id}" data-comment="${comment._id}">`;
        if (!comment.liked) {
            commentsHtml = commentsHtml + `<a href="" class="small likePostComment" data-post="${post1?._id}" data-comment="${comment._id}"><i class="fa fa-thumbs-up" data-post="${post1?._id}" data-comment="${comment._id}"></i> Like`;
        } else {
            commentsHtml = commentsHtml + `<a href="" class="small dislikePostComment" data-post="${post1?._id}" data-comment="${comment._id}"><i class="fa fa-thumbs-down" data-post="${post1?._id}" data-comment="${comment._id}"></i> Dislike`;
        }
        if (comment.likes && comment.likes.length) {
            commentsHtml = commentsHtml + ` ${comment.likes.length} Like this! -`;
        }
        commentsHtml = commentsHtml + `</a>`;
        commentsHtml = commentsHtml + `</span>`;

        commentsHtml = commentsHtml + `   <small class="text-muted">${sdate}</small>`;

        commentsHtml = commentsHtml + ` </div>
        </div>`;
    }
    ioSocket.emit('refresh' + postId);

    if (!postOwner) {
        if (post1) {
            const commentUserOwner = await getUserById(req.body.userId);
            await addNotification({
                text: `${commentUserOwner?.username}: added a comment in your post`,
                url: `/post/${post1?._id}`,
                type: 'addComment',
                user: post1.userId
            })
        }
    }

    return res.status(200).send({
        error: false, data: {
            postId: postId,
            commentsHtml: commentsHtml
        }
    });

};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    const postId: string = req.body.postId;
    const commentId: string = req.body.commentId;





    Comment.deleteOne({ _id: commentId }, function (err: any) {
        if (err) {
            console.log('====================================');
            console.log('err', err);
            console.log('====================================');
            return res.status(500).send(err);
        }



    });

    const post1 = await Post.findOne({ _id: postId });
    const comments = await Comment.find({ postId: postId });



    let commentsHtml = ''

    const postOwner = post1?.userId == req.session?.user._id;

    for (let index = 0; index < comments.length; index++) {
        const comment: any = comments[index];
        const commentUser = await getUserById(comment.userId);
        comment.liked = comment.likes.indexOf(req.session?.user._id) > -1;
        const timeZone = (await getTimeZone(req.session?.user._id))?.timezone;
        const sdate = moment(comment.createdAt).utcOffset(timeZone ? timeZone : '').utcOffset(timeZone ? timeZone : '').format('llll');
        const commentOwner = comment.userId == req.session?.user._id;

        commentsHtml = commentsHtml + `<div class="social-comment">
<a href="/profile/${commentUser?.username}" class="float-left">
    <img alt="image" src="${commentUser?.profile.picture}">
</a>
<div class="media-body">
    <a href="/profile/${commentUser?.username}">
        ${commentUser?.profile.name}
    </a>
    ${comment.text}
        <br/>`;


        if (commentOwner || postOwner) {
            commentsHtml = commentsHtml + ` <a href="" class="small deleteComment" data-post="${post1?._id}" data-comment="${comment._id}"><i class="fa fa-trash" data-post="${post1?._id}" data-comment="${comment._id}"></i> Delete</a> - 
            `;
        }

        commentsHtml = commentsHtml + `<span id="likes_${post1?._id}_${comment._id}" data-post="${post1?._id}" data-comment="${comment._id}">`;
        if (!comment.liked) {
            commentsHtml = commentsHtml + `<a href="" class="small likePostComment" data-post="${post1?._id}" data-comment="${comment._id}"><i class="fa fa-thumbs-up" data-post="${post1?._id}" data-comment="${comment._id}"></i> Like`;
        } else {
            commentsHtml = commentsHtml + `<a href="" class="small dislikePostComment" data-post="${post1?._id}" data-comment="${comment._id}"><i class="fa fa-thumbs-down" data-post="${post1?._id}" data-comment="${comment._id}"></i> Dislike`;
        }
        if (comment.likes && comment.likes.length) {
            commentsHtml = commentsHtml + ` ${comment.likes.length} Like this! -`;
        }
        commentsHtml = commentsHtml + `</a>`;
        commentsHtml = commentsHtml + `</span>`;

        commentsHtml = commentsHtml + `   <small class="text-muted">${sdate}</small>`;

        commentsHtml = commentsHtml + ` </div>
    </div>`;
    }
    ioSocket.emit('refresh' + postId);
    return res.status(200).send({
        error: false, data: {
            postId: postId,
            commentsHtml: commentsHtml
        }
    });

};

export const addLikeComment = async (req: Request, res: Response, next: NextFunction) => {



    const postId: string = req.body.postId;
    const commentId: string = req.body.commentId;
    const userId: string = req.body.userId;

    const updateComment = await Comment.update({ _id: commentId }, { $push: { 'likes': userId } });

    const post1 = await Post.findOne({ _id: postId });
    const comments = await Comment.find({ postId: postId });



    let commentsHtml = ''

    const postOwner = post1?.userId == req.session?.user._id;

    for (let index = 0; index < comments.length; index++) {
        const comment: any = comments[index];
        const commentUser = await getUserById(comment.userId);
        comment.liked = comment.likes.indexOf(req.session?.user._id) > -1;
        const timeZone = (await getTimeZone(req.session?.user._id))?.timezone;
        const sdate = moment(comment.createdAt).utcOffset(timeZone ? timeZone : '').utcOffset(timeZone ? timeZone : '').format('llll');
        const commentOwner = comment.userId == req.session?.user._id;

        commentsHtml = commentsHtml + `<div class="social-comment">
    <a href="/profile/${commentUser?.username}" class="float-left">
        <img alt="image" src="${commentUser?.profile.picture}">
    </a>
    <div class="media-body">
        <a href="/profile/${commentUser?.username}">
            ${commentUser?.profile.name}
        </a>
        ${comment.text}
            <br/>`;


        if (commentOwner || postOwner) {
            commentsHtml = commentsHtml + ` <a href="" class="small deleteComment" data-post="${post1?._id}" data-comment="${comment._id}"><i class="fa fa-trash" data-post="${post1?._id}" data-comment="${comment._id}"></i> Delete</a> - 
                `;
        }

        commentsHtml = commentsHtml + `<span id="likes_${post1?._id}_${comment._id}" data-post="${post1?._id}" data-comment="${comment._id}">`;
        if (!comment.liked) {
            commentsHtml = commentsHtml + `<a href="" class="small likePostComment" data-post="${post1?._id}" data-comment="${comment._id}"><i class="fa fa-thumbs-up" data-post="${post1?._id}" data-comment="${comment._id}"></i> Like`;
        } else {
            commentsHtml = commentsHtml + `<a href="" class="small dislikePostComment" data-post="${post1?._id}" data-comment="${comment._id}"><i class="fa fa-thumbs-down" data-post="${post1?._id}" data-comment="${comment._id}"></i> Dislike`;
        }
        if (comment.likes && comment.likes.length) {
            commentsHtml = commentsHtml + ` ${comment.likes.length} Like this! -`;
        }
        commentsHtml = commentsHtml + `</a>`;
        commentsHtml = commentsHtml + `</span>`;

        commentsHtml = commentsHtml + `   <small class="text-muted">${sdate}</small>`;

        commentsHtml = commentsHtml + ` </div>
        </div>`;
    }
    ioSocket.emit('refresh' + postId);

    const theComment = await Comment.findOne({ _id: commentId });
    if (post1) {
        if (theComment) {
            if (!(theComment?.userId == req.session?.user._id)) {

                const likeOwner = await getUserById(req.body.userId);
                await addNotification({
                    text: `${likeOwner?.username}: liked your comment in a post`,
                    url: `/post/${post1?._id}`,
                    type: 'likecommentpost',
                    user: theComment.userId
                })
            }
        }
    }

    return res.status(200).send({
        error: false, data: {
            postId: postId,
            commentsHtml: commentsHtml
        }
    });
};

export const disLikeComment = async (req: Request, res: Response, next: NextFunction) => {
    const postId: string = req.body.postId;
    const commentId: string = req.body.commentId;
    const userId: string = req.body.userId;


    await Comment.findOne({ '_id': commentId }, function (err, theComment) {

        const index2 = theComment?.likes.indexOf(userId);
        theComment?.likes.splice(Number(index2), 1);
        theComment?.save(function (err: Error) {
            console.log('====================================');
            console.log('errr delete');
            console.log('====================================');
        })
    });

    const post1 = await Post.findOne({ _id: postId });
    const comments = await Comment.find({ postId: postId });



    let commentsHtml = ''

    const postOwner = post1?.userId == req.session?.user._id;

    for (let index = 0; index < comments.length; index++) {
        const comment: any = comments[index];
        const commentUser = await getUserById(comment.userId);
        comment.liked = comment.likes.indexOf(req.session?.user._id) > -1;
        const timeZone = (await getTimeZone(req.session?.user._id))?.timezone;
        const sdate = moment(comment.createdAt).utcOffset(timeZone ? timeZone : '').utcOffset(timeZone ? timeZone : '').format('llll');
        const commentOwner = comment.userId == req.session?.user._id;

        commentsHtml = commentsHtml + `<div class="social-comment">
    <a href="/profile/${commentUser?.username}" class="float-left">
        <img alt="image" src="${commentUser?.profile.picture}">
    </a>
    <div class="media-body">
        <a href="/profile/${commentUser?.username}">
            ${commentUser?.profile.name}
        </a>
        ${comment.text}
            <br/>`;


        if (commentOwner || postOwner) {
            commentsHtml = commentsHtml + ` <a href="" class="small deleteComment" data-post="${post1?._id}" data-comment="${comment._id}"><i class="fa fa-trash" data-post="${post1?._id}" data-comment="${comment._id}"></i> Delete</a> - 
                `;
        }

        commentsHtml = commentsHtml + `<span id="likes_${post1?._id}_${comment._id}" data-post="${post1?._id}" data-comment="${comment._id}">`;
        if (!comment.liked) {
            commentsHtml = commentsHtml + `<a href="" class="small likePostComment" data-post="${post1?._id}" data-comment="${comment._id}"><i class="fa fa-thumbs-up" data-post="${post1?._id}" data-comment="${comment._id}"></i> Like`;
        } else {
            commentsHtml = commentsHtml + `<a href="" class="small dislikePostComment" data-post="${post1?._id}" data-comment="${comment._id}"><i class="fa fa-thumbs-down" data-post="${post1?._id}" data-comment="${comment._id}"></i> Dislike`;
        }
        if (comment.likes && comment.likes.length) {
            commentsHtml = commentsHtml + ` ${comment.likes.length} Like this! -`;
        }
        commentsHtml = commentsHtml + `</a>`;
        commentsHtml = commentsHtml + `</span>`;

        commentsHtml = commentsHtml + `   <small class="text-muted">${sdate}</small>`;

        commentsHtml = commentsHtml + ` </div>
        </div>`;
    }
    ioSocket.emit('refresh' + postId);
    return res.status(200).send({
        error: false, data: {
            postId: postId,
            commentsHtml: commentsHtml
        }
    });

};




export const addLike = async (req: Request, res: Response, next: NextFunction) => {



    const postId: string = req.body.postId;
    const userId: string = req.body.userId;
    const post = await Post.findOne({ _id: postId });




    let likes: any = [];
    if (post?.likes) {
        likes = post?.likes;
    }
    likes.push(userId)
    const updateLike = await Post.updateOne({ _id: postId }, { $set: { likes: likes } });
    const post1 = await Post.findOne({ _id: postId });
    const likesHTML = `
    
    <a href="#" class="small likesNumber">
                                                                                                    ${post1?.likes.length} Like this!</a>
    `;


    let likeButtonsHTML = `<i class="fa fa-thumbs-down"  data-post="${post1?._id}"></i> Dislike`;

    if (post) {
        const user = await getUserById(post.userId);
        if (user && user.profile && user.profile.friends && user.profile.friends.length) {
            ioSocket.emit(post.userId + 'refresh');
            user.profile.friends.forEach(friend => {
                ioSocket.emit(friend + 'refresh');
            });
        }
    }

    ioSocket.emit('refresh' + postId);
    const postOwner = post1?.userId == req.session?.user._id;
    if (!postOwner) {
        if (post) {
            const likeOwner = await getUserById(req.body.userId);
            await addNotification({
                text: `${likeOwner?.username}: liked your post`,
                url: `/post/${post?._id}`,
                type: 'likepost',
                user: post.userId
            })
        }
    }
    return res.status(200).send({ error: false, data: { postId: postId, likesHTML: likesHTML, likeButtonsHTML: likeButtonsHTML } });
};

export const disLike = async (req: Request, res: Response, next: NextFunction) => {



    const postId: string = req.body.postId;
    const userId: string = req.body.userId;
    const post = await Post.findOne({ _id: postId });
    let likes: any = [];
    if (post?.likes) {
        likes = post?.likes;
    }

    const index = likes.indexOf(userId);
    if (index > -1) {

        likes.splice(index, 1);
    }
    const updateLike = await Post.updateOne({ _id: postId }, { $set: { likes: likes } });
    const post1 = await Post.findOne({ _id: postId });

    let likesHTML = ``;
    if (post1 && post1.likes && post1.likes.length > 0) {
        likesHTML = likesHTML + `  <a href="#" class="small likesNumber">
        ${post1?.likes.length} Like this!</a>`;
    }



    let likeButtonsHTML = `<i class="fa fa-thumbs-up"  data-post="${post1?._id}"></i> Like`;

    if (post) {
        const user = await getUserById(post.userId);
        if (user && user.profile && user.profile.friends && user.profile.friends.length) {
            ioSocket.emit(post.userId + 'refresh');
            user.profile.friends.forEach(friend => {
                ioSocket.emit(friend + 'refresh');
            });
        }
    }
    ioSocket.emit('refresh' + postId);

    return res.status(200).send({ error: false, data: { postId: postId, likesHTML: likesHTML, likeButtonsHTML: likeButtonsHTML } });

};




