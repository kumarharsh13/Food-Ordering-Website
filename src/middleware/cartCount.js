exports.attachCartCount = (req, res, next) => {
  const cart = req.session.cart || [];
  res.locals.cartCount = cart.length;
  next();
};
