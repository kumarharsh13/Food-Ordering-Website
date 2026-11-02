const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");

exports.renderConfirmationPage = (req, res) => {
  res.render("confirmation", { username: req.user.name, userid: req.user.id });
};

exports.renderMyOrdersPage = async (req, res, next) => {
  try {
    const PAGE_SIZE = 10;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const userDetails = await userModel.findById(req.user.id);
    const { rows: items, total } = await orderModel.getByUserIdAndStatusPaged(
      req.user.id,
      "dispatched",
      page,
      PAGE_SIZE,
    );
    const totalPages = Math.ceil(total / PAGE_SIZE);
    res.render("myorders", {
      userDetails: [userDetails],
      items,
      page,
      totalPages,
    });
  } catch (err) {
    next(err);
  }
};
