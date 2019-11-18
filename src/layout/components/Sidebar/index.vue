<template>
  <section class="sidebar">
    <section class="sidebar-fixed">
      <el-scrollbar ref="scrollbarWrapper" wrap-class="scrollbar-wrapper">
        <ul v-if="resource.menuTree && resource.menuTree.length">
          <li :class="{'sidebar-fixed-item':true,active:activeMenu == item.id}"
              v-for="(item,index) in resource.menuTree"
              :key="index"
              @click="handleMenu(item,true)">
            <p class="sidebar-fixed-icon"><i :class="item.menuIcon+' fa-fw'"></i></p>
            <p class="sidebar-fixed-text"><span>{{item.menuName}}</span></p>
            <i class="fa fa-caret-left"></i>
          </li>
        </ul>
      </el-scrollbar>
    </section>
    <sidebar-menu class="sidebar-menu-wraper" :menu="childMenu" />
  </section>
</template>

<script>
  import SidebarMenu from './SidebarMenu.vue'
  import {mapGetters} from 'vuex'
  import {setSessionStorage, getSessionStorage,removeSessionStorage,removeToken} from '@/utils/auth'
  import {isDataType} from '@/utils/common'
  export default {
    data(){
      return{
        childMenu:[],
        activeMenu:''
      }
    },
    computed:{
      ...mapGetters(['resource'])
    },
    components:{SidebarMenu},
    watch:{
      $route(to,from){
        //console.log(to,from)
        this.handleDefaultMenu()
        //面包屑
        this.getBreadCrumbList()
      }
    },
    created() {
      this.handleDefaultMenu()
      //面包屑
      this.getBreadCrumbList()
    },
    destroyed(){},
    methods:{
      //点击一级菜单
      handleMenu(item,flag){
        this.activeMenu = item.id;
        //setSessionStorage('activeMenu',this.activeMenu);//当前选中一级菜单
        this.childMenu = [item];

        if (flag){
          if (item && isDataType(item.children,'array') && item.children.length){
            this.gotoPages({
              path:item.children[0].menuUrl
            })
          }else{
            this.gotoPages({
              path:item.menuUrl
            })
          };
        };

      },
      //默认选中的一级菜单
      handleDefaultMenu(){
        let menuLevelOne = this.resource.menuTree ? this.resource.menuTree : [];
        let currentRouterPath = this.$route.path;
        //console.log(this.$route.path)
        menuLevelOne.forEach(item=>{
          if (item.menuUrl && currentRouterPath.startsWith(item.menuUrl)){
            this.activeMenu = item.id;
            this.handleMenu(item);
          };
        })
      },
      //获取面包屑导航
      getBreadCrumbList(){
        let menuResource = this.resource.menuResource ? this.resource.menuResource : [];
        let currentRouter = this.$route;
        let arr = [];
        //对比当前路由，筛选出菜单
        menuResource.forEach(item=>{
          if (currentRouter.path.startsWith(item.menuUrl)){
            arr.push({
                name:item.menuName,
                path:item.menuUrl
              })
          };
        });
        //排序
        arr = arr.sort((a,b)=>{
          return a.path.length - b.path.length
        })

        //console.log(arr)
        //刷选结果排序后最后一个和当前路由对比
        if(arr[arr.length-1].path !== currentRouter.path){
          arr.push({
            name:currentRouter.meta.title,
            path:currentRouter.path
          })
        };
        this.$store.dispatch('setBreadCrumbList',arr);
      }
    }
  };
</script>


<style lang="scss" scoped>
  .sidebar{
    height: 100%;
    width: 100%;
    position: relative;
    .sidebar-fixed{
      height: 100%;
      width: 70px;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 1000;
      text-align: center;
      background: #333744;
      font-size: 12px;
      .sidebar-fixed-item{
        position: relative;
        height: 70px;
        padding: 10px 0;
        cursor: pointer;
        color: #ccc;
        &:hover,&.active{
          color: #fff;
          font-weight: bold;
          text-shadow: rgba(255, 255, 255, 0.498) 1px 1px 10px;
        }
        &.active{
          background: url("../../../assets/layout/side_selected.png") center no-repeat;
          background-size: 100% 100%;
          .fa-caret-left{
            right: 0;
          }
        }
        .fa-caret-left{
          position: absolute;
          top: 50%;
          margin-top: -8px;
          z-index: 5;
          font-size: 16px;
          right: 10000px;
        }
        p{
          &.sidebar-fixed-text{
            line-height: 25px;
          }
          i{
            font-size: 21px;
          }
        }

      }
    }
    .sidebar-menu-wraper{
      width: 160px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      &:before{
        display: block;
        content: '';
        width: 2px;
        height: 100%;
        background: #e4e4e4;
        position: absolute;
        left: 160px;
        z-index: 5;
      }
    }
  }

</style>
