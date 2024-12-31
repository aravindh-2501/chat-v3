// import { useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/apiInstance";
import { DELETE_MESSAGE } from "../api/endPoints";
import { useSocketStore } from "../store/useSocketStore";

// export const useMessageActions = (currentUser, SelectedUser) => {
export const useMessageActions = () => {
  // console.log({ currentUser, SelectedUser });
  const { deleteMessage } = useSocketStore();
  // const queryClient = useQueryClient();

  const handleReply = () => {
    // const handleReply = (message) => {
    // console.log(message.messageId);
    // Add reply logic here
  };

  const handleDelete = async (message) => {
    await apiClient
      .put(`${DELETE_MESSAGE}${message.messageId}/delete-message`)
      .then((res) => {
        const data = res.data.message;
        deleteMessage(data);
      });
  };

  return {
    handleReply,
    handleDelete,
  };
};
