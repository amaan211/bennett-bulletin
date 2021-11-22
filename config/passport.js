const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// loading user model
const user = require('../models/user');
 

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, Password, done) => {
            // matching user  
            user.findOne({Bennett_email_id: email})
            .then(User => {
                if(!User){
                    return done(null, false, { message: 'This Bennett Email-ID is not registered' });
                    console.log('qwertyui');
                }

                // matching hashed password
                bcrypt.compare(Password, User.Password), (err, isMatch) => {
                    if(err) throw err; 

                    if(isMatch) {
                        console.log('qwertyui');
                        return done(null, User);
                    }
                    else{
                        return done(null, false, {message: 'Password Incorrect'});
                    }
                }
            })
            .catch(err => console.log(err));
        })
    )

    passport.serializeUser(function(User, done) {
        done(null, User.id);
      });
    
      passport.deserializeUser(function(id, done) {
        user.findById(id, function(err, User) {
          done(err, User);
        });
    });

    // passport.serializeUser(function(User, done) {
    //     done(null, User.id);
    //   });
    
    //   passport.deserializeUser(function(id, done) {
    //     user.findOne({where: { id: id } }).then((User) => {
    //       done(err, User);
    //     });
    // });
}