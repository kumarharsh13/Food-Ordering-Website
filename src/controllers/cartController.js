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
    const { itemid, quantity } = req.body;
    const userId = req.user.id;
    const currDate = new Date();

    const itemIds = [].concat(itemid);
    const quantities = [].concat(quantity);

    for (let i = 0; i < itemIds.length; i++) {
      const qty = parseInt(quantities[i], 10);
      if (!qty || qty <= 0) continue;

      const item = await menuModel.getById(itemIds[i]);
      if (!item) continue;

      await orderModel.create({
        orderId: uuidv4(),
        userId,
        itemId: itemIds[i],
        quantity: qty,
        price: item.item_price * qty,
        datetime: currDate,
      });
    }

    req.session.cart = [];
    res.render('confirmation', { username: req.user.name, userid: req.user.id });
  } catch (err) {
    next(err);
  }
};
