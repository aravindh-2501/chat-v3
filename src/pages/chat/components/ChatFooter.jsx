import {
  FaceSmileIcon,
  PaperAirplaneIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import apiClient from "../../../api/apiInstance";
import { SEND_MSG } from "../../../api/endPoints";
import { useUserStore } from "../../../store/userStore";
import EmojiPicker from "emoji-picker-react";
import { useSocketStore } from "../../../store/useSocketStore";

const ChatFooter = ({ SelectedUser }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const currentUser = useUserStore((state) => state.currentUser);
  const { socket, startTyping, stopTyping } = useSocketStore();
  const inputRef = useRef();

  useEffect(() => {
    if (socket && SelectedUser && currentUser) {
      socket.emit("join_room", {
        senderId: currentUser._id,
        receiverId: SelectedUser.id,
      });
    }
  }, [socket, SelectedUser, currentUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onEmojiClick = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.emoji);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const newMessage = {
      senderId: currentUser._id,
      receiverId: SelectedUser.id,
      text: message,
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

  const handleDown = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileClick = () => {
    inputRef.current.click();
    console.log(inputRef.current);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
  };

  return (
    <div className="bg-gray-800 p-3 rounded-b-lg flex items-center gap-2">
      <div className="relative">
        <button
          className="p-2 text-gray-100"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <FaceSmileIcon className="w-6 h-6" />
        </button>

        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-16 left-0 z-10">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>
      <button className="p-2 text-gray-100" onClick={handleFileClick}>
        <PhotoIcon className="w-6 h-6" />
      </button>
      <input
        type="text"
        placeholder="Type a message..."
        className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none"
        value={message}
        onKeyDown={handleDown}
        onChange={(e) => {
          setMessage(e.target.value);
          handleTyping(e.target.value);
        }}
      />

      <button
        className={`p-2 text-white bg-primary rounded-lg ${
          !message.trim() ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleSend}
        disabled={!message.trim()}
      >
        <PaperAirplaneIcon className="w-6 h-6" />
      </button>

      <input hidden type="file" ref={inputRef} onChange={handleFileChange} />
    </div>
  );
};

export default ChatFooter;
