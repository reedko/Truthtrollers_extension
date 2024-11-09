import "./Popup.css";
import resizeImage from "../services/image-url";
import { Image, ChakraProvider } from "@chakra-ui/react";
import { Task } from "../entities/Task";
import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import ReactDOM from "react-dom/client";

const Popup: React.FC = () => {
  const [isInDatabase, setIsInDatabase] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const [pageUrl, setPageUrl] = useState<string | null>(null);
  const [isContentDetected, setIsContentDetected] = useState<boolean>(false);

  useEffect(() => {
    // Directly read from the global `window` object
    const currentTask = (window as any).currentTabTask || null;
    const detected = (window as any).isContentDetected || false;
    const currentUrl = (window as any).currentTabUrl || false;
    if (currentTask) {
      setTask(currentTask);
      setPageUrl(currentUrl);
      setIsContentDetected(detected);

      console.log("Task loaded from global context:", currentTask, pageUrl);
    } else {
      setPageUrl(currentUrl);
      console.log("NO Task loaded from global context:", currentTask, pageUrl);
    }
  }, []);

  return (
    <ChakraProvider>
      <div>
        <TaskCard task={task} pageUrl={pageUrl} />
      </div>
    </ChakraProvider>
  );
};

const popupRoot = document.getElementById("popup-root");
if (popupRoot) {
  popupRoot.style.position = "fixed";
  popupRoot.style.top = "0";
  popupRoot.style.right = "0";
  popupRoot.style.zIndex = "9999";
  console.log("Found popup-root, rendering Popup component...");
  const root = ReactDOM.createRoot(popupRoot);

  root.render(<Popup />);
} else {
  console.error("popup-root not found, cannot render Popup");
}

export default Popup;
