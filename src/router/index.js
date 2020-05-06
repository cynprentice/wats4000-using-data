import Vue from 'vue'
import VueRouter from 'vue-router'
import Rhymesaurus from '@/views/Rhymesaurus'
import SameNotSamePoem from '@/views/SameNotSamePoem'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Rhymesaurus',
    component: Rhymesaurus
  },
  {
    path: '/SameNotSamePoem',
    name: 'SameNotSamePoem',
    component: SameNotSamePoem
  }
]

const router = new VueRouter({
  routes
})

export default router
