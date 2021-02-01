//performs form validation
const validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegisterInput(data){
    let errors = {};

    //validator only works with strings so empty fields have to be converted to empty strings
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
    
    //validating name
    if(validator.isEmpty(data.name)){
        errors.name = "Name field is required";
    }

    //validating email
    if(validator.isEmpty(data.email)){
        errors.email = "Email field is required";
    }
    else if(!validator.isEmail(data.email)){
        errors.email = "Not a valid email address";
    }

    //validating password
    if(validator.isEmpty(data.password)){
        errors.password = "Password is required";
    }
    
    if(!validator.isStrongPassword(data.password)){
        errors.password = "Not strong enough. Must be 8 characters long and contain 1 uppercase character, 1 lowercase character, 1 number and 1 special character.";
    }

    if(!validator.equals(data.password, data.password2)){
        errors.password = "Passwords must match";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};