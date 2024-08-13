/* eslint-disable @typescript-eslint/ban-ts-comment */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/global.sass'; // Импортируйте глобальный SCSS файл

// @ts-ignore
import DatePicker from 'vue2-datepicker';
  import 'vue2-datepicker/index.css';

Vue.config.productionTip = false

Vue.component('DatePicker', DatePicker); // Регистрация компонента глобально

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
