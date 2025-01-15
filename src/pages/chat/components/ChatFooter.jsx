import {
  FaceSmileIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import apiClient from "../../../api/apiInstance";
import { SEND_MSG } from "../../../api/endPoints";
import { useUserStore } from "../../../store/userStore";
import { useSocketStore } from "../../../store/useSocketStore";

const ChatFooter = ({ SelectedUser }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [media, setMedia] = useState([]);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef();

  const currentUser = useUserStore((state) => state.currentUser);
  const { socket, startTyping, stopTyping } = useSocketStore();

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
    if (!message.trim() && media.length === 0) return;

    const formData = new FormData();
    formData.append("senderId", currentUser._id);
    formData.append("receiverId", SelectedUser.id);
    formData.append("text", message.trim());
    formData.append(
      "type",
      media.length
        ? media[0].file.type.startsWith("image")
          ? "image"
          : "video"
        : "text"
    );

    media.forEach((item) => formData.append("files", item.file));

    try {
      const response = await apiClient.post(SEND_MSG, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const msg = response.data.message;

      console.log({ msg });

      // Emit socket event for real-time update
      socket.emit("send_message", msg);

      stopTyping({ senderId: currentUser._id, receiverId: SelectedUser.id });

      setMessage("");
      setMedia([]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleTyping = (inputValue) => {
    if (inputValue.trim() === "") {
      stopTyping({ senderId: currentUser?._id, receiverId: SelectedUser?.id });
    } else {
      startTyping({ senderId: currentUser?._id, receiverId: SelectedUser?.id });
    }
  };

  const handleFileClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMedia((prevMedia) => [
      ...prevMedia,
      ...files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  };

  const removeMedia = (index) => {
    setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
      setMedia([]);
    }
  };

  return (
    <div className="bg-gray-800 p-3 rounded-b-lg flex flex-col gap-2 relative">
      {/* Preview Uploaded Media */}
      {media.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-2 absolute bottom-14">
          {media.map((item, index) => (
            <div
              key={index}
              className="relative w-20 h-20 bg-gray-700 rounded-lg overflow-hidden"
            >
              <img
                src={item.preview}
                alt="preview"
                className="object-cover w-full h-full"
              />
              <button
                className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
                onClick={() => removeMedia(index)}
              >
                <XCircleIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        {/* Emoji Picker */}
        <div className="relative">
          <button
            className="p-2 text-gray-100"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <FaceSmileIcon className="w-6 h-6" />
          </button>
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-16 left-0 z-10"
            >
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>

        {/* Upload Media */}
        <button className="p-2 text-gray-100" onClick={handleFileClick}>
          <PhotoIcon className="w-6 h-6" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none"
          value={message}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping(e.target.value);
          }}
        />

        {/* Send Button */}
        <button
          className={`p-2 text-white bg-primary rounded-lg ${
            !message.trim() && media.length === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={handleSend}
          disabled={!message.trim() && media.length === 0}
        >
          <PaperAirplaneIcon className="w-6 h-6" />
        </button>

        {/* Hidden File Input */}
        <input
          hidden
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept="image/*,video/*"
          multiple
        />
      </div>
    </div>
  );
};

export default ChatFooter;
