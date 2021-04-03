import storage from './storage'
import Api from './axios'

class AuthService {
  constructor() {

  }

  isUserAuthenticated() {
    if (typeof window !== 'undefined') {
      // We are in the browser
      var token = this.getAuthToken();
      if (token) {
        return true;
      }
    }
    return false;
  }

  cleanAuthData() {
    storage.deleteAuthData();
  }

  getAuthToken() {

    if (!localStorage) {
      console.log("LocalStorage has not been initialised...");
      return null;
    }
    if (storage.getExpireDate()) {
      if (Date.now() > parseInt(storage.getExpireDate())) {
        console.log("User session has been expired...");
        this.cleanAuthData(); // localStorage.removeItem("authData");
        return null;
      }
    } else {
      return null;
    }

    return storage.getToken();
  }

  getEmail() {
    if (!localStorage) {
      console.log("LocalStorage has not been initialised...");
      return '';
    }
    if (storage.getExpireDate()) {
      if (Date.now() > parseInt(storage.getExpireDate())) {
        console.log("User session has been expired...");
        this.cleanAuthData(); // localStorage.removeItem("authData");
        return '';
      }
    } else {
      return '';
    }

    return storage.getEmail();
  }

  setAuthData(token, email) {
    var expireDate = Date.now() + 2 * 3600 * 1000;
    storage.saveToken(token);
    storage.setExpireDate(expireDate);
    storage.setEmail(email);
  }

  signIn(params) {
    return Api().post('signin', params);
  }

  signUp(params) {
    return Api().post('signup', params);
  }

  addBankSession(token, params) {
    return Api().post('banks', params, {
      headers: {
        'x-access-token': token
      }
    })
  }

  getBankSessions(token) {
    return Api().get('banks', {
      headers: {
        'x-access-token': token
      }
    })
  }

  getPlans(token) {
    return Api().get('plans', {
      headers: {
        'x-access-token': token
      }
    })
  }

  clearPlans(token) {
    return Api().post('clearPlans', {}, {
      headers: {
        'x-access-token': token
      }
    })
  }

  updateBankOrder(token, params) {
    return Api().post('banksOrder', params, {
      headers: {
        'x-access-token': token
      }
    })
  }

  updatePlanOrder(token, params) {
    return Api().post('planOrder', params, {
      headers: {
        'x-access-token': token
      }
    })
  }

  deleteBankSession(token, id) {
    return Api().delete(`banks/${id}`, {
      headers: {
        'x-access-token': token
      }
    })
  }

  assignPlan(token, id, isAssigned, orderNumber) {
    return Api().put(`banksAssign/${id}`, {
      isAssigned: isAssigned,
      order: orderNumber
    }, {
      headers: {
        'x-access-token': token
      }
    })
  }

  completePlan(token, id, isCompleted) {
    return Api().put(`planComplete/${id}`, { isCompleted: isCompleted }, {
      headers: {
        'x-access-token': token
      }
    })
  }

}

const authService = new AuthService();

export default authService;
