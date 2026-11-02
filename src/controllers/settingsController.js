const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

exports.renderSettingsPage = (req, res) => {
  res.render("settings", { username: req.user.name, userid: req.user.id });
};

exports.updateAddress = async (req, res, next) => {
  try {
    await userModel.updateAddress(req.user.id, req.body.address);
    req.flash("success", "Address updated");
    res.redirect("/settings");
  } catch (err) {
    next(err);
  }
};

exports.updateContact = async (req, res, next) => {
  try {
    await userModel.updateContact(req.user.id, req.body.mobileno);
    req.flash("success", "Contact updated");
    res.redirect("/settings");
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await userModel.findByIdWithPassword(req.user.id);
    if (!user) return res.redirect("/signin");
    const match = await bcrypt.compare(
      req.body.old_password,
      user.user_password,
    );
    if (!match) {
      req.flash("error", "Incorrect current password");
      return res.redirect("/settings");
    }
    const hashedPassword = await bcrypt.hash(req.body.new_password, 10);
    await userModel.updatePassword(req.user.id, hashedPassword);
    req.flash("success", "Password updated");
    res.redirect("/settings");
  } catch (err) {
    next(err);
  }
};
