import express from 'express';
import passport from 'passport';
import phoneController from '../controllers/phoneController';
import usersController from '../controllers/usersController';
import { onlyPrivate, onlyPublic } from '../middlewares';

const globalRouter = express.Router();

globalRouter.get('/', phoneController.searchNumbers);

globalRouter
  .route('/create-account')
  .get(usersController.createAccount, onlyPublic)
  .post(usersController.createAccount, onlyPublic);

globalRouter
  .route('/log-in')
  .get(usersController.logIn)
  .post(
    onlyPublic,
    passport.authenticate('local', {
      failureRedirect: '/log-in',
      successRedirect: '/dashboard',
      successFlash: 'Welcome',
      failureFlash: `Can't log in. Check emaol and/or password`
    })
  );

globalRouter.get('/dashboard', onlyPrivate, usersController.myAccount);

globalRouter.get('/log-out', onlyPrivate, usersController.logOut);

export default globalRouter;
