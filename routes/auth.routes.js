
//auth.routes.js

// IMPORTS / DECLARATIONS//
const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require('./../middleware/jwt.middleware.js'); 

const router = express.Router();
const saltRounds = 10;


// ROUTES //

// ***** POST for /signup 
router.post('/signup', (req, res, next) => {
    const { username, email, password } = req.body;

    //Field validations:
     //Check all fields are present
     if (username === '' || email === '' || password === '' ) {
         res.status(400).json({message: "Please complete all fields before submitting"});
         return;
     }

     //Check for valid email format using regex
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

     if (!emailRegex.test(email)) {
         res.status(400).json({message: "Please provide a valid email address"});
         return;
     }

     //Check for valid password format using regex
     const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;  //was {6,}

     if (!passwordRegex.test(password)) {
         res.status(400).json({ message: "Password must be at least 8 characters and contain at least one number and both lowercase and uppercase letters"});
         return;
     }

    //Data validation and signup
     //Check the user(email and username) does not already exist
     User.findOne({email})
     .then((foundUser) => {
         if(foundUser) {
             res.status(400).json({message: "An account with this email already exists"});
             return;
         }

         //Only if user is not found, proceed with encryption and user creation
         const salt = bcrypt.genSaltSync(saltRounds);
         const hashedPassword = bcrypt.hashSync(password, salt);

         return User.create({username, email, password: hashedPassword});
     })
     .then((createdUser) => { //return the created user without the password, for confirmation
        const { username, email, _id} = createdUser;
        const user = {username, email, _id};
        res.status(201).json({user: user}); //201 means 'created'
     })
     .catch(err => {
         console.log(err);
         res.status(500).json({message: "Server error on user creation"});
     })     
})

// ***** POST for /login
router.post('/login', (req,res,next) => {
    const { email, password } = req.body; 

    //Field validations
     //Check all fields are completed
     if (email === '' || password === '') {
         res.status(400).json({message: "You must complete both username and password to sign in"});
         return;
     }

    //Check that account exists and if so, that password is valid
    User.findOne({ email })
    .then((foundUser) => {
        if (!foundUser) {
            res.status(401).json({ message: "Email not recognised, are you sure you've signed up?"});
            return;
        }

        const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

        if (passwordCorrect) {
            const {_id, email, username } = foundUser;
            
            const payload = {_id, email, username };

            //generate and send token
            const authToken = jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                {algorithm: 'HS256', expiresIn: "4h" }
            );

            res.status(200).json({authToken: authToken});
            
        } else {
            res.status(401).json({ message: "Incorrect login details"})
        }
    })
    .catch(err => res.status(500).json({ message: "Error while logging in"}));
});

// GET  /auth/verify  -  Used to verify JWT token stored on the client
router.get('/verify', isAuthenticated, (req, res, next) => {      
 
    // If JWT token is valid the payload gets decoded by the isAuthenticated middleware and made available on `req.payload`
    //console.log(`req.payload`, req.payload);
   
    // Send back the object with user data previously set as the token payload
    res.status(200).json(req.payload);
  });



//GET user for account page
router.get('/account', isAuthenticated, (req, res, next) => {
    const { _id, email, username } = req.payload

    User.findById(_id)
    .then((foundUser) => {
        const sendUser = { _id, username, email }
        res.status(200).json( {user: sendUser});
    })


});

// TO DO
//POST to update user
router.put('/account', isAuthenticated, (req,res,next) => {
    const { username, email, password } = req.body;

    //Field validations:
     //Check all fields are present
     if (username === '' || email === '' || password === '' ) {
         res.status(400).json({message: "Please complete all fields before submitting"});
         return;
     }

     //Check for valid email format using regex
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

     if (!emailRegex.test(email)) {
         res.status(400).json({message: "Please provide a valid email address"});
         return;
     }

     //Check for valid password format using regex
     const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;  //was {6,}

     if (!passwordRegex.test(password)) {
         res.status(400).json({ message: "Password must be at least 8 characters and contain at least one number and both lowercase and uppercase letters"});
         return;
     }

     //Update the details
     User.findOne({email})
     .then((foundUser) => {

         const salt = bcrypt.genSaltSync(saltRounds);
         const hashedPassword = bcrypt.hashSync(password, salt);

         return User.updateOne({username, email, password: hashedPassword});
     })
     .then((createdUser) => { //return the created user without the password, for confirmation
        const { username, email, _id} = createdUser;
        const user = {username, email, _id};
        res.status(200).json({user: user}); //200 means 'ok'
     })
     .catch(err => {
         console.log(err);
         res.status(500).json({message: "Server error on user details update"});
     })         
});

//DELETE user
router.post("/account/delete", isAuthenticated, (req,res,next) => {
    const { _id, email, username } = req.payload

    User.findOneAndRemove(_id)
    .then((removedResponse) => {
        res.status(200).json({message: "Account deleted"});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: "Error on account deletion"})
    })
});


module.exports = router;