import Vue from 'vue'
 import App from './App.vue'

// Vue.config.productionTip = false
// const div = document.createElement("div")
//     div.innerText = "chk"
//     const p = document.createElement("p")
//     p.innerText = 22
//     div.appendChild(p)

new Vue({
   render: h => h(App),
  // render: h => {
  //   return h("div",{id:"lxc"},["chk",h("p",22)])
  // }
  // render: (h) => {
  //   window.console.log(div, h(div), h("div",{id:"lxc"},["chk",h("p",22)]))
  //   return h(div)
  // }
}).$mount('#app')
