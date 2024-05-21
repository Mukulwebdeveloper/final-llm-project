const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const userSchema2 =  mongoose.Schema({

    query:{
        type: String
    },
    Answer:{
        type: String
    }
});





// create user Model
const QueryAnswer = mongoose.model('userQuery', userSchema2 );
module.exports = QueryAnswer;