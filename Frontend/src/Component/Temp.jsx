import React, { useState } from 'react';

const documents = [
  { id: 'doc1', content: 'Document 1' },
  { id: 'doc2', content: 'Document 2' },
  { id: 'doc3', content: 'Document 3' },
  { id: 'doc4', content: 'Document 4' },
  { id: 'doc5', content: 'Document 5' },
  { id: 'doc6', content: 'Document 6' },
  { id: 'doc7', content: 'Document 7' },
  { id: 'doc8', content: 'Document 8' },
  { id: 'doc9', content: 'Document 9' },
  { id: 'doc10', content: 'Document 10' },
];

const DocumentList = () => {
  const [selectedDocId, setSelectedDocId] = useState('');

  const handleScrollToDocument = () => {
    const element = document.getElementById(selectedDocId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="document-select">Select Document: </label>
        <select
          id="document-select"
          value={selectedDocId}
          onChange={(e) => setSelectedDocId(e.target.value)}
        >
          <option value="">--Select a document--</option>
          {documents.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.content}
            </option>
          ))}
        </select>
        <button onClick={handleScrollToDocument}>Go</button>
      </div>
      <div style={{ marginTop: '50px' }}>
        {documents.map((doc) => (
          <div
            key={doc.id}
            id={doc.id}
            style={{
              height: '100vh',
              border: '1px solid black',
              marginBottom: '10px',
              padding: '20px',
            }}
          >
            {doc.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;
