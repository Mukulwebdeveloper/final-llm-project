import React, { useContext, useEffect, useState } from 'react';
import Logo from "../../assets/chatbot-05_4x-removebg-preview.png";
import wikigraph from '../../assets/OIP-removebg-preview.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Chat.css';
import { CSVLink } from "react-csv";
import {
  faPlus,
  faTrash,
  faArrowRightFromBracket,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useLocation } from "react-router-dom";
import { QueryContext } from '../../Context/QueryContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import CsvButton from './CsvButton';

const LeftSideBar = ({ UserData, historyData, removeFromHistory ,handleScrollToDocument}) => {
  const [userHistory, setUserHistory] = useState([]);
  const { queries, setQueries } = useContext(QueryContext);
  
  useEffect(() => {
    setUserHistory(historyData);
  }, [historyData]);

  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    navigate("/");
    localStorage.removeItem("token");

  };

  const NewChat = () => {
    window.location.reload();
  };
  const removequery=async(_id)=>{
    try {
      console.log(_id)
      const {data}=await axios.post("http://localhost:5000/removeQuery",{_id});
      // console.log(response.data);
      if(data.message==="Deleted successfully"){
        setQueries(queries.filter((query)=>query._id!==_id));
        toast.success("Query Deleted  Successfully", { className: "fs-4 fw-bold", position: "top-right", autoclose: 2000 });

      }
    } catch (error) {
      console.log(error);
    }
  }

  const downloadCSV = () => {
    let csvContent = "S.no,History\n";
    userHistory.forEach((item, index) => {
      csvContent += `${index + 1},${item.query}\n`; // Assuming item is an object with a query property
    });
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "user_history.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <div className="container logo-title">
        <img src={Logo} alt="" className="logo" style={{ width: "150px" }} />
        <span className="h1 text-white chatbot" style={{ backgroundColor: "rgb(6, 2, 45)" }}>ChatBot</span>
      </div>
     
      <div className="mt-5">
        <button className="btn btn-dark btn-lg text-start fs-3 queries mt-3" style={{ width: "280px" }}>
          <img src={wikigraph} alt="" className="wiki ms-5" />
          <span className="text-white fs-4 ms-0">
            <a href="https://blinpete.github.io/wiki-graph/?lang=de&query=3rd%20Generation%20Partnership%20Project&wordle=undefined" target="_blank" rel="noreferrer" className="text-white fs-3 ms-2">
              WikiGraph
            </a>
          </span>
        </button>
      </div>
      <div className="mtop">
        <div className="text-white fs-3 mt-4 cpointer">
          <button className="btn btn-info btn-lg fs-3 mt-5" style={{ width: "280px" }} onClick={NewChat}>
            <FontAwesomeIcon icon={faClockRotateLeft} />
            <span className="text-dark fs-4 ms-3">History</span>
          </button>
          <div className='scrollable-history'>
            <ul className='mt-3'>
              {queries.map((query, index) => (
                <div className='m-1' style={{ borderRadius: "10px", marginRight: "10px" }} key={index}>
                  <li  onClick={()=>handleScrollToDocument(query._id)} className='text-info w-25 m-2 ms-0' style={{ fontSize: "13px" }}>
                    <span className='text-white fs-4'>{index + 1}.</span> {query.query}
                    <span onClick={() => removequery(query._id)}>
                      <FontAwesomeIcon className='ms-3 text-white' icon={faTrash} />
                    </span>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-5 Logout">
        <button className="btn btn-light btn-lg mt-5" style={{ width: "280px" }} onClick={logout}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          <span className="text-dark fs-3">Logout</span>
        </button>
      </div>
      <CsvButton/>
      {/* <div className="exportCsv">
        <div>
          <button style={{ width: "280px" }} target="_blank" className="btn btn-info btn-lg" onClick={downloadCSV}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            <span className="text-dark fs-3 w-100">Export to CSV</span>
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default LeftSideBar;
