const userModel = require("../models/userModel");
const orderDispatchModel = require("../models/orderDispatchModel");

exports.renderConfirmationPage = (req, res) => {
  res.render("confirmation", { username: req.user.name, userid: req.user.id });
};

exports.renderMyOrdersPage = async (req, res, next) => {
  try {
    const userDetails = await userModel.findById(req.user.id);
    const items = await orderDispatchModel.getByUserId(req.user.id);
    const cartCount = req.session.cart ? req.session.cart.length : 0;
    res.render("myorders", {
      userDetails: [userDetails],
      items,
      item_count: cartCount,
    });
  } catch (err) {
    next(err);
  }
};
