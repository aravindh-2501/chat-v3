import {
  FaceSmileIcon,
  PaperAirplaneIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import EmojiPicker from "emoji-picker-react";
import { useMessageHandling } from "../../../hooks/useMessageHandling";
import { useEmojiPicker } from "../../../hooks/useEmojiPicker";
import { useTypingIndicator } from "../../../hooks/useTypingIndicator";

const MessageInput = ({ SelectedUser, currentUser }) => {
  const { message, setMessage, handleSend } = useMessageHandling(
    SelectedUser,
    currentUser
  );
  const { showEmojiPicker, setShowEmojiPicker, emojiPickerRef, onEmojiClick } =
    useEmojiPicker(setMessage);
  const { handleTyping } = useTypingIndicator(SelectedUser, currentUser);

  const handleDown = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
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
      <button
        className="p-2 text-gray-100"
        // onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      >
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
    </div>
  );
};

export default MessageInput;
