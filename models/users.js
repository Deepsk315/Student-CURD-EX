var mongoose			  = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//STUDENT SCHEMA
var UserSchema = new mongoose.Schema({
	id 			: {type:String,require:true},
    name		: {type:String,unique:false},
    email		: {type:String,unique:false,require:true,sparse:true},
	password    : {type:String,require:true },
	cpassword   : {type:String,require:true },
	section   	: String,
	year    	: String,
	city		: String,
	country 	: String
	
});

UserSchema.plugin(passportLocalMongoose,{ usernameField : 'email'})

module.exports = mongoose.model("User", UserSchema);
