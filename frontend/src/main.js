import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './registerServiceWorker'

import BootstrapVue from 'bootstrap-vue'
import VeeValidate from 'vee-validate'
import Vuetify from "vuetify"
import Notifications from 'vue-notification'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEnvelopeOpen, faUnlockAlt, faSignInAlt, faUserPlus, faRocket, faStream, faCheckCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './assets/novos.scss'

library.add(faEnvelopeOpen, faUnlockAlt, faSignInAlt, faUserPlus, faRocket, faStream, faCheckCircle, faTrash, faPlus);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;


Vue.use(BootstrapVue);
Vue.use(Vuetify);
Vue.use(VeeValidate, { inject: 'false' });
Vue.use(Notifications);

new Vue({
  router,
  store,
  vuetify: new Vuetify(),
  render: h => h(App)
}).$mount('#app')
