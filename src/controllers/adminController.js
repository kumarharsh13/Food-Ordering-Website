const bcrypt = require("bcryptjs");
const adminModel = require("../models/adminModel");
const menuModel = require("../models/menuModel");
const orderModel = require("../models/orderModel");

exports.renderAdminSignInPage = (req, res) => {
  res.render("admin_signin");
};

exports.adminSignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findByEmail(email);
    if (!admin) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/admin_signin");
    }
    const match = await bcrypt.compare(password, admin.admin_password);
    if (!match) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/admin_signin");
    }
    req.session.admin = { id: admin.admin_id, name: admin.admin_name };
    res.redirect("/adminHomepage");
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

    if (!req.files || !req.files.FoodImg) {
      req.flash("error", "Image is required");
      return res.redirect("/admin_addFood");
    }

    const fimage = req.files.FoodImg;
    const MAX_SIZE = 5 * 1024 * 1024;
    if (fimage.size > MAX_SIZE) {
      req.flash("error", "Image must be under 5 MB");
      return res.redirect("/admin_addFood");
    }

    const { fileTypeFromBuffer } = require("file-type");
    const detected = await fileTypeFromBuffer(fimage.data);
    const ALLOWED = ["image/jpeg", "image/png"];
    if (!detected || !ALLOWED.includes(detected.mime)) {
      req.flash("error", "Only JPEG and PNG images are allowed");
      return res.redirect("/admin_addFood");
    }

    const safeName = `${Date.now()}-${fimage.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const uploadPath = `public/images/dish/${safeName}`;

    await fimage.mv(uploadPath);
    await menuModel.addItem({
      name: FoodName,
      type: FoodType,
      category: FoodCategory,
      serving: FoodServing,
      calories: FoodCalories,
      price: FoodPrice,
      rating: FoodRating,
      img: safeName,
    });
    req.flash("success", "Food item added successfully");
    res.redirect("/admin_addFood");
  } catch (err) {
    next(err);
  }
};

exports.renderViewDispatchOrdersPage = async (req, res, next) => {
  try {
    const PAGE_SIZE = 20;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const { rows: orders, total } = await orderModel.getPendingPaged(
      page,
      PAGE_SIZE,
    );
    const totalPages = Math.ceil(total / PAGE_SIZE);
    res.render("admin_view_dispatch_orders", {
      username: req.admin.name,
      userid: req.admin.id,
      orders,
      page,
      totalPages,
    });
  } catch (err) {
    next(err);
  }
};

exports.dispatchOrders = async (req, res, next) => {
  try {
    const totalOrder = req.body.order_id_s;
    const orderIds = [...new Set([].concat(totalOrder))];
    for (const orderId of orderIds) {
      await orderModel.setDispatched(orderId);
    }
    const orders = await orderModel.getPending();
    res.render("admin_view_dispatch_orders", {
      username: req.admin.name,
      userid: req.admin.id,
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
    const { item_id, NewFoodPrice } = req.body;
    await menuModel.updatePriceById(
      parseInt(item_id, 10),
      parseInt(NewFoodPrice, 10),
    );
    req.flash("success", "Price updated");
    res.redirect("/admin_change_price");
  } catch (err) {
    next(err);
  }
};
