'use strict';

var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var FacebookStrategy = require('passport-facebook').Strategy;
//var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('./models/user');
var config = require('./config');
var Verify = require('./routes/verify');
var jwt = require('jsonwebtoken');

// Load environment
const _ENV_NAME = process.env.NAME || 'development';
config = config[_ENV_NAME];

exports.local = passport.use(new LocalStrategy(User.authenticate()));

//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
/*
var getDetails = {
    user: null,
    _id: null,
    admin: false
};

module.exports = passport.use(new GoogleStrategy({  
    clientID: config.googleAuth.clientID,
    clientSecret: config.googleAuth.clientSecret,
    callbackURL: config.googleAuth.callbackURL,
  },
    function(token, refreshToken, profile, done) {
    console.log("\nHERE USER");
      process.nextTick(function() {
        User.findOne({$or: [{'OauthId': profile.id}, {'username': profile.emails[0].value}]}, function(err, user) {
            console.log("\nFINDING USER");
          if (err)
            return done(err);        
          if (user) {
              console.log("\nFOUND USER");              
            
            getDetails.user = profile.emails[0].value;
            getDetails._id = user._id;
            getDetails.admin = false;
            console.log(getDetails);
              
            return done(null, user);
          } else {
              console.log("\nREGISTERING USER");
            var newUser = new User();
              
            newUser.OauthId = profile.id;
            newUser.OauthToken = token;
            newUser.firstname = profile.displayName;
            newUser.username = profile.emails[0].value;
            newUser.verified = true;
              
            newUser.save(function(err) {
                if (err)
                    throw err;
                
                getDetails.user = profile.emails[0].value;
                getDetails._id = newUser._id;
                getDetails.admin = false;
                console.log(getDetails);
                
                return done(null, newUser);
            });
          }
        });
      });
    }));

module.exports = { 
    makeToken: function() {
        console.log("in fn: " +getDetails._id);
        return Verify.getToken(getDetails);
    }
}*/

