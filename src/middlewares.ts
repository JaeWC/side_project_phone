export const localsMiddleware = (req, res, next) => {
  res.locals.currentUser = req.user;
  next();
};

export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    req.flash('error', `Log in to continue`);
    req.session.previousPage = req.originalUrl;
    res.redirect('/log-in');
  }
};

export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect('/dashboard');
  } else {
    next();
  }
};
