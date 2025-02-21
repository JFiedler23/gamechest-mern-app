const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const validateRegister = require('../../validation/register');
const validateLogin = require('../../validation/login');
const User = require('../../models/Users');

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {

    const { errors, isValid } = validateRegister(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

    //Checking if user already exits
    User.findOne({email: req.body.email})
    .then(user => {
        if(user){
            return res.status(400).json({email: "Email already exists"});
        }
        else{
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            //hash the password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw error;
                    newUser.password = hash;

                    //saving user to db
                    newUser.save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                });
            });
        }
    });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLogin(req.body);// Check validation

    if (!isValid) {
      return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ emailnotfound: "Email not found" });
      }
      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        // User matched
        if (isMatch) {
          // Create JWT Payload
          const payload = {
            id: user.id,
            name: user.name
          };
          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } 
        else {
          return res.status(400).json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  });

module.exports = router;