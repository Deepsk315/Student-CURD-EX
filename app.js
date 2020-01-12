var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    methodOverride        = require("method-override"),
    User                  = require("./models/users"),
    LocalStrategy         = require("passport-local").Strategy,
    passportLocalMongoose = require("passport-local-mongoose")
    
mongoose.connect("mongodb://localhost/student3", {useNewUrlParser: true , useUnifiedTopology :true});
var app = express();
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "1234",
    resave: false,
    saveUninitialized: false
}));

//PASSPORT AUTH
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
  usernameField: 'email'
}, User.authenticate()));
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//============
// ROUTES
//============

//HOME PAGE
app.get("/", function(req, res){
    res.render("welcome");
});

//DISPLAY ALL USERS
app.get("/users",isLoggedIn, function(req, res){
   // Get all users from DB
    User.find({}, function(err, allUsers){
       if(err){
           console.log(err);
       } else {
          res.render("index",{users:allUsers});
		  
       }
    });
});

//EDIT USER
app.get("/users/:id/edit", isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        res.render("edit", {users: foundUser});
    });
});

//UPDATE USER
app.put("/users/:id",isLoggedIn,function(req,res){
	//console.log(req.body.student);
	 User.findByIdAndUpdate(req.params.id,req.body.student, function(err, updatedUser){
       if(err || !updatedUser ){
		   
           console.log(err);
       } else {
          res.redirect("/users/"+req.params.id);
		  
       }
    });
});

//SHOW SINGLE USER INFO
app.get("/users/:id",isLoggedIn,function(req,res){
	 User.findById(req.params.id, function(err, updatedUser){
       if(err || !updatedUser){
           console.log(err);
       } else {
          res.render("show",{user : updatedUser});
		  
       }
    });
});

//DELETE USER
app.delete("/users/:id",isLoggedIn, function(req, res){
   // Get all users from DB
    User.findByIdAndDelete(req.params.id, function(err, deletedUsers){
       if(err){
           console.log(err);
       } else {
          res.redirect("/users");
		  
       }
    });
});

// Auth Routes

//show sign up form
app.get("/register", function(req, res){
   res.render("register"); 
});
//handling user sign up
app.post("/register", function(req, res){
    User.register(new User({id:req.body.id, name:req.body.name, email:req.body.email,cpassword:req.body.cpassword, section:req.body.section, year:req.body.year, city:req.body.city,country:req.body.country }), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
	   console.log(user);
           res.redirect("/login");
        });
    });
});

// LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
   res.render("login"); 
});
//login logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/users",
    failureRedirect: "/login"
}) ,function(req, res){
});



app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(3001, function(){
    console.log("server started.......");
})
