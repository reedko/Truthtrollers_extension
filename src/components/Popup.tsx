import React, { useState } from "react";
import "./Popup.css";
import ttlogometer2 from "../../public/images/meter3.png";
import resizeImage from "../services/image-url";
import { Image } from "@chakra-ui/react";

const Popup: React.FC = () => {
  return (
    <div className="popup-box">
      <div className="popup-box-text">TruthTroll at 80% FALSE</div>
      <div className="image-container">
        {resizeImage(120, "images/meter3.png")}
      </div>

      <div className="popup-buttons">
        <a href="https://www.netflix.com/browse" className="popup-button">
          <div className="popup-button-text">Details</div>
        </a>

        <div
          className="popup-button"
          onClick={() => {
            // Close the popup by removing the root element
            const popupRoot = document.getElementById("popup-root");
            if (popupRoot) {
              popupRoot.remove();
            }
          }}
        >
          <div className="popup-button-text">Close</div>
        </div>
      </div>
    </div>
  );
};
export default Popup;
