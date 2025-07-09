import axios from "axios";

const token = localStorage.getItem("token");

export const Fetch = axios.create({
  // baseURL: "https://auranova.uz/api/",
  baseURL: "https://crm-biohazard.onrender.com/api/",
  headers: {
    Authorization: token,
  },
});
