import { ArrowUturnRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMessageActions } from "../../../hooks/useMessageActions";

const ChatMessageMenu = ({
  activeMenu,
  handleClose,
  message,
  currentUser,
  SelectedUser,
}) => {
  const { handleDelete, handleReply } = useMessageActions(
    currentUser,
    SelectedUser
  );
  // console.log("chamsg", message);

  return (
    <ul
      className="chat-menu absolute bg-base-200 p-2 rounded-md w-56 shadow-lg"
      style={{
        top: activeMenu?.top,
        left: activeMenu?.left,
      }}
    >
      <li
        className="flex items-center gap-3 p-2 hover:bg-base-300 rounded-lg cursor-pointer"
        onClick={() => {
          handleReply(message);
          handleClose();
        }}
      >
        <ArrowUturnRightIcon className="h-5 w-5 text-blue-500" />
        <p>Reply</p>
      </li>
      <li
        className="flex items-center gap-3 p-2 hover:bg-base-300 rounded-lg cursor-pointer"
        onClick={() => {
          handleDelete(message);
          handleClose();
        }}
      >
        <TrashIcon className="h-5 w-5 text-red-500" />
        <p>Delete</p>
      </li>
    </ul>
  );
};

export default ChatMessageMenu;
