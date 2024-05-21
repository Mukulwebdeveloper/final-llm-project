import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../App.css";
import redcomlogo from ".././assets/Redcom1.png";
import redcomlogo1 from ".././assets/radcom.png";
// import {auth, provider} from "../googleSignin/config"
// import {signInWithPopup} from "firebase/auth"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "bootstrap/dist/js/bootstrap.bundle/bootstrap.js"
import VirtualAssistant from "../Component/ChatFolder/VirtualAssistant";
// import { Link } from 'react-router-dom';
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [message, setMessage] = useState(false);
  const [user, setUser] = useState({
    email: "",
  });

  // const sendLink = () =>{

  //   const {email} = user
  //   if( email){
  //     // alert("posted");
  //     axios.post("http://localhost:5000/forgot-password", user).then((res) =>
  //     // axios.post(`${window.location.origin}/login`, user).then((res) =>
  //      {

  //   }
  //   )
  // }

  // }
  const sendLink = () => {
    const { email } = user;
    if (email) {
      setMessage(true);
      setUser(" ")

      axios
        .post("http://localhost:5000/forgot-password", user)
        .then((res) => {})
        .catch((error) => {
          setMessage(false);
          setUser(" ")
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const [value, setValue] = useState("");
  // const [email, setEmail] = useState("");

  const navigate = useNavigate();
  // const history = useHistory();

  return (
    <div>
      <div className="container-fluid loginpage p-5 ">
        <div className="row ">
          {/* {console.log(user)} */}
          <div className="col-lg-2"></div>
          <div className="col-lg-8 mt-5">
            <div className="row main-container mt-5">
              <div className="col-lg-5 bg-white">
                <div className="p-4 mt-5">
                  <div className="container mt-5">
                    <div className="row d-flex justify-content-center align-items-center ">
                      <div className="col-lg-8 ">
                        <img
                          src={redcomlogo}
                          alt=""
                          width={"200px"}
                          className="ms-4"
                        />
                        <img
                          src={redcomlogo1}
                          alt=""
                          width={"200px"}
                          className="ms-4 mt-4"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-7 p-5 bg-dark">
                <form>
                  <div className="form-group">
                    <div className="authfy-heading">
                      <h2 className="auth-title  text-center text-white fs-1 mb-5">
                        Forgot Password
                      </h2>
                      {/* <p className="fs-4 mt-2 text-center text-white">Don’t have an account?  <Link to= "/signup" className="lnk-toggler" data-panel=".panel-signup" >Sign Up Free!</Link></p> */}
                    </div>
                    {message ? (
                      <p
                        style={{
                          color: "rgba(13, 202, 240, 1)",
                          fontSize: "17px",
                          fontSize: "16px",
                          marginLeft: "25px",
                        }}
                      >
                        Password reset link send successfully to your Email
                      </p>
                    ) : (
                      ""
                    )}
                    <label for="exampleInputEmail1" className="fs-3 mt-5">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control mt-4 inputbox p-4"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      placeholder="Enter email address"
                      name="email"
                      onChange={handleChange}
                    />
                    {/* <input type="email" className="form-control mt-4 inputbox p-4" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email address" name='email' value={email} onChange={setVal}/> */}
                  </div>

                  <div
                    type="submit"
                    className="btn btn w-100 mt-3 btn btn-lg mt-5 login fs-3"
                    style={{ backgroundColor: "blueviolet", color: "white" }}
                    onClick={sendLink}
                  >
                    Send
                  </div>
                  <Link to="/"><p className='text-center fs-3 mt-5' style={{"color":"rgba(13, 202, 240, 1)", textDecoration:"underline"}}>Back to login</p></Link>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-2"></div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

// import React from 'react'
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from 'axios'

// function ForgotPassword() {
//     const [email, setEmail] = useState()
//     const navigate = useNavigate()

//     axios.defaults.withCredentials = true;
//     const handleSubmit = (e) => {
//         e.preventDefault()
//         axios.post('http://localhost:5000/forgot-password', {email})
//         .then(res => {
//             if(res.data.Status === "Success") {
//                 navigate('/')

//             }
//         }).catch(err => console.log(err))
//     }

//     return(
//         <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
//       <div className="bg-white p-5 rounded w-25">
//         <h2 style={{"color":"black"}}>Forgot Password</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="email">
//               <h4 className="my-3" style={{"color":"black"}}>Email:</h4>
//             </label>
//             <input
//               type="email"
//               placeholder="Enter Email"
//               autoComplete="off"
//               name="email"
//               className="form-control rounded-0 "
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <button type="submit" className="btn btn-success w-100 rounded-0 p-2 fs-4">
//             Send
//           </button>
//           </form>

//       </div>
//     </div>
//     )
// }

// export default ForgotPassword;
