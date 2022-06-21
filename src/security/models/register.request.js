export default class RegisterRequest {
  constructor(name, lastname, email, country, username, password) {
    this.name = name;
    this.lastname = lastname;
    this.email = email;
    this.country = country;
    this.username = username;
    this.password = password;
  }
}
