const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const userSchema3 =  mongoose.Schema({

   
    answer:{
        type: String
    }
    // answer:{
    //     type: String
    // }
   
});





// create user Model
const Answer = mongoose.model('userAnswer', userSchema3 );
module.exports = Answer;