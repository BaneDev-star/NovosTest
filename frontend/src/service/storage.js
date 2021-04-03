import * as configs from "../configs";

class Storage {
  constructor() {

  }

  get(key, defaultValue) {
    var value = localStorage.getItem(key, defaultValue);
    return value;
  }

  set(key, value) {
    localStorage.setItem(key, value);
  }

  remove(key) {
    localStorage.removeItem(key);
  }

  removeAll() {
    localStorage.clear()
  }

  saveToken(value) {
    this.set(configs.token, value);
  }

  getToken() {
    return this.get(configs.token);
  }

  setExpireDate(value) {
    this.set(configs.expireDate, value);
  }

  getExpireDate() {
    return this.get(configs.expireDate);
  }

  setEmail(value) {
    this.set('email', value);
  }

  getEmail() {
    return this.get("email");
  }

  deleteAuthData() {
    this.remove(configs.token);
    this.remove(configs.expireDate);
  }

  IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
}

const storage = new Storage();

export default storage;
