import Vue from 'vue'
import Vuex from 'vuex'

import authService from '../service/authService'
import axios from '../service/axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {
    logIn({commit}, data) {
      /* when development you can call api with axios here */
      return new Promise((resolve, reject) => {
        axios.post({
          url: '/api/v1/admin/login',
          data: data
        }).then(function (response) {
            if (response.status == 200) {
              resolve(response.data);
            }
            reject(response);
          })
          .catch(function (error, response) {
            reject(error);
          })
      });
    }
  },
  modules: [

  ]
})
