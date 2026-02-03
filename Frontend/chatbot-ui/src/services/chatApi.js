import axios from "axios";

const API_BASE = "http://localhost:8080/api/chat";

export const sendMessage = async (message) => {
  const response = await axios.post(API_BASE, message, {
    headers: { "Content-Type": "text/plain" }
  });
  return response.data;
};

export const fetchChatHistory = async (page = 0, size = 20) => {
  const response = await axios.get(
    `${API_BASE}/history/paged?page=${page}&size=${size}&sort=asc`
  );
  return response.data.content;
};
