<template>
  <section class="view-container">

    <el-form class="search-form" ref="searchForm" :model="searchForm" :inline="true" size="small" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="searchForm.roleName" clearable placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="onSubmit" native-type="submit"><i class="fa fa-search fa-fw"></i>查询</el-button>
        <el-button @click="resetSearchForm"><i class="fa fa-repeat fa-fw"></i>重置</el-button>
      </el-form-item>
    </el-form>
    <section class="list-wraper">
      <el-row class="btn-wraper">
        <el-button v-if="hasButton('config_role_add')"  size="small" type="primary" @click="addRole"><i class="fa fa-plus fa-fw"></i>新增角色</el-button>
      </el-row>
      <el-row class="table-wraper">
        <template>
          <el-table style="width: 100%;" stripe border :data="tableData"  ref="multipleTable" @selection-change="">
            <el-table-column
              type="selection"
              width="40">
            </el-table-column>
<!--            <el-table-column-->
<!--              sortable-->
<!--              prop="id"-->
<!--              label="角色编码">-->
<!--            </el-table-column>-->
            <el-table-column
              sortable
              prop="roleName"
              label="名称">
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注">
            </el-table-column>
            <el-table-column label="操作" width="350">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  v-if="hasButton('config_role_edit')"
                  @click="handleEdit(scope.$index, scope.row)"><i class="fa fa-pencil"></i>&nbsp;编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  v-if="hasButton('config_role_delete')"
                  @click="handleDelete(scope.$index, scope.row)"><i class="fa fa-trash-o"></i>&nbsp;删除</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  v-if="hasButton('config_role_empower')"
                  @click="handleEmpower(scope.$index, scope.row)"><i class="fa fa-pencil"></i>&nbsp;授权</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  v-if="hasButton('config_role_bindApp')"
                  @click="handleBindApp(scope.row)"><i class="fa fa-pencil"></i>绑定应用</el-button>
              </template>
            </el-table-column>
          </el-table>
          <page-temp :total="total" :pageSize="searchForm.pageSize" :currentPage="searchForm.pageNum" @goSpecifiedPage="goSpecifiedPage" />
        </template>
      </el-row>
    </section>
    <!--新增 编辑 dialog-->
    <el-dialog :visible.sync="showDialog" :title="dialogFlag==1?'新增角色':'修改角色'" width="580px" :close-on-click-modal="false" :append-to-body='true'>
        <el-form ref="roleForm" :rules="roleRules" class="dialog-form" label-position="right" :model="roleForm" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="roleForm.roleName" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="roleForm.remark" type="textarea" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>

    <!--权限树形-->
    <el-dialog :visible.sync="showTreeDialog" title="授权" width="580px" :close-on-click-modal="false" :append-to-body='true'>
      <el-scrollbar class="tree-scroll">
        <el-tree
          ref="tree"
          :data="menuData"
          :props="defaultProps"
          node-key="id"
          default-expand-all
          show-checkbox
          check-strictly
          @check="checkTreeChange"
          :default-checked-keys="defaultChecked">
        <span class="custom-tree-node clearfix" slot-scope="{ node, treeData }">
            <span :class="{fl:true}"><i :class="node.data.menuIcon" v-if="node.data.menuIcon"></i>&nbsp;{{ node.label }}</span>
        </span>
        </el-tree>
      </el-scrollbar>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showTreeDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmTree">确 定</el-button>
      </div>
    </el-dialog>

    <!--绑定应用-->
    <BindApplicationDialog type="role" :id="currentRoleId" :show.sync="dialogAppShow"></BindApplicationDialog>
  </section>
</template>

