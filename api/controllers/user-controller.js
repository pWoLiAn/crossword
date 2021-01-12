const User = require('../models/User');
const signale = require('signale');
const Imap = require('imap');
const config = require('../../config/config');
const utils = require('../helpers/utils');
const bcrypt = require('bcryptjs');
const validator = require('validator');

exports.renderLoginform = (req,res) => {
    res.render("login");
}

loginHelper = async (email, password, cb) => {
    if (!validator.isEmail(email)) {
        return new utils.CustomError("Enter a valid email");
    }
    let res = await User.findOne({ email: email });
    let isWebmail = (/^[a-zA-Z0-9._%+-]+@nitt+\.edu$/).test(email);
    
    // If webmail check IMAP
    if(isWebmail){
        try {
            let rollNumber = email.split('@')[0];

            // Authenticate with IMAP
            let imapResponse = await utils.imapAuthenticate(rollNumber, password);
            if(res == null){
                // Register with IMAP 
                let user = {
                    email: email,
                    password: "",
                    username: rollNumber,
                    mobileNumber: "",
                    isVerified: true,
                    verificationCode: "",
                    passwordResetId: ""
                };
                let newUser = new User(user);
                await newUser.save();
                return newUser;
            }
            else {
                return res;    
            }
        } catch (err) {
            // IMAP failed
            // console.log(err);
            return new utils.CustomError("Invalid webmail credentials");
        }
    }

    if (res == null) {
        return new utils.CustomError("User not found");
    }
    //Check for verified email
    if (!res.isVerified) {
        return new utils.CustomError("Email not verified");
    }
    let match = await bcrypt.compare(password, res.password);
    if (match) {
        return res;
    }
    return new utils.CustomError("Password Mismatch");
}


exports.loginUser = async (req,res) => {
    if(req.body.email && req.body.password)
    {
        try{
            let loginResult = await loginHelper(req.body.email, req.body.password);
            if(loginResult instanceof utils.CustomError)
            {
                return res.status(400).jsonp({ message: loginResult.message });
            }
            req.session.user = {
                name: loginResult.username
            }
            return res.status(200).jsonp({message : "login successful"});
        }
        catch(err)
        {
            // console.log(err);
            return res.status(500).jsonp({ message: "Internal Server Error" });
        }
    }
    else{
        return res.status(400).jsonp({ message: "Required Fields are empty" });
    }
}

exports.renderAfterGame = async (req,res) => {
    const user = await User.findOne({ username: req.session.user.name });
    res.render('AfterGame',{score: user.score});
}

exports.saveGame = (req,res) => {
    signale.success("Game saved");
}

exports.renderLeaderboard = async(req,res) => {
    
    try{
        let users = await User.find().sort({score:-1,lastUpdated:1});
        // console.log(users);   
        res.render('Leaderboard',{
            users: users
        });
    }
    catch(err){
        console.error(err);
    }
}

registerHelper = async(req) => {
    if (!req.body.email || !validator.isEmail(req.body.email)) {
        return new utils.CustomError("Not a valid email");
    }
    req.body.email = req.body.email.toLowerCase();
    if (!req.body.password || req.body.password.length < 6) {
        return new utils.CustomError("Password should be at least 6 characters excluding leading or trailing whitespaces");
    }
    if (!req.body.username || req.body.username.length == 0) {
        return new utils.CustomError("Username should not be empty");
    }
    if (!req.body.confirmPassword || req.body.confirmPassword != req.body.password) {
        return new utils.CustomError("Passwords doesn't match");
    }
    if (!validator.isMobilePhone(req.body.mobileNumber)) {
        return new utils.CustomError("Enter a valid 10 digit mobile number");
    }

    try{
        let dupEmail = await User.findOne({email: req.body.email}); 
        let dupUsername = await User.findOne({username: req.body.username});

        if(dupEmail)
        {
            return new utils.CustomError("Email already exists");
        }
        if(dupUsername)
        {
            return new utils.CustomError("Username already exists");
        }
        req.body.password = await bcrypt.hash(req.body.password, utils.SALT_ROUNDS);

        let user ={
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
            mobileNumber: req.body.mobileNumber,
            isVerified: true,
            verificationCode: utils.generateRandomString(10),
            passwordResetId: ""
        }
        let newUser = new User(user);
        await newUser.save();
        return newUser;
    }
    catch (err) {
        if (!(err instanceof utils.CustomError)) {
            console.log(err);
            return new utils.CustomError("Internal Server Error");
        }
        else {
            return new utils.CustomError(err.message);
        }
    }
}

