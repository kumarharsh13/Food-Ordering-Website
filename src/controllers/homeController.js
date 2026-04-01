const menuModel = require("../models/menuModel");

exports.renderIndexPage = (req, res) => {
  res.render("index");
};

exports.renderHomePage = async (req, res, next) => {
  try {
    const items = await menuModel.getAll();
    const cartCount = req.session.cart ? req.session.cart.length : 0;
    res.render("homepage", {
      username: req.user.name,
      userid: req.user.id,
      items,
    });
  } catch (err) {
    next(err);
  }
};
