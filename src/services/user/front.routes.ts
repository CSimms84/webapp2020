import { NextFunction, Request, Response } from "express";
import { checkLoginPost } from "../../middleware/checks";
import { addFriend, addRequest, cancelRequest, editUserFrontByToken, editUserPasswordByToken, getFriends, getNearByUsers, getUserByToken, getUsersByZipCode, postLoginWithPass, registerUser, removeFriend, updateLocation } from "./UserController";

export default [
  {
    path: "/login",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {


          const result = await postLoginWithPass(req, res, next);
        } catch (error) {
          console.error('========================= Begin Error post /login =============================')
          console.error(error)
          console.error('========================= END Error post /login =============================')
        }
      }
    ]
  },
  {
    path: "/logout",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {

          if (req.session) {
            delete req.session.user;
            req.session.save((e: Error) => {
              if (!e) {
                return res.status(200).send({ error: false, data: 'done' });
              } else {
                console.error('post /logout front', e)
              }
            });
          }
        } catch (error) {
          console.error('========================= Begin Error post /logout =============================')
          console.error(error)
          console.error('========================= END Error post /logout =============================')
        }
      }
    ]
  },
  {
    path: "/register",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {

          let resp: any = { ...req.body }

          //   let location = { type: "Point", coordinates: [resp.latitude, resp.longitude] };

          let user: any = {
            email: resp.email,
            username: resp.username,
            password: resp.password,
            role: resp.role,
            acceptTerms: resp.acceptTerms,
            profile: {
              name: resp.name,
              about: resp.about,
              gender: resp.gender,
              age: resp.age,
              country: resp.country,
              phone: resp.phone,
              zipcode: resp.zipcode.split(' ').join(''),
              state: resp.state,
              city: resp.city,
              speed: resp.speed,
              time: resp.time,
              weight: resp.weight,
              picture: resp.photo,
              //   location: location,
              address: resp.address,
              nbrEmp: resp.nbrEmp,
              tax: resp.tax
            }
          };



          if (resp?.location) {
            user.profile.location = resp?.location;
          }

          // 
          registerUser(user, req, res, next);
        } catch (error) {
          console.error('========================= Begin Error post /register =============================')
          console.error(error)
          console.error('========================= END Error post /register =============================')
        }
      }
    ]
  },
  {
    path: "/getNearByUsers",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {

          checkLoginPost(req, res, next, async (check: any) => {
            if (!check) {
              return res.status(500).send({ error: true, message: 'not authenticated' });
            }

            getNearByUsers(req, res, next);
          });
        } catch (error) {
          console.error('========================= Begin Error post /getNearByUsers =============================')
          console.error(error)
          console.error('========================= END Error post /getNearByUsers =============================')
        }
      }
    ]
  },
  {
    path: "/getNearByUsersByZip",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {

          checkLoginPost(req, res, next, async (check: any) => {
            if (!check) {
              return res.status(500).send({ error: true, message: 'not authenticated' });
            }
            getUsersByZipCode(req, res, next);
          });
        } catch (error) {
          console.error('========================= Begin Error post /getNearByUsersByZip =============================')
          console.error(error)
          console.error('========================= END Error post /getNearByUsersByZip =============================')
        }
      }
    ]
  },
  {
    path: "/addRequest",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {


          checkLoginPost(req, res, next, async (check: any) => {
            if (!check) {
              return res.status(500).send({ error: true, message: 'not authenticated' });
            }
            const resp: any = { ...req.body }
            const userId = req.session?.user._id;
            const userId2 = resp.id;
            const addReq = await addRequest(userId, userId2);

            if (addReq) {
              // notification TODO

              return res.status(200).send({ error: false, data: `<button type="button" class="btn btn-warning btn-sm" id="cancelRequest">Cancel request</button>` });;

            }
            return res.status(500).send({ error: true });
          });
        } catch (error) {
          console.error('========================= Begin Error post /addRequest =============================')
          console.error(error)
          console.error('========================= END Error post /addRequest =============================')
        }
      }
    ]
  },
  {
    path: "/acceptRequest",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {

          checkLoginPost(req, res, next, async (check: any) => {
            if (!check) {
              return res.status(500).send({ error: true, message: 'not authenticated' });
            }
            const resp: any = { ...req.body }
            const userId = req.session?.user._id;
            const userId2 = resp.id;
            const addReq = await addFriend(userId, userId2);



            if (addReq) {
              // notification TODO

              return res.status(200).send({ error: false, data: `<button type="button" class="btn btn-warning btn-sm" id="cancelRequest">Cancel request</button>` });;

            }
            return res.status(500).send({ error: true });;
          });
        } catch (error) {
          console.error('========================= Begin Error post /acceptRequest =============================')
          console.error(error)
          console.error('========================= END Error post /acceptRequest =============================')
        }
      }
    ]
  },
  {
    path: "/cancelHisRequest",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {

          checkLoginPost(req, res, next, async (check: any) => {
            if (!check) {
              return res.status(500).send({ error: true, message: 'not authenticated' });
            }
            const resp: any = { ...req.body }
            const userId = req.session?.user._id;
            const userId2 = resp.id;
            const addReq = await cancelRequest(userId2, userId);



            if (addReq) {
              // notification TODO

              return res.status(200).send({ error: false, data: `<button type="button" class="btn btn-warning btn-sm" id="cancelRequest">Cancel request</button>` });;

            }
            return res.status(500).send({ error: true });;
          });
        } catch (error) {
          console.error('========================= Begin Error post /cancelHisRequest =============================')
          console.error(error)
          console.error('========================= END Error post /cancelHisRequest =============================')
        }
      }
    ]
  },
  {
    path: "/cancelRequest",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
            

        checkLoginPost(req, res, next, async (check: any) => {
          if (!check) {
            return res.status(500).send({ error: true, message: 'not authenticated' });
          }
          const resp: any = { ...req.body }
          const userId = req.session?.user._id;
          const userId2 = resp.id;
          const addReq = await cancelRequest(userId, userId2);



          if (addReq) {
            // notification TODO

            return res.status(200).send({ error: false, data: `<button type="button" class="btn btn-warning btn-sm" id="cancelRequest">Cancel request</button>` });;

          }
          return res.status(500).send({ error: true });;
        });
      } catch (error) {
          console.error('========================= Begin Error post /cancelRequest =============================')
          console.error(error)
          console.error('========================= END Error post /cancelRequest =============================')
      }
      }
    ]
  },
  {
    path: "/removeFriend",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
            
        checkLoginPost(req, res, next, async (check: any) => {
          if (!check) {
            return res.status(500).send({ error: true, message: 'not authenticated' });
          }
          const resp: any = { ...req.body }
          const userId = req.session?.user._id;
          const userId2 = resp.id;
          const addReq = await removeFriend(userId, userId2);



          if (addReq) {
            // notification TODO

            return res.status(200).send({ error: false, data: `<button type="button" class="btn btn-warning btn-sm" id="cancelRequest">Cancel request</button>` });;

          }
          return res.status(500).send({ error: true });
        });
      } catch (error) {
          console.error('========================= Begin Error post /removeFriend =============================')
          console.error(error)
          console.error('========================= END Error post /removeFriend =============================')
      }
      }
    ]
  },
  {
    path: "/update/location",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
            
        checkLoginPost(req, res, next, async (check: any) => {
          if (!check) {
            return res.status(500).send({ error: true, message: 'not authenticated' });
          }
          let resp: any = { ...req.body }
          await updateLocation(req, res, next);
        });
      } catch (error) {
          console.error('========================= Begin Error post /update/location =============================')
          console.error(error)
          console.error('========================= END Error post /update/location =============================')
      }
      }
    ]
  },
  {
    path: "/users/get/profile",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
            
        checkLoginPost(req, res, next, async (check: any) => {
          if (!check) {
            return res.status(500).send({ error: true, message: 'not authenticated' });
          }
          let resp: any = { ...req.body }
          return await getUserByToken(req, res, next);
        });
      } catch (error) {
          console.error('========================= Begin Error post /users/get/profile =============================')
          console.error(error)
          console.error('========================= END Error post /users/get/profile =============================')
      }

      }
    ]
  },
  {
    path: "/user/password",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
            
        checkLoginPost(req, res, next, async (check: any) => {
          if (!check) {
            return res.status(500).send({ error: true, message: 'not authenticated' });
          }
          let resp: any = { ...req.body }

          const user: any = {
            password: resp.password,
            newPassword: resp.newPassword
          };


          editUserPasswordByToken(user, req, res, next);

        });
      } catch (error) {
          console.error('========================= Begin Error post /user/password =============================')
          console.error(error)
          console.error('========================= END Error post /user/password =============================')
      }

      }
    ]
  },
  {
    path: "/user/edit",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
            
        checkLoginPost(req, res, next, async (check: any) => {
          if (!check) {
            return res.status(500).send({ error: true, message: 'not authenticated' });
          }
          let resp: any = { ...req.body }

          let user: any = {
            photo: resp.photo,
            name: resp.name,
            gender: resp.gender,
            age: resp.age,
            about: resp.about,
            country: resp.country,
            zipcode: resp.zipcode,
            state: resp.state,
            city: resp.city,
            phone: resp.phone,
            weight: resp.weight,
            speed: resp.speed,
            time: resp.time,
            address: resp.address,
            nbrEmp: resp.nbrEmp,
            tax: resp.tax
          };

          if (resp?.location) {
            user.location = resp?.location;
          }


          editUserFrontByToken(user, req, res, next);

        });
      } catch (error) {
          console.error('========================= Begin Error post /user/edit =============================')
          console.error(error)
          console.error('========================= END Error post /user/edit =============================')
      }

      }
    ]
  },
  {
    path: "/update/user/location",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
            
        let resp: any = { ...req.body }
        await updateLocation(req, res, next);
      } catch (error) {
          console.error('========================= Begin Error post /update/user/location =============================')
          console.error(error)
          console.error('========================= END Error post /update/user/location =============================')
      }
      }
    ]
  },
  {
    path: "/user/getFriends",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
            
        checkLoginPost(req, res, next, async (check: any) => {
          if (!check) {
            return res.status(500).send({ error: true, message: 'not authenticated' });
          }
          // let resp: any = { ...req.body }



          const friends = await getFriends(req.session?.user._id);




          res.status(200).send({ error: false, data: friends });

        });
      } catch (error) {
          console.error('========================= Begin Error post /user/getFriends =============================')
          console.error(error)
          console.error('========================= END Error post /user/getFriends =============================')
      }

      }
    ]
  }
];

