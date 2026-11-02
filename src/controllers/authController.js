const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

exports.renderSignUpPage = (req, res) => {
  res.render("signup");
};

exports.signUp = async (req, res, next) => {
  try {
    const { name, address, email, mobile, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.create({
      name,
      address,
      email,
      password: hashedPassword,
      mobile,
    });
    req.flash("success", "Account created. Please sign in.");
    res.redirect("/signin");
  } catch (err) {
    next(err);
  }
};

exports.renderSignInPage = (req, res) => {
  res.render("signin");
};

exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/signin");
    }
    const match = await bcrypt.compare(password, user.user_password);
    if (!match) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/signin");
    }
    req.session.user = { id: user.user_id, name: user.user_name };
    res.redirect("/homepage");
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/signin");
  });
};
