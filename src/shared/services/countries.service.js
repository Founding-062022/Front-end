import axios from "axios";

const PATH_API = "https://restcountries.com/v3.1/all";

class CountriesService {
  getAll() {
    return axios.get(PATH_API);
  }
}

export default new CountriesService();
