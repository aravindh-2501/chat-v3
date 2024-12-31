import { useEffect, useRef } from "react";
import { useUserStore } from "../../../store/userStore";
import { useSocketStore } from "../../../store/useSocketStore";
import useMessages from "../../../hooks/useFetchMessages";
import MessageBubble from "./MessageBubble";

const MessageContainer = ({ SelectedUser }) => {
  const currentUser = useUserStore((state) => state.currentUser);
  const messages = useSocketStore((state) => state.messages);
  const { addMessage, isTyping } = useSocketStore();
  const FlatMessage = messages.flat();
  const { data } = useMessages(currentUser?._id, SelectedUser?.id);
  // console.log({ isTyping });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (data) addMessage(data);
  }, [data, addMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [FlatMessage, isTyping]);

  return (
    <div className="flex flex-col w-full" style={{ height: "64vh" }}>
      <div className="flex-1 bg-gray-800 w-full h-full overflow-y-auto p-4">
        {FlatMessage.length === 0 ? (
          <div className="text-white text-center mt-4">No messages</div>
        ) : (
          FlatMessage.map((message, idx) => (
            <MessageBubble
              key={idx}
              message={message}
              currentUser={currentUser}
              SelectedUser={SelectedUser}
            />
          ))
        )}

        {isTyping && (
          <div className="flex flex-col items-start mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <img
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover shadow-lg"
                  src={
                    SelectedUser?.avatar
                      ? SelectedUser?.avatar
                      : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                />
              </div>
              <div className="max-w-[80%]">
                <div className="flex gap-2 items-star">
                  <div className="text-sm bg-primary p-3 shadow-md rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[0px]">
                    <div className="loader w-4 h-4 rounded-full bg-primary animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageContainer;
