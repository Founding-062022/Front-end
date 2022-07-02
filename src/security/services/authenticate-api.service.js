import axios from "axios";
import User from "../models/user.entity";
import router from "../../router";
import http from "../../shared/services/http-common";

const API_URL = "http://localhost:5050/api/v1";
const USER_KEY = "user";
console.log(API_URL);

class AuthenticateApiService {
  signIn(request) {
    return axios.post(`${API_URL}/login`, request).then((response) => {
      if (response.data.accessToken) {
        const user = response.data.user;
        const token = response.data.accessToken;
        const current = new User(
          user.id,
          user.name,
          user.lastname,
          user.email,
          user.country,
          user.username,
          token
        );
        localStorage.setItem(USER_KEY, JSON.stringify(current));
        return current;
      }
      return response.data;
    });
  }
  signUp(request) {
    return http.post(`${API_URL}/register`, request);
  }
  signOff() {
    router.push({ name: "home" }).then((r) => {
      console.log(r);
      localStorage.removeItem(USER_KEY);
    });
  }
}

export default new AuthenticateApiService();
