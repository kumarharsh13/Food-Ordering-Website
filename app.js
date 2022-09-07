// Loading and Using Modules Required
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

// Connectiong to Database
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'foodorderingwesitedb'
});

connection.connect();

/*****************************  User-End Portal ***************************/

// Rendering Index Page
app.get("/", (req, res) => {
  res.render("index");
});

// Rendering SignUp Page
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res) => {
  const name = req.body.name;
  const address = req.body.address;
  const email = req.body.email;
  const mobile = req.body.mobile;
  const password = req.body.password;

  connection.query('INSERT INTO users (user_name, user_address, user_email, user_password, user_mobileno) VALUES (?, ?, ?, ?, ?)', [name, address, email, password, mobile], function (error, results, fields) {
    if (error) console.log(error);
    else res.render('signin');
  });
});

// Rendering SignIn Page
app.get("/signin", (req, res) => {
  res.render("signin");
});

app.post("/signin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  connection.query('SELECT user_email, user_password FROM users WHERE user_email = ?', [email], function (error, results) {
    if (error) {
      //res.send("<h1> Invalid Email</h1>");
      res.render('signin');
    }
    else {
      if (results[0].user_password === password) {
        connection.query('SELECT user_id, user_name FROM users WHERE user_email = ?', [email], function (error, results) {
          if (error) res.status(404);
          else {
            const userid = results[0].user_id;
            const username = results[0].user_name;
            res.cookie('cookuid', userid);
            res.cookie('cookuname', username);
            res.redirect('/homepage');
          }
        });
      }
      else {
        //res.send("<h1> Invalid Password</h1>");
        res.render('signin');
      }
    }
  });
});

// Rendering Home Page
app.get("/homepage", (req,res) => {
  const sid = req.cookies.cookuid;
  const suname = req.cookies.cookuname;
  connection.query('SELECT user_id, user_name FROM users WHERE user_id = ? and user_name = ?', [sid,suname], function (error, results) {
    if(!error && results) {
      connection.query('SELECT * FROM menu',  function (error, results) {
        if(!error) {
          res.render('homepage',{username: suname, userid: sid, items: results});
        }
      });
    }
    else {
      res.render('signin');
    }
  });
});

// My Cart Detail Accessing
let citems = [];
let citemdetails = [];
let item_in_cart = 0;
function getItemDetails(citems,size) {
  citems.map((item) => {
    connection.query('SELECT * FROM menu WHERE item_id= ?', [item], function(error, results_item) {
      citemdetails.push(results_item[0]);
    });
  });
  item_in_cart = size;
}

// Rendering My Cart
app.get("/cart", (req,res) => {
  const sid = req.cookies.cookuid;
  const suname = req.cookies.cookuname;
  connection.query('SELECT user_id, user_name FROM users WHERE user_id = ? and user_name = ?', [sid,suname], function (error, results) {
    if(!error && results) {
      res.render('cart',{username: suname, userid: sid, items: citemdetails, item_count: item_in_cart});
    }
    else {
      res.render('signin');
    }
  });
});

let cart_items = [];
app.post("/cart", (req,res) => {
  cart_items = req.body.cart;
  let unique = [];
  cart_items.forEach(index => {
    if(!unique.includes(index)) {
      unique.push(index);
    }
  });
  getItemDetails(unique,unique.length);
});


