import apiClient from "../api/apiInstance";
import { UPDATE_MSG_DEVLIVERED } from "../api/endPoints";

export const markMessageAsDelivered = async (data) => {
  // console.log({ data });
  try {
    await apiClient.post(UPDATE_MSG_DEVLIVERED, {
      messageId: data.messageId,
      status: data.status,
    });
    // console.log({ res });
  } catch (error) {
    console.error("Error updating status:", error);
  }
};
