const express = require('express');
const router = express.Router();
const user = require('../controllers/user-controller');
const game = require('../controllers/game-controller');
const User = require('../models/User');

// sessionChecker middlewares
let sessionChecker = (req, res, next) => {
    if (!req.session.user) {
      res.redirect('/login');
    } else {
      next()
    }
  }

let CheckValidURL = async(req,res,next) => {
  try{
    let uniq_id = req.params.id;
    let requestedUser = await User.findOne({passwordResetId: uniq_id});
    if(!requestedUser)
    {
       // redirecting to random url so it goes to notfoundpage
       if(req.method === "GET") return res.render('NotFound',{message: "Token Expired or Invalid. Send a new Request"});
       return res.status(500).jsonp({message: "Token Expired or Invalid. Send a new Request"});
    }
    next();
  }
  catch(err)
  {
     return res.status(500).jsonp({message: "Internal Server Error"});
  } 
}


// login

router.post('/login',user.loginUser);

// game
router.get('/game',sessionChecker,game.renderGrid);
router.post('/game',sessionChecker,user.saveGame);
router.post('/check',sessionChecker,game.checkAnswer);
router.get('/score', sessionChecker, game.getScore);

// Completion Page
router.get('/afterGame',sessionChecker,user.renderAfterGame);  // url isnt that great plis change

// Scoreboard
router.get('/leaderboard',sessionChecker,user.renderLeaderboard);

// register
router.post('/register',user.regUser);

// verify email
router.get('/verify',user.verifyEmail);

// Reset Password Request Page
router.get('/forgotpassword',user.renderForgotPasswordRequest);
router.post('/forgotPasswordRequest',user.forgotPasswordRequest);

// Reset Password Page
router.get('/resetPassword/:id',user.renderResetPassword);
router.post('/resetPasswordRequest/:id',CheckValidURL,user.changePassword);

module.exports = router;
