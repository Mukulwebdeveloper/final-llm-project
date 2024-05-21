require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

//
const path = require("path");

const router = express.Router();
const app = express();
const port = process.env.PORT || 5000;
var   params = require("params");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const JWT_SECRET = process.env.SECRET_KEY;
const cookieParser = require('cookie-parser');
// express middleware
// app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
const cors = require("cors");
app.use(cors());
// mongodb
require("./db/connection");
const User = require("./Model/user");
const UserFeedback = require("./Model/userfeedback");
const QueryAnswer = require("./Model/queryResponse");
const Answer = require("./Model/answer");
const { newquery, feedbackUpdate, getuserQuery, removeQuery } = require("./Controller/queryController");
// const QueryAns = require("./Model/queryResponse");


// Model

// const JWT_SECRET = 'your_secret_key'; // Replace with a strong secret key

app.post('/login', async (req, res) => {
    console.log("Request body:", req.body);

    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            // Send error message if user not found
            return res.status(200).json({ message: "User not found" });
        }

        // Compare the plain text password
        if (password === user.password) {
            // Password matches, generate a JWT token
            const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

            // Set the token in a cookie
            // res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000 }); // 1 hour

            // Send success message
            return res.status(200).json({ message: "Login Successful", user ,token});
            
        
            // res.status(200).json({ message: "Login Successful", user ,token});
        } else {
            // Password doesn't match, send custom message
            return res.status(200).json({ message: "Password didn't match" });
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

//load user

app.post("/getuser", async (req, res) => {
    const { token } = req.body;

    if (!token) {
        res.status(400).json({
            success:false,
      
          })
          return;
        // return next(new ErrorHander("Please Login to access this More Functionality", 401));
    }

    // const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId);
        console.log(user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.status(200).json({ user });
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).json({ message: "Invalid token" });
    }
  });
  




// node Email

app.post("/forgot-password", async (req, res) => {
    // Log the request body for debugging
    console.log("Request body:", req.body);

    const { email } = req.body;

    try {
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        // find email and send link
        const userfind = await User.findOne({ email: email });
        //   console.log("userfind", userfind);

        //generate token
        const token = jwt.sign({ _id: userfind._id }, JWT_SECRET, {
            expiresIn: "5m",
        });

        const setusertoken = await User.findByIdAndUpdate(
            { _id: userfind._id },
            { verifytoken: token },
            { new: true }
        );
        // console.log("setusertoken",setusertoken);
        if (setusertoken) {
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "Sending Email for Reset Password",
                text: `This Link Valid for 5 MINUTES http://localhost:3000/reset_password/${userfind.id}/${setusertoken.verifytoken}`,
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("error", error);
                    res.status(401).json({ status: 401, message: "Email not sent" });
                } else {
                    console.log("Email sent: " + info.response);
                    res.status(201).json({ status: 201, message: "email sent successfully" });
                }
            });
        }
    } catch (error) {
        res.status(401).json({ status: 401, message: "Invalid user" });
    }
});



// varify user for forgot password time
app.get("/reset_password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    // console.log(id, token);

    try {
        const validUser = await User.findOne({ _id: id, verifytoken: token })
        // console.log(validUser);
        const verifyToken = jwt.verify(token, JWT_SECRET);
        console.log((verifyToken));
        if (validUser && verifyToken._id) {
            res.status(201).json({ status: 201, validUser });
        } else {
            res.status(401).json({ status: 401, message: "user not valid" });
        }
    } catch (error) {
        res.status(401).json({ status: 401, error });
    }
})



// change Password
app.post("/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        const validUser = await User.findOne({ _id: id, verifytoken: token });

        if (validUser) {
            // Update the user's password directly without hashing
            const setuserpassword = await User.findByIdAndUpdate(
                { _id: id },
                { password: password }
            );

            // Optionally, you can save the user document after updating
            setuserpassword.save();

            res.status(201).json({ status: 201, message: "Password updated successfully" });
        } else {
            res.status(401).json({ status: 401, message: "User not valid" });
        }
    } catch (error) {
        res.status(401).json({ status: 401, error });
    }
});


// Routes Signup
app.post("/signup", async (req, res) => {
    // res.send("My Api Signup")
    console.log(req.body);

    const { name, email, password } = req.body;
 
    User.findOne({ email: email })
        .then((user) => {
            if (user) {
                res.status(400).json({ message: "User already registered" });
                res.send({ message: "User already registered" });
                console.log("User Already Register");
                //   alert("User Already Register");
            } else {
                // Create a new user
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password,
                });

                // Save the new user
                return newUser.save();
            }
        })
        .then((savedUser) => {
            // Handle saved user
            // For example, you might want to send a success response
            res.send({ message: "User registered successfully. Please Login Now" });
            console.log("User registered successfully");
        })
        .catch((error) => {
            console.log("Error");
        });
});


//feedbaack query change on 16-05-24
app.post("/feedback", feedbackUpdate);

app.post("/queryAnswer",newquery);
app.post("/getuserquery",getuserQuery);
app.post("/removequery",removeQuery);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports = router;


