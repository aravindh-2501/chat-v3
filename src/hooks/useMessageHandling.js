import { useState } from "react";
import { useSocketStore } from "../store/useSocketStore";
import { SEND_MSG } from "../api/endPoints";
import apiClient from "../api/apiInstance";

export const useMessageHandling = (SelectedUser, currentUser) => {
  const { socket, stopTyping } = useSocketStore();
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return;

    const newMessage = {
      senderId: currentUser._id,
      receiverId: SelectedUser.id,
      text: message,
      type: "text",
    };

    try {
      const res = await apiClient.post(SEND_MSG, newMessage);
      const msg = res.data.message;

      socket.emit("send_message", msg);
      stopTyping({
        senderId: currentUser._id,
        receiverId: SelectedUser.id,
      });

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return { message, setMessage, handleSend };
};
