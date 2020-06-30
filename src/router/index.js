import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
// 解决重复路由
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};
export default new Router({
  mode: 'hash', // history , hash
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/pages/login/login')
    },

    {
      path: '/main',
      name: 'main',
      meta: {
        requireAuth: true
      },
      component: () => import('@/pages/main/main'),
      children: [
        {
          path: '/commonphonebook',
          name: 'commonphonebook',
          meta: {
            requireAuth: true
          },
          component: () => import('@/pages/commonphonebook/commonphonebook')
        },
        {
          path: '/demo',
          name: 'demo',
          meta: {
            requireAuth: true
          },
          component: () => import('@/pages/demo/demo')
        },
        {
          path: '/detailspage',
          name: 'commonphonebook/detailspage',
          meta: {
            requireAuth: true
          },
          component: () => import('@/pages/commonphonebook/component/detailspage')
        },
        {
          path: '/formmanagement',
          name: 'formmanagement',
          meta: {
            requireAuth: true
          },
          component: () => import('@/pages/formmanagement/formmanagement')
        },
        {
          path: '/home',
          name: 'home',
          meta: {
            requireAuth: true
          },
          component: () => import('@/pages/home/home')
        },
        {
          path: '/logmanagement',
          name: 'logmanagement',
          meta: {
            requireAuth: true
          },
          component: () => import('@/pages/logmanagement/logmanagement')
        },
        {
          path: '/messagereminder',
          name: 'messagereminder',
          meta: {
            requireAuth: true
          },
          component: () => import('@/pages/messagereminder/messagereminder')
        },
        {
          path: '/querystatistics',
          name: 'querystatistics',
          meta: {
            requireAuth: true
          },
          component: () => import('@/pages/querystatistics/querystatistics')
        },
        {
          path: '/querydetails',
          name: 'querystatistics/querydetails',
          meta: {
            requireAuth: true
          },
          component: () => import('@/pages/querystatistics/component/details')
        },
        {
          path: '/taskgeneration',
          name: 'taskgeneration',
          meta: {
            requireAuth: true
          },
          component: () => import('@/pages/taskgeneration/taskgeneration')
        },
        {
          path: '/unitdictionary',
          name: 'unitdictionary',
          meta: {
            requireAuth: true
          },
          component: () => import('@/pages/unitdictionary/unitdictionary')
        },
        {
          path: '/unitmanagement',
          name: 'unitmanagement',
          meta: {
            requireAuth: true
          },
          component: () => import('@/pages/unitmanagement/unitmanagement')
        },
        {
          path: '/usermanagement',
          name: 'usermanagement',
          meta: {
            requireAuth: true
          },
          component: () => import('@/pages/usermanagement/usermanagement')
        },
        {
          path: '/formview',
          name: 'formmanagement/formview',
          meta: {
            requireAuth: true
          },
          component: () => import('@/pages/formmanagement/formview')
        },
        {
          path: '/taskview',
          name: 'taskgeneration/taskview',
          meta: {
            requireAuth: true
          },
          component: () => import('@/pages/taskgeneration/componet/taskview')
        },
        {
          path: '/serverManagement',
          name: 'serverManagement',
          meta: {
            requireAuth: true
          },
          component: () => import('@/pages/serverManagement/serverManagement')
        },
        {
          path: '/noauthority',
          name: '403',
          component: () => import('@/components/noauthority')
        },
        {
          path: '*',
          name: '404',
          component: () => import('@/components/nopage')
        }
      ]

    },
    {
      path: '*',
      component: () => import('@/components/nopage')
    }

  ]
})
