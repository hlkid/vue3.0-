<template>
  <section class="navbar-container ">
    <div class="navbar-top clearfix">
      <el-dialog title="修改密码" :visible.sync="userPasswordDialog" :append-to-body='true'
                 @close="cancelUserpassword('userPass')" :close-on-click-modal="false" width="500px">
        <el-form :model="userPass" ref="userPass" :rules="rules" label-position="right"
                 label-width="80px">
          <el-form-item label="原始密码" prop="oldPassword" >
            <el-input v-model="userPass.oldPassword" auto-complete="off"
                      placeholder="请输入原始密码" :disabled="initialPass" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="userPass.newPassword" auto-complete="off"
                      placeholder="请输入新密码" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPassword">
            <el-input v-model="userPass.checkPassword" auto-complete="off"
                      placeholder="请输入确认密码" show-password></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelUserpassword('userPass')">取 消</el-button>
          <el-button type="primary" @click="saveUserpassword('userPass')">保 存</el-button>
        </div>
      </el-dialog>
      <div class="fl">
        <div class="quck-list">
          <div class="quck-item">
            <span class="fa fa-fw fa-outdent" v-if="sidebar" @click="closeSidebar(false)"></span>
            <span class="fa fa-fw fa-indent" v-else @click="closeSidebar(true)"></span>
            <!--<img height="30" src="@/assets/logo/logo.png" alt="">
            <span class="">群文云管理平台</span>-->
          </div>
          <!--<div class="quck-item logo-wraper">
            <img height="30" src="@/assets/logo/logo.png" alt="">
            <span class="">群文云管理平台</span>
          </div>-->
        </div>
      </div>
      <div class="fr">
        <div class="quck-list">
          <!--待办-->
          <!--<div class="quck-item" title="待办事项">
            <el-dropdown trigger="hover" @visible-change="dropdownVisibleChange">
              <span class="quck-item-name">
                <el-badge :value="todo.allCount?todo.allCount:0" :max="9">
                  <i class="fa fa-calendar-check-o fa-fw"></i>
                  <span>事项</span>
                </el-badge>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="dealt-with-item" v-for="item in todo.content" :key="item.code" @click.native="todoPage(item.code)" v-if="todo.content && todo.content.length">
                  {{item.message}}&nbsp;（<span>{{item.count}}</span>）
                </el-dropdown-item>
                <span v-else>暂无待办事项</span>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
