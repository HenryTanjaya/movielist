var express = require("express");
var router  = express.Router();
var Movie = require("../models/movie");
var middleware = require("../middleware");


//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Movie.find({}, function(err, allMovies){
       if(err){
           console.log(err);
       } else {
          res.render("movies/index",{movies:allMovies});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newMovie = {name: name, image: image, description: desc, author:author}
    // Create a new campground and save to DB
    Movie.create(newMovie, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/movies");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("movies/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Movie.findById(req.params.id).exec(function(err, foundMovie){
        if(err){
            console.log(err);
        } else {
            console.log(foundMovie)
            //render show template with that campground
            res.render("movies/show", {movie: foundMovie});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkMovieOwnership, function(req, res){
    Movie.findById(req.params.id, function(err, foundMovie){
        res.render("movies/edit", {movie: foundMovie});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkMovieOwnership, function(req, res){
    // find and update the correct campground
    Movie.findByIdAndUpdate(req.params.id, req.body.movie, function(err, updatedMovie){
       if(err){
           res.redirect("/movies");
       } else {
           //redirect somewhere(show page)
           res.redirect("/movies/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkMovieOwnership, function(req, res){
   Movie.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/movies");
      } else {
          res.redirect("/movies");
      }
   });
});


module.exports = router;
