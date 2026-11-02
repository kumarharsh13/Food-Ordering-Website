const menuModel = require("../models/menuModel");

exports.renderIndexPage = (req, res) => {
  res.render("index");
};

exports.renderHomePage = async (req, res, next) => {
  try {
    const items = await menuModel.getAll();
    res.render("homepage", {
      username: req.user.name,
      userid: req.user.id,
      items,
    });
  } catch (err) {
    next(err);
  }
};
