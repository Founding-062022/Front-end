import axios from "axios";

export default axios.create({
  baseURL: "https://founding-api.herokuapp.com",
  headers: { "Content-type": "application/json" },
});
