<template>
  <section class="login-wrap">
    <!--登陆form-->
      <section class="login-box">
        <div class="login-icon">
          <!--<span class="fa fa-map-o"></span>-->
          <img height="80" src="@/assets/logo/logo.png" alt="">
        </div>
        <div class="login-name">
          <p class="title">群文云管理平台</p>
        </div>

        <el-form class="login-form" ref="loginForm" :model="loginForm" :rules="roleRules">
          <el-form-item prop="userAccount">
            <el-input v-model="loginForm.userAccount" placeholder="请输入用户名"  clearable prefix-icon="fa fa-user-circle-o"></el-input>
          </el-form-item>
          <el-form-item prop="userPassword">
            <el-input  v-model="loginForm.userPassword" placeholder="请输入密码" show-password prefix-icon="fa fa-lock" clearable   @keyup.enter.native="login"></el-input>
          </el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
        </el-form>
      </section>


    <!--选择进入的机构-->
    <el-dialog class="select-org" title="选择机构" :visible.sync="selectOrgsShow" width="400px" top="30vh" :close-on-press-escape="false" :close-on-click-modal="false" :append-to-body='true'>
      <div>
        <el-radio-group v-model="orgNum" size="mini">
          <el-radio :label="item.orgNum" border v-for="item in sysOrgs" :key="item.orgNum">{{item.orgName}}</el-radio>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selectOrgsShow = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="goSystem">进入系统</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import {checkMobile} from '@/utils/validate'
  import {setSessionStorage,removeSessionStorage,removeCookie} from '@/utils/auth.js'
  import {outputTree,isDataType,isEmpty} from '@/utils/common.js'
  import {fileDetail} from '@/api/file'
  import { setStore } from "@/utils/auth";
  export default {
    data(){
      return{
        loginForm:{
          userAccount:'szseg',
          userPassword:'szseg@123456'
        },
        roleRules:{
          userAccount:[
            { required: true, message: '请输入账号'}
          ],
          userPassword:[
            { required: true, message: '请输入密码'}
          ]
        },
        firstPath:'',//可进入的第一个菜单页面
        //对话框
        sysOrgs:[],//用户所属机构集合
        selectOrgsShow:false,
        orgNum:'',//选中的机构
      }
    },
    watch:{
      firstPath(n,o){
        this.$router.push({
          path: n
        })
      }
    },
    created(){
      removeCookie('token')
      removeCookie('removeCookie')
      sessionStorage.clear();
      this.$store.dispatch('setResource',{})
      this.$store.dispatch('setToken','')
    },
    methods:{
      login(){
        this.$refs['loginForm'].validate((validate)=>{
          if(validate){
              this.$store.dispatch('Login',this.loginForm).then(res=>{
                //处理资源权限数据
                this.handleResource(res);
                //用户头像
                this.getAvatar(res.data.userIcon);
                if( res.data.initialPwd) {
                  setStore("initialPass",this.loginForm.userPassword)
                }
              })
          }
        })
      },
      //处理资源权限数据
      /*handleResource(res){
        //存储资源:菜单和按钮集合
        if (res.data && res.data.resource && isDataType(res.data.resource,'array')){
          let menuResource = res.data.resource.filter(item=>{
            return item.menuType == 0;
          })
          let btnResource = res.data.resource.filter(item=>{
            return item.menuType == 1;
          })
          //console.log(menuResource,btnResource)
          let resource = {
            menuResource:menuResource,
            menuTree:outputTree(menuResource,null,'menuSort'),
            btnResource:btnResource
          };
          setSessionStorage('resource',resource);
          this.$store.dispatch('setResource',resource);

          //登陆之后跳转至第一个菜单
          let firstPath = ''
          if (resource && resource.menuTree && resource.menuTree[0] && resource.menuTree[0].children){
            //console.log(resource.menuTree[0].children)
            if (resource.menuTree[0].children[0] && resource.menuTree[0].children[0].children && resource.menuTree[0].children[0].children.length){

              this.firstPath = resource.menuTree[0].children[0].children[0].menuUrl
            }else{
              this.firstPath = resource.menuTree[0].children[0].menuUrl
            }
          };

          //所属机构
          this.sysOrgs = res.data.sysOrgs;
          if (Array.isArray(this.sysOrgs) && this.sysOrgs.length){
            this.orgNum = res.data.sysOrgs[0].orgNum;
            this.$store.dispatch('setOrgNum',this.orgNum);
          };
          if(Array.isArray(this.sysOrgs) && this.sysOrgs.length >1){
            this.selectOrgsShow = true;
          }else{
            this.$router.push({
              path: this.firstPath
            })
          }
        }else{
          this.$message.warning('请联系管理员进行资源授权')
        };
      },*/
      handleResource(res){
        if (res.code == 200){
          if (!res.data){
            this.$message.warning('请联系管理员进行资源授权')
          }else{
            //存储资源:菜单和按钮集合
            if (res.data.resource && isDataType(res.data.resource,'array')){
              // 所有资源
              let resourceTree = JSON.parse(JSON.stringify(res.data.resource))
              // 所有菜单
              let menuResource = res.data.resource.filter(item=>{
                return item.menuType == 0;
              })
              // 所有按钮
              let btnResource = res.data.resource.filter(item=>{
                return item.menuType == 1;
              })
              //console.log(menuResource,btnResource)
              // 所有菜单的树
              let menuTreeAll = outputTree(menuResource,null,'menuSort');
              let menuTree = [];
              if(menuTreeAll && menuTreeAll[0] && menuTreeAll[0].children && menuTreeAll[0].children[0] && menuTreeAll[0].children[0].children){
                menuTree = menuTreeAll[0].children[0].children
              };

              // 所有资源树
              resourceTree = outputTree(resourceTree,null,'menuSort');
              let resource = {
                menuResource: menuResource,
                menuTree: menuTree,
                btnResource: btnResource,
                resourceTree: resourceTree
              };
              setSessionStorage('resource',resource);
              this.$store.dispatch('setResource',resource);

              //登陆之后跳转至第一个菜单
              if (resource && resource.menuTree && resource.menuTree.length){
                if (resource.menuTree[0] && resource.menuTree[0].children && resource.menuTree[0].children[0]){
                  this.firstPath = resource.menuTree[0].children[0].menuUrl
                }else{
                  this.firstPath = resource.menuTree[0].menuUrl
                }
              }else{
                this.$message.warning('请联系管理员进行资源授权')
              }

              //所属机构
              this.sysOrgs = res.data.sysOrgs;
              if (Array.isArray(this.sysOrgs) && this.sysOrgs.length){
                this.orgNum = res.data.sysOrgs[0].orgNum;
                this.$store.dispatch('setOrgNum',this.orgNum);
              };
              if(Array.isArray(this.sysOrgs) && this.sysOrgs.length >1){
                this.selectOrgsShow = true;
              }/*else{
                let timer = setTimeout(()=>{
                  clearTimeout(timer)
                  this.$router.push({
                    path: this.firstPath
                  })
                })
              }*/
            }
          }
        }

      },
      //进入系统
      goSystem(){
        this.$store.dispatch('setOrgNum',this.orgNum);

        this.$router.push({
          path: this.firstPath
        })
      },
      //获取用户头像
      getAvatar(id){
        if(!isEmpty(id)){
          if(id.indexOf('http') == -1){
            fileDetail(id).then(res=>{
              if (res.code == 200){
                if (res.data) {
                  setSessionStorage('avatar',res.data.imgSmallCompress)
                  this.$store.dispatch('setAvatar',res.data.imgSmallCompress);
                }
              };
            })
          }else{
            setSessionStorage('avatar',id)
            this.$store.dispatch('setAvatar',id);
          }
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .login-wrap{
    width: 100%;
    min-width: 1200px;
    height: 100%;
    position: relative;
    background:url('../../assets/logo/login-bg.jpg') ;
    background-position: center bottom;
    background-repeat: no-repeat;
    background-attachment: scroll;
    .login-box{
      position: absolute;
      top: 110px;
      left: 50%;
      margin-left: -260px;

      width: 521px;
      height: 601px;
      background:url('../../assets/logo/icon-login-white.png');
      .login-icon{
        text-align: center;
        font-size: 72px;
        color: #0079FE;
        margin: 70px 0 30px 0;
      }

      .login-name{
        text-align: center;
        color: #0079FE;
        .title{
          font-size: 36px;
          font-family: '微软雅黑 Bold', '微软雅黑';
          font-weight: 700;
        }
        .english{
          font-family: '微软雅黑';
          font-weight: 400;
          font-size: 16px;
          line-height: 42px;
        }
      }
    }
  }


</style>