exports.regUser = async(req,res) => {

    try{
       let registerResult = await registerHelper(req);
       
       if(registerResult instanceof utils.CustomError ){
        return res.status(400).jsonp({ message: registerResult.message });
       }
       return res.status(200).jsonp({message: "Registration Successful! , An email has been sent to your email id for verfication"});
    } 
    catch(err)
    {
        // console.error(err);
        return res.status(500).jsonp({message: "Internal Server Error"})
    }
}

exports.verifyEmail = async(req,res) => {
   
    try{
        const { email, code } = req.query; 
        let user = await User.findOne({email:email,verificationCode: code});
        // console.log(user);
        if(!user)
        {
            return res.status(400).jsonp({message: "Invalid link"});
        }
        user.isVerified = true;
        await user.save();
        return res.status(200).redirect('/user/game');     
    }
    catch(err)
    {
        return new utils.CustomError("Internal Server Error");
    }
}

exports.forgotPasswordRequest = async(req,res) => {
    try{
        const email = req.body.email
        let isWebmail = (/^[a-zA-Z0-9._%+-]+@nitt+\.edu$/).test(email);

        if(isWebmail)
        {
            return res.status(400).jsonp({message:"Webmail password cannot be changed"});
        }
        let user  = await User.findOne({email:email});
        if(!user)
        {
            return res.status(400).jsonp({message: "Email Id not registered"});
        }
        let uniq_id = utils.generateRandomString(15);
        user.passwordResetId = uniq_id;
        await user.save();
        await utils.sendMailForNewPassword(email,uniq_id);
        return res.status(200).jsonp({message: "An Email for resetting password link has been sent to your registered email"});
    }
    catch(err)
    {
        return res.status(500).jsonp({message: "Internal Server Error"})
    }
}

exports.renderForgotPasswordRequest = (req,res) => {
    res.render('ForgotPassword')
}

changePasswordHelper = async(req) =>{
    if (!req.body.password || req.body.password.length < 6) {
        return new utils.CustomError("Password should be at least 6 characters excluding leading or trailing whitespaces");
    }   
    if (!req.body.confirmPassword || req.body.confirmPassword != req.body.password) {
        return new utils.CustomError("Passwords doesn't match");
    }
    try{
        let newPassword = await bcrypt.hash(req.body.password, utils.SALT_ROUNDS);
        let requestId = req.params.id;
        let requestedUser = await User.findOne({passwordResetId: requestId});
        requestedUser.password = newPassword;
        requestedUser.passwordResetId = "";
        await requestedUser.save();
        
        return requestedUser;
    }
    catch(err)
    {
        return res.status(500).jsonp({message: "Internal Server Error1"})  
    }
}

exports.renderResetPassword = (req,res) => {
    let uniq_id = req.params.id;
    res.render('ResetPassword',{
        uniqId: uniq_id
    })
}

exports.changePassword  = async(req,res) => {
    if(req.body.password && req.body.confirmPassword) {
    try{
        let changePasswordResult = await changePasswordHelper(req);
        if(changePasswordResult instanceof utils.CustomError){
            return res.status(400).jsonp({ message: changePasswordResult.message });
        }
        return res.status(200).jsonp({message: "Your password has been changed successfully"});
    }
    catch(err)
    {
        return res.status(500).jsonp({message: "Internal Server Error"})   
    }
    }
    else{
        return res.status(400).jsonp({ message: "Required fields are empty"});
    }
}
