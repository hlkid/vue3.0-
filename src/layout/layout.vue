<template>
  <div class="layout-wrapper" :id="sidebar?'':'show-sidebar'">
    <sidebar class="sidebar-wraper"/>
    <div class="main-container">
      <navbar class="navbar-wraper"/>
      <app-main class="app-main-wraper" v-if="appMainShow"/>

    </div>
  </div>
</template>

<script>
  import { Navbar, Sidebar, AppMain } from './components'

  import {mapGetters} from 'vuex'
  export default {
    name: 'Layout',
    data(){
      return{
        appMainShow:true
      }
    },
    computed:{
      ...mapGetters(['userInfo','sidebar'])
    },
    components: {
      Navbar,
      Sidebar,
      AppMain
    },
    provide(){
      return {
        reload:this.reload
      }
    },
    methods: {
      reload(){
        this.appMainShow = false;
        this.$nextTick(()=>{
          this.appMainShow = true;
        })
      }
    },
    mounted() {

    }
  }
</script>

<style lang="scss" scoped>
  .layout-wrapper{
    height: 100%;
    padding-left: 230px;
    position: relative;
    /*&:before{
      display: block;
      content: '';
      width: 2px;
      height: 100%;
      background: #e4e4e4;
      position: absolute;
      left: 230px;
      z-index: 5;
    }*/
    .sidebar-wraper{
      transition: all .28s;
      width: 230px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      background: #fcfcfc;
    }
    .main-container{
      height: 100%;
      .navbar-wraper{
        background: #fff;
      }
      .app-main-wraper{
        height: calc(100% - 100px);
      }
    }
  }
</style>
