<template>
  <section class="app-main"
           ref="appMain"
           v-loading="vloading"
           element-loading-text=""
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(0, 0, 0, 0)">
    <!--<transition name="fade-transform" mode="out-in">
        <router-view/>
    </transition>-->
    <el-scrollbar>
      <div ref="top">
        <transition name="fade-transform" mode="out-in">
          <router-view/>
        </transition>
        <div class="footer">
          <p>版权所有&nbsp;&nbsp;</p>
          <p>Copyright&copy;2019 All rights Reserved.</p>
        </div>
      </div>




    </el-scrollbar>
  </section>
</template>

<script>

  export default {
    watch:{
      $route(to,from){
        this.$refs.top.scrollTop = 0;
      }
    }

  }
</script>

<style lang="scss" scoped>
  .app-main {
    .footer{
      text-align: center;
      padding: 30px;
      font-size: 12px;
      line-height: 1.5;
      color: #ccc;
    }
  }
</style>

