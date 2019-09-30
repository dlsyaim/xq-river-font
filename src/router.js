import Vue from 'vue'
import Router from 'vue-router'
import Ahome from '@/views/Index'
import News from '@/views/news'
import Waterlist from '@/views/waterlist'
import Editnews from '@/views/editnews'
Vue.use(Router);

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'A',
      component: Ahome
    },
    {
      path: '/news',
      name: 'News',
      component: News
    },
    {
      path: '/waterlist',
      name: 'Waterlist',
      component: Waterlist
    },
    {
      path: '/editnews',
      name: 'Editnews',
      component: Editnews
    },
  ]
})
