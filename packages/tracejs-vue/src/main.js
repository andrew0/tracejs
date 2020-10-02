import Vue from 'vue'
import App from './App.vue'
import './chartjs-chart-matrix'
import './chartjs-box'
import Chart from 'chart.js'
console.log(Chart)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
