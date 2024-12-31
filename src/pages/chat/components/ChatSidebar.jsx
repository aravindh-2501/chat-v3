import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/apiInstance";
import { GET_USER_MSG, GET_USERS } from "../../../api/endPoints";
import { useUserStore } from "../../../store/userStore";
import { useNavigate } from "react-router-dom";
import { useSocketStore } from "../../../store/useSocketStore";

const ChatSidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useUserStore.getState().currentUser;
  const onlineUsers = useSocketStore.getState().users;
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch user search results based on the search term
  const {
    data: searchResults = [],
    error: searchError,
    isLoading: isSearching,
  } = useQuery({
    queryKey: ["getuser", searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      const response = await apiClient.get(
        `${GET_USERS}?userId=${user?._id}&search=${searchTerm}`
      );
      // console.log("getuSer", response?.data?.data);
      return response?.data?.data || [];
    },
    enabled: !!searchTerm.trim(),
    onError: (err) => {
      console.error("Error fetching search results:", err);
    },
  });

  // Fetch user list for messages (recent chats)
  const { data: recentChats = [] } = useQuery({
    queryKey: ["getusers"],
    queryFn: async () => {
      const response = await apiClient.get(
        `${GET_USER_MSG}?userId=${user?._id}`
      );
      // console.log("getChat", response?.data?.data);
      return response?.data?.data || [];
    },
    onError: (err) => {
      console.error("Error fetching recent chats:", err);
    },
  });

  // Handle input change in search box
  const handleSearchInput = (inputValue) => {
    setSearchTerm(inputValue);
    setIsDropdownOpen(inputValue.trim() !== "");
  };

  // Handle user selection from search results
  const handleUserSelection = (selectedUser) => {
    // console.log({ selectedUser });
    const { _id, email, username, avatar } = selectedUser;
    navigate(
      `/chat/${_id}?email=${email}&username=${username}&avatar=${avatar}`
    );
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  // Handle click outside dropdown to close it
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  // Add/remove click event listener for outside clicks
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full relative text-white">
      {/* User Profile Section */}
      <div className="flex items-center justify-between border-b border-gray-600 pb-2">
        <div
          className="flex items-center"
          onClick={() => {
            navigate("/profile");
          }}
        >
          <div className="avatar w-12 h-12">
            <img
              className="rounded-full"
              src={
                user?.avatar ||
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              }
              alt="User Avatar"
            />
          </div>
          <div className="ml-3 flex flex-col">
            <p className="text-primary text-sm">
              {user?.username || "Anonymous"}
            </p>
            <p className="text-secondary text-xs">
              {user?.email || "No Email Available"}
            </p>
          </div>
        </div>
      </div>

      {/* Search Contact Section */}
      <div className="flex flex-col relative">
        <p className="mb-2 text-sm font-semibold text-gray-400">
          Search Contact
        </p>
        <input
          type="text"
          className="w-full p-2 border rounded-lg border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => handleSearchInput(e.target.value)}
        />
        {/* Dropdown list */}
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 mt-2 top-[60px] bg-gray-800 border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10"
          >
            {isSearching ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : searchResults?.length > 0 ? (
              searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center p-3 cursor-pointer hover:bg-gray-700"
                  onClick={() => handleUserSelection(user)}
                >
                  <div className="ml-3 flex flex-col">
                    <p className="text-gray-300 text-sm">{user.username}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No users found.
              </div>
            )}
          </div>
        )}
        {searchError && (
          <p className="text-red-500 mt-2">Error fetching search results.</p>
        )}
      </div>

      {/* Recent Chats Section */}
      <div className="mt-4">
        <p className="text-sm font-semibold text-gray-400">Recent Chats</p>
        {recentChats.length === 0 ? (
          <p className="text-gray-500">No recent chats available.</p>
        ) : (
          recentChats.map((chatUser, index) => (
            <div
              key={index}
              className="flex items-center mt-4 p-[10px_8px] bg-[#374151] rounded-[10px] mb-2 cursor-pointer"
              onClick={() =>
                navigate(
                  `/chat/${chatUser._id}?email=${chatUser.email}&username=${chatUser.username}&avatar=${chatUser.avatar}`
                )
              }
            >
              <div className="relative">
                {/* Online/Offline Indicator */}
                <span
                  className={`absolute rounded-full w-3 h-3 -right-1 bottom-0 ${
                    onlineUsers.includes(chatUser._id)
                      ? "bg-green-500 animate-ping"
                      : "bg-red-500"
                  }`}
                ></span>
                {/* Static dot overlay */}
                {onlineUsers.includes(chatUser._id) && (
                  <span className="absolute rounded-full bg-green-500 w-3 h-3 -right-1 bottom-0"></span>
                )}

                {/* User Avatar */}
                <div className="avatar w-10 h-10">
                  <div
                    className={`rounded-full p-[2px] ${
                      onlineUsers.includes(chatUser._id)
                        ? "ring ring-success ring-offset-2"
                        : ""
                    }`}
                  >
                    <img
                      className="rounded-full"
                      src={
                        chatUser?.avatar ||
                        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      }
                      alt="User Avatar"
                    />
                  </div>
                </div>
              </div>
              <div className="ml-3 flex flex-col">
                <p className="text-primary text-sm">
                  {chatUser?.username || "Unknown User"}
                </p>
                <p className="text-secondary text-xs">
                  {chatUser?.email || "No Email Available"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
