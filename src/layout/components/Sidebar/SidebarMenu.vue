<!--<template>
    <ul class="sidebar-menu">
      <template v-for="(item,index) in menu" v-if="item.menuType == 0">
        <template v-if="item.children && item.children.length>0">
          <router-link tag="li" class="sidebar-menu-item" :class="{active:handleActiveMenu(item)}" :to="item.menuUrl"><i :class="item.menuIcon+' fa-fw'"></i>{{item.menuName}}</router-link>
          <SidebarMenu class="sidebar-menu-child" :menu="item.children"/>
        </template>
        <router-link tag="li" class="sidebar-menu-item pointer" :class="{active:handleActiveMenu(item)}" :to="item.menuUrl" v-else><i :class="item.menuIcon+' fa-fw'"></i>{{item.menuName}}</router-link>
      </template>
    </ul>
</template>-->

<template>
  <ul class="sidebar-menu">
    <!--menuType:0菜单1按钮-->
    <template v-for="item in menu" v-if="item.menuType == 0">
      <template v-if="item.children && item.children.length>0">
        <div class="sidebar-menu-item"><i :class="item.menuIcon + ' fa-fw'"></i>{{item.menuName}}</div>
        <SidebarMenu class="sidebar-menu-child" :menu="item.children"/>
      </template>
      <router-link tag="li" class="sidebar-menu-item pointer" :class="{active:handleActiveMenu(item)}" :to="item.menuUrl" v-else><i :class="item.menuIcon+' fa-fw'"></i>{{item.menuName}}</router-link>
    </template>
  </ul>
</template>
<script>
  export default {
    name: 'SidebarMenu',
    props: {
      menu: {
        type: Array,
        default: () => {
          return[]
        }
      }
    },
    methods: {
      // 当前选中的菜单
      handleActiveMenu (item) {
        // console.log(this.$route)
        // console.log(item.menuUrl)
        // console.log(this.$route.path.startsWith(item.menuUrl))
        return this.$route.path.startsWith(item.menuUrl)
        // return item.menuUrl.startsWith(this.$route.path)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sidebar-menu{
    font-size: 14px;
    line-height: 50px;
    .pointer{
      &:hover,&.active{
        color: #0079fe;
      }
      &.active{
        background: url("../../../assets/layout/sideitem_selected.png") center no-repeat;
        background-size: 100% 100%;
      }
    }
    &>.sidebar-menu-item{
      padding-left: 15px;
      font-weight: 700;
      color: #999;
    }
    &.sidebar-menu-child{
      &>.sidebar-menu-item{
        padding-left: 30px;
        font-weight: 400;
        color: #666;
        cursor: pointer;
        &:hover,&.active{
          color: #0079fe;
        }
        &.active{
          background: url("../../../assets/layout/sideitem_selected.png") center no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
</style>
