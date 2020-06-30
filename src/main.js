// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './common/common.css'
import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import api from '@/http/api.js'
import Sortable from 'sortablejs'
import plTable from 'pl-table'
import 'pl-table/themes/index.css'
import rightMenu from 'rightmenu'

/** Use  有问题 rightMenu 资源*/
Vue.prototype.$http = api
Vue.prototype.Sortable = Sortable
Vue.prototype.openLoading = function () {
  return this.$loading({ // 返回一个loading对象
    lock: true, // 是否锁屏
    text: '正在上传，请稍后...' // 加载动画的文字
  })
}
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(plTable)
Vue.use(rightMenu)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
//路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (sessionStorage.getItem('userID')) {
      next()
    } else {
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next()
  }
})

Vue.prototype.goBack = function () {
  router.go(-1)// 返回上一层
}

// setTimeout(() => {
//   console.log("----" + this.$route.path)
//   let routes = this.$route.path
//   if (routes.indexOf('querydetails') == -1) {
//     // localStorage.clear('keyword')
//     console.log("跳转其他页面")
//   }
// }, 1000)

NProgress.configure({
  easing: 'ease',
  showSpinner: false
  // template:"<div class='content_main'></div>"
})

// 当路由开始跳转时
router.beforeEach((to, from, next) => {
  // 开启进度条
  NProgress.start()
  next()
})

// 当路由跳转结束后
router.afterEach(() => {
  // 关闭进度条
  NProgress.done()
})

Vue.prototype.resetSetItem = function (key, newVal) {
  if (key === 'formState') {
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent')
    const storage = {
      setItem: function (k, val) {
        sessionStorage.setItem(k, val)

        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null)

        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, newVal)
  }
}

Vue.directive('loadmore', {
  bind(el, binding) {
    const selectWrap = el.querySelector('.el-table__body-wrapper')
    selectWrap.addEventListener('scroll', function () {
      let sign = 0
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
      if (this.scrollHeight > 80 && scrollDistance <= sign) {
        console.log('触发一次')
        binding.value()
      }
      // console.log(scrollDistance)
    })
  }
})



Vue.prototype.taskSetItem = function (key, newVal) {
  if (key === 'taskState') {
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent')
    const storage = {
      setItem: function (k, val) {
        sessionStorage.setItem(k, val)

        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null)

        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, newVal)
  }
}

Vue.prototype.mseSetItem = function (key, newVal) {
  if (key === 'unreadnum') {
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent')
    const storage = {
      setItem: function (k, val) {
        sessionStorage.setItem(k, val)

        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null)

        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, newVal)
  }
}

// Vue.prototype.userId = sessionStorage.getItem('userID');
// Vue.prototype.unitId = sessionStorage.getItem('unitId');
// Vue.prototype.roleId = sessionStorage.getItem('roleId');
