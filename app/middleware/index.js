// array of all middlewares
var middlewareObj = {};
// middleware to check if user is logged in or not
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next(); // if logged in then proceed
	} else {
		res.redirect("/signin"); // if not logged in then redirect to login first
	}
}
// middleware to check if user is already logged in or not
middlewareObj.isAlreadyLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		res.redirect("/posts"); // if already logged in redirect to /posts route
	} else {
		return next(); // if not logged in then proceed
	}
}
// export the array of middlewares to use in main app
module.exports = middlewareObj;