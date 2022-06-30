const USER_KEY = "user";

export default function authHeader() {
  const user = JSON.parse(localStorage.getItem(USER_KEY));

  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  } else {
    return {};
  }
}
