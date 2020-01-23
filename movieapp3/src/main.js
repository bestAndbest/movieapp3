import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueRouter from 'vue-router'
import animated from 'animate.css'
import moment from 'moment'
import axios from 'axios'
import tabbar from './views/Tabbar'
//全局引入 swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
//引入iconfont图标样式
import './assets/iconfont/iconfont.css'
//按需引入MintUI
import { Tabbar,TabItem,Header,Button,Cell, Navbar,
  Indicator,Toast } from 'mint-ui'

Vue.prototype.$Indicator= Indicator
Vue.prototype.$Toast= Toast

import 'mint-ui/lib/style.css'
import Scroll from './components/BScroll.vue'
import Loading from './components/Loading'
Vue.component('Scroll',Scroll)
Vue.component('tabbar',tabbar)
Vue.component('Loading',Loading)
Vue.config.productionTip = false
Vue.component(Tabbar.name, Tabbar);
Vue.component(TabItem.name, TabItem);
Vue.component(Header.name, Header);
Vue.component(Button.name, Button);
Vue.component(Cell.name, Cell);
Vue.component(Navbar.name, Navbar);
Vue.use(VueRouter)
Vue.use(animated)
Vue.use(VueAwesomeSwiper)
Vue.prototype.$moment=moment
Vue.prototype.$axios=axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
