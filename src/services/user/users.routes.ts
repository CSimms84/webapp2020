import { NextFunction, Request, Response } from "express";
import { checkLoginAdmin, checkLoginAdminPost } from "../../middleware/checksAdmin";
import countries from "../../utils/countries";
import { addUserByAdmin, deletUserForAdmin, editUserByAdmin, editUserByToken, editUserPasswordByToken, getUserByToken, getUserById, getUsersForAdmin, postLoginAdminWithPass, updateLocation } from "./UserController";

export default [
  {
    path: "/admin",
    method: "get",
    handler: [
      (req: Request, res: Response, next: NextFunction) => {
        try {
        const isLoggedInAdmin = checkLoginAdmin(req, res, next);
        if (!isLoggedInAdmin) {
          return res.redirect('/admin/login');
        }

        return res.redirect('/admin/users');
      
      } catch (error) {
          console.error('========================= Begin Error get /admin =============================')
          console.error(error)
          console.error('========================= END Error get /admin =============================')
      }
      }
    ]
  },
  {
    path: "/admin/login",
    method: "get",
    handler: [
      (req: Request, res: Response, next: NextFunction) => {
        try {
            
        const isLoggedInAdmin = checkLoginAdmin(req, res, next);
        if (isLoggedInAdmin) {
          return res.redirect('/admin');
        }

        res.render('admin/login');    
      } catch (error) {
          console.error('========================= Begin Error get /admin/login =============================')
          console.error(error)
          console.error('========================= END Error get /admin/login =============================')
      }
      }
    ]
  },
  {
    path: "/admin/login",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
    
        const result = await postLoginAdminWithPass(req, res, next);
      } catch (error) {
          console.error('========================= Begin Error post /admin/login =============================')
          console.error(error)
          
          console.error('========================= END Error post /admin/login =============================')
      }
      }
    ]
  },
  {
    path: "/admin/logout",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {

        if (req.session) {
          delete req.session.user;
          req.session.save((e: Error) => {
            
            if (!e) {
              res.status(200).send({ error: false, data: 'done' });
            }
          });
        }    
      } catch (error) {
          console.error('========================= Begin Error post /admin/logout =============================')
          console.error(error)
          
          console.error('========================= END Error post /admin/logout =============================')
      }
      }
    ]
  },
  {
    path: "/admin/users",
    method: "get",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
   
        const isLoggedInAdmin = checkLoginAdmin(req, res, next);
        

        if (!isLoggedInAdmin) {
          return res.redirect('/admin/login');
        }

        let data: any = { data: {} };
        if (!req?.query?.role) {
          data.data.role = 'all';
        } else {
          data.data.role = req.query.role;
        }

        if (req?.query?.action) {
          data.data.action = req.query.action;
        }

        if (req?.query?.userId) {
          data.data.userId = req.query.userId;

          if (data.data.action == "showUser") {

            data.data.user = await getUserById(data.data.userId);
          }
        }
        data.data.countries = countries.countries;
        getUsersForAdmin(req, res, next, (err: any, users: any) => {

          data.data.users = [...users];


          if (err) {
            res.render('500');
          } else {
            res.render('admin/users/users', { ...data });
          }
        }); 
      } catch (error) {
          console.error('========================= Begin Error get /admin/users =============================')
          console.error(error)
          
          console.error('========================= END Error get /admin/users =============================')
      }

      }
    ]
  },
  {
    path: "/admin/profile",
    method: "get",
    handler: [
      (req: Request, res: Response, next: NextFunction) => {
        try {
  
        const isLoggedInAdmin = checkLoginAdmin(req, res, next);
        if (!isLoggedInAdmin) {
          return res.redirect('/admin/login');
        }
        res.render('admin/users/profile');    
      } catch (error) {
          console.error('========================= Begin Error get /admin/profile =============================')
          console.error(error)
          
          console.error('========================= END Error get /admin/profile =============================')
      }
      }
    ]
  },
  {
    path: "/admin/users/get",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
    
        checkLoginAdminPost(req, res, next, async (check: any) => {
          if (!check) {
            return res.status(500).send({ error: true, message:'not authenticated'});
          }
          let resp: any = { ...req.body }
          return res.status(200).send({ error: false, data: await getUserById(resp.userId) });
        });
      } catch (error) {
          console.error('========================= Begin Error post /admin/users/get =============================')
          console.error(error)
          
          console.error('========================= END Error post /admin/users/get =============================')
      }


      }
    ]
  },
  {
    path: "/admin/users/get/profile",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
    
        checkLoginAdminPost(req, res, next, async (check: any) => {
          if (!check) {
            return res.status(500).send({ error: true, message:'not authenticated'});
          }
          let resp: any = { ...req.body }
          return await getUserByToken(req, res, next);
        });

      } catch (error) {
        console.error('========================= Begin Error post /admin/users/get/profile =============================')
        console.error(error)
        
        console.error('========================= END Error post /admin/users/get/profile =============================')
    }
      }
    ]
  },
  {
    path: "/admin/users/add",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
    
        checkLoginAdminPost(req, res, next, async (check: any) => {
          if (!check) {
            return res.status(500).send({ error: true, message:'not authenticated'});
          }
          let resp: any = { ...req.body }

          let user: any = {
            email: resp.email,
            username: resp.username,
            password: resp.password,
            role: resp.role,
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
              address: resp.address,
              nbrEmp: resp.nbrEmp,
              tax: resp.tax
            }
          };

          if (resp?.location) {
            user.profile.location = resp?.location;
          }

          
          addUserByAdmin(user, req, res, next);

        });   
      } catch (error) {
          console.error('========================= Begin Error post /admin/users/add =============================')
          console.error(error)
          console.error('========================= END Error post /admin/users/add =============================')
      }

      }
    ]
  },
  {
    path: "/admin/users/edit",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
    
        checkLoginAdminPost(req, res, next, async (check: any) => {
          if (!check) {
            return res.status(500).send({ error: true, message:'not authenticated'});
          }
          let resp: any = { ...req.body }

          const user: any = {
            email: resp.email,
            username: resp.username,
            password: resp.password,
            role: resp.role,
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
              address: resp.address,
              nbrEmp: resp.nbrEmp,
              tax: resp.tax
            }
          };

          
          editUserByAdmin(user, req, res, next);

        });
      } catch (error) {
          console.error('========================= Begin Error post /admin/users/edit =============================')
          console.error(error)
          console.error('========================= END Error post /admin/users/edit =============================')
      }

      }
    ]
  },
  {
    path: "/admin/user/edit",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
    
        checkLoginAdminPost(req, res, next, async (check: any) => {
          if (!check) {
            return res.status(500).send({ error: true, message:'not authenticated'});
          }
          let resp: any = { ...req.body }

          const user: any = {
            photo: resp.photo,
            name: resp.name,
            phone: resp.phone
          };

          
          editUserByToken(user, req, res, next);

        });
      } catch (error) {
          console.error('========================= Begin Error post /admin/user/edit =============================')
          console.error(error)
          console.error('========================= END Error post /admin/user/edit =============================')
      }

      }
    ]
  },
  {
    path: "/admin/user/password",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
            
        checkLoginAdminPost(req, res, next, async (check: any) => {
          if (!check) {
            return res.status(500).send({ error: true, message:'not authenticated'});
          }
          let resp: any = { ...req.body }

          const user: any = {
            password: resp.password,
            newPassword: resp.newPassword
          };

          
          editUserPasswordByToken(user, req, res, next);

        });
      } catch (error) {
          console.error('========================= Begin Error post /admin/user/password =============================')
          console.error(error)
          console.error('========================= END Error post /admin/user/password =============================')
      }

      }
    ]
  },
  {
    path: "/admin/users/delete",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
    
        checkLoginAdminPost(req, res, next, async (check: any) => {
          if (!check) {
            return res.status(500).send({ error: true, message:'not authenticated'});
          }
          const result = await deletUserForAdmin(req, res, next);
          

          res.status(200).send({ error: false, data: result ? 'deleted' : 'error' });
        });
      } catch (error) {
          console.error('========================= Begin Error post /admin/users/delete =============================')
          console.error(error)
          console.error('========================= END Error post /admin/users/delete =============================')
      }
      }
    ]
  },
  {
    path: "/admin/update/location",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        try {
            
        checkLoginAdminPost(req, res, next, async (check: any) => {
          if (!check) {
            return res.status(500).send({ error: true, message:'not authenticated'});
          }
          let resp: any = { ...req.body }
          await updateLocation(req, res, next);
        });
      } catch (error) {
          console.error('========================= Begin Error post /admin/update/location =============================')
          console.error(error)
          console.error('========================= END Error post /admin/update/location =============================')
      }
      }
    ]
  }
];

