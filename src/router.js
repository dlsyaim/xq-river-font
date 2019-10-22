import Vue from 'vue'
import Router from 'vue-router'
import Ahome from '@/views/Index'
import News from '@/views/news'
import Waterlist from '@/views/waterlist'
import Editnews from '@/views/editnews'
import microWaterEdit from '@/views/microWaterBody/microWaterEdit.vue'
import microWaterNew from '@/views/microWaterBody/microWaterNew.vue'
import microWaterNewList from '@/views/microWaterBody/microWaterNewList.vue'
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
    {
      path: '/microWaterBody/microWaterEdit',
      name: 'microWaterEdit',
      component: microWaterEdit
    },
    {
      path: '/microWaterBody/microWaterNew',
      name: 'microWaterNew',
      component: microWaterNew
    },
    {
      path: '/microWaterBody/microWaterNewList',
      name: 'microWaterNewList',
      component: microWaterNewList
    },
  ]
})
