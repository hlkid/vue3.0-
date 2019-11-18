<template>
  <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right" v-if="list.length">
    <!--<el-breadcrumb-item to="/" title="系统首页"><i class="fa fa-home"></i></el-breadcrumb-item>-->
    <!--<el-breadcrumb-item v-for="(item,index) in list" :key="index" :to="item.path">{{item.name}}</el-breadcrumb-item>-->
    <el-breadcrumb-item v-for="(item,index) in list" :key="index" :title="item.name">{{item.name}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
  export default {
    data(){
      return{

      }
    },
    props:{
      list:{
        type:Array,
        default:()=>{
          return []
        }
      }
    }
  }
</script>
<style>
  .el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
    font-weight: 400;
    color: #999;
    cursor: text;
  }

  .el-breadcrumb__inner a, .el-breadcrumb__inner.is-link,.el-breadcrumb__inner{
    color: #999;
  }
  .el-breadcrumb__inner a:hover, .el-breadcrumb__inner.is-link:hover{
    color: #999;
  }
</style>

<style lang="scss" scoped>
  .breadcrumb{
    height: 40px;
    line-height: 40px;
    color: #999;
    .fa-home{
      font-size: 18px;
      color: #999;
      bottom: -1px;
      position: relative;
      &:hover{
        color: #666;
      }
    }
  }
</style>
