import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // apne backend ka URL dalna
});

export default API;
