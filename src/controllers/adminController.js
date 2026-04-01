const adminModel = require("../models/adminModel");
const menuModel = require("../models/menuModel");
const orderModel = require("../models/orderModel");
const orderDispatchModel = require("../models/orderDispatchModel");

exports.renderAdminSignInPage = (req, res) => {
  res.render("admin_signin");
};

exports.adminSignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findByCredentials(email, password);
    if (!admin) {
      return res.render("admin_signin");
    }
    req.session.admin = { id: admin.admin_id, name: admin.admin_name };
    res.render("adminHomepage", {
      username: admin.admin_name,
      userid: admin.admin_id,
    });
  } catch (err) {
    next(err);
  }
};

exports.renderAdminHomepage = (req, res) => {
  res.render("adminHomepage", {
    username: req.admin.name,
    userid: req.admin.id,
  });
};

exports.renderAddFoodPage = (req, res) => {
  res.render("admin_addFood", {
    username: req.admin.name,
    userid: req.admin.id,
  });
};

exports.addFood = async (req, res, next) => {
  try {
    const {
      FoodName,
      FoodType,
      FoodCategory,
      FoodServing,
      FoodCalories,
      FoodPrice,
      FoodRating,
    } = req.body;

    if (!req.files) {
      return res.status(400).send("Image was not uploaded");
    }

    const fimage = req.files.FoodImg;
    if (fimage.mimetype !== "image/jpeg" && fimage.mimetype !== "image/png") {
      return res.render("admin_addFood", {
        username: req.admin.name,
        userid: req.admin.id,
      });
    }

    await fimage.mv("public/images/dish/" + fimage.name);
    await menuModel.addItem({
      name: FoodName,
      type: FoodType,
      category: FoodCategory,
      serving: FoodServing,
      calories: FoodCalories,
      price: FoodPrice,
      rating: FoodRating,
      img: fimage.name,
    });
    res.redirect("/admin_addFood");
  } catch (err) {
    next(err);
  }
};

exports.renderViewDispatchOrdersPage = async (req, res, next) => {
  try {
    const orders = await orderModel.getAll();
    res.render("admin_view_dispatch_orders", {
      username: req.admin.name,
      userid: req.admin.id,
      orders,
    });
  } catch (err) {
    next(err);
  }
};

exports.dispatchOrders = async (req, res, next) => {
  try {
    const totalOrder = req.body.order_id_s;
    const unique = [...new Set(Array.isArray(totalOrder) ? totalOrder : [totalOrder])];

    for (const orderId of unique) {
      const order = await orderModel.getById(orderId);
      if (order) {
        await orderDispatchModel.create({
          orderId: order.order_id,
          userId: order.user_id,
          itemId: order.item_id,
          quantity: order.quantity,
          price: order.price,
          datetime: new Date(),
        });
        await orderModel.deleteById(order.order_id);
      }
    }

    const orders = await orderModel.getAll();
    res.render("admin_view_dispatch_orders", {
      username: req.admin.name,
      orders,
    });
  } catch (err) {
    next(err);
  }
};

exports.renderChangePricePage = async (req, res, next) => {
  try {
    const items = await menuModel.getAll();
    res.render("admin_change_price", {
      username: req.admin.name,
      items,
    });
  } catch (err) {
    next(err);
  }
};

exports.changePrice = async (req, res, next) => {
  try {
    const { item_name, NewFoodPrice } = req.body;
    const item = await menuModel.findByName(item_name);
    if (!item) {
      return res.status(400).send("Item not found");
    }
    await menuModel.updatePrice(item_name, NewFoodPrice);
    res.render("adminHomepage", {
      username: req.admin.name,
      userid: req.admin.id,
    });
  } catch (err) {
    next(err);
  }
};
