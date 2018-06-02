// express router configuration
var express = require("express");
var router  = express.Router();
// require npm packages
var passport = require("passport");
var request = require("request");
// require models
var Post = require("../models/Post.model");
var User = require("../models/User.model");
// require middleware
var middleware = require("../middleware");
// root route
router.get("/", function(req, res){
    res.redirect("/posts"); 
});
// route to signup form
router.get("/signup/admin/new", middleware.isAlreadyLoggedIn, function(req, res){
    res.render("signup"); 
});
// route to post signup form data to database and register user
router.post("/signup/admin/new", function(req, res){
    var newUser = new User({username: req.body.username, dplink: req.body.dplink, bio: req.body.bio});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
        }
        // if signup success then redirect to signin
        passport.authenticate("local")(req, res, function(){
            res.redirect("/posts");
        });
    });
});
// route to view admin profile
router.get("/admin/:id/profile", middleware.isLoggedIn, function(req, res){
    res.render("profile");
});
// route to profile update form
router.get("/admin/:id/profile/update", middleware.isLoggedIn, function(req, res){
    res.render("profileupdate");
});
// route to update profile info
router.put("/admin/:id/profile/update", function(req, res){
    User.findByIdAndUpdate(req.params.id, { $set: {dplink: req.body.info.dplink, bio: req.body.info.bio}}, function(err, updatedInfo){
        if(err){
            console.log(err);
        }
    });
    res.redirect("/admin/" + req.params.id + "/profile");
});
// route to signin form
router.get("/signin", middleware.isAlreadyLoggedIn, function(req, res){
    res.render("signin");
});
// route to post signin form data
router.post("/signin", passport.authenticate("local",
    {
        successRedirect: "/posts", // if signin success redirect to /posts route
        failureRedirect: "/signin" // if sigin fails redirect to /signin route
    }), function(req, res){
});
// route to signout
router.get("/signout", middleware.isLoggedIn, function(req, res){
    req.logout();
    res.redirect("/posts");
});
// export express router to use in main app
module.exports = router;