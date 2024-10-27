import React from "react";
import "./Popup.css"; // Import the popup styles

const Popup: React.FC = () => {
  return (
    <div className="custom-popup">
      <h1>Custom Popup</h1>
      <p>This popup was dynamically injected!</p>
      <button
        onClick={() => {
          // Close the popup by removing the root element
          const popupRoot = document.getElementById("popup-root");
          if (popupRoot) {
            popupRoot.remove();
          }
        }}
      >
        Close
      </button>
    </div>
  );
};

export default Popup;
