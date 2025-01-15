import { io } from "socket.io-client";
import { create } from "zustand";
import { useUserStore } from "./userStore";
import { markMessageAsDelivered } from "../services/messageService";
import { playAudioNotification } from "../utils/audioNotification";

// URL for the socket connection
const socketUrl = import.meta.env.VITE_APP_SOCKET_URL;

export const useSocketStore = create((set, get) => ({
  socket: null,
  messages: [],
  users: [],
  isTyping: false,

  // Establish socket connection
  connectSocket: () => {
    const { currentUser, token } = useUserStore.getState();

    // Prevent duplicate socket connections
    if (get().socket) return;

    const socketInstance = io(socketUrl);
    set({ socket: socketInstance });

    // On successful socket connection
    socketInstance.on("connect", () => {
      console.log("Socket connected", socketInstance.id);
      if (currentUser && token) {
        socketInstance.emit("register_user", {
          userId: currentUser._id,
          token,
        });
      }
    });

    // Handle online users list
    socketInstance.on("online_users", (data) => {
      set((state) => ({
        users: [...state.users, ...data],
      }));
    });

    // Handle socket disconnection
    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // Handle receiver typing status
    socketInstance.on("receiver_typing", (data) => {
      const { currentUser } = useUserStore.getState();
      if (data?.senderId !== currentUser?._id) {
        set({ isTyping: data?.isTyping });
      }
    });

    // Handle receiver not typing status
    socketInstance.on("receiver_not_typing", (data) => {
      const { currentUser } = useUserStore.getState();
      if (data?.senderId !== currentUser?._id) {
        set({ isTyping: data?.isTyping });
      }
    });

    // Handle receiving new messages
    socketInstance.on("receive_message", (message) => {
      console.log("messagee", message);
      const { currentUser } = useUserStore.getState();

      // Play notification if the sender is not the current user
      if (message?.senderId !== currentUser?._id && currentUser) {
        playAudioNotification();
      }

      // Mark message as delivered and update state
      markMessageAsDelivered(message);
      set((state) => ({ messages: [...state.messages, message] }));
    });

    socketInstance.on("message_deleted", ({ messageId, isDeleted }) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.messageId === messageId ? { ...msg, isDeleted } : msg
        ),
      }));
    });
  },

  // Add a new message
  addMessage: (msg) => {
    set((state) => ({ messages: [...state.messages, msg] }));
  },

  // Start typing status
  startTyping: ({ senderId, receiverId }) => {
    const socket = get().socket;
    if (socket) {
      socket.emit("start_typing", { senderId, receiverId, isTyping: true });
    }
  },

  // Stop typing status
  stopTyping: ({ senderId, receiverId }) => {
    const socket = get().socket;
    if (socket) {
      socket.emit("stop_typing", { senderId, receiverId, isTyping: false });
    }
  },

  // Delete msg
  deleteMessage: (data) => {
    const socket = get().socket;
    if (socket) {
      socket.emit("delete_message", data);
    }
  },

  // Disconnect socket and clear state
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isTyping: false, messages: [], users: [] });
    }
  },
}));
