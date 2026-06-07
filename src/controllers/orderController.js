const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');

exports.renderConfirmationPage = (req, res) => {
  res.render('confirmation', { username: req.user.name, userid: req.user.id });
};

exports.renderMyOrdersPage = async (req, res, next) => {
  try {
    const userDetails = await userModel.findById(req.user.id);
    const items = await orderModel.getByUserIdAndStatus(req.user.id, 'dispatched');
    res.render('myorders', { userDetails: [userDetails], items });
  } catch (err) {
    next(err);
  }
};
