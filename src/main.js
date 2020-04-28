import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import {AWS_ACCESS_KEY_ID, AWS_SECRET_KEY} from './config';
import AWS from "aws-sdk";

Vue.config.productionTip = false;
AWS.config.update({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_KEY,
  },
  region: 'ap-northeast-1',
});


new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
