import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Sider from '@/components/Sider.vue'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(Antd);
Vue.use(VueQuillEditor)

//引入ztree和jquery
import $ from 'jquery';
import 'ztree'
import 'ztree/css/zTreeStyle/zTreeStyle.css'

Vue.config.productionTip = false;
//组件
Vue.use(Header);
Vue.use(Footer);
Vue.use(Sider);
//重组件名
Vue.component('Header', Header);
Vue.component('Footer', Footer);
Vue.component('Sider', Sider);
new Vue({
  router,
  store,
  render: h => h(App),
  components: {Header, Footer, Sider},
}).$mount('#app');
