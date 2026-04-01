const { v4: uuidv4 } = require("uuid");
const menuModel = require("../models/menuModel");
const orderModel = require("../models/orderModel");

exports.renderCart = async (req, res, next) => {
  try {
    const cart = req.session.cart || [];
    const uniqueIds = [...new Set(cart)];
    const items = await menuModel.getByIds(uniqueIds);
    res.render("cart", {
      username: req.user.name,
      userid: req.user.id,
      items,
      item_count: uniqueIds.length,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCart = (req, res) => {
  const cartItems = req.body.cart || [];
  const uniqueItems = [...new Set(cartItems)];
  req.session.cart = uniqueItems;
  res.sendStatus(200);
};

exports.checkout = async (req, res, next) => {
  try {
    const { itemid, quantity, subprice } = req.body;
    const userId = req.user.id;
    const currDate = new Date();

    if (Array.isArray(itemid) && Array.isArray(quantity) && Array.isArray(subprice)) {
      for (let i = 0; i < itemid.length; i++) {
        if (quantity[i] != 0) {
          await orderModel.create({
            orderId: uuidv4(),
            userId,
            itemId: itemid[i],
            quantity: quantity[i],
            price: subprice[i] * quantity[i],
            datetime: currDate,
          });
        }
      }
    } else {
      if (quantity != 0) {
        await orderModel.create({
          orderId: uuidv4(),
          userId,
          itemId: itemid,
          quantity,
          price: subprice * quantity,
          datetime: currDate,
        });
      }
    }

    req.session.cart = [];
    res.render("confirmation", { username: req.user.name, userid: req.user.id });
  } catch (err) {
    next(err);
  }
};