-->
          <!--<div class="quck-item" title="系统消息" @click="gotoPages({name:'tidings'})">
            &lt;!&ndash;<el-badge is-dot v-if="1"><i class="fa fa-bell fa-fw"></i><span>消息</span></el-badge>&ndash;&gt;
            <template><i class="fa fa-bell fa-fw"></i><span>消息</span></template>
          </div>-->


          <div class="quck-item" v-if="userInfo && userInfo.sysOrgs && userInfo.sysOrgs.length>1">
            <el-dropdown trigger="hover" v-if="userInfo.sysOrgs.length>1">
              <span class="quck-item-name">
                <i class="fa fa-sitemap fa-fw"></i>
                <span>{{orgName}}</span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :class="{active:orgNum == item.orgNum}" v-for="item in userInfo.sysOrgs" :key="item.orgNum" @click.native="changeOrg(item)">{{item.orgName}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <template v-else>
              <i class="fa fa-sitemap fa-fw"></i><span>{{userInfo.sysOrgs[0].orgName}}</span>
            </template>
          </div>
        </div>



        <el-dropdown trigger="hover">
          <div class="loginame-wrapper">
            <img class="avatar-img" height="30" width="30" :src="baseImgUrl + avatar" alt="" v-if="avatar">
            <i class="fa fa-user-circle fa-fw" v-else></i>

            <span v-if="userInfo">{{userInfo.userNickName?userInfo.userNickName:userInfo.userRealName}}</span>
            <i class="el-icon-arrow-down"/>
          </div>
          <el-dropdown-menu slot="dropdown">
            <span>
               <el-dropdown-item @click.native="userPasswordDialog=true">修改密码</el-dropdown-item>
            </span>
            <router-link to="/home">
              <el-dropdown-item>返回首页</el-dropdown-item>
            </router-link>
            <span>
              <el-dropdown-item @click.native="logOutClick">退出</el-dropdown-item>
            </span>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="navbar-bottom clearfix">
      <bread-crumb class="bread-crumb fl" v-if="breadCrumbList.length" :list="breadCrumbList"/>
      <div class="back-refresh fr"><i class="fa fa-chevron-left fa-fw pointer" title="返回上页" @click="back"></i><i class="fa fa-refresh fa-fw pointer" title="刷新页面" @click="refresh"></i></div>
    </div>
    <div class="shadow"></div>

  </section>
</template>

<script>
  import BreadCrumb from '@/components/Breadcrumb'
  import {mapGetters} from 'vuex'
  import { saveUserpassword } from "@/api/config.js"
  import { getMessageNoticeType, getTodoItem } from "@/api/mcc/information.js"
  import { getStore,removeStore} from "@/utils/auth";
  export default {
    computed: {
      ...mapGetters(['userInfo','breadCrumbList','orgNum','avatar','sidebar']),
      orgName(){
        let result = '切换机构';
        if (this.userInfo && this.userInfo.sysOrgs && this.userInfo.sysOrgs.length>1){
          this.userInfo.sysOrgs.forEach(item=>{
            if (this.orgNum == item.orgNum){
              result = item.orgName
            };
          })
        };
        return result;
      }
    },
    data() {
      return {
        todo:{},//待办事项
        messageNoticeTypeList:[],//消息类型列表
        //breadCrumbList: [],//面包屑导航
        userPass: {
          oldPassword: '',
          newPassword: '',
          checkPassword: '',
        },
        userPasswordDialog: false,
        rules: {
          oldPassword: [
            {required: true, message: '请输入原始密码'}
          ],
          newPassword: [
            {required: true, message: '请输入新密码'}
          ],
          checkPassword: [
            {required: true, message: '请输入确认密码'}
          ]
        },

        initialPass:getStore("initialPass"),

        screenWidth: document.body.clientWidth
      }
    },
    components: {BreadCrumb},
    inject:['reload'],
    created(){
      // this.getTodoItem()
      // this.getMessageNoticeType();

      this.initPass();

    },
    mounted(){
      this.initScreenWidth()
      window.addEventListener('resize', this.initScreenWidth)
    },
    destroyed(){
      window.removeEventListener('resize', this.initScreenWidth)
    },
    methods: {
      //初始化判断窗口大小
      initScreenWidth(){
        this.$nextTick(()=>{
          this.screenWidth = document.body.clientWidth;
          if (this.screenWidth<1200) {
            this.closeSidebar(false)
          }else{
            this.closeSidebar(true)
          }
        })
      },
      closeSidebar(b){
        this.$store.dispatch('ToggleSidebar',b)
      },
      //返回上页
      back(){
        this.$router.go(-1);
      },
      //刷新页面
      refresh(){
        this.reload();
      },
      //退出登录
      logOutClick() {
        this.$store.dispatch('LogOut')/*.then(res => {
          //this.$router.push('/login')
          location.href = '/login'
        }).catch(()=>{
          location.href = '/login'
        });*/
      },
      cancelUserpassword(formName) {
        this.userPasswordDialog = false;
        this.$refs[formName].resetFields();
      },
      saveUserpassword(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
              if(this.userPass.newPassword.length<6){
                this.$message({
                  message: '密码不能小于6位，请重新输入',
                  type: 'warning'
                });
                return;
              }
              else{

                if (this.userPass.newPassword != this.userPass.checkPassword) {
                  this.$message({
                    message: '确认密码不正确，请重新输入',
                    type: 'warning'
                  });
                  this.userPass.checkPassword = '';
                } else {
                  let newUserpass={};
                  for(let arr in this.userPass){
                    newUserpass[arr]=this.userPass[arr]
                  }
                  delete newUserpass.checkPassword;
                  saveUserpassword(this.userInfo.userId,newUserpass).then(res => {
                    //console.log(res);
                    if(res.code!=200){
                      this.userPass.oldPassword = '';
                      return;
                    }else{
                      this.$message({
                        message: '密码修改成功',
                        type: 'success'
                      });
                      this.userPasswordDialog = false;
                      this.$refs[this.userPass].resetFields();
                    }
                  })
                }
              }
          } else {
            return false
          }
        })
      },

      //切换所属机构
      changeOrg(item){
        this.$store.dispatch('setOrgNum',item.orgNum);
        this.refresh();//刷新视图
      },

      //消息
      getMessageNoticeType(){
        getMessageNoticeType().then(res=>{
          if (res.code == 200){
            this.messageNoticeTypeList = res.data
          };
        })
      },
      //待办事项统计
      getTodoItem(){
        getTodoItem().then(res=>{
          if (res.code == 200){
            this.todo = res.data
          };
        })
      },
      todoPage(code){
        //console.log(code)
        if (code == 0){
          this.$router.push({
            name:'approval_price'
          })
        } ;
      },
      dropdownVisibleChange(flag){
        flag && this.getTodoItem()
      },
      //socket同信
      getMessage(data){
        //this.getTodoItem();
        if (!data.idPerson || data.idPerson && data.idPerson.indexOf(this.userInfo.userId) !== -1){
          data.type && this.openNotify(data)
        };
      },
      //消息提示弹窗
      openNotify(data) {
        let _this = this;
        let title = '';
        this.messageNoticeTypeList.forEach(item=>{
          if (item.code == data.type){
            title = item.message
          };
        });
        this.$notify({
          title: title,
          iconClass:'el-icon-message-solid el-message--primary',
          //dangerouslyUseHTMLString: true,
          showClose: true,
          duration: 10000,
          offset: 30,
          message: data.title,
          onClick:function(){
            if (data.type == 1){//新闻公告
              _this.$router.push({name:'newNotice_detail',params:{id:data.idSource}})
            }else if(data.type == 0){//项目报价
              _this.$router.push({
                name:'approval_price'
              })
            };
          }
        });
      },
      /* 首次等判断是不是初始密码 */
      initPass(){
        if (this.userInfo && this.userInfo.initialPwd && this.initialPass) {
          this.userPass.oldPassword = this.initialPass;
          removeStore("initialPass");
          this.initialPass = "";
          this.userPasswordDialog = true;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  .navbar-container {
    position: relative;
    .navbar-bottom {
      height: 40px;
      padding: 0 20px;
      .bread-crumb{

      }
      .back-refresh{
        height: 40px;
        line-height: 40px;
        .fa{
          color: #999;
          margin-left: 10px;
        }
      }
    }
    .navbar-top {
      height: 51px;
      line-height: 50px;
      padding: 0 20px;
      border-bottom: 1px solid #eee;
      .loginame-wrapper {
        margin-left: 20px;
        color: #999;
        &:hover{
          color: #0079fe;
        }
      }
      .quck-list {
        display: inline-block;
        .quck-item {
          margin-right: 10px;
          display: inline-block;
          color: #999;
          font-size: 14px;
          cursor: pointer;
          span{
            vertical-align: middle;
            background: #fafafa;
            height: 30px;
            width: 30px;
            line-height: 30px;
            border-radius: 50%;
            &.fa:hover{
              background: #f0f2f5;
            }
          }
          &.logo-wraper{
            pointer-events: none;
            color: #999;
            img{
              margin-right: 5px;
              vertical-align: middle;
              display: inline-block;
            }
            &:hover {
              color: #999;
            }
          }
          &:hover {
            color: #0079fe;
          }
          .quck-item-name{
            color: #999;
            &:hover{
              color: #0079fe;
            }
            .el-badge{
              display: block;
              height: 51px;
              line-height: 51px;
              .el-badge__content{
                top: 10px;
                right: 15px;
              }
            }
          }
        }
      }
    }
    .shadow{
      height: 1px;
      box-shadow: 0 1px 3px #aaa;
    }
  }

  .el-dropdown-menu__item.active{
    color: #0079fe;
  }
  .avatar-img{
    border-radius: 50%;
    vertical-align: middle;
  }

  /*待办事项下拉*/
  .dealt-with-item{
    min-width: 100px;
    list-style-type: disc;
    list-style-position: inside;
    span{
      color: #F56C6C;
    }
  }
</style>

