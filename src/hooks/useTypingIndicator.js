import { useSocketStore } from "../store/useSocketStore";

export const useTypingIndicator = (SelectedUser, currentUser) => {
  const { startTyping, stopTyping } = useSocketStore();

  const handleTyping = (inputValue) => {
    if (inputValue.trim() === "") {
      stopTyping({ senderId: currentUser?._id, receiverId: SelectedUser?.id });
    } else {
      startTyping({
        senderId: currentUser?._id,
        receiverId: SelectedUser?.id,
      });
    }
  };

  return { handleTyping };
};
