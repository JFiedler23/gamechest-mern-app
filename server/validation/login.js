const validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateLoginInput(data){
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    //email validation
    if(validator.isEmpty(data.email)){
        errors.email = "Email is required";
    }
    else if(!validator.isEmail(data.email)){
        errors.email = "Email is not valid";
    }

    //password validation
    if(validator.isEmpty(data.password)){
        errors.password = "Password is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};