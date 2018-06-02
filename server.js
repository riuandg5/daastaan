var port  = process.env.PORT || 3079,
    dburi = process.env.DBURI || "mongodb://localhost/daastaan";
// require npm packages
var bodyParser       = require("body-parser"),
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    passport		 = require("passport"),
    LocalStrategy	 = require("passport-local"),
    app              = express();
// require models
var Post 			 = require("./app/models/Post.model"),
	User             = require("./app/models/User.model");
// require routes
var	postsRoute       = require("./app/routes/posts.route"),
	indexRoute       = require("./app/routes/index.route");;
// connect to database
mongoose.connection.openUri(dburi);
// set views directory path
app.set("views", "./app/views");
// set templating engine to ejs
app.set("view engine", "ejs");
// host static files (public directory) with express
app.use(express.static("public"));
// passport configuration
app.use(require("express-session")({
	secret: "justablogtosharemypoetry",
    cookie: {maxAge: 86400000},
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// middleware to tell that currentUser is req.user
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});
// use body-parser
app.use(bodyParser.urlencoded({extended: true}));
// use express-sanitizer to sanitize request credentials
app.use(expressSanitizer());
// method-override to manipulate delete request
app.use(methodOverride("_method"));
// use routes
app.use(postsRoute);
app.use(indexRoute);
// listen to the port
app.listen(port, function(){
    console.log('Daastaan server started...');
});