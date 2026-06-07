const userModel = require("../models/userModel");
const orderDispatchModel = require("../models/orderDispatchModel");

exports.renderConfirmationPage = (req, res) => {
  res.render("confirmation", { username: req.user.name, userid: req.user.id });
};

exports.renderMyOrdersPage = async (req, res, next) => {
  try {
    const userDetails = await userModel.findById(req.user.id);
    const items = await orderDispatchModel.getByUserId(req.user.id);
    res.render("myorders", { userDetails: [userDetails], items });
  } catch (err) {
    next(err);
  }
};
