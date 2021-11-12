const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const expressLayouts  = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');



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
// Specific folder example
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/images'))


// Bodyparser
app.use(express.urlencoded({ extended: false }));



// express middleware for session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// connect flash middleware
app.use(flash());




// global vars middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});




// Set View's

app.set('views', './views');
app.set('view engine', 'ejs');



// Routes
app.get( '/login', ( req, res ) => {
    res.render('login')
}); 


 

app.get( '/sign_up', ( req, res ) => {
    res.render('sign_up');
    app.post('/sign_up', (req, res) => {
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
            res.render('sign_up', {
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
                        res.render('sign_up', {
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
                                newuser.Confirm_Paassword = hash;
                                // save user
                                newuser.save()
                                    .then(User => {
                                        req.flash('success_msg', 'You are now registered and can log in');
                                        res.redirect('/login');
                                    }) 
                                    .catch(err => console.log(err));
                        }))
                    }
                });
        }
    }) 
});




app.get( '/dashboard', ( req, res ) => {
    res.render('homepage');
});



app.get( '/add_post', ( req, res ) => {
    res.render('post');
});









const port = process.env.PORT || 3000;

app.listen(port, console.log(`Server started on port ${port}$`));