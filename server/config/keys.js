const srs = require('secure-random-string');
var secret;

try{
    secret = srs();
}
catch(error){
    console.log(error);
}

module.exports = {
    mongoURI: "mongodb+srv://gamechest:GB4OW3rkELph5vrc@main-cluster.pdtk5.mongodb.net/<dbname>?retryWrites=true&w=majority",
    secretOrKey: secret
}
