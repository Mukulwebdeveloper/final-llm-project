// OpenAI

// import React, { useState, useEffect } from 'react';
// import { SyncLoader } from "react-spinners";
// import { ChatOpenAI } from '@langchain/openai';
// import {
//     ChatPromptTemplate,
//     SystemMessagePromptTemplate,
//     HumanMessagePromptTemplate,
// } from "@langchain/core/prompts";

// const Query = ({ query }) => {
//     const [response, setResponse] = useState(null);

//     const SECRET_KEY = process.env.REACT_APP_API_KEY;

//     useEffect(() => {
//         const fetchResponse = async () => {
//             try {
//                 const chat = new ChatOpenAI({ openAIApiKey: SECRET_KEY });

//                 const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate("How can I assist you within a second type anything here.");
//                 const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(query);

//                 const chatPrompt = ChatPromptTemplate.fromMessages([systemMessagePrompt, humanMessagePrompt]);

//                 const formattedChatPrompt = await chatPrompt.formatMessages({});
//                 console.log("Formatted chat Prompt:", formattedChatPrompt);

//                 const response = await chat.invoke(formattedChatPrompt);
//                 console.log("Response:", response.content);
//                 setResponse(response.content);
//             } catch (error) {
//                 console.error("Error:", error);
//                 // Handle error gracefully
//             }
//         };

//         fetchResponse();
//     }, [query, SECRET_KEY]);

//     return (
//         <div>
//             {response ? <div>{response}</div> : <div><SyncLoader className="my-5 ms-3" color=" rgba(13, 202, 240, 1)" /> </div>}
//         </div>
//     );
// };

// export default Query;

// // Pinecone database
import React, { useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { ChatOpenAI } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
import axios from 'axios';
// import JSZip from 'jszip';

// import { Link } from "react-router-dom";
// import RightSidebar from "../Component/RightSidebar";

const Query = ({ query }) => {
  const [response, setResponse] = useState([]);
  // const [previousResponse, setPreviousResponse] = useState(null);
  const [responses, setResponses] = useState(null);
  const [doc, setDoc] = useState([]);
  // const [previousResponse, setPreviousResponse] = useState(null);


  const fetchData = async () => {

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
    //    console.log(metadata);

    setDoc(metadataArray);

    // *******  vector similarity_search end *******

    const llm = new ChatOpenAI({
      openAIApiKey: "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",
      // openAIApiKey: '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',
      temperature: 1.0,
      modelName: "gpt-3.5-turbo",
    });

    const chain = RetrievalQAChain.fromLLM(llm, vectorstore.asRetriever());
  
    const result = await chain.run(query);
    if(result){
      setResponses(result);
      // console.log('home');
      // console.log(query);
      // console.log(result);

      const queryAns = {
        query: query,
        Answer: result,
      }
  
  
      // axios.post("http://localhost:5000/queryAnswer", queryAns)
      //   .then((res) => {
      //   console.log("Hello");
        // })
        // .catch((err) => {
        //   console.log(err);
        // });


      // setResponse(prevResponses => [result, ...prevResponses]);
    }
    // const response = await index.query({query});
    // console.log(response);
    // console.log(result);

    
    // setResponse((prevResponses) => [result, ...prevResponses.slice(0, 1)]);
    // setPreviousResponse(result);
  };
  useEffect(() => {
    fetchData();

  }, [query]);
  // useEffect(() => {
  //   console.log(doc);
  
    
  // }, [doc])
  

  // Redirect function


  const metadata = doc[0];
  // alert(metadata);
  const redirectToURL = () => {

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
  const metadata1 = doc[1];
  // alert(metadata);
  const redirectToURL1 = () => {
    const metazip1 = metadata1.slice(0, 9)
    const metazipL1 = metadata.slice(0, 12)
    if (metadata1) {
      // const url = `https://www.3gpp.org/ftp/Specs/2023-06/Rel-18/${metadata1.slice(0,2)}_series/${metazip1}.zip`;
      // const url = `https://www.3gpp.org/ftp/Specs/archive/${metadata1.slice(0,2)}_series/`;
      const m1 = metadata1.slice(2, 5)
      const m2 = metadata1.slice(2, 8)
      if (metadata1.length == 23) {

        const url = `https://www.3gpp.org/ftp/Specs/archive/${metadata1.slice(0, 2)}_series/${metadata1.slice(0, 2)}.${m1}/${metazip1}.zip`
        window.open(url, "_blank"); // Alternatively, open the URL in a new tab
      }
      else {
        const url = `https://www.3gpp.org/ftp/Specs/archive/${metadata1.slice(0, 2)}_series/${metadata1.slice(0, 2)}.${m2}/${metazipL1}.zip`
        window.open(url, "_blank"); // Alternatively, open the URL in a new tab
      }
      // window.location.href = url; // Redirect to the constructed URL
    }

  };
  const metadata2 = doc[2];
  // alert(metadata);
  const redirectToURL2 = () => {
    const metazip2 = metadata2.slice(0, 9)
    const metazipL2 = metadata2.slice(0, 12)

    if (metadata2) {
      // const url = `https://www.3gpp.org/ftp/Specs/2023-06/Rel-18/${metadata2.slice(0,2)}_series/${metazip2}.zip`;
      const m1 = metadata2.slice(2, 5)
      const m2 = metadata2.slice(2, 8)
      if (metadata2.length == 23) {

        const url = `https://www.3gpp.org/ftp/Specs/archive/${metadata2.slice(0, 2)}_series/${metadata2.slice(0, 2)}.${m1}/${metazip2}.zip`
        window.open(url, "_blank"); // Alternatively, open the URL in a new tab
      }
      else {
        const url = `https://www.3gpp.org/ftp/Specs/archive/${metadata2.slice(0, 2)}_series/${metadata2.slice(0, 2)}.${m2}/${metazipL2}.zip`
        window.open(url, "_blank"); // Alternatively, open the URL in a new tab

      }
      // window.location.href = url; // Redirect to the constructed URL
    }


  };


  return (
    <div>


      {/* ***Response from pinecone*** */}
      {responses !== null ? (
        <p>{responses}</p>
      ) : (
        <SyncLoader className="my-5 ms-3" color="rgba(13, 202, 240, 1)" />
      )}
  

      
      {/* ****Documents from metadata **** */}
      {
        <>
          <span >
            <h2 className="text-info">Documents:</h2>

            <ul style={{ cursor: "pointer" }}  >
              <li style={{ cursor: "pointer" }} >
                <p className="text-white " style={{ cursor: "pointer" }}
                  onClick={redirectToURL}>{doc[0]}</p>
              </li>
            </ul>
            <ul style={{ cursor: "pointer" }}  >
              <li style={{ cursor: "pointer" }} >
                <p className="text-white "
                  onClick={redirectToURL1}>{doc[1]}</p>
              </li>
            </ul>
            <ul style={{ cursor: "pointer" }}  >
              <li style={{ cursor: "pointer" }} >
                <p className="text-white "
                  onClick={redirectToURL2}>{doc[2]}</p>
              </li>
            </ul>
          </span>
        </>
      }
      {/* ****Documents from metadata **** */}


    </div>
  );
};

export default Query;



// {response.map((response, index) => {
//   return (
//     <div key={index}>
//       {response !== null ? (
//         <> 
//           <p>{response}</p>
//           <hr />
//         </>
//       ) : (
//         <SyncLoader className="my-5 ms-3" color="rgba(13, 202, 240, 1)" loading={true} />
//       )}
//     </div>
//   );
//   {/* } */ }
//   return null; // If the response is not related to the current query, return null
// })}
