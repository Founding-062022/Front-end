import http from "../../shared/services/http-common";
import authHeader from "../../security/services/auth.header";

class CurrencyService {
  constructor() {
    this.endPoint = "/currencies";
  }
  getAll() {
    return http.get(this.endPoint, authHeader());
  }
  getByName(name) {
    return http.get(`${this.endPoint}?name=${name}`, authHeader());
  }
}

export default new CurrencyService();
