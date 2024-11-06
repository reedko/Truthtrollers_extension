import React from "react";
import { Box, Text, Image, VStack, HStack, Button } from "@chakra-ui/react";

import { Task } from "../entities/useTask"; // Import the Task interface if needed
import "./Popup.css";
import { Center } from "@chakra-ui/react";
import resizeImage from "../services/image-url";
import { Badge } from "@chakra-ui/react";

interface TaskCardProps {
  task: Task | null;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const imageUrl =
    task && task.thumbnail ? chrome.runtime.getURL(task.thumbnail) : "";
  const meter = chrome.runtime.getURL("/assets/images/meter3.png");
  const logo = chrome.runtime.getURL("/assets/images/logo.png");
  return (
    <Box className="popup-box" width="300px">
      <VStack spacing={3} align="start">
        <Box bg="cyan.100" className="logo-box" position="relative" left="3%">
          <HStack spacing="130">
            <Box>{resizeImage(40, logo)}</Box>
            <Text color="black">TruthTroller</Text>
          </HStack>
        </Box>

        {imageUrl && task?.progress === "Completed" ? (
          <Box position="relative" left="25%">
            {resizeImage(120, meter)}
          </Box>
        ) : (
          imageUrl && (
            <Image
              src={imageUrl}
              alt={`Thumbnail for ${task?.task_name}`}
              borderRadius="md"
              objectFit="cover"
            />
          )
        )}

        <Box>
          <Text fontWeight="bold" fontSize="l" wrap="yes">
            {task?.task_name}
          </Text>
          <Text color="gray.500" fontSize="sm">
            Progress: {task?.progress}
          </Text>
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
                  // Close the popup by removing the root element
                  const popupRoot = document.getElementById("popup-root");
                  if (popupRoot) {
                    popupRoot.remove();
                  }
                }}
              >
                <div>Close</div>
              </Button>
            </HStack>
          </Center>
        </Box>
      </VStack>
    </Box>
  );
};

export default TaskCard;
