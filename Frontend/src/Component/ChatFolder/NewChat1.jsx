import React, { useContext, useEffect, useState } from "react";
import "./Chat.css";
import Query from "../../utils/Query";
import Logo from "../../assets/chatbot-05_4x-removebg-preview.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPaperPlane, faArrowRight, faBars, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import LeftSideBar from "./LeftSideBar";
import RightSidebar from "../RightSidebar";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import React, { useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { ChatOpenAI } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
// import axios from 'axios';

// import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { CSVLink } from "react-csv";
import { AuthContext } from "../../Context/AuthContext";
import { QueryContext } from "../../Context/QueryContext";


const NewChat1 = () => {
  // const [queries, setQueries] = useState([]);                  
  const {queries,setQueries}=useContext(QueryContext)
    //for store query and display in UI
  const [exportData, setexportData] = useState([]);                    //for store query and display in UI
  const [getinputvalue, setInputvalue] = useState("");            //for getinput query from user
  const [showComponent, setShowComponent] = useState(false);       //for display feedback after 10 second
  const [answer, setRes] = useState("");
  const [hisdata, setHistory] = useState([]);
  const { userid } = useContext(AuthContext)
  const [query, setQuery] = useState("");

  // const [showModal, setShowModal] = useState(false);




  // Feedback
  const [referencedDocument, setreferencedDocument] = useState("Yes");
  const [feedback1, setfeedback1] = useState("");
  const [relaventAnswer, setrelaventAnswer] = useState("Yes");
  const [feedback2, setfeedback2] = useState("");
  const [doc, setDoc] = useState([]);
  const [Answer, setAnswer] = useState("");
  const [prevAnswer, setprevAnswer] = useState("");
  const [Documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [messageDisplayed, setMessageDisplayed] = useState(false);

  useEffect(() => {
    const fun = async () => {
      try {
        const response = await axios.post("http://localhost:5000/getuserquery", {
          userId: userid
        });
        if (response.data) {
          setQueries(response.data.response);
        }
        console.log(response);
        // setQueries(prevQueries => [...prevQueries, response.data.response]);
      } catch (error) {
        console.log(error);
      }

    }
    fun();


  }, [userid])
  const{setIsLoggedIn,setUserid}=useContext(AuthContext)
  useEffect(() => {
    const loaduser=async()=>{
      try {
        const token = localStorage.getItem("token");
        const {data}=await axios.post("http://localhost:5000/getuser",{token});
        if(data.user){
          setUserid(data.user._id);
          console.log(data.user)
        }
      } catch (error) {
        console.log(error);
      }
    }
    loaduser();
  
    
  }, [])
  useEffect(() => {
    handleScrollToBottom()
  
   
  }, [queries,loading])
  
  useEffect(() => {
    console.log(doc);
    console.log(query);
    const fun = async () => {

      try {
        const queryobj = {
          query,
          Answer,
          userId: userid,
          Documents: doc

        }
        const { data } = await axios.post("http://localhost:5000/queryAnswer", queryobj)
        setQueries(prevQueries => [...prevQueries, data.query]);
        setprevAnswer(Answer);
        setLoading(false)
        console.log(data);
        // scrollToBottom();
        // handleScrollToBottom()
      } catch (error) {
        console.log(error);
      }
    }
    if (Answer != prevAnswer) {

      fun();
    }



  }, [doc, Answer])

  // Function to handle input change for the first form

  // const [mergedData, setMergedData] = useState([]);
  let UserData = [];
  const handleScrollToDocument = (_id) => {
    console.log(_id)
    const element = document.getElementById(_id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const fetchData = async (query1) => {
    try {
      setQuery(query1)
      const pinecone = new Pinecone({
        // apiKey: "f783feb8-405e-4580-9970-749ea3b96185",
        apiKey: "1e21c47c-42c2-4767-989a-6b4aeaac53f4",
      });

      const index_name = "langchain-rag-multiple-docs";

      const model = new OpenAIEmbeddings({
        openAIApiKey: "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",
        // openAIApiKey: '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',
        modelName: "text-embedding-ada-002",
      });
      const pineconeIndex = pinecone.Index(index_name);

      const vectorstore = await PineconeStore.fromExistingIndex(model, {
        pineconeIndex,
      });

      // *******  vector similarity_search *******

      const results = await vectorstore.maxMarginalRelevanceSearch(query, {
        k: 3,         //fetch 3 documents from pinecone
        fetchK: 20,   // ?
      });
      //  console.log(results);
      // Assuming metadata is stored within each item in the results array
      const metadataArray = results.map((item) => item.metadata.file_name);

      // Access metadata properties and perform necessary operations
      console.log(metadataArray);

      setDoc(metadataArray);

      // *******  vector similarity_search end *******

      const llm = new ChatOpenAI({
        openAIApiKey: "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",
        // openAIApiKey: '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',
        temperature: 1.0,
        modelName: "gpt-3.5-turbo",
      });

      const chain = RetrievalQAChain.fromLLM(llm, vectorstore.asRetriever());

      const result = await chain.run(query1);
      if (result) {
        setAnswer(result);
        // setDocuments([metadata,metadata1,metadata2]);
      }

    } catch (error) {
      console.log(error);
    }
  };
  const redirectToURL = (metadata) => {

    if (metadata) {
      const metazip = metadata.slice(0, 9)
      const metazipL = metadata.slice(0, 12)


      // const url = `https://www.3gpp.org/ftp/Specs/2023-06/Rel-18/${metadata.slice(0,2)}_series/${metazip}.zip`;
      const m1 = metadata.slice(2, 5)
      const m2 = metadata.slice(2, 8)
      if (metadata.length == 23) {
        const url = `https://www.3gpp.org/ftp/Specs/archive/${metadata.slice(0, 2)}_series/${metadata.slice(0, 2)}.${m1}/${metazip}.zip`;
        window.open(url, "_blank"); // Alternatively, open the URL in a new tab

      }
      else {
        const url = `https://www.3gpp.org/ftp/Specs/archive/${metadata.slice(0, 2)}_series/${metadata.slice(0, 2)}.${m2}/${metazipL}.zip`;
        window.open(url, "_blank"); // Alternatively, open the URL in a new tab

        // window.location.href = url; // Redirect to the constructed URL
      }
    }

  };
  



  function handleSubmit(e) {

    e.preventDefault();

    const queryAns = {
      query: getinputvalue,
      Answer: answer,
    }

    // const inputValue = getinputvalue.trim();
    const userDataObject = {
      query: getinputvalue,
      // hisdata: hisdata,
      referencedDocument: referencedDocument,
      feedback1: feedback1,
      relaventAnswer: relaventAnswer,
      feedback2: feedback2 // Include feedback2 in userDataObject
    };

    // Push the userDataObject to exportData state
    setexportData((prevExportData) => [...prevExportData, userDataObject]);

    // Push the userDataObject to UserData array
    UserData.push(userDataObject);

    axios.post("http://localhost:5000/feedback", userDataObject)
      .then((res) => {
        if (getinputvalue) {
          setMessageDisplayed(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });

  }
















  const headers = [

    {
      label: "ReferencedDocument", key: "referencedDocument"
    },
    {
      label: "Feedback1", key: "feedback1"
    },
    {
      label: "RelaventAnswer", key: "relaventAnswer"
    },
    {
      label: "Feedback2", key: "feedback2"
    },
  ]

  const csvData = exportData.map((query) => ({

    referencedDocument: query.referencedDocument,
    feedback1: query.feedback1,
    relaventAnswer: query.relaventAnswer,
    feedback2: query.feedback2,
  }));


  const csvlink = {
    filename: "my_file.csv",
    headers: headers,
    // data:UserData
  }
  const FeedbackMsg = async (id) => {
    console.log(id);
    const formdata = {
      referencedDocument,
      feedback1,
      feedback2,
      relaventAnswer

    }
    console.log(formdata);
    try {

      const { data } = await axios.post(`http://localhost:5000/feedback`, { id, formdata });
      if (data.succes) {
        console.log(data);
        toast.success("Feedback Sent Successfully", { className: "fs-4 fw-bold", position: "top-right", autoclose: 2000 });
        setShowComponent(prev=>!prev);
      }
    } catch (error) {
      console.log(error);
    }
  }
  // const formattedData = UserData.map(user => Object.values(user));


  // setMessageDisplayed(true)
  const location = useLocation();
  // const question = useRef('');


  const handleChange = async ({ historydata }) => {
    fetchData(getinputvalue);
    setLoading(true);
    handleScrollToBottom()
    setInputvalue("")
    
    
  };

  // Key Press Enter 
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // handleChange(event);
      setInputvalue("")
      handleSubmit(event);
      // callapi();
      fetchData(getinputvalue);
      setLoading(true);
      handleScrollToBottom()
    }
  };


  // Function to scroll to the bottom
  const scrollToBottom = () => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };


  // Delete
  const removeFromHistory = (index) => {
    setHistory(prevHistory => prevHistory.filter((_, i) => i !== index));
  };
  const handleScrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };
  const handleDownloadCSV = (index,e) => {
    e.preventDefault();

    const query = queries[index];
    if (!query) {
        console.error("Invalid query index");
        return;
    }

    const csvData = [{
        _id: query._id,
        userId: query.userId,
        query: query.query,
        Answer: query.Answer,
        Documents: query.Documents.join('; '),
        date: query.date
    }];

    const csvContent = [
        ["_id", "userId", "query", "Answer", "Documents", "date"],
        ...csvData.map(row => [row._id, row.userId, row.query, row.Answer, row.Documents, row.date])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `query_${query._id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
  

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-sm-3 col-xl-3  ">
              <div className="position-fixed leftbars1">
                <LeftSideBar UserData={UserData} historyData={hisdata} removeFromHistory={removeFromHistory} handleScrollToDocument={handleScrollToDocument} />
              </div>
            </div>
            <div className="col-lg-6 col-sm-6 col-xl-6 overflow-x-hidden">
              <div className="">
                <div className="mt-5">

                  {/* Authentication */}
                  {/* <FontAwesomeIcon icon={faBars} className="fs-1 fabars"/> */}
                  <nav class="navbar navbar-expand-lg navbar-light " style={{ backgroundColor: "rgb(6, 2, 45)" }}>
                    <div class="container-fluid">
                      <a class="navbar-brand" >

                      </a>
                      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        {/* <span class="navbar-toggler-icon"></span> */}
                        <FontAwesomeIcon icon={faBars} className="fs-1 fabars text-white "></FontAwesomeIcon>
                      </button>
                      <div class="collapse navbar-collapse" id="navbarSupportedContent">

                        <LeftSideBar historyData={hisdata} removeFromHistory={removeFromHistory} handleScrollToDocument={handleScrollToDocument} ></LeftSideBar>
                      </div>
                    </div>
                  </nav>


                  {/* <FontAwesomeIcon icon={faEllipsisVertical} className=" fs-1 faEllipsisVertical "/> */}
                  <nav class="navbar navbar-expand-lg navbar-light " style={{ backgroundColor: "rgb(6, 2, 45)" }}>
                    <div class="container-fluid">
                      <a class="navbar-brand" >

                      </a>
                      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent1" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        {/* <span class="navbar-toggler-icon"></span> */}
                        <FontAwesomeIcon icon={faEllipsisVertical} className=" fs-1 faEllipsisVertical text-white " style={{ marginRight: "400px" }} />
                      </button>
                      <div class="collapse navbar-collapse" id="navbarSupportedContent1">

                        <RightSidebar />
                      </div>
                    </div>
                  </nav>
                  <div className="d-flex justify-content-center">

                    <img src={Logo} alt="" className="botlogo1 btnicon " />

                  </div>

                  <div className="text-white fs-4 welcomeuser p-3">Hello <span style={{ "color": " rgba(13, 202, 240, 1)", "fontSize": "18px" }}>{location.state.Useremail}! </span>How can I help you? Please ask your question?</div>

                  {/* Render queries and responses */}
                  {queries.map((query, index) => (
                    <div id={query._id} className="row mt-5 chat-container" key={index}>
                      <div className="col-lg-1 ms-5">
                        <span className="user-icon fs-3 ms-5">
                          <FontAwesomeIcon icon={faUser} />
                        </span>
                      </div>
                      <div className="middle">
                        <div className="col-lg-8 Middlechats ms-5">
                          <p className="text-info fs-4 rightside ms-5">{query?.query}</p>
                        </div>
                      </div>
                      <div className="row mt-5">
                        {/* {answer && (
                          <div className="col-lg-1 ">
                            <span className="">
                              <img src={Logo} alt="" className="botlogo" />
                            </span>
                          </div>

                        )} */}



                        {query.Answer && (
                          <div className="col-lg-10">
                            <div className="text-white fs-4 respmsg">{query.Answer}</div>

                            <h2 className="text-info">Documents:</h2>
                            {query.Documents.map((doc, index) => (

                              <span >

                                <ul style={{ cursor: "pointer" }}  >
                                  <li style={{ cursor: "pointer" }} >
                                    <h3 className="text-white " style={{ cursor: "pointer" }}
                                      onClick={() => redirectToURL(doc)} >{doc}</h3>
                                  </li>
                                </ul>

                              </span>
                            ))}
                            <div className="row">

                              <div className="col-lg-6 col-6">
                                {/*  Feedback start */}
                                <h4 className="text-info mt-4 p-3" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" style={{ "backgroundColor": "rgb(14, 38, 59)", borderRadius: "10px", cursor: "pointer", marginBottom: "50px" }}>FeedBack <buttun className="ms-5 text-white bg-info p-2" style={{ borderRadius: "10px" }} onClick={() => setShowComponent(true)}> Click <FontAwesomeIcon icon={faArrowRight} /></buttun></h4>
                              </div>
                              <div className="col-lg-6 col-6">
                                <button className="btn btn-lg mt-4 btn-info text-white w-100 p-2 fs-4 " onClick={(e)=>handleDownloadCSV(index,e)}>Export to csv</button>

                              </div>
                            </div>


                            <div class="modal fade bg-dark" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
                              <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                  <div class="modal-header">
                                    <h2 class="modal-title text-dark " id="exampleModalLabel" >Give Your Feedback</h2>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                  </div>

                                  <div class="modal-body">

                                    <div class="container">

                                      {showComponent && (
                                        <div className="col-lg-12">
                                          {/* Your JSX code here */}
                                          <div className="">
                                            <div className="container">
                                              <div className="form">
                                                <div className="row">
                                                  <div className="col-lg-6  mt-4">
                                                    <button className="btn btn w-100  ms-2  feedback text-info  queries text-start fs-3 " style={{ height: "145px" }}>
                                                      <span className=" text-info fs-4 ms-4 mt-5">
                                                        1. Is the document referenced correct?

                                                        <span className="ms-3"> <input type="radio" className="form-check-input ms-5 mt-2" name="referencedDocument" value="Yes" checked={referencedDocument === "Yes"} onChange={(e) => { setreferencedDocument(e.target.value); }} />{" "} Yes &nbsp;&nbsp;&nbsp;</span>
                                                        <input type="radio" className="form-check-input ms-3 mt-2" name="referencedDocument" value="No" checked={referencedDocument === "No"} onChange={(e) => { setreferencedDocument(e.target.value); }} />{" "} No &nbsp;&nbsp;
                                                      </span>

                                                    </button>
                                                  </div>
                                                  <div className="col-lg-6">
                                                    <button className="btn btn feedback w-100 ms-2  mt-4 queries text-start fs-3  ">
                                                      <span className="text-info fs-4 ms-4 mb-5 ">
                                                        2. Would you like to provide any other
                                                        referenced document, if yes please
                                                        enter:
                                                        <div className="d-flex">
                                                          <input
                                                            type="text"
                                                            className="form-control"
                                                            name="feedback1"
                                                            // value={feedback1}
                                                            onChange={(e) => { setfeedback1(e.target.value) }}
                                                            style={{
                                                              backgroundColor: "transparent",
                                                              fontSize: "15px",
                                                              color: "white"
                                                            }}
                                                          />

                                                          {/* <button className="text-white btn btn-dark fs-4 mt-2" >
                                          <FontAwesomeIcon
                                            icon={faPaperPlane}
                                          />
                                        </button> */}

                                                        </div>
                                                      </span>{" "}
                                                    </button>
                                                  </div>
                                                </div>
                                                <div className="row">
                                                  <div className="col-lg-6">
                                                    <button className="btn btn feedback w-100 ms-2  mt-4  queries text-start fs-3" style={{ height: "120px" }}>
                                                      <span className="text-info fs-4 ms-4 mb-5">
                                                        {/* 3. Is the answer relevent?{" "} */}
                                                        3. Is the answer relevent?
                                                        <br />
                                                        <span className="ms-4"><input type="radio" className="form-check-input ms-3 mt-2" name="relaventAnswer" value="Yes" checked={relaventAnswer === "Yes"} onChange={(e) => { setrelaventAnswer(e.target.value); }} />{" "} Yes &nbsp;&nbsp;</span>
                                                        <input type="radio" className="form-check-input ms-3 mt-2" name="relaventAnswer" value="No" checked={relaventAnswer === "No"} onChange={(e) => { setrelaventAnswer(e.target.value); }} />{" "} No &nbsp;&nbsp;
                                                        {/* <input type="checkbox" /> */}
                                                      </span>{" "}
                                                    </button>
                                                  </div>
                                                  <div className="col-lg-6">
                                                    <button className="btn btn feedback w-100 ms-2  mt-4  queries text-start fs-3  ">
                                                      <span className="text-info fs-4 ms-4 mb-5   ">
                                                        4. Would you like to provide any other
                                                        answer, if yes please enter:
                                                        <div className="d-flex">
                                                          <input
                                                            type="text"
                                                            className="form-control"
                                                            name="feedback2"
                                                            // value={feedback2}
                                                            onChange={(e) => { setfeedback2(e.target.value) }}
                                                            style={{
                                                              backgroundColor: "transparent",
                                                              fontSize: "15px",
                                                              color: "white"
                                                            }}
                                                          />
                                                          {/* <button className="text-white btn btn-dark fs-4 mt-2" >
                                          <FontAwesomeIcon
                                            icon={faPaperPlane}
                                          />
                                        </button> */}
                                                        </div>
                                                      </span>{" "}
                                                    </button>

                                                  </div>
                                                  <div className="text-end">
                                                    <buttun type="submit" onClick={() => FeedbackMsg(query._id)} className="btn btn w-100  btn btn-lg mt-5 login fs-3" style={{ "color": "white", position: "relative", bottom: "25px", "backgroundColor": "rgb(37, 26, 82)" }}>Submit</buttun>
                                                  </div>
                                                </div>




                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                    </div>

                                    <div class="row">
                                      <div class="col-lg-3">
                                        <button style={{ "border-radius": "18px;" }} type="button" class="btn btn-dark  text-white p-3 fs-5 ms-4"
                                          data-bs-dismiss="modal">Cancel</button>
                                      </div>
                                      <div class="col-lg-3 text-end ms-auto" >

                                        {/* <button style="border-radius: 18px;" type="button" class="btn btn-primary mt-4  text-white "data-bs-target="#exampleModalToggle2" data-bs-toggle="modal"
   >Next <span class="ms-1"></span><i class="fa-solid fa-arrow-right text-white"></i></button> */}

                                      </div>
                                    </div>





                                  </div>

                                </div>
                              </div>
                            </div>

                            {/* Display message if messageDisplayed is true */}
                            {messageDisplayed && (
                              <div className="alert alert-success mt-3" role="alert">
                                Your submission has been successful!
                              </div>
                            )}
                            {/*  Feedback end */}
                          </div>
                        )}

                      </div>
                    </div>

                  ))}
                  <div>
                    {loading && (
                      <>
                        <h2>{query}</h2>
                        <SyncLoader className="my-5 ms-3" color="rgba(13, 202, 240, 1)" />
                      </>
                    )}
                  </div>

                  <div className="">

                    <div className="row sentbox">
                      <div className="col-lg-12  inputbox1 d-flex">
                        <input
                          onKeyDown={handleKeyPress}
                          name="query"
                          type="text"

                          placeholder="Ask a Question..."
                          value={getinputvalue}
                          onChange={(e) => {
                            setInputvalue(e.target.value);

                          }}


                        />
                        <button
                          type="button"
                          className="btn bnt fs-2 btn-send w-25 ms-5"
                        onClick={handleChange}
                        >
                          <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
                {/* Rightsidebar */}

                <div className="">


                </div>

              </div>
            </div>
            <div className="col-lg-3 col-sm-3 col-xl-3 position-fixed top-0 end-0  rightbars1 left-corner">
              <RightSidebar></RightSidebar>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default NewChat1;


































