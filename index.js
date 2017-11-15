const express     = require("express");
const app         = express();
const bodyParser  = require("body-parser");
const mongoose    = require("mongoose");
const passport    = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const flash       = require("connect-flash");
const Movie       = require("./models/movie");
const User        = require("./models/user");


var movieRoutes = require("./routes/movies");
var indexRoutes = require("./routes/index");



var url = process.env.DATABASEURL || "mongodb://localhost/movie_quiz";
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "movie time",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/movies", movieRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, function(){
   console.log("Its Movie Time");
});
