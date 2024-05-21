const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const userSchema =  mongoose.Schema({

    name:{
        type: String
    },
    email:{
        type: String
    },
    password:{
        type: String
    },
    confirmPassword:{
        type: String
    },
    verifytoken:{
        type: String
    },
    // quryResponse:[
    //     {
    //         query:[],
    //         response:[]
    //     }
    // ]
  
});

// userSchema.pre('save', async function (next){
//     try {
//         // console.log("Calling before saving a function");
//         const salt = await bcrypt.genSalt(10)
//         const hashPassword = await bcrypt.hash(this.password, salt)
//         this.password = hashPassword
//         next()
//     } catch (error) {
//         next(error)
//     }
// })




// create user Model
const User = mongoose.model('users', userSchema );
module.exports = User;