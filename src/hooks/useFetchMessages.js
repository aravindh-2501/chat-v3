import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/apiInstance";
import { GET_MESSAGES } from "../api/endPoints";

const fetchMessages = async ({ queryKey }) => {
  const [, { userId, receiverId }] = queryKey;
  if (!userId || !receiverId) return [];

  try {
    const response = await apiClient.get(
      `${GET_MESSAGES}/${userId}?receiver=${receiverId}`
    );

    return response?.data?.messages || [];
  } catch (error) {
    console.error("Error fetching messages", error);
    return [];
  }
};

const useMessages = (currentUserId, selectedUserId) => {
  return useQuery({
    queryKey: [
      "messages",
      { userId: currentUserId, receiverId: selectedUserId },
    ],
    queryFn: fetchMessages,
    enabled: !!currentUserId && !!selectedUserId,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export default useMessages;
