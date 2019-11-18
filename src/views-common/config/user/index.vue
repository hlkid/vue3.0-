<template>
  <section class="view-container">
    <el-form class="search-form" ref="searchForm" :model="searchForm" label-width="0" :inline="true"
             size="small">
      <el-form-item prop="userRealName">
        <el-input v-model="searchForm.userRealName" placeholder="请输入用户名称"></el-input>
      </el-form-item>

      <el-form-item label="" prop="type">
        <el-select v-model="searchForm.type" clearable placeholder="用户类型">
          <el-option :label="item.name" :value="item.id" v-for="item in userTypeList"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="attribute">
        <el-select v-model="searchForm.attribute  " clearable placeholder="角色属性">
          <el-option :label="item.name" :value="item.id" v-for="item in userAttributeEnumList"
                     :key="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()"><i class="fa fa-search"></i>&nbsp;
          查询
        </el-button>
        <el-button @click="reset('searchForm')"><i class="fa fa-repeat"></i>&nbsp;重置</el-button>
      </el-form-item>
    </el-form>
    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button v-if="hasButton('config_user_add')" size="small" type="primary" @click="getRole()"><i class="fa fa-plus"></i>
          &nbsp;新增用户
        </el-button>
      </el-row>
      <el-row class="table-wraper">
        <template>
          <el-table style="width: 100%;" stripe border :data="tableData" ref="multipleTable"
                    @selection-change="">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left">
                  <el-form-item label="邮箱："> <span>{{ scope.row.userEmail?scope.row.userEmail:'--' }}</span></el-form-item>
                  <el-form-item label="备注："> <span>{{ scope.row.remark?scope.row.remark:'--' }}</span></el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="userAccount" sortable label="账号" >
            </el-table-column>
            <el-table-column prop="userRealName" label="用户名称" >
            </el-table-column>
            <el-table-column prop="userPhone" label="电话"></el-table-column>
            <el-table-column prop="typeName" label="用户类型"></el-table-column>
            <el-table-column prop="attributeName" label="角色属性"></el-table-column>
            <el-table-column label="操作" width="350">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
                           v-if="hasButton('config_user_edit')"><i class="fa fa-pencil"></i>&nbsp;编辑
                </el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)"
                           v-if="hasButton('config_user_delete')"><i  class="fa fa-trash-o"></i>&nbsp;删除
                </el-button>
                <el-button size="mini" type="primary" @click="revisePas(scope.row.id)"
                           v-if="hasButton('config_user_revisePas')"><i class="fa fa-pencil"></i>&nbsp;重置密码
                </el-button><el-button
                size="mini"
                type="primary"
                v-if="hasButton('config_user_bindApp')"
                @click="handleBindApp(scope.row)"><i class="fa fa-pencil"></i>绑定应用</el-button>
              </template>
            </el-table-column>
          </el-table>
          <page-temp :total="total" :pageSize="searchForm.pageSize"
                     :currentPage="searchForm.pageNum" @goSpecifiedPage="goSpecifiedPage"/>

        </template>
      </el-row>
    </section>

    <!--新增、修改dialog-->
    <el-dialog :title="dialogTitleType=='add'?'新增用户':'编辑用户'" :visible.sync="userAddDialog" :append-to-body='true'
               @close="cancelUserAdd('userAdd')" width="680px" :close-on-click-modal="false">
      <el-form class="dialog-form add-user_form" inline :model="userAdd" ref="userAdd" :rules="rules" label-position="right"
               label-width="80px"  size="small">

        <el-form-item label="姓名" prop="userRealName">
          <el-input v-model="userAdd.userRealName" auto-complete="off"
                    placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item label="昵称" prop="userNickName">
          <el-input v-model="userAdd.userNickName" auto-complete="off"
                    placeholder="请输入昵称"></el-input>
        </el-form-item>

        <!--不给编辑-->
        <el-form-item label="登陆账号" prop="userAccount">
          <el-input v-model="userAdd.userAccount" auto-complete="off"
                    placeholder="请输入登陆账号" :disabled="dialogTitleType=='edit'"></el-input>
        </el-form-item>

        <!--普通用户不允许新增，可允许编辑-->
        <el-form-item label="用户类型" prop="type">
          <el-select v-model="userAdd.type" clearable placeholder="请选择用户类型" @change="userChange" :disabled="dialogTitleType == 'add'">
            <el-option :label="item.name" :value="item.id" v-for="item in userTypeList"
                       :key="item.key"></el-option>
          </el-select>
        </el-form-item>

      <!--  <el-form-item label="关联场馆" prop="venueIds">
          <el-input v-model="venueNames" auto-complete="off" readonly
                    placeholder="请选择关联场馆" id="venueId" class="bmBox"></el-input>
          <div v-show="venueIdsShow" class="userAddtreeBox select-tree">
            <el-tree
              ref="tree2"
              :data="venueIdTreeData"
              :props="defaultPropsjg"
              :default-expanded-keys="defaultExpandedKeys"
              :default-checked-keys="defaultExpandedKeys"
              node-key="id"
              accordion
              show-checkbox
              @check-change="handleCheckChange"
              :check-strictly=true>
            </el-tree>
          </div>
        </el-form-item>-->
        <el-form-item label="用户属性" prop="attribute">
          <el-select v-model="userAdd.attribute" clearable placeholder="请选择用户属性" @visible-change="visibleChangeAttribute">
            <el-option :label="item.name" :value="item.id" v-for="item in userAttributeEnumList"
                       :key="item.key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="userAdd.userEmail" auto-complete="off" placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <!--不给新增，，编辑可显示-->
        <el-form-item label="手机号" prop="userPhone" v-if="dialogTitleType == 'edit'">
          <el-input v-model="userAdd.userPhone" auto-complete="off" placeholder="请输入手机号" disabled></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch
            v-model="userAdd.userStatus"
            active-color="#13ce66"
            inactive-color="#dcdfe6"
            :active-value=1
            :inactive-value=0>
          </el-switch>
        </el-form-item>

        <!--平台用户不给选角色-->
        <el-form-item label="角色" prop="sysRoleIds" v-if="userAdd.type==1">
          <el-select v-model="userAdd.sysRoleIds" clearable placeholder="请选择用户属性">
            <el-option :label="item.roleName" :value="item.id" v-for="item in rolemsg"
                       :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="角色" prop="sysRoleIds" class="block">
          <el-checkbox-group v-model="userAdd.sysRoleIds">
            <el-checkbox :label="item.id" v-for="(item,index) in rolemsg"
                         :key="item.id">{{item.roleName}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>-->
        <div>
          <el-form-item label="上传头像" class="ava">
            <el-upload
              class="avatar-uploader"
              :action="uploadFileParamsUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :data="msg" >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div  class="el-upload__tip">请上传png、jpg及jpeg格式图片(大小4M以下)</div>
          </el-form-item>
        </div>



      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUserAdd('userAdd')">取 消</el-button>
        <el-button type="primary" @click="saveUserAdd('userAdd')">保 存</el-button>
      </div>
    </el-dialog>


    <!--绑定应用-->
    <BindApplicationDialog type="role" :id="currentRoleId" :show.sync="dialogAppShow"></BindApplicationDialog>
  </section>

</template>
<script>
  import { userDelete,getUserList,getRole,exitUser,revisePas,getUserTypeEnum,getUserAttributeEnum } from '@/api/config.js'
  import { userAdd,userMsg ,reviseUser} from "@/api/mcc/index.js"
  import { getVenueData} from "@/api/mcc/venue.js"
  import { fileDetail ,uploadFileUrl} from '@/api/file.js'
  import BindApplicationDialog from '@/views-common/components/BindApplicationDialog.vue'

  import PageTemp from '@/components/PageTemp'
  import {checkMobile, checkEmail} from "@/utils/validate";
  import {outputTree} from '@/utils/common.js'
  import { applicationDictionaryDataByTypeCode } from '@/api/config.js'
  export default {
    data() {
      return {
        uploadFileUrl:uploadFileUrl,
        imageUrl:'',
        msg:{
          idSource:'',
          typeSource:'',
        },
        defaultPropsjg: {
          children: 'children',
          label: 'name'
        },
        searchForm: {
          pageNum: 1,
          pageSize: 10,
          userRealName:'',
          type: '',
          attribute: '',
        },
        venueIdsShow:false,
        venueIdTreeData:[],
        defaultExpandedKeys:[],

        tableData: [],
        userAddDialog: false,
        userAdd: {
          userAccount: '',
          userRealName:"",
          type: 1,
          attribute:"",
          userIcon: '',
          userNickName: '',
          userPhone: '',
          userEmail: '',
          userSex: 0,
          userStatus: 1,
          remark: '',
          sysRoleIds: ""
        },

        rolemsg:[],

        venueIds:[],
        venueNames:"",
        userTypeList:[],
        userAttributeEnumList:[],
        userAttributeEnumLists:[],
        dialogTitle: '',
        dialogTitleType: 'add',
        rowId: 0,
        total: 0,
        passwordShow: true,
        userPass: {},
        rules: {
          userRealName: [{required: true, message: '请输入姓名'}],
          userNickName: [{required: true, message: '请输入昵称'}],
          type: [{required: true, message: '请选择用户类型'}],
          sysRoleIds: [{required: true, message: '请选择角色'}],
          attribute: [{required: true, message: '请选择用户属性'}],
          userAccount: [{ required: true, message: '请输入登陆账号', trigger: 'blur'}],
          userPassword: [{required: true,  message: '请输入密码' } ],
          userEmail: [{required: false,message: '请输入邮箱'}],
          // userPhone: [{required: true,message: '请输入手机号' },{validator: checkMobile}],
        },

        /*绑定应用*/
        dialogAppShow: false,
        currentRoleId: ''
      }
    },
    components: {PageTemp,BindApplicationDialog},
    methods: {
      // 切换属性
      visibleChangeAttribute(){
        let list = [];
        this.userAttributeEnumLists.forEach(e=>{
          if(this.userAdd.type == 0){
            e.id == 3 && (list = list.concat(e))
          }else{
            e.id != 3 && (list = list.concat(e))
          }
        })
        this.userAttributeEnumList = list;
      },
      // 绑定
      handleBindApp(row){
        this.currentRoleId = row.id
        this.dialogAppShow = true;
      },
      //数据词典
      applicationDictionaryDataByTypeCode(code,arr){
        applicationDictionaryDataByTypeCode(code).then(res=>{
          if (res.code == 200){
            res.data.forEach(item=>{
              arr.push({
                key:item.valueName+item.value,
                value:item.value,
                label:item.valueName
              })
            })
          };
        })
      },
      //删除
      handleDelete(index) {
        this.$confirm('此操作将删除用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          userDelete(index).then(data => {
            if (data.data == null) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getMenuData();
            }
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消用户删除'
          });
        })

      },

      //获取列表(分页)
      getMenuData() {
        getUserList(this.searchForm).then(data => {
          if(data.code == 200){
            this.tableData = data.data.result;
            this.total = data.data.totalPages;
          }
        })
      },

      //新增按钮
      getRole() {
        let that = this;
        getRole("", "").then(data => {
          that.rolemsg = data.data;

          this.dialogTitle = '新增用户';
          this.dialogTitleType = 'add';
          this.passwordShow = true;
          this.userAddDialog = true;
          if(this.$refs['userAdd']){
            this.$refs['userAdd'].resetFields();
            this.$refs['userAdd'].clearValidate(); //移除校验结果
          }
          this.$refs.tree2 && this.$refs.tree2.setCheckedKeys([]);
        })

      },
      //编辑
      handleEdit(index, row) {
        let that = this;

        this.imageUrl = '';
        this.userAdd.userIcon = '';

        getRole("", "").then(data => {
          that.rolemsg = data.data;
          that.dialogTitle = '编辑';
          this.dialogTitleType = 'edit';
          that.passwordShow = false;
          let veunIds = [],veunNames = [];
          userMsg(row.id).then(res => {
            if(res.code == 200){
              for (let key in this.userAdd) {
                if(res.data.sysUserVO[key] != null){
                  that.userAdd[key] = res.data.sysUserVO[key];
                }
              }
              // 角色
              let sysRoleIds = [];
              if (res.data.sysUserVO && res.data.sysUserVO.sysUserRoleVOS && res.data.sysUserVO.sysUserRoleVOS.length){
                res.data.sysUserVO.sysUserRoleVOS.forEach(e=>{
                  if (e.isCheck) {
                    sysRoleIds.push(e.idSysRole);
                  }
                });
              }
              that.userAdd.sysRoleIds = sysRoleIds.length ? sysRoleIds[0] : ""; // 第一个角色

              // 头像
              this.userAdd.userIcon && fileDetail(this.userAdd.userIcon).then(res=>{
                this.imageUrl=this.baseImgUrl +res.data.imgSourceCompress;
              })

              // 场馆
              res.data.operateVenueVOList.map(e=>{
                veunIds.push(e.idVenue);
                veunNames.push(e.venueName);
              })
              that.venueIds = veunIds;
              that.venueNames = veunNames.join(',');
              that.defaultExpandedKeys = veunIds;

              // 根据平台类型获取用户属性列表
              this.visibleChangeAttribute();
            }
          })
        })
        // 列表行的id
        this.rowId = row.id;
        this.userAddDialog = true;
        // 得到角色 同步
      },
      //新增、编辑确定按钮
      saveUserAdd(formName) {
        let userAddParams = JSON.parse(JSON.stringify(this.userAdd));
        userAddParams.sysRoleIds = userAddParams.sysRoleIds ? [userAddParams.sysRoleIds] : [];

        this.$refs[formName].validate(valid => {
          if (valid) {
            //如果通过验证 to do...
            if (this.dialogTitleType == "add") {
              exitUser(this.userAdd.userAccount).then(res => {
                if (res.data == true) {
                  this.$message({
                    message: '用户已存在',
                    type: 'warning'
                  });
                } else {
                  let params = {sysUserDTO: userAddParams,venueIds:this.venueIds};
                  userAdd(params).then(r => {
                      this.$message({
                        message: '添加成功',
                        type: 'success'
                      });
                      this.getMenuData();
                      this.userAddDialog = false;

                      this.$nextTick(()=>{
                        this.$refs[this.userAdd].resetFields();
                        this.$refs[this.userAdd].clearValidate(); //移除校验结果
                      })
                      this.$refs.tree2.setCheckedKeys([]);
                      this.imageUrl='';
                  })
                }
              })

            } else {
              // 根据列表行id,查找数据Id
              let params = {sysUserDTO: userAddParams,venueIds:this.venueIds};
              reviseUser(this.rowId, params).then(res => {
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                });
                this.getMenuData();
                this.userAddDialog = false;
                this.imageUrl='';
              })
            }

          } else {
            return false
          }
        })
      },

      //取消按钮
      cancelUserAdd(formName) {
        this.userAddDialog = false;
        this.$refs[formName].resetFields();
        this.$refs[formName].clearValidate(); //移除校验结果
        this.imageUrl='';
      },
      //分页
      goSpecifiedPage(val) {
        this.searchForm.pageNum = val;
        this.getMenuData();
      },
      //查询
      onSubmit() {
        this.searchForm.pageNum = 1;
        this.getMenuData();
      },



      //用户类型获取
      getUserTypeEnum(){
        let that = this;
        getUserTypeEnum().then(res=>{
            if(res.code == 200){
              that.userTypeList = res.data.map(e=>{
                e.name = e.message;
                e.id = e.code;
                e.key = 'usertypelist' + e.code;
                return e;
              })
            }
        })
      },

      //用户类型获取
      getUserAttributeEnum(){
        let that = this;
        getUserAttributeEnum().then(res=>{
            if(res.code == 200){
              that.userAttributeEnumList = res.data.map(e=>{
                e.name = e.message;
                e.id = e.code;
                e.key = 'userattribute' + e.code;
                return e;
              });
              that.userAttributeEnumLists = that.userAttributeEnumList;
            }
        })
      },

      //获取关联场馆
      getVenueData(){
        getVenueData({examineStatus:1,publishStatus:1}).then(res=>{
          this.venueIdTreeData = outputTree(res.data,null,'venueNum');
        })
      },

      // 重置密码
      revisePas(userId) {
        this.$confirm('是否确认重置密码？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          revisePas(userId).then(res => {
            if (res.code = 200) {
              this.$message({
                message: '密码重置成功',
                type: 'success'
              });
            }
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置密码'
          });
        })

      },

      handleCheckChange(){
        let res = this.$refs.tree2.getCheckedNodes();
        let names=[],ids=[]
        res.forEach((item) => {
          names.push(item.name)
          ids.push(item.id)
        });
        this.venueIds = ids;
        this.venueNames =   names.join('，');
      },

      //重置
      reset(){
        this.$refs['searchForm'].resetFields();
        this.getMenuData();
      },

      // 图片
      handleAvatarSuccess(res, file){
        this.imageUrl = URL.createObjectURL(file.raw);
        this.userAdd.userIcon=res.data.id;
      },
      beforeAvatarUpload(file){
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type ===
          'image/png');
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 jpeg/jpg/png 格式！');
        }
        const isLt4M = file.size / 1024 / 1024 < 4;
        if (!isLt4M) {
          this.$message.error('上传头像图片大小不能超过 4MB!');
        }
        return isJPG && isLt4M;

      },

      userChange(code){
        this.userAdd.attribute='';
        let list = [];
        this.userAttributeEnumLists.forEach(e=>{
          if(code == 0){
            e.id == 3 && (list = list.concat(e))
          }else{
            e.id != 3 && (list = list.concat(e))
          }
        })
        this.userAttributeEnumList = list;
        // console.log(this.userAttributeEnumList);

        this.userAdd.sysRoleIds = '';
      }

    },
    created() {
      this.getVenueData();
      this.getUserTypeEnum();
      this.getUserAttributeEnum();
      this.getMenuData();
    },
    mounted() {
      document.addEventListener('click', (e) => {
        if (e.target.id === 'venueId') {
          this.venueIdsShow = true
        } else {
          this.venueIdsShow = false
        }
      }, false);
    },

  };
</script>

<style lang="scss">
  .add-user_form{
    .block{
      width: 100% !important;
      .el-form-item__content{
        width: 550px!important;
      }
    }
  }

  .treeBox {
    border: 1px solid #C0C4CC;
    position: absolute;
    top: 33px;
    left: 0;
    z-index: 1000;
    border-radius: 4px;
    overflow:auto;
    background:#fff;
  }

  .userAddtreeBox {
    border: 1px solid #C0C4CC;
    position: absolute;
    top: 41px;
    left: 0;
    z-index: 1000;
    border-radius: 4px;
    overflow:auto;
    background:#fff;
  }
  .bmBox {
    position: relative;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
  .el-upload__tip {
    font-size: 12px;
    color: #C0C4CC;
  }
.ava .avatar-uploader{
  line-height:0 !important;
}

</style>
