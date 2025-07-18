import axios from "axios";

const token = localStorage.getItem("token");

export const Fetch = axios.create({
  baseURL: "https://srv.mukammal-crm.uz/api/",
  // baseURL: "http://localhost:4000/api/",
  headers: {
    Authorization: token,
  },
});
