import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";
import redcomlogo from ".././assets/Redcom1.png";
import redcomlogo1 from ".././assets/radcom.png";
import { auth, provider } from "../googleSignin/config";
import { signInWithPopup } from "firebase/auth";
// import "bootstrap/dist/js/bootstrap.bundle/bootstrap.js"
import VirtualAssistant from "../Component/ChatFolder/VirtualAssistant";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [user, setUser] = useState(
    //for send userDetail to mongodb
    {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  );

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const [value, setValue] = useState("");
  const handleClick = () => {
    signInWithPopup(auth, provider).then((data) => {
      setValue(data.user.email);
      localStorage.setItem("email", data.user.email);
    });
  };

  useEffect(() => {
    setValue(localStorage.getItem("email"));
  });

  const Signup = () => {
    const { name, email, password, confirmPassword } = user;

    // const checkIfEmailExists = () => {
    //   // Make a request to your backend to check if the email exists
    //   // Replace the dummy axios.post call with your actual API call
    //   return axios.post("http://localhost:5000/checkEmail", { email: email })
    //     .then((res) => {
    //       // Assuming the response contains a boolean indicating whether the email exists
    //       // return res.data.exists;
    //       toast.warn("User already registered. Please login instead.", {
    //         position: "top-right",
    //         className: "fs-4 fw-bold",
    //         autoClose: 2000,
    //       });
    //     })
    //     .catch((error) => {
    //       // Handle error if request fails
    //       console.error("Error checking email:", error);
    //       return false;
    //     });
    // };

    // if(name && email && password && (password === confirmPassword)  ){

    //   // alert("posted");
    //   axios.post("http://localhost:5000/signup", user).then((res) =>
    //   // axios.post(`${window.location.origin}/signup`, user).then((res) =>
    //   {
    //     toast.success("Registration SuccessFully",{
    //       position:"top-right",className:"fs-4 fw-bold",autoClose: 2000,
    //     });

    //     // alert(res.data.message)

    //     navigate("/")

    //   }

    // );

    // }

    // if(name.length<=2 || name.length >=15){
    //   toast.warn("Name should be atleast 3 character or more",{
    //     position:"top-right",className:"fs-4 fw-bold",autoClose: 2000
    //   });
    // }
    // const validateEmail = (email) => {
    //   // Regular expression for email validation
    //   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //   return regex.test(email);
    // };
    // if (!validateEmail(email)) {

    //   toast.warn("Invalid Email",{
    //     position:"top-right",className:"fs-4 fw-bold",autoClose: 2000
    //   });
    //   return;
    // }
    //   if((password !== confirmPassword) ){
    //   toast.info("Password & Confirm Password should be match",{
    //     position:"top-right",className:"fs-4 fw-bold",autoClose: 2000
    //   });
    // }
    //   if((password.length<=3) ){
    //   toast.warn("Password must be atleast 6 letter,digit or($,#,@,%) ",{
    //     position:"top-right",className:"fs-4 fw-bold",autoClose: 2000
    //   });
    // }

    // else{
    //   toast.error("Please fill  the Required fields",{
    //     position:"top-right",className:"fs-4 fw-bold",autoClose: 5000,
    //   });
    // }
    const validateEmail = (email) => {
      // Regular expression for email validation
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
  };
  
  // Check if email is valid
  if (!validateEmail(email)) {
      // If email is invalid, show toast message and return
      toast.warn("Invalid Email", {
          position: "top-right",
          className: "fs-4 fw-bold",
          autoClose: 2000,
      });
      return; // Exit the function to prevent further execution
  }
     if (password !== confirmPassword) {
        toast.info("Password & Confirm Password should match", {
          position: "top-right",
          className: "fs-4 fw-bold",
          autoClose: 2000,
        });
        return;
      }
      if (password.length <= 5) {
        toast.warn(
          "Password must be at least 6 characters long and contain letters, digits, or special characters ($,#,@,%)",
          {
            position: "top-right",
            className: "fs-4 fw-bold",
            autoClose: 2000,
          }
        );
        return;
      }
    if (name && email && password && password === confirmPassword) {
      // All conditions for registration are met
      axios
        .post("http://localhost:5000/signup", user)
        .then((res) => {
          // Registration successful, display success toast
          toast.success("Registration Successful", {
            position: "top-right",
            className: "fs-4 fw-bold",
            autoClose: 2000,
          });
          // Optionally, navigate to another page
          navigate("/");
        })
        .catch((error) => {
          // Handle errors here if necessary
        });
    } else {
      // Conditions for registration not met, display appropriate toast messages
      if (name.length < 2 || name.length >= 15) {
        toast.warn("Name should be at least 3 characters or more", {
          position: "top-right",
          className: "fs-4 fw-bold",
          autoClose: 2000,
        });
        return;
      } 
    }
  };

  return (
    <div>
      {value ? (
        <VirtualAssistant></VirtualAssistant>
      ) : (
        <div className="container-fluid loginpage p-5 ">
          <div className="row ">
            <div className="col-lg-2"></div>
            <div className="col-lg-8 mt-5">
              <div className="row main-container mt-5">
                <div className="col-lg-5 bg-light ">
                  <div className="p-4 mt-5">
                    {/* <!-- social login buttons start --> */}
                    {/* <div className="row social-buttons mt-4 ms-4">
              <div className="col-xs-4 col-sm-4 col-md-12 mt-3">
                <Link to="#" className="btn btn-primary btn btn-lg mt-5 ms-5  btn-facebook">
                  <i className="fa fa-facebook"></i> <span className="hidden-xs hidden-sm fs-3">    Signin with facebook</span>
                </Link>
              </div>
              <div className="col-xs-4 col-sm-4 col-md-12 mt-3 ms-2">
                <Link to="#" className="btn btn-warning  btn btn-lg mt-5 ms-5 btn-twitter">
                  <i className="fa fa-twitter"></i> <span className="hidden-xs hidden-sm fs-3">     Signin with twitter</span>
                </Link>
              </div>
              <div className="col-xs-4 col-sm-4 col-md-12 mt-3 ms-2">
                <Link to="#" className="btn btn-danger  btn btn-lg mt-5 ms-5 btn-google">
                
                  <i className="fa fa-google-plus"></i> <span className="hidden-xs hidden-sm fs-3" onClick={handleClick}>    Signin with google</span>
                </Link>
              </div>
            </div> */}
                    {/* <!-- ./social-buttons --> */}

                    <div className="container mt-5">
                      <div className="row d-flex justify-content-center align-items-center mt-5">
                        <div className="col-lg-8 mt-5">
                          <div className="mt-5">
                            <div className="mt-5">
                              <div className="mt-5">
                                <img
                                  src={redcomlogo}
                                  alt=""
                                  width={"200px"}
                                  className="ms-5 mb-4"
                                />
                                <img src={redcomlogo1} alt="" width={"260px"} />
                                {/* <div className="display-1 mt-3 fw-bold" 
style= {{"background": "linear-gradient(90deg, purple, aqua)",
                            "-webkit-background-clip":"text",
                              "-webkit-text-fill-color":"transparent"}}
>RADCOM</div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-7 p-5 bg-dark">
                  <form>
                    <div className="form-group">
                      <div className="authfy-heading">
                        <h2 className="auth-title  text-center text-white fs-1">
                          Register to your account
                        </h2>
                        <p className="fs-4 mt-2 text-center text-white">
                          Already have an account?{" "}
                          <Link
                            to="/"
                            className="lnk-toggler"
                            data-panel=".panel-signup"
                          >
                            Login Now!
                          </Link>
                        </p>
                      </div>
                      {/* <label for="exampleInputEmail1" className="fs-5">Email address</label> */}
                      <input
                        type="text"
                        value={user.name}
                        onChange={handleChange}
                        className="form-control mt-5 inputbox p-4"
                        id="exampleInputEmail1"
                        name="name"
                        aria-describedby="emailHelp"
                        placeholder="Enter Name"
                      />
                      <input
                        type="email"
                        value={user.email}
                        onChange={handleChange}
                        className="form-control mt-5 inputbox p-4"
                        id="exampleInputEmail1"
                        name="email"
                        placeholder="Enter Your Email"
                        required
                      />
                    </div>
                    <div className="form-group mt-3">
                      {/* <label for="exampleInputPassword1" className="fs-5">Password</label> */}
                      <input
                        type="password"
                        value={user.password}
                        onChange={handleChange}
                        className="form-control mt-4 inputbox p-4"
                        id="exampleInputPassword1"
                        name="password"
                        placeholder="Password"
                      />
                    </div>
                    <div className="form-group mt-3">
                      {/* <label for="exampleInputPassword1" className="fs-5">Password</label> */}
                      <input
                        type="password"
                        value={user.confirmPassword}
                        onChange={handleChange}
                        className="form-control mt-4 inputbox p-4"
                        id="exampleInputPassword"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                      />
                    </div>
                    <div className="form-check mt-3">
                      <input
                        type="checkbox"
                        className="form-check-input mt-3"
                        id="exampleCheck1"
                      />
                      <label
                        className="form-check-label fs-4 mt-2 text-white"
                        for="exampleCheck1"
                      >
                        Remember me
                      </label>
                    </div>
                    <div
                      type="submit"
                      onClick={Signup}
                      className="btn btn w-100 mt-3 btn btn-lg mt-5 login fs-3"
                      style={{ backgroundColor: "blueviolet", color: "white" }}
                    >
                      Signup{" "}
                    </div>

                    <div className="my-3 text-center text-white h2">Or</div>
                    <Link
                      to="/"
                      type="submit"
                      className="btn btn w-100 btn btn-lg login fs-3"
                      style={{ backgroundColor: "blueviolet", color: "white" }}
                    >
                      Login Now
                    </Link>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-2"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
