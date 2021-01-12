const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 8081;
const bodyParser = require("body-parser");
const api_routes = require("./api/routers/routes");
const mongoose = require('mongoose');
const signale = require('signale');
const config = require("./config/config");
const expressValidator = require('express-validator'); 
const session = require('express-session');

// initializing express
const app = express();
//configure database 
  
mongoose.connect(config.mongodb.dbURI,config.mongodb.setting)
  .then(() => {
    signale.success('*****Database Connection Successfull******');
  }).catch(err => {
    signale.fatal(new Error(err));
    signale.warn('Could not connect to Database. Exiting now...');
    process.exit();
  })
let db = mongoose.connection;


//configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json({
  type: ['application/json', 'text/plain']
}));

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  secret: config.session.secretString,
  resave: true,
  saveUninitialized: false
}))

// //sessionChecker middlewares
let sessionChecker = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/login')
  } else {
    next()
  }
}

//check if already logged in.
let loggedIn = (req, res, next) => {
  if (req.session.user) {
    return res.redirect(`/user/game`);
  }
  return next()

}
 


// routes
app.use("/user", api_routes);

app.get("/login",loggedIn,(req,res) => {
   res.render("Login");
});

app.get('/register',loggedIn,(req,res) => {
  res.render('Register');
})

app.get("/",(req,res) => {
  let loggedIn = false;
  if(req.session.user){
    loggedIn = true;
  }
   res.render("Home",{loggedIn});
})

app.get("/rules",(req,res) => {
  let loggedIn = false;
  if(req.session.user){
    loggedIn = true;
  }
   res.render("Rules",{loggedIn});
})


app.get('/logout', sessionChecker, (req, res) => {
  req.session.destroy(err => {
    if (err) {      
      return next(err)
    }
    return res.redirect('/')
  })
})

app.get("*",(req,res) => {
   res.render("NotFound");
})


app.listen(PORT, () => {
  signale.success(`Server is running on ${PORT}`);
});
