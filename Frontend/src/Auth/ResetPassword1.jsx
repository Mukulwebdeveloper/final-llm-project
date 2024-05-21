import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../App.css";

function ResetPassword() {
  const { id, token } = useParams();
  const history = useNavigate();

  // const [password, setPassword] = useState("");
  const [user, setUser] = useState(
    //for send userDetail to mongodb
    {
      password: "",
      confirmPassword: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const [message, setMessage] = useState(false);

  const userValid = async () => {
    const res = await fetch(`/reset_password/${id}/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application-json",
      },
    });
    const data = await res.json();

    if (data.status == 201) {
      console.log("user valid");
    } else {
      history("*");
    }
  };

  // const setVal = (e) => {
  //   setPassword(e.target.value);
  // }
  // const sendPassword = async(e)=>{
  //   e.preventDefault();
  //   const res = await fetch(`/${id}/${token}`,{
  //     method:"POST",
  //     headers:{
  //       "Content-Type":"application-json"
  //     },
  //     body:JSON.stringify({password})
  //   });
  //   const data = await res.json();
  //   console.log("Response from server:", data); // Add this line

  //   if(data.status == 201){
  //     setPassword("");
  //     setMessage(true);

  //   }else{
  //     toast.error("!Token Expired generate new Link",{className:"fs-4"})
  //   }
  // }
  const sendPassword = async (e) => {
    const { password, confirmPassword } = user;
    // e.preventDefault();
    if (password === confirmPassword) {
      try {
        const res = await fetch(`/${id}/${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        });
        const data = await res.json();
        console.log("Response from server:", data);

        if (data.status === 201) {
          setUser("");
          setMessage(true);
        } else {
          throw new Error(data.message); // Throw an error for 401 status
        }
      } catch (error) {
        console.error("Error:", error.message);
        toast.error("Failed to update password. Please try again.", {
          className: "fs-4",
        });
      }
    }
  };
  useEffect(() => {
    userValid();
  }, []);
  return (
    <>
      <div className="container-fluid loginpage p-5 ">
        <div className="row ">
          {/* {console.log(user)} */}
          <div className="col-lg-4"></div>
          <div className="col-lg-8 mt-5">
            <div className="row  mt-5">
              {/* <div className="col-lg-5 bg-white">
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
              </div> */}
              <div className="col-lg-7 p-5 bg-dark">
                <form>
                  <div className="form-group">
                    <div className="authfy-heading">
                      <h2 className="auth-title  text-center text-white fs-1 mb-5">
                        Enter New Password
                      </h2>
                      {/* <p className="fs-4 mt-2 text-center text-white">Don’t have an account?  <Link to= "/signup" className="lnk-toggler" data-panel=".panel-signup" >Sign Up Free!</Link></p> */}
                    </div>
                    {message ? (
                      <p
                        className="text-center mt-4"
                        style={{
                          color: "rgba(13, 202, 240, 1)",
                          fontSize: "20px",
                        }}
                      >
                        Password Successfully Updated
                      </p>
                    ) : (
                      ""
                    )}

                    {/* <label  className="fs-3 mt-5">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control mt-4 inputbox p-4"
                      id="exampleInputPassword1"
                     
                      placeholder="Enter password"
                      name="password"
                      value={user.password}
                      onChange={setVal}
                    /> */}

                    <div className="form-group mt-3">
                      {/* <label for="exampleInputPassword1" className="fs-5">Password</label> */}
                      <input
                        type="password"
                        value={user.password}
                        onChange={handleChange}
                        className="form-control mt-4 inputbox p-4"
                        id="exampleInputPassword1"
                        name="password"
                        placeholder="Enter New Password"
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

                    {/* <input type="email" className="form-control mt-4 inputbox p-4" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email address" name='email' value={email} onChange={setVal}/> */}
                  </div>

                  <div
                    type="submit"
                    className="btn btn w-100 mt-3 btn btn-lg mt-5 login fs-3"
                    style={{ backgroundColor: "blueviolet", color: "white" }}
                    onClick={sendPassword}
                  >
                    Send
                  </div>
                  <Link to="/">
                    <p
                      className="text-center fs-3 mt-5"
                      style={{
                        color: "rgba(13, 202, 240, 1)",
                        textDecoration: "underline",
                      }}
                    >
                      Back to login
                    </p>
                  </Link>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-2"></div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
