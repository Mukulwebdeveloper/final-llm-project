import React, { useState } from 'react';

const YourComponent = () => {
  // Assuming feedback is stored in state
  const [feedback, setFeedback] = useState({
    referencedDocument: '' // Initialize referencedDocument in the state
  });

  // Function to update referencedDocument in the feedback state
  const handleFeedback = (event) => {
    const { name, value } = event.target;
    setFeedback(prevFeedback => ({
      ...prevFeedback,
      [name]: value
    }));
  };

  // Function to handle sending feedback
  const Sentfeedback = () => {
    // Here you can send the feedback to your backend or wherever you need
    alert(feedback.referencedDocument); // For demonstration, logging the value

    // Reset the feedback state or perform other actions as needed
    setFeedback(prevFeedback => ({
      ...prevFeedback,
      referencedDocument: '' // Resetting referencedDocument after sending feedback
    }));
  };

  return (
    <div>
      <button
        className="text-white btn btn-dark fs-4 ms-2"
        name="referencedDocument"
        value="Yes" // Set value to "Yes"
        onClick={Sentfeedback}
     // This event doesn't make sense for buttons
      >
        Yes
      </button>
      <button
        className="text-white btn btn-dark fs-4 ms-5"
        name="referencedDocument"
        value="No" // Set value to "No"
        onClick={Sentfeedback}
      >
        No
      </button>
    </div>
  );
};

export default YourComponent;