// Rendering for checking out
app.post("/checkout", (req,res) => {
  const sid = req.cookies.cookuid;
  const suname = req.cookies.cookuname;
  connection.query('SELECT user_id, user_name FROM users WHERE user_id = ? and user_name = ?', [sid,suname], function (error, results) {
    if(!error && results) {
      connection.query('SELECT * FROM menu',  function (error, results) {
        if(!error) {
          const item_id = req.body.itemid;
          const quantity = req.body.quantity;
          const total_sub_price = req.body.subprice;
          const userid = req.cookies.cookuid;
          let currDate = new Date();
          if(item_id.length == 1) {
            if(quantity[0]!=0) {
              connection.query('INSERT INTO orders (order_id, user_id, item_id, quantity, price, datetime) VALUES (?, ?, ?, ?, ?, ?)',[uuidv4(), userid, item_id, quantity, total_sub_price*quantity, currDate], function(error,results,fields) {
                if(error) {
                  console.log(error);
                  res.send(500);
                }
                else {
                  citems = [];
                  citemdetails = [];
                  item_in_cart = 0;
                  getItemDetails(citems,0);
                  res.render('confirmation',{username: suname, userid: sid});
                }
              });
            }
          }
          else {
          item_id.map((item,i) => {
            if(quantity[i]!=0) {
              connection.query('INSERT INTO orders (order_id, user_id, item_id, quantity, price, datetime) VALUES (?, ?, ?, ?, ?, ?)',[uuidv4(), userid, item, quantity[i], total_sub_price[i]*quantity[i], currDate], function(error,results,fields) {
                if(error) {
                  console.log(error);
                  res.send(500);
                }
              });
            }
          });
        }
        citems = [];
        citemdetails = [];
        item_in_cart = 0;
        getItemDetails(citems,0);
        res.render('confirmation',{username: suname, userid: sid});
      }
      });
    }
    else {
      res.render('signin');
    }
  });
});


// Rendering Order Confirmation Page
app.get("/confirmation",(req,res) => {
    const sid = req.cookies.cookuid;
    const suname = req.cookies.cookuname;
    connection.query('SELECT user_id, user_name FROM users WHERE user_id = ? and user_name = ?', [sid,suname], function (error, results) {
      if(!error && results) {
        res.render('confirmation',{username: suname, userid: sid});
      }
      else {
        res.render('signin');
      }
    });
});

app.post("/confirmation", (req,res) => {
  res.render('confirmation');
});

// Rendering MyOrder Page
app.get("/myorders", (req,res) => {
  const sid = req.cookies.cookuid;
  const suname = req.cookies.cookuname;
  connection.query('SELECT user_id, user_name, user_address, user_email, user_mobileno FROM users WHERE user_id = ? and user_name = ?', [sid,suname], function (error, resultUser) {
    if(!error && resultUser) {
      connection.query('SELECT order_dispatch.order_id, order_dispatch.user_id, order_dispatch.quantity, order_dispatch.price, order_dispatch.datetime, menu.item_id, menu.item_name, menu.item_img FROM order_dispatch, menu WHERE order_dispatch.user_id = ? AND menu.item_id=order_dispatch.item_id ORDER BY order_dispatch.datetime DESC',[sid],function (error, results) {
        if(!error) {
          res.render('myorders',{userDetails: resultUser,  items: results, item_count: item_in_cart});
        }
      });
    }
    else {
      res.render('signin');
    }
  });
});


// Rendering Settings Page
app.get("/settings",(req,res) => {
  const sid = req.cookies.cookuid;
  const suname = req.cookies.cookuname;
  connection.query('SELECT user_id, user_name FROM users WHERE user_id = ? and user_name = ?', [sid,suname], function (error, results) {
    if(!error && results) {
      res.render('settings',{username: suname, userid: sid, item_count: item_in_cart});
    }
  });
});

// Changing Address
app.post("/address", (req,res) => {
  const sid = req.cookies.cookuid;
  const suname = req.cookies.cookuname;
  connection.query('SELECT user_id, user_name FROM users WHERE user_id = ? and user_name = ?', [sid,suname], function (error, results) {
    if(!error && results) {
      const address=req.body.address;
      connection.query('UPDATE users SET user_address = ? WHERE user_id = ?',[address,sid], function (error,results_m) {
        if(!error) {
          res.render('settings',{username: suname, userid: sid, item_count: item_in_cart});
        }
      });
    }
    else {
      res.render('signin');
    }
  });
});

// Changing Contact
app.post("/contact", (req,res) => {
  const sid = req.cookies.cookuid;
  const suname = req.cookies.cookuname;
  connection.query('SELECT user_id, user_name FROM users WHERE user_id = ? and user_name = ?', [sid,suname], function (error, results) {
    if(!error && results) {
      const mobileno=req.body.mobileno;
      connection.query('UPDATE users SET user_mobileno = ? WHERE user_id = ?',[mobileno,sid], function (error,results_m) {
        if(!error) {
          res.render('settings',{username: suname, userid: sid, item_count: item_in_cart});
        }
      });
    }
    else {
      res.render('signin');
    }
  });
});

