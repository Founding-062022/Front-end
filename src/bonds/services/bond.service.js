import http from "../../shared/services/http-common";
import authHeader from "../../security/services/auth.header";

class BondService {
  constructor() {
    this.endPoint = "bonds";
  }
  getAll() {
    return http.get(this.endPoint, { headers: authHeader() });
  }
  getById(id) {
    return http.get(`${this.endPoint}/${id}`, { headers: authHeader() });
  }
  getByUserId(id) {
    return http.get(`${this.endPoint}?userId=${id}`, { headers: authHeader() });
  }
  post(resourceDto) {
    return http.post(this.endPoint, resourceDto, { headers: authHeader() });
  }
  put(id, resourceDto) {
    return http.put(`${this.endPoint}/${id}`, resourceDto, {
      headers: authHeader(),
    });
  }
  delete(id) {
    return http.delete(`${this.endPoint}/${id}`, { headers: authHeader() });
  }
}

export default new BondService();