<script>
  import { deleteRole,sysMenuList,getRoleData,getMenuData,createRole,reviseRole,relateMenu } from '@/api/config.js'
  import BindApplicationDialog from '@/views-common/components/BindApplicationDialog.vue'
  import PageTemp from '@/components/PageTemp'

  import {mapGetters} from 'vuex'
  import {outputTree} from '@/utils/common.js'
  export default {
    data(){
      return{
        //角色列表 的检索条件
        searchForm:{
          pageNum:1,
          pageSize:10,
          roleName:'',
          roleStatus:''
        },
        tableData: [],
        total:0, //总 条数
        reviseId:'',//修改的 id

        dialogFlag:1, //新增=1 修改=2
        showDialog:false,//新增 修改 dialog 是否显示
        roleForm:{
          roleName:'',
          roleStatus:1,
          remark:''
        },
        roleRules:{
          roleName:[
            { required: true, message: '请输入角色名字'}
          ],
          remark:[
            { required: true, message: '请输入备注'}
          ]
        },

        //tree
        showTreeDialog:false,//树形是否展示
        menuData:[],
        defaultProps: {
          children: 'children',
          label: 'menuName'
        },
        defaultChecked:[],//默认选择
        checkStrictly:true,


        /*绑定应用*/
        dialogAppShow: false,
        currentRoleId: ''
      }
    },
    computed:{
      ...mapGetters(['resource','userInfo'])
    },
    components:{BindApplicationDialog,PageTemp},
    methods:{
      // 绑定
      handleBindApp(row){
        this.currentRoleId = row.id
        this.dialogAppShow = true;
      },
      //checkTreeChange(node,isChecked,isChildChecked){
      checkTreeChange(node,checked){
        let checkedNodes = checked.checkedNodes;
        checkedNodes.forEach(i=>{
          i.parentId && this.$refs.tree.setChecked(i.parentId,true);
        })
        /*let allChecked = this.$refs.tree.getCheckedKeys();
        let newAllChecked = [];
        let allChild = [];
        if(node.children && node.children.length){
          allChild = node.children.map(i=>{
            return i.id;
          })
        };
        // console.log(node)
        // console.log(isChecked)
        // console.log(isChildChecked)

        if (isChecked) {
          if (node.parentId && allChecked.indexOf(node.parentId)===-1) {
            allChecked.push(node.parentId);
          };
          newAllChecked = JSON.parse(JSON.stringify(allChecked))
        }else{
          allChecked.forEach(i=>{
            if (allChild.indexOf(i)!==-1){
              newAllChecked.push(i)
            }
          })
        };
        this.setDefaultChecked(newAllChecked)*/
      },
      setDefaultChecked(allChecked){
        this.$refs.tree.setCheckedKeys(allChecked)
      },
      //重置
      resetSearchForm(){
        this.searchForm.pageNum = 1;
        this.searchForm.roleName = '';
        this.getRoleData();
      },
      //新增
      addRole(){
        this.roleForm.roleName = '';
        this.roleForm.remark = '';
        this.reviseId = '';
        this.dialogFlag = 1;
        this.showDialog = true;
      },
      //修改
      handleEdit(index,row){
        this.roleForm.roleName = row.roleName;
        this.roleForm.remark = row.remark;
        this.reviseId = row.id;
        this.dialogFlag = 2;
        this.showDialog = true;
      },
      //删除
      handleDelete(index,row){
        let self = this;
        this.commonDeleteDialog(id=>{
          deleteRole(id).then(res=>{
            self.$message.success('删除成功');
            self.getRoleData();
          })
        },row.id,"删除该角色")
      },
      //授权
      handleEmpower(index,row){
        let self = this;
        self.checkStrictly = true;//关闭 父子不互相关联
        self.defaultChecked = [];
        self.reviseId = row.id;
        sysMenuList(row.id).then(res=>{
          res.data.forEach((e,i)=>{
            if(e.isSelect){
              self.defaultChecked.push(e.id);
            }
          });
          self.showTreeDialog = true;
            if(self.$refs.tree){ //赋值已选中的
              self.$refs.tree.setCheckedKeys(self.defaultChecked);
            }
           self.$nextTick(()=>{ //开启 父子不互相关联
              self.checkStrictly = false;
            })
        });
      },
      //获取列表
      getRoleData(){
        getRoleData(this.searchForm).then(res=>{
          this.tableData = res.data.result;
          this.total = res.data.totalPages
        })
      },
      //获取权限列表
      getMenuData(){
        getMenuData().then(res=>{
            this.menuData = outputTree(res.data,null,'menuSort');
        })
      },
      //分页
      goSpecifiedPage(val){
        this.searchForm.pageNum = val;
        this.getRoleData();
      },
      //查询
      onSubmit(){
        this.searchForm.pageNum = 1;
        this.getRoleData();
      },
      //确认新增修改
      confirm(){
        let self = this;
        this.$refs['roleForm'].validate(valid => {
          if(valid){
            if(self.dialogFlag == 1){
              // 新增成功
              createRole(this.roleForm).then(res => {
                self.showDialog = false;
                self.$message.success('新增成功');
                self.searchForm.pageNum = 1;
                self.getRoleData();
              });
            }else{
              reviseRole(this.reviseId,this.roleForm).then(res => {
                self.showDialog = false;
                self.$message.success('编辑成功');
                self.getRoleData();
              })
            }

          }
        })
      },
      //确认授权
      confirmTree(){
        let self = this;
        let keys = self.$refs.tree.getHalfCheckedKeys().concat(self.$refs.tree.getCheckedKeys());
        let queryTree = {
          id:self.reviseId,
          sysMenuIds:keys.join(',')
        };
        relateMenu(queryTree).then(res => {
          self.showTreeDialog = false;
          self.$message.success('授权成功');
        })
      },
    },
    created() {
      this.getRoleData();
      // 超管获取所有资源，管理员获取其被分配的菜单菜单
      if (this.userInfo.userAccount === 'super'){
        this.getMenuData();
      } else{
        this.menuData = this.resource.resourceTree
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>
