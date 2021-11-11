const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



// DB Config
const db = require('./config/keys').MongoURI;


// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));


// User model
const user = require('./models/user');


// Public
app.use( express.static('public'));


// Bodyparser
app.use(express.urlencoded({ extended: false }));





// Routes
app.get( '/login', function( req, res ) {
    res.sendFile( path.join( __dirname, '/public/index.html'));
    // console.log('1');
});


 

app.get( '/sign_up', function( req, res ) {
    res.sendFile( path.join( __dirname, '/public/sign_up.html'));
    // console.log('2');
    app.post('/sign_up', (req, res) => {
        // console.log(req.body)
        // res.send('hello')
        const{ First_Name, Last_Name, Username, Bennett_email_id, Password, Confirm_Paassword } = req.body;
        
        let errors = [];
        //checking req fields
        if(!First_Name || !Last_Name || !Username || !Bennett_email_id || !Password || !Confirm_Paassword) {
            errors.push({msg: 'Please fill in all the fields'});
        }

        //checking passwords match
        if(Password !== Confirm_Paassword){
            errors.push({msg: 'Passwords do not match'});
        }

        //checking password length
        if(Password.length < 6){
            errors.push({msg: 'Passwords should be more than 5 characters'});
        }

        // sending errors
        if(errors.length > 0){
            res.sendFile( path.join( __dirname, '/public/sign_up.html'), {
                errors,
                First_Name,
                Last_Name,
                Username, 
                Bennett_email_id,
                Password,
                Confirm_Paassword
            });
        }
        else{
            // Validation passed
            user.findOne({Bennett_email_id: Bennett_email_id})
                .then(User => {
                    if(User){
                        //user exists
                        errors.push({msg: 'Email is already registered'})
                        res.sendFile( path.join( __dirname, '/public/sign_up.html'), {
                            errors,
                            First_Name,
                            Last_Name,
                            Username, 
                            Bennett_email_id,
                            Password,
                            Confirm_Paassword
                        });   
                    }
                    else{
                        const newuser = new user({
                            First_Name,
                            Last_Name,
                            Username,
                            Bennett_email_id,
                            Password,
                            Confirm_Paassword
                        });

                        // Hash password
                        bcrypt.genSalt(10, (err, salt) => 
                            bcrypt.hash(newuser.Password, salt, (err, hash) => {
                                if(err) throw err;
                                // set password to hash
                                newuser.Password = hash;
                                // newuser.Confirm_Paassword = hash;
                                // save user
                                newuser.save()
                                    .then(User => {
                                        res.redirect('/login');
                                    }) 
                                    .catch(err => console.log(err));
                        }))
                    }
                });
        }
        

    }) 
});




app.get( '/dashboard', function( req, res ) {
    res.sendFile( path.join( __dirname, '/public/homepage.html'));
    // console.log('3');
});



app.get( '/add_post', function( req, res ) {
    res.sendFile( path.join( __dirname, '/public/post.html'));
    // console.log('4');
});









const port = process.env.PORT || 3000;

app.listen(port, console.log(`Server started on port ${port}$`));