import {React, useState} from 'react'
import Documents from './ChatFolder/Documents'
import setRes from "./ChatFolder/NewChat1";
import {Link} from "react-router-dom"
import Query from '../utils/Query';
import '../Component/ChatFolder/Chat.css';

// const RightSidebar = ({obj}) => {
const RightSidebar = () => {

  // const obj1 = obj;
  // const [document, setDocument] = useState({});
 
  return (
    <div>
           <div className="mt-4">
              <button className="btn btn-info  btn-lg w-75  fs-3 ms-4  mt-5 ">
                <span className="text-dark fs-4 ms-3 ">
                  {" "}
                  {/* <Link to="https://www.3gpp.org/3gpp-groups"
                    className="text-white fs-3"
                    
                 
                  >
                    3GPP-Groups
                  </Link>{" "} */}
                  <a href="https://www.3gpp.org/3gpp-groups" target="_blank"  rel="noreferrer" className="text-white fs-3  ">
                  3GPP-Groups
                   </a>
                </span>{" "}
              </button>
            </div>
            <div className="mt-4">
              <button className="btn btn-dark  w-75   ms-4  mt-5 text-start fs-3 queries mt-3">
                <span className="text-white fs-4 ms-2">
                  {/* <Link to="https://portal.3gpp.org"
                    className="text-white fs-3"
                   
                   
                  >
                    3GPP Portal
                  </Link> */}
                  <a href="https://portal.3gpp.org" target="_blank"  rel="noreferrer" className="text-white fs-3  ">
                  3GPP Portal
                   </a>
                </span>{" "}
              </button>
            </div>
            <div className="mt-4">
              <button className="btn btn-dark  w-75 ms-4  mt-5  queries text-start fs-3  ">
                <span className="text-white fs-4 ms-4 mb-5">
                  
                <a href="https://www.3gpp.org/specifications-technologies" target="_blank"  rel="noreferrer" className="text-white fs-3  ">

                    3GPP Specification
                </a>
                </span>{" "}
              </button>
            </div>
            <div className="mt-4">
              <button className="btn btn-dark  w-75 ms-4  mt-5  queries text-start fs-3  ">
                <span className="text-white fs-4 ms-4 mb-5">
                  {/* <Link
                    to="https://www.3gpp.org/about-us/introducing-3gpp"
                    target="_blank"
                    className="text-white fs-3"
                  >
                    3GPP Introducing
                  </Link> */}
                 
                </span>{" "} <a href="https://www.3gpp.org/about-us/introducing-3gpp" target="_blank"  rel="noreferrer" className="text-white fs-3  ">
                  3GPP Introducing
                   </a>
              </button>
            </div>
            <div className="mt-4">
              <button className="btn btn-dark  w-75 ms-4  mt-5  queries text-start fs-3  ">
                <span className="text-white fs-4 ms-4 mb-5">
                  {/* <Link to="https://www.3gpp.org/about-us/introducing-3gpp"
                   
                    target="_blank"
                    className="text-white fs-3"
                  >
                     </Link> */}

                     
                   {/* {
            setTimeout(()=>{
                 <Documents></Documents>
            }, 10000)
           } */}
           {/* {
           setRes && (<Documents></Documents>)
           } */}
            {/* <Documents/> */}
            {/* <h1 className='text-white bg-dark text-center' style={{ "borderRadius": "13px" }}>Documents</h1> */}
       
         {/* {
          obj1.map((item,index)=>(
            <div key={index}>
              <h1 className='text-white'>{item.file_name}</h1>
            </div>
          ))
         } */}
               
                </span>{" "}
              </button>
            </div>
    </div>
  )
}

export default RightSidebar