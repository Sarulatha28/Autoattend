import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/auth" });

export const signup = (data) => API.post("/signup", data);
export const signin = (data) => API.post("/signin", data);
