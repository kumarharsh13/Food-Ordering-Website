const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

exports.renderSettingsPage = (req, res) => {
  const cartCount = req.session.cart ? req.session.cart.length : 0;
  res.render("settings", {
    username: req.user.name,
    userid: req.user.id,
    item_count: cartCount,
  });
};

exports.updateAddress = async (req, res, next) => {
  try {
    await userModel.updateAddress(req.user.id, req.body.address);
    const cartCount = req.session.cart ? req.session.cart.length : 0;
    res.render("settings", {
      username: req.user.name,
      userid: req.user.id,
      item_count: cartCount,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateContact = async (req, res, next) => {
  try {
    await userModel.updateContact(req.user.id, req.body.mobileno);
    const cartCount = req.session.cart ? req.session.cart.length : 0;
    res.render("settings", {
      username: req.user.name,
      userid: req.user.id,
      item_count: cartCount,
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await userModel.findByEmail(req.user.email);
    if (!user) {
      return res.render("signin");
    }
    const match = await bcrypt.compare(req.body.old_password, user.user_password);
    if (!match) {
      const cartCount = req.session.cart ? req.session.cart.length : 0;
      return res.render("settings", {
        username: req.user.name,
        userid: req.user.id,
        item_count: cartCount,
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.new_password, 10);
    await userModel.updatePassword(req.user.id, hashedPassword);
    const cartCount = req.session.cart ? req.session.cart.length : 0;
    res.render("settings", {
      username: req.user.name,
      userid: req.user.id,
      item_count: cartCount,
    });
  } catch (err) {
    next(err);
  }
};
