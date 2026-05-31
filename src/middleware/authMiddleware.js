exports.requireUser = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    next();
  } else {
    res.redirect("/signin");
  }
};

exports.requireAdmin = (req, res, next) => {
  if (req.session && req.session.admin) {
    req.admin = req.session.admin;
    next();
  } else {
    res.redirect("/admin_signin");
  }
};
