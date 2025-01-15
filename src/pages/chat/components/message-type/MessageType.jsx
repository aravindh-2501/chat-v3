const MessageType = ({ handleMenuOpen, message }) => {
  // console.log({ message });
  return (
    <div
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
        <>
          {message.type === "text" ? (
            <span>{message.text}</span>
          ) : message.content && message.content.length > 0 ? (
            message.content.map((contentItem, index) => {
              if (contentItem.type === "image") {
                return (
                  <img
                    key={contentItem._id}
                    src={contentItem.url}
                    alt={`Message Image ${index}`}
                    className="rounded-lg max-w-full h-auto my-2"
                  />
                );
              } else if (contentItem.type === "video") {
                return (
                  <video
                    key={contentItem._id}
                    controls
                    className="rounded-lg max-w-full h-auto my-2"
                    src={contentItem.url}
                  />
                );
              }
              return null;
            })
          ) : (
            <span>No media content available</span>
          )}
        </>
      )}
    </div>
  );
};

export { MessageType };
