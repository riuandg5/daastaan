// express router configuration
var express = require("express");
var router  = express.Router();
// require npm packages
var request = require("request");
// require models
var Post = require("../models/Post.model");
var User = require("../models/User.model");
// require middleware
var middleware = require("../middleware");
// route to show posts and admins
router.get("/posts", function(req, res){
	Post.find({}, function (err, allposts){
		if(err){
			console.log(err);
		} else {
			User.find({}, function (err, alladmins){
				if(err){
					console.log(err);
				} else {
	            	res.render('index', {posts: allposts, admins: alladmins});
				}
	        });
		}
    });
});
// route to show new post form
router.get("/posts/new", middleware.isLoggedIn, function(req, res){
    res.render("new");
});
// route to create new post
router.post("/posts/new", function(req, res){
    Post.create(req.body.post, function(err, newPost){
        if(err){
            console.log(err);
        }
        Post.update({_id: newPost._id}, {$set:{owner: req.user._id}}, function(err, updatedOwner){
            if(err){
                console.log(err);
            }

            res.redirect("/posts");
        });
    });
});
// route to show new post
router.get("/posts/:id", function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            res.render("show", {post: foundPost});
        }
    });
});

// route to edit post
router.get("/posts/:id/edit", middleware.isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            res.render("edit", {post: foundPost});
        }
    });
});
// route to update post
router.put("/posts/:id", function(req, res){
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
        if(err){
            console.log(err);
        } else {
            Post.update({_id: updatedPost._id}, {$set:{created: Date.now()}}, function(err, updatedData){
                if(err){
                    console.log(err);
                } else {
            		res.redirect("/posts/" + req.params.id);
                }
            });
        }
    });
});
// route to delete post
router.delete("/posts/:id", function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }
        res.redirect("/posts");
    });
});
// export express router to use in main app
module.exports = router;