// Changing Password
app.post("/password", (req,res) => {
  const sid = req.cookies.cookuid;
  const suname = req.cookies.cookuname;
  connection.query('SELECT user_id, user_name FROM users WHERE user_id = ? and user_name = ?', [sid,suname], function (error, results) {
    if(!error && results) {
      const new_password=req.body.new_password;
      const old_password=req.body.old_password;
      //console.log(old_password,new_password);
      connection.query('UPDATE users SET user_password = ? WHERE user_id = ? AND user_password = ?',[new_password,sid,old_password], function (error,results_m) {
        if(!error) {
          console.log(results_m[0].user_password);
          res.render('settings',{username: suname, userid: sid, item_count: item_in_cart});
        }
      });
    }
    else {
      res.render('signin');
    }
  });
});
/***************************************** Admin End Portal ********************************************/
// Rendering Admin SignIn
app.get("/admin_signin",(req,res) => {
  res.render('admin_signin');
});

app.post("/admin_signin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  connection.query('SELECT admin_email, admin_password FROM admin WHERE admin_email = ?', [email], function (error, results) {
    if (error) {
      //res.send("<h1> Invalid Email</h1>");
      res.render('/signin');
    }
    else {
      if (results[0].admin_password === password) {
        connection.query('SELECT admin_id, admin_name FROM admin WHERE admin_email = ?', [email], function (error, results) {
          if (error) res.status(404);
          else {
            aid = results[0].admin_id;
            aname = results[0].admin_name;
            res.cookie('cookuid', aid);
            res.cookie('cookuname', aname);
            res.render('adminHomepage');
          }
        });
      }
      else {
        //res.send("<h1> Invalid Password</h1>");
        res.render("/admin_signin");
      }
    }
  });
});

// Rendering AdminHomepage
app.get("/adminHomepage",(req,res) => {
  const sid = req.cookies.cookuid;
  const suname = req.cookies.cookuname;
  connection.query('SELECT admin_id, admin_name FROM admin WHERE admin_email = ? and admin_name = ?', [sid,suname], function (error, results) {
    if(!error && results) {
      res.render('adminHomepage',{username: suname, userid: sid, items: results});
    }
    else {
      res.render('admin_signin');
    }
  });
});

// Rendering Admin addmin new food
app.get("/admin_addFood",(req,res) => {
  const sid = req.cookies.cookuid;
  const suname = req.cookies.cookuname;
  connection.query('SELECT admin_id, admin_name FROM admin WHERE admin_id = ? and admin_name = ?', [sid,suname], function (error, results) {
    if(!error && results) {
      res.render('admin_addFood',{username: suname, userid: sid, items: results});
    }
    else {
      res.render('admin_signin');
    }
  });
});

app.post("/admin_addFood",(req,res) => {
  const fname = req.body.FoodName;
  const ftype = req.body.FoodType;
  const fcategory = req.body.FoodCategory;
  const fserving = req.body.FoodServing;
  const fcalories = req.body.FoodCalories;
  const fprice = req.body.FoodPrice;
  const frating = req.body.FoodRating
  if(!req.files) {
    return res.status(400).send("Image was not Uploaded");
  }
  const fimage = req.files.FoodImg;
  const fimage_name = fimage.name;
  if(fimage.mimetype == "image/jpeg" || fimage.mimetype == "image/png") {
    fimage.mv('public/images/dish/'+fimage_name, function(err) {
      if(err) {
        return res.status(500).send(err);
      }
      connection.query('INSERT INTO menu (item_name, item_type, item_category, item_serving, item_calories, item_price, item_rating, item_img) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [fname, ftype, fcategory, fserving, fcalories, fprice, frating, fimage_name], function (error, results, fields) {
        if (error) console.log(error);
        else {
          //res.send("<h1>Item Added Successfully</h1>");
          res.redirect('/admin_addFood');
        }
      });
    });
  }
  else {
    //res.send("<h1>Not Successfull</h1>")
    res.render('admin_addFood');
  }
});

