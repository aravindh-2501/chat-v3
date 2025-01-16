import { useState, useEffect } from "react";
import moment from "moment";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import getStatusIcon from "../../../function/getStatusIcon";
import ChatMessageMenu from "./ChatMessageMenu";
import { MessageType } from "./message-type/MessageType";

const MessageBubble = ({ message, currentUser, SelectedUser }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [open, setOpen] = useState(false);

  // Handle menu open
  const handleMenuOpen = (e) => {
    e.preventDefault();
    const menuPosition = {
      top: `${e.clientY + 10}px`,
      left: `${e.clientX - 200}px`,
    };
    setActiveMenu(menuPosition);
    setOpen(true);
  };

  // Close menu
  const handleCloseMenu = () => {
    setOpen(false);
  };

  // Detect outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".chat-menu")) {
        handleCloseMenu();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  const isSender = message.senderId === currentUser?._id;

  // console.log({ SelectedUser });

  return (
    <div>
      {!isSender ? (
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
              <div className="flex gap-2 items-start text-white">
                {/* <p
                  className={`text-sm p-3 shadow-md rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[0px] ${
                    message.isDeleted
                      ? "bg-gray-300 text-gray-800 italic font-medium"
                      : "bg-neutral text-white"
                  }`}
                  onContextMenu={(e) => handleMenuOpen(e)}
                >
                  {message.isDeleted ? (
                    <span className="flex whitespace-nowrap">
                      This message has been deleted
                    </span>
                  ) : (
                    message.text
                  )}
                </p> */}
                <MessageType
                  message={message}
                  handleMenuOpen={handleMenuOpen}
                />
              </div>
              <div className="flex items-center mt-2 space-x-2">
                <p className="text-xs text-gray-400">
                  {moment(message.createdAt).format("h:mm A")}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-end mb-4">
          <div className="flex items-center justify-end space-x-3">
            <div className="max-w-[80%]">
              <div className="flex gap-2 items-start text-white">
                <img src={message?.content[0]} alt="" className="w-11" />
                {message.isDeleted ? (
                  ""
                ) : (
                  <div
                    className="w-5 h-5 cursor-pointer hover:text-gray-200"
                    onClick={(e) => handleMenuOpen(e)}
                    onContextMenu={(e) => handleMenuOpen(e)}
                  >
                    <EllipsisVerticalIcon className="h-5 w-5 text-white" />
                  </div>
                )}
                {/* <p
                  className={`text-sm p-3 shadow-md rounded-tl-[20px] rounded-tr-[20px] rounded-br-[0px] rounded-bl-[20px] ${
                    message.isDeleted
                      ? "bg-gray-300 text-gray-800 italic font-medium"
                      : "bg-neutral text-white"
                  }`}
                  onContextMenu={(e) => handleMenuOpen(e)}
                >
                  {message.isDeleted ? (
                    <span className="flex whitespace-nowrap">
                      This message has been deleted
                    </span>
                  ) : (
                    message.text
                  )}
                </p> */}
                <MessageType
                  message={message}
                  handleMenuOpen={handleMenuOpen}
                />
              </div>
              <div className="flex items-center mt-2 space-x-2">
                {getStatusIcon(message.status)}
                <p className="text-xs text-gray-400">
                  {moment(message.createdAt).format("h:mm A")}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <img
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover shadow-lg"
                src={
                  currentUser?.avatar
                    ? currentUser?.avatar
                    : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
              />
            </div>
          </div>
        </div>
      )}

      {open && (
        <ChatMessageMenu
          activeMenu={activeMenu}
          handleClose={handleCloseMenu}
          message={message}
          currentUser={currentUser}
          SelectedUser={SelectedUser}
        />
      )}
    </div>
  );
};

export default MessageBubble;
