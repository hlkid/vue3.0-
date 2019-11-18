// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
//element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss'
import './font-awesome/css/font-awesome.min.css'//字体图标
import '@/permission' // permission control
import App from './App'
import store from './store'
import router from './router'
Vue.use(ElementUI);

// 复制到黏贴板
import clipboard from 'clipboard';
//注册到vue原型上
Vue.prototype.clipboard = clipboard;

// import CKEditor from '@ckeditor/ckeditor5-vue';
//
// Vue.use( CKEditor );
/*import VueNativeSock from 'vue-native-websocket'
Vue.use(VueNativeSock, 'ws://192.168.3.127:8020/msg/websocket',{
  reconnection: true, // (Boolean) whether to reconnect automatically (false)
  reconnectionAttempts: 1, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: 3000, // (Number) how long to initially wait before attempting a new (1000)
})*/

//import Print from '@/plugs/print' // 引入附件的js文件
//Vue.use(Print);// 注册

Vue.config.productionTip = false;

import dicts from '@/utils/dicts.js'
import checkMethods from '@/utils/checkMethods.js'
import { getToken, setToken, removeToken, getCookie, setCookie, removeCookie, setSessionStorage, getSessionStorage, removeSessionStorage } from '@/utils/auth'
import { uploadFileUrl } from '@/api/file.js'
import { mapGetters } from 'vuex'
// 数据词典
Vue.prototype.$dicts = dicts;
// 图片查看地址
const VUE_APP_BASE_IMG = process.env.VUE_APP_BASE_IMG;
// SOCKET地址
const VUE_APP_BASE_SOCKET = process.env.VUE_APP_BASE_SOCKET;

Vue.mixin({
  data() {
    return {
      baseImgUrl: VUE_APP_BASE_IMG,
      socketUrl: VUE_APP_BASE_SOCKET
    }
  },
  computed: {
    ...mapGetters(['vloading', 'userInfo','token']),
    // 文件上传地址
    uploadFileParamsUrl:{
      get(){
        return uploadFileUrl + '?token=' + this.token + '&venueNum=' + getCookie('venueNum') + '&hbAppId=' + getCookie('hbAppId')
      }
    }
  },
  methods: {
    // 跳转路由
    gotoPages(path) {
      this.$router.push(path)
    },
    // 删除二次提醒
    commonDeleteDialog(callback, params, info) {
      this.$confirm('是否确认' + info + '？', '温馨提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: '',
        center: false,
      }).then(() => {
        callback(params)
      }).catch(() => {
        this.$message.info('已取消' + info);
      })
    },
    // 审核 dialaog
    commonReviewDialog(callback, params, info) {
      this.$confirm('是否确认' + info + '？', '温馨提示', {
        distinguishCancelAndClose: true,
        cancelButtonText: '审核不通过',
        confirmButtonText: '审核通过',
        type: 'warning',
        center: true,
      }).then(() => {
        callback(params, true)
      }).catch((action) => {
        if (action === 'cancel') {
          this.$prompt('请输入审核不通过的原因', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then((value) => {
            params.value = value;
            callback(params, false)
          }).catch(() => { })
        }
      })
    },
    // 后退
    back() {
      this.$router.go(-1);
    },
    /*
    * obj:属性所属对象
    * attr:属性
    * methodName:校验方法名
    * */
    checkMethods(obj, attr, methodName) {
      if (obj) {
        obj[attr] = checkMethods[methodName](obj[attr]);
      } else {
        this[attr] = checkMethods[methodName](this[attr])
      }
    },
    /*
    * 按钮权限
    * demo-btn : 新增商机
    * */
    hasButton(code) {
      //白名单
      if (code == 'white') {
        return true
      };
      //对比按钮资源列表
      let flag = false;

      let btnResource = this.$store.state.user.resource ? this.$store.state.user.resource.btnResource : []
      btnResource.forEach(item => {
        if (code == item.menuIdentify) {
          flag = true
        }
      });
      return flag
    },
    // 取消全选
    selectText(row) {
      if (row.columnIndex == 0) {
        return 'delete-select-all'
      };
    },
  }
})
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
  //components: { App },
  //template: '<App/>'
})


/* eslint-disable no-new */
/*new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})*/