// Rendering Admin View and Dispatching Orders
app.get("/admin_view_dispatch_orders",(req,res) => {
  const sid = req.cookies.cookuid;
  const suname = req.cookies.cookuname;
  connection.query('SELECT admin_id, admin_name FROM admin WHERE admin_id = ? and admin_name = ?', [sid,suname], function (error, results) {
    if(!error && results) {
      connection.query('SELECT * FROM orders ORDER BY datetime', function (error,results2) {
        res.render('admin_view_dispatch_orders',{username: suname, userid: sid, orders: results2});
      });
    }
    else {
      res.render('admin_signin');
    }
  });
});

let totalOrder = [];

app.post("/admin_view_dispatch_orders", (req,res) => {
  totalOrder = req.body.order_id_s;
  //console.log(totalOrder);
  let unique = [];
  totalOrder.forEach(index => {
    if(!unique.includes(index)) {
      unique.push(index);
    }
  });
  //console.log(unique);
  for(let i=0;i<unique.length;i++) {
    connection.query('SELECT * FROM orders WHERE order_id = ?',[unique[i]], function(error,resultsItem) {
      //console.log(resultsItem[0]);
      if(!error) {
        let currDate = new Date();
        connection.query('INSERT INTO order_dispatch (order_id, user_id, item_id, quantity, price, datetime) VALUES (?, ?, ?, ?, ?, ?)',[resultsItem[0].order_id,resultsItem[0].user_id,resultsItem[0].item_id,resultsItem[0].quantity,resultsItem[0].price,currDate], function(error,results) {
          if(!error) {
            connection.query('DELETE FROM orders WHERE order_id= ?',[resultsItem[0].order_id], function(error,results2) {
              if(!error) {
              }
              else {
                res.status(500).send('Something Went Wrong');
              }
            });
          }
          else {
            res.status(500).send('Something Went Wrong');
          }
        });
      }
      else {
        res.status(500).send('Something Went Wrong');
      }
    });
  }

  connection.query('SELECT * FROM orders ORDER BY datetime', function (error,results2_dis) {
    res.render('admin_view_dispatch_orders',{username: req.cookies.cookuname, orders: results2_dis});
  });


});

// Render change price page
app.get("/admin_change_price", (req,res) => {
  const sid = req.cookies.cookuid;
  const suname = req.cookies.cookuname;
  connection.query('SELECT admin_id, admin_name FROM admin WHERE admin_id = ? and admin_name = ?', [sid,suname], function (error, results) {
    if(!error && results) {
      connection.query('SELECT * FROM menu',  function (error, results) {
        if(!error) {
          res.render('admin_change_price',{username: req.cookies.cookuname, items: results});
        }
      });
    }
    else {
      res.render('signin');
    }
  });
});

app.post("/admin_change_price", (req,res) => {
  const sid = req.cookies.cookuid;
  const suname = req.cookies.cookuname;
  connection.query('SELECT user_id, user_name FROM users WHERE user_id = ? and user_name = ?', [sid,suname], function (error, results) {
    if(!error && results) {
      const item_name=req.body.item_name;
      const new_food_price=req.body.NewFoodPrice;
      //console.log(item_name,new_food_price);
      connection.query('SELECT item_name FROM menu WHERE item_name = ?', [item_name], function (error, results1) {
        if(!error) {
          connection.query('UPDATE menu SET item_price = ? WHERE item_name = ?',[new_food_price,item_name], function (error,results2) {
            if(!error) {
              res.render('adminHomepage');
            }
            else {
              res.status(500).send('Something Went Wrong A');
            }
          });
        }
        else {
          res.status(500).send('Something Went Wrong B');
        }
      });
    }
    else {
      res.render('adminHomepage');
    }
  });
});

// Rendering Login-Out
app.get("/logout",(req,res) => {
  res.clearCookie();
  return res.redirect("/signin");
});

// Port Listener
app.listen(port, () => {
  console.log(`Listening at port: ${port}`);
});