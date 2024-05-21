import React, { useContext, useEffect, useState } from 'react'
// import Login from './Auth/Login'
import Signup from './Auth/Signup'
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import Login from './Auth/Login'
import NewChat1 from './Component/ChatFolder/NewChat1'
import ForgotPassword from './Auth/ForgotPassword'
import ResetPassword1 from './Auth/ResetPassword1'
import { AuthContext, AuthProvider } from './Context/AuthContext';
import { QueryContext, QueryProvider } from './Context/QueryContext';
import DocumentList from './Component/Temp'
import axios from 'axios'
const App = () => {

  const [userLogin, setLoginUser] = useState({})
  
  
  // console.log(userLogin);
  // return (
  //   <BrowserRouter >
  //     <AuthProvider>
        
          
  //         <Routes>
  //           <Route path='/home' element={<NewChat1 />} />
  //           {/* Route for '/login' path */}
  //           <Route path='/' element={<Login />} />
  //           <Route path="/forgot-password" element={<ForgotPassword />}></Route>
  //           <Route path="/reset_password/:id/:token" element={<ResetPassword1 />}></Route>
  //           {/* Route for '/signup' path */}
  //           <Route path='/signup' element={<Signup />} />
  //           {/* <Route path="/" element={<Home />} /> */}
           
  //         </Routes>
        
  //     </AuthProvider>
  //   </BrowserRouter>
  // )
  return (

    <div>
      <QueryProvider>
      <AuthProvider>
      <Routes>
        {/* Route for '/' path */}
        {/* <Route path="/" element={userLogin && userLogin._id ? <NewChat1 setLoginUser={setLoginUser} /> : <Login setLoginUser={setLoginUser}/>} /> */}

        {/* <Route path='/' element={<NewChat1 setLoginUser={setLoginUser}/>} /> */}
        <Route path='/home' element={<NewChat1 />} />
        <Route path='/temp' element={<DocumentList />} />
        {/* Route for '/login' path */}
        <Route path='/' element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/reset_password/:id/:token" element={<ResetPassword1 />}></Route>
        {/* Route for '/signup' path */}
        <Route path='/signup' element={<Signup />} />
      </Routes>
      </AuthProvider>
      </QueryProvider>
    
    </div>



  )
}

export default App