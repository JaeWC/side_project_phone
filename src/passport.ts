import passport from 'passport';
import { Strategy } from 'passport-local';
import { prisma } from '../generated/prisma-client';
import { checkPassword } from './utils';

passport.use(
  new Strategy({ usernameField: 'email' }, async (username, password, done) => {
    try {
      const user = await prisma.user({ email: username });
      if (user) {
        const check = await checkPassword(user.password, password);
        if (check) {
          done(null, user);
        } else {
          done(null, false, { message: 'User not found' });
        }
      } else {
        done(null, false, {
          message: 'This user does not exists. You need to create an account'
        });
      }
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user: any, done) => done(null, user.id));

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user({ id });
    done(null, user);
  } catch (e) {
    done(e);
  }
});
