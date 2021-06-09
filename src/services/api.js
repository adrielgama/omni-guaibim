import axios from "axios";

const publicKey = process.env.REACT_APP_KEY;
const privateKey = process.env.REACT_APP_SECRET;

const api = axios.create({
  baseURL: "https://api.omni.chat/v1/",
  headers: {
    "x-api-key": publicKey,
    "x-api-secret": privateKey,
    "Content-Type": "application/json",
  },
});

export default api;
