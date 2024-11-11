import React from "react";
import {
  Box,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  Center,
  GridItem,
  Progress,
  Grid,
} from "@chakra-ui/react";
import { Task } from "../entities/Task"; // Import the Task interface if needed
import "./Popup.css";
import resizeImage from "../services/image-url";
import { useTask } from "../hooks/useTask";

const getProgressColor = (progress: string | null) => {
  switch (progress) {
    case "Completed":
      return "green";
    case "Partially Complete":
      return "yellow";
    case "Awaiting Evaluation":
      return "blue";
    default:
      return "red"; // For Assigned/Started states
  }
};

interface TaskCardProps {
  task: Task | null;
  pageUrl: string | null;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, pageUrl }) => {
  const { handleScrape } = useTask();

  const imageUrl =
    task && task.thumbnail ? chrome.runtime.getURL(task.thumbnail) : "";
  const meter = chrome.runtime.getURL("/assets/images/meter3.png");
  const logo = chrome.runtime.getURL("/assets/images/miniLogo.png");

  return (
    <Box className="popup-box" width="300px">
      <VStack spacing={3} align="start">
        <Box bg="cyan.100" className="logo-box" position="relative" left="2.5%">
          <HStack spacing="130">
            <Box>{resizeImage(40, logo)}</Box>
            <Text color="black">TruthTrollers</Text>
          </HStack>
        </Box>
        {imageUrl && task?.progress === "Completed" ? (
          <Box position="relative" left="25%">
            {resizeImage(120, meter)}
          </Box>
        ) : (
          imageUrl && (
            <Box position="relative" left="25%">
              {resizeImage(120, imageUrl)}
            </Box>
          )
        )}
        {imageUrl ? (
          <Box width="280px">
            <Text fontWeight="bold" fontSize="l" wrap="yes">
              {task?.task_name}
            </Text>
            <Grid templateRows="repeat(2, 1fr)">
              <GridItem>
                <Text color="gray.600" fontSize="sm">
                  Progress: {task?.progress}
                </Text>
              </GridItem>
              <GridItem>
                <Progress
                  value={
                    task?.progress === "Completed"
                      ? 100
                      : task?.progress === "Partially Complete"
                      ? 50
                      : 25
                  }
                  colorScheme={task ? getProgressColor(task.progress) : ""}
                  mt={2}
                />
              </GridItem>
            </Grid>
            <Text color="gray.600" fontSize="sm">
              Media Source: {task?.media_source}
            </Text>

            <Center>
              <HStack spacing={5}>
                <Button variant="surface" bg="cyan.100" color="black">
                  <a
                    href={task?.details || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div>Details</div>
                  </a>
                </Button>
                <Button
                  variant="solid"
                  bg="cyan.100"
                  color="black"
                  onClick={() => {
                    // Find the popupRoot element
                    const popupRoot = document.getElementById("popup-root");
                    if (popupRoot) {
                      popupRoot.classList.add("task-card-hidden");
                      popupRoot.classList.remove("task-card-visible");
                    }
                  }}
                >
                  <div>Close</div>
                </Button>
              </HStack>
            </Center>
          </Box>
        ) : (
          <Box width="280px">
            <Text fontWeight="bold" fontSize="l" wrap="yes">
              {task?.task_name}
            </Text>
            <Grid templateRows="repeat(2, 1fr)">
              <GridItem>
                <Text color="gray.600" fontSize="sm">
                  This document has not been added to Truthtrollers.
                </Text>
              </GridItem>
              <GridItem>
                <Text>Would you like to Add?</Text>
              </GridItem>
            </Grid>

            <Center>
              <HStack spacing={5}>
                <Button
                  variant="surface"
                  bg="cyan.100"
                  color="black"
                  onClick={() => handleScrape(pageUrl)}
                >
                  <div>Add</div>
                </Button>
                <Button
                  variant="solid"
                  bg="cyan.100"
                  color="black"
                  onClick={() => {
                    // Find the popupRoot element
                    const popupRoot = document.getElementById("popup-root");
                    if (popupRoot) {
                      popupRoot.classList.add("task-card-hidden");
                      popupRoot.classList.remove("task-card-visible");
                    }
                  }}
                >
                  <div>Close</div>
                </Button>
              </HStack>
            </Center>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default TaskCard